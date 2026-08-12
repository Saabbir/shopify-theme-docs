---
title: Claude Code Subagents
description: A dedicated theme-check-fixer subagent, and the day-to-day workflow that ties skills, commands, and subagents together.
---

**TL;DR:** A dedicated theme-check-fixer subagent, and the day-to-day workflow that ties skills, commands, and subagents together.

[Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) ships **skills**, which turn on automatically and belong to Shopify. [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) covers **commands**, which you trigger yourself by typing `/`, and which are ours. This page covers the third piece, **subagents**, and shows how all three fit together in a normal day of work.

## What a subagent actually is

A subagent is a specialized Claude Code assistant that runs in its **own separate conversation**. It has its own instructions and its own set of tools, instead of running inline in your main conversation.

Claude hands a task to a subagent in one of two ways. It can do this automatically, when the task matches what the subagent's `description` says it does, or you can ask for it by name.

The subagent does the work, which might mean reading a dozen files, running commands, and going back and forth on fixes. Then it returns only a summary to your main conversation. All the messy in-between output, like file contents, command logs, and failed attempts, stays inside the subagent's own conversation instead of cluttering yours.

That's the specific problem a subagent solves that a command doesn't. A command, like `/theme-check-fix`, runs its instructions **inline**, in your main conversation. That's good for a quick, interactive session where you want to watch each step. A subagent does the same kind of job but keeps it **separate**, which matters once the job is noisy (many issues, many files), or when it's something you want handled automatically without typing a command at all.

Claude Code also comes with several built-in subagents, like `Explore`, `Plan`, and `general-purpose`. Claude uses these automatically for research and multi-step tasks. You don't need to set them up. They're just always available.

## Our subagent: `theme-check-fixer`

We have two project subagents so far. This one does exactly what its name says: it runs `shopify theme check`, fixes every issue it reports, and reports back to you. The second, `sol-builder`, is a heavier one that builds actual theme features — see [Claude Code Hooks & the Feature Pipeline](/ai-assisted-development/hooks-and-feature-pipeline/) for that one, since it only makes sense alongside the hooks and command it's dispatched from.

[Download `theme-check-fixer.md`](/templates/claude-agents/theme-check-fixer.md) into `.claude/agents/` at your repo root:

```
.claude/
  agents/
    theme-check-fixer.md   →  runs automatically, or via "use the theme-check-fixer agent"
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

Why do we have both this subagent *and* the `/theme-check-fix` command, instead of picking just one?

| | `/theme-check-fix` (command) | `theme-check-fixer` (subagent) |
|---|---|---|
| Runs in | Your main conversation | Its own separate conversation |
| Triggered by | Typing `/theme-check-fix` | Automatically (Claude notices a matching task) or by name ("use the theme-check-fixer agent") |
| Best for | A quick, interactive pass you want to watch | A noisy job (many issues) at the end of a longer task, for example Stage 4 of [`/figma-to-liquid`](/ai-assisted-development/claude-code-custom-commands/), which hands its check → fix step off to this subagent instead of resolving each issue inline and filling up your main conversation with file content |
| Tool access | Whatever your session already has | Limited to exactly `Read, Edit, Bash(shopify theme check:*)`. It can't touch anything else, even if your session has broader access |

Both read `AGENTS.md` automatically. Subagents load the project's `CLAUDE.md`/`AGENTS.md` and git status at startup, the same way your main session does. So neither one needs Solis's rules repeated in its own instructions. They just point to the file.

## The day-to-day workflow, put together

Here's how a typical task actually flows once all three pieces are set up:

1. **You describe what you want.** Maybe you say "build a testimonials section from this Figma frame," or you just start editing a `.liquid` file directly.
2. **Skills turn on automatically**, with no action from you. If the AI Toolkit is installed (see [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/)), `shopify-liquid` notices theme-related work and runs its search-then-check process in the background. You don't invoke a skill, it just applies on its own.
3. **You reach for a command when the process is a known, repeatable sequence.** `/figma-to-liquid <link> <name>` runs the full plan → build → check → fix → report loop from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) as one step, instead of you retyping each stage.
4. **A subagent picks up the noisy part.** `/figma-to-liquid`'s Stage 4 hands its check → fix work off to `theme-check-fixer`, instead of walking through every issue inline. You get back a clean list of what was fixed, not a wall of in-between output. The same handoff applies at the end of any other task where `theme check` turns up more than a couple of issues.
5. **You review the result**, like any other AI-generated change. See [GitHub Workflow](/github-workflow/) for how. None of skills, commands, or subagents replace review. They just get you to something reviewable faster, with less repetitive typing.

The short version: **skills are Shopify's, automatic, and about correctness** (don't guess at Liquid syntax). **Commands are ours, manual, and about repeatability** (don't retype the same multi-step prompt). **Subagents are ours, automatic-or-named, and about keeping your conversation clean** (don't let a noisy sub-task clutter your main conversation, and let it run with deliberately limited tools).

## Deciding which mechanism to build next

Not every recurring need calls for a subagent, and not every subagent candidate should just be a command instead. A rough guide:

| If the thing you keep doing is... | Reach for... |
|---|---|
| A specific fact or pattern you want applied automatically, without asking every time (e.g. "always check the current filter syntax before writing Liquid") | A **skill**. But this is Shopify's territory via the AI Toolkit. We don't currently write our own skills, see the note below |
| A multi-step process you run the same way every time, and want to trigger on purpose | A **command** (`.claude/commands/<name>.md`). See [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) for the full guide |
| A sub-task that's noisy (many files, many rounds of edits) or that should run with limited tool access, whether or not you ask for it directly | A **subagent** (`.claude/agents/<name>.md`). See this page |
| A rule that must be enforced no matter what, not just followed when the AI remembers to | A **hook** (`.claude/hooks/<name>.sh`). See [Claude Code Hooks & the Feature Pipeline](/ai-assisted-development/hooks-and-feature-pipeline/) |
| Something so simple it's not worth automating | Neither. A one-off prompt is fine |

### Could we write our own skill instead of a subagent?

Technically, yes. Claude Code's commands and skills are the same underlying mechanism now (see the note in [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/)). A full `.claude/skills/<name>/SKILL.md` folder, instead of a single-file command, makes sense when the job needs supporting files, like bundled scripts, templates, or reference data, or when you want it to turn on automatically rather than by typing `/command`.

For "run theme check and fix everything," a subagent fit better. The real win was **keeping the conversation clean** (no offense-by-offense noise in your main conversation) and **limiting its tools** (this job should only read, edit, and run `theme check`, nothing else). Those are things a subagent gives you that a skill doesn't.

If a future need is more about "apply this knowledge automatically, every time, without needing a separate conversation," a project skill would fit better than a subagent.

## Writing your own subagent

1. Notice a task that's either noisy (it would fill your main conversation with output you won't reference again), or one you keep asking Claude to do "as a specific persona with limited tools."
2. Ask Claude directly to write it. You can say something like "create a project subagent in `.claude/agents/` that does X, restrict it to tools Y, use model Z," or write the file by hand following the format above.
3. Give it a specific `description`. This is what Claude compares against a task to decide whether to hand it off automatically. A vague description, like "helps with theme stuff," won't trigger reliably. That's the same lesson as writing a specific rule in `AGENTS.md`.
4. Limit `tools` to only what the job needs. This is what actually enforces the restriction, not just a note about intent.
5. Test it. Describe a task that should trigger it, and confirm Claude actually hands it off instead of doing the work inline. Also test asking for it by name, to confirm that works too.
6. Commit `.claude/agents/<name>.md` to the repo so the whole team gets it. It's the same idea as commands and `AGENTS.md` itself.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Limit a subagent's `tools` to exactly what its job needs. The benefit of keeping it separate only pays off if the subagent genuinely can't do more than intended. | **Writing a subagent for a job that's actually simple and not noisy.** That's what a command (or just asking directly) is for. A subagent's separation is only worth it when there's real noise to keep out of the way. |
| Write the `description` field the way you'd write a specific `AGENTS.md` rule. Make it concrete enough that Claude reliably matches the right task to it, not a vague summary. | **Leaving `tools` unset when a subagent should be limited.** An unset `tools` field inherits everything your main session can do, which defeats the point of limiting a linting-only subagent to read, edit, and theme-check. |
| Keep a subagent focused on one job, the same discipline as commands. A subagent that tries to do five unrelated things is harder to trust and harder to fix. | **A vague `description`** that Claude can't reliably match against, so it either never hands off the task, or hands off the wrong ones. |
| Commit project subagents (`.claude/agents/`) to the repo. Save `~/.claude/agents/` for genuinely personal habits that apply across projects. | **Duplicating a command's job as a subagent, or the other way around, without a reason.** Keep both only when the separation and tool-limiting trade-off genuinely matters for that job, as it does for `theme-check-fixer`. |

## Key takeaways
- Subagent = its own conversation, limited tools, and hands off automatically or by name. Command = same kind of job, runs inline, manual `/trigger`. Skill = Shopify's, automatic, about getting Liquid right.
- `.claude/agents/<name>.md` (project, committed) or `~/.claude/agents/<name>.md` (personal). Frontmatter: `name`, `description` (both required), `tools`, `model` (both optional, and leaving `tools` unset means it inherits everything).
- Our two subagents so far: `theme-check-fixer` ([download](/templates/claude-agents/theme-check-fixer.md)) and `sol-builder` (see [Claude Code Hooks & the Feature Pipeline](/ai-assisted-development/hooks-and-feature-pipeline/)).
- Both load `AGENTS.md`/`CLAUDE.md` automatically at startup, so there's no need to repeat Solis's rules in the subagent's own instructions.

## Further reading

- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) (code.claude.com, the full frontmatter reference)
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) (the command mechanism this page compares against)
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) (the skills mechanism this page compares against)
- [Claude Code Hooks & the Feature Pipeline](/ai-assisted-development/hooks-and-feature-pipeline/) (`sol-builder`, our second subagent, and the hooks it runs alongside)
