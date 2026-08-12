---
title: "settings_schema.json: Rules & Conventions"
description: "The definition file for theme-wide settings — required structure, theme_info, setting groups, conditional settings, and the t: locale convention."
---

**TL;DR:** The definition file for theme-wide settings — required structure, theme_info, setting groups, conditional settings, and the t: locale convention.

`config/settings_schema.json` is the single most consequential file in a theme's `config/` folder. It defines every theme-wide setting a merchant can see and change in the theme editor's "Theme settings" panel, and every setting `id` you'll reference from Liquid via `{{ settings.x }}`. Get its structure and conventions right early, because every setting you ship becomes something you're committed to supporting. Facts on this page are verified directly against [shopify.dev's `settings_schema.json` reference](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) and [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings).

## What it is, in one sentence

`settings_schema.json` controls the organization and content of the theme editor's **Theme settings** area. Every value a merchant sets there gets saved into [`settings_data.json`](/config-and-settings/settings-data-json/), a separate file this one doesn't touch directly.

## Required structure

The file is a JSON array of category objects. Each category object has two **required** attributes:

| Attribute | Required | Description |
|---|---|---|
| `name` | **Yes** | The category's name, shown as its own section in the theme editor's settings panel |
| `settings` | **Yes** | An array of the settings that belong to this category |

```json
[
  {
    "name": "t:general.colors",
    "settings": [
      { "type": "header", "content": "t:labels.colors_heading" },
      { "type": "color", "id": "color_primary", "label": "t:labels.color_primary", "default": "#1a5f4f" }
    ]
  }
]
```

## `theme_info`: required, and stricter than it looks

The first object in the array should be a `theme_info` object. It powers the "Theme actions" metadata panel in the theme editor. Its attribute requirements are more precise than a quick skim suggests:

| Attribute | Required | Notes |
|---|---|---|
| `name` | **Yes** | Must be the literal string `"theme_info"` |
| `theme_name` | **Yes** | |
| `theme_author` | **Yes** | |
| `theme_version` | **Yes** | |
| `theme_documentation_url` | **Yes** | |
| `theme_support_email` | **Exactly one of these two** | |
| `theme_support_url` | **Exactly one of these two** | |

```json
{
  "name": "theme_info",
  "theme_name": "Solis",
  "theme_author": "Your Company",
  "theme_version": "1.0.0",
  "theme_documentation_url": "https://example.com/docs",
  "theme_support_url": "https://example.com/support"
}
```

**Including both `theme_support_email` and `theme_support_url`, or omitting any of the other required attributes, is an error** — not a warning. Pick exactly one of the two support fields, never both, never neither.

## Setting groups: the `t:` convention

Every group `name` and setting `label` should use a flat, shared locale namespace, not a deeply nested one:

```json
{
  "name": "t:general.typography",
  "settings": [
    { "type": "font_picker", "id": "type_heading_font", "label": "t:labels.heading_font", "default": "assistant_n4" }
  ]
}
```

```json
// ❌ WRONG — deeply nested, not what real Shopify themes use
"label": "t:settings_schema.typography.settings.heading_font.label"

// ✅ RIGHT — flat, shared, reused across every schema that needs it
"label": "t:labels.heading_font"
```

This isn't a stylistic preference — it's checked against Skeleton Theme's actual shipped `settings_schema.json` (`t:general.typography`, `t:labels.page_width`, `t:options.page_width.narrow`). See the [Complete Worked Example](/codebase-structure/complete-worked-example/) for this pattern worked through in full, and [`t:` Locale Resolution](/config-and-settings/settings-conventions-and-best-practices/#where-t-strings-actually-resolve) for exactly how these strings resolve.

## Two categories of setting

| Category | Can hold a value? | Configurable by the merchant? |
|---|---|---|
| **Input settings** (`text`, `color`, `select`, `range`, `image_picker`, and so on) | Yes | Yes |
| **Sidebar settings** (`header`, `paragraph`) | No | No — informational only, used to add clarity around nearby input settings |

## Conditional settings: `visible_if`

Most, but not all, setting types can be shown or hidden based on another setting's value:

```json
{
  "type": "select",
  "id": "layout_style",
  "label": "Layout",
  "options": [{ "value": "flex", "label": "Stack" }, { "value": "grid", "label": "Grid" }],
  "default": "flex"
},
{
  "type": "select",
  "id": "content_direction",
  "label": "Direction",
  "options": [{ "value": "row", "label": "Horizontal" }, { "value": "column", "label": "Vertical" }],
  "visible_if": "{{ block.settings.layout_style == 'flex' }}"
}
```

`visible_if` works on all basic input settings, all sidebar settings, and a specific list of specialized types: `color`, `color_background`, `color_scheme`, `font_picker`, `html`, `image_picker`, `inline_richtext`, `link_list`, `liquid`, `richtext`, `text_alignment`, `url`, `video`, `video_url`. It does **not** work on every setting type — check the specific type before relying on it. It also can't react to a *resolved* dynamic source value, only to whether a setting has a value at all.

## Reading a setting safely: the `blank` check

A setting with no automatic default renders as an **empty string**, not an error, if nothing has been set:

```liquid
{% unless settings.message == blank %}
  {{ settings.message }}
{% endunless %}
```

Resource-based settings (`product`, `page`, `collection`, and similar) need the same caution — the referenced resource might never have been selected, or might have since been deleted or hidden:

```liquid
{% if settings.page != blank %}
  {{ settings.page.title }}
{% else %}
  No page, or invalid page, selected.
{% endif %}
```

## Translation: two different mechanisms, don't confuse them

| What | Translated via | Example |
|---|---|---|
| **Schema attributes** — a setting's `label`, `info`, option text | `t:` keys resolved from `locales/en.default.schema.json` (and its per-language versions), by the theme | `"label": "t:labels.color_primary"` |
| **Merchant-entered values** — the actual content a merchant types into a text-bearing setting | Shopify's **Translate & Adapt** tool, per store, for `text`/`richtext`/`html` settings specifically | A merchant's own heading text, translated for each market |

A `liquid`-type setting's value is **not** translatable through Translate & Adapt. See [Managing Locale Files](/internationalization-and-locales/managing-locale-files/) for the full mechanics of the schema-locale side of this table.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Put `theme_info` first, and get its required-attribute set exactly right — including exactly one of `theme_support_email`/`theme_support_url`, never both. | **Including both `theme_support_email` and `theme_support_url`** in `theme_info` — this is a hard error, not a style choice. |
| Use flat, shared `t:` namespaces (`t:general.*`, `t:labels.*`) for every group name and setting label, not a deeply nested per-setting path. | **Writing a deeply nested `t:` path** instead of the flat, shared convention real Shopify themes use. |
| Check `visible_if`'s supported-type list before relying on it for a given setting type. | **Assuming `visible_if` works on every setting type.** It's a specific, documented list — check it first. |
| Always guard a setting reference with a `blank` check, especially for resource-based settings, rather than assuming a value is always present. | **Rendering a resource-based setting without a `blank` check**, breaking silently if a merchant never selected one or later deleted it. |
| — | **Confusing schema-label translation (`t:` keys) with merchant-content translation (Translate & Adapt).** They're two entirely different systems for two different kinds of text. |

## Key takeaways
- `settings_schema.json`: array of category objects, each requiring `name` and `settings`.
- `theme_info`: `name`, `theme_name`, `theme_author`, `theme_version`, `theme_documentation_url` all required, plus exactly one of `theme_support_email`/`theme_support_url`.
- Use flat `t:` namespaces (`t:general.*`, `t:labels.*`), never deeply nested paths.
- `visible_if` works on a specific list of types — verify before relying on it.
- Always `blank`-check a setting before using its value, especially resource-based settings.

## Further reading

- [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/): the file this one's values get saved into
- [Settings Conventions & Best Practices](/config-and-settings/settings-conventions-and-best-practices/): the id-permanence rule and pre-ship checklist
- [Managing Locale Files](/internationalization-and-locales/managing-locale-files/): the full picture on schema locale resolution
- [`settings_schema.json`](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) (shopify.dev)
- [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
