---
title: Metafields & Metaobjects
description: Using custom data safely in a theme meant for any merchant.
---

**TL;DR:** Using custom data safely in a theme meant for any merchant.

Metafields and metaobjects are powerful, but a Theme Store theme has to use them more carefully than a one-off client theme does.

## The rule that trips people up

> For `metaobject` and `metaobject_list` settings, only **standard definitions** can be used as the `metaobject_type`. Custom or app-owned definitions cannot be used.

On a client project, you could freely create a custom metaobject definition (say, `brand_story`) and reference it directly. On a Theme Store theme, you can't do that. Here's why: every merchant who installs your theme has a different store, with different custom metaobject definitions, or none at all. If your schema references a definition that doesn't exist on their store, that setting breaks the moment they install your theme.

## What this means in practice

| ✅ Do | ❌ Don't |
|---|---|
| Use standard Shopify metaobject types in `metaobject`/`metaobject_list` settings | Reference a custom or app-owned `metaobject_type` you defined for your own demo store |
| Expose custom-data needs as a merchant-facing theme setting | Hardcode a metaobject reference into a schema default |
| Confirm every `settings_data.json` default resource exists on a fresh install | Default a setting to a product, page, or metaobject that only exists in your demo store |
| Use standard product/variant metafields where Shopify provides them | Invent a custom metafield namespace and assume every merchant will populate it |

```json
// ❌ WRONG — references a metaobject type this merchant may not have
{
  "type": "metaobject",
  "id": "brand_story",
  "metaobject_type": "custom_brand_story"
}

// ✅ RIGHT — uses a standard type every store has
{
  "type": "metaobject",
  "id": "featured_review",
  "metaobject_type": "shopify--reviews--reviews"
}
```

### A worked example: a "material" field on a Solis product page

Say Solis wants to show a product's material (cotton, leather, and so on) on the product page. There are two ways to build this: one that works for every merchant, and one that only works for stores that happen to have your exact custom setup.

```liquid
{% comment %} ❌ WRONG — assumes every merchant has defined a custom
   product metafield namespace exactly matching yours. A fresh install
   with no such metafield just renders nothing, with no clear reason why. {% endcomment %}
{{ product.metafields.custom.material_type.value }}

{% comment %} ✅ RIGHT — a real theme setting merchants can see, understand,
   and fill in via the theme editor. Works identically for every merchant,
   regardless of their own metafield setup. {% endcomment %}
{% if block.settings.show_material and block.settings.material_text != blank %}
  <p class="material">{{ block.settings.material_text }}</p>
{% endif %}
```

```json
{
  "type": "checkbox",
  "id": "show_material",
  "label": "t:settings.show_material.label",
  "default": true
},
{
  "type": "text",
  "id": "material_text",
  "label": "t:settings.material_text.label"
}
```

If you genuinely want to pull from Shopify's own **standard** product metafields (not a custom namespace), that's fine. The restriction is specifically about *custom or app-owned* definitions, not metafields in general.

## Best practices

- Default to a plain theme setting for merchant-facing custom data. Only reach for a standard metaobject reference when Shopify already ships the exact standard type you need.
- Check every `settings_data.json` default before submission. A reference to a resource that only exists in your demo store is one of the more common reasons themes get rejected late.
- If you're not sure whether a metaobject type counts as "standard," check [Shopify's standard metaobject definitions](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#metaobject) instead of guessing.

## Common mistakes

- **Defining a custom metaobject type for your own demo store, then referencing it directly in schema.** This works fine on your store, then breaks on every merchant's fresh install.
- **Defaulting a `product`/`page`/`metaobject` setting to a specific resource ID from your demo store.** Same failure, just on a different setting type.
- **Assuming any use of metafields is off-limits.** The restriction only covers custom or app-owned `metaobject_type` values in `metaobject`/`metaobject_list` settings, standard metafields elsewhere are fine.

## Key takeaways
- `metaobject`/`metaobject_list` settings: standard definitions only, never custom or app-owned ones.
- Don't default a setting to a resource that only exists in your own demo store.
- Need custom data? Make it a merchant-facing setting, not a hardcoded metaobject reference.

## Further reading

- [Metaobject input setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#metaobject) (shopify.dev)
- [Settings requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#14-settings) (shopify.dev)
