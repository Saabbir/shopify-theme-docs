---
title: Color in Liquid & CSS
description: Deriving shades, tints, and formats from a base color at render time with Liquid's color filters, instead of hardcoding them.
---

**TL;DR:** Deriving shades, tints, and formats from a base color at render time with Liquid's color filters, instead of hardcoding them.

Once a color exists as a token (see [Color Design Tokens](/colors/color-design-tokens/)), you rarely need just that one value. A button needs a hover state a shade darker. A badge needs a translucent background. A design spec might hand you an OKLCH value when your CSS needs hex. This page covers Liquid's built-in color filters, which derive all of these from one stored value instead of you hardcoding every variant by hand.

## Why derive colors instead of hardcoding variants

Say a merchant sets their primary brand color to `#1a5f4f` using a `color` setting or a `color_palette` entry (see [Color Palettes](/colors/color-palettes/)). Your theme still needs a hover state, maybe a shade darker, and perhaps a light tint for a badge background.

Two ways to get there:

```liquid
{% comment %} ❌ WRONG — a second setting the merchant now has to keep in
   sync with the first by hand every time they change their brand color {% endcomment %}
{{ settings.color_primary }}
{{ settings.color_primary_hover }}
```

```liquid
{% comment %} ✅ RIGHT — one stored value, the hover shade is derived
   at render time and always stays in sync automatically {% endcomment %}
{{ settings.color_primary }}
{{ settings.color_primary | color_darken: 10 }}
```

Adding a second setting for every derived shade means a merchant has to update two, three, or more settings in lockstep every time they change one brand color, and nothing stops them from getting it wrong. Deriving the shade with a filter means there's exactly one source of truth. It's mathematically impossible for the hover color to drift out of sync with the base color.

## The core filters

| Filter | What it does | Example |
|---|---|---|
| `color_darken` | Darkens by a percentage | `{{ color \| color_darken: 10 }}` |
| `color_lighten` | Lightens by a percentage | `{{ color \| color_lighten: 20 }}` |
| `color_mix` | Blends two colors by a ratio | `{{ color_a \| color_mix: color_b, 50 }}` |
| `color_modify` | Changes one channel (e.g. alpha) | `{{ color \| color_modify: 'alpha', 0.5 }}` |
| `color_saturate` | Increases saturation | `{{ color \| color_saturate: 15 }}` |
| `color_brightness` | Returns a 0–255 brightness value (for contrast checks) | `{{ color \| color_brightness }}` |
| `color_to_hex` | Converts to hex format | `{{ color \| color_to_hex }}` |
| `color_to_hsl` | Converts to HSL format | `{{ color \| color_to_hsl }}` |
| `color_to_rgb` | Converts to RGB format | `{{ color \| color_to_rgb }}` |
| `color_to_oklch` | Converts to OKLCH format | `{{ color \| color_to_oklch }}` |

## Worked example: deriving a hover state and a translucent badge

```liquid
{% comment %} theme.liquid or a snippet that builds root CSS variables {% endcomment %}
<style>
  :root {
    --color-primary: {{ settings.color_primary }};
    --color-primary-hover: {{ settings.color_primary | color_darken: 10 }};
    --color-primary-tint: {{ settings.color_primary | color_modify: 'alpha', 0.1 }};
  }
</style>
```

```css
.button--primary { background: var(--color-primary); }
.button--primary:hover { background: var(--color-primary-hover); }
.badge--primary { background: var(--color-primary-tint); }
```

The merchant sets one color. Everything else, the hover shade and the translucent tint, is computed from it at render time. Change the base color in the theme editor, and every derived value updates automatically, with nothing to keep in sync by hand.

## Format conversion: matching a design spec

A Figma spec sometimes hands you a color in a format your CSS doesn't expect, most often OKLCH from a modern design tool, when Liquid settings store colors as hex:

```liquid
{{ settings.color_primary | color_to_oklch }}
{{ settings.color_primary | color_to_hsl }}
```

Use these conversion filters when you need to match a specific format called for in a design spec, or when a CSS feature (like `color-mix()` in a specific color space) expects a particular format. For most theme CSS, the stored hex value works fine as-is and no conversion is needed.

## Using `color_brightness` for contrast decisions

`color_brightness` returns a 0–255 value, which is useful for a specific, narrow case: deciding at render time whether text on top of a merchant-chosen background should be light or dark.

```liquid
{% assign brightness = settings.color_background | color_brightness %}
{% if brightness > 125 %}
  {% assign text_color = '#000000' %}
{% else %}
  {% assign text_color = '#ffffff' %}
{% endif %}
```

This is a runtime brightness check for picking between two fixed text colors, not a substitute for verifying real WCAG contrast ratios during development. See [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/) for the actual contrast ratio requirements and how to test them.

## Best practices

- Derive hover, active, and tint variants from one stored color with a filter, instead of adding a separate setting for each variant.
- Build derived CSS custom properties once, in a single place like `theme.liquid` or a shared snippet, rather than recalculating the same `color_darken` call in every section file that needs it.
- Only convert color formats (`color_to_oklch`, `color_to_hsl`, and so on) when a specific format is actually required. Leave colors in their stored format otherwise.
- Use `color_brightness` only for the light-text-vs-dark-text runtime decision it's suited for. Verify actual contrast ratios separately; see [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/).

## Common mistakes

- **Adding a separate setting for every derived shade** (a "hover" setting, a "tint" setting) instead of deriving them from one base color. This creates settings that can silently drift out of sync.
- **Hardcoding a hover or tint color as a literal hex value** in CSS, instead of deriving it from the merchant's chosen base color. This breaks the moment the merchant changes their brand color.
- **Recalculating the same derived value in multiple files** instead of computing it once into a shared CSS custom property.
- **Treating `color_brightness` as a WCAG contrast checker.** It returns a raw brightness number, not a contrast ratio against a specific background.

## Key Takeaways
- Derive shades, tints, and translucent variants from one stored color with `color_darken`, `color_lighten`, `color_mix`, and `color_modify`, instead of adding separate settings.
- Convert formats with `color_to_hex`, `color_to_hsl`, `color_to_rgb`, `color_to_oklch` only when a specific format is actually required.
- `color_brightness` returns 0–255, useful for a light-vs-dark text runtime decision, not a WCAG contrast check.
- Compute derived CSS custom properties once, in a shared location, not per-section.

## Further Reading

- [Color Design Tokens](/colors/color-design-tokens/): the token structure these filters operate on
- [Color Palettes](/colors/color-palettes/) and [Color Schemes](/colors/color-schemes/): where the base colors these filters derive from actually come from
- [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/): verifying real contrast ratios, beyond what `color_brightness` checks
- [Color filters](https://shopify.dev/docs/api/liquid/filters/color-filters) (shopify.dev)
