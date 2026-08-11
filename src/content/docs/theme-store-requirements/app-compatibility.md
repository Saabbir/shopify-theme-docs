---
title: App Compatibility (App Blocks)
description: How your theme must make room for merchant apps, without depending on any.
---

**TL;DR:** How your theme must make room for merchant apps, without depending on any.

Shopify draws a firm line here. Your theme must let merchant apps plug in, but your theme itself must never depend on an app to work. An "app block" is a slot in a section where a merchant's installed app can add its own content, like a reviews widget, without the merchant touching any code.

## What you must support

| Requirement | ✅ Do | ❌ Don't |
|---|---|---|
| App blocks in the main product section | Accept `{ "type": "@app" }` alongside your own blocks | Restrict the section's `blocks` array to only your own theme block types |
| App blocks in the featured product section | Same as above | Same as above |
| A Custom Liquid section | Include one, available on every section-supporting template, with a `liquid`-type setting | Omit it, or restrict it to only certain templates |
| A Custom Liquid block | Include one with a `liquid`-type setting | Assume the Custom Liquid *section* alone is sufficient |

**App blocks in specific sections.** Your main product section and featured product section must accept blocks of type `@app`. This is what lets an app, like a reviews widget or an upsell tool, insert itself into those sections from the theme editor. The merchant doesn't need to change any code to make it happen.

```json
// ✅ RIGHT — sections/main-product.liquid — {% schema %}
{
  "name": "Main product",
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
```

```json
// ❌ WRONG — merchants can't add reviews apps, upsell apps, or anything
// else into this section no matter what they install
{
  "name": "Main product",
  "blocks": [
    { "type": "title" },
    { "type": "price" },
    { "type": "buy-buttons" }
  ]
}
```

**A Custom Liquid section and block.** Include a section (available on every section-supporting template) and a block, both with a setting of type `liquid`. This gives merchants, and apps, a place to add code anywhere in the theme, even in spots where you didn't build a dedicated app slot.

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

| ✅ Do | ❌ Don't |
|---|---|
| Build a Custom Liquid slot for reviews/loyalty/upsell functionality | Build a reviews, loyalty, or upsell system yourself into the theme |
| Let a feature degrade gracefully with zero apps installed | Ship a feature that only "half works" without a specific third-party app |
| Use a Custom Liquid or app block slot for anything API-dependent | Build wishlists, appointment scheduling, or an Instagram feed directly into theme code |

- **Never build a feature that depends on an app to work.** If a feature only half-works without a specific app installed, Shopify will reject the theme.
- **Never build "app-like" functionality yourself.** That means no wishlists, no appointment scheduling, no cart-level discount codes, no Instagram feed built into the theme. If a feature needs API access to work properly, it belongs in an app, not baked into the theme.

```liquid
{% comment %}
  ❌ WRONG: theme code that silently assumes a third-party app's snippet exists.
  If the merchant hasn't installed that app, this breaks with no clear error.
{% endcomment %}
{% render 'some-reviews-app-snippet' %}

{% comment %}
  ✅ RIGHT: give the merchant a Custom Liquid or app block slot instead,
  so the theme works with or without any app installed.
{% endcomment %}
```

### A worked example: adding a reviews slot to a Solis product page

```liquid
{% comment %} sections/main-product.liquid — allow apps to add a reviews
   widget below the description, without Solis depending on any specific
   reviews app being installed {% endcomment %}
<div class="product-main">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Main product",
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ],
  "presets": [
    {
      "name": "Main product",
      "blocks": [
        { "type": "title" },
        { "type": "price" },
        { "type": "description" },
        { "type": "buy-buttons" }
      ]
    }
  ]
}
{% endschema %}
```

A merchant who installs a reviews app can now drag its app block in below the description, right in the theme editor. No code change is needed, and Solis works fine whether or not that app is installed.

## Best practices

- Design every major section with an `@app` slot from the start. Don't add it later, only after a merchant complains it's missing.
- If a feature idea sounds like "an app would normally do this," treat that as a sign it belongs in a Custom Liquid slot or an app integration, not in your theme code.
- Test your theme's core flow (browse to product to cart to checkout) with zero apps installed. Everything should work completely, even if it's less feature-rich than with an app installed.

## Common mistakes

- **Restricting a section's `blocks` array to only your own types and forgetting `@app`.** This silently blocks every third-party app from working with that section.
- **Building a feature that "just needs" one specific app to fully work.** Shopify treats this as an app dependency, and it gets rejected no matter how good the feature is.
- **Assuming the Custom Liquid section alone satisfies the requirement.** The Custom Liquid *block* is a separate, additional requirement, you need both.
- **Forgetting to test with zero apps installed.** A feature that silently breaks without a specific app is exactly the problem this requirement exists to prevent.

## Key takeaways
- `@app` blocks required in the main product section and featured product section.
- A Custom Liquid section + block required, both with a `liquid`-type setting.
- Never make a feature depend on an app being installed.
- Never build app-like functionality (wishlists, Instagram feeds, etc.) into the theme itself, use a Custom Liquid or app block slot instead.

## Further reading

- [App blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks) (shopify.dev)
- [Best practices for sections and blocks](https://shopify.dev/docs/storefronts/themes/best-practices/templates-sections-blocks) (shopify.dev)
