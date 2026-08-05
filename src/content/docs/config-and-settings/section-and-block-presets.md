---
title: Section & Block Presets
description: The other kind of preset — what a merchant gets when adding a section or block fresh from the editor picker, and why a block needs one to appear at all.
---

The word "preset" means two different things in a Shopify theme, at two different levels, and it's easy to mix them up. [Theme Presets](/config-and-settings/theme-presets/) live in `config/settings_data.json` and configure the *whole theme*. This page covers the other kind: a `"presets"` array inside a section or block's own `{% schema %}` tag, which lives with that section or block's code, not in the `config/` folder at all.

## The two kinds, side by side

| | Section/block preset | Theme preset |
|---|---|---|
| Lives in | A section or block's own `{% schema %}` → `"presets"` array | `config/settings_data.json` → `"presets"` object |
| Controls | What appears when a merchant clicks "Add section" or "Add block" in the editor | An entire pre-configured look for the whole theme |
| Scope | One section/block type | The whole theme |
| Required? | **Yes for blocks** — a block with no `"presets"` entry never appears in the block picker at all | Yes, every theme needs at least one theme preset |

## What a section/block preset actually defines

A `"presets"` array inside a section or block's schema defines the default settings and blocks a merchant gets the moment they add it fresh from the editor's picker. Think of it as a starter kit: instead of handing a merchant a blank section, you hand them one already filled in with sensible content.

```liquid
{% schema %}
{
  "name": "t:names.testimonials",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:settings.heading", "default": "What people are saying" }
  ],
  "blocks": [
    {
      "type": "quote",
      "name": "t:names.quote",
      "settings": [
        { "type": "richtext", "id": "quote", "label": "t:settings.quote_text" },
        { "type": "text", "id": "author", "label": "t:settings.author" }
      ]
    }
  ],
  "presets": [
    {
      "name": "t:names.testimonials",
      "blocks": [
        { "type": "quote", "settings": { "quote": "Great service!", "author": "A. Merchant" } },
        { "type": "quote", "settings": { "quote": "Fast shipping.", "author": "B. Customer" } }
      ]
    }
  ]
}
{% endschema %}
```

Notice the locale keys use flat, shared namespaces like `names.*` and `settings.*`, the same convention covered in [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/#setting-groups-the-t-convention), not something nested like `t:sections.testimonials.settings.heading.label`. See the [Complete Worked Example](/codebase-structure/complete-worked-example/) for this convention, checked against Horizon and Skeleton's real shipped source code.

## Rules that are easy to miss

- **A block with zero `"presets"` entries never shows up in the theme editor's "Add block" picker at all.** It doesn't show up empty or with no defaults, it just isn't there as an option. This is the single most common reason a newly built block "doesn't show up" for a merchant.
- A section can have **more than one preset.** This helps when a section genuinely has more than one common starting point. For example, a "Featured Collection" section could offer a "Grid" preset and a "Carousel" preset, if the layout choice is significant enough to deserve two separate starting points instead of one preset plus a setting.
- Preset block settings should show **realistic example content**, not empty placeholders. A merchant previewing what adding this section looks like should see something close to real, finished content. See [Store & Design Requirements](/theme-store-requirements/store-and-design/) for more on this.

| Do | Don't |
|---|---|
| Give every block at least one preset with realistic example content | Ship a block with no `"presets"` entry and wonder why it's missing from the picker |
| Use multiple section presets only when there are genuinely distinct common configurations | Add a preset for every minor settings variation. That's what settings are for |
| Localize preset names with `t:`, the same as every other schema string | Hardcode English preset names |

## Best practices

- Give every block at least one preset with realistic example content — treat this as required, not optional, since a preset-less block is invisible to merchants.
- Use multiple section presets only for genuinely distinct common configurations, not every minor variation (that's what settings are for).
- Localize every preset name with `t:`, consistent with the rest of the schema.

## Common mistakes

- **Shipping a block with no `"presets"` entry**, which makes it invisible in the editor's block picker. This is the single most common "why isn't my block showing up" bug.
- **Adding a preset for every minor variation** instead of using a setting. This inflates the number of presets you have to maintain for things that should just be merchant-configurable.
- **Shipping placeholder content in a preset** ("Lorem ipsum," "Heading here") instead of realistic example content a merchant can actually evaluate.

## Quick Reference

- Section/block presets live in `{% schema %}`'s `"presets"` array, not in `config/`.
- A block with zero presets never appears in the "Add block" picker — this is effectively required for any block you want merchants to find.
- A section can have multiple presets for genuinely distinct starting configurations.
- Use realistic example content in every preset, and localize preset names with `t:`.

## Further Reading

- [Theme Presets](/config-and-settings/theme-presets/): the other kind of preset, configuring the whole theme
- [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/): the `t:` convention this page's preset names follow
- [Complete Worked Example](/codebase-structure/complete-worked-example/): a full section/block schema with presets, checked against real Shopify source
- [Store & Design Requirements](/theme-store-requirements/store-and-design/): why preset content needs to look realistic, not like a placeholder
