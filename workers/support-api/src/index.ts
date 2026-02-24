import type { Env } from "./types";
import { corsHeaders } from "./utils";
import { handleContact } from "./contact";
import { handleReply } from "./reply";
import { handleFeedback } from "./feedback";
import { handleSlackInteraction } from "./slack";
import { handleScheduled } from "./scheduled";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const allowedOrigins = (env.CORS_ORIGIN || "https://sotobaco.com").split(",");
    const requestOrigin = request.headers.get("Origin") || "";
    const origin = allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0];
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Route by path
    if (url.pathname === "/slack/interact") {
      return handleSlackInteraction(request, env, ctx);
    }

    if (url.pathname === "/reply") {
      return handleReply(request, env);
    }

    if (url.pathname === "/feedback") {
      return handleFeedback(request, env, headers, ctx);
    }

    // Default: contact form handler
    return handleContact(request, env, headers, ctx);
  },

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(handleScheduled(env));
  },
} satisfies ExportedHandler<Env>;
