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

## Recommended VS Code extensions

- **Shopify Liquid** — syntax highlighting, linting, and autocomplete for `.liquid` files.
- **Prettier** — code formatting (see [Quality & Validation](/quality-validation/theme-check-and-linting/)).
- **Cursor or Claude Code**, if you're using AI-assisted development — see [Section 5](/ai-assisted-development/).

## Quick Reference

- You need: a Partner account, a dev store, Shopify CLI, Node, Git, and a code editor.
- `shopify theme dev` preview only works in Chrome.

## Further Reading

- [Shopify CLI documentation](https://shopify.dev/docs/api/shopify-cli) — shopify.dev
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) — shopify.dev
