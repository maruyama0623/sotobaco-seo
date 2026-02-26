#!/bin/bash
set -euo pipefail

# セッション開始時に自動で git pull を実行する
cd "$CLAUDE_PROJECT_DIR"

# リモートとの差分があれば pull（fast-forward のみ）
if git fetch --quiet 2>/dev/null; then
  LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "")
  REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
  if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    git pull --ff-only 2>/dev/null || true
    echo "git pull を実行しました（リモートに更新がありました）"
  fi
fi
exit 0
