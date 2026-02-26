import type { Env } from "./types";

const USER_AGENT = "sotobaco-blog-api";

/** GitHub Contents API でファイル読み取り */
export async function getFileFromGitHub(
  env: Env,
  filePath: string,
  branch = "develop"
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": USER_AGENT,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as {
    content: string;
    sha: string;
    encoding: string;
  };

  const decoded = atob(data.content.replace(/\n/g, ""));
  const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
  const content = new TextDecoder().decode(bytes);

  return { content, sha: data.sha };
}

/** GitHub Contents API でファイルコミット */
export async function commitFileToGitHub(
  env: Env,
  filePath: string,
  content: string,
  sha: string,
  message: string,
  branch = "develop"
): Promise<void> {
  const encoded = btoa(
    String.fromCharCode(...new TextEncoder().encode(content))
  );

  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encoded,
        sha,
        branch,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub commit error: ${res.status} ${errorText}`);
  }
}

/** GitHub Merge API で develop → main マージ */
export async function mergeDevelopToMain(
  env: Env,
  commitMessage: string
): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/merges`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base: "main",
        head: "develop",
        commit_message: commitMessage,
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub merge error: ${res.status} ${errorText}`);
  }
}

/** frontmatter の publishedAt を更新（正規表現） */
export function updatePublishedAt(markdown: string, date: string): string {
  if (date === "") {
    // 非公開：publishedAt を空にする
    return markdown.replace(
      /^(publishedAt:\s*)"[^"]*"/m,
      `$1""`
    );
  }
  return markdown.replace(
    /^(publishedAt:\s*)"[^"]*"/m,
    `$1"${date}"`
  );
}
