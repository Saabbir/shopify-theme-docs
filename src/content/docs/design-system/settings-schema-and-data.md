---
title: settings_schema.json & settings_data.json
description: What each file actually is, how they connect, and how to manage them without breaking merchant data.
---

These two files are the most confusing pair in a Shopify theme's `config/` folder. Neither one is hard on its own. The confusion comes from how they relate to each other: one file defines *what settings can be set*, and the other stores *what was actually set*. It's easy to mix these up, especially once real merchants have made real customizations on a real store.

## The core distinction

| File | Role | Who/what writes to it |
|---|---|---|
| `config/settings_schema.json` | **Definition.** Declares every theme-wide setting that exists: its type, `id`, label, default value, and which schema group it belongs to. | You, the developer. Committed to Git, shipped with every theme update. |
| `config/settings_data.json` | **Data.** Stores the *current values* a merchant has actually set, plus the preset definitions. | The theme editor writes to this when a merchant changes a setting. You write the initial preset values. |

Here's an easy way to picture it. Think of `settings_schema.json` as a blank form: it defines what fields exist, like "name" or "favorite color." Think of `settings_data.json` as one filled-in copy of that form, or several filled-in copies, if there are multiple presets.

## `settings_schema.json`: what it looks like

```json
[
  {
    "name": "theme_info",
    "theme_name": "Solis",
    "theme_author": "Your Company",
    "theme_version": "1.0.0",
    "theme_documentation_url": "https://example.com/docs",
    "theme_support_url": "https://example.com/support"
  },
  {
    "name": "t:general.colors",
    "settings": [
      { "type": "header", "content": "t:labels.colors_heading" },
      { "type": "color", "id": "color_primary", "label": "t:labels.color_primary", "default": "#1a5f4f" }
    ]
  },
  {
    "name": "t:general.typography",
    "settings": [
      { "type": "font_picker", "id": "type_heading_font", "label": "t:labels.heading_font", "default": "assistant_n4" }
    ]
  }
]
```

Notice the flat, shared groups here: `t:general.*` for group names, and `t:labels.*` for setting and content labels. This isn't something we made up. It's a real pattern, checked against Skeleton Theme's actual shipped `settings_schema.json` (look for `t:general.typography`, `t:labels.page_width`, `t:options.page_width.narrow` in that file), and you can see it worked through in full in the [Complete Worked Example](/codebase-structure/complete-worked-example/). Don't write something like `t:settings_schema.colors.settings.primary.label`. That deeply nested style isn't what real Shopify themes use.

The `theme_info` object always comes first, and Theme Store review requires it. See [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) for more on that. Every other object in the array is a named settings group, and each one shows up as its own section in the theme editor's "Theme settings" panel.

## `settings_data.json`: what it looks like

```json
{
  "current": "Default",
  "presets": {
    "Default": {
      "color_primary": "#1a5f4f",
      "type_heading_font": "assistant_n4"
    },
    "Embiggen": {
      "color_primary": "#2b2b52",
      "type_heading_font": "playfair_display_n4"
    }
  }
}
```

- `"current"` tells you which preset is active right now (or, if a merchant has made their own changes, it holds their fully custom setup instead).
- `"presets"` holds one object per preset, and each one is a full set of setting values. This is also where a merchant's own changes get saved once they start editing something from a preset's starting point. Under the hood, the theme editor copies the active preset's values into its own `"current"` object as soon as the merchant edits anything.

:::caution[This file holds real merchant data once installed]
Once a theme is installed on a real store, `settings_data.json` holds that merchant's actual setup: their chosen colors, fonts, and content. A theme update should never overwrite this file wholesale. Only `settings_schema.json` changes, meaning the *available* settings, should ship with an update. This is exactly why [After Approval](/publishing/after-approval/)'s versioning rules treat a changed or removed setting `id` as a breaking (major) change. It can wipe out exactly this kind of stored data.
:::

## How they connect: the setting id links them together

A setting's `id` in `settings_schema.json` is the same key that `settings_data.json`, and every `{{ settings.x }}` reference in Liquid, uses to read or write its value. That's why a setting `id`, once shipped, should be treated as permanent, the same way you'd treat a product's SKU once it's in customers' order history:

```json
// settings_schema.json defines the setting exists, with this id:
{ "type": "color", "id": "color_primary", "label": "...", "default": "#1a5f4f" }
```

```json
// settings_data.json stores a value under that exact id:
{ "color_primary": "#1a5f4f" }
```

```liquid
{# Liquid reads it by the same id: #}
{{ settings.color_primary }}
```

```json
// ❌ WRONG — renaming the id breaks the link. Every merchant who
// already customized "color_primary" now has an orphaned value in
// their settings_data.json, and the newly-named setting falls back
// to its schema default, silently discarding their customization
{ "type": "color", "id": "brand_color_primary", "label": "...", "default": "#1a5f4f" }
```

If a setting truly needs renaming, treat that as a major-version change (see [After Approval](/publishing/after-approval/)). Plan a migration path for it, either a one-time script or a documented manual step, rather than assuming merchants won't notice their customization got silently reset.

## Managing them day to day

| Task | Where it happens | Gotcha |
|---|---|---|
| Add a new theme-wide setting | `settings_schema.json`: add the setting, and add its default to every preset in `settings_data.json` | Forgetting to add a default to *every* preset (not just "Default") leaves other presets with a missing or undefined value |
| Change a setting's default | `settings_schema.json`'s `"default"` field | This only affects *fresh* installs. It does not retroactively update `settings_data.json` for merchants who already have the theme installed |
| Remove a setting | Remove it from both files | Removing it from `settings_schema.json` without removing the now-orphaned key from every preset in `settings_data.json` leaves dead data lying around (harmless, but untidy and confusing for future developers) |
| Add a new preset | `settings_data.json`'s `"presets"` object | See [Managing Presets](/design-system/managing-presets/) for the full workflow, including the multi-preset Theme Store submission structure |

### A common, avoidable mistake: assuming a new default reaches everyone

```json
// You change this default from #1a5f4f to #2b2b52 in settings_schema.json...
{ "type": "color", "id": "color_primary", "default": "#2b2b52" }
```

A merchant who installed the theme last month, and never touched the color setting, is **still on `#1a5f4f`**. That value was already written into their store's `settings_data.json` the moment they installed the theme. Changing a schema default only affects merchants who install the theme *after* the change (or presets you go back and explicitly update to match). If you need every existing merchant to see a new default, a schema change alone won't do it. You'd need a separate migration step.

## Checking your changes before shipping

- Confirm every setting `id` referenced in Liquid (`{{ settings.x }}`) actually exists in `settings_schema.json`. A typo in a reference renders blank silently. It won't throw an error to warn you.
- Confirm every preset in `settings_data.json` has a value for every setting `id` defined in `settings_schema.json`. A missing key falls back to the schema default, which may not be what that preset intended.
- Run `shopify theme check`. It catches several kinds of settings and schema mismatches for you automatically.

## Best practices

- Treat a setting's `id` as permanent once it ships. Plan a real migration if it must change. Don't just silently rename it.
- When you add a setting, update every preset in `settings_data.json`, not just the one you're actively testing.
- Remember that a schema default change only affects fresh installs. It won't update existing merchants' stores.
- Run `shopify theme check` after any schema change, and look specifically for settings and schema mismatch warnings.

## Common mistakes

- **Renaming a setting `id`** without a migration plan. This silently throws away merchant customizations tied to the old `id`.
- **Assuming a changed schema default reaches already-installed merchants.** It only affects fresh installs.
- **Adding a new setting but forgetting to add its default to every preset** in `settings_data.json`. This leaves non-default presets with a missing or inconsistent value.
- **Referencing a setting `id` in Liquid that doesn't exist in the schema** (usually a typo). It renders blank silently instead of throwing an error, so it's easy to miss without testing.

## Quick Reference

- `settings_schema.json` is the definition (what settings exist). `settings_data.json` is the data (current values plus presets).
- A setting's `id` links the schema, the data, and your Liquid code together. Treat it as permanent once shipped.
- Changing a schema default only affects fresh installs, not existing merchant stores.
- Update every preset when you add a setting. Remove it from both files, and every preset, when you remove one.

## Further Reading

- [Managing Presets (Sections & Themes)](/design-system/managing-presets/): the full preset workflow
- [Settings schema](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json): shopify.dev
- [Settings data](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json): shopify.dev
