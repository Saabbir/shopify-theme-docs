---
title: "Color Palettes: the color_palette Setting"
description: Shopify's newer, flatter alternative to hand-rolling brand colors as separate settings — one shared grid merchants edit directly.
---

Shopify shipped a new theme setting type, `color_palette`, in the [Spring '26 Edition](https://shopify.dev/changelog/color-palettes) (June 17, 2026). It's a genuinely new mechanism, not a rename of something existing — worth a dedicated page since it changes how a theme's color system should be modeled going forward, and this handbook's [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) and [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) both predate it.

:::note[Status against our own scaffold, verified directly]
As of this writing, [Skeleton Theme](https://github.com/Shopify/skeleton-theme) — what we actually scaffold from — does **not** use `color_palette` yet; its `config/settings_schema.json` still defines colors as plain, separate `color` settings. Horizon (Shopify's flagship reference theme, version 4.0.0+) uses the palette system throughout, per [Shopify's own changelog entry](https://shopify.dev/changelog/color-palettes). So this is an available, Shopify-recommended upgrade to adopt deliberately on Solis — not something that arrives for free the next time you re-scaffold. Don't take our word for either claim; both are the kind of platform-version fact worth reconfirming against the live repos if meaningful time has passed since this was written.
:::

## What it actually is

A `color_palette` setting defines **one shared grid of named colors** for the whole theme. Merchants see and edit this grid directly in the theme editor, and any `color` or `color_background` setting anywhere in the theme — a section's heading color, a block's background — can reference a palette entry as its default. Change "primary" once in the palette, and every setting that defaulted to it updates together.

This solves a specific, real problem the old pattern had: modeling "primary," "secondary," "accent" as separate, independent `color` settings (as [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) previously showed) gives a merchant no single place to see or edit the theme's whole color story at once, and gives you no built-in mechanism for one section's `color` setting to default to "whatever the theme's primary brand color currently is" — you'd have to hardcode a hex value as that setting's default and hope it stayed in sync.

## What it is not

`color_palette` doesn't replace [`color_scheme_group`](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes) — Shopify's mechanism for merchant-selectable **color schemes** (e.g. "Scheme 1," "Scheme 2," a dark variant), each a full bundle of `header`/`color`/`color_background` fields a section can pick between via a `color_scheme` setting. That mechanism still works, isn't deprecated, and isn't required to migrate. The two are complementary, not either/or:

| | `color_palette` | `color_scheme_group` |
|---|---|---|
| What it is | One flat grid of named raw colors | Multiple full, swappable schemes (each its own bundle of roles) |
| Merchant sees | A single color grid, editable directly | A picker choosing between named schemes, applied per-section |
| Typical use | The theme's actual brand colors — "primary," "accent," "secondary" | "Scheme 1 is light, Scheme 2 is dark, Scheme 3 is high-contrast," selectable per-section |
| Can reference the other? | A `color_scheme_group`'s individual `color`/`color_background` fields can default to a palette entry | A `color_scheme` setting doesn't reference `color_palette` directly |
| Required for Theme Store? | No — recommended for new themes, not required | No — still fully valid |

A theme can reasonably use both: a `color_palette` holding the actual brand colors, and one or more `color_scheme_group` schemes whose individual fields default to those palette entries — so a merchant editing "primary" in the palette ripples into every scheme that defaulted to it, without losing per-scheme override flexibility.

## Defining the palette

Exactly **one** `color_palette` per theme, and it must live in `config/settings_schema.json`:

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

Constraints worth knowing before you hit them as confusing errors:

- **Only `id` is a supported standard attribute** — `label`, `info`, and `visible_if` aren't supported on this setting type. You can't scope a palette's visibility or give it a custom editor label; the editor renders it with its own fixed UI.
- **`default` is the only additional attribute, and it's required** — an object of key → hex-color pairs. Keys must start with a letter and can contain letters, digits, and underscores (`primary`, `accent_2` — not `2nd-color`, not `accent-color` with a hyphen).
- **Values must be plain hex, no alpha channel** — `#1a5f4f` or `#1a5` are valid; `#1a5f4fcc` (8-digit, with alpha) is not.
- **Between 2 and 20 entries.** At least two colors are required; more than twenty isn't supported.
- **Colors render in the order they appear in the JSON** — order deliberately, since that's the order merchants see in the editor grid.

## Reading palette values in Liquid

Access an individual color the same way you'd navigate any nested setting — `settings.<palette-id>.<key>`:

```liquid
{{ settings.colors.primary }}
```

This returns a full [`color` object](https://shopify.dev/docs/api/liquid/objects/color) — the same type a plain `color` setting returns — so every color filter still works on it exactly as before:

```liquid
{%- assign primary_hover = settings.colors.primary | color_darken: 10 -%}
```

You can also iterate the whole palette, though only the color values are exposed during iteration, not their keys:

```liquid
{% for color in settings.colors %}
  {{ color }}
{% endfor %}
```

## Cross-setting references: the actual point of this feature

A `color` or `color_background` setting anywhere in the theme can use a palette entry as its **default**, via a Liquid output tag:

```json
{
  "type": "color",
  "id": "heading_color",
  "label": "t:labels.heading_color",
  "default": "{{ settings.colors.primary }}"
}
```

For `color_background`, a palette reference can be embedded inside a gradient string:

```json
{
  "type": "color_background",
  "id": "hero_gradient",
  "label": "t:labels.hero_gradient",
  "default": "linear-gradient(180deg, {{ settings.colors.primary }}, {{ settings.colors.secondary }} 100%)"
}
```

This is the whole reason to reach for `color_palette` over a plain hardcoded hex default: a section's `heading_color` setting now defaults to "whatever the palette's `primary` currently is," not a hex value frozen at the moment you wrote the schema. A merchant who changes "primary" in the palette sees every setting that referenced it update to match — no hunting down every section/block that happened to hardcode the same hex value.

One restriction: **only `color_palette` access paths are supported as dynamic defaults.** You can't set a `color` setting's default to reference another arbitrary setting (`{{ settings.some_other_color }}`) — only a palette entry.

## What happens on theme updates and merchant edits

Two behaviors worth knowing before they surprise you mid-project:

- **Adding a new key to the palette's `default` in a theme update** makes that color appear automatically in the merchant's palette grid, without disturbing colors they've already customized — their edited values are stored in `settings_data.json` and always take precedence over your schema defaults.
- **When a merchant deletes a palette color in the editor**, Shopify doesn't just remove it — it prompts them to pick a replacement color, then stores the deleted color's value as a reference to that replacement (e.g. `{{ settings.colors.accent }}`). Every setting that had defaulted to the deleted color keeps working, now pointing at the replacement, without you needing to hunt down and update every template that referenced it.

## A worked example: adopting it for a fresh settings schema

Building on the same `testimonials` example from [Complete Worked Example](/codebase-structure/complete-worked-example/) — here's how its section would define and use a palette instead of a hardcoded hex default:

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

Nothing about *reading* the setting in Liquid changes — `block.settings.author_color` still behaves like any `color` setting. What changed is where its default comes from, and that a merchant now has one place (the palette grid) to adjust the theme's whole color story instead of hunting through every section/block for a hardcoded hex.

## Should Solis adopt this now?

Yes, for new settings work — per Shopify's own guidance, `color_palette` is the recommended approach for a theme's shared brand colors going forward, and it directly solves the "no single place to edit brand colors" gap the old separate-`color`-settings pattern had. Concretely:

- **New theme-wide color settings**: define them via `color_palette`, not as separate individual `color` settings, unless there's a specific reason a color shouldn't be part of the shared palette (a genuinely one-off, non-brand color used in exactly one place).
- **Existing separate `color` settings already shipped**: don't rush to migrate them just because this feature exists — see [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/) on why changing/removing a shipped setting `id` is a breaking change. Migrate deliberately, as a planned change with its own PR, not as a drive-by while touching unrelated code.
- **`color_scheme_group` usage**: keep it where you're already modeling genuinely swappable multi-scheme presets (light/dark/high-contrast) — `color_palette` doesn't replace that use case, though its individual fields can still default to palette entries.

## Best practices

- Default to `color_palette` for any new theme-wide brand color setting, rather than a standalone `color` setting with a hardcoded hex default.
- Name palette keys after role (`primary`, `accent`, `text`), the same naming discipline as [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) — never after appearance or a specific hex value.
- Reference the palette from individual `color`/`color_background` defaults wherever a setting's color should track the theme's brand colors, instead of freezing a hex value at write-time.
- Reconfirm this feature's current spec against [shopify.dev's own docs](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_palette) before relying on details here — it shipped recently enough that specifics can still evolve.

## Common mistakes

- **Assuming `color_palette` replaces `color_scheme_group`** — they solve different problems (one shared color grid vs. multiple swappable full schemes) and are meant to be used together, not as alternatives.
- **Adding a `label`, `info`, or `visible_if` to a `color_palette` setting** and being confused when it's ignored — none of those attributes are supported on this setting type.
- **Using an 8-digit hex with alpha** in a palette's `default` — only 6-digit (or 3-digit) hex without an alpha channel is supported.
- **Migrating already-shipped `color` settings to reference the palette as a drive-by change** — treat it as its own deliberate, reviewed change, since it touches shipped setting defaults merchants may already have customized.
- **Assuming Skeleton Theme (our scaffold) already includes this** — verify against the live repo before assuming; as of this writing it doesn't.

## Quick Reference

- One `color_palette` per theme, in `settings_schema.json` only. Only `id` (required) and `default` (required, 2–20 hex-color key/value pairs, no alpha) are supported — no `label`, `info`, or `visible_if`.
- Access via `settings.<id>.<key>`, returns a full `color` object — every color filter still works.
- `color`/`color_background` settings can default to a palette entry: `"default": "{{ settings.colors.primary }}"` — only palette references are supported as dynamic defaults.
- Complementary to `color_scheme_group`, not a replacement — a scheme's individual fields can still default to palette entries.
- New palette keys auto-appear on theme update; merchant customizations always win. Deleting a palette color prompts a replacement and preserves existing references.
- Skeleton Theme doesn't use it yet (verified); Horizon 4.0.0 does. Adopt it deliberately for new Solis settings work.

## Further Reading

- [Color palettes in Themes](https://shopify.dev/changelog/color-palettes) — shopify.dev developer changelog, the original announcement
- [`color_palette` developer documentation](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#color_palette) — shopify.dev, the full input-settings reference
- [Color schemes](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes) — shopify.dev, the `color_scheme_group`/`color_scheme` mechanism this complements
- [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) — the semantic-naming discipline that applies equally to palette keys
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) — mapping a Figma color collection onto a palette instead of separate settings
- [Complete Worked Example](/codebase-structure/complete-worked-example/) — the full section/block/schema example this page's worked example builds on
