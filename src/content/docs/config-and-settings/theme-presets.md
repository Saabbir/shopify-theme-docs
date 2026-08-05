---
title: Theme Presets
description: How the current/default preset works, extending a theme to offer more than one style, the 5-preset limit, and the Theme Store /listings mapping.
---

A theme preset is a complete, named configuration for the entire theme. It lives in `config/settings_data.json`, inside the `"presets"` object (see [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/) for that file's full structure). This is what lets a theme offer several different "styles" when a merchant installs it, for example "Studio," "Warehouse," and "Boutique," each a different mix of colors, fonts, and layout, all built on the same underlying code.

Don't confuse this with a section or block preset, a different concept living in a different file — see [Section & Block Presets](/config-and-settings/section-and-block-presets/) for that one.

## How the current/default preset actually works

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

`"current"` either names the active preset, or, once a merchant edits anything, holds their own fully custom configuration copied forward from whichever preset they started from. Selecting a preset in the editor updates `"current"` to match that preset's values — but **only for presentational settings** (color, font, and similar style-level types). See [settings_data.json: presentational settings](/config-and-settings/settings-data-json/#what-switching-a-preset-actually-changes-presentational-settings-only) for the full list of which setting types do and don't switch. A preset can also change which sections and blocks appear on the default templates, via its own `"sections"` data, which is what makes two presets feel like genuinely different themes instead of a simple reskin.

## The hard limit: five presets, no more

A theme can't contain more than **five** theme presets total, and `settings_data.json` can't exceed **1.5MB**. Plan a multi-preset strategy around this ceiling from the start — see [settings_data.json: hard limits](/config-and-settings/settings-data-json/#hard-limits-not-just-guidelines).

## Extending a theme to support a new preset, step by step

1. Finish and fully test the "Default" (or your first) preset before building any variation of it. An unfinished base multiplies your work on every preset built from it.
2. Duplicate that preset object in `settings_data.json` under a new name.
3. Change the presentational settings that give this preset its own distinct look: colors, fonts, spacing tokens.
4. If the preset should feel meaningfully different in content or layout, not just style, edit that preset's `"sections"` data too — remember, switching presets alone never touches non-presentational settings like text or images.
5. Test the new preset on a completely fresh store install. See the caution below on why this matters.

:::caution[Test every preset on a genuinely fresh install]
It's easy to develop and test only against whichever preset is currently active in your dev store. Before shipping, apply *each* preset on a clean store and click through the main templates. A preset that references a resource that only exists in your dev environment, like a metaobject or a specific product, will break silently on a fresh install. This is exactly the kind of issue [Packaging & Submitting](/publishing/packaging-and-submitting/)'s pre-zip sanity check exists to catch.
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

Only include the files a given preset actually *overrides* in its `/listings/<preset>/` folder, not a full copy of every template. See [Packaging & Submitting](/publishing/packaging-and-submitting/) for the complete packaging workflow — this page covers building the presets correctly before that packaging step, not the zip structure itself.

Each preset also gets its own dedicated Theme Store listing page, aligned to a primary industry and catalog size, letting the same theme codebase target several distinct merchant segments at once.

## Best practices

- Finish and thoroughly test the first preset before building additional presets as variations of it.
- Plan around the hard 5-preset ceiling from the start, not as a late discovery.
- Only make a preset's section/block arrangement genuinely different when it meaningfully differs — a preset that's identical except for one color isn't worth the extra upkeep.
- Test every theme preset on a genuinely fresh store install before submission, not just whichever preset happens to be active in your dev environment.

## Common mistakes

- **Assuming switching a preset changes everything**, including content like text and images — it only changes presentational settings unless you also edit `"sections"` data directly.
- **Building a sixth preset** and discovering the 5-preset platform limit only when a submission fails.
- **Building and testing a second theme preset only in a dev environment** that already has the first preset's resources. A fresh install immediately reveals demo-store assumptions you didn't notice.
- **Copying every template file into every preset's `/listings` folder** instead of only what that preset actually overrides.

## Quick Reference

- Theme presets live in `settings_data.json`'s `"presets"` object; `"current"` tracks which is active (or a merchant's custom edits).
- Hard limit: 5 presets max, 1.5MB file size max.
- A preset switch changes presentational settings only — content settings (text, images, links) need explicit `"sections"` data edits.
- Multiple presets map to `/listings/<preset-name>/` in a Theme Store submission zip, each with its own dedicated listing page.
- Always test every preset on a genuinely fresh store install before shipping.

## Further Reading

- [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/): the file theme presets live in, and the presentational-settings distinction in full
- [Section & Block Presets](/config-and-settings/section-and-block-presets/): the other, different kind of preset
- [Packaging & Submitting](/publishing/packaging-and-submitting/): the `/listings` zip structure for multi-preset submissions
- [Theme store listings](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
