---
title: 8h. Claude Code Subagents
description: A dedicated theme-check-fixer subagent, and the day-to-day workflow that ties skills, commands, and subagents together.
---

[Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) ships **skills** (auto-activate, Shopify's). [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) covers **commands** (manual `/trigger`, ours). This page covers the third mechanism — **subagents** — and pulls all three together into one day-to-day workflow.

## What a subagent actually is

A subagent is a specialized Claude Code assistant that runs in its **own, separate context window**, with its own system prompt and its own tool access, rather than running inline in your main conversation. Claude delegates to a subagent either automatically (when a task matches the subagent's `description` well enough) or when you explicitly ask for it by name. The subagent does its work — which might involve reading a dozen files, running commands, iterating on fixes — and returns only a summary to the main conversation. All the noisy intermediate output (file contents, command logs, failed attempts) stays inside the subagent's own context instead of filling up yours.

That's the specific problem a subagent solves that a command doesn't: a command (`/theme-check-fix`) runs its instructions **inline**, in your main conversation's context — useful for a quick, interactive fix-as-you-go session where you want to watch each step. A subagent runs the same kind of job **isolated**, which matters once the job is noisy (many offenses, many files) or something you want delegated automatically without typing a command at all.

Claude Code also ships several built-in subagents (`Explore`, `Plan`, `general-purpose`) that Claude uses automatically for research and multi-step tasks — you don't configure these, they're always available.

## Our subagent: `theme-check-fixer`

We have one project subagent so far, matching the exact job described in this section's title: run `shopify theme check`, fix every offense, report back.

[Download `theme-check-fixer.md`](/templates/claude-agents/theme-check-fixer.md) into `.claude/agents/` at your repo root:

```
.claude/
  agents/
    theme-check-fixer.md   →  delegates automatically, or via "use the theme-check-fixer agent"
  commands/
    theme-check-fix.md     →  /theme-check-fix (same job, runs inline)
```

```markdown
---
name: theme-check-fixer
description: Runs `shopify theme check` and fixes every reported offense, one at a time, consistent with this repo's AGENTS.md conventions. Use after generating or editing Liquid/JSON theme files, before opening a PR, or whenever asked to "clean up lint" / "fix theme check offenses."
tools: Read, Edit, Bash(shopify theme check:*)
model: inherit
---

You are a Shopify theme linting specialist for this repository...
[full process: run check → fix each offense per AGENTS.md conventions →
log each fix → re-run to confirm clean → ask instead of guessing on
anything that implies a product decision → report the fix log]
```

Why both this subagent *and* the `/theme-check-fix` command exist, rather than picking one:

| | `/theme-check-fix` (command) | `theme-check-fixer` (subagent) |
|---|---|---|
| Runs in | Your main conversation | Its own isolated context window |
| Invoked | Manually, by typing `/theme-check-fix` | Automatically (Claude notices a matching task) or by name ("use the theme-check-fixer agent") |
| Best for | A quick, interactive pass you want to watch | A noisy job (many offenses) at the end of a longer task — e.g. Stage 4 of [`/figma-to-section`](/ai-assisted-development/claude-code-custom-commands/), which explicitly delegates its check → fix stage here instead of resolving offenses inline, without spamming your main context with every offense's file content |
| Tool access | Whatever your session already has | Explicitly scoped to `Read, Edit, Bash(shopify theme check:*)` — can't touch anything else, even if your session has broader access |

Both read `AGENTS.md` automatically (subagents load the project's `CLAUDE.md`/`AGENTS.md` and git status at startup, same as the main session), so neither needs Solis's conventions repeated in its own instructions beyond referencing the file.

## The day-to-day workflow, put together

Here's how a typical task actually flows once all three mechanisms are set up:

1. **You describe what you want** — "build a testimonials section from this Figma frame," or just start editing a `.liquid` file directly.
2. **Skills activate automatically**, no action from you. If the AI Toolkit is installed (see [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/)), `shopify-liquid` recognizes theme-related work and runs its search-before-code, validate-before-return loop in the background. You don't invoke a skill; it just applies.
3. **You reach for a command when the process is a known, repeatable sequence** — `/figma-to-section <link> <name>` runs the full plan → build → check → fix → report loop from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) as one step instead of retyping the stages.
4. **A subagent picks up the noisy sub-step.** `/figma-to-section`'s Stage 4 explicitly delegates its check → fix work to `theme-check-fixer` instead of walking through every offense inline — you get a clean fix log back, not a wall of intermediate output. The same delegation applies at the end of any other task where `theme check` turns up more than a couple of offenses.
5. **You review the result** like any other AI-generated change — see [GitHub Workflow](/github-workflow/). None of skills, commands, or subagents replace review; they just make getting to a reviewable state faster and less repetitive to ask for.

The mental model: **skills are Shopify's, automatic, and about correctness** (don't guess at Liquid syntax). **Commands are ours, manual, and about repeatability** (don't retype the same multi-stage prompt). **Subagents are ours, automatic-or-named, and about context hygiene** (don't let a noisy sub-task pollute the main conversation, and let it run with deliberately restricted tool access).

## Deciding which mechanism to build next

Not every recurring need is a subagent, and not every subagent candidate should just be a command instead. A rough decision guide:

| If the thing you keep doing is... | Reach for... |
|---|---|
| A specific domain fact/pattern you want applied automatically, without asking every time (e.g. "always check the current filter syntax before writing Liquid") | A **skill** — but this is Shopify's territory via the AI Toolkit; we don't currently author our own skills, see the note below |
| A multi-stage process you run the same way every time, and want to trigger deliberately | A **command** (`.claude/commands/<name>.md`) — see [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) for the full anatomy and writing guide |
| A sub-task that's noisy (many files, many iterations) or that should run with restricted tool access, whether or not you explicitly ask for it | A **subagent** (`.claude/agents/<name>.md`) — this page |
| Something so simple it's not worth automating | Neither — a one-off prompt is fine |

### Could we author our own skill instead of a subagent?

Technically yes — Claude Code's commands and skills are the same underlying mechanism now (see the note in [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/)), and a full `.claude/skills/<name>/SKILL.md` directory (rather than a single-file command) is warranted when the job needs supporting files alongside it — bundled scripts, templates, reference data — or when you want it to activate automatically rather than by explicit `/command`. For "run theme check and fix everything," a subagent fit better because the real win was **context isolation** (keep the offense-by-offense noise out of the main conversation) and **tool restriction** (this job should only read, edit, and run `theme check` — nothing else), which are subagent-specific properties a skill doesn't give you. If a future need is more about "apply this domain knowledge automatically, every time, without isolating context," a project skill would be the better fit than a subagent.

## Writing your own subagent

1. Notice a task that's either noisy (would flood your main context with output you won't reference again) or one you keep asking Claude to do "as a specific persona with restricted tools."
2. Ask Claude directly to write it — "create a project subagent in `.claude/agents/` that does X, restrict it to tools Y, use model Z" — or write the file by hand following the format above.
3. Give it a specific `description` — this is what Claude matches against to decide whether to auto-delegate, so a vague description ("helps with theme stuff") won't trigger reliably, the same lesson as writing a specific rule in `AGENTS.md`.
4. Restrict `tools` to only what the job needs — this is the enforcement mechanism, not just documentation of intent.
5. Test it: describe a task that should trigger it, and confirm Claude actually delegates rather than doing the work inline. Also test invoking it by name to confirm it works when asked directly.
6. Commit `.claude/agents/<name>.md` to the repo so the whole team gets it, same principle as commands and `AGENTS.md` itself.

## Best practices

- Restrict a subagent's `tools` to exactly what its job needs — the isolation only pays off if the subagent genuinely can't do more than intended.
- Write the `description` field the way you'd write a specific `AGENTS.md` rule: concrete enough that Claude reliably matches the right task to it, not a vague summary.
- Keep a subagent focused on one job, the same discipline as commands — a subagent that tries to do five unrelated things is harder to trust and harder to fix.
- Commit project subagents (`.claude/agents/`) to the repo; reserve `~/.claude/agents/` for genuinely personal, cross-project habits.

## Common mistakes

- **Writing a subagent for a job that's actually simple and non-noisy** — that's what a command (or just asking directly) is for; a subagent's isolation is only a win when there's real noise to isolate.
- **Leaving `tools` unset when a subagent should be restricted** — an unset `tools` field inherits everything the main session can do, which defeats the point of scoping a linting-only subagent to read/edit/theme-check.
- **A vague `description`** that Claude can't reliably match against, so auto-delegation either never triggers or triggers on the wrong tasks.
- **Duplicating a command's job as a subagent (or vice versa) without a reason** — keep both only when the isolation/restriction trade-off genuinely matters for that job, as it does for `theme-check-fixer`.

## Quick Reference

- Subagent = isolated context window + scoped tools + auto-or-named delegation. Command = same job, runs inline, manual `/trigger`. Skill = Shopify's, automatic, about Liquid correctness.
- `.claude/agents/<name>.md` (project, committed) or `~/.claude/agents/<name>.md` (personal). Frontmatter: `name`, `description` (both required), `tools`, `model` (both optional, `tools` unset = inherits everything).
- Our one subagent so far: `theme-check-fixer` — [download it](/templates/claude-agents/theme-check-fixer.md).
- Both loads `AGENTS.md`/`CLAUDE.md` automatically at startup — no need to repeat Solis conventions in the subagent's own prompt.

## Further Reading

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) — code.claude.com, the full frontmatter reference
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) — the command mechanism this page compares against
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — the skills mechanism this page compares against
