#!/bin/bash
set -euo pipefail

# 危険なコマンドをブロックする

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \."
  "git push --force"
  "git push -f "
  "git reset --hard"
  "git checkout -- \."
  "git clean -fd"
  "git branch -D main"
  "git branch -D master"
  "git branch -D develop"
  "> /dev/sda"
  "mkfs\."
  "dd if="
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if [[ "$COMMAND" == *"$pattern"* ]]; then
    echo "危険なコマンドをブロックしました: '$pattern' を含むコマンドは実行できません。社長に確認してください。" >&2
    exit 2
  fi
done
exit 0
