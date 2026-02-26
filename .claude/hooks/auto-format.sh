#!/bin/bash
set -euo pipefail

# ファイル編集後に prettier で自動フォーマットする（設定がある場合のみ）

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# prettier 設定ファイルが存在するか確認
HAS_PRETTIER=false
for config in ".prettierrc" ".prettierrc.json" ".prettierrc.js" "prettier.config.js" "prettier.config.mjs"; do
  if [ -f "$CLAUDE_PROJECT_DIR/$config" ]; then
    HAS_PRETTIER=true
    break
  fi
done

# package.json に prettier キーがあるか確認
if [ "$HAS_PRETTIER" = false ] && [ -f "$CLAUDE_PROJECT_DIR/package.json" ]; then
  if jq -e '.prettier' "$CLAUDE_PROJECT_DIR/package.json" >/dev/null 2>&1; then
    HAS_PRETTIER=true
  fi
done

if [ "$HAS_PRETTIER" = true ] && [ -n "$FILE_PATH" ]; then
  # 対象ファイルの拡張子を確認（コード系ファイルのみ）
  case "$FILE_PATH" in
    *.ts|*.tsx|*.js|*.jsx|*.css|*.scss|*.json|*.md|*.html)
      cd "$CLAUDE_PROJECT_DIR"
      npx prettier --write "$FILE_PATH" 2>/dev/null || true
      ;;
  esac
fi
exit 0
