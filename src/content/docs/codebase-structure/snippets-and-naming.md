---
title: Snippets & Naming Conventions
description: Reusable Liquid partials, and how we name files across the theme.
---

## Snippets

A snippet is a small piece of reusable Liquid, invisible to merchants in the theme editor (no schema, no settings UI). Use snippets for logic you'd otherwise copy-paste — a price formatter, a product card, an SVG icon.

```liquid
{% comment %} snippets/price.liquid {% endcomment %}
{%- doc -%}
  Renders a formatted price with an optional compare-at price.

  @param product {Product} - the product to render a price for
{%- enddoc -%}
<span class="price">
  {{ product.price | money }}
  {%- if product.compare_at_price > product.price -%}
    <s>{{ product.compare_at_price | money }}</s>
  {%- endif -%}
</span>
```

```liquid
{% render 'price', product: product %}
```

Unlike a theme block, a snippet **does** receive variables you explicitly pass it — that's the key difference. Use a snippet when you need to pass data in; use a block when you need merchant-editable settings and reordering.

The `{%- doc -%}` tag above is [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) — write one for any snippet another developer (or an AI tool) will call, so its parameters are self-documenting in the VS Code extension.

## Naming conventions

| Type | Convention | Example |
|---|---|---|
| Sections | `kebab-case`, describes content | `featured-collection.liquid` |
| Blocks | `kebab-case`, describes the block's purpose | `product-price.liquid` |
| Snippets | `kebab-case`, verb or noun describing output | `price.liquid`, `icon-cart.liquid` |
| Section/block IDs (schema) | `snake_case` | `"id": "color_scheme"` |
| CSS classes | `kebab-case`, BEM-ish where nesting helps | `.product-card__title` |
| Locale keys | dot-notation matching the UI hierarchy | `products.price.sale` |

## Quick Reference

- Snippets receive variables you pass explicitly; blocks only see `block`/`section`.
- File names: `kebab-case`. Schema `id`s: `snake_case`.
- Write LiquidDoc comments on any snippet meant to be reused by someone else (human or AI).

## Further Reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture/snippets) — shopify.dev
- [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) — shopify.dev
