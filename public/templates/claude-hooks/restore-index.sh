#!/usr/bin/env bash
# Stop / SessionStart — restore templates/index.json if a QA preview swap was
# left orphaned by an interrupted run.
#
# Live QA temporarily replaces templates/index.json so the section under test
# renders at http://127.0.0.1:9292/. If the session is interrupted mid-QA the
# real template would stay clobbered. This puts it back.

set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
BACKUP="$ROOT/.sol-workflow/.index-backup.json"
TARGET="$ROOT/templates/index.json"

if [ -f "$BACKUP" ]; then
  mv -f "$BACKUP" "$TARGET"
  echo "Restored templates/index.json from an orphaned QA preview backup." >&2
fi

exit 0
