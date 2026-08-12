---
title: Section Presets
description: The "presets" array on a section's own schema — what it's for, its full attribute list, category grouping, static-rendering caveats, and real-world examples.
---

**TL;DR:** The "presets" array on a section's own schema — what it's for, its full attribute list, category grouping, static-rendering caveats, and real-world examples.

A section preset is a `"presets"` array inside a section's own `{% schema %}` tag. It lives with that section's code, in the `sections/` folder, not in `config/` at all. Don't confuse it with a [Theme Preset](/presets/theme-presets/), which configures the whole theme from `config/settings_data.json` — Shopify's own documentation calls this distinction out explicitly, because the two are easy to mix up despite sharing a name.

## What a section preset actually defines

A section preset defines what a merchant gets the moment they add that section fresh from the editor's **Add section** picker: default setting values and a starting set of blocks. Think of it as a starter kit, not a blank section.

```liquid
{% schema %}
{
  "name": "t:names.featured_collection",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:settings.heading" },
    {
      "type": "select",
      "id": "layout",
      "label": "t:settings.layout",
      "options": [
        { "value": "grid", "label": "t:options.grid" },
        { "value": "carousel", "label": "t:options.carousel" }
      ],
      "default": "grid"
    }
  ],
  "blocks": [
    { "type": "product-card", "name": "t:names.product_card" }
  ],
  "presets": [
    {
      "name": "t:names.featured_collection_grid",
      "category": "t:categories.product",
      "settings": { "heading": "Shop the collection", "layout": "grid" },
      "blocks": [{ "type": "product-card" }, { "type": "product-card" }, { "type": "product-card" }]
    },
    {
      "name": "t:names.featured_collection_carousel",
      "category": "t:categories.product",
      "settings": { "heading": "New arrivals", "layout": "carousel" },
      "blocks": [{ "type": "product-card" }, { "type": "product-card" }, { "type": "product-card" }, { "type": "product-card" }]
    }
  ]
}
{% endschema %}
```

## Full attribute reference

| Attribute | Required | What it does |
|---|---|---|
| `name` | **Yes** | The preset's display name in the **Add section** picker and sidebar. Persisted into the JSON template the moment a merchant adds it. |
| `category` | No | Groups related presets into a collapsible category in the picker (see below). |
| `settings` | No | Default values pre-populating the section's own settings. |
| `blocks` | No | Default blocks included with the section, each needing a `type` that matches a real block type, and optionally its own `settings` and `name`. |

## How presets actually appear in the picker

- Presets are listed **alphabetically by `name`**, not in the order you wrote them in the schema.
- `category` groups related presets into a **collapsible section** in the **Add section** picker, letting you offer several starting points for one section type without cluttering the top-level list.
- **Uncategorized presets are always shown first**, above any categorized groups.
- The theme editor **auto-generates a preview thumbnail** for each preset. You can further control this with [visual preview mode](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks#detect-the-theme-editor-visual-preview) if the automatic preview doesn't represent the preset well.

## When to use more than one preset on the same section

A section can have any number of presets. Reach for a second one when a section genuinely has more than one common starting point that's worth naming separately, not for every minor settings variation (that's what settings are for):

| Reach for a second preset | Just use a setting instead |
|---|---|
| A "Featured Collection" section offering a **Grid** preset and a **Carousel** preset, because the layout choice is significant enough to be its own decision, not a minor tweak | A "Featured Collection" section offering a checkbox to "show product ratings" |
| A "Hero" section offering a **Full-bleed image** preset and a **Split image + text** preset, two genuinely different visual structures | A "Hero" section offering a "text alignment" select |
| A "Testimonials" section offering a **Single quote** preset and a **Grid of quotes** preset, each with a meaningfully different block count and settings | A "Testimonials" section offering a "background color" setting |

## Sections with presets shouldn't be statically rendered

If a section is [statically rendered](/codebase-structure/sections-and-section-groups/) (baked into a template's Liquid rather than added dynamically through the editor), it doesn't go through the **Add section** picker at all, so its `"presets"` array never actually gets used. Use the `"default"` schema attribute instead for a statically rendered section's starting configuration, it accepts the same shape as a preset object but applies without ever showing up in a picker.

## Real-world example: a "Features" section with two presets

A theme's "Icon list" section that highlights shipping, returns, and support benefits is a good candidate for two presets — a **three-column** layout for a full feature set, and a **single-row banner** for a merchant who only wants to highlight one thing:

```liquid
{% schema %}
{
  "name": "t:names.icon_list",
  "max_blocks": 6,
  "blocks": [
    {
      "type": "feature",
      "name": "t:names.feature",
      "settings": [
        { "type": "text", "id": "icon_name", "label": "t:settings.icon" },
        { "type": "text", "id": "heading", "label": "t:settings.heading" },
        { "type": "richtext", "id": "body", "label": "t:settings.body" }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:names.icon_list_three_column",
      "category": "t:categories.trust",
      "blocks": [
        { "type": "feature", "settings": { "icon_name": "truck", "heading": "Free shipping", "body": "<p>On every order over $75.</p>" } },
        { "type": "feature", "settings": { "icon_name": "refresh-cw", "heading": "Easy returns", "body": "<p>30 days, no questions asked.</p>" } },
        { "type": "feature", "settings": { "icon_name": "message-circle", "heading": "Real support", "body": "<p>A human replies within a day.</p>" } }
      ]
    },
    {
      "name": "t:names.icon_list_single_banner",
      "category": "t:categories.trust",
      "blocks": [
        { "type": "feature", "settings": { "icon_name": "truck", "heading": "Free shipping on every order", "body": "<p>No minimum, no fine print.</p>" } }
      ]
    }
  ]
}
{% endschema %}
```

A merchant who only cares about one trust signal gets the single-banner preset without hand-deleting two blocks; a merchant who wants the full set gets it pre-filled with realistic, on-brand copy instead of three empty blocks they have to write from scratch. That's the actual benefit a section preset buys you: it turns "configure this from nothing" into "adjust this from something reasonable."

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `category` to group presets once a section has more than two or three, so the picker stays scannable. | **Adding a preset for every minor settings variation** instead of using a setting, this inflates the preset list for no real benefit. |
| Only add a second preset for a genuinely distinct starting configuration, not a minor variation, that's what settings are for. | **Forgetting `category` on a section with many presets**, leaving merchants to scroll through a long flat list. |
| Give every preset realistic example content, matching the rule for [Store & Design Requirements](/theme-store-requirements/store-and-design/), not placeholder text. | **Shipping a `"presets"` array on a statically rendered section**, where it's simply never used, instead of `"default"`. |
| Use `"default"` instead of `"presets"` for any section that's statically rendered. | **Shipping placeholder content** ("Lorem ipsum," "Heading here") in a preset's blocks instead of realistic example copy. |
| Localize every preset `name` and `category` with a `t:` key, the same as every other schema string (see [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/#setting-groups-the-t-convention)). | — |

## Key takeaways
- Section presets live in a section's own `{% schema %}` → `"presets"` array, not in `config/`.
- Attributes: `name` (required), `category`, `settings`, `blocks` (all optional).
- Presets sort alphabetically by name; `category` groups them into a collapsible group; uncategorized presets show first.
- A statically rendered section should use `"default"`, not `"presets"`.
- Add a second preset only for a genuinely distinct starting point, not a minor variation.

## Further reading

- [Theme Presets](/presets/theme-presets/) and [Block Presets](/presets/block-presets/): the other two kinds of preset
- [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/): every preset rule, mandatory vs. optional, in one place
- [Real-World Preset Examples](/presets/real-world-preset-examples/): more full worked examples
- [Sections & Section Groups](/codebase-structure/sections-and-section-groups/): static vs. dynamic section rendering
- [Section schema: presets](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema#presets) (shopify.dev)
