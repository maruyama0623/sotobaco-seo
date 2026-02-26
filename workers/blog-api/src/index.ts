import type { Env } from "./types";
import { verifyHmac } from "./auth";
import { handleSync } from "./sync";
import { handlePublish, handleUnpublish } from "./publish";
import { handleScheduled } from "./scheduled";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Signature-Timestamp, X-Signature",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // HMAC署名検証
    const timestamp = request.headers.get("X-Signature-Timestamp") || "";
    const signature = request.headers.get("X-Signature") || "";
    const bodyText = await request.text();

    const valid = await verifyHmac(
      env.BLOG_WEBHOOK_SECRET,
      timestamp,
      bodyText,
      signature
    );
    if (!valid) {
      return jsonResponse({ error: "Invalid signature" }, 401);
    }

    const body = JSON.parse(bodyText);

    let response: Response;
    switch (url.pathname) {
      case "/sync":
        response = await handleSync(body, env);
        break;
      case "/publish":
        response = await handlePublish(body, env);
        break;
      case "/unpublish":
        response = await handleUnpublish(body, env);
        break;
      default:
        return jsonResponse({ error: "Not found" }, 404);
    }

    // ハンドラのレスポンスにCORSヘッダーを付与
    const newHeaders = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(handleScheduled(env));
  },
} satisfies ExportedHandler<Env>;
