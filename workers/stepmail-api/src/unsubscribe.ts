import type { Env, EnrollmentRecord } from "./types";
import { KV_PREFIX, KV_TTL_SECONDS } from "./types";
import { hashEmail, verifyHmacToken } from "./utils";

/** GET /unsubscribe ハンドラ */
export async function handleUnsubscribe(
  url: URL,
  env: Env
): Promise<Response> {
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return htmlResponse("パラメータが不正です。", 400);
  }

  // HMAC署名検証
  const valid = await verifyHmacToken(
    env.UNSUBSCRIBE_SECRET,
    email.toLowerCase(),
    token
  );
  if (!valid) {
    return htmlResponse("無効なリンクです。", 403);
  }

  const emailHash = await hashEmail(email);
  const kvKey = `${KV_PREFIX}${emailHash}`;

  const stored = await env.STEPMAIL_KV.get(kvKey, "json") as EnrollmentRecord | null;
  if (!stored) {
    return htmlResponse("配信停止の処理が完了しました。", 200);
  }

  // unsubscribed フラグを更新
  stored.unsubscribed = true;
  await env.STEPMAIL_KV.put(kvKey, JSON.stringify(stored), {
    expirationTtl: KV_TTL_SECONDS,
  });

  return htmlResponse("配信停止の処理が完了しました。今後メールは配信されません。", 200);
}

/** シンプルなHTMLレスポンスを生成 */
function htmlResponse(message: string, status: number): Response {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>配信停止 | ソトバコポータル</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
      color: #333;
    }
    .card {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 400px;
      text-align: center;
    }
    h1 { font-size: 1.2rem; margin-bottom: 1rem; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ソトバコポータル</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
