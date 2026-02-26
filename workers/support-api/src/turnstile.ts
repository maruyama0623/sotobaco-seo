/**
 * Cloudflare Turnstile 検証ユーティリティ
 * checkRateLimit() と同じ Response | null パターン
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Turnstile トークンを検証する。
 * - null 返却 = 検証OK、処理続行
 * - Response 返却 = 検証NG、即座にレスポンス返却
 */
export async function verifyTurnstile(
  secretKey: string,
  token: string | undefined,
  remoteip: string,
  headers: Record<string, string>
): Promise<Response | null> {
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  if (!token) {
    return new Response(
      JSON.stringify({ error: "セキュリティ検証が必要です。ページを再読み込みしてお試しください。" }),
      { status: 400, headers: jsonHeaders }
    );
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", remoteip);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Turnstile API error: status", res.status);
      return new Response(
        JSON.stringify({ error: "セキュリティ検証サービスに接続できません。しばらく時間をおいてから再度お試しください。" }),
        { status: 503, headers: jsonHeaders }
      );
    }

    const result = await res.json() as { success: boolean; "error-codes"?: string[] };

    if (!result.success) {
      console.error("Turnstile verification failed:", result["error-codes"]?.join(", ") || "unknown");
      return new Response(
        JSON.stringify({ error: "セキュリティ検証に失敗しました。ページを再読み込みしてお試しください。" }),
        { status: 403, headers: jsonHeaders }
      );
    }

    return null;
  } catch (err) {
    console.error("Turnstile verification error");
    return new Response(
      JSON.stringify({ error: "セキュリティ検証サービスに接続できません。しばらく時間をおいてから再度お試しください。" }),
      { status: 503, headers: jsonHeaders }
    );
  }
}
