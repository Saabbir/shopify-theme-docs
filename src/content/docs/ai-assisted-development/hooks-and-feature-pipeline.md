---
title: Claude Code Hooks & the Feature Pipeline
description: A gated, multi-phase pipeline that turns a Figma frame into a reviewed, QA'd theme feature — built from hooks, a coordinator command, and a dedicated builder subagent.
---

**TL;DR:** A gated, multi-phase pipeline that turns a Figma frame into a reviewed, QA'd theme feature — built from hooks, a coordinator command, and a dedicated builder subagent.

[Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) covers `/figma-to-liquid`, a single command that runs the whole plan → build → check → fix → report loop inline. This page covers a heavier alternative built for the same job: `/figma-to-feature`. Instead of one command doing everything, it's six pieces working together — a coordinator command, a dedicated builder subagent, two hooks, a plan template, and a small on-disk state directory. The result is a pipeline that refuses to write any theme file until a human has explicitly approved a written plan, builds one reviewable phase at a time, and runs real QA (static check, storefront render, theme editor) before calling a feature done.

This setup was built by a teammate for this exact repo, not by this handbook. The rest of this page documents what it does, verifies the pieces that could be checked against live sources, and flags the couple of things worth reconciling with the rest of this handbook before you rely on it.

## Why this exists alongside the simpler command

`/figma-to-liquid` is the right tool for most component work: a testimonials section, a new block, a snippet. `/figma-to-feature` earns its extra weight for something bigger or riskier — a feature you want a hard stop on before any code lands, one that's naturally several reviewable chunks, or one where you specifically want QA (storefront render at four breakpoints, theme editor block behavior, keyboard/focus) folded into the same run instead of a separate manual pass.

| | `/figma-to-liquid` | `/figma-to-feature` |
|---|---|---|
| Runs as | One command, inline | A coordinator command that dispatches a subagent per phase |
| Plan approval | Implicit — the command states its plan back in Stage 1 | Explicit and **enforced by a hook**. Nothing can be written to `sections/`, `blocks/`, `snippets/`, or `assets/` until a plan file literally says `Status: approved` |
| Build unit | The whole feature, one pass | One numbered phase at a time, each with its own review checkpoint |
| QA | `shopify theme check`, handed to `theme-check-fixer` | Static check, plus a live storefront render (Playwright) at 375/768/1280/1920, plus a live theme editor pass, plus a written `qa-report.md` |
| State | None persisted beyond the PR itself | `.sol-workflow/{handle}/` — plan, progress log, and QA report, kept as a build record |
| Best for | A section, block, or snippet | A multi-part feature where you want a hard gate before code, and QA built into the same run |

Neither replaces [GitHub Workflow](/github-workflow/) review. Both still produce a PR a human reviews before merge.

## The six pieces, at a glance

| Piece | Type | What it does | Download |
|---|---|---|---|
| `/figma-to-feature` | Command | Coordinates the whole run: reads the design, writes the plan, dispatches each build phase, runs QA. Never writes theme files itself. | [figma-to-feature.md](/templates/claude-commands/figma-to-feature.md) |
| `sol-builder` | Subagent | Executes exactly one approved phase per invocation, starting cold each time. | [sol-builder.md](/templates/claude-agents/sol-builder.md) |
| `require-plan.sh` | Hook (`PreToolUse`) | Blocks writes to theme component folders until the plan says `Status: approved`. | [require-plan.sh](/templates/claude-hooks/require-plan.sh) |
| `restore-index.sh` | Hook (`Stop`, `SessionStart`) | Restores `templates/index.json` if a QA preview swap gets orphaned by an interrupted session. | [restore-index.sh](/templates/claude-hooks/restore-index.sh) |
| `settings.json` | Config | Wires both hooks to their events. | [settings.json](/templates/claude-settings/settings.json) |
| `plan-template.md` | Template | The document the command fills in and the hook checks for approval. | [plan-template.md](/templates/plan-template.md) |

Download all six into `.claude/` (`commands/`, `agents/`, `hooks/`, `settings.json`, and `templates/` respectively), then make the hook scripts executable:

```bash
chmod +x .claude/hooks/require-plan.sh .claude/hooks/restore-index.sh
```

Commit all of it. Same reasoning as every other `.claude/` file in this handbook: check it in, and the whole team gets the same gated pipeline the moment they clone the repo, instead of one person having a safety mechanism nobody else does.

## How the pieces fit together

```
/figma-to-feature <figma-url>
        │
        ▼
Phase 0-1: read design, ask instructions  ──────────────────┐
        │                                                    │
        ▼                                                    │
Phase 2: write .sol-workflow/{handle}/plan.md (Status: draft)│
        │                                                    │
        ▼                                                    │
    ┌───────────────┐   user approves   ┌──────────────────┐│
    │ GATE: present  │ ────────────────▶│ Status: approved  ││
    │ plan in chat   │                   └──────────────────┘│
    └───────────────┘                            │            │
                                                   ▼            │
Phase 3: for each numbered phase in plan §7 ───────────────────┘
        │
        ├─ dispatch sol-builder (cold start, reads plan.md + AGENTS.md)
        ├─ require-plan.sh checks plan.md before every Write/Edit
        │     → blocks if Status isn't "approved"
        ├─ sol-builder calls validate_theme after every file
        └─ GATE: coordinator verifies, user reviews, confirms → next phase

Phase 4: QA (theme check → storefront render → theme editor → qa-report.md)
        │
        ▼ GATE: present qa-report.md
Phase 5: close out, delete .sol-workflow/ACTIVE, summarize
```

The hook is what makes the gate in Phase 2 real instead of aspirational. Without it, "wait for approval" is just an instruction the coordinator is trusted to follow. With it, an attempt to write to `sections/`, `blocks/`, `snippets/`, or `assets/` while the plan still says `draft` is mechanically blocked, regardless of what the coordinator (or a distracted human mid-conversation) intends to do next.

## `.sol-workflow/`: the state directory this all runs on

| Path | What it holds | Commit it? |
|---|---|---|
| `.sol-workflow/ACTIVE` | The handle of the currently-in-progress run. Its mere existence is what arms `require-plan.sh` at all. | **No.** This is local, in-progress session state, not a team fact. Add it to `.gitignore`. |
| `.sol-workflow/{handle}/plan.md` | The plan itself: front matter `Status`, the numbered phases, the progress log. | Yes. This is the build record `/figma-to-code-workflow`'s "Document" step asks for elsewhere in this handbook, just automated. |
| `.sol-workflow/{handle}/qa-report.md` | What Phase 4 produces: pass/fail per check, what could only be verified manually. | Yes, same reasoning. |
| `.sol-workflow/config.json` | The `*.myshopify.com` store domain, asked for once per repo. | Yes — it's a domain, not a secret, and the whole point is asking once per repo instead of once per person. |
| `.sol-workflow/.index-backup.json` | A temporary copy of `templates/index.json`, made during Phase 4's live storefront QA and restored after. | **No.** Pure transient scratch state. `restore-index.sh` exists specifically to clean this up if a session dies before the normal restore step runs. |

None of `.sol-workflow/` should reach a Theme Store submission. See "A gap this setup leaves in packaging" below — the existing exclusion list in this handbook didn't cover this directory until this page added it.

## The two hooks

### `require-plan.sh` — the actual enforcement

Registered on `PreToolUse` for `Write` and `Edit`, matched in `settings.json`. Every time Claude attempts either tool, this script runs first:

1. If `.sol-workflow/ACTIVE` doesn't exist, exit immediately and allow the write. Outside an active `/figma-to-feature` run, this hook is a total no-op — your normal, unguarded hand-editing of the theme is never affected.
2. Otherwise, read the attempted file path from the tool call (passed in as JSON on stdin) and check whether it falls inside `sections/`, `blocks/`, `snippets/`, or `assets/`. Anything else is allowed through untouched.
3. For a write inside those folders, read the active run's `plan.md` and check its front matter for `Status: approved`. If it's there, allow the write. If not, block it (exit code `2`) and print a message telling Claude exactly what's missing and what plan file to check.

This is the concrete example behind [AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/)'s claim that a hook is the one mechanism on that page that can actually enforce a rule rather than just state it. Nothing about `/figma-to-feature`'s own instructions can be trusted alone to stop a premature write — the hook is what actually stops it.

### `restore-index.sh` — cleanup for an interrupted QA run

Registered on both `Stop` (end of session) and `SessionStart` (start of the next one). Phase 4's live storefront QA temporarily replaces `templates/index.json` with a version containing only the section under test, so it renders in isolation at `http://127.0.0.1:9292`. The command's own instructions say to restore the original file and delete the backup once QA finishes — but if the session ends before that happens (a crash, a closed terminal, hitting a usage limit mid-QA), the real `templates/index.json` would stay swapped out indefinitely. This hook checks for the backup file on every session boundary and puts the original back if it finds one, so a broken homepage template can't silently survive past the session that caused it.

## The `/figma-to-feature` command: six gated phases

The full command file is linear and worth reading in full (it's short — [download it](/templates/claude-commands/figma-to-feature.md)), but the shape is:

- **Phase 0 — Preflight.** Checks for a resumable run first, then Figma access, then opens `.sol-workflow/{handle}/` and writes the handle to `ACTIVE`. This last step is what arms `require-plan.sh`.
- **Phase 1 — Read the design, then ask.** Pulls desktop and mobile frames, summarizes in 10 lines or fewer, then asks a fixed four-question block (behavior, snippets/blocks to reuse, what should be a setting, what to leave out) before writing anything. **GATE** — waits for the answer.
- **Phase 2 — Write the plan.** Fills in `plan-template.md`, leaves `Status: draft`, and presents the whole thing in chat (not just a link to the file). **GATE** — waits for approval, and only the user's explicit approval flips the front matter to `Status: approved`.
- **Phase 3 — Execute, one phase at a time.** For each numbered phase in the plan, dispatches `sol-builder` with just the plan's path, the phase number, and anything the previous phase reported. The coordinator then independently re-checks the builder's own claims against the theme's actual conventions before showing the user anything. **GATE** after each phase.
- **Phase 4 — QA.** Static check first (no store needed), then store access, then a live Playwright render at four breakpoints plus deliberately awkward content (zero blocks, max blocks, very long strings, a missing image), then a live theme editor pass through a browser-automation connection. Writes `qa-report.md`. **GATE** — presents the report.
- **Phase 5 — Close out.** Deletes `.sol-workflow/ACTIVE` (disarming the hook), confirms `templates/index.json` is back to normal, and summarizes every file touched. `.sol-workflow/{handle}/` itself stays, as the permanent record of the run.

"Gate" isn't a suggestion in this command's own wording: it says explicitly that "the user will probably say yes" is not approval, and that gates are hard stops. That's a deliberate, repeated instruction on top of the one gate (`Status: approved`) that's actually hook-enforced — the others rely on the coordinator genuinely stopping, the same trust boundary every command in this handbook operates under.

## The `sol-builder` subagent

`sol-builder` executes exactly one numbered phase per invocation and nothing more, even with turns left. It's dispatched fresh each time, with no memory of the conversation that wrote the plan — the plan file *is* its entire brief, which is why [the command's own rules](#the-figma-to-feature-command-six-gated-phases) insist on pasting the user's instructions into the plan **verbatim** rather than summarizing them.

Its declared tools:

```
Read, Write, Edit, Glob, Grep, Bash, Skill,
mcp__shopify-dev-mcp__learn_shopify_api,
mcp__shopify-dev-mcp__validate_theme,
mcp__shopify-dev-mcp__search_docs_chunks
```

We checked all three `mcp__shopify-dev-mcp__*` tools against Shopify's current documentation while writing this page, since [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) had previously (and, as of this update, incorrectly) suggested the Dev MCP server didn't cover Liquid at all. All three are real: `learn_shopify_api` (call first, generates a conversation ID), `search_docs_chunks` (broad documentation search), and `validate_theme` (validates an entire theme directory against Theme Check rules — and it's **on by default**, no extra configuration needed). See that page's updated section on this for the full correction and what's still worth double-checking yourself.

Its startup order matters: `learn_shopify_api` first (once, mandatory), then the plan file (all of it, not just its own phase), then `AGENTS.md`'s project-conventions section, then a couple of existing components as a style reference. It validates with `validate_theme` after **every file**, not batched at the end, and stops and reports rather than guessing if something in the plan turns out to be impossible as written, or if a file fails validation three times running.

### The "repo ground truth" section — and why it needs active maintenance

The version of `sol-builder.md` this pipeline was built with includes a section of specific, point-in-time facts about the real codebase: exact locale namespaces that exist versus don't yet, a setting that's only partially built out, which snippets already exist and should be reused instead of rebuilt. The idea is sound and important — it stops the agent from generating references to conventions `AGENTS.md` describes as the intended end state but that the actual repo hasn't caught up to yet.

The downloadable template on this page deliberately **doesn't** include that original, dated content. Facts like "this locale namespace doesn't exist yet" or "this snippet emits these particular custom property names" go stale the moment someone ships the fix, and a stale version of this section is worse than no section, since it actively tells the builder to work around a problem that no longer exists. Treat this section exactly like `AGENTS.md` itself: something that needs the same ongoing-maintenance discipline covered in [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/), re-verified against the real tree before each use, not written once and left alone.

## `plan-template.md`: the contract between coordinator and builder

This is the one document both halves of the pipeline read. The coordinator fills it in; `require-plan.sh` checks its front matter; `sol-builder` treats it as its entire brief. A few sections carry more weight than the others:

- **§2, custom instructions** — pasted verbatim from the user. The builder never sees the original conversation, so anything paraphrased away here is genuinely lost, not just abbreviated.
- **§3, component breakdown** — the setting-vs-block-vs-snippet-vs-hardcoded decision this handbook's [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) also treats as the highest-stakes call in the whole process, here made explicit and justified in writing before any code exists.
- **§7, phases** — 3 to 5 of them, each small enough to review in one sitting, foundations (locale keys) first and the section itself last before QA.
- **§9, known repo gaps** — the subset of `sol-builder.md`'s "repo ground truth" section that's actually relevant to this specific build, copied in so the builder doesn't have to hold the whole list in mind for a phase it doesn't touch.

## Two things worth reconciling before you rely on this

Verifying this setup surfaced two real gaps between what this pipeline assumes and what the rest of this handbook currently documents. Neither is a bug in the pipeline itself — both are places where this handbook's own conventions need to catch up, or where you need to confirm which convention your repo actually follows.

**1. Figma tool names depend on how Figma MCP was installed.** The original command file called Figma's tools by names like `mcp__plugin_figma_figma__get_metadata`. That naming pattern is what you get from installing **Figma's official Claude Code plugin** (`claude plugin install figma@claude-plugins-official`), which namespaces its tools by plugin name. But [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) recommends the **committed `.mcp.json`** route as the primary setup, which registers the server as plain `figma` — giving you tool names like `mcp__figma__get_metadata` instead. The downloadable command template on this page has been written to reference "your Figma MCP connection" generically rather than hardcoding either naming scheme, but if you're adapting the original file directly: check which install method your team actually uses, and make sure the tool names in the command match it. They're two different, non-interchangeable names for reaching the same underlying `get_metadata` tool.

**2. The `sol-` class and custom-property prefix isn't in this handbook's CSS naming page yet.** `sol-builder.md` enforces `.sol-{block}__{element}--{modifier}` classes and `--sol-*` custom properties as a hard rule. [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/) currently documents the same BEM-ish, kebab-case shape but without any project-wide prefix in its examples. If `sol-` is genuinely this project's live convention, that page's examples should be updated to show it. If it isn't (yet), `sol-builder.md` is enforcing a convention ahead of where the rest of the codebase and this handbook currently are. Either way, check your actual `AGENTS.md` and existing component CSS before trusting either source blindly, and update whichever one is behind.

## A gap this setup leaves in packaging

`.sol-workflow/` is a new repo-root directory this pipeline introduces, and it wasn't in this handbook's Theme Store exclusion list until this page. Add it to `.shopifyignore` alongside the other dev-tooling entries covered in [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/):

```
.sol-workflow/
```

None of `.sol-workflow/`'s content, plan files, QA reports, or state, is theme code. It should never reach a submission zip, the same as `.claude/` itself.

## Best practices

- Commit all six pieces (`.claude/commands/figma-to-feature.md`, `.claude/agents/sol-builder.md`, both hooks, `settings.json`, `plan-template.md`) so the whole team gets the same gated pipeline, not just whoever built it.
- Keep `sol-builder.md`'s "repo ground truth" section current. Treat it with the same discipline as `AGENTS.md` — see [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/).
- Reach for `/figma-to-feature` when you specifically want the hard pre-code gate and built-in QA. Default to the lighter `/figma-to-liquid` for ordinary section/block/snippet work — see the comparison table above.
- Add `.sol-workflow/ACTIVE` and `.sol-workflow/.index-backup.json` to `.gitignore`, but commit `.sol-workflow/{handle}/plan.md` and `qa-report.md` as build records.
- Add `.sol-workflow/` to `.shopifyignore` too. It's dev tooling, not theme code.

## Common mistakes

- **Treating a `PreToolUse` hook's block as a bug and working around it**, instead of writing the plan and getting it approved. The hook is doing exactly its job — see [`require-plan.sh`](#require-plansh--the-actual-enforcement) above.
- **Letting `sol-builder.md`'s "repo ground truth" section go stale.** A specific, dated fact about the codebase that's since been fixed actively misleads the builder, worse than having no such section at all.
- **Assuming this pipeline is a strict upgrade over `/figma-to-liquid` for every job.** It's heavier for a reason. A one-off snippet doesn't need a gated, multi-phase build with a written QA report.
- **Copying the original command file's Figma tool names without checking your own install method.** `mcp__plugin_figma_figma__*` only works if Figma MCP was installed via the plugin route. See the reconciliation section above.
- **Forgetting `.sol-workflow/` in `.shopifyignore`.** It's easy to overlook a directory this handbook didn't previously ask you to exclude.

## Key takeaways
- `/figma-to-feature` = coordinator command + `sol-builder` subagent + two hooks + a plan template + `.sol-workflow/` state. Heavier than `/figma-to-liquid`, worth it when you want a hard pre-code gate and integrated QA.
- The gate is real because a `PreToolUse` hook (`require-plan.sh`) blocks writes to theme folders until the plan says `Status: approved` — not because the command politely asks first.
- `restore-index.sh` cleans up an orphaned QA preview swap on session `Stop`/`SessionStart`, in case a run is interrupted mid-QA.
- `sol-builder`'s Dev MCP tools (`learn_shopify_api`, `validate_theme`, `search_docs_chunks`) are all real and verified — `validate_theme` is on by default.
- Two things to reconcile before trusting this as-is: Figma tool names depend on install method (plugin vs. committed `.mcp.json`), and the `sol-` prefix convention isn't yet documented on this handbook's CSS naming page.
- Add `.sol-workflow/` to `.shopifyignore` — it wasn't covered before this page.

## Further reading

- [AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/) — what a hook is, and the other five mechanisms this pipeline builds on
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) — the lighter `/figma-to-liquid` alternative
- [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) — the subagent mechanism `sol-builder` uses
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — the Dev MCP tools `sol-builder` calls, and the correction made while verifying this page
- [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) — the install-method discrepancy flagged above
- [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) — the maintenance discipline `sol-builder.md`'s ground-truth section also needs
- [Hooks reference](https://code.claude.com/docs/en/hooks) (code.claude.com)
