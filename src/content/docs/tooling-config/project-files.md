---
title: Project Files Explained
description: What .gitignore, .shopifyignore, .theme-check.yml, .github, AGENTS.md/CLAUDE.md, and README.md each actually do.
---

**TL;DR:** What .gitignore, .shopifyignore, .theme-check.yml, .github, AGENTS.md/CLAUDE.md, and README.md each actually do.

None of these files change what shows up on your storefront. They exist to make the repo a good place to work, for both people and AI tools. If you know what each file actually does, it won't turn into boilerplate.

## `.gitignore` — keeps files out of Git history

This file uses standard Git ignore rules. For a theme repo, `.gitignore` usually covers editor and operating system clutter, plus anything a build setup generates (see [Tailwind & Alpine Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) if you're using one):

```gitignore
# OS/editor noise
.DS_Store
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# Shopify CLI
.shopify/

# Only relevant if using a Node-based build setup
node_modules/
dist/
.env
```

**This only affects Git.** A file excluded here never enters version control. But that's a separate question from whether it ends up in a Theme Store submission zip. See `.shopifyignore` below for that.

Notice `.vscode/` isn't fully ignored here. `settings.json` and `extensions.json` are deliberately allow-listed and committed, so every teammate gets the same formatter, format-on-save, and recommended-extensions prompt the moment they clone the repo, instead of configuring it by hand or not at all. Everything else in `.vscode/` (like a personal `launch.json`) stays ignored. See [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) for what actually goes in those two files.

## `.shopifyignore` — keeps files out of CLI operations and packaging

Most teams don't know this file exists until they need it. The Shopify CLI reads `.shopifyignore`, using the same pattern syntax as `.gitignore`, whenever you push, pull, share a preview, or package a theme. Any file that matches a pattern here gets excluded from those operations, separately from whatever `.gitignore` does for Git.

```
# .shopifyignore
node_modules/
src/
*.config.js
.github/
AGENTS.md
CLAUDE.md
.cursor/
.claude/
.mcp.json
scripts/
README.md
```

This is the mechanism behind [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/). Check that page for the full list and workflow.

:::caution
`.shopifyignore` and `--ignore` both exclude files, but they apply to slightly different operations. Check the current [Shopify CLI docs](https://shopify.dev/docs/storefronts/themes/tools/cli) before relying on either one for something submission-critical, since CLI behavior here has changed across versions.
:::

## `.theme-check.yml` — configures the linter

This file controls which [Theme Check](/quality-validation/theme-check-and-linting/) rules run. `.theme-check.yml` also sets how serious each rule is, and which paths it should skip:

```yaml
# .theme-check.yml
extends: theme-check:recommended
ignore:
  - node_modules/**
  - src/**

MissingTemplate:
  enabled: true
LiquidHTMLSyntaxError:
  severity: error
```

Theme Check also reads `.gitignore` to decide what to scan, so a `node_modules` folder won't get linted as if it were theme code. Even so, it's still worth keeping an explicit `.theme-check.yml` ignore list too. It spells out your intent clearly, instead of relying on a side effect of `.gitignore`.

## `.github/` — CI and repo metadata

Three things usually live here: automatic checks that run on every pull request (CI), a template for pull request descriptions, and a rule file for GitHub Copilot.

| Path | Purpose |
|---|---|
| `.github/workflows/ci.yml` | Runs Prettier's `format:check` and `Shopify/theme-check-action` on every pull request. See [CI Automation](/github-workflow/ci-automation/) |
| `.github/PULL_REQUEST_TEMPLATE.md` | The checklist every pull request description starts from. See [Pull Requests & Review](/github-workflow/pull-requests-and-review/) |
| `.github/copilot-instructions.md` | Copilot's rule file. It's a symlink to `AGENTS.md`. See [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) |

None of this affects your storefront. All of it should be excluded from a Theme Store submission (see `.shopifyignore` above).

## `AGENTS.md` / `CLAUDE.md` / `.cursor/` / `.claude/` — AI tooling config

This topic is covered in full in [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) and [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/). Here's the short version.

`AGENTS.md` is the single source of truth: the one file that actually holds your AI rules. `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks to it. A symlink is a pointer to the original file, not a copy of it, so all three names really point to the same content. The `shopify theme init` command or the `scripts/generate-ai-rules.mjs` script creates these symlinks for you.

Cursor reads `AGENTS.md` directly. `.cursor/rules/*.mdc` and `.cursorrules` are optional, older, hand-maintained alternatives, for teams who want rules that only auto-attach in certain folders. `.claude/commands/` holds custom slash commands, which are shortcuts you type to run a saved prompt in Claude Code.

## `.mcp.json` / `.cursor/mcp.json` / `.vscode/mcp.json` — committed MCP server config

Claude Code, Cursor, and VS Code each support a project-scoped MCP config file, alongside the personal, per-machine setup each tool also allows. Commit these and a teammate has the project's MCP servers (Figma MCP, Shopify's Dev MCP) registered the moment they clone the repo, instead of everyone running the same manual setup individually. See [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for what's actually in these files and the [download links](/templates/mcp.json).

This doesn't remove every per-person step: Claude Code still prompts each person to approve a project-scoped server the first time they use it, and a server like Figma's still needs each person to sign in with their own account. What it removes is the setup itself, the part that's identical for everyone and easy to forget to tell a new teammate about.

## `README.md` — orientation for a new developer

No tool reads this file. It's purely for people. A good theme repo README briefly covers:

- What this theme is, with a link to this handbook for anything deeper.
- How to get a local preview running (`shopify theme dev`).
- Where to find the AI rules (`AGENTS.md`) and custom commands (`.claude/commands/`).
- A link to the current Theme Store submission status or timeline, if that's relevant.

| ✅ Good README scope | ❌ Bad README scope |
|---|---|
| A quick-start (clone, install, `theme dev`) plus links to deeper docs | Duplicating this entire handbook's content inline |
| Kept current when setup steps change | Written once at project start and never revisited as tooling changes |

## Best practices

- Treat `.shopifyignore` as a file you actively maintain, not an afterthought. Every new dev-tooling file or folder should prompt the question: "does this need to go in `.shopifyignore` too?"
- Keep `.theme-check.yml`'s ignore list in sync with `.gitignore`'s build-output entries. Theme Check already reads `.gitignore`, but an explicit list still documents your intent for the next developer.
- Keep `README.md` a quick-start plus links, not a copy of this handbook. A README that tries to cover everything goes stale fast, and nobody keeps two copies of the same information up to date.

## Common mistakes

- **Not knowing `.shopifyignore` exists**, and only discovering at submission time that dev-tooling files ended up in a theme zip.
- **Mixing up what `.gitignore` and `.shopifyignore` each cover.** Excluding something from Git history doesn't exclude it from a CLI push or package operation, and the other way around isn't true either.
- **Letting `README.md` and this handbook drift apart.** A stale local README that contradicts the current handbook confuses new developers about which one to trust.

## Key takeaways
- `.gitignore` covers Git history. `.shopifyignore` covers CLI push/pull/package operations. They do different jobs, and you need both.
- `.theme-check.yml` sets the linter's rules and which paths it ignores.
- `.github/` holds CI, the pull request template, and Copilot's rule file (a symlink to `AGENTS.md`).
- `AGENTS.md` is the AI-rules source of truth (see Setting Up AI Rules).
- `.mcp.json` / `.cursor/mcp.json` / `.vscode/mcp.json` are committed, project-scoped MCP server config (see Figma MCP & Dev Mode). Each person still approves and authenticates once.
- `README.md` is a quick-start for people, not a copy of this handbook.

## Further reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) (shopify.dev)
- [Theme Check configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
