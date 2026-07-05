---
title: Prerequisites & Setup
description: Everything you need installed and access to before writing any code.
---

## Accounts you need

- **Shopify Partner account** — free, required to create development stores and submit themes. Sign up at [partners.shopify.com](https://www.shopify.com/partners). See [Partner Dashboard Setup](/publishing/partner-dashboard-setup/) if you don't have one yet.
- **A development store** — a free, sandboxed Shopify store for building and testing. Create one from your Partner Dashboard.
- **Collaborator or staff access** with the "Manage themes" permission on whichever store you'll be pushing theme code to.
- **GitHub access** to the team's repositories.

## Software to install

| Tool | Why |
|---|---|
| [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) | Scaffolds themes, runs a local dev server, pushes/pulls theme code. |
| Node.js (LTS) | Required by Shopify CLI and any local tooling (ESLint, Prettier, Theme Check). |
| Git | Version control — see [GitHub Workflow](/github-workflow/). |
| A code editor | We recommend VS Code with the [Shopify Liquid extension](https://shopify.dev/docs/storefronts/themes/tools/shopify-liquid-vscode) for Liquid syntax highlighting and linting. |
| Google Chrome | `shopify theme dev`'s live preview and hot reload only work in Chrome. |

Install Shopify CLI, then confirm it works:

```bash
shopify version
```

If that command isn't found, `shopify` wasn't added to your shell's `PATH` correctly — reinstall following the [official CLI docs](https://shopify.dev/docs/api/shopify-cli) rather than troubleshooting `PATH` issues blind.

## Recommended VS Code extensions

- **Shopify Liquid** — syntax highlighting, linting, and autocomplete for `.liquid` files. This is not optional in practice — without it, Liquid files look like unstyled text and you lose inline Theme Check warnings.
- **Prettier** — code formatting (see [Quality & Validation](/quality-validation/theme-check-and-linting/)).
- **Cursor or Claude Code**, if you're using AI-assisted development — see [Section 5](/ai-assisted-development/).

## Verifying your setup end to end

Don't just confirm each tool installed — confirm the whole chain works together before you start your first real task:

1. `shopify version` returns a version number.
2. `git clone` a repo you have access to.
3. `shopify theme dev --store <your-dev-store>` (see [Your First Preview](/getting-started/first-preview/)) actually opens a working preview in Chrome.
4. Your editor shows Liquid syntax highlighting when you open a `.liquid` file.

If any of these four fail, fix it now — a broken dev environment discovered on day three costs far more than one caught on day one.

## Best practices

- Use a dedicated development store per developer, not one shared dev store the whole team pushes to — conflicting local previews on a shared store cause confusing, hard-to-reproduce bugs.
- Keep Shopify CLI updated (`npm install -g @shopify/cli@latest` or your platform's equivalent) — theme features and Theme Check rules evolve, and an outdated CLI can silently miss new checks.
- Set up 2FA on your Partner account immediately — Partner accounts have billing and submission access, and losing one to account compromise is a genuinely bad day.

## Common mistakes

- **Trying to preview in Safari or Firefox and assuming something is broken.** `shopify theme dev`'s hot-reload preview is Chrome-only by design — this is a known, documented limitation, not a bug in your setup.
- **Skipping the dev store and testing directly against a live/production store.** Development themes are cheap and disposable; live stores are not the place to find out a section breaks with real data.
- **Installing Shopify CLI without Node, or with a very old Node version.** Confirm your Node version is current LTS before troubleshooting CLI install issues that are actually Node version issues in disguise.

## Quick Reference

- You need: a Partner account, a dev store, Shopify CLI, Node, Git, and a code editor.
- `shopify theme dev` preview only works in Chrome.
- Verify the whole chain (CLI → Git → dev preview → editor linting) before starting real work, not each tool in isolation.

## Further Reading

- [Shopify CLI documentation](https://shopify.dev/docs/api/shopify-cli) — shopify.dev
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) — shopify.dev
