---
title: Liquid Style Guide
description: Objects, filters, whitespace control, snippet rules, and formatting for writing clean Liquid code.
---

**TL;DR:** Objects, filters, whitespace control, snippet rules, and formatting for writing clean Liquid code.

This page is your day-to-day style guide for writing Liquid in a clean, consistent way. If you want to know when to use a snippet versus a theme block, check out [Codebase Structure](/codebase-structure/) instead. This page is only about how the Liquid code itself should look and perform.

## Whitespace control

Liquid tags like `{% if %}` or `{% assign %}` don't show up in your final HTML, but they still leave behind blank lines and extra spaces if you're not careful. You can stop this by adding a hyphen to your tags, like `{%-` / `-%}` and `{{-` / `-}}`. The hyphen tells Liquid "strip out any extra whitespace around this tag."

Use this hyphen trick on logic tags that don't need to show anything themselves, like `if`, `for`, `assign`, `capture`, and `comment`. Here's what the difference looks like in practice:

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

There's one case where you should leave the hyphens off: when the whitespace itself matters. For example, if you have two inline elements that need a real space between them on the page, stripping that space would break your layout.

## Objects: check before you assume

A common mistake, even for experienced Liquid developers, is assuming an object or one of its nested properties, like `product.featured_media`, will always be there.

Here's the tricky part: Liquid doesn't throw an error when something is missing. It just quietly renders nothing. That might sound convenient, but it actually hides bugs from you instead of telling you something went wrong.

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

The takeaway: always check that a nested piece of data exists before you use it. A few extra lines of code now save you a confusing bug later.

## The most common global objects (a quick map)

Here are the global objects you'll use the most, along with a common trap to watch out for with each one.

| Object | What it gives you | Common gotcha |
|---|---|---|
| `product` | Current product, on product templates | `product.selected_or_first_available_variant` for the active variant, not `product.variants.first` |
| `collection` | Current collection | `collection.products` is paginated (split into pages), so respect `paginate` for large collections |
| `cart` | The customer's cart | `cart.item_count` for a badge; `cart.items` for the full line list |
| `section` | The current section's settings/blocks | `section.settings.x`, `section.blocks` |
| `block` | The current block (inside a `{% for block in section.blocks %}` loop) | Only available inside that loop's scope |
| `shop` | Store-wide info (name, currency, domain) | `shop.money_format` for manual currency formatting (rare, prefer the `money` filter) |
| `routes` | Canonical internal URLs | Always use this instead of hardcoding a path |
| `settings` | Theme-wide settings from `config/settings_schema.json` | Distinct from `section.settings`: this one is theme-wide, that one is section-specific |
| `request` | Info about the current request (page type, locale) | `request.locale.iso_code` for the active language |
| `localization` | Available languages/countries, current selection | Used for language/country selectors |

Want the full list? Check out the [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/) in Learning Articles.

## Filters: prefer Shopify's built-ins over manual logic

Shopify already gives you filters for the tricky stuff, like formatting money and building URLs. Use them instead of writing that logic yourself.

```liquid
{% comment %} ❌ WRONG — manual currency formatting, breaks for
   currencies with different decimal/thousands conventions {% endcomment %}
${{ product.price | divided_by: 100.0 }}

{% comment %} ✅ RIGHT — the money filter handles the store's actual
   currency format and localization {% endcomment %}
{{ product.price | money }}
```

The same idea applies to building links. Don't glue a URL together by hand when Liquid already gives you the finished, correct one.

```liquid
{% comment %} ❌ WRONG — string concatenation for a URL {% endcomment %}
<a href="/products/{{ product.handle }}">

{% comment %} ✅ RIGHT — the url property already accounts for
   the store's routing/locale prefix {% endcomment %}
<a href="{{ product.url }}">
```

Takeaway: if Shopify already built a filter for the job, use it. It has already handled edge cases you probably haven't thought of yet.

## Snippets vs. theme blocks — pick the right building block

Both snippets and theme blocks let you reuse a piece of code in more than one place, but they work differently and solve different problems.

- **Snippet** (`{% render 'name', param: value %}`): this only gets the data you explicitly hand it. Use a snippet for anything you reuse with different data, where a merchant doesn't need to reorder it in the editor.
- **Theme block**: this automatically gets `block`/`section` data, without you passing any variables in. Use a theme block for anything a merchant can edit, add, remove, or reorder inside the theme editor.

```liquid
{% comment %} ✅ snippet — explicit, no surprise scope leakage {% endcomment %}
{% render 'product-card', product: collection.products[0], show_vendor: true %}
```

One more rule: never use `{% include %}`. It's deprecated, and unlike `{% render %}`, it leaks the calling file's variables into the file it includes. That creates a hidden connection between two files that makes your codebase harder to understand as it grows.

## Documenting snippets: LiquidDoc

Every snippet you write should start with a `{%- doc -%}` block that describes its parameters. This way, the next developer who opens your snippet knows exactly what it needs, without reading through the whole file to figure it out.

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

Think of a `{%- doc -%}` block as a short note left for your future self, or for a teammate. It only takes a minute to write, and it saves everyone time later.

## Formatting conventions

These are small habits that keep every file in the codebase looking the same, so anyone can jump between files without getting confused.

| Rule | Example |
|---|---|
| 2-space indentation, matching HTML nesting | (none) |
| `snake_case` for variable names assigned with `{% assign %}`/`{% capture %}` | `{% assign is_on_sale = ... %}`, not `{% assign isOnSale = ... %}` |
| One `{% comment %}` above any non-obvious logic block, not a comment on every line | (none) |
| Boolean-named variables read as a yes/no question | `show_vendor`, `is_available`, `has_discount`, not `vendor_flag` |

## Performance: avoid repeated expensive lookups

If you calculate the same value over and over inside a loop, you're wasting time the browser (or Shopify's server) doesn't need to spend. Calculate it once, then reuse the result.

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

Also, always paginate large collections with `{% paginate collection.products by 24 %}` instead of rendering every product on one page. This isn't just a style choice. It's also a real performance requirement for passing Lighthouse checks. See [Performance & Lighthouse](/theme-store-requirements/performance/) for more on that.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `{%-`/`-%}` on logic tags by default. Only skip it where the spacing of visible content actually depends on that whitespace. | **Leaving out whitespace control.** This fills the rendered HTML with blank lines. It won't break your page, but it makes the actual page source harder to read while you're debugging. |
| Guard every nested object access that might be missing, like a variant's media, a metafield, or an optional block setting, instead of assuming it's there. | **Assuming a nested object exists,** like a variant's featured image or an optional metafield, and letting Liquid silently render nothing instead of checking for it explicitly. |
| Write a `{%- doc -%}` block on every snippet. Treat a snippet without documented parameters as unfinished. | **Formatting currency or building URLs by hand** instead of using `money`, `url`, or `routes`. This breaks the moment the store's currency format or URL structure turns out to be different from what you assumed. |
| Use `{% render %}`, never `{% include %}`. The scope leakage in `{% include %}` causes real bugs as a codebase grows. | **Using `{% include %}`** out of habit from an older codebase. It's deprecated, and it leaks scope in a way `{% render %}` deliberately avoids. |

## Key takeaways
- Use whitespace control (`{%-`/`-%}`) on logic tags by default.
- Guard nested object access. Never assume a property exists.
- Use `money`/`url`/`routes` instead of manual formatting or hardcoded paths.
- Use `{% render %}` for snippets (with explicit params) and theme blocks for merchant-editable/reorderable content. Never use `{% include %}`.
- Add a `{%- doc -%}` block to every snippet.
- Use `snake_case` for assigned variables, and name booleans so they read as yes/no questions.

## Further reading

- [Liquid reference](https://shopify.dev/docs/api/liquid) - shopify.dev
- [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) - shopify.dev
