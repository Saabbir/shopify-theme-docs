---
title: Project Files Explained
description: What .gitignore, .shopifyignore, .theme-check.yml, .github, AGENTS.md/CLAUDE.md, and README.md each actually do.
---

None of these files change what shows up on your storefront. They exist to make the repo (short for repository, the folder that holds all your project's files and its history) a good place to work, for both people and AI tools. If you know what each file actually does, it won't turn into boilerplate (setup code that got copied in once and that nobody understands anymore).

## `.gitignore` — keeps files out of Git history

This file uses standard Git ignore rules. Git is the version control system that tracks changes to your code over time. For a theme repo, `.gitignore` usually covers editor and operating system clutter, plus anything a build setup generates (see [Tailwind & Alpine Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) if you're using one):

```gitignore
# OS/editor noise
.DS_Store
.vscode/

# Shopify CLI
.shopify/

# Only relevant if using a Node-based build setup
node_modules/
dist/
.env
```

**This only affects Git.** A file excluded here never enters version control (the saved history of changes to your project). But that's a separate question from whether it ends up in a Theme Store submission zip. See `.shopifyignore` below for that.

## `.shopifyignore` — keeps files out of CLI operations and packaging

Most teams don't know this file exists until they need it. The Shopify CLI (the command-line tool you use to develop and manage themes) reads `.shopifyignore`, using the same pattern syntax as `.gitignore`, whenever you push, pull, share a preview, or package a theme. Any file that matches a pattern here gets excluded from those operations, separately from whatever `.gitignore` does for Git.

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
scripts/
README.md
```

This is the mechanism behind [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/). Check that page for the full list and workflow.

:::caution
`.shopifyignore` and `--ignore` (a CLI flag, meaning an option you add when typing a command) both exclude files, but they apply to slightly different operations. Check the current [Shopify CLI docs](https://shopify.dev/docs/storefronts/themes/tools/cli) before relying on either one for something submission-critical, since CLI behavior here has changed across versions.
:::

## `.theme-check.yml` — configures the linter

This file controls which [Theme Check](/quality-validation/theme-check-and-linting/) rules run. A linter is a tool that scans your code for mistakes and style problems before it ships. `.theme-check.yml` also sets how serious each rule is, and which paths (files and folders) it should skip:

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

Theme Check also reads `.gitignore` to decide what to scan, so a `node_modules` folder (a folder full of installed packages from a build setup) won't get linted as if it were theme code. Even so, it's still worth keeping an explicit `.theme-check.yml` ignore list too. It spells out your intent clearly, instead of relying on a side effect of `.gitignore`.

## `.github/` — CI and repo metadata

Three things usually live here: automatic checks that run on every pull request (called CI, short for continuous integration), a template for pull request descriptions, and a rule file for GitHub Copilot (an AI coding assistant).

| Path | Purpose |
|---|---|
| `.github/workflows/theme-check.yml` | Runs `Shopify/theme-check-action` on every pull request. See [CI Automation](/github-workflow/ci-automation/) |
| `.github/PULL_REQUEST_TEMPLATE.md` | The checklist every pull request description starts from. See [Pull Requests & Review](/github-workflow/pull-requests-and-review/) |
| `.github/copilot-instructions.md` | Copilot's rule file. It's a symlink (a pointer to another file, not a copy) to `AGENTS.md`. See [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) |

None of this affects your storefront. All of it should be excluded from a Theme Store submission (see `.shopifyignore` above).

## `AGENTS.md` / `CLAUDE.md` / `.cursor/` / `.claude/` — AI tooling config

This topic is covered in full in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) and [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/). Here's the short version.

`AGENTS.md` is the single source of truth: the one file that actually holds your AI rules. `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks to it. A symlink is a pointer to the original file, not a copy of it, so all three names really point to the same content. The `shopify theme init` command or the `scripts/generate-ai-rules.mjs` script creates these symlinks for you.

Cursor (an AI code editor) reads `AGENTS.md` directly. `.cursor/rules/*.mdc` and `.cursorrules` are optional, older, hand-maintained alternatives, for teams who want rules that only auto-attach in certain folders. `.claude/commands/` holds custom slash commands, which are shortcuts you type to run a saved prompt in Claude Code.

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

## Quick Reference

- `.gitignore` covers Git history. `.shopifyignore` covers CLI push/pull/package operations. They do different jobs, and you need both.
- `.theme-check.yml` sets the linter's rules and which paths it ignores.
- `.github/` holds CI, the pull request template, and Copilot's rule file (a symlink to `AGENTS.md`).
- `AGENTS.md` is the AI-rules source of truth (see Setting Up AI Rules).
- `README.md` is a quick-start for people, not a copy of this handbook.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) (shopify.dev)
- [Theme Check configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
