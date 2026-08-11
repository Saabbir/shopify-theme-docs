---
title: "Color Schemes: color_scheme_group & color_scheme"
description: Defining swappable color schemes, applying them per section, and how they relate to color_palette.
---

**TL;DR:** Defining swappable color schemes, applying them per section, and how they relate to color_palette.

`color_scheme_group` is the standard way to let a merchant pick between full **color schemes**, like "Scheme 1," "Scheme 2," or a dark version of the theme, applied per section. It's older than [`color_palette`](/colors/color-palettes/), still fully valid, and it's the mechanism every existing Shopify theme's color system is built on.

## What it actually is

A `color_scheme_group` setting defines the **shape** of a color scheme: which roles exist (background, text, primary, and so on) and what type each one is. The actual schemes themselves, meaning the specific color values for "Scheme 1," "Scheme 2," and so on, are presets a merchant picks between and edits in the theme editor.

Two settings work together to make this happen:

| Setting type | Lives in | Defines |
|---|---|---|
| `color_scheme_group` | `config/settings_schema.json`, once per theme | The *shape*: which color roles every scheme must have (background, text, primary, primary_text, ...) |
| `color_scheme` | Any section's own settings | *Which scheme* that specific section instance uses, picked from the group |

## Defining the group

```json
// config/settings_schema.json (excerpt)
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "definition": [
    { "type": "color", "id": "background", "label": "t:labels.color_background" },
    { "type": "color", "id": "text", "label": "t:labels.color_text" },
    { "type": "color", "id": "primary", "label": "t:labels.color_primary" },
    { "type": "color", "id": "primary_text", "label": "t:labels.color_primary_text" },
    { "type": "color_background", "id": "gradient_background", "label": "t:labels.gradient_background" }
  ]
}
```

`definition` is a plain array of settings, the same setting types you'd use anywhere else in `settings_schema.json` (`color`, `color_background`, and a handful of others). This array is the **shape** every scheme has to follow. It doesn't set any actual color values itself.

The actual schemes ("Scheme 1," "Scheme 2," a dark scheme) and their real color values are presets, defined in `settings_data.json` alongside the rest of your theme's presets (see [Theme Presets](/presets/theme-presets/)):

```json
// config/settings_data.json (excerpt)
{
  "current": {
    "color_schemes": {
      "scheme-1": {
        "background": "#ffffff",
        "text": "#1a1a1a",
        "primary": "#1a5f4f",
        "primary_text": "#ffffff"
      },
      "scheme-2": {
        "background": "#1a1a1a",
        "text": "#ffffff",
        "primary": "#e8b04b",
        "primary_text": "#1a1a1a"
      }
    }
  }
}
```

Every scheme has to fill in every role defined in the group's `definition`. That's the whole point of defining the shape once: a merchant can create as many schemes as they want in the editor, and each one is guaranteed to have a `background`, a `text`, a `primary`, and so on, no matter which scheme a section ends up using.

## Applying a scheme to a section

A section (or block) picks a scheme with a `color_scheme` setting, which Shopify treats as a special type tied to the `color_scheme_group` defined above:

```json
// sections/hero.liquid — {% schema %} excerpt
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "t:labels.color_scheme",
  "default": "scheme-1"
}
```

```liquid
{% comment %} The section applies its chosen scheme as a CSS class.
   Every scheme defines the same role names, so this markup never
   needs to know which specific scheme is active {% endcomment %}
<div class="color-{{ section.settings.color_scheme }}">
  <h2 style="color: var(--color-primary);">{{ section.settings.heading }}</h2>
</div>
```

```css
/* One rule per scheme, all exposing the same semantic custom
   property names — the markup above never changes per scheme */
.color-scheme-1 {
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #1a5f4f;
  --color-primary-text: #ffffff;
}
.color-scheme-2 {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
  --color-primary: #e8b04b;
  --color-primary-text: #1a1a1a;
}
```

Because every scheme fills in the same role names, a component never has to know or care which scheme is active. It just references `--color-primary`, and whichever scheme class is applied supplies the right value. This is the three-tier token model in practice, see [Color Design Tokens](/colors/color-design-tokens/) for the full reasoning behind structuring things this way.

## `color_scheme_group` vs. `color_palette`

These solve different problems, and a theme commonly uses both at once:

| | `color_scheme_group` | `color_palette` |
|---|---|---|
| What it is | Several full, swappable color schemes, each its own bundle of roles | One flat grid of named raw colors |
| Merchant sees | A picker for choosing between named schemes, applied per section | A single color grid they can edit directly |
| Typical use | "Scheme 1 is light, Scheme 2 is dark, Scheme 3 is high contrast," picked per section | The theme's actual brand colors, like "primary," "accent," and "secondary" |
| Can reference the other? | A `color_scheme_group`'s individual `color`/`color_background` fields can default to a palette entry | A `color_scheme` setting doesn't reference `color_palette` directly |
| Required for Theme Store? | No, but see the ≥4-color rule below | No, recommended for new themes but not required |

See [Color Palettes](/colors/color-palettes/) for the full page on `color_palette`. A common, effective combination: a `color_palette` holding the theme's actual brand colors, with individual `color_scheme_group` fields defaulting to palette entries, so editing "primary" in the palette flows into every scheme that used it as a default.

## The Theme Store's minimum color-settings rule

Whether you're using `color_scheme_group`, plain `color` settings, or both, Theme Store review checks two things about your color settings specifically:

| ✅ Do | ❌ Don't |
|---|---|
| Include at least 4 color settings (across your schemes/palette combined) | Ship with only 1 or 2 colors, which limits merchants to a narrow color palette |
| Pair every background color with a foreground/text color setting | Add a background color with no matching text color setting |
| Use `"type": "color"` for every color-role field | Use a free-text field where merchants have to type in hex codes |

A `color_scheme_group` naturally satisfies the "paired" part of this rule, since a well-designed scheme always defines `background` alongside `text`, and `primary` alongside `primary_text`. See [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/) for why that pairing matters for more than just this checklist item.

## Best practices

- Design the group's `definition` once, up front, with every role a section will realistically need (`background`, `text`, `primary`, `primary_text`, at minimum). Adding a new role later means every existing scheme preset needs it backfilled.
- Always pair a background role with its own text/foreground role in the definition. Never ship a background color with no corresponding text color.
- Keep CSS custom property names consistent across every scheme's class, so components never need scheme-specific logic. See [Color Design Tokens](/colors/color-design-tokens/).
- If a `color_palette` also exists, point individual scheme fields at palette entries for your actual brand colors, instead of hardcoding the same hex value in every scheme's preset.

## Common mistakes

- **Defining a background color role with no matching text color role.** This risks a scheme where a merchant picks colors that are unreadable together, and it fails Theme Store review's color-settings check.
- **Adding a new role to the group's `definition` without updating every existing scheme preset in `settings_data.json`.** A scheme missing a role falls back to nothing meaningful for that field.
- **Giving each scheme's CSS class different custom property names** instead of a consistent set. This forces components to branch on which scheme is active, defeating the point of the shared shape.
- **Assuming `color_scheme_group` and `color_palette` are alternatives.** They solve different problems and are commonly used together.

## Key takeaways
- `color_scheme_group` (in `settings_schema.json`) defines the *shape* every scheme follows. Actual scheme presets and their color values live in `settings_data.json`.
- A section picks its active scheme with its own `color_scheme` setting.
- Apply a scheme via a CSS class exposing consistent custom property names, so markup never needs to know which scheme is active.
- Theme Store review requires at least 4 color settings total, with every background paired to a text/foreground color.
- Works alongside `color_palette`, not instead of it. See [Color Palettes](/colors/color-palettes/).

## Further reading

- [Color palettes](/colors/color-palettes/): the newer, complementary `color_palette` setting
- [Color Design Tokens](/colors/color-design-tokens/): the three-tier model and naming rules this page's CSS custom properties follow
- [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/): why pairing background/text colors and testing every scheme matters
- [Theme Presets](/presets/theme-presets/): how scheme presets fit into the broader presets workflow
- [Color schemes](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes) (shopify.dev)
