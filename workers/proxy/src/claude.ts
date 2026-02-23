const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

interface CallClaudeOptions {
  apiKey: string;
  system: string;
  userMessage: string;
  maxTokens: number;
  jsonMode?: boolean;
}

export async function callClaude({
  apiKey,
  system,
  userMessage,
  maxTokens,
  jsonMode,
}: CallClaudeOptions): Promise<string> {
  const systemText = jsonMode
    ? `${system}\n\n重要: 必ずJSON形式のみで出力してください。説明文やマークダウンは含めず、JSONオブジェクトだけを返してください。`
    : system;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemText,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw Object.assign(new Error('AI request failed'), {
      status: 502,
      detail: body,
    });
  }

  const json = (await response.json()) as {
    content?: { text?: string }[];
  };
  return json?.content?.[0]?.text || '';
}
