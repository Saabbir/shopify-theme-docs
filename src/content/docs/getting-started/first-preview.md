---
title: Your First Preview
description: Get a theme running locally in under ten minutes.
---

This walks you through cloning our scaffold and seeing it live in a browser. It doesn't teach the architecture yet — that's [Section 3](/codebase-structure/) and [Section 4](/scaffold-setup/). This is just "does my environment work."

## 1. Clone the scaffold

We scaffold from Shopify's official Skeleton Theme (see [why, here](/scaffold-setup/scaffolding-from-horizon/)):

```bash
shopify theme init
```

You'll be prompted for a folder name — use `solis` (or whatever the current project name is). This clones the Skeleton Theme into that folder.

```bash
cd solis
```

## 2. Start the dev server

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

First run prompts you to log in to Shopify in the browser. Once connected, this command:

- uploads your local theme as a temporary "development theme" on that store (it doesn't touch the live theme)
- starts a local server with hot reload for CSS and section changes
- prints a local preview URL

## 3. Open the preview

In **Google Chrome** (the only browser the hot-reload preview supports), go to:

```
http://127.0.0.1:9292
```

You should see the Skeleton Theme running against your dev store's real product/collection data.

:::tip
`shopify theme dev` also prints a shareable preview link and a link straight into the theme editor — useful for sending a work-in-progress to a teammate or designer without pushing anything live.
:::

## Quick Reference

- `shopify theme init` → clone the scaffold.
- `shopify theme dev --store <store>` → local preview with hot reload (Chrome only).
- Nothing here touches the store's live theme.

## Further Reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) — shopify.dev
