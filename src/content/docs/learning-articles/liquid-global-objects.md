---
title: "Learning Article: Liquid Global Objects Reference"
description: A detailed, example-driven tour of the objects available in Liquid templates.
---

The [Liquid Style Guide](/style-guides/liquid/) gives you a quick map of the most common objects. This article goes deeper. It covers what each object actually contains, where you can use it, and the mistakes that trip people up in real projects.

A quick note before you start: an "object" here just means a named bundle of data that Liquid (Shopify's templating language) hands you, like `product` or `cart`. You'll see one heading below for each object, with examples and the gotchas (small traps that catch people off guard) to watch for.

## `product`

You can use `product` on product templates, and anywhere else you render a product by hand, like a card in a grid or a related-products list.

```liquid
{{ product.title }}
{{ product.description }}
{{ product.featured_image | image_url: width: 800 }}
{{ product.price | money }}                        {# lowest variant price, in cents until filtered #}
{{ product.selected_or_first_available_variant.id }}
```

**Gotcha**: `product.price` gives you the price of the *cheapest available variant*. It's not necessarily the price of the variant the customer currently has selected. If you want the actual selected variant's price, use `product.selected_or_first_available_variant.price` instead.

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

**Gotcha**: if you leave out `{% paginate %}`, `collection.products` falls back to Shopify's standard page size. On a large collection, that can quietly cut off products you expect to see, with no error to warn you. Always wrap collection product loops in `{% paginate %}`. It's also a performance requirement, see [Performance & Lighthouse](/theme-store-requirements/performance/).

## `cart`

```liquid
{{ cart.item_count }}
{{ cart.total_price | money }}
{% for item in cart.items %}
  {{ item.product.title }} × {{ item.quantity }}
  {{ item.line_price | money }}
{% endfor %}
```

**Gotcha**: `cart` shows the state of the cart at the moment the page loaded, since it's rendered on the server. After an AJAX add-to-cart (adding an item without reloading the page), the Liquid `cart` object on the current page is out of date until the page actually refreshes. To update the cart UI without a full reload, use the JSON response from the Cart AJAX API. Don't try to re-render Liquid `cart` data for this.

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

**Gotcha**: you must output `block.shopify_attributes` on each block's root element (the outermost HTML tag of that block), or the theme editor won't be able to highlight or select that block when someone clicks it. This is easy to forget, and you usually won't notice the mistake unless you're actively testing in the editor.

## `shop`

```liquid
{{ shop.name }}
{{ shop.email }}
{{ shop.domain }}
{{ shop.currency }}
{{ shop.money_format }}    {# rarely needed directly — prefer the `money` filter #}
```

## `routes`

Always use `routes` instead of typing out a path yourself. It stays correct across locale prefixes (like `/fr/` for French) and custom domain setups. A hardcoded string like `/products/` would quietly break in those cases, with no warning:

```liquid
{{ routes.root_url }}
{{ routes.cart_url }}
{{ routes.account_url }}
{{ routes.search_url }}
```

## `settings`

These are theme-wide settings, defined in `config/settings_schema.json`. They apply to the whole theme, which makes them different from `section.settings`, which only applies to one section instance (one specific copy of a section on the page):

```liquid
{{ settings.color_primary }}
{{ settings.type_heading_font }}
```

**Gotcha**: `settings` (theme-wide) and `section.settings` (this one section instance) look alike but are completely different objects. A common copy-paste mistake is writing `settings.heading` when you actually meant `section.settings.heading`. This renders blank with no error at all, because the theme-wide settings schema simply has no `heading` key.

## `request`

```liquid
{{ request.locale.iso_code }}     {# e.g. "en", "fr" #}
{{ request.page_type }}           {# "product", "collection", "index", etc. #}
{{ request.design_mode }}         {# true inside the theme editor #}
```

`request.design_mode` is useful for showing helpers that should only appear inside the editor. For example, you could show a placeholder or warning for an empty section, one that would otherwise render nothing at all on the live storefront.

## `localization`

This object powers language and country selectors, the dropdowns that let a shopper pick their language or country:

```liquid
{% for language in localization.available_languages %}
  <a href="{{ language.root_url }}" hreflang="{{ language.iso_code }}">{{ language.endonym_name }}</a>
{% endfor %}

{{ localization.country.name }}
{{ localization.language.iso_code }}
```

See [Managing Locale Files](/learning-articles/managing-locale-files/) for how this connects to the `locales/` folder.

## `customer`

The `customer` object is available when a customer is logged in. "Nil" is Liquid's word for empty or missing, so when no customer is logged in, `customer` is nil. Always check that it isn't nil before you try to use it:

```liquid
{% if customer %}
  Welcome back, {{ customer.first_name }}
{% else %}
  <a href="{{ routes.account_login_url }}">Log in</a>
{% endif %}
```

## `linklists`

This object holds the data behind menus that a merchant sets up in the Shopify admin:

```liquid
{% for link in linklists.main-menu.links %}
  <a href="{{ link.url }}">{{ link.title }}</a>
{% endfor %}
```

**Gotcha**: a `linklist` setting's default should be `main-menu` or `footer`, not a handle that only exists in your demo store. See the pre-zip checklist in [Packaging & Submitting](/publishing/packaging-and-submitting/).

## Best practices

- Always check for nil explicitly. This applies to `customer`, an optional metafield, or a variant with no image. Liquid just renders blank instead of throwing an error, which hides bugs instead of showing them to you.
- Be careful to tell `settings` (theme-wide) apart from `section.settings` (just this one instance). Their similar names are a common source of silent, hard-to-spot bugs.
- Always wrap `collection.products` in `{% paginate %}`. It matters both for correctness on large collections and for performance.

## Common mistakes

- **Assuming `product.price` is the currently selected variant's price.** It's actually the cheapest available variant's price.
- **Confusing `settings.x` and `section.settings.x`.** These are different objects, and it's easy to type the wrong one by mistake.
- **Forgetting `block.shopify_attributes`** on a block's root element, which breaks theme editor selection for that block.
- **Using stale `cart` data after an AJAX add-to-cart** instead of updating the UI from the Cart AJAX API's response.

## Quick Reference

- `product`, `collection`, `cart`, `section`/`block`, `shop`, `routes`, `settings`, `request`, `localization`, `customer`, and `linklists` are the objects you'll touch daily.
- `settings` is not the same as `section.settings`. `product.price` is not the same as the selected variant's price.
- Always paginate `collection.products`. Always guard `customer` and any optional nested object with a nil check.

## Further Reading

- [Liquid Style Guide](/style-guides/liquid/): the day-to-day rules.
- [Liquid objects reference](https://shopify.dev/docs/api/liquid/objects): the shopify.dev reference page.
