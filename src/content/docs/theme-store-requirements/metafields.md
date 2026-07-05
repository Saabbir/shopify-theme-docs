---
title: Metafields & Metaobjects
description: Using custom data safely in a theme meant for any merchant.
---

Metafields and metaobjects let merchants attach custom structured data to products, pages, and other resources — a "material" field on a product, a "brand story" metaobject, and so on. They're powerful, but a Theme Store theme has to use them more carefully than a one-off client theme.

## The rule that trips people up

> For `metaobject` and `metaobject_list` settings, only **standard definitions** can be used as the `metaobject_type`. Custom or app-owned definitions cannot be used.

In a client project, you'd happily create a custom metaobject definition (say, `brand_story`) and reference it directly. In a Theme Store theme, you can't — every merchant who installs your theme has a different store, with different (or no) custom metaobject definitions. If your schema references a definition that doesn't exist on their store, that setting breaks on install.

## What this means in practice

- Use **standard Shopify metaobject types** (the built-in ones Shopify ships, like standard product/variant metafields) in your `metaobject`/`metaobject_list` settings — not custom ones you defined for your own demo store.
- If a feature really needs custom structured data, expose it as a **theme setting** the merchant fills in themselves, not a metaobject reference baked into your schema defaults.
- Never ship a default value in `settings_data.json` that points at a resource (product, metaobject, page) that only exists in your demo store — it won't exist on a fresh install and will show as broken.

```json
// WRONG — references a metaobject type this merchant may not have
{
  "type": "metaobject",
  "id": "brand_story",
  "metaobject_type": "custom_brand_story"
}

// RIGHT — uses a standard type every store has
{
  "type": "metaobject",
  "id": "featured_review",
  "metaobject_type": "shopify--reviews--reviews"
}
```

## Quick Reference

- `metaobject`/`metaobject_list` settings: standard definitions only, never custom or app-owned ones.
- Don't default a setting to a resource that only exists in your own demo store.
- Need custom data? Make it a merchant-facing setting, not a hardcoded metaobject reference.

## Further Reading

- [Metaobject input setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#metaobject) — shopify.dev
- [Settings requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#14-settings) — shopify.dev
