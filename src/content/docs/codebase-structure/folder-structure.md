---
title: Folder Structure
description: The required top-level directories in a Shopify theme.
---

Every Shopify theme — Skeleton, Horizon, Dawn, or ours — uses this exact top-level layout. No other top-level folders are supported.

```
.
├── assets       # CSS, JS, images, fonts — anything referenced via asset_url
├── blocks       # Reusable, nestable theme blocks (new top-level folder, Horizon-era)
├── config       # settings_schema.json, settings_data.json
├── layout       # theme.liquid — the outermost wrapper
├── locales      # Translation files, one per language
├── sections     # Full-width, merchant-addable page modules + section groups
├── snippets     # Small reusable Liquid partials
└── templates    # One file per page type, usually JSON
```

Only a `layout/theme.liquid` file is strictly required to upload a theme — everything else is added as you build features.

## What goes where

| Folder | Put here | Don't put here |
|---|---|---|
| `assets/` | Compiled CSS/JS, images, fonts | Liquid logic — assets are static files, though `.css.liquid`/`.js.liquid` extensions exist for limited Liquid use |
| `blocks/` | Any block meant to be reused across multiple sections | A block only ever used in one section (define it inline in that section instead) |
| `config/` | Global theme settings | Section- or block-specific settings (those live in the section/block's own schema) |
| `layout/` | Repeated page chrome (`<head>`, header/footer wrappers) | Page-specific content |
| `locales/` | All merchant- and customer-facing text | Anything hardcoded that should be translatable |
| `sections/` | Page-level, merchant-addable modules | Tiny reusable fragments (that's a snippet) |
| `snippets/` | Small Liquid partials rendered with `{% render %}` | Anything that needs its own settings UI (that's a section or block) |
| `templates/` | One JSON file per page type | Layout chrome (that's `layout/`) |

## Quick Reference

- 8 top-level folders, no others allowed: `assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`.
- Only `layout/theme.liquid` is strictly required.
- `blocks/` is the newest addition — it didn't exist in Dawn-era themes.

## Further Reading

- [Theme architecture — directory structure](https://shopify.dev/docs/storefronts/themes/architecture#directory-structure-and-component-types) — shopify.dev
