---
title: "Packaging: Theme Store-Only Directories"
description: Submitting only the 8 required theme folders, and keeping every dev-tooling file out of the zip.
---

Your working repo contains far more than Shopify wants in a submission — Git config, AI rule files, CI workflows, maybe a whole Tailwind/Alpine build setup. This page is the concrete workflow for making sure only the required theme structure ends up in the zip you submit.

## The 8 folders Shopify actually wants

```
assets/
blocks/
config/
layout/
locales/
sections/
snippets/
templates/
```

See [Folder Structure](/codebase-structure/folder-structure/) for what belongs in each. Everything else in your repo is a candidate for exclusion.

## Everything that should never reach the submission zip

| Category | Examples |
|---|---|
| Version control | `.git/`, `.gitignore` |
| AI tooling | `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `.claude/`, `.cursorrules` |
| CI/CD and repo metadata | `.github/` |
| Linter config | `.theme-check.yml` |
| Build setup (if using one) | `package.json`, `node_modules/`, `src/`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, any `.env*` |
| Editor/OS noise | `.vscode/`, `.DS_Store` |
| Docs | `README.md`, this handbook itself |
| Explicitly disallowed by Shopify | `config/markets.json` (see [Packaging & Submitting](/publishing/packaging-and-submitting/)) |

## The mechanism: `.shopifyignore`

```
# .shopifyignore — everything below is excluded from CLI push/pull/package operations
.git/
.github/
.cursor/
.claude/
AGENTS.md
CLAUDE.md
.cursorrules
.theme-check.yml
README.md
node_modules/
src/
package.json
package-lock.json
vite.config.js
tailwind.config.js
postcss.config.js
.env
.env.*
.vscode/
```

`shopify theme package` (and `push`/`pull`) respect this file the same way `.gitignore` scopes what Git tracks — but it's a separate file with a separate purpose, see [Project Files Explained](/tooling-config/project-files/) for why the two aren't interchangeable.

## The end-to-end packaging workflow

1. Confirm `.shopifyignore` is current — any new dev-tooling file/folder added since the last submission should be checked against this list *as part of adding it*, not remembered later.
2. Run `shopify theme package` (or build your zip via your existing process) from a clean checkout — ideally a fresh clone, not your local working directory, so nothing untracked (a stray local file, an uncommitted experiment) accidentally rides along.
3. Unzip the result somewhere temporary and manually verify: only the 8 folders (plus root-level files Shopify does expect, like `settings_schema.json` inside `config/`) are present.
4. Run through the [pre-zip sanity pass](/publishing/packaging-and-submitting/#a-pre-zip-sanity-pass) — no `config/markets.json`, no demo-store-specific resource references.
5. Submit.

| ✅ Do | ❌ Don't |
|---|---|
| Package from a clean clone, not your local working directory | Zip your local folder directly, risking uncommitted/untracked dev files riding along |
| Verify the unzipped contents manually before every submission, not just the first one | Assume `.shopifyignore` is still correct after months of adding new tooling without re-checking it |
| Update `.shopifyignore` in the same commit/PR that adds a new dev-tooling file | Add a new GitHub Action or AI rule file and forget to also exclude it |

## A worked example: what a build-setup team specifically needs to exclude

If you're using the [Tailwind/Alpine build setup](/tooling-config/tailwind-and-alpine-build-setup/), your repo has an entire `src/` frontend source tree and a `node_modules/` folder that don't exist in a plain theme — both need to be in `.shopifyignore`, and the *compiled output* (which does need to ship) needs to land inside `assets/`, not `dist/` or wherever your bundler writes it by default. Confirm your bundler's output path is actually `assets/` (or that your build step copies it there) before assuming `.shopifyignore` alone handles this — an ignored `dist/` folder that never gets copied into `assets/` means the compiled CSS/JS simply doesn't ship at all.

## Best practices

- Treat `.shopifyignore` maintenance as part of adding any new dev-tooling file, not a separate cleanup task to remember later.
- Package from a fresh clone before every submission — this catches anything untracked that a local working directory might carry silently.
- If using a build setup, explicitly verify the compiled output lands in `assets/` — don't assume it does just because the build succeeds locally.

## Common mistakes

- **Zipping a local working directory directly**, including untracked or `.gitignore`d-but-not-`.shopifyignore`d files that shouldn't ship.
- **Letting `.shopifyignore` go stale** as new tooling is added over a project's life, discovered only when a reviewer notices a `node_modules` folder in a submitted zip.
- **Assuming a build setup's ignored source folder means the compiled output is handled too** — the source being excluded and the output actually reaching `assets/` are two different things that both need verifying.

## Quick Reference

- Only `assets/`, `blocks/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` should reach a submission.
- `.shopifyignore` is the mechanism — list every dev-tooling file/folder there, and keep it current as tooling changes.
- Package from a clean clone, unzip and manually verify before every submission.
- A build setup adds two things to check: its source tree is ignored, and its compiled output actually lands in `assets/`.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) — shopify.dev
- [Structuring your theme zip](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip) — shopify.dev
