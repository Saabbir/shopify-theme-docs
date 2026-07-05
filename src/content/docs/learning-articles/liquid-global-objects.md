---
title: "Learning Article: Liquid Global Objects Reference"
description: A thorough, example-driven tour of the objects available in Liquid templates.
---

[Liquid Style Guide](/style-guides/liquid/) has a quick map of the most common objects. This article goes deeper — what each object actually contains, where it's available, and the gotchas that trip people up in practice.

## `product`

Available on product templates, and anywhere you're rendering a product manually (a card in a grid, a related-products list).

```liquid
{{ product.title }}
{{ product.description }}
{{ product.featured_image | image_url: width: 800 }}
{{ product.price | money }}                        {# lowest variant price, in cents until filtered #}
{{ product.selected_or_first_available_variant.id }}
```

**Gotcha**: `product.price` is the price of the *cheapest available variant*, not necessarily the variant currently selected. For the actual selected variant's price, use `product.selected_or_first_available_variant.price`.

## `collection`

```liquid
{{ collection.title }}
{{ collection.products.size }}     {# count on the current page, not the whole collection #}
{{ collection.all_products_count }} {# the actual total, across all pages #}

{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    ...
  {% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

**Gotcha**: without `{% paginate %}`, `collection.products` defaults to Shopify's standard page size, which may silently truncate a large collection — always wrap collection product loops in `{% paginate %}` (also a performance requirement, see [Performance & Lighthouse](/theme-store-requirements/performance/)).

## `cart`

```liquid
{{ cart.item_count }}
{{ cart.total_price | money }}
{% for item in cart.items %}
  {{ item.product.title }} × {{ item.quantity }}
  {{ item.line_price | money }}
{% endfor %}
```

**Gotcha**: `cart` reflects server-rendered state at page load — after an AJAX add-to-cart, the Liquid-rendered `cart` object on the current page is stale until a refresh. Use the Cart AJAX API's JSON response to update cart UI without a full reload, not a re-render of Liquid `cart` data.

## `section` and `block`

```liquid
{# In a section file: #}
{{ section.settings.heading }}
{{ section.id }}
{% for block in section.blocks %}
  {{ block.settings.text }}
  {{ block.type }}
  {{ block.shopify_attributes }}   {# required for theme editor selection/highlighting #}
{% endfor %}
```

**Gotcha**: `block.shopify_attributes` must be output on each block's root element or the theme editor can't highlight/select that block when clicked — an easy thing to forget and hard to notice unless you're actively testing in the editor.

## `shop`

```liquid
{{ shop.name }}
{{ shop.email }}
{{ shop.domain }}
{{ shop.currency }}
{{ shop.money_format }}    {# rarely needed directly — prefer the `money` filter #}
```

## `routes`

Always prefer `routes` over a hardcoded path — it's correct across locale prefixes and custom domain setups that a hardcoded `/products/` string would silently ignore:

```liquid
{{ routes.root_url }}
{{ routes.cart_url }}
{{ routes.account_url }}
{{ routes.search_url }}
```

## `settings`

Theme-wide settings from `config/settings_schema.json` — distinct from `section.settings`, which is scoped to one section instance:

```liquid
{{ settings.color_primary }}
{{ settings.type_heading_font }}
```

**Gotcha**: `settings` (theme-wide) and `section.settings` (this section instance) look similar but are entirely different objects — a common copy-paste mistake is referencing `settings.heading` when `section.settings.heading` was meant, silently rendering blank since the theme-wide settings schema has no `heading` key.

## `request`

```liquid
{{ request.locale.iso_code }}     {# e.g. "en", "fr" #}
{{ request.page_type }}           {# "product", "collection", "index", etc. #}
{{ request.design_mode }}         {# true inside the theme editor #}
```

`request.design_mode` is useful for editor-only affordances — e.g. showing a placeholder/warning in the editor for an empty section that would otherwise render nothing on the live storefront.

## `localization`

Powers language/country selectors:

```liquid
{% for language in localization.available_languages %}
  <a href="{{ language.root_url }}" hreflang="{{ language.iso_code }}">{{ language.endonym_name }}</a>
{% endfor %}

{{ localization.country.name }}
{{ localization.language.iso_code }}
```

See [Managing Locale Files](/learning-articles/managing-locale-files/) for how this connects to the `locales/` folder.

## `customer`

Available when a customer is logged in — always guard against it being nil:

```liquid
{% if customer %}
  Welcome back, {{ customer.first_name }}
{% else %}
  <a href="{{ routes.account_login_url }}">Log in</a>
{% endif %}
```

## `linklists`

Backing data for menus configured in the admin:

```liquid
{% for link in linklists.main-menu.links %}
  <a href="{{ link.url }}">{{ link.title }}</a>
{% endfor %}
```

**Gotcha**: a `linklist` setting's default should be `main-menu`/`footer`, not a demo-store-specific handle — see [Packaging & Submitting](/publishing/packaging-and-submitting/)'s pre-zip sanity checklist.

## Best practices

- Guard nil possibilities explicitly (`customer`, an optional metafield, a variant with no image) — Liquid renders silently blank rather than erroring, which hides the bug instead of surfacing it.
- Distinguish `settings` (theme-wide) from `section.settings` (this instance) deliberately — the similar names are a common source of silent, hard-to-spot bugs.
- Always wrap `collection.products` in `{% paginate %}` — both for correctness on large collections and for performance.

## Common mistakes

- **Assuming `product.price` is the currently selected variant's price** — it's the cheapest available variant's price.
- **Confusing `settings.x` and `section.settings.x`** — different objects, easy to typo into the wrong one.
- **Forgetting `block.shopify_attributes`** on a block's root element, breaking theme editor selection for that block.
- **Rendering `cart` data as stale after an AJAX add-to-cart** instead of using the Cart AJAX API's response to update the UI.

## Quick Reference

- `product`, `collection`, `cart`, `section`/`block`, `shop`, `routes`, `settings`, `request`, `localization`, `customer`, `linklists` — the objects you'll touch daily.
- `settings` ≠ `section.settings`. `product.price` ≠ the selected variant's price.
- Always paginate `collection.products`. Always guard `customer` and any optional nested object.

## Further Reading

- [Liquid Style Guide](/style-guides/liquid/) — day-to-day conventions
- [Liquid objects reference](https://shopify.dev/docs/api/liquid/objects) — shopify.dev
