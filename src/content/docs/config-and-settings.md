---
title: Config & Global Settings
description: Everything about config/settings_schema.json and config/settings_data.json in one place — rules, conventions, presets, and what's required vs. optional.
---

`config/settings_schema.json` and `config/settings_data.json` are the two most consequential files in a Shopify theme. One defines every setting a merchant can see and change; the other stores what they actually set, including every theme preset. Get their structure, conventions, and preset strategy right, and a merchant's customizations survive theme updates cleanly. Get them wrong, and you risk silently discarding real merchant data. Facts throughout this section are verified directly against shopify.dev's config and settings architecture documentation, not just general assumptions.

## Quick answers: required vs. optional

| Piece | Required? |
|---|---|
| `config/settings_schema.json` file | **Required** — every theme needs one |
| `theme_info` object (first entry in the schema array) | **Required**, with a specific attribute set — see [settings_schema.json: theme_info](/config-and-settings/settings-schema-json/#theme_info-required-and-stricter-than-it-looks) |
| At least one settings group beyond `theme_info` | Optional in principle, but every real theme has several |
| `config/settings_data.json`'s `"current"` and `"presets"` objects | **Required** |
| `config/settings_data.json`'s `"platform_customizations"` object | **Not written by you** — added automatically by Shopify only if a merchant uses the platform-controlled custom CSS setting |
| More than one theme preset | **Optional** — one preset (usually "Default") is enough; up to five is the hard maximum |
| A `"presets"` array on a **block**'s schema | **Effectively required** — a block with none never appears in the "Add block" picker |
| A `"presets"` array on a **section**'s schema | Optional, but strongly recommended for anything a merchant adds from the picker |

## Quick answers

**"Why isn't my new block showing up in the editor?"** See [Section & Block Presets](/config-and-settings/section-and-block-presets/#rules-that-are-easy-to-miss). A block with zero `"presets"` entries never appears in the "Add block" picker at all — this is the single most common cause.

**"I switched a theme preset and my hero image/text didn't change — is that a bug?"** No — see [settings_data.json: presentational settings](/config-and-settings/settings-data-json/#what-switching-a-preset-actually-changes-presentational-settings-only). A preset switch only updates presentational setting types (colors, fonts, and similar); content settings like text and images are left alone unless you edit that preset's `"sections"` data directly.

**"I changed a setting's default value — why don't existing merchants see it?"** See [settings_data.json: a changed default doesn't reach existing merchants](/config-and-settings/settings-data-json/#a-changed-schema-default-doesnt-reach-existing-merchants). A schema default only affects fresh installs; it never retroactively updates a merchant's stored `settings_data.json`.

**"Can I rename a setting id?"** Not casually — see [settings_data.json: the setting id links them together](/config-and-settings/settings-data-json/#how-they-connect-the-setting-id-links-them-together). Renaming an id orphans every merchant's existing customization under that key.

**"How many theme presets can I ship?"** Five, maximum — see [settings_data.json: hard limits](/config-and-settings/settings-data-json/#hard-limits-not-just-guidelines).

## What's in this section

| Page | Covers |
|---|---|
| [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/) | Required structure, `theme_info`'s exact attribute rules, the `t:` locale convention, conditional settings (`visible_if`), safely reading a setting |
| [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/) | Required structure, hard limits (5 presets, 1.5MB), what a preset switch actually changes, the platform-controlled `custom_css` setting, why this file holds real merchant data |
| [Settings Conventions & Best Practices](/config-and-settings/settings-conventions-and-best-practices/) | Day-to-day rules for keeping both files consistent, where `t:` strings resolve, a pre-ship checklist |
| [Theme Presets](/config-and-settings/theme-presets/) | How the current/default preset works, extending a theme to support more presets, the Theme Store `/listings` mapping |
| [Section & Block Presets](/config-and-settings/section-and-block-presets/) | The other kind of preset — why a block needs one to appear in the editor at all |

## The core distinction, restated

Think of `settings_schema.json` as a blank form: it defines what fields exist, like "primary color" or "heading font." Think of `settings_data.json` as one filled-in copy of that form, or several filled-in copies, if there are multiple presets. Confusing the two, or forgetting that a setting `id` permanently links them together with your Liquid code, is the root cause of most settings-related bugs in a mature theme.

## Best practices

- Read [settings_schema.json](/config-and-settings/settings-schema-json/) and [settings_data.json](/config-and-settings/settings-data-json/) together before adding your theme's first setting. The two files only make sense in relation to each other.
- Treat every setting `id` as permanent the moment it ships to a real merchant.
- Plan your preset strategy around the hard 5-preset limit and the presentational-settings-only preset-switch behavior from day one, not after building around a wrong assumption.

## Further Reading

- [Design System & Configuration](/design-system/): the token model and Figma-to-settings workflow this section's files ultimately expose to merchants
- [Codebase Structure](/codebase-structure/): where sections and blocks (and their own local presets) live
- [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
