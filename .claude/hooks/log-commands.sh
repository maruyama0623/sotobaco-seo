#!/bin/bash
set -euo pipefail

# 実行された Bash コマンドをログに記録する

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -n "$COMMAND" ]; then
  LOG_DIR="$CLAUDE_PROJECT_DIR/.claude/logs"
  mkdir -p "$LOG_DIR"

  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$TIMESTAMP] $COMMAND" >> "$LOG_DIR/command-log.txt"
fi
exit 0
