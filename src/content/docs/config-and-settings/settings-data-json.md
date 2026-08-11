---
title: "settings_data.json: Storage & Presets"
description: How merchant setting values are actually stored, the current/presets/platform_customizations structure, hard limits, and what switching a preset really changes.
---

**TL;DR:** How merchant setting values are actually stored, the current/presets/platform_customizations structure, hard limits, and what switching a preset really changes.

`config/settings_data.json` stores the *values* for whatever `settings_schema.json` declares. It's the file the theme editor actually writes to every time a merchant changes something. Facts on this page are verified directly against [shopify.dev's `settings_data.json` reference](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json).

## Required structure

| Object | Required | Description |
|---|---|---|
| `current` | **Yes** | Every setting value currently active in the theme editor |
| `presets` | **Yes** | One object per theme preset, in the same shape as `current` |
| `platform_customizations` | **No** | Added automatically by Shopify if a merchant uses a platform-controlled setting — you never write this yourself |

```json
{
  "current": {
    "color_page_bg": "#FFFFFF"
  },
  "presets": {
    "Default": {
      "color_page_bg": "#000000"
    }
  }
}
```

Any time a merchant changes a setting in the theme editor, `current` updates immediately to reflect it.

## Hard limits, not just guidelines

These aren't stylistic recommendations — they're enforced platform limits:

- **A theme can't contain more than five presets total.**
- **`settings_data.json` can't exceed 1.5MB.**

Plan your preset strategy (see [Theme Presets](/presets/theme-presets/)) with the five-preset ceiling in mind from the start, rather than discovering it after building a sixth.

## What switching a preset actually changes: presentational settings only

This is the single most commonly misunderstood part of the whole preset system. **Selecting a different theme preset doesn't overwrite every setting value — only "presentational" ones.**

Presentational settings are the input types tied to a visual style, not to content:

```
checkbox, color, color_background, color_palette, color_scheme,
color_scheme_group, font_picker, number, radio, range, select
```

```json
// ✅ Switches when a merchant picks a different preset — these are
// presentational: colors, fonts, numeric/toggle style choices
{ "type": "color", "id": "color_primary" }
{ "type": "font_picker", "id": "type_heading_font" }
{ "type": "range", "id": "border_radius" }
```

```json
// ❌ Does NOT switch when a merchant picks a different preset —
// these hold content, not style, and a preset switch leaves them alone
{ "type": "text", "id": "announcement_message" }
{ "type": "image_picker", "id": "hero_image" }
{ "type": "url", "id": "cta_link" }
```

If you're building a theme preset expecting it to also swap out a merchant's hero image or announcement text, it won't — only the presentational-type settings listed above are affected. A preset genuinely changing *content*, not just style, requires editing that preset's `"sections"` data directly (see [Theme Presets](/presets/theme-presets/)), not relying on the automatic preset-switch behavior.

## `platform_customizations`: don't touch it

Shopify exposes a **custom CSS** setting directly in the theme editor, at both the theme and section level. You can't add, hide, or remove this setting from your schema — it's built into the platform. Any custom CSS a merchant adds through it is stored in the `platform_customizations` object's `custom_css` attribute (or, for section-level custom CSS, in that section's own JSON template data).

**As a theme developer, never add this setting yourself, and never edit its value once a merchant has set one.** If you want to offer CSS customization, do it through your own theme settings feeding into a `{% stylesheet %}` tag (see [CSS in Shopify](/css/css-in-shopify/)), not by touching this platform-owned mechanism.

## `settings_data.json` holds real merchant data once installed

:::caution[This file holds real merchant data once installed]
Once a theme is installed on a real store, `settings_data.json` holds that merchant's actual setup: their chosen colors, fonts, and content. A theme update should never overwrite this file wholesale. Only `settings_schema.json` changes, meaning the *available* settings, should ship with an update. This is exactly why [After Approval](/publishing/after-approval/)'s versioning rules treat a changed or removed setting `id` as a breaking (major) change. It can wipe out exactly this kind of stored data.
:::

## How they connect: the setting `id` links them together

A setting's `id` in `settings_schema.json` is the same key `settings_data.json`, and every `{{ settings.x }}` reference in Liquid, uses to read or write its value. Treat a shipped `id` as permanent, the same way you'd treat a product SKU once it's in customers' order history:

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

If a setting truly needs renaming, treat it as a major-version change (see [After Approval](/publishing/after-approval/)) with a real migration path, not a silent rename.

## A changed schema default doesn't reach existing merchants

```json
// You change this default from #1a5f4f to #2b2b52 in settings_schema.json...
{ "type": "color", "id": "color_primary", "default": "#2b2b52" }
```

A merchant who installed the theme last month, and never touched the color setting, is **still on `#1a5f4f`**. That value was already written into their store's `settings_data.json` the moment they installed the theme. Changing a schema default only affects merchants who install the theme *after* the change. If every existing merchant needs to see a new default, a schema change alone won't do it — that requires a separate migration step.

## Best practices

- Plan presets with the hard 5-preset ceiling and 1.5MB file-size limit in mind, not as an afterthought.
- Remember that switching a preset only changes presentational-type settings. Design your presets around that limitation, not around an assumption that everything switches.
- Never add or edit the platform-controlled `custom_css`/`platform_customizations` setting yourself.
- Treat a setting `id` as permanent once shipped, and a schema default change as something that only reaches fresh installs.

## Common mistakes

- **Building more than five theme presets** and discovering the platform limit only when a submission fails.
- **Assuming a theme preset swaps out content settings** (text, images, links) the same way it swaps colors and fonts — it doesn't.
- **Manually adding or editing a `custom_css` setting**, which conflicts with the platform-controlled mechanism Shopify already provides.
- **Renaming a setting `id`** without a migration plan, silently discarding merchant customizations.
- **Assuming a changed schema default reaches already-installed merchants.** It only affects fresh installs.

## Key takeaways
- Required: `current`, `presets`. Optional, Shopify-managed: `platform_customizations`.
- Hard limits: 5 presets max, 1.5MB file size max.
- A preset switch changes only presentational settings (`color`, `color_background`, `color_palette`, `color_scheme`, `color_scheme_group`, `font_picker`, `checkbox`, `number`, `radio`, `range`, `select`) — never content settings.
- Never touch the platform-controlled `custom_css`/`platform_customizations` setting yourself.
- A setting `id` links schema, data, and Liquid together — treat it as permanent once shipped.

## Further reading

- [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/): the definition file these values are shaped by
- [Theme Presets](/presets/theme-presets/): extending `presets` to support more than one theme style
- [Settings Conventions & Best Practices](/config-and-settings/settings-conventions-and-best-practices/): the pre-ship checklist for both files together
- [`settings_data.json`](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json) (shopify.dev)
