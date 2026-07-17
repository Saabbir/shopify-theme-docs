---
title: "8a. AI Coding Concepts: Agents, MCP, Skills, Commands & Plugins"
description: A plain-language primer on the vocabulary the rest of this section assumes — read this one first if any of these terms are new.
---

The rest of this section uses terms like "MCP," "skill," "subagent," and "plugin" without re-explaining them each time. If you're new to AI-assisted / agentic coding, start here — everything else in section 8 builds on these five concepts.

## What makes a tool "agentic" — Claude Code, Cursor, Copilot

Claude Code, Cursor, and GitHub Copilot are all **AI coding assistants**, but the interesting one for this handbook is what they do beyond autocomplete: in "agent mode," they can read your actual files, write and edit code across the whole repo, run terminal commands (`shopify theme check`, `git`, tests), and carry out a multi-step task toward a goal you describe — not just suggest the next line as you type.

| Tool | Where it runs | Notes |
|---|---|---|
| **Claude Code** | Terminal | Anthropic's own agent; also embeds in VS Code/JetBrains |
| **Cursor** | Desktop IDE (a VS Code fork) | Agent mode alongside familiar IDE autocomplete |
| **GitHub Copilot** | VS Code / IDE extension | Started as pure autocomplete; agent mode is a newer addition |

All three, in agent mode, can read `AGENTS.md` (see [8b](/ai-assisted-development/setting-up-ai-rules/)), call MCP servers, and — depending on the tool — load skills, run commands, and delegate to subagents. The rest of this page explains those four mechanisms.

## MCP — the plumbing that connects a tool to outside data

**MCP (Model Context Protocol)** is an open protocol that lets an AI tool connect to an external data source or service through one standard interface, instead of every tool needing its own bespoke integration for every service. An **MCP server** exposes a set of callable tools (and sometimes data); any MCP-aware client — Claude Code, Cursor, VS Code — can connect to that same server and call those same tools the same way.

Two concrete MCP servers already used in this handbook:

- **Figma's MCP server** — exposes structured design data (components, variables, layout) to your AI tool. See [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/).
- **Shopify's Dev MCP server** (`@shopify/dev-mcp`) — exposes tools like `learn_shopify_api` for app/platform context. See [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) for what it does and doesn't currently cover for theme work.

Think of MCP as the plumbing. Skills, commands, and subagents (below) are what get built using what that plumbing exposes — a skill might call an MCP tool as part of its search-before-code loop, for instance.

## Skills — packaged knowledge that activates automatically

A **skill** is a set of instructions (optionally with supporting scripts or reference files) that an AI tool loads **automatically** when it's relevant to what you're asking — you don't invoke a skill by name. Shopify's `shopify-liquid` skill (from [the AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/)) is the example already in this handbook: it activates whenever a request looks like theme/Liquid work, and runs its own search-then-validate loop before returning code.

Skills live at `.claude/skills/<name>/SKILL.md` for a hand-authored one, or arrive bundled inside an installed plugin (see below).

## Commands — a saved prompt you trigger by name

A **command** is a saved, multi-step prompt you trigger **manually** by typing `/<name>`. If you catch yourself retyping the same instructions repeatedly ("build this from Figma, then check, then fix, then summarize"), that's a command. Ours: `/figma-to-section`, `/theme-check-fix`, `/pr-prep` — see [8g. Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/).

Commands live at `.claude/commands/<name>.md`. As of current Claude Code versions, commands and skills are technically the same underlying mechanism — a command is just the simpler, single-file, manually-triggered form.

## Subagents — an isolated worker with scoped tools

A **subagent** is a specialized assistant that runs in its **own separate context window**, with its own system prompt and its own restricted tool access, rather than working inline in your main conversation. It's delegated to automatically (when a task matches its description) or by name, does its work, and returns only a summary — keeping noisy intermediate output (file contents, command logs, retries) out of your main conversation. Ours: `theme-check-fixer` — see [8h. Claude Code Subagents](/ai-assisted-development/claude-code-subagents/).

Subagents live at `.claude/agents/<name>.md`.

## Plugins — a bundle of the above, installed as one unit

A **plugin** packages some or all of the above — skills, commands, subagents, MCP server connections — into a single installable, often auto-updating unit. The [Shopify AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) is a plugin: one install command gives you its skills (`shopify-liquid` and others) and its MCP wiring together, rather than you assembling each piece by hand. Figma's official Claude Code plugin works the same way for design data.

We haven't packaged our own Solis-specific pieces (`AGENTS.md`, our commands, `theme-check-fixer`) into a formal plugin yet — right now they're distributed as loose files via this handbook's `/templates/` downloads, which every teammate copies into their own `.claude/` folder. That's a reasonable gap to eventually close (a plugin would let the whole team install everything Solis-specific in one command, and update it in one command), but it's not something this handbook currently sets up.

## All five, side by side

| Mechanism | What it is | Activates | Lives at | Example here |
|---|---|---|---|---|
| **MCP server** | A connection to an external data source/service | Always available once connected; exposes tools an agent can call | Configured per-tool (`claude mcp add`, Cursor's MCP settings, etc.) | Figma MCP server, Shopify's Dev MCP server |
| **Skill** | Packaged domain instructions (+ optional scripts) | Automatically, based on relevance | `.claude/skills/<name>/SKILL.md`, or via a plugin | `shopify-liquid` |
| **Command** | A saved prompt | Manually, by typing `/<name>` | `.claude/commands/<name>.md` | `/figma-to-section`, `/theme-check-fix` |
| **Subagent** | An isolated worker with scoped tools | Automatically (delegated) or by name | `.claude/agents/<name>.md` | `theme-check-fixer` |
| **Plugin** | A bundle of any/all of the above | Installed once; contents then behave per their own type | `claude plugin install ...` (or tool-equivalent) | Shopify AI Toolkit, Figma's official plugin |

## Where `AGENTS.md` fits — none of the above

`AGENTS.md`/`CLAUDE.md`/`.github/copilot-instructions.md` (see [8b](/ai-assisted-development/setting-up-ai-rules/)) aren't a skill, command, subagent, or plugin — they're **static, always-loaded context**, read at the start of every session regardless of what you're doing. A skill activates conditionally; a command needs to be typed; a subagent is delegated. `AGENTS.md` is just always there, in the background, the moment a session starts. That's a deliberate difference: project-wide rules (no Sass, blocks-locally-OR-`@theme`-never-both) need to apply to *everything*, not just tasks that happen to match a skill's trigger.

## Where to go next in this section

1. [8b. Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) — the always-loaded project context every tool reads.
2. [8c. Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) — keeping that file correct over time.
3. [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — the skill (and MCP server) that grounds Liquid generation in real platform facts.
4. [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) — a concrete MCP integration, for design data.
5. [8f. Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) — the repeatable process built on top of it.
6. [8g. Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) — automating that process.
7. [8h. Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) — isolating the noisy sub-steps of it.
8. [8i. Writing Prompts That Work](/ai-assisted-development/writing-prompts-that-work/) — getting good output out of all of the above.

## Best practices

- Read this page once, in full, before the rest of section 8 if any of MCP/skill/command/subagent/plugin is new vocabulary — the other pages assume you know which is which.
- When deciding whether something you keep doing deserves automation, use the mechanism's defining trait to pick: needs to apply to *everything* → `AGENTS.md`. Needs to trigger *automatically* on relevant tasks → skill. You want to trigger it *by name* → command. It's *noisy or needs restricted tools* → subagent.
- Don't confuse "installed a plugin" with "wrote a skill" — a plugin is a distribution mechanism; the skill/command/subagent/MCP-wiring inside it are the actual things that do work.

## Common mistakes

- **Using "MCP," "skill," and "plugin" interchangeably** — they're related but distinct: MCP is a connection, a skill is packaged instructions, a plugin is a bundle that can contain skills (and commands, subagents, MCP wiring) together.
- **Expecting a skill to need manual triggering** — that's a command's job; a skill activates on its own.
- **Assuming a subagent is just "a slower command"** — the point isn't speed, it's context isolation and tool restriction.
- **Treating `AGENTS.md` as one of these four mechanisms** — it's static always-loaded context, not something that activates conditionally or gets triggered.

## Quick Reference

- **MCP server** = connection to outside data/services. **Skill** = auto-activating instructions. **Command** = manually-triggered saved prompt. **Subagent** = isolated, scoped-tool worker. **Plugin** = a bundle of any/all of the above, installed as one unit.
- `AGENTS.md` is none of these — it's always-loaded static context.
- This handbook's examples: Figma MCP server + Shopify Dev MCP server (MCP), `shopify-liquid` (skill), `/figma-to-section` etc. (commands), `theme-check-fixer` (subagent), Shopify AI Toolkit + Figma's plugin (plugins).

## Further Reading

- [Claude Code overview](https://code.claude.com/docs/en/overview) — code.claude.com
- [Model Context Protocol](https://modelcontextprotocol.io) — the open spec
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) — code.claude.com
- [Plugins reference](https://code.claude.com/docs/en/plugins-reference) — code.claude.com
