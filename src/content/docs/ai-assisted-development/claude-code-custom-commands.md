---
title: 8e. Claude Code Custom Commands
description: Turning repetitive prompts (like the Figma-to-code loop) into a single slash command.
---

If you find yourself typing out the same multi-step instructions repeatedly — "build this from Figma, then check, then fix, then summarize" — that's a sign it belongs in a **custom slash command**, not a prompt you retype (or copy from an old chat) every time.

## What a custom command actually is

A Claude Code custom command is a Markdown file with optional YAML frontmatter. Save one at `.claude/commands/<name>.md` and it becomes available as `/<name>` in any Claude Code session in this repo.

```
.claude/
  commands/
    figma-to-section.md   →  /figma-to-section
    theme-check-fix.md    →  /theme-check-fix
    pr-prep.md            →  /pr-prep
```

Project-level commands (`.claude/commands/`) are shared with the team via Git and only available in this repo. Personal commands (`~/.claude/commands/`) are yours alone, across every project — useful for habits that aren't Solis-specific.

:::note[Commands and Skills are the same mechanism now]
Custom commands have been merged into Claude Code's broader **Skills** system. A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way — existing `.claude/commands/` files keep working unchanged. The `commands/` form (a single file) is the simpler option and is what this handbook uses; reach for a full `skills/<name>/SKILL.md` directory only if a command needs supporting files (scripts, templates) alongside it, or you want Claude to invoke it automatically without being asked.
:::

## Anatomy of a command file

```markdown
---
description: Short summary shown in the / command menu
argument-hint: [figma-link] [section-name]
allowed-tools: Read, Write, Edit, Bash(shopify theme check:*)
---

The actual instructions Claude follows when this command runs.
Reference $ARGUMENTS to insert whatever the user typed after the command name.
```

| Frontmatter field | What it does | Required? |
|---|---|---|
| `description` | Shown when browsing `/` — the only thing a teammate sees before running it | No, but skip it and the command has no menu description |
| `argument-hint` | Documents what to type after the command name (e.g. `[figma-link] [section-name]`) | No |
| `allowed-tools` | Restricts which tools Claude can use while running this command — e.g. limit a review-only command to `Read` so it can't accidentally edit files | No, but recommended for anything that shouldn't write |
| `model` | Pin a specific model for this command | No |

`$ARGUMENTS` in the body is replaced with whatever text follows the command name when it's invoked (`/figma-to-section https://figma.com/... testimonials`).

## The three commands in this handbook's templates

| Command | Use it for | Download |
|---|---|---|
| `/figma-to-section` | The full plan → build → check → fix → report loop from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/), given a Figma link and a section name | [figma-to-section.md](/templates/claude-commands/figma-to-section.md) |
| `/theme-check-fix` | Run `shopify theme check` and resolve every offense it reports, one by one, with a fix log | [theme-check-fix.md](/templates/claude-commands/theme-check-fix.md) |
| `/pr-prep` | Check the current branch's diff against our conventions and draft a PR description before opening a pull request | [pr-prep.md](/templates/claude-commands/pr-prep.md) |

Download all three into `.claude/commands/` at your repo root and commit them — same principle as the AI rule files: check them in so every teammate gets the same commands the moment they clone the repo.

## Deciding what deserves a command

Not every repeated prompt is worth turning into a command. A rough test:

| ✅ Good candidate for a command | ❌ Better left as a one-off prompt |
|---|---|
| A multi-stage process you follow the same way every time (Figma → section, in that exact order) | A one-time task specific to today's work, unlikely to repeat |
| A process where skipping a stage causes a real problem (skipping "check" before "report") | Something so simple a command adds more overhead than it saves |
| Something a new teammate would otherwise have to be taught verbally | An exploratory task where the steps genuinely vary each time |

## Writing your own

1. Notice you've typed a similar multi-step instruction two or three times.
2. Write it as a `.claude/commands/<name>.md` file — plain instructions, same as you'd type in chat, just saved.
3. Add `argument-hint` if the command needs input (a link, a name, a file path).
4. Add `allowed-tools` if the command should be restricted (e.g. a review command that must not edit files: `allowed-tools: Read, Grep, Glob`).
5. Test it once, refine the instructions if Claude interprets a stage differently than intended, commit it.

## Best practices

- Keep each command focused on one repeatable job — a command that tries to do five unrelated things is harder to trust and harder to fix when one stage needs adjusting.
- Restrict `allowed-tools` on anything read-only in intent (a review/check command) so it can't accidentally start editing files.
- Commit commands to `.claude/commands/` so the whole team benefits, not just personal `~/.claude/commands/` for anything Solis-specific.
- Revisit a command's instructions when the underlying process changes (e.g. if the Figma-to-code loop gains a new stage) — a stale command teaches the old process.

## Common mistakes

- **Writing a command as a vague summary** ("build a section from Figma properly") instead of the actual explicit stages — this produces the same inconsistent results as a vague chat prompt would.
- **Not restricting `allowed-tools`** on a command that's meant to be read-only (like `/pr-prep`), leaving room for it to make unintended edits.
- **Keeping a useful command personal** (`~/.claude/commands/`) when it's actually project-specific and the rest of the team would benefit from it being committed to the repo.

## Quick Reference

- `.claude/commands/<name>.md` → `/<name>`. Project-level = committed, team-shared. Personal (`~/.claude/commands/`) = yours only.
- Frontmatter: `description`, `argument-hint`, `allowed-tools`, `model` — all optional.
- `$ARGUMENTS` inserts whatever follows the command name when invoked.
- Commands and Skills are the same underlying mechanism — a single-file command is the simpler option; use a full `skills/<name>/SKILL.md` when supporting files are needed.

## Further Reading

- [Extend Claude with skills](https://code.claude.com/docs/en/slash-commands) — code.claude.com
