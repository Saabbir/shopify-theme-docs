---
title: Settings Conventions & Best Practices
description: "Day-to-day rules for managing settings_schema.json and settings_data.json together, where t: strings resolve, and a pre-ship checklist."
---

**TL;DR:** Day-to-day rules for managing settings_schema.json and settings_data.json together, where t: strings resolve, and a pre-ship checklist.

[settings_schema.json](/config-and-settings/settings-schema-json/) and [settings_data.json](/config-and-settings/settings-data-json/) each get their own deep dive. This page is the day-to-day operating manual: the habits that keep both files consistent with each other as a theme grows past its first few settings.

## Where `t:` strings actually resolve

Every `"t:..."` string in `settings_schema.json` (`t:general.colors`, `t:labels.color_primary`) is a lookup into `locales/en.default.schema.json`, **not** `en.default.json`. It's a different file from the one your storefront strings live in, because a schema label is something a *merchant* sees in the theme editor, not something a shopper sees on the storefront:

```json title="locales/en.default.schema.json"
{
  "general": { "colors": "Colors" },
  "labels": { "color_primary": "Primary color" }
}
```

Strip the `t:` prefix and what's left is a literal dot-path into that file: `t:labels.color_primary` → `labels.color_primary` → `"Primary color"`. If that path doesn't exist, the theme editor shows the raw string `labels.color_primary` instead of real text, with nothing flagging the mismatch. See [Managing Locale Files](/internationalization-and-locales/managing-locale-files/) for the full picture, including how this file is versioned per language (`fr.schema.json`, and so on) and why its language follows the merchant's Shopify admin language, not the storefront's.

## Managing both files day to day

| Task | Where it happens | Gotcha |
|---|---|---|
| Add a new theme-wide setting | `settings_schema.json`: add the setting, and add its default to every preset in `settings_data.json` | Forgetting to add a default to *every* preset (not just "Default") leaves other presets with a missing or undefined value |
| Change a setting's default | `settings_schema.json`'s `"default"` field | This only affects *fresh* installs — see [settings_data.json: a changed default doesn't reach existing merchants](/config-and-settings/settings-data-json/#a-changed-schema-default-doesnt-reach-existing-merchants) |
| Remove a setting | Remove it from both files | Removing it from `settings_schema.json` without removing the now-orphaned key from every preset in `settings_data.json` leaves dead data lying around (harmless, but untidy) |
| Add a new preset | `settings_data.json`'s `"presets"` object | See [Theme Presets](/presets/theme-presets/) for the full workflow, including the 5-preset limit and the Theme Store submission structure |

## Checking your changes before shipping

- Confirm every setting `id` referenced in Liquid (`{{ settings.x }}`) actually exists in `settings_schema.json`. A typo in a reference renders blank silently — it won't throw an error to warn you.
- Confirm every preset in `settings_data.json` has a value for every setting `id` defined in `settings_schema.json`. A missing key falls back to the schema default, which may not be what that preset intended.
- Confirm every `t:` key used in a schema label or group name has a matching entry in `locales/en.default.schema.json`. See [Managing Locale Files](/internationalization-and-locales/managing-locale-files/).
- Run `shopify theme check`. It catches several kinds of settings and schema mismatches for you automatically.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Treat a setting's `id` as permanent once it ships. Plan a real migration if it must change. Don't just silently rename it. | **Renaming a setting `id`** without a migration plan. This silently throws away merchant customizations tied to the old `id`. |
| When you add a setting, update every preset in `settings_data.json`, not just the one you're actively testing. | **Assuming a changed schema default reaches already-installed merchants.** It only affects fresh installs. |
| Remember that a schema default change only affects fresh installs. It won't update existing merchants' stores. | **Adding a new setting but forgetting to add its default to every preset** in `settings_data.json`. This leaves non-default presets with a missing or inconsistent value. |
| Use flat, shared `t:` namespaces consistently across every schema file in the theme, not just the ones you personally wrote. | **Referencing a setting `id` in Liquid that doesn't exist in the schema** (usually a typo). It renders blank silently instead of throwing an error, so it's easy to miss without testing. |
| Run `shopify theme check` after any schema change, and look specifically for settings and schema mismatch warnings. | **Adding a `t:` key to a setting without adding its counterpart to `en.default.schema.json`.** The theme editor shows the raw key text instead of a real label, with nothing flagging the mismatch. |

## Key takeaways
- Every `t:` string in `settings_schema.json` resolves against `locales/en.default.schema.json`, not the storefront's `en.default.json`.
- Adding a setting: update the schema *and* every preset. Removing a setting: remove it from both, in every preset.
- A schema default change only reaches fresh installs, never retroactively updates existing merchant stores.
- Before shipping: check every Liquid setting reference exists in the schema, every preset has every key, every `t:` key has a locale entry, and run `shopify theme check`.

## Further reading

- [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/) · [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/) · [Theme Presets](/presets/theme-presets/)
- [Managing Locale Files](/internationalization-and-locales/managing-locale-files/): the full picture on schema locale resolution
- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
