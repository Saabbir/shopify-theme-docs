---
title: "Packaging: Theme Store-Only Directories"
description: How to submit only the 8 required theme folders, and keep every dev tooling file out of the zip.
---

Your working repo (the folder where you write and store your code) holds far more than Shopify wants to see in a submission. It has Git config, AI rule files, CI workflows, and maybe a whole Tailwind or Alpine build setup too.

None of that extra stuff should end up in your submission zip. This page walks you through the steps for making sure only the required theme files end up in the zip you submit.

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

Check out [Folder Structure](/codebase-structure/folder-structure/) to see what belongs in each of these folders. Almost everything else in your repo should stay out of the zip.

## Everything that should never reach the submission zip

| Category | Examples |
|---|---|
| Version control | `.git/`, `.gitignore` |
| AI tooling | `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `.claude/`, `.cursorrules` |
| CI/CD and repo metadata | `.github/` |
| Linter config | `.theme-check.yml` |
| Build setup (if using one) | `package.json`, `node_modules/`, `src/`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, any `.env*` |
| Editor/OS noise | `.vscode/`, `.DS_Store` |
| Docs | `README.md`, this handbook itself, `docs/` (for example, the per-artifact build records `/figma-to-liquid` writes, see [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/)) |
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
docs/
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

The `shopify theme package` command (and also `push` and `pull`) reads this file, the same way `.gitignore` tells Git what to track. But `.shopifyignore` is a separate file with a separate job, and one doesn't replace the other. See [Project Files Explained](/tooling-config/project-files/) for more on why you need both.

## The end-to-end packaging workflow

1. Check that `.shopifyignore` is up to date. Do this the moment you add a new dev tooling file or folder, not weeks later once you've forgotten what you added.
2. Run `shopify theme package` (or build your zip with your own process) from a clean checkout. It's best to use a fresh clone instead of your local working directory. That way, nothing untracked, like a stray local file or an unfinished experiment, sneaks in by accident.
3. Unzip the result somewhere temporary and check it by hand. Only the 8 folders should be there, plus a few root-level files Shopify does expect, like `settings_schema.json` inside `config/`.
4. Run through the [pre-zip sanity pass](/publishing/packaging-and-submitting/#a-pre-zip-sanity-pass): make sure there's no `config/markets.json` and no references to demo-store-specific resources.
5. Submit your theme.

| ✅ Do | ❌ Don't |
|---|---|
| Package from a clean clone, not your local working directory | Zip your local folder directly, risking uncommitted or untracked dev files sneaking in |
| Check the unzipped contents by hand before every submission, not just the first one | Assume `.shopifyignore` is still correct after months of adding new tooling, without checking it again |
| Update `.shopifyignore` in the same commit or pull request that adds a new dev-tooling file | Add a new GitHub Action or AI rule file and forget to also exclude it |

## A worked example: what a build-setup team specifically needs to exclude

Say you're using the [Tailwind/Alpine build setup](/tooling-config/tailwind-and-alpine-build-setup/). Your repo now has an entire `src/` frontend source tree and a `node_modules/` folder that a plain theme doesn't have. Both of these need to go in `.shopifyignore`.

But here's the catch. The *compiled output* (the final CSS and JS files your build step produces) does need to ship, and it needs to land inside `assets/`, not in `dist/` or wherever your bundler writes files by default.

So check that your bundler's output path is actually `assets/`, or that your build step copies the files there. Don't just assume `.shopifyignore` handles this on its own. If your `dist/` folder is ignored but its files never get copied into `assets/`, your compiled CSS and JS simply won't ship.

## Best practices

- Update `.shopifyignore` as soon as you add a new dev tooling file. Don't leave it as a cleanup task for "later," because later rarely comes.
- Package from a fresh clone before every submission. This catches any untracked files that your local working directory might be quietly carrying.
- If you use a build setup, check that the compiled output lands in `assets/`. A successful build on your machine doesn't guarantee the files end up in the right place.

## Common mistakes

- **Zipping your local working directory directly.** This can pull in untracked files, or files that are listed in `.gitignore` but not in `.shopifyignore`, that shouldn't ship.
- **Letting `.shopifyignore` go stale** as you add new tooling over the life of a project. Often the only sign is a reviewer spotting a `node_modules` folder in your submitted zip.
- **Assuming that ignoring a build setup's source folder also handles the compiled output.** Excluding the source and getting the output into `assets/` are two different jobs. You need to check both.

## Quick Reference

- Only `assets/`, `blocks/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` should reach a submission.
- `.shopifyignore` is how you enforce that. List every dev-tooling file and folder there, and keep it current as your tooling changes.
- Package from a clean clone, then unzip and check it by hand before every submission.
- A build setup adds two things to check: its source tree is ignored, and its compiled output actually lands in `assets/`.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) (shopify.dev)
- [Structuring your theme zip](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip) (shopify.dev)
