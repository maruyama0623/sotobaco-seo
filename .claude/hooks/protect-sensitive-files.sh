#!/bin/bash
set -euo pipefail

# 機密ファイルの編集をブロックする

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# ファイル名のみ取得
FILENAME=$(basename "$FILE_PATH")

PROTECTED_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  ".env.staging"
  ".dev.vars"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILENAME" == "$pattern" ]]; then
    echo "機密ファイルの編集をブロックしました: $FILENAME はAPIキー・シークレットを含む可能性があります。編集が必要な場合は社長に確認してください。" >&2
    exit 2
  fi
done
exit 0
