# CLAUDE.md

@AGENTS.md

Everything Claude Code needs is in `AGENTS.md` (imported above via Claude Code's native `@file` import syntax) — that file is this repo's single source of truth, shared with Cursor and GitHub Copilot too. Do not duplicate its content here; add Claude-Code-*only* notes below if you ever need them.

## Claude-Code-specific notes

- Custom slash commands for this repo live in `.claude/commands/` — see [Claude Code Custom Commands](https://your-handbook-url/ai-assisted-development/claude-code-custom-commands/) for what's available and how to add more.
- If you edit `AGENTS.md`, also run `node scripts/generate-ai-rules.mjs` before committing, so Cursor's and Copilot's rule files stay in sync. This file (`CLAUDE.md`) needs no regeneration — the `@AGENTS.md` import always reads the current version.
