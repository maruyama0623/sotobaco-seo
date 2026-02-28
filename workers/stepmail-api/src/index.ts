import type { Env } from "./types";
import { verifyHmac } from "./auth";
import { handleEnroll } from "./enroll";
import { handleUnsubscribe } from "./unsubscribe";
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
    const workerUrl = `${url.protocol}//${url.host}`;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // GET /unsubscribe — 署名付きURL（HMAC認証不要）
    if (url.pathname === "/unsubscribe" && request.method === "GET") {
      return handleUnsubscribe(url, env);
    }

    // POST /enroll — HMAC認証必須
    if (url.pathname === "/enroll" && request.method === "POST") {
      const timestamp = request.headers.get("X-Signature-Timestamp") || "";
      const signature = request.headers.get("X-Signature") || "";
      const bodyText = await request.text();

      const valid = await verifyHmac(
        env.WEBHOOK_SECRET,
        timestamp,
        bodyText,
        signature
      );
      if (!valid) {
        return jsonResponse({ error: "Invalid signature" }, 401);
      }

      const body = JSON.parse(bodyText);
      return handleEnroll(body, env, ctx, workerUrl);
    }

    return jsonResponse({ error: "Not found" }, 404);
  },

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(handleScheduled(env));
  },
} satisfies ExportedHandler<Env>;
