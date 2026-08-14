---
title: Your First Preview
description: Get a theme running locally in under ten minutes.
---

**TL;DR:** Get a theme running locally in under ten minutes.

This page walks you through cloning the Solis repository and seeing it live in your browser. It doesn't teach you how everything is built yet. That part comes in [Section 3](/codebase-structure/) and [Section 4](/scaffold-setup/). For now, this page is just about checking that your setup works.

## 1. Clone the repo

Solis already exists as a real repository, with sections, blocks, and config already built. You're not scaffolding a new theme, you're joining an existing one:

```bash
git clone https://github.com/EchoLogyx-Ltd/shopify-theme-solis.git solis
cd solis
```

That's it. `AGENTS.md`, `.prettierrc.json`, `.vscode/` settings, and the GitHub Actions CI workflow all come with the clone, nothing left to generate.

:::note[Where `shopify theme init` fits in]
`shopify theme init` is how Solis originally got started, cloning Shopify's official Skeleton Theme as a base (see [why, here](/scaffold-setup/scaffolding-from-horizon/)). You'd only run it yourself if you were starting an unrelated, brand-new theme from zero. For Solis, `git clone` above is the whole story.
:::

Install the Node tooling (Prettier and its Liquid plugin) before you do anything else:

```bash
npm install
```

This doesn't affect the theme itself, it's dev-only tooling. See [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) for what it installs and why.

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

You should see Solis running against your dev store's real product and collection data.

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

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep `shopify theme dev` running in one terminal tab for your whole session | Restart it for every small change — you lose the preview URL for nothing |
| Restart the dev server first if a preview looks stale after a schema change | Start debugging your Liquid before ruling out a stale dev server |
| Double-check `--store` points at your own personal dev store | Run `shopify theme dev` against a live or shared production store |
| Test in Chrome, and share the printed preview link for feedback | Report a broken preview in Safari/Firefox — hot reload is Chrome-only by design |

## Further reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) (shopify.dev)
