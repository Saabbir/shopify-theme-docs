---
title: Folder Structure
description: The required top-level directories in a Shopify theme.
---

**TL;DR:** The required top-level directories in a Shopify theme.

Every Shopify theme uses this exact folder layout at the top level. This includes Skeleton, Horizon, Dawn, and our own theme too. No other top-level folders are allowed.

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

Only `layout/theme.liquid` is required to upload a theme. You add everything else as you build out new features.

## What goes where

| Folder | Put here | Don't put here |
|---|---|---|
| `assets/` | Compiled CSS/JS, images, fonts | Liquid logic (assets are static files, though `.css.liquid`/`.js.liquid` extensions exist for limited Liquid use) |
| `blocks/` | Any block meant to be reused across multiple sections | A block only ever used in one section (define it inline in that section instead) |
| `config/` | Global theme settings | Section- or block-specific settings (those live in the section's or block's own schema) |
| `layout/` | Repeated page chrome (`<head>`, header/footer wrappers) | Page-specific content |
| `locales/` | All merchant- and customer-facing text | Anything hardcoded that should be translatable |
| `sections/` | Page-level, merchant-addable modules | Tiny reusable fragments (that's a snippet) |
| `snippets/` | Small Liquid partials rendered with `{% render %}` | Anything that needs its own settings UI (that's a section or block) |
| `templates/` | One JSON file per page type | Layout chrome (that's `layout/`) |

## A worked example: where does this file go?

Let's say you're building a Solis feature that shows a "recently viewed products" strip on a product page. Here's how you'd work through the decision, step by step.

| Question | Answer | Conclusion |
|---|---|---|
| Does a merchant need to add/remove/reorder it? | Yes, as a section on the product page | It's a **section**, in `sections/` |
| Does it need its own repeatable, merchant-configurable sub-items? | No. It's driven by browsing history, not manual content | No blocks needed |
| Is there shared markup logic (for example, rendering one product card) reused elsewhere? | Yes. The same product card markup appears in collection grids too | Extract that into a **snippet** in `snippets/`, rendered with explicit parameters |
| Does it need JS to track/read viewed products? | Yes | Goes in `assets/`, loaded via a scoped `{% javascript %}` tag in the section |

```liquid
{% comment %} sections/recently-viewed.liquid {% endcomment %}
<div class="recently-viewed">
  {% for product in recently_viewed_products limit: 4 %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| If you're not sure whether something should be a section, block, or snippet, walk through the decision table above instead of just guessing. | **Putting content that should be a block directly in `snippets/`**, just because it's reusable, without stopping to ask whether merchants need to control its settings visually. If they do, it should be a block, not a snippet. |
| Keep `assets/` organized by type as your theme grows. For example, use a clear naming pattern for CSS files, JS files, and images. A flat `assets/` folder with everything mixed together gets hard to navigate once you pass a few dozen files. | **Overloading `config/settings_schema.json`** with settings that really belong to just one section. This clutters the global theme settings panel and confuses merchants. |
| Treat `config/settings_schema.json` as truly global. If you notice you're adding a setting there that only one section actually uses, move it into that section's own schema instead. | **Creating extra top-level folders** on your own, like `components/` or `styles/`. Only the 8 folders listed above are supported. Shopify silently ignores anything else. |

## Key takeaways
- 8 top-level folders, no others allowed: `assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`.
- Only `layout/theme.liquid` is strictly required.
- `blocks/` is the newest addition. It didn't exist in Dawn-era themes.
- When you're unsure where something goes, ask yourself: does a merchant edit it visually? Is it reused with different data each time? Does it need its own settings?

## Further reading

- [Theme architecture, directory structure](https://shopify.dev/docs/storefronts/themes/architecture#directory-structure-and-component-types) (shopify.dev)
