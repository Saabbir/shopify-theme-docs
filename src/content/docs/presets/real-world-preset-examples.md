---
title: Real-World Preset Examples
description: A full worked multi-preset strategy for Solis, end to end — the business case, the settings_data.json, a shared section's presets, a block preset, and the packaging step.
---

**TL;DR:** A full worked multi-preset strategy for Solis, end to end — the business case, the settings_data.json, a shared section's presets, a block preset, and the packaging step.

The other pages in this section explain each preset type in isolation. This page walks through one realistic scenario end to end, the way you'd actually plan and build it, to make the benefit concrete rather than abstract.

## The scenario: Solis targets two different merchant segments

Say Solis, in its current form, suits a small, curated apparel or home-goods boutique: a tight product catalog, a lot of visual whitespace, editorial photography. That's a real, viable Theme Store segment, but it excludes a large one: merchants with a much larger catalog who need denser browsing, more aggressive filtering, and a bolder visual style, think a warehouse-style outlet or a multi-category general store.

Building a second theme from scratch to reach that second segment would roughly double the ongoing maintenance cost. Building a second **preset** of Solis reaches it for a fraction of that cost, because the underlying sections, blocks, and Liquid stay identical, only the presentational settings and a handful of section arrangements differ.

## Step 1: the settings_data.json for both presets

```json
{
  "current": "Studio",
  "presets": {
    "Studio": {
      "color_primary": "#1a5f4f",
      "color_background": "#faf8f5",
      "type_heading_font": "playfair_display_n4",
      "type_body_font": "assistant_n4",
      "border_radius": 2,
      "product_grid_density": "spacious",
      "sections": {
        "main-collection": {
          "type": "main-collection",
          "settings": { "columns_desktop": 3, "filter_style": "sidebar" }
        }
      }
    },
    "Warehouse": {
      "color_primary": "#d94f2b",
      "color_background": "#ffffff",
      "type_heading_font": "archivo_black_n7",
      "type_body_font": "inter_n4",
      "border_radius": 0,
      "product_grid_density": "dense",
      "sections": {
        "main-collection": {
          "type": "main-collection",
          "settings": { "columns_desktop": 5, "filter_style": "horizontal-bar" }
        }
      }
    }
  }
}
```

Notice what changed and what didn't: colors, fonts, and border radius are all presentational settings, they switch automatically the moment a merchant picks a preset in the editor (see [settings_data.json: presentational settings](/config-and-settings/settings-data-json/#what-switching-a-preset-actually-changes-presentational-settings-only)). The `main-collection` section's layout settings had to be set explicitly in each preset's own `"sections"` data, because a preset switch alone never touches a section's arrangement, only the theme-wide presentational settings do.

## Step 2: a shared section gets presets that serve both audiences

Both presets use the same `hero.liquid` section, but a boutique and a warehouse-style store want different things from it out of the box:

```liquid
{% schema %}
{
  "name": "t:names.hero",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "t:settings.image" },
    { "type": "richtext", "id": "heading", "label": "t:settings.heading" },
    {
      "type": "select",
      "id": "layout",
      "label": "t:settings.layout",
      "options": [
        { "value": "full_bleed", "label": "t:options.full_bleed" },
        { "value": "split", "label": "t:options.split" }
      ],
      "default": "full_bleed"
    }
  ],
  "presets": [
    {
      "name": "t:names.hero_editorial",
      "settings": { "layout": "full_bleed", "heading": "<p>New season, quietly done.</p>" }
    },
    {
      "name": "t:names.hero_promotional",
      "settings": { "layout": "split", "heading": "<p>Up to 40% off, this week only.</p>" }
    }
  ]
}
{% endschema %}
```

A merchant building out the Studio-style store reaches for the editorial, full-bleed preset; a merchant building the Warehouse-style store reaches for the promotional, split-layout preset with copy that already matches that tone. Neither merchant hand-writes hero copy from a blank field, and neither has to guess which layout setting corresponds to "the punchy sale banner look."

## Step 3: a block preset that reduces onboarding friction on both presets

A "Trust badge" block, used inside a footer or a product page trust-signal row, benefits both presets equally, so it ships with presets that work regardless of which theme preset is active:

```liquid
{% schema %}
{
  "name": "Trust badge",
  "settings": [
    { "type": "text", "id": "icon_name", "label": "t:settings.icon" },
    { "type": "text", "id": "label", "label": "t:settings.label" }
  ],
  "presets": [
    { "name": "t:names.secure_checkout", "settings": { "icon_name": "lock", "label": "Secure checkout" } },
    { "name": "t:names.free_returns", "settings": { "icon_name": "refresh-cw", "label": "Free returns" } },
    { "name": "t:names.fast_shipping", "settings": { "icon_name": "truck", "label": "Fast shipping" } }
  ]
}
{% endschema %}
```

Whichever theme preset a merchant is building on, adding trust badges is picking three named options, not populating a generic block three times from scratch. This is the same underlying benefit as the hero example above, just at the block level instead of the section level: presets convert configuration work into selection work.

## Step 4: packaging both presets for submission

With two theme presets, the submission zip needs a `/listings` folder:

```
/listings
  /studio
    /templates
      index.json      ← only if Studio's homepage differs from the base
  /warehouse
    /templates
      index.json       ← Warehouse's denser homepage layout
/templates              ← the base ("Default"/Studio) templates every preset falls back to
```

Only files that actually differ from the base go in each preset's folder — see [Packaging & Submitting](/publishing/packaging-and-submitting/) for the complete packaging workflow. Each preset also needs its own demo store and its own listing information submitted through the Partner Dashboard (see [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/)) before it's visible to merchants browsing the Theme Store.

## The benefit, stated plainly

One codebase, two presets, now shows up in Theme Store search results under two different industry/catalog-size groupings, with a demo store and screenshots tuned to each. A merchant lands on the preset that already looks close to what they want, customizes less, and is more likely to convert. None of that required building or maintaining a second theme, only a second set of presentational settings, a couple of section presets, and one shared block preset that happens to serve both audiences equally well.

## Key Takeaways
- A multi-preset strategy pays off when two segments are different enough to matter (industry, catalog size, tone) but similar enough structurally to share one codebase.
- Presentational settings (colors, fonts, radii) switch automatically between theme presets; section arrangement and content need explicit `"sections"` data per preset.
- Section and block presets compound the benefit: they tune the *starting point* a merchant gets within each theme preset, not just the theme-wide style.
- The packaging, demo store, and listing-submission steps are separate deliverables from the code, budget time for all three, not just the schema work.

## Further Reading

- [Theme Presets](/presets/theme-presets/), [Section Presets](/presets/section-presets/), [Block Presets](/presets/block-presets/): the underlying mechanics used throughout this example
- [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/): the full mandatory-vs-optional rule set
- [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/): the file format this page's first example is built on
- [Packaging & Submitting](/publishing/packaging-and-submitting/): the full `/listings` zip workflow
