---
title: Snippets & Naming Conventions
description: Reusable Liquid partials, and how we name files across the theme.
---

**TL;DR:** Reusable Liquid partials, and how we name files across the theme.

## Snippets

Merchants never see a snippet in the theme editor, since it has no schema and no settings screen. Use a snippet for logic you'd otherwise copy and paste over and over, like a price formatter, a product card, or an SVG icon.

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

Unlike a theme block, a snippet **does** receive the variables you explicitly pass it. That's the key difference between the two. Use a snippet when you need to pass data in yourself. Use a block when you need settings a merchant can edit, plus the ability to reorder it.

The `{%- doc -%}` tag you see above is called [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc). Write one for any snippet that another developer, or an AI tool, will call. It documents the parameters for you, and shows up right inside the VS Code extension.

### Snippet vs. block — a decision you'll make constantly

| Ask | If yes → | If no → |
|---|---|---|
| Does a merchant need to configure this visually in the theme editor? | Block | Snippet |
| Does it need to be independently added/removed/reordered? | Block | Snippet |
| Are you calling it with explicit data each time (`{% render 'x', y: y %}`)? | Snippet | Block |
| Is it purely presentational logic reused across several sections (e.g. a price formatter)? | Snippet | N/A |

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

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Write a LiquidDoc `{%- doc -%}` block on every snippet the moment you create it. Don't leave it for later cleanup. It's the difference between a teammate, or an AI tool, using your snippet correctly the first time, versus guessing. | **Using `{% include %}` instead of `{% render %}`.** `{% include %}` is deprecated, specifically because it doesn't keep variables separate. A snippet using it can accidentally read or overwrite variables from whatever called it. |
| Run through the snippet-vs-block decision table above every time you're about to pull out reusable logic. It's a quick check that saves you a bigger rewrite later. | **Building something as a snippet that should have been a block** (or the other way around). This usually shows up when a "just pass in a variable" snippet later needs to become something a merchant can configure, forcing you to rewrite it. |
| Keep your naming consistent even when you're in a hurry. A rushed, generic name like `block1.liquid` almost always sticks around as permanent technical debt instead of getting renamed later. | **Skipping LiquidDoc "for now."** This is exactly the kind of thing that never actually gets done later. It's also the first thing that makes AI-assisted development slower and less reliable (see [AI-Assisted Development](/ai-assisted-development/)). |
| — | **Inconsistent casing.** Mixing `snake_case`, `camelCase`, and `kebab-case` across a codebase makes it harder to guess a file or setting's name without looking it up. |

## Key takeaways
- Snippets receive variables you pass explicitly. Blocks only see `block` and `section`.
- Use `{% render %}`, never the deprecated `{% include %}`.
- File names use `kebab-case`. Schema `id`s use `snake_case`.
- Write LiquidDoc comments on any snippet meant to be reused by someone else, human or AI.

## Further reading

- [Snippets](https://shopify.dev/docs/storefronts/themes/architecture/snippets) (shopify.dev)
- [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) (shopify.dev)
