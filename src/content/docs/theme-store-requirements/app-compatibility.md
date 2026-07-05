---
title: App Compatibility (App Blocks)
description: How your theme must make room for merchant apps, without depending on any.
---

Shopify draws a firm line here: your theme must let merchant apps plug in, but your theme itself must never depend on an app to work.

## What you must support

**App blocks in specific sections.** Your main product section and featured product section must accept blocks of type `@app` — this is what lets an app (like a reviews widget or an upsell tool) insert itself into those sections from the theme editor, with no code changes from the merchant.

```json
// sections/main-product.liquid — {% schema %}
{
  "name": "Main product",
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
```

**A Custom Liquid section and block.** Include a section (available on every section-supporting template) and a block, both with a setting of type `liquid`. This gives merchants — and apps — a generic insertion point anywhere in the theme, even in places you didn't specifically design an app slot for.

```json
{
  "name": "Custom liquid",
  "settings": [
    {
      "type": "liquid",
      "id": "custom_liquid",
      "label": "Liquid code"
    }
  ]
}
```

## What you must never do

- **Never build functionality that depends on an app to function.** If a feature only half-works without a specific app installed, that's a rejection.
- **Never build "app-like" functionality yourself** — wishlists, appointment scheduling, cart-level discount codes, an Instagram feed. If it needs API access to work properly, it belongs in an app, not baked into the theme.

```liquid
{% comment %}
  WRONG: theme code that silently assumes a third-party app's snippet exists.
  If the merchant hasn't installed that app, this breaks with no clear error.
{% endcomment %}
{% render 'some-reviews-app-snippet' %}

{% comment %}
  RIGHT: give the merchant a Custom Liquid or app block slot instead,
  so the theme works with or without any app installed.
{% endcomment %}
```

## Quick Reference

- `@app` blocks required in the main product section and featured product section.
- A Custom Liquid section + block required, both with a `liquid`-type setting.
- Never make a feature depend on an app being installed.
- Never build app-like functionality (wishlists, Instagram feeds, etc.) into the theme itself.

## Further Reading

- [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) — shopify.dev
- [Best practices for sections and blocks](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks) — shopify.dev
