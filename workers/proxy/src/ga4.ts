import type { Env } from './types';

// ---------------------------------------------------------------------------
// JWT + OAuth2 for Google Analytics Data API v1 (REST)
// ---------------------------------------------------------------------------

function base64url(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === 'string'
      ? new TextEncoder().encode(input)
      : input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : input;
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, '')
    .replace(/-----END [A-Z ]+-----/g, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function createSignedJWT(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const unsigned = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );

  return `${unsigned}.${base64url(signature)}`;
}

async function getAccessToken(env: Env): Promise<string> {
  // Try KV cache first
  const cached = await env.PAGE_CACHE.get('ga4:access_token');
  if (cached) return cached;

  const jwt = await createSignedJWT(
    env.GA_CLIENT_EMAIL,
    env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
  );

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OAuth2 token exchange failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Cache with 3500s TTL (< 3600s token lifetime)
  await env.PAGE_CACHE.put('ga4:access_token', data.access_token, {
    expirationTtl: 3500,
  });
  return data.access_token;
}

// ---------------------------------------------------------------------------
// GA4 Data API v1 REST
// ---------------------------------------------------------------------------

interface GA4Row {
  dimensions: string[];
  metrics: string[];
}

interface RunReportOptions {
  limit?: number;
  orderBys?: Array<{ metric: { metricName: string }; desc: boolean }>;
  dimensionFilter?: Record<string, unknown>;
}

export async function fetchGA4Report(
  env: Env,
  propertyId: string,
  dimensions: string[],
  metrics: string[],
  dateRanges: Array<{ startDate: string; endDate: string }>,
  options: RunReportOptions = {},
): Promise<GA4Row[]> {
  if (!env.GA_CLIENT_EMAIL || !env.GA_PRIVATE_KEY || !propertyId) return [];

  const accessToken = await getAccessToken(env);

  const body: Record<string, unknown> = {
    dimensions: dimensions.map((d) => ({ name: d })),
    metrics: metrics.map((m) => ({ name: m })),
    dateRanges,
    limit: options.limit || 50,
  };
  if (options.orderBys) body.orderBys = options.orderBys;
  if (options.dimensionFilter) body.dimensionFilter = options.dimensionFilter;

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA4 API error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    rows?: Array<{
      dimensionValues?: Array<{ value: string }>;
      metricValues?: Array<{ value: string }>;
    }>;
  };

  return (data.rows || []).map((row) => ({
    dimensions: (row.dimensionValues || []).map((d) => d.value),
    metrics: (row.metricValues || []).map((m) => m.value),
  }));
}
