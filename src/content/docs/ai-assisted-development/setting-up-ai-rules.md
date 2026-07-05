---
title: 5a. Setting Up AI Rules
description: Ready-to-use rule files for Cursor, Claude Code, and GitHub Copilot.
---

Different AI tools read rules from different files, but they should all enforce the *same* standard. We maintain one shared understanding, mirrored into each tool's expected format, so it doesn't matter which tool a teammate prefers — the output is consistent.

## Cursor: `.cursor/rules/*.mdc`

Cursor's current recommended format is a directory of `.mdc` files (the older single `.cursorrules` file still works, but is being phased out). Each file targets a specific concern and only loads when relevant:

- [`00-project-context.mdc`](/templates/cursor-rules/00-project-context.mdc) — always loaded, project-wide constraints.
- [`01-liquid-and-schema.mdc`](/templates/cursor-rules/01-liquid-and-schema.mdc) — loads when editing `.liquid` files.
- [`02-css-and-js.mdc`](/templates/cursor-rules/02-css-and-js.mdc) — loads when editing CSS/JS.

Copy all three into `.cursor/rules/` at your theme repo's root and commit them — that's how the whole team gets the same behavior.

If you're on an older Cursor version without `.mdc` support, use the [legacy single-file version](/templates/legacy-cursorrules.txt) as `.cursorrules` instead.

## Claude Code: `CLAUDE.md`

Claude Code reads a `CLAUDE.md` file at your repo root automatically. [Download the template](/templates/CLAUDE.md) and drop it in.

## GitHub Copilot: `.github/copilot-instructions.md`

Copilot reads repository-level custom instructions from this path. [Download the template](/templates/github/copilot-instructions.md).

## Keeping all three in sync

These three files say the same things in three formats. When a rule changes:

1. Update it in whichever file you're editing.
2. Copy the same change into the other two.
3. Note the change in your PR description so reviewers know rules changed, not just code.

:::tip
If your team grows past a handful of people, consider generating all three from one source file (a small script that reads one YAML/Markdown source and writes the three tool-specific formats) instead of manually keeping them in sync. Not necessary at our current size, but worth knowing as an option.
:::

## Quick Reference

- Cursor → `.cursor/rules/*.mdc` (three files, linked above).
- Claude Code → `CLAUDE.md` at repo root.
- Copilot → `.github/copilot-instructions.md`.
- All three encode the same rules — update together, not independently.

## Further Reading

- [Cursor rules documentation](https://cursor.com/docs/rules) — cursor.com
