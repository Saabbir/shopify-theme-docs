---
title: Managing Presets (Sections & Themes)
description: Section presets vs. theme presets, what each one does, how to build them, and how they fit into a Theme Store submission.
---

The word "preset" means two different things in a Shopify theme, at two different levels. It's easy to mix them up. This article walks through both kinds, and shows how they relate to each other.

## The two kinds of preset

| | Section/block preset | Theme preset |
|---|---|---|
| Lives in | A section or block's own `{% schema %}` → `"presets"` array | `config/settings_data.json` → `"presets"` object |
| Controls | What appears when a merchant clicks "Add section" or "Add block" in the editor | An entire pre-configured look for the whole theme: colors, fonts, every setting, and every default template's section arrangement |
| Scope | One section/block type | The whole theme |
| Required? | Yes. A block with no `"presets"` entry never appears in the block picker at all | Yes. Every theme needs at least a "Default" theme preset. Adding more is optional, and is a nice extra for a Theme Store listing |

## Section & block presets

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

Notice the locale keys use flat, shared namespaces like `names.*` and `settings.*`, not something nested like `t:sections.testimonials.settings.heading.label`. A locale key is just a reference to a translated piece of text, stored in a separate file so it can change per language. See the [Complete Worked Example](/codebase-structure/complete-worked-example/) for this convention, checked against Horizon and Skeleton's real shipped source code.

### Rules that are easy to miss

- **A block with zero `"presets"` entries never shows up in the theme editor's "Add block" picker at all.** It doesn't show up empty or with no defaults, it just isn't there as an option. This is the single most common reason a newly built block "doesn't show up" for a merchant.
- A section can have **more than one preset.** This helps when a section genuinely has more than one common starting point. For example, a "Featured Collection" section could offer a "Grid" preset and a "Carousel" preset, if the layout choice is significant enough to deserve two separate starting points instead of one preset plus a setting.
- Preset block settings should show **realistic example content**, not empty placeholders. A merchant previewing what adding this section looks like should see something close to real, finished content. See [Store & Design Requirements](/theme-store-requirements/store-and-design/) for more on this.

| Do | Don't |
|---|---|
| Give every block at least one preset with realistic example content | Ship a block with no `"presets"` entry and wonder why it's missing from the picker |
| Use multiple section presets only when there are genuinely distinct common configurations | Add a preset for every minor settings variation. That's what settings are for |
| Localize preset names with `t:`, the same as every other schema string | Hardcode English preset names |

## Theme presets

A theme preset is a complete, named configuration for the entire theme. It lives in `config/settings_data.json`, inside the `"presets"` object (see [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) for that file's full role). This is what lets a theme offer several different "styles" when a merchant installs it, for example "Studio," "Warehouse," and "Boutique," each a different mix of colors, fonts, and layout, all built on the same underlying code.

```json
// config/settings_data.json
{
  "current": "Studio",
  "presets": {
    "Studio": {
      "color_primary": "#1a5f4f",
      "type_heading_font": "playfair_display_n4",
      "sections": {
        "main-product": { "type": "main-product", "blocks": { /* ... */ } }
      }
    },
    "Warehouse": {
      "color_primary": "#2b2b2b",
      "type_heading_font": "assistant_n4",
      "sections": {
        "main-product": { "type": "main-product", "blocks": { /* ... */ } }
      }
    }
  }
}
```

A theme preset can do more than change setting values. It can also change which sections and blocks appear on the default templates. This is what gives each preset a genuinely different look and content arrangement, instead of just a different color layered on top of an identical layout.

### Building a second (or third) theme preset, step by step

1. Finish and fully test the "Default" preset first. Every other preset is usually built as a variation of it, so an unfinished base multiplies your work later.
2. Duplicate the "Default" preset object in `settings_data.json` under a new name.
3. Change the settings values that give this preset its own distinct look, like colors, fonts, and spacing.
4. If the preset should also use different sections or blocks, not just different setting values, edit that preset's `"sections"` data too. This is what makes two presets feel like genuinely different themes instead of a simple reskin.
5. Test the new preset on a completely fresh store install. See the note below on why this step matters so much.

:::caution[Test every preset on a genuinely fresh install]
It's easy to develop and test only against whichever preset is currently active in your dev store. Before shipping, apply *each* preset on a clean store and click through the main templates. A preset that references a resource that only exists in your dev environment, like a metaobject or a specific product, will break silently on a fresh install. This is exactly the kind of issue that [Packaging & Submitting](/publishing/packaging-and-submitting/)'s pre-zip sanity check exists to catch.
:::

## How theme presets map to a Theme Store submission

Multiple theme presets map directly onto the `/listings` folder structure in your submission zip:

```
/listings
  /studio            ← kebab-case, matches (roughly) the preset name
    /templates
      index.json
  /warehouse
    /templates
      index.json
/templates             ← the base/"Default" preset's templates
```

Only include the files a given preset actually *overrides* in its `/listings/<preset>/` folder, not a full copy of every template. See [Packaging & Submitting](/publishing/packaging-and-submitting/) for the complete packaging workflow. This article covers building the presets correctly before that packaging step, not the zip structure itself.

## Best practices

- Finish and thoroughly test the "Default" preset before building additional presets as variations of it.
- Give every block at least one preset with realistic example content. An empty block picker entry doesn't look intentional to a merchant or a reviewer.
- Test every theme preset on a genuinely fresh store install before submission, not just whichever preset happens to be active in your dev environment.
- Only make a theme preset's section or block arrangement different when it meaningfully differs. A preset that's identical except for one color isn't worth the extra upkeep.

## Common mistakes

- **Shipping a block with no `"presets"` entry**, which makes it invisible in the editor's block picker. This is the single most common "why isn't my block showing up" bug.
- **Building and testing a second theme preset only in a dev environment that already has the first preset's resources.** A fresh install immediately reveals demo-store assumptions you didn't notice.
- **Adding a preset for every minor variation** instead of using a setting. This inflates the number of presets you have to maintain for things that should just be merchant-configurable.
- **Copying every template file into every preset's `/listings` folder** instead of only what that preset actually overrides. See [Packaging & Submitting](/publishing/packaging-and-submitting/).

## Quick Reference

- Section/block presets (in `{% schema %}`) control what appears when adding from the editor picker. A block with none is invisible there.
- Theme presets (in `settings_data.json`) are full theme configurations: colors, fonts, and optionally section/block arrangement.
- Multiple theme presets map to `/listings/<preset-name>/` in a Theme Store submission zip.
- Test every preset on a fresh store install before shipping. Dev-environment assumptions don't always carry over.

## Further Reading

- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/): the file where theme presets live
- [Packaging & Submitting](/publishing/packaging-and-submitting/): the `/listings` zip structure for multi-preset submissions
- [Theme store listings](https://shopify.dev/docs/storefronts/themes/store/requirements): shopify.dev
