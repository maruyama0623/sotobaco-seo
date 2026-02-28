/** メールアドレスをSHA-256ハッシュに変換（KVキー用） */
export async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** メールアドレスの簡易バリデーション */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** HMAC-SHA256署名を生成（配信停止URL用） */
export async function generateHmacToken(
  secret: string,
  data: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC-SHA256署名を検証（タイミングセーフ） */
export async function verifyHmacToken(
  secret: string,
  data: string,
  token: string
): Promise<boolean> {
  const expected = await generateHmacToken(secret, data);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode("timing-safe-compare"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const [macA, macB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, encoder.encode(expected)),
    crypto.subtle.sign("HMAC", key, encoder.encode(token)),
  ]);
  const arrA = new Uint8Array(macA);
  const arrB = new Uint8Array(macB);
  let diff = 0;
  for (let i = 0; i < arrA.length; i++) {
    diff |= arrA[i] ^ arrB[i];
  }
  return diff === 0;
}
