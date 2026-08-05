---
title: Claude Code Custom Commands
description: Turning a repeated prompt (like the Figma-to-code steps) into a single slash command.
---

Do you keep typing out the same multi-step instructions? Something like "build this from Figma, then check it, then fix it, then summarize"? If so, that's a sign it belongs in a **custom slash command**. Stop retyping it, and stop copying it from an old chat every time. Save it once, and you won't have to type it again.

## Rules vs. process: what goes in `AGENTS.md` vs. a command

These are two different kinds of things. Mixing them up is the most common mistake people make when they write a command.

| | `AGENTS.md` | A command (`.claude/commands/<name>.md`) |
|---|---|---|
| Holds | **Rules**: what correct code looks like, naming, schema rules, how we build things (`@theme`/`@app` targeting, `t:` locale keys, logical properties) | **Process**: the repeatable *steps* a task goes through (plan → build → check → fix → report) |
| Loaded | Always, every session, automatically | Only when you type `/command-name` |
| Changes when... | Our coding rules change | The *steps themselves* change, or you want it to hand off work differently |

A command should **point to** `AGENTS.md`, not repeat it or copy parts of it. [`/figma-to-liquid`](#the-three-commands-in-this-handbooks-templates)'s Stage 2 lists a few of the highest-stakes rules inline, as a quick reminder. But it says plainly that `AGENTS.md` is the real source of truth. The command is not a second copy of the rules that can quietly fall out of sync with the real one.

If you notice a command file collecting its own detailed coding rules that aren't in `AGENTS.md`, that's a sign those rules belong in `AGENTS.md`'s `## Custom rules` section instead (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)). That way, every task benefits from them, not just the one command that happened to mention them.

## What a custom command actually is

A Claude Code custom command is just a Markdown file. It can have optional YAML frontmatter, which is a block of settings at the top of the file. Save one at `.claude/commands/<name>.md`, and it becomes available as `/<name>` in any Claude Code session in this repo.

```
.claude/
  commands/
    figma-to-liquid.md    →  /figma-to-liquid
    theme-check-fix.md    →  /theme-check-fix
    pr-prep.md            →  /pr-prep
```

Project-level commands (`.claude/commands/`) are shared with the team through Git, and they only work in this repo. Personal commands (`~/.claude/commands/`) are yours alone, and they work across every project. These are useful for habits that aren't specific to Solis.

:::note[Commands and Skills are the same mechanism now]
Custom commands are now part of Claude Code's broader **Skills** system. A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy`, and they work the same way. Any `.claude/commands/` files you already have keep working, unchanged. The `commands/` form (a single file) is simpler, and it's what this handbook uses. Only reach for a full `skills/<name>/SKILL.md` folder if a command needs supporting files, like scripts or templates, alongside it, or if you want Claude to run it automatically without being asked.
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
| `description` | Shown when browsing `/`, the only thing a teammate sees before running it | No, but skip it and the command has no menu description |
| `argument-hint` | Shows what to type after the command name (e.g. `[figma-link] [section-name]`) | No |
| `allowed-tools` | Limits which tools Claude can use while running this command, for example restricting a review-only command to `Read` so it can't accidentally edit files | No, but a good idea for anything that shouldn't write files |
| `model` | Pins a specific model for this command | No |

`$ARGUMENTS` in the body gets replaced with whatever text follows the command name when you run it. For example, `/figma-to-liquid https://figma.com/... testimonials`.

## The three commands in this handbook's templates

| Command | Use it for | Download |
|---|---|---|
| `/figma-to-liquid` | The full plan → build → check → fix → document → report loop from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/), given a Figma link and a name. Despite the name, it's not section-only — Stage 1 decides whether the frame actually needs a section, a standalone block, or just a snippet | [figma-to-liquid.md](/templates/claude-commands/figma-to-liquid.md) |
| `/theme-check-fix` | Run `shopify theme check` and fix every issue it reports, one by one, with a log of what was fixed | [theme-check-fix.md](/templates/claude-commands/theme-check-fix.md) |
| `/pr-prep` | Check the current branch's changes against our rules and draft a PR description before opening a pull request | [pr-prep.md](/templates/claude-commands/pr-prep.md) |

Download all three into `.claude/commands/` at your repo root, then commit them. This is the same idea as the AI rule files. Check them in, so every teammate gets the same commands the moment they clone the repo.

## Deciding what deserves a command

Not every repeated prompt is worth turning into a command. A rough test:

| ✅ Good candidate for a command | ❌ Better left as a one-off prompt |
|---|---|
| A multi-step process you follow the same way every time (Figma → section, in that exact order) | A one-time task specific to today's work, unlikely to repeat |
| A process where skipping a step causes a real problem (skipping "check" before "report") | Something so simple that a command adds more overhead than it saves |
| Something a new teammate would otherwise have to be told verbally | An exploratory task where the steps genuinely change each time |

## Writing your own

1. Notice you've typed a similar multi-step instruction two or three times.
2. Write it as a `.claude/commands/<name>.md` file. Use plain instructions, the same as you'd type in chat, just saved for later.
3. Add `argument-hint` if the command needs input, like a link, a name, or a file path.
4. Add `allowed-tools` if the command should be limited. For example, a review command that must not edit files: `allowed-tools: Read, Grep, Glob`.
5. Test it once. If Claude interprets a step differently than you meant, adjust the instructions, then commit it.

## Best practices

- Keep rules in `AGENTS.md` and steps in the command. Point to the file for "what correct code looks like," and never fork a second copy of those rules into a command's instructions.
- Keep each command focused on one repeatable job. A command that tries to do five unrelated things is harder to trust, and harder to fix when one step needs adjusting.
- Restrict `allowed-tools` on anything meant to be read-only, like a review or check command, so it can't accidentally start editing files.
- Commit commands to `.claude/commands/` so the whole team benefits. Use personal `~/.claude/commands/` only for things that aren't specific to Solis.
- Update a command's instructions when the underlying process changes, for example if the Figma-to-code loop gains a new step. A stale command teaches the old process.

## Common mistakes

- **Repeating or forking coding rules inside a command**, instead of pointing to `AGENTS.md`. The copy inside the command silently falls out of sync the next time `AGENTS.md` is updated, and now the two disagree.
- **Writing a command as a vague summary**, like "build a section from Figma properly," instead of spelling out the actual steps. This produces the same inconsistent results as a vague chat prompt would.
- **Not restricting `allowed-tools`** on a command that's meant to be read-only, like `/pr-prep`. This leaves room for it to make edits you didn't want.
- **Keeping a useful command personal** (`~/.claude/commands/`) when it's actually specific to this project. The rest of the team would benefit from it being committed to the repo.

## Quick Reference

- Rules go in `AGENTS.md` (always loaded, "what correct code looks like"). Steps go in a command (manual `/trigger`, "what order to do things in"). A command points to `AGENTS.md`, and never forks its own copy of the rules.
- `.claude/commands/<name>.md` becomes `/<name>`. Project-level means committed and shared with the team. Personal (`~/.claude/commands/`) means yours only.
- Frontmatter fields: `description`, `argument-hint`, `allowed-tools`, `model`. All of them are optional.
- `$ARGUMENTS` inserts whatever follows the command name when you run it.
- Commands and Skills are the same underlying mechanism. A single-file command is the simpler option. Use a full `skills/<name>/SKILL.md` when you need supporting files.

## Commands vs. subagents

A command runs its instructions **inline**, right in your main conversation. That's good for a process you want to watch step by step. When the job is noisy, meaning it touches many files or takes many rounds of edits, or when it should run with deliberately limited tool access, a **subagent** is the better fit. A subagent runs in its own separate conversation and returns only a summary. See [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) for our `theme-check-fixer` subagent and a full comparison.

## Further Reading

- [Extend Claude with skills](https://code.claude.com/docs/en/slash-commands) (code.claude.com)
- [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) (the isolated-context alternative to a command, and how the two work together)
