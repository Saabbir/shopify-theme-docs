---
title: Block Presets
description: The "presets" array on a theme block's schema — why a dynamic block needs one to appear at all, static vs. dynamic preset rules, nested block presets, and real-world examples.
---

**TL;DR:** The "presets" array on a theme block's schema — why a dynamic block needs one to appear at all, static vs. dynamic preset rules, nested block presets, and real-world examples.

A block preset is a `"presets"` array inside a theme block's own `{% schema %}` tag, in the `blocks/` folder. Like a [section preset](/presets/section-presets/), it's a different concept from a [theme preset](/presets/theme-presets/), the one that configures the whole theme through `config/settings_data.json`.

## The rule that's easy to miss: dynamic blocks need a preset to appear at all

**A theme block with zero `"presets"` entries never shows up in the theme editor's "Add block" picker.** It doesn't appear empty or with no defaults — it isn't there as an option at all. This is the single most common reason a newly built block "doesn't show up" for a merchant, and it catches even experienced theme developers because nothing else in the schema hints at it.

This rule specifically applies to **dynamically rendered blocks** — the ones a merchant adds, removes, and reorders themselves through the picker. [Static blocks](#static-vs-dynamic-blocks-a-different-preset-rule), a separate mechanism for structural blocks a merchant shouldn't be able to delete, work differently. See the comparison below.

```liquid
{% schema %}
{
  "name": "Quote",
  "settings": [
    { "type": "richtext", "id": "quote", "label": "t:settings.quote_text" },
    { "type": "text", "id": "author", "label": "t:settings.author" }
  ],
  "presets": [
    {
      "name": "t:names.quote",
      "settings": { "quote": "Fast shipping, beautifully packaged.", "author": "A. Merchant" }
    }
  ]
}
{% endschema %}
```

Without that `"presets"` array, this `Quote` block compiles fine, causes no error, and simply never appears as an option when a merchant clicks "Add block." That silence is exactly what makes the bug easy to miss in review.

## Full attribute reference

| Attribute | Required | What it does |
|---|---|---|
| `name` | **Yes** | The preset's display name in the **Add block** picker and sidebar. Persisted into the JSON template the moment a merchant adds it. |
| `category` | No | Groups related presets into a collapsible category in the **Add block** picker, same behavior as a section preset's `category`. |
| `settings` | No | Default values pre-populating the block's own settings. |
| `blocks` | No | Default **child** blocks included with this block. A block preset can reference other theme blocks and assemble them into a specific nested configuration, not just its own settings. |

## Nested block presets: a block preset can assemble other blocks

Because theme blocks can accept other theme blocks as children (up to 8 levels deep — see [Block schema: blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema#blocks)), a block's own preset can pre-assemble a whole small structure, not just its own settings:

```liquid
{% schema %}
{
  "name": "Slide",
  "blocks": [{ "type": "@app" }, { "type": "@theme" }],
  "settings": [
    { "type": "image_picker", "id": "image", "label": "t:settings.background_image" },
    { "type": "color_background", "id": "background", "label": "t:settings.background_color" }
  ],
  "presets": [
    {
      "name": "t:names.slide",
      "category": "t:categories.banners",
      "settings": { "background": "#000000" },
      "blocks": [
        { "type": "text", "settings": { "text": "This is a slide!" } }
      ]
    }
  ]
}
{% endschema %}
```

Adding this preset gives a merchant a `Slide` block that already contains a `text` child block with realistic content, not an empty container they have to populate block by block.

## Static vs. dynamic blocks: a different preset rule

Not every block a merchant sees came from the picker. A **static block** is one you place directly in Liquid with `{% content_for "block", type: "...", id: "..." %}`, for structural pieces a merchant shouldn't be able to delete, reorder, or duplicate, like the icon that always accompanies a specific row layout. Static blocks follow a different preset rule than dynamic ones:

| | Dynamic blocks (from the picker) | Static blocks (placed in Liquid) |
|---|---|---|
| Added by | The merchant, via **Add block** | The theme developer, via `content_for "block"` |
| Reorderable / removable by a merchant | Yes | No |
| Needs a `"presets"` entry to appear | **Yes — required**, or it's invisible in the picker | **No** — it renders regardless, since it's placed directly in Liquid |
| Counts toward `max_blocks` | Yes | No |
| Can still appear inside a preset | Yes, as a normal child entry | Yes, but needs two extra keys: `"static": true` and a matching `"id"` |

A static block preset entry lets you override that static block's *default settings* without changing whether or where it renders:

```liquid
{% comment %} sections/collapsible-row.liquid {% endcomment %}
{% content_for "block", type: "collapsible-row-summary", id: "collapsible-row" %}
<div>
  {% content_for "blocks" %}
</div>

{% schema %}
{
  "name": "Collapsible row",
  "tag": "details",
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [
    {
      "name": "t:names.collapsible_row",
      "blocks": [
        {
          "type": "collapsible-row-summary",
          "static": true,
          "id": "collapsible-row",
          "blocks": [
            {
              "type": "icon",
              "id": "collapsible-row-icon",
              "static": true,
              "settings": { "icon": "check_mark" }
            }
          ]
        },
        {
          "type": "group",
          "blocks": [{ "type": "heading" }, { "type": "text" }]
        }
      ]
    }
  ]
}
{% endschema %}
```

Here, `collapsible-row-summary` and its child `icon` are static, they always render, a merchant can't delete them, and they don't need a preset entry to appear at all. This preset only exists to give them non-default starting settings (`"icon": "check_mark"`) and to seed the dynamic `group` block underneath with a heading and text a merchant can freely edit.

## Real-world example: an icon-and-text block with three preset variations

An "Icon with text" block used inside multiple sections (a features row, a trust-badge strip, a shipping-info banner) benefits from several presets, each pre-filled for a common real use case instead of one generic empty block:

```liquid
{% schema %}
{
  "name": "Icon with text",
  "settings": [
    { "type": "text", "id": "icon_name", "label": "t:settings.icon" },
    { "type": "text", "id": "heading", "label": "t:settings.heading" },
    { "type": "richtext", "id": "body", "label": "t:settings.body" }
  ],
  "presets": [
    {
      "name": "t:names.shipping",
      "category": "t:categories.trust_signals",
      "settings": { "icon_name": "truck", "heading": "Free shipping", "body": "<p>On orders over $75.</p>" }
    },
    {
      "name": "t:names.returns",
      "category": "t:categories.trust_signals",
      "settings": { "icon_name": "refresh-cw", "heading": "Easy returns", "body": "<p>30-day return window.</p>" }
    },
    {
      "name": "t:names.support",
      "category": "t:categories.trust_signals",
      "settings": { "icon_name": "message-circle", "heading": "Real support", "body": "<p>A real person replies within a day.</p>" }
    }
  ]
}
{% endschema %}
```

A merchant building a trust-badge row now picks "Free shipping," "Easy returns," or "Real support" by name, grouped under one collapsible "Trust signals" category, instead of adding three identical empty blocks and guessing what to type into each one. That's the concrete usefulness of a block preset: it turns a reusable, generic block into a set of named, ready-to-use building blocks for the specific things merchants actually want to say.

## Best practices

- Give every dynamic block at least one preset with realistic content, treat this as required, not optional, since a preset-less dynamic block is invisible to merchants.
- Use `category` once a block offers three or more presets, so they're grouped instead of listed flat.
- Reach for nested block presets when a block's most common real use includes specific children, not just its own settings.
- Use `"static": true` with a matching `id` only to override a static block's default settings, never to control whether it renders, static rendering is controlled entirely by the `content_for "block"` tag's placement.
- Localize every preset `name` and `category` with a `t:` key.

## Common mistakes

- **Shipping a dynamic block with no `"presets"` entry**, which makes it invisible in the editor's block picker, the single most common "why isn't my block showing up" bug.
- **Adding a preset for every minor variation** instead of using a setting, this inflates the number of presets you maintain for things that should just be merchant-configurable.
- **Assuming a static block needs a preset entry to render.** It doesn't; static blocks render from their `content_for "block"` placement in Liquid regardless of the preset.
- **Shipping placeholder content** ("Lorem ipsum," "Heading here") in a preset instead of realistic example content a merchant can actually evaluate.

## Key takeaways
- Block presets live in a theme block's own `{% schema %}` → `"presets"` array.
- A **dynamic** block with zero presets never appears in the "Add block" picker — effectively required for any merchant-addable block.
- **Static** blocks (placed via `content_for "block"`) render regardless of presets; a preset entry for one only overrides its default settings, using `"static": true` and a matching `id`.
- A block preset can nest child blocks, pre-assembling a small structure, not just its own settings.
- Use `category` to group presets once a block offers more than two or three.

## Further reading

- [Theme Presets](/presets/theme-presets/) and [Section Presets](/presets/section-presets/): the other two kinds of preset
- [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/): every preset rule, mandatory vs. optional, in one place
- [Real-World Preset Examples](/presets/real-world-preset-examples/): more full worked examples
- [Codebase Structure: Theme Blocks](/codebase-structure/theme-blocks/): how theme blocks and nesting work in general
- [Block schema: presets](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema#presets) (shopify.dev)
- [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) (shopify.dev)
