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

:::tip[Cloning an existing project instead]
If Solis already has a codebase and you're joining an in-progress project, you don't run `shopify theme init` at all — you `git clone` the existing Solis repository like any other project. `shopify theme init` is only for starting a brand-new theme from the scaffold.
:::

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

## What "hot reload" does and doesn't cover

| Change type | Reloads automatically? |
|---|---|
| CSS inside `{% stylesheet %}` | ✅ Yes, near-instantly |
| Section/block Liquid markup | ✅ Yes, full page reload |
| `{% schema %}` changes (new settings) | ✅ Yes, but you may need to re-open the theme editor to see new settings appear |
| `config/settings_schema.json` | ⚠️ Sometimes requires restarting `shopify theme dev` |
| Renaming or moving a file | ❌ Restart `shopify theme dev` |

If you make a change and nothing happens, don't assume you did something wrong — restart the dev server first; it's the single most common fix.

## Best practices

- Keep `shopify theme dev` running in a dedicated terminal tab for your whole session, rather than starting and stopping it per change — restarts cost you the preview URL and force a browser refresh.
- If your preview looks stale after a schema change, restart before debugging your code — a stale dev server is a far more common cause than an actual bug.
- Use the shareable preview link (not a screenshot) when asking a teammate to look at work in progress — they can interact with it, not just view it.

## Common mistakes

- **Assuming a broken preview means broken code.** Check "what hot reload doesn't cover" above before you start debugging Liquid you haven't touched.
- **Running `shopify theme dev` against a live/published theme by accident.** Always confirm the `--store` flag points at your personal dev store, not a shared or production store.
- **Opening the preview in a browser other than Chrome and reporting it as broken.** This is expected — hot reload previews are Chrome-only.

## Quick Reference

- `shopify theme init` → clone the scaffold (new project only — use `git clone` for an existing one).
- `shopify theme dev --store <store>` → local preview with hot reload (Chrome only).
- Schema and file-structure changes sometimes need a dev server restart — try that before debugging.
- Nothing here touches the store's live theme.

## Further Reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) — shopify.dev
