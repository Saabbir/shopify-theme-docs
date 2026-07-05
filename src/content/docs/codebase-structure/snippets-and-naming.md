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

### Snippet vs. block — a decision you'll make constantly

| Ask | If yes → | If no → |
|---|---|---|
| Does a merchant need to configure this visually in the theme editor? | Block | Snippet |
| Does it need to be independently added/removed/reordered? | Block | Snippet |
| Are you calling it with explicit data each time (`{% render 'x', y: y %}`)? | Snippet | Block |
| Is it purely presentational logic reused across several sections (e.g. a price formatter)? | Snippet | — |

```liquid
{% comment %} ❌ WRONG — using {% include %}, deprecated and unscoped
   (it can silently read/write variables from the calling context,
   which makes bugs hard to trace). {% endcomment %}
{% include 'price' %}

{% comment %} ✅ RIGHT — {% render %}, explicit and scoped. The snippet
   only sees what you explicitly pass it. {% endcomment %}
{% render 'price', product: product %}
```

### Writing a snippet other developers (and AI tools) can trust

```liquid
{% comment %} ❌ WRONG — no documentation, unclear what it expects {% endcomment %}
{% comment %} snippets/card.liquid %}
<div class="card">
  <img src="{{ image | image_url: width: 400 }}" alt="{{ alt }}">
  <h3>{{ title }}</h3>
</div>
```

```liquid
{% comment %} ✅ RIGHT — LiquidDoc makes the contract explicit, so
   anyone (or any AI tool) calling this snippet knows exactly what
   to pass. {% endcomment %}
{%- doc -%}
  Renders a simple media card.

  @param image {Image} - the image to display
  @param title {String} - the card's heading text
  @param alt {String} [optional] - alt text; falls back to `image.alt` if omitted
{%- enddoc -%}
<div class="card">
  <img
    src="{{ image | image_url: width: 400 }}"
    alt="{{ alt | default: image.alt | escape }}"
    width="400"
    height="{{ 400 | divided_by: image.aspect_ratio }}"
    loading="lazy"
  >
  <h3>{{ title }}</h3>
</div>
```

## Naming conventions

| Type | Convention | Example |
|---|---|---|
| Sections | `kebab-case`, describes content | `featured-collection.liquid` |
| Blocks | `kebab-case`, describes the block's purpose | `product-price.liquid` |
| Snippets | `kebab-case`, verb or noun describing output | `price.liquid`, `icon-cart.liquid` |
| Section/block IDs (schema) | `snake_case` | `"id": "color_scheme"` |
| CSS classes | `kebab-case`, BEM-ish where nesting helps | `.product-card__title` |
| Locale keys | dot-notation matching the UI hierarchy | `products.price.sale` |

### Naming examples, right and wrong

| ✅ Good | ❌ Avoid | Why |
|---|---|---|
| `sections/featured-collection.liquid` | `sections/FeaturedCollection.liquid` | File names are kebab-case, not PascalCase |
| `"id": "color_scheme"` | `"id": "colorScheme"` | Schema IDs are snake_case, not camelCase |
| `.product-card__title` | `.productCardTitle` | CSS classes follow kebab-case/BEM, not camelCase |
| `blocks/testimonial-quote.liquid` | `blocks/block1.liquid` | Names should describe purpose, never be generic/numbered |
| `products.price.sale` | `sale_price_text` | Locale keys use dot notation matching the settings/UI hierarchy |

## Best practices

- Write a LiquidDoc `{%- doc -%}` block on every snippet the moment you create it, not as cleanup later — it's the difference between a teammate (or an AI tool) using it correctly on the first try or guessing.
- Run the snippet-vs-block decision table above every time you're about to extract reusable logic — it's a quick check that prevents a bigger refactor later.
- Keep naming consistent even under time pressure — a rushed generic name (`block1.liquid`) becomes permanent technical debt far more often than it gets renamed later.

## Common mistakes

- **Using `{% include %}` instead of `{% render %}`.** `{% include %}` is deprecated specifically because it doesn't scope variables — a snippet using `{% include %}` can accidentally read or clobber variables from whatever called it.
- **Building something as a snippet that should have been a block** (or vice versa) — usually surfaces when a "just pass in a variable" snippet later needs to become merchant-configurable, forcing a rewrite.
- **Skipping LiquidDoc "for now."** This is exactly the kind of thing that never gets circled back to, and it's the first thing that makes AI-assisted development slower and less reliable (see [AI-Assisted Development](/ai-assisted-development/)).
- **Inconsistent casing** — mixing `snake_case`, `camelCase`, and `kebab-case` across a codebase makes it harder to predict a file or setting's name without looking it up.

## Quick Reference

- Snippets receive variables you pass explicitly; blocks only see `block`/`section`.
- Use `{% render %}`, never the deprecated `{% include %}`.
- File names: `kebab-case`. Schema `id`s: `snake_case`.
- Write LiquidDoc comments on any snippet meant to be reused by someone else (human or AI).

## Further Reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture/snippets) — shopify.dev
- [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) — shopify.dev
