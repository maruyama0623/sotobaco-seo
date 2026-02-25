export function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── PII Redaction ── */

/** メールアドレス・電話番号をマスクする */
export function stripPII(text: string): string {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[メール]")
    .replace(/0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{3,4}/g, "[電話番号]")
    .replace(/\d{2,4}-\d{2,4}-\d{3,4}/g, "[電話番号]");
}

/* ── Email Hashing ── */

/** メールアドレスをSHA-256ハッシュに変換（KVキー用） */
export async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ── Rate Limiting ── */

const RATE_LIMIT_WINDOW = 600; // 10 minutes in seconds
const RATE_LIMIT_MAX = 5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * IP単位の固定ウィンドウレート制限。
 * 超過時は 429 レスポンスを返し、それ以外は null を返す。
 */
export async function checkRateLimit(
  kv: KVNamespace,
  request: Request,
  headers: Record<string, string>
): Promise<Response | null> {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `rl:${ip}`;
  const now = Math.floor(Date.now() / 1000);

  const stored = await kv.get(key, "json") as RateLimitEntry | null;

  if (stored && now < stored.resetAt) {
    if (stored.count >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: "送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。" }),
        { status: 429, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }
    await kv.put(key, JSON.stringify({ count: stored.count + 1, resetAt: stored.resetAt }), {
      expirationTtl: stored.resetAt - now,
    });
  } else {
    await kv.put(key, JSON.stringify({ count: 1, resetAt: now + RATE_LIMIT_WINDOW }), {
      expirationTtl: RATE_LIMIT_WINDOW,
    });
  }

  return null;
}
