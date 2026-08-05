---
title: "Color Palettes: the color_palette Setting"
description: Shopify's newer color_palette setting, one shared grid of brand colors that merchants edit directly, instead of separate color settings.
---

Shopify added a new theme setting type called `color_palette` in the [Spring '26 Edition](https://shopify.dev/changelog/color-palettes) (June 17, 2026). This one is brand new, not a renamed version of something that already existed.

It changes how you should think about a theme's color system going forward, so it gets its own page here. Keep in mind that this handbook's [Color Design Tokens](/colors/color-design-tokens/) and [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) pages were written before `color_palette` existed.

:::note[Where our scaffold stands right now]
As of this writing, [Skeleton Theme](https://github.com/Shopify/skeleton-theme) (the theme we use as a starting point for new projects) does **not** use `color_palette` yet. Its `config/settings_schema.json` still defines colors as separate, plain `color` settings.

Horizon, Shopify's flagship example theme (version 4.0.0 and up), uses the palette system throughout. See [Shopify's changelog entry](https://shopify.dev/changelog/color-palettes) for proof. So this is an upgrade Shopify recommends, but you need to add it to Solis on purpose. It won't just appear the next time you re-scaffold your project.

Don't just take our word for these two facts. Both depend on which version you're using, so check them against the live repos yourself if a lot of time has passed since this was written.
:::

## What it actually is

A `color_palette` setting creates **one shared grid of named colors** for the whole theme. Merchants see this grid and can edit it directly in the theme editor.

Any `color` or `color_background` setting anywhere in the theme, like a section's heading color or a block's background, can point to a color in this palette and use it as its starting value (called a "default"). Change "primary" once in the palette, and every setting that used it as a default updates too, automatically.

This solves a real problem with the old approach. Before, you'd model "primary," "secondary," and "accent" as separate `color` settings, as shown in [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/). That gave merchants no single place to see or edit the theme's whole color story.

It also gave you no easy way for a section's `color` setting to default to "whatever the theme's primary brand color currently is." Without a palette, you had to hardcode a hex color as the default, and just hope it stayed in sync with the real primary color.

## What it is not

`color_palette` doesn't replace [`color_scheme_group`](/colors/color-schemes/), the mechanism that lets merchants pick between full **color schemes**, like "Scheme 1," "Scheme 2," or a dark version of the theme.

Each scheme is a full bundle of `header`/`color`/`color_background` fields. A section picks between schemes using a `color_scheme` setting. This feature still works fine today. It isn't going away, and you don't need to switch away from it. See [Color Schemes](/colors/color-schemes/) for the full page on defining and using `color_scheme_group`.

The two features work together, instead of being alternatives to each other. Here's how they compare:

| | `color_palette` | `color_scheme_group` |
|---|---|---|
| What it is | One flat grid of named raw colors | Several full, swappable color schemes, each its own bundle of roles |
| Merchant sees | A single color grid they can edit directly | A picker for choosing between named schemes, applied per section |
| Typical use | The theme's actual brand colors, like "primary," "accent," and "secondary" | "Scheme 1 is light, Scheme 2 is dark, Scheme 3 is high contrast," picked per section |
| Can reference the other? | A `color_scheme_group`'s individual `color`/`color_background` fields can default to a palette entry | A `color_scheme` setting doesn't reference `color_palette` directly |
| Required for Theme Store? | No, it's recommended for new themes but not required | No, this is still fully valid |

A theme can use both at once, and that's perfectly normal. You might have a `color_palette` holding your actual brand colors, plus one or more `color_scheme_group` schemes whose individual fields default to those palette entries.

That way, when a merchant edits "primary" in the palette, the change flows into every scheme that used it as a default. Merchants can still override individual scheme colors on their own if they want to.

## Defining the palette

Every theme can have exactly **one** `color_palette` setting, and it has to live in `config/settings_schema.json`:

```json
{
  "type": "color_palette",
  "id": "colors",
  "default": {
    "primary": "#1a5f4f",
    "secondary": "#e8b04b",
    "text": "#1a1a1a",
    "background": "#ffffff"
  }
}
```

Here are a few rules worth knowing now. Learning them now saves you from confusing error messages later:

- **`id` is the only standard attribute supported.** Attributes like `label`, `info`, and `visible_if` don't work here. You can't change how it's shown or hide it. The editor always displays it with its own fixed layout.
- **`default` is the only other attribute, and you must include it.** It's an object that pairs a name (the "key") with a hex color. Keys must start with a letter, and can only contain letters, numbers, and underscores. So `primary` and `accent_2` work, but `2nd-color` and `accent-color` (which has a hyphen) don't.
- **Values must be plain hex colors, with no alpha channel.** `#1a5f4f` and `#1a5` are fine, but `#1a5f4fcc` (which has 8 digits, including alpha) is not allowed.
- **You need between 2 and 20 entries.** You must have at least two colors, and you can't go over twenty.
- **Colors show up in the order you write them in the JSON.** Order them on purpose, because that's the exact order merchants will see them in the editor grid.

## Reading palette values in Liquid

You read one color from the palette the same way you'd read any nested setting: `settings.<palette-id>.<key>`.

```liquid
{{ settings.colors.primary }}
```

This gives you back a full [`color` object](https://shopify.dev/docs/api/liquid/objects/color), the same type of value a plain `color` setting returns. That means every color filter still works on it, exactly like before:

```liquid
{%- assign primary_hover = settings.colors.primary | color_darken: 10 -%}
```

You can also loop through the whole palette to get every color at once. Keep in mind that looping only gives you the color values, not their names (the "keys"):

```liquid
{% for color in settings.colors %}
  {{ color }}
{% endfor %}
```

## Cross-setting references: the actual point of this feature

Any `color` or `color_background` setting in the theme can use a palette entry as its **default** value. You do this with a Liquid output tag:

```json
{
  "type": "color",
  "id": "heading_color",
  "label": "t:labels.heading_color",
  "default": "{{ settings.colors.primary }}"
}
```

For `color_background`, you can place a palette reference inside a gradient string:

```json
{
  "type": "color_background",
  "id": "hero_gradient",
  "label": "t:labels.hero_gradient",
  "default": "linear-gradient(180deg, {{ settings.colors.primary }}, {{ settings.colors.secondary }} 100%)"
}
```

This is the whole reason to use `color_palette` instead of typing a fixed hex value as the default. A section's `heading_color` setting now defaults to "whatever the palette's `primary` currently is," instead of a color frozen at the moment you wrote the schema.

When a merchant changes "primary" in the palette, every setting that referenced it updates to match automatically. You don't have to search through every section or block that happened to use the same hex color.

One restriction worth knowing: **only `color_palette` entries can be used as dynamic defaults** (defaults that update automatically when the source changes). You can't set a `color` setting's default to point at just any other setting, like `{{ settings.some_other_color }}`. It only works with a palette entry.

## What happens on theme updates and merchant edits

Here are two behaviors worth knowing about now, so they don't surprise you halfway through a project:

- **If you add a new key to the palette's `default` in a theme update**, that color shows up automatically in the merchant's palette grid. It won't touch any colors they've already customized, because their edited values are saved in `settings_data.json` and always take priority over your schema defaults.
- **If a merchant deletes a palette color in the editor**, Shopify doesn't just remove it and leave things broken. It asks the merchant to pick a replacement color, then saves the deleted color's value as a reference to that replacement, like `{{ settings.colors.accent }}`. Every setting that used to default to the deleted color keeps working. It just points to the replacement now, so you don't have to search for and fix every template that used it.

## A worked example: adopting it for a fresh settings schema

Let's build on the same `testimonials` example from [Complete Worked Example](/codebase-structure/complete-worked-example/). Here's how that section would define and use a palette, instead of a fixed hex default:

```json
// config/settings_schema.json (excerpt)
{
  "name": "t:general.colors",
  "settings": [
    {
      "type": "color_palette",
      "id": "colors",
      "default": {
        "primary": "#1a5f4f",
        "secondary": "#e8b04b",
        "text": "#1a1a1a",
        "background": "#ffffff"
      }
    }
  ]
}
```

```json
// blocks/quote.liquid — {% schema %} excerpt
{
  "type": "color",
  "id": "author_color",
  "label": "t:settings.author_color",
  "default": "{{ settings.colors.text }}"
}
```

```liquid
{% comment %} blocks/quote.liquid — reading it like any other color setting {% endcomment %}
<cite class="quote-card__author" style="color: {{ block.settings.author_color }};">
  {{ block.settings.author }}
</cite>
```

Nothing about *reading* the setting in Liquid changes. `block.settings.author_color` still behaves exactly like any `color` setting.

What's different is where its default value comes from. The merchant now has one place, the palette grid, to adjust the theme's whole color story. They don't have to hunt through every section and block looking for a hardcoded hex value.

## Should Solis adopt this now?

Yes, for new settings work. Shopify itself recommends `color_palette` as the standard way to handle a theme's shared brand colors going forward. It directly solves the "no single place to edit brand colors" problem that the old approach, using separate `color` settings, had.

In practice, that means:

- **For new theme-wide color settings**, define them with `color_palette`, not as separate individual `color` settings. The only exception is when you have a good reason a color shouldn't be part of the shared palette, like a genuinely one-off color used in exactly one place, that isn't part of your brand colors.
- **For separate `color` settings you've already shipped**, don't rush to migrate them just because this feature exists. See [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/) to learn why changing or removing a shipped setting `id` (its unique name) is a breaking change. If you migrate, treat it as its own planned change with its own pull request, not something you slip in while touching unrelated code.
- **For `color_scheme_group` usage**, keep using it wherever you're already modeling truly swappable multi-scheme presets, like light, dark, and high-contrast versions. `color_palette` doesn't replace that use case, though individual scheme fields can still default to palette entries.

## Best practices

- Use `color_palette` by default for any new theme-wide brand color setting, instead of a standalone `color` setting with a hardcoded hex default.
- Name palette keys after their role, like `primary`, `accent`, or `text`. This is the same naming rule used in [Color Design Tokens](/colors/color-design-tokens/). Never name a key after how it looks or its exact hex value.
- Point individual `color`/`color_background` defaults at the palette whenever a setting's color should follow the theme's brand colors, instead of locking in a fixed hex value when you write the schema.
- Double-check this feature's current details against [shopify.dev's own docs](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_palette) before relying on what's written here. It shipped recently, so details may still change.

## Common mistakes

- **Assuming `color_palette` replaces `color_scheme_group`.** They solve different problems, one shared color grid versus several swappable full schemes, and they're meant to be used together, not as alternatives.
- **Adding a `label`, `info`, or `visible_if` to a `color_palette` setting**, then wondering why it's ignored. None of those attributes work on this setting type.
- **Using an 8-digit hex value with alpha** in a palette's `default`. Only a 6-digit (or 3-digit) hex code without transparency is supported.
- **Migrating already-shipped `color` settings to reference the palette as a quick, unplanned change.** Treat this as its own deliberate, reviewed change instead, since it touches shipped setting defaults that merchants may have already customized.
- **Assuming Skeleton Theme, our scaffold, already includes this.** Check the live repo before assuming. As of this writing, it doesn't.

## Quick Reference

- One `color_palette` per theme, and it only lives in `settings_schema.json`. Only `id` (required) and `default` (required, 2 to 20 hex-color pairs, no alpha) are supported. No `label`, `info`, or `visible_if`.
- Read it with `settings.<id>.<key>`. It returns a full `color` object, so every color filter still works.
- `color`/`color_background` settings can default to a palette entry, like `"default": "{{ settings.colors.primary }}"`. Only palette references work as dynamic defaults.
- It works alongside `color_scheme_group`, not instead of it. A scheme's individual fields can still default to palette entries.
- New palette keys show up automatically after a theme update. Merchant customizations always win. Deleting a palette color prompts the merchant for a replacement and keeps existing references working.
- Skeleton Theme doesn't use it yet, we checked directly. Horizon 4.0.0 does. Adopt it deliberately for new Solis settings work.

## Further Reading

- [Color palettes in Themes](https://shopify.dev/changelog/color-palettes), the shopify.dev developer changelog with the original announcement
- [`color_palette` developer documentation](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_palette), the full shopify.dev input-settings reference
- [`color` object](https://shopify.dev/docs/api/liquid/objects/color) (shopify.dev), what a `color_palette` value returns
- [Skeleton Theme](https://github.com/Shopify/skeleton-theme) (GitHub), our starting codebase — doesn't use `color_palette` yet
- [Color Schemes](/colors/color-schemes/), the `color_scheme_group`/`color_scheme` mechanism this complements
- [Color Design Tokens](/colors/color-design-tokens/), the semantic-naming approach that applies equally to palette keys
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/), on mapping a Figma color collection onto a palette instead of separate settings
- [Complete Worked Example](/codebase-structure/complete-worked-example/), the full section/block/schema example this page's worked example builds on
