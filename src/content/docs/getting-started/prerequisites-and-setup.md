---
title: Prerequisites & Setup
description: Everything you need installed, connected, and verified (accounts, editor, and AI tooling) before writing a single line of code.
---

This page is your full setup checklist. It covers accounts, core software, your editor (VS Code and/or Cursor), and the AI tools this handbook assumes you have (Claude Code, the Shopify AI Toolkit, and MCP).

Work through this page from top to bottom, once. Then run the [pre-flight checklist](#the-pre-flight-checklist) at the end. That confirms everything actually works together, not just that each piece installed on its own.

## Accounts you need

- **Shopify Partner account**: this is free, and you need it to create development stores and submit themes. Sign up at [partners.shopify.com](https://www.shopify.com/partners). See [Partner Dashboard Setup](/publishing/partner-dashboard-setup/) if you don't have one yet.
- **A development store**: a free, private Shopify store just for building and testing (it's separate from any real, live store). Create one from your Partner Dashboard.
- **Collaborator or staff access** with the "Manage themes" permission on whichever store you'll be pushing theme code to.
- **GitHub access** to the team's repositories.
- **An Anthropic account** (Pro, Max, Team, or Enterprise plan, or a Console/API account), if you're using Claude Code. Note that the free claude.ai plan doesn't include Claude Code access.

## Core software (any editor, any AI tool)

| Tool | Why |
|---|---|
| [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) | Scaffolds themes, runs a local dev server, pushes/pulls theme code. |
| Node.js (current LTS version, **v22+** if you'll install Claude Code via npm) | Required by Shopify CLI, Theme Check, and any local tooling (ESLint, Prettier). |
| Git | Version control. See [GitHub Workflow](/github-workflow/). |
| Google Chrome | `shopify theme dev`'s live preview and hot reload only work in Chrome. |

Install Shopify CLI, then confirm it works:

```bash
shopify version
```

If that command isn't found, it means `shopify` wasn't added to your shell's `PATH` correctly (`PATH` is the list of folders your computer checks when you type a command). Reinstall by following the [official CLI docs](https://shopify.dev/docs/api/shopify-cli) instead of guessing at how to fix the `PATH` yourself.

## Choose your AI-assisted editor

`AGENTS.md` (see [8b. Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) is a file that gives your AI tool context about this project, and it works with any of the tools below, not just one. Your options are **Claude Code** (runs in your terminal, and can also embed in VS Code), **Cursor** (a VS Code fork with a built-in AI agent mode), and **VS Code + GitHub Copilot**.

Pick one of these as your daily driver. The setup steps below cover all three, so follow whichever one your team actually uses, or set up more than one if you like to switch between them.

If any of the terms below (MCP, skill, plugin, subagent) are new to you, read [8a. AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/) first. This page assumes you already know what they mean. That other page explains them from scratch.

### Setting up VS Code

| Extension | Marketplace ID | Why |
|---|---|---|
| **Shopify Liquid** | `Shopify.theme-check-vscode` | Syntax highlighting, autocomplete, and inline Theme Check linting for `.liquid` files. In practice, this isn't optional: without it, Liquid files look like plain, unstyled text, and you lose inline diagnostics (warnings and errors shown right in your code). Install from the [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) or search "Shopify Liquid" in the Extensions view. |
| **Prettier (Code formatter)** | `esbenp.prettier-vscode` | Code formatting, paired with the [Liquid Prettier plugin](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin). See [Quality & Validation](/quality-validation/theme-check-and-linting/). |
| **Claude Code** | `anthropic.claude-code` | Anthropic's official extension. It adds a native panel for Claude Code inside VS Code, if that's your primary AI tool. It requires the Claude Code CLI itself to also be installed (see below). |
| **GitHub Copilot** + **Copilot Chat** | `GitHub.copilot`, `GitHub.copilot-chat` | Only if Copilot is your team's AI tool instead of Claude Code/Cursor. Agent mode (not just inline suggestions) is what reads `AGENTS.md` and calls MCP tools. |

Turn on format-on-save (`editor.formatOnSave: true` in VS Code settings). That way Prettier runs automatically instead of being a manual step people forget.

**MCP servers in VS Code** live in a `.vscode/mcp.json` file at the repo root, under a `servers` key. This is different from Cursor and Claude Code, which both use a `mcpServers` key instead. Copying a Cursor config without changing this key is the single most common MCP setup mistake, so watch out for it.

The easiest path is: Command Palette → **MCP: Add Server** → follow the guided flow, which writes the file for you. See [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) and [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for the exact servers and install commands this handbook uses. Don't write server configs from memory, check those pages first.

### Setting up Cursor

Cursor's agent mode is built in, so you don't need a separate extension for the core AI-assisted workflow. Cursor also reads `AGENTS.md` **natively** from the repo root. Unlike VS Code + Copilot, there's no extra config file needed for your project rules to load.

- **Shopify Liquid syntax and linting**: search "Shopify" in Cursor's Extensions panel first. If the official `Shopify.theme-check-vscode` extension isn't listed (Cursor's extension marketplace doesn't always have everything the VS Code Marketplace has), download the `.vsix` file from its [VS Code Marketplace page](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) instead. Install it via Extensions panel → **⋯** menu → **Install from VSIX**. Then confirm it's actually working by opening a `.liquid` file and checking for syntax highlighting and hover documentation. Don't just assume the install worked.
- **Cursor's own Shopify plugin** (`cursor.com/marketplace/shopify`, or inside Cursor Chat: `/add-plugin shopify`) is a different thing from the extension above. It's Cursor's version of the Shopify AI Toolkit (skills + MCP), not a Liquid syntax extension. Install both, since they do different jobs.
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

**Use project-level `.cursor/mcp.json` for this project, and commit it to the repo.** That way every teammate gets the same MCP servers (Shopify Dev MCP, Figma MCP) the moment they clone the repo. There's no manual setup per person, and no drift between machines. Save `~/.cursor/mcp.json` (global) for servers that are truly personal and not related to this project, not for anything the whole team needs.

:::caution[Don't commit literal secrets]
If a server needs an API key or token, don't type it directly into the committed `env` block above. Point it at your shell environment, or at a local `.env` file (add that file to `.gitignore`), instead. That way the config *structure* is shared across the team, but everyone's actual credentials stay on their own machine and out of Git history.
:::

See [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) and [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for this project's actual server entries.

### Setting up Claude Code (terminal)

Install using the native installer (recommended, since it auto-updates in the background):

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

You can also install it with npm (`npm install -g @anthropic-ai/claude-code`, requires Node 22+), but that version doesn't auto-update. Use the native installer unless you have a specific reason not to. Double check the current commands at [code.claude.com/docs/en/setup](https://code.claude.com/docs/en/setup) before running them, since install commands for developer tools change over time.

Verify, then authenticate:

```bash
claude --version   # prints a version number, e.g. 2.1.211 (Claude Code)
claude doctor       # deeper install/config health check
claude              # starts an interactive session; follow the browser login prompt the first time
```

Then install the Shopify AI Toolkit plugin. This makes sure the Liquid and schema code your AI tool generates is based on Shopify's real, current docs, not just guesses from the model's training data:

```bash
claude plugin install shopify-ai-toolkit@claude-plugins-official
```

For full detail on what this plugin does, why it matters, and the other two ways to install it (agent skills, Dev MCP server), see [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/). Don't set it up from memory, that page is kept up to date.

If you'll be pulling design details from Figma, also install Figma's plugin: `claude plugin install figma@claude-plugins-official`. See [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/).

## `AGENTS.md` — the one file every tool above reads

Once your editor and AI tool are installed, the last piece is project context: a file called `AGENTS.md` at the repo root. Claude Code, Cursor, and Copilot all read this file. (Cursor and Claude Code read it directly. Copilot reads it through a symlinked `.github/copilot-instructions.md`.)

`AGENTS.md` is generated automatically by `shopify theme init`, and our project-specific rules live in its `## Custom rules` section. Full setup steps (for a new theme or an existing repo) are in [8b. Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/). Do that now if you haven't, since several checklist items below depend on it being in place.

## The pre-flight checklist

Don't just check that each tool installed on its own. Confirm the whole chain works together before you start your first real task. Go through this in order, and if something fails, fix it right away. A broken setup you catch on day three costs a lot more than one you catch on day one.

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
- [ ] Shopify Liquid extension installed. Open any `.liquid` file and confirm you see syntax highlighting, not plain text
- [ ] Deliberately introduce a typo (for example, an unclosed `{%- if -%}`) and confirm Theme Check flags it inline, then revert the typo. This confirms linting is actually live, not just that the extension installed.
- [ ] Format-on-save works. Save a deliberately misformatted file and confirm Prettier reformats it automatically

**AI tooling**

- [ ] Primary AI tool installed and authenticated (`claude --version` succeeds and you're logged in, and/or Cursor's agent mode responds to a prompt, and/or Copilot Chat responds in VS Code)
- [ ] Shopify AI Toolkit installed (plugin, skill, or Dev MCP, per [8d](/ai-assisted-development/shopify-ai-toolkit/)). It's easy to skip this, since the editor extension above already gives you syntax highlighting. But the toolkit is what makes sure *generated code* is based on real docs, not guesses.
- [ ] `AGENTS.md` present at the repo root with our `## Custom rules` section filled in (not just Shopify's generated default)
- [ ] Figma MCP connected, if you'll be converting Figma designs to code (see [8e](/ai-assisted-development/figma-mcp-and-dev-mode/))

**End-to-end smoke test**

- [ ] `shopify theme dev --store <your-dev-store>` (see [Your First Preview](/getting-started/first-preview/)) opens a working live preview in Chrome
- [ ] Ask your AI tool a Solis-specific question it could only get right by actually reading `AGENTS.md`, for example "what base theme do we scaffold from?" Confirm it answers "Skeleton Theme," not a guess like "Dawn."
- [ ] Ask your AI tool to add a new theme block and confirm it produces a file in `blocks/` with `@theme`/`@app` targeting, not an old-style inline block defined directly in a section's schema

If any single item above fails, resolve it before opening your first PR. Trace it back to the specific setup step it depends on, instead of just working around it.

## Best practices

- Give each developer their own development store. Don't share one dev store across the whole team, since conflicting local previews on a shared store cause confusing bugs that are hard to reproduce.
- Keep Shopify CLI and your AI tool up to date (`npm install -g @shopify/cli@latest`, and Claude Code's native installer updates itself automatically). Theme features, Theme Check rules, and AI tools all change over time, and an outdated version can silently miss new checks or features.
- Set up two-factor authentication (2FA) on your Partner account right away. Partner accounts have billing and submission access, so losing one to a hacked account is a genuinely bad day.
- Run the full pre-flight checklist even if you're an experienced Shopify developer joining this project. The AI tooling and `AGENTS.md` steps are specific to this project, not generic Shopify knowledge you'd already have.

## Common mistakes

- **Trying to preview in Safari or Firefox and assuming something is broken.** `shopify theme dev`'s hot-reload preview only works in Chrome, by design. This is a known limitation, not a bug in your setup.
- **Skipping the dev store and testing directly against a live or production store.** Development themes are free and disposable. A live store is not the place to find out a section breaks with real data.
- **Installing Shopify CLI without Node, or with a very old version of Node.** Check that your Node version is a current LTS version before you spend time troubleshooting a CLI install issue that's actually a Node version issue in disguise.
- **Confusing the Shopify Liquid *editor extension* with the Shopify AI Toolkit.** The extension gives you syntax highlighting and Theme Check linting as you type. The toolkit is what makes sure an AI tool's *generated* code is based on real docs, not guesses. Installing one doesn't give you the other. See the checklist above.
- **Copy-pasting an MCP config between VS Code and Cursor/Claude Code without changing the root key.** VS Code uses `servers`. Cursor and Claude Code use `mcpServers`. This is the most common reason a pasted MCP config silently does nothing.
- **Assuming Cursor's Extensions panel has every VS Code extension.** It doesn't always have everything the full Marketplace has. Confirm the Shopify Liquid extension is actually active in a `.liquid` file instead of assuming the install worked.

## Quick Reference

- You need: a Partner account, a dev store, Shopify CLI, Node, Git, Chrome, and one AI-assisted editor (Claude Code, Cursor, and/or VS Code + Copilot).
- VS Code: `Shopify.theme-check-vscode` + Prettier + `anthropic.claude-code` (or Copilot). MCP config: `.vscode/mcp.json`, key `servers`.
- Cursor: agent mode built in, reads `AGENTS.md` natively, Shopify Liquid extension may need manual VSIX install. MCP config: project-level `.cursor/mcp.json` (committed, key `mcpServers`) for team-shared servers, and global `~/.cursor/mcp.json` only for personal, non-project servers. Never commit literal secrets, use env vars instead.
- Claude Code: `curl -fsSL https://claude.ai/install.sh | bash`, then `claude plugin install shopify-ai-toolkit@claude-plugins-official`.
- `shopify theme dev` preview only works in Chrome.
- Run the full [pre-flight checklist](#the-pre-flight-checklist) before your first real task. Verify the whole chain works, not just each tool in isolation.

## Further Reading

- [Shopify CLI documentation](https://shopify.dev/docs/api/shopify-cli) (shopify.dev)
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) (shopify.dev)
- [Shopify Liquid VS Code extension](https://shopify.dev/docs/storefronts/themes/tools/shopify-liquid-vscode) (shopify.dev)
- [Claude Code installation](https://code.claude.com/docs/en/setup) (code.claude.com, the authoritative install instructions)
- [8a. AI Coding Concepts](/ai-assisted-development/ai-coding-concepts/) (MCP/skill/command/subagent/plugin vocabulary used throughout this page)
- [8b. Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) (the full `AGENTS.md` setup this page's checklist depends on)
- [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) (exact, current install commands for the toolkit)
- [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) (Figma MCP setup for both Claude Code and Cursor)
