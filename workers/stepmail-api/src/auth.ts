/** HMAC-SHA256 + タイムスタンプ（5分以内）で検証 */
export async function verifyHmac(
  secret: string,
  timestamp: string,
  body: string,
  signature: string
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = `${timestamp}:${body}`;
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // タイミングセーフ比較（HMAC経由で固定長比較）
  const compareKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("timing-safe-compare"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const [macA, macB] = await Promise.all([
    crypto.subtle.sign("HMAC", compareKey, encoder.encode(computed)),
    crypto.subtle.sign("HMAC", compareKey, encoder.encode(signature)),
  ]);
  const arrA = new Uint8Array(macA);
  const arrB = new Uint8Array(macB);
  let diff = 0;
  for (let i = 0; i < arrA.length; i++) {
    diff |= arrA[i] ^ arrB[i];
  }
  return diff === 0;
}
