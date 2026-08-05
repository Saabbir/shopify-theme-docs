---
title: Your First Preview
description: Get a theme running locally in under ten minutes.
---

This page walks you through cloning our scaffold (a starter template we build every theme from) and seeing it live in your browser. It doesn't teach you how everything is built yet. That part comes in [Section 3](/codebase-structure/) and [Section 4](/scaffold-setup/). For now, this page is just about checking that your setup works.

## 1. Clone the scaffold

We scaffold from Shopify's official Skeleton Theme (see [why, here](/scaffold-setup/scaffolding-from-horizon/)):

```bash
shopify theme init
```

You'll be prompted for a folder name. Use `solis` (or whatever the current project name is). This copies the Skeleton Theme into that folder on your computer.

```bash
cd solis
```

:::tip[Cloning an existing project instead]
If Solis already has code and you're joining a project that's already in progress, skip `shopify theme init`. Just `git clone` the existing Solis repository, the same way you would for any other project. `shopify theme init` is only for starting a brand-new theme from the scaffold.
:::

## 2. Start the dev server

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

The first time you run this, it asks you to log in to Shopify in your browser. Once you're connected, this command does three things:

- uploads your local theme as a temporary "development theme" on that store (it doesn't touch the live theme customers see)
- starts a local server with hot reload for CSS and section changes
- prints a local preview URL

## 3. Open the preview

In **Google Chrome** (the only browser the hot-reload preview supports), go to:

```
http://127.0.0.1:9292
```

You should see the Skeleton Theme running against your dev store's real product and collection data.

:::tip
`shopify theme dev` also prints a shareable preview link and a link straight into the theme editor. These are useful for sending a work-in-progress to a teammate or designer without pushing anything live.
:::

## What "hot reload" does and doesn't cover

| Change type | Reloads automatically? |
|---|---|
| CSS inside `{% stylesheet %}` | ✅ Yes, near-instantly |
| Section/block Liquid markup | ✅ Yes, full page reload |
| `{% schema %}` changes (new settings) | ✅ Yes, but you may need to re-open the theme editor to see new settings appear |
| `config/settings_schema.json` | ⚠️ Sometimes requires restarting `shopify theme dev` |
| Renaming or moving a file | ❌ Restart `shopify theme dev` |

If you make a change and nothing happens, don't assume you broke something. Restart the dev server first. That's the most common fix.

## Best practices

- Keep `shopify theme dev` running in its own terminal tab for your whole session. Don't start and stop it for every change, since restarting loses your preview URL and forces a browser refresh.
- If your preview looks stale after a schema change, restart the dev server before you start debugging your code. A stale dev server is a much more common cause than an actual bug.
- Use the shareable preview link, not a screenshot, when asking a teammate to look at work in progress. That way they can click around in it, not just look at it.

## Common mistakes

- **Assuming a broken preview means broken code.** Check "what hot reload doesn't cover" above before you start debugging Liquid you haven't touched.
- **Running `shopify theme dev` against a live or published theme by accident.** Always confirm the `--store` flag points at your personal dev store, not a shared or production store.
- **Opening the preview in a browser other than Chrome and reporting it as broken.** This is expected. Hot reload previews only work in Chrome.

## Quick Reference

- `shopify theme init`: clone the scaffold (new project only, use `git clone` for an existing one).
- `shopify theme dev --store <store>`: local preview with hot reload (Chrome only).
- Schema and file-structure changes sometimes need a dev server restart. Try that before debugging.
- Nothing here touches the store's live theme.

## Further Reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) (shopify.dev)
