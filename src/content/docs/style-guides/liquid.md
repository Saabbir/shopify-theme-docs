---
title: Liquid Style Guide
description: Objects, filters, whitespace control, snippet conventions, and formatting.
---

Liquid is the templating layer, full stop — this page is the day-to-day style guide for writing it consistently. For architectural decisions (when to use a snippet vs. a theme block), see [Codebase Structure](/codebase-structure/); this page is about how the Liquid itself reads and performs.

## Whitespace control

Use `{%-` / `-%}` and `{{-` / `-}}` (hyphens) on tags that don't need to emit whitespace — logic tags (`if`, `for`, `assign`, `capture`, `comment`) almost always should:

```liquid
{% comment %} ❌ WRONG — emits blank lines into the rendered HTML for
   every {% if %}/{% endif %}, {% assign %}, and {% for %} boundary {% endcomment %}
{% if product.available %}
  <p>In stock</p>
{% endif %}

{% comment %} ✅ RIGHT — hyphens strip the surrounding whitespace,
   producing clean output with no stray blank lines {% endcomment %}
{%- if product.available -%}
  <p>In stock</p>
{%- endif -%}
```

Leave whitespace control off tags that render visible content where a space matters (e.g. between two inline elements that should have a space between them).

## Objects: check before you assume

Never assume an object or a nested property exists — Liquid doesn't error on a missing property, it silently renders nothing, which hides bugs instead of surfacing them:

```liquid
{% comment %} ❌ WRONG — if product.selected_or_first_available_variant.featured_media
   is nil (e.g. a variant with no image), image_url errors or renders blank silently {% endcomment %}
<img src="{{ product.selected_or_first_available_variant.featured_media | image_url: width: 400 }}">

{% comment %} ✅ RIGHT — an explicit check with a documented fallback {% endcomment %}
{%- assign featured_media = product.selected_or_first_available_variant.featured_media | default: product.featured_media -%}
{%- if featured_media -%}
  <img src="{{ featured_media | image_url: width: 400 }}" width="400" height="{{ featured_media.preview_image.height | times: 400 | divided_by: featured_media.preview_image.width }}" loading="lazy" alt="{{ featured_media.alt | escape }}">
{%- endif -%}
```

## The most common global objects (a quick map)

| Object | What it gives you | Common gotcha |
|---|---|---|
| `product` | Current product, on product templates | `product.selected_or_first_available_variant` for the active variant, not `product.variants.first` |
| `collection` | Current collection | `collection.products` is paginated — respect `paginate` for large collections |
| `cart` | The customer's cart | `cart.item_count` for a badge; `cart.items` for the full line list |
| `section` | The current section's settings/blocks | `section.settings.x`, `section.blocks` |
| `block` | The current block (inside a `{% for block in section.blocks %}` loop) | Only available inside that loop's scope |
| `shop` | Store-wide info (name, currency, domain) | `shop.money_format` for manual currency formatting (rare — prefer the `money` filter) |
| `routes` | Canonical internal URLs | Always use this instead of hardcoding a path |
| `settings` | Theme-wide settings from `config/settings_schema.json` | Distinct from `section.settings` — theme-wide vs. section-specific |
| `request` | Info about the current request (page type, locale) | `request.locale.iso_code` for the active language |
| `localization` | Available languages/countries, current selection | Used for language/country selectors |

Full reference: [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/) in Learning Articles.

## Filters: prefer Shopify's built-ins over manual logic

```liquid
{% comment %} ❌ WRONG — manual currency formatting, breaks for
   currencies with different decimal/thousands conventions {% endcomment %}
${{ product.price | divided_by: 100.0 }}

{% comment %} ✅ RIGHT — the money filter handles the store's actual
   currency format and localization {% endcomment %}
{{ product.price | money }}
```

```liquid
{% comment %} ❌ WRONG — string concatenation for a URL {% endcomment %}
<a href="/products/{{ product.handle }}">

{% comment %} ✅ RIGHT — the url property already accounts for
   the store's routing/locale prefix {% endcomment %}
<a href="{{ product.url }}">
```

## Snippets vs. theme blocks — pick the right primitive

- **Snippet** (`{% render 'name', param: value %}`) — receives only what you explicitly pass in. Use for anything reused with different data, that doesn't need merchant reordering.
- **Theme block** — receives `block`/`section`, no passed variables. Use for anything merchant-editable, addable/removable/reorderable in the editor.

```liquid
{% comment %} ✅ snippet — explicit, no surprise scope leakage {% endcomment %}
{% render 'product-card', product: collection.products[0], show_vendor: true %}
```

Never use `{% include %}` — it's deprecated, and unlike `{% render %}` it leaks the calling scope's variables into the included file, which is exactly the kind of implicit coupling that makes a codebase hard to reason about as it grows.

## Documenting snippets: LiquidDoc

Every snippet gets a `{%- doc -%}` block describing its parameters — this is what makes a snippet's contract explicit instead of something you have to reverse-engineer from its body:

```liquid
{%- doc -%}
  Renders a product card.

  @param {object} product - The product to render.
  @param {boolean} [show_vendor] - Whether to show the vendor name. Defaults to false.
{%- enddoc -%}

{%- assign show_vendor = show_vendor | default: false -%}
<div class="product-card">
  ...
</div>
```

## Formatting conventions

| Rule | Example |
|---|---|
| 2-space indentation, matching HTML nesting | — |
| `snake_case` for variable names assigned with `{% assign %}`/`{% capture %}` | `{% assign is_on_sale = ... %}`, not `{% assign isOnSale = ... %}` |
| One `{% comment %}` above any non-obvious logic block, not a comment on every line | — |
| Boolean-named variables read as a yes/no question | `show_vendor`, `is_available`, `has_discount` — not `vendor_flag` |

## Performance: avoid repeated expensive lookups

```liquid
{% comment %} ❌ WRONG — re-evaluates the same filter chain on every
   iteration, and re-accesses metafields repeatedly {% endcomment %}
{% for product in collection.products %}
  {% if product.metafields.custom.featured.value %}
    ...
  {% endif %}
{% endfor %}

{% comment %} ✅ RIGHT — assign once outside a hot loop when the same
   value is used more than once inside it {% endcomment %}
{% for product in collection.products %}
  {%- assign is_featured = product.metafields.custom.featured.value -%}
  {%- if is_featured -%}
    ...
  {%- endif -%}
{% endfor %}
```

Always paginate large collections (`{% paginate collection.products by 24 %}`) rather than rendering every product on one page — this is also a Lighthouse/performance requirement, not just a style preference (see [Performance & Lighthouse](/theme-store-requirements/performance/)).

## Best practices

- Default to `{%-`/`-%}` on logic tags; only skip it where visible-content spacing actually depends on the whitespace.
- Guard every nested object access that might be nil (a variant's media, a metafield, an optional block setting) rather than assuming it exists.
- Write a `{%- doc -%}` block on every snippet — treat an undocumented snippet's parameters as an unfinished snippet.
- Use `{% render %}`, never `{% include %}` — the scope leakage in `{% include %}` causes real bugs as a codebase grows.

## Common mistakes

- **Omitting whitespace control**, leaving rendered HTML full of blank lines that don't affect functionality but make the actual page source harder to debug.
- **Assuming a nested object exists** (a variant's featured image, an optional metafield) and letting Liquid silently render nothing instead of guarding explicitly.
- **Manually formatting currency or building URLs by hand** instead of using `money`/`url`/`routes` — breaks the moment the store's currency format or URL structure isn't what you assumed.
- **Using `{% include %}`** out of habit from an older codebase — it's deprecated and leaks scope in a way `{% render %}` deliberately doesn't.

## Quick Reference

- Whitespace control (`{%-`/`-%}`) on logic tags by default.
- Guard nested object access; never assume a property exists.
- `money`/`url`/`routes` over manual formatting/hardcoded paths.
- `{% render %}` for snippets (explicit params), theme blocks for merchant-editable/reorderable content. Never `{% include %}`.
- `{%- doc -%}` on every snippet.
- `snake_case` for assigned variables; boolean names read as yes/no questions.

## Further Reading

- [Liquid reference](https://shopify.dev/docs/api/liquid) — shopify.dev
- [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) — shopify.dev
