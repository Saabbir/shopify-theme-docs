---
title: Prerequisites & Setup
description: Everything you need installed, connected, and verified — accounts, editor, and AI tooling — before writing a single line of code.
---

This page is the full pre-flight list: accounts, core software, your editor (VS Code and/or Cursor), and the AI tooling this handbook assumes (Claude Code, the Shopify AI Toolkit, and MCP). Work through it top to bottom once, then run the [pre-flight checklist](#the-pre-flight-checklist) at the end to confirm the whole chain actually works together — not just that each piece installed.

## Accounts you need

- **Shopify Partner account** — free, required to create development stores and submit themes. Sign up at [partners.shopify.com](https://www.shopify.com/partners). See [Partner Dashboard Setup](/publishing/partner-dashboard-setup/) if you don't have one yet.
- **A development store** — a free, sandboxed Shopify store for building and testing. Create one from your Partner Dashboard.
- **Collaborator or staff access** with the "Manage themes" permission on whichever store you'll be pushing theme code to.
- **GitHub access** to the team's repositories.
- **An Anthropic account** (Pro, Max, Team, or Enterprise plan, or a Console/API account) if you're using Claude Code — the free claude.ai plan doesn't include Claude Code access.

## Core software (any editor, any AI tool)

| Tool | Why |
|---|---|
| [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) | Scaffolds themes, runs a local dev server, pushes/pulls theme code. |
| Node.js — current LTS, **v22+** if you'll install Claude Code via npm | Required by Shopify CLI, Theme Check, and any local tooling (ESLint, Prettier). |
| Git | Version control — see [GitHub Workflow](/github-workflow/). |
| Google Chrome | `shopify theme dev`'s live preview and hot reload only work in Chrome. |

Install Shopify CLI, then confirm it works:

```bash
shopify version
```

If that command isn't found, `shopify` wasn't added to your shell's `PATH` correctly — reinstall following the [official CLI docs](https://shopify.dev/docs/api/shopify-cli) rather than troubleshooting `PATH` issues blind.

## Choose your AI-assisted editor

`AGENTS.md` (see [8b. Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) is deliberately tool-agnostic — it works with **Claude Code** (terminal-based, also embeds in VS Code), **Cursor** (a VS Code fork with built-in agent mode), and **VS Code + GitHub Copilot**. Pick one as your daily driver; the setup below covers all three so you can follow whichever your team actually uses, or set up more than one if you switch between them.

If any of the terms below — MCP, skill, plugin, subagent — are unfamiliar, read [8a. AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/) first. This page assumes you know what they mean; that page explains them from scratch.

### Setting up VS Code

| Extension | Marketplace ID | Why |
|---|---|---|
| **Shopify Liquid** | `Shopify.theme-check-vscode` | Syntax highlighting, autocomplete, and inline Theme Check linting for `.liquid` files. Not optional in practice — without it, Liquid files look like unstyled text and you lose inline diagnostics. Install from the [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) or search "Shopify Liquid" in the Extensions view. |
| **Prettier — Code formatter** | `esbenp.prettier-vscode` | Code formatting, paired with the [Liquid Prettier plugin](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) — see [Quality & Validation](/quality-validation/theme-check-and-linting/). |
| **Claude Code** | `anthropic.claude-code` | Anthropic's official extension — a native panel for Claude Code inside VS Code, if that's your primary AI tool. Requires the Claude Code CLI itself to also be installed (see below). |
| **GitHub Copilot** + **Copilot Chat** | `GitHub.copilot`, `GitHub.copilot-chat` | Only if Copilot is your team's AI tool instead of Claude Code/Cursor. Agent mode (not just inline suggestions) is what reads `AGENTS.md` and calls MCP tools. |

Enable format-on-save (`editor.formatOnSave: true` in VS Code settings) so Prettier actually runs automatically rather than being a manual step people forget.

**MCP servers in VS Code** live in a `.vscode/mcp.json` file at the repo root, under a `servers` key (not `mcpServers` — that's Cursor/Claude Code's key name; copy-pasting a Cursor config without changing this is the single most common MCP setup mistake). Easiest path: Command Palette → **MCP: Add Server** → follow the guided flow, which writes the file for you. See [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) and [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for the specific servers this handbook uses and their exact current install commands — don't hand-write server configs from memory, confirm against those pages.

### Setting up Cursor

Cursor's agent mode is built in — no separate extension needed for the core AI-assisted workflow. Cursor also reads `AGENTS.md` **natively** from the repo root; unlike VS Code + Copilot, there's no extra config file to add for project rules to load.

- **Shopify Liquid syntax/linting**: search "Shopify" in Cursor's Extensions panel first. If the official `Shopify.theme-check-vscode` extension isn't listed (Cursor's curated marketplace doesn't always mirror the full VS Code Marketplace), download the `.vsix` from its [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) and install it via Extensions panel → **⋯** menu → **Install from VSIX**. Confirm it's actually active by opening a `.liquid` file and checking for syntax highlighting and hover documentation, not just that the install succeeded.
- **Cursor's own Shopify plugin** (`cursor.com/marketplace/shopify`, inside Cursor Chat: `/add-plugin shopify`) is a separate thing from the extension above — it's Cursor's packaging of the Shopify AI Toolkit (skills + MCP), not a Liquid syntax extension. Install both; they do different jobs.
- **MCP servers in Cursor** live in `.cursor/mcp.json` (project-level, repo root) or `~/.cursor/mcp.json` (global, applies to every project), under an `mcpServers` key:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@some/mcp-server-package"],
      "env": { "SOME_API_KEY": "value" }
    }
  }
}
```

Project config takes precedence over global config for a server with the same name.

**Use project-level `.cursor/mcp.json` for this project, committed to the repo.** That way every teammate gets the same MCP servers (Shopify Dev MCP, Figma MCP) the moment they clone, with no manual per-person setup step and no drift between machines. Reserve `~/.cursor/mcp.json` (global) for servers that are genuinely personal and unrelated to this project — not for anything the whole team needs.

:::caution[Don't commit literal secrets]
If a server needs an API key or token, don't hardcode it into the committed `env` block above. Point it at your shell environment or a local, gitignored `.env` file instead — the config *structure* is shared and consistent across the team, but each person's actual credentials stay local and out of Git history.
:::

See [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) and [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for this project's actual server entries.

### Setting up Claude Code (terminal)

Install (native installer, recommended — auto-updates in the background):

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

npm is also supported (`npm install -g @anthropic-ai/claude-code`, requires Node 22+) but doesn't auto-update — prefer the native installer unless you have a specific reason not to. Confirm the current commands against [code.claude.com/docs/en/setup](https://code.claude.com/docs/en/setup) before running them; install commands for developer tools change.

Verify, then authenticate:

```bash
claude --version   # prints a version number, e.g. 2.1.211 (Claude Code)
claude doctor       # deeper install/config health check
claude              # starts an interactive session; follow the browser login prompt the first time
```

Then install the Shopify AI Toolkit plugin — this is what actually grounds Liquid/schema generation in Shopify's real, current docs instead of the model's training data:

```bash
claude plugin install shopify-ai-toolkit@claude-plugins-official
```

Full detail on what this plugin does, why it matters, and the other two install methods (agent skills, Dev MCP server) is in [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — don't duplicate that setup from memory, that page is kept current.

If you'll be pulling design context from Figma, also install Figma's plugin: `claude plugin install figma@claude-plugins-official` — see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/).

## `AGENTS.md` — the one file every tool above reads

Once your editor and AI tool are installed, the last piece is project context: `AGENTS.md` at the repo root, which Claude Code, Cursor, and Copilot all read (Cursor and Claude Code natively; Copilot via a symlinked `.github/copilot-instructions.md`). It's generated automatically by `shopify theme init`, and our project-specific additions live in its `## Custom rules` section. Full setup steps (new theme vs. existing repo) are in [8b. Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) — do that now if you haven't, since several checklist items below depend on it being in place.

## The pre-flight checklist

Don't just confirm each tool installed in isolation — confirm the whole chain actually works together before you start your first real task. Go through this in order; if something fails, fix it now. A broken dev environment discovered on day three costs far more than one caught on day one.

**Accounts & access**

- [ ] Shopify Partner account created, 2FA enabled
- [ ] Development store created and reachable from your Partner Dashboard
- [ ] Collaborator/staff access with "Manage themes" confirmed on the right store
- [ ] `git clone` succeeds against a real team repository you have access to

**Core software**

- [ ] `shopify version` returns a version number
- [ ] `node --version` returns a current LTS version (v22+ if Claude Code was installed via npm)
- [ ] `git --version` returns a version number
- [ ] Google Chrome is installed

**Editor**

- [ ] Editor installed (VS Code and/or Cursor)
- [ ] Shopify Liquid extension installed — open any `.liquid` file and confirm you see syntax highlighting, not plain text
- [ ] Deliberately introduce a typo (e.g. an unclosed `{%- if -%}`) and confirm Theme Check flags it inline, then revert the typo — this confirms linting is actually live, not just that the extension installed
- [ ] Format-on-save works — save a deliberately misformatted file and confirm Prettier reformats it automatically

**AI tooling**

- [ ] Primary AI tool installed and authenticated (`claude --version` succeeds and you're logged in, and/or Cursor's agent mode responds to a prompt, and/or Copilot Chat responds in VS Code)
- [ ] Shopify AI Toolkit installed (plugin, skill, or Dev MCP per [8d](/ai-assisted-development/shopify-ai-toolkit/)) — this is easy to skip since the editor extension above already gives you syntax highlighting, but the toolkit is what actually grounds *generated code* in real docs
- [ ] `AGENTS.md` present at the repo root with our `## Custom rules` section filled in (not just Shopify's generated default)
- [ ] Figma MCP connected, if you'll be converting Figma designs to code (see [8e](/ai-assisted-development/figma-mcp-and-dev-mode/))

**End-to-end smoke test**

- [ ] `shopify theme dev --store <your-dev-store>` (see [Your First Preview](/getting-started/first-preview/)) opens a working live preview in Chrome
- [ ] Ask your AI tool a Solis-specific question it could only get right by actually reading `AGENTS.md` — e.g. "what base theme do we scaffold from?" — and confirm it answers "Skeleton Theme," not a guess or "Dawn"
- [ ] Ask your AI tool to add a new theme block and confirm it produces a file in `blocks/` with `@theme`/`@app` targeting, not an old-style inline block defined directly in a section's schema

If any single item above fails, resolve it before opening your first PR — trace it back to the specific setup step it depends on rather than working around it.

## Best practices

- Use a dedicated development store per developer, not one shared dev store the whole team pushes to — conflicting local previews on a shared store cause confusing, hard-to-reproduce bugs.
- Keep Shopify CLI and your AI tool updated (`npm install -g @shopify/cli@latest`; Claude Code's native installer auto-updates on its own) — theme features, Theme Check rules, and AI tooling all evolve, and an outdated version can silently miss new checks or capabilities.
- Set up 2FA on your Partner account immediately — Partner accounts have billing and submission access, and losing one to account compromise is a genuinely bad day.
- Run the full pre-flight checklist even if you're an experienced Shopify developer joining this specific project — the AI tooling and `AGENTS.md` steps are project-specific, not generic Shopify knowledge you'd already have.

## Common mistakes

- **Trying to preview in Safari or Firefox and assuming something is broken.** `shopify theme dev`'s hot-reload preview is Chrome-only by design — this is a known, documented limitation, not a bug in your setup.
- **Skipping the dev store and testing directly against a live/production store.** Development themes are cheap and disposable; live stores are not the place to find out a section breaks with real data.
- **Installing Shopify CLI without Node, or with a very old Node version.** Confirm your Node version is current LTS before troubleshooting CLI install issues that are actually Node version issues in disguise.
- **Confusing the Shopify Liquid *editor extension* with the Shopify AI Toolkit.** The extension gives you syntax highlighting and Theme Check linting as you type. The toolkit is what grounds an AI tool's *generated* code in real docs. Installing one doesn't give you the other — see the checklist above.
- **Copy-pasting an MCP config between VS Code and Cursor/Claude Code without changing the root key.** VS Code uses `servers`; Cursor and Claude Code use `mcpServers`. This is the most common reason a pasted MCP config silently does nothing.
- **Assuming Cursor's Extensions panel has every VS Code extension.** It doesn't always mirror the full Marketplace — confirm the Shopify Liquid extension is actually active in a `.liquid` file rather than assuming the install succeeded.

## Quick Reference

- You need: a Partner account, a dev store, Shopify CLI, Node, Git, Chrome, and one AI-assisted editor (Claude Code, Cursor, and/or VS Code + Copilot).
- VS Code: `Shopify.theme-check-vscode` + Prettier + `anthropic.claude-code` (or Copilot). MCP config: `.vscode/mcp.json`, key `servers`.
- Cursor: agent mode built in, reads `AGENTS.md` natively, Shopify Liquid extension may need manual VSIX install. MCP config: project-level `.cursor/mcp.json` (committed, key `mcpServers`) for team-shared servers; global `~/.cursor/mcp.json` only for personal, non-project servers. Never commit literal secrets — use env vars.
- Claude Code: `curl -fsSL https://claude.ai/install.sh | bash`, then `claude plugin install shopify-ai-toolkit@claude-plugins-official`.
- `shopify theme dev` preview only works in Chrome.
- Run the full [pre-flight checklist](#the-pre-flight-checklist) before your first real task — verify the whole chain, not each tool in isolation.

## Further Reading

- [Shopify CLI documentation](https://shopify.dev/docs/api/shopify-cli) — shopify.dev
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) — shopify.dev
- [Shopify Liquid VS Code extension](https://shopify.dev/docs/storefronts/themes/tools/shopify-liquid-vscode) — shopify.dev
- [Claude Code installation](https://code.claude.com/docs/en/setup) — code.claude.com, the authoritative install instructions
- [8a. AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/) — MCP/skill/command/subagent/plugin vocabulary used throughout this page
- [8b. Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) — the full `AGENTS.md` setup this page's checklist depends on
- [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — exact, current install commands for the toolkit
- [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) — Figma MCP setup for both Claude Code and Cursor
