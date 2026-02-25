import type { Env, LearningMeta } from "./types";
import { CATEGORY_LABELS } from "./types";
import { stripPII } from "./utils";
import { generateDocPatch, applyDocPatch, generateLearningSummary } from "./ai";
import { sendSlackMessage, buildLongTextBlocks } from "./slack";

const SERVICE_DOC_PATHS: Record<string, string> = {
  "sotobaco-portal": "docs/sotobaco-portal.md",
  btone: "docs/btone.md",
};

/** 「完了」ボタンブロック生成 */
export function buildCompleteButton(
  meta: LearningMeta
): Record<string, unknown> {
  return {
    type: "actions",
    block_id: "learning_actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "完了", emoji: true },
        style: "primary",
        action_id: "learning_complete",
        value: JSON.stringify(meta),
      },
    ],
  };
}

/** モーダルのブロック定義を生成 */
function buildModalBlocks(
  category?: string,
  issue?: string,
  policy?: string
): Array<Record<string, unknown>> {
  const serviceOptions = Object.entries(CATEGORY_LABELS).map(
    ([value, label]) => ({
      text: { type: "plain_text", text: label },
      value,
    })
  );

  const serviceElement: Record<string, unknown> = {
    type: "static_select",
    action_id: "service_value",
    placeholder: { type: "plain_text", text: "サービスを選択" },
    options: serviceOptions,
  };
  if (category && CATEGORY_LABELS[category]) {
    serviceElement.initial_option = {
      text: { type: "plain_text", text: CATEGORY_LABELS[category] },
      value: category,
    };
  }

  const issueElement: Record<string, unknown> = {
    type: "plain_text_input",
    action_id: "issue_text",
    multiline: true,
  };
  if (issue) {
    issueElement.initial_value = issue;
  } else {
    issueElement.placeholder = {
      type: "plain_text",
      text: "お客様が困っていたことを入力してください",
    };
  }

  const policyElement: Record<string, unknown> = {
    type: "plain_text_input",
    action_id: "policy_text",
    multiline: true,
  };
  if (policy) {
    policyElement.initial_value = policy;
  } else {
    policyElement.placeholder = {
      type: "plain_text",
      text: "ソトバコとしての対応方針を入力してください",
    };
  }

  return [
    {
      type: "input",
      block_id: "service_select",
      label: { type: "plain_text", text: "対象サービスは？" },
      element: serviceElement,
    },
    {
      type: "input",
      block_id: "issue_input",
      label: {
        type: "plain_text",
        text: "この問い合わせで困っていたことを要約すると？",
      },
      element: issueElement,
    },
    {
      type: "input",
      block_id: "policy_input",
      label: {
        type: "plain_text",
        text: "このお問い合わせに対してソトバコとしての方針は？",
      },
      element: policyElement,
    },
  ];
}

/** 「完了」ボタンクリック → ローディングモーダル表示（AI要約完了後に入力フィールドを表示） */
export async function handleLearningComplete(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<string | null> {
  const action = payload.actions?.[0];
  const meta: LearningMeta = JSON.parse(action?.value || "{}");

  const privateMeta = JSON.stringify({
    ...meta,
    actionChannel: payload.channel?.id,
    actionTs: payload.message?.ts,
  });

  // ローディングモーダルを即座に開く（入力フィールドなし・submitボタンなし）
  const res = await fetch("https://slack.com/api/views.open", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trigger_id: payload.trigger_id,
      view: {
        type: "modal",
        callback_id: "learning_modal_loading",
        title: { type: "plain_text", text: "学習データ登録" },
        close: { type: "plain_text", text: "キャンセル" },
        private_metadata: privateMeta,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":hourglass_flowing_sand: *AI要約を生成中です...*\nしばらくお待ちください。",
            },
          },
        ],
      },
    }),
  });

  const data = (await res.json()) as {
    ok: boolean;
    view?: { id: string };
  };
  return data.ok ? data.view?.id || null : null;
}

/** スレッドからコンテキストを取得 */
async function fetchThreadContext(
  env: Env,
  channel: string,
  threadTs: string
): Promise<string> {
  const res = await fetch(
    `https://slack.com/api/conversations.replies?channel=${channel}&ts=${threadTs}`,
    {
      headers: { Authorization: `Bearer ${env.SLACK_BOT_TOKEN}` },
    }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as { ok: boolean; messages?: Array<any> };
  if (!data.ok || !data.messages) return "";

  return data.messages
    .map((m) => {
      if (m.blocks) {
        return m.blocks
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((b: any) => b.type === "section" || b.type === "header")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((b: any) => {
            if (b.text?.text) return b.text.text;
            if (b.fields)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return b.fields.map((f: any) => f.text).join("\n");
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }
      return m.text || "";
    })
    .filter(Boolean)
    .join("\n---\n");
}

/** AI要約を生成してローディングモーダルを入力フィールド付きモーダルに差し替え */
export async function populateLearningModal(
  viewId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<void> {
  const action = payload.actions?.[0];
  const meta: LearningMeta = JSON.parse(action?.value || "{}");

  const privateMeta = JSON.stringify({
    ...meta,
    actionChannel: payload.channel?.id,
    actionTs: payload.message?.ts,
  });

  let issue = "";
  let policy = "";

  try {
    const context = await fetchThreadContext(
      env,
      meta.messageChannel,
      meta.threadTs
    );
    if (context) {
      const summary = await generateLearningSummary(env, stripPII(context));
      issue = summary.issue;
      policy = summary.policy;
    }
  } catch (err) {
    console.error("Learning summary generation error:", err);
  }

  // AI成功・失敗に関わらず、入力フィールド付きモーダルに差し替え
  // 入力フィールドはここで新規作成されるため initial_value が正しく機能する
  try {
    await fetch("https://slack.com/api/views.update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        view_id: viewId,
        view: {
          type: "modal",
          callback_id: "learning_modal",
          title: { type: "plain_text", text: "学習データ登録" },
          submit: { type: "plain_text", text: "登録" },
          close: { type: "plain_text", text: "キャンセル" },
          private_metadata: privateMeta,
          blocks: buildModalBlocks(meta.category, issue, policy),
        },
      }),
    });
  } catch (err) {
    console.error("Learning modal update error:", err);
  }
}

/** モーダル送信 → スレッド投稿 + AI更新 + GitHubコミット */
export async function handleLearningModalSubmit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<void> {
  const view = payload.view;
  const privateMeta = JSON.parse(view.private_metadata || "{}");
  const service =
    view.state?.values?.service_select?.service_value?.selected_option
      ?.value || "";
  const issue = view.state?.values?.issue_input?.issue_text?.value || "";
  const policy = view.state?.values?.policy_input?.policy_text?.value || "";

  const serviceLabel = CATEGORY_LABELS[service] || service;
  const threadTs: string = privateMeta.threadTs;

  // ① スレッドに学習データ投稿（Slack section は最大3000文字のため分割）
  const learningBlocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: ":books: 学習データ",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*対象サービス:*\n${serviceLabel}`,
        },
      ],
    },
    ...buildLongTextBlocks(`*困っていたこと:*\n${issue}`),
    ...buildLongTextBlocks(`*方針:*\n${policy}`),
  ];

  await sendSlackMessage(env, learningBlocks, threadTs);

  // 「完了」ボタンを「✅ 学習完了」に更新
  const updateButtonMessage = async (statusText: string) => {
    if (privateMeta.actionChannel && privateMeta.actionTs) {
      await fetch("https://slack.com/api/chat.update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: privateMeta.actionChannel,
          ts: privateMeta.actionTs,
          blocks: [
            {
              type: "context",
              elements: [{ type: "mrkdwn", text: statusText }],
            },
          ],
          text: statusText,
        }),
      });
    }
  };

  // 「その他」の場合はGitHub更新なし
  const docPath = SERVICE_DOC_PATHS[service];
  if (!docPath) {
    await updateButtonMessage(":white_check_mark: *学習完了*（スレッド記録のみ）");
    return;
  }

  // GITHUB_TOKEN未設定 → GitHub連携スキップ
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    await updateButtonMessage(":white_check_mark: *学習完了*（GitHub未設定のためスレッド記録のみ）");
    return;
  }

  // ② AI でパッチ生成 → docs/*.md に適用
  try {
    const { content: currentDoc, sha } = await getFileFromGitHub(
      env,
      docPath
    );

    let patch: { section: string; content: string } | null;
    try {
      patch = await generateDocPatch(env, currentDoc, issue, policy);
    } catch (err) {
      console.error("AI patch error:", err);
      await sendSlackMessage(
        env,
        [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: ":warning: AI更新に失敗しました。学習データはスレッドに記録済みです。",
              },
            ],
          },
        ],
        threadTs
      );
      await updateButtonMessage(":white_check_mark: *学習完了*（AI更新失敗）");
      return;
    }

    // AI が変更不要と判断
    if (!patch) {
      await sendSlackMessage(
        env,
        [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: ":information_source: ドキュメントの更新は不要と判断されました",
              },
            ],
          },
        ],
        threadTs
      );
      await updateButtonMessage(":white_check_mark: *学習完了*（更新不要）");
      return;
    }

    const updatedDoc = applyDocPatch(currentDoc, patch);

    // ③ GitHub API でコミット
    try {
      const commitMessage = `docs: ${serviceLabel}のドキュメントを更新（学習データ反映）\n\n困っていたこと: ${issue.slice(0, 100)}\n方針: ${policy.slice(0, 100)}`;
      await commitFileToGitHub(env, docPath, updatedDoc, sha, commitMessage);

      await sendSlackMessage(
        env,
        [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `:github: \`${docPath}\` を更新しました（develop ブランチ）`,
              },
            ],
          },
        ],
        threadTs
      );
      await updateButtonMessage(":white_check_mark: *学習完了*");
    } catch (err) {
      console.error("GitHub commit error:", err);
      await sendSlackMessage(
        env,
        [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: ":warning: GitHubコミットに失敗しました。学習データはスレッドに記録済みです。",
              },
            ],
          },
        ],
        threadTs
      );
      await updateButtonMessage(":white_check_mark: *学習完了*（コミット失敗）");
    }
  } catch (err) {
    console.error("GitHub read error:", err);
    await sendSlackMessage(
      env,
      [
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":warning: GitHubからのファイル読み取りに失敗しました。学習データはスレッドに記録済みです。",
            },
          ],
        },
      ],
      threadTs
    );
    await updateButtonMessage(":white_check_mark: *学習完了*（GitHub読み取り失敗）");
  }
}

/** GitHub Contents API でファイル読み取り */
export async function getFileFromGitHub(
  env: Env,
  filePath: string
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}?ref=develop`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "sotobaco-support-api",
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

/** GitHub Contents API でコミット */
async function commitFileToGitHub(
  env: Env,
  filePath: string,
  content: string,
  sha: string,
  message: string
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
        "User-Agent": "sotobaco-support-api",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encoded,
        sha,
        branch: "develop",
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub commit error: ${res.status} ${errorText}`);
  }
}
