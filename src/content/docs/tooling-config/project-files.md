---
title: Project Files Explained
description: What .gitignore, .shopifyignore, .theme-check.yml, .github, AGENTS.md/CLAUDE.md, and README.md each actually do.
---

These files don't affect the storefront at all — they exist entirely to make the repo a good place to work, for humans and AI tools alike. Knowing what each one is actually for keeps them from turning into cargo-culted boilerplate nobody understands.

## `.gitignore` — keeps files out of Git history

Standard Git ignore rules. For a theme repo, this typically covers editor/OS noise and anything a build setup generates (see [Tailwind & Alpine Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) if you're using one):

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

**Scope: Git only.** A file excluded here never enters version control, but that's a separate concern from whether it ends up in a Theme Store submission zip — see `.shopifyignore` below.

## `.shopifyignore` — keeps files out of CLI operations and packaging

This is the one most teams don't know about until they need it. Shopify CLI respects `.shopifyignore` (same glob syntax as `.gitignore`) when pushing, pulling, sharing a preview, or packaging a theme — files matched here are excluded from those operations, separate from whatever `.gitignore` does for Git.

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

This is the mechanism behind [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/) — see that page for the full list and workflow.

:::caution
`.shopifyignore` and `--ignore` (a CLI flag) both exclude files, but from slightly different operations — check the current [Shopify CLI docs](https://shopify.dev/docs/storefronts/themes/tools/cli) before relying on either for something submission-critical, since CLI behavior here has changed across versions.
:::

## `.theme-check.yml` — configures the linter

Controls which [Theme Check](/quality-validation/theme-check-and-linting/) rules run and at what severity, and which paths it ignores:

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

Theme Check also respects `.gitignore` for what it scans, so a `node_modules` folder from a build setup doesn't get needlessly linted as if it were theme code — but an explicit `.theme-check.yml` ignore list is worth keeping too, since it documents intent rather than relying on a side effect of `.gitignore`.

## `.github/` — CI and repo metadata

Three things typically live here:

| Path | Purpose |
|---|---|
| `.github/workflows/theme-check.yml` | Runs `Shopify/theme-check-action` on every PR — see [CI Automation](/github-workflow/ci-automation/) |
| `.github/PULL_REQUEST_TEMPLATE.md` | The checklist every PR description starts from — see [Pull Requests & Review](/github-workflow/pull-requests-and-review/) |
| `.github/copilot-instructions.md` | Copilot's rule file — a symlink to `AGENTS.md`, not a separate copy — see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) |

None of this affects the storefront. All of it should be excluded from a Theme Store submission (see `.shopifyignore` above).

## `AGENTS.md` / `CLAUDE.md` / `.cursor/` / `.claude/` — AI tooling config

Covered in full in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) and [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/). The short version: `AGENTS.md` is the single source of truth. `CLAUDE.md` and `.github/copilot-instructions.md` are **symlinks** to it (created by `shopify theme init` or `scripts/generate-ai-rules.mjs`) — literally the same file, not separate content. Cursor reads `AGENTS.md` directly; `.cursor/rules/*.mdc` and `.cursorrules` are optional, hand-maintained legacy alternatives for teams wanting scoped auto-attach. `.claude/commands/` holds custom slash commands.

## `README.md` — orientation for a new developer

Not read by any tool — purely for humans. A good theme repo README covers, briefly:

- What this theme is, and a link to this handbook for anything deeper.
- How to get a local preview running (`shopify theme dev`).
- Where to find the AI rules (`AGENTS.md`) and custom commands (`.claude/commands/`).
- A link to the current Theme Store submission status/timeline, if relevant.

| ✅ Good README scope | ❌ Bad README scope |
|---|---|
| A quick-start (clone, install, `theme dev`) plus links to deeper docs | Duplicating this entire handbook's content inline |
| Kept current when setup steps change | Written once at project start and never revisited as tooling changes |

## Best practices

- Treat `.shopifyignore` as a first-class file to maintain, not an afterthought — every new dev-tooling file/folder should prompt "does this need to go in `.shopifyignore` too?"
- Keep `.theme-check.yml`'s ignore list in sync with `.gitignore`'s build-output entries, even though Theme Check already respects `.gitignore` — an explicit list documents intent for the next developer.
- Keep `README.md` a quick-start plus links, not a duplicate of this handbook — a README that tries to be comprehensive becomes stale fast and nobody maintains two copies of the same information.

## Common mistakes

- **Not knowing `.shopifyignore` exists** and discovering only at submission time that dev-tooling files ended up in a theme zip.
- **Confusing `.gitignore` and `.shopifyignore`'s scopes** — excluding something from Git history doesn't exclude it from a CLI push/package operation, and vice versa.
- **Letting `README.md` and this handbook diverge** — a stale local README contradicting the current handbook confuses new developers about which is authoritative.

## Quick Reference

- `.gitignore` → Git history. `.shopifyignore` → CLI push/pull/package operations. Different scopes, both needed.
- `.theme-check.yml` configures the linter's rules and ignored paths.
- `.github/` holds CI, PR template, and Copilot's rule file (a symlink to `AGENTS.md`).
- `AGENTS.md` is the AI-rules source of truth (see Setting Up AI Rules).
- `README.md` is a human quick-start, not a duplicate of this handbook.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) — shopify.dev
- [Theme Check configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
