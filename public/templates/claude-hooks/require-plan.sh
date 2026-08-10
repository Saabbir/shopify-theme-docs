#!/usr/bin/env bash
# PreToolUse(Write|Edit) — "no theme code before the plan is approved".
#
# Only active while a /figma-to-feature run is in progress, i.e. while
# .sol-workflow/ACTIVE exists. Outside a workflow run this hook is a no-op,
# so normal hand-editing of the theme is never blocked.
#
# Blocks writes to sections/ blocks/ snippets/ assets/ until the run's
# plan.md carries "Status: approved".

set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
ACTIVE="$ROOT/.sol-workflow/ACTIVE"

# Not in a workflow run -> allow everything.
[ -f "$ACTIVE" ] || exit 0

INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | node -e '
  let s="";
  process.stdin.on("data",d=>s+=d).on("end",()=>{
    try { process.stdout.write(JSON.parse(s).tool_input?.file_path ?? ""); }
    catch { process.stdout.write(""); }
  });
' 2>/dev/null)

[ -n "$FILE_PATH" ] || exit 0

# Normalise to a repo-relative path.
REL="${FILE_PATH#"$ROOT"/}"

# Only guard theme component directories.
case "$REL" in
  sections/*|blocks/*|snippets/*|assets/*) ;;
  *) exit 0 ;;
esac

HANDLE=$(tr -d '[:space:]' < "$ACTIVE")
PLAN="$ROOT/.sol-workflow/$HANDLE/plan.md"

if [ -f "$PLAN" ] && grep -qiE '^[[:space:]]*(\*\*)?Status(\*\*)?:[[:space:]]*approved' "$PLAN"; then
  exit 0
fi

cat >&2 <<EOF
BLOCKED: no approved plan for this /figma-to-feature run.

  Tried to write : $REL
  Expected plan  : .sol-workflow/$HANDLE/plan.md  (with "Status: approved")

Write the plan, present it to the user, and only after they approve it set
"Status: approved" in the plan front matter. Then retry this write.

To leave the workflow entirely, delete .sol-workflow/ACTIVE.
EOF
exit 2
