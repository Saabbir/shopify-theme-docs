---
title: Tooling & Config
description: The dev-tooling files that live alongside a theme, and how to keep them out of a Theme Store submission.
---

A real theme repo has more in it than the 8 folders Shopify actually reads (`assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`). Git config, AI rule files, CI workflows, and optionally a whole frontend build setup all live in the same repo — but none of them should end up in a Theme Store submission. This section covers both halves of that: managing the dev-tooling files, and correctly excluding them at packaging time.

## What's on this page group

- [Project Files Explained](/tooling-config/project-files/) — what `.gitignore`, `.shopifyignore`, `.theme-check.yml`, `.github/`, `AGENTS.md`/`CLAUDE.md`, and `README.md` each do.
- [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/) — how to submit only the 8 required folders, nothing else.
- [Tailwind CSS & Alpine.js Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) — an optional alternative build setup some agencies use, and its trade-offs.

## The core distinction this section is built around

**Development-time files** (Git config, AI rules, CI, a build setup) make the *repo* better to work in. **Theme Store submission** only ever wants the 8 standard theme folders. Confusing the two — committing a `node_modules` folder into the zip, or forgetting `.shopifyignore` exists — is an easy, entirely avoidable mistake this section exists to prevent.

## Best practices

- Treat every new dev-tooling file (a new GitHub Action, a new AI rule file) as something to also verify against your `.shopifyignore`/packaging process — don't assume "it's not in the 8 folders" is automatically enough; verify it explicitly per [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/).
- Keep `.gitignore` and `.shopifyignore` conceptually separate in your head even though they look similar: one keeps files out of Git history, the other keeps files out of a theme package/deploy — a file can need one, both, or neither.

## Common mistakes

- **Assuming `.gitignore` also protects a Theme Store submission** — it doesn't; a build-setup folder committed to Git could still end up in a theme zip if packaging isn't handled separately.
- **Adding a new dev-tooling file and forgetting to add it to `.shopifyignore`** the same day, leaving a window where it could ship in a submission zip.

## Quick Reference

- [Project Files Explained](/tooling-config/project-files/) · [Packaging Exclusions](/tooling-config/packaging-exclusions/) · [Tailwind & Alpine Build Setup](/tooling-config/tailwind-and-alpine-build-setup/)
- Dev-tooling files make the repo better. Only the 8 theme folders go to the Theme Store. Keep the two concerns separate.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) — shopify.dev
