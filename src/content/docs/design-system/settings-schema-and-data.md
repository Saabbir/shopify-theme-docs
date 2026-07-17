---
title: settings_schema.json & settings_data.json
description: What each file actually is, how they interact, and how to manage them without corrupting merchant data.
---

These two files are the most misunderstood pair in a Shopify theme's `config/` folder — not because either is individually complicated, but because their relationship (one defines *what can be set*, the other stores *what was set*) is easy to get backwards, especially once a theme has real merchants with real customizations.

## The core distinction

| File | Role | Who/what writes to it |
|---|---|---|
| `config/settings_schema.json` | **Definition.** Declares every theme-wide setting that exists: its type, `id`, label, default, and which schema group it belongs to. | You, the developer. Committed to Git, shipped with every theme update. |
| `config/settings_data.json` | **Data.** Stores the *current values* a merchant has actually set, plus preset definitions. | The theme editor writes to this when a merchant changes a setting. You write the initial preset values. |

Think of `settings_schema.json` as a form's field definitions, and `settings_data.json` as one specific submission of that form (or several, if there are multiple presets).

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

Notice the flat, shared `t:general.*` (group names) and `t:labels.*` (setting/content labels) namespaces here — this is the same convention verified against Skeleton Theme's actual shipped `settings_schema.json` (`t:general.typography`, `t:labels.page_width`, `t:options.page_width.narrow`) and demonstrated in full in the [Complete Worked Example](/codebase-structure/complete-worked-example/). Not `t:settings_schema.colors.settings.primary.label` — that nested-per-group style isn't what real Shopify themes ship.

The `theme_info` object (always first) is required by Theme Store review — see [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/). Every other object is a named settings group that appears as a section in the theme editor's "Theme settings" panel.

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

- `"current"` — which preset (or a merchant's fully custom configuration) is actually active right now.
- `"presets"` — one object per preset, each a full set of setting values. This is also where a merchant's *own* customizations get written once they change something from a preset's starting point — the theme editor essentially forks the active preset's values into `"current"`'s own object once edited.

:::caution[This file is live merchant data once installed]
Once a theme is installed on a real store, `settings_data.json` reflects *that merchant's actual configuration* — their chosen colors, fonts, and content. A theme update should never overwrite this file wholesale; only `settings_schema.json` changes (the *available* settings) ship with an update. This is exactly why [After Approval](/publishing/after-approval/)'s versioning rules treat a changed/removed setting `id` as a breaking (major) change — it can invalidate exactly this stored data.
:::

## How they interact: the settings id is the join key

A setting's `id` in `settings_schema.json` is the key `settings_data.json` (and every `{{ settings.x }}` reference in Liquid) uses to read/write its value. This is why a setting `id` is effectively a permanent contract once shipped:

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

If a setting genuinely needs renaming, that's a major-version change (see [After Approval](/publishing/after-approval/)) — plan a migration path (e.g. a one-time script or documented manual step) rather than assuming merchants won't notice their customization silently reverted.

## Managing them day to day

| Task | Where it happens | Gotcha |
|---|---|---|
| Add a new theme-wide setting | `settings_schema.json` — add the setting, and add its default to every preset in `settings_data.json` | Forgetting to add a default to *every* preset (not just "Default") leaves other presets with a missing/undefined value |
| Change a setting's default | `settings_schema.json`'s `"default"` | This only affects *fresh* installs — it does not retroactively update `settings_data.json` for merchants who already have the theme installed |
| Remove a setting | Remove from both files | Removing from `settings_schema.json` without removing the now-orphaned key from every preset in `settings_data.json` leaves dead data around (harmless, but untidy and confusing to future developers) |
| Add a new preset | `settings_data.json`'s `"presets"` object | See [Managing Presets](/design-system/managing-presets/) for the full workflow, including multi-preset Theme Store submission structure |

### A common, avoidable mistake: assuming a schema default retroactively applies

```json
// You change this default from #1a5f4f to #2b2b52 in settings_schema.json...
{ "type": "color", "id": "color_primary", "default": "#2b2b52" }
```

...but a merchant who installed the theme last month, and never touched the color setting, is **still on `#1a5f4f`** — because that value was already written into their store's `settings_data.json` at install time. Changing a schema default only affects merchants who install the theme *after* the change (or presets you explicitly update to match). If you need every existing merchant to see a new default, that's not something a schema change alone accomplishes.

## Validating changes before shipping

- Confirm every setting `id` referenced in Liquid (`{{ settings.x }}`) actually exists in `settings_schema.json` — a typo'd reference silently renders blank rather than erroring.
- Confirm every preset in `settings_data.json` has a value for every setting `id` defined in `settings_schema.json` — a missing key falls back to the schema default, which may not be what that preset intended.
- Run `shopify theme check` — it flags several classes of settings/schema mismatches automatically.

## Best practices

- Treat a setting's `id` as effectively permanent once shipped — plan a real migration, not a silent rename, if it must change.
- When adding a setting, update every preset in `settings_data.json`, not just the one you're actively testing against.
- Remember that a schema default change only affects fresh installs — don't expect it to retroactively update existing merchants' stores.
- Run `shopify theme check` after any schema change, specifically looking for settings/schema mismatch warnings.

## Common mistakes

- **Renaming a setting `id`** without a migration plan, silently discarding merchant customizations tied to the old `id`.
- **Assuming a changed schema default applies to already-installed merchants** — it only affects fresh installs.
- **Adding a new setting but forgetting to backfill a default into every preset** in `settings_data.json`, leaving non-default presets with an inconsistent or missing value.
- **Referencing a setting `id` in Liquid that doesn't exist in the schema** (a typo) — renders silently blank instead of erroring, easy to miss without testing.

## Quick Reference

- `settings_schema.json` = definition (what settings exist). `settings_data.json` = data (current values + presets).
- A setting's `id` is the join key between schema, data, and Liquid — treat it as a permanent contract once shipped.
- Changing a schema default only affects fresh installs, not existing merchant stores.
- Update every preset when adding a setting; remove from both files (and every preset) when removing one.

## Further Reading

- [Managing Presets (Sections & Themes)](/design-system/managing-presets/) — the full preset workflow
- [Settings schema](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) — shopify.dev
- [Settings data](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json) — shopify.dev
