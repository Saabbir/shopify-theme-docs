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

## A worked example: where does this file go?

Say you're building a Solis feature that shows a "recently viewed products" strip. Here's how the decision plays out:

| Question | Answer | Conclusion |
|---|---|---|
| Does a merchant need to add/remove/reorder it? | Yes, as a section on the product page | It's a **section**, in `sections/` |
| Does it need its own repeatable, merchant-configurable sub-items? | No — it's driven by browsing history, not manual content | No blocks needed |
| Is there shared markup logic (e.g. rendering one product card) reused elsewhere? | Yes — the same product card markup appears in collection grids too | Extract that into a **snippet** in `snippets/`, rendered with explicit parameters |
| Does it need JS to track/read viewed products? | Yes | Goes in `assets/`, loaded via a scoped `{% javascript %}` tag in the section |

```liquid
{% comment %} sections/recently-viewed.liquid {% endcomment %}
<div class="recently-viewed">
  {% for product in recently_viewed_products limit: 4 %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

## Best practices

- When you're unsure whether something is a section, block, or snippet, walk through the decision table above rather than guessing from habit.
- Keep `assets/` organized by type (e.g. a clear naming convention for CSS vs. JS vs. images) as the theme grows — a flat, undifferentiated `assets/` folder gets hard to navigate past a few dozen files.
- Treat `config/settings_schema.json` as genuinely global — if you find yourself adding a setting there that only one section actually uses, move it into that section's own schema instead.

## Common mistakes

- **Putting a block-worthy piece of content directly in `snippets/`** because it's reusable, without considering that merchants might need to control its settings visually — that's a sign it should be a block, not a snippet.
- **Overloading `config/settings_schema.json`** with settings that really belong to one specific section, making the global theme settings panel cluttered and confusing for merchants.
- **Creating ad hoc top-level folders** (e.g. a `components/` or `styles/` folder) — only the 8 folders listed above are supported; anything else is silently ignored by Shopify.

## Quick Reference

- 8 top-level folders, no others allowed: `assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`.
- Only `layout/theme.liquid` is strictly required.
- `blocks/` is the newest addition — it didn't exist in Dawn-era themes.
- When unsure where something goes, walk through: does a merchant edit it visually? Is it reused with different data each time? Does it need settings?

## Further Reading

- [Theme architecture — directory structure](https://shopify.dev/docs/storefronts/themes/architecture#directory-structure-and-component-types) — shopify.dev
