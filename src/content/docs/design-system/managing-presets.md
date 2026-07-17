---
title: Managing Presets (Sections & Themes)
description: Section presets vs. theme presets — what each does, how to build them, and how they interact with a Theme Store submission.
---

"Preset" means two different things in a Shopify theme, at two different scopes. Confusing them is an easy, common mistake — this article covers both, fully, and how they relate.

## The two kinds of preset

| | Section/block preset | Theme preset |
|---|---|---|
| Lives in | A section or block's own `{% schema %}` → `"presets"` array | `config/settings_data.json` → `"presets"` object |
| Controls | What appears when a merchant clicks "Add section"/"Add block" in the editor | An entire pre-configured look for the whole theme — colors, fonts, every setting, every default template's section arrangement |
| Scope | One section/block type | The whole theme |
| Required? | Yes — a block with no `"presets"` entry never appears in the block picker at all | Yes — every theme needs at least a "Default" theme preset; multiple are optional (and a Theme Store differentiator) |

## Section & block presets

A `"presets"` array in a section or block's schema defines the default settings/blocks a merchant gets when they add it fresh from the editor's picker:

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

Locale keys use the flat, shared `names.*`/`settings.*` namespaces, not nested per-section keys like `t:sections.testimonials.settings.heading.label` — see the [Complete Worked Example](/codebase-structure/complete-worked-example/) for this convention verified against Horizon/Skeleton's real shipped source.

### Rules that are easy to miss

- **A block with zero `"presets"` entries never appears in the theme editor's "Add block" picker at all** — not "appears with no defaults," but literally invisible as an option. This is the single most common reason a newly-built block "doesn't show up."
- A section can have **multiple presets** — useful when a section genuinely has more than one common starting configuration (e.g. a "Featured Collection" section with a "Grid" preset and a "Carousel" preset, if the layout choice is meaningful enough to warrant two distinct starting points rather than one preset plus a setting).
- Preset block settings should represent **realistic example content**, not empty placeholders — a merchant previewing "what does adding this look like" should see something that resembles real usage, per [Store & Design Requirements](/theme-store-requirements/store-and-design/).

| ✅ Do | ❌ Don't |
|---|---|
| Give every block at least one preset with realistic example content | Ship a block with no `"presets"` entry and wonder why it's missing from the picker |
| Use multiple section presets only when there are genuinely distinct common configurations | Add a preset per minor settings variation — that's what settings are for |
| Localize preset names with `t:`, same as every other schema string | Hardcode English preset names |

## Theme presets

A theme preset is a full, named configuration of the entire theme — stored in `config/settings_data.json`'s `"presets"` object (see [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) for that file's full role). This is the mechanism behind a theme offering multiple "styles" at install (e.g. "Studio," "Warehouse," "Boutique" — different color/font/layout combinations of the same underlying codebase).

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

A theme preset can override not just settings values but also which sections/blocks appear on default templates — giving each preset a genuinely distinct look and content arrangement, not just a different color scheme applied to identical layout.

### Building a second (or third) theme preset, step by step

1. Get the "Default" preset fully finished and tested first — every other preset is usually built as a variation on it, so an unfinished base multiplies the work.
2. Duplicate the "Default" preset object in `settings_data.json` under a new name.
3. Change the settings values that define this preset's distinct look — colors, fonts, spacing-affecting settings.
4. If the preset should also differ in section/block arrangement (not just settings values), edit that preset's `"sections"` data specifically — this is what makes two presets feel like genuinely different themes rather than a reskin.
5. Test the new preset on a completely fresh store install — see the caution below.

:::caution[Test every preset on a genuinely fresh install]
It's easy to develop and test only against whichever preset is currently active in your dev store. Before shipping, apply *each* preset on a clean store and click through the main templates — a preset that references a resource (a metaobject, a specific product) that only exists in your dev environment will break silently on a fresh install. This is exactly the kind of issue [Packaging & Submitting](/publishing/packaging-and-submitting/)'s pre-zip sanity pass exists to catch.
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

Only include files a given preset actually *overrides* in its `/listings/<preset>/` folder — not a full copy of every template. See [Packaging & Submitting](/publishing/packaging-and-submitting/) for the complete packaging workflow; this article is about building the presets correctly before that packaging step, not the zip structure itself.

## Best practices

- Finish and thoroughly test the "Default" preset before building additional presets as variations of it.
- Give every block at least one preset with realistic example content — an empty block picker entry fails the "looks intentional" bar merchants and reviewers both judge by.
- Test every theme preset on a genuinely fresh store install before submission, not just whichever preset happens to be active in your dev environment.
- Only diverge a theme preset's section/block arrangement when it meaningfully differs — a preset that's identical except for one color isn't worth the added maintenance surface.

## Common mistakes

- **Shipping a block with no `"presets"` entry**, making it invisible in the editor's block picker — the single most common "why isn't my block showing up" bug.
- **Building and testing a second theme preset only in a dev environment that already has the first preset's resources present** — a fresh install reveals demo-store-specific assumptions immediately.
- **Adding a preset per minor variation** instead of a setting — inflating the number of presets to maintain for distinctions that should just be merchant-configurable.
- **Copying every template file into every preset's `/listings` folder** instead of only what that preset overrides — see [Packaging & Submitting](/publishing/packaging-and-submitting/).

## Quick Reference

- Section/block presets (in `{% schema %}`) control what appears when adding from the editor picker — a block with none is invisible there.
- Theme presets (in `settings_data.json`) are full theme configurations — colors, fonts, and optionally section/block arrangement.
- Multiple theme presets map to `/listings/<preset-name>/` in a Theme Store submission zip.
- Test every preset on a fresh store install before shipping — dev-environment assumptions don't carry over.

## Further Reading

- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) — the file where theme presets live
- [Packaging & Submitting](/publishing/packaging-and-submitting/) — the `/listings` zip structure for multi-preset submissions
- [Theme store listings](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
