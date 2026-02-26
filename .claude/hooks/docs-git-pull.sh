#!/bin/bash
set -euo pipefail

# docs/*.md を編集する前に自動で git pull を実行する
# 学習システムが GitHub API で直接 docs を更新するため、最新を取得しないとコンフリクトする

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# docs/ 配下の .md ファイルのみ対象
if [[ "$FILE_PATH" == */docs/*.md ]]; then
  cd "$CLAUDE_PROJECT_DIR"
  if git fetch --quiet 2>/dev/null; then
    LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "")
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
      git pull --ff-only 2>/dev/null || true
      echo "docs編集前に git pull を実行しました"
    fi
  fi
fi
exit 0
