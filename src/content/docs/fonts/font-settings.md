---
title: "Font Settings: font_picker"
description: How font_picker works, the Shopify font library, required defaults, and the Theme Store's font pairing rule.
---

**TL;DR:** How font_picker works, the Shopify font library, required defaults, and the Theme Store's font pairing rule.

`font_picker` is the standard way a merchant chooses typefaces in the theme editor. This page covers the setting itself. For the type scale (sizes, line-heights, `clamp()`), see [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/). For reading the chosen font in Liquid and CSS, see [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/).

## What it actually is

A `font_picker` setting outputs a font picker field, automatically populated from the **Shopify font library**: a set of system fonts plus a curated selection of Google Fonts. Merchants pick a typeface from that list, they can't upload an arbitrary font file through this setting type.

```json
// config/settings_schema.json (excerpt)
{
  "type": "font_picker",
  "id": "type_header_font",
  "label": "t:labels.heading_font",
  "default": "assistant_n4"
}
```

The `default` attribute is **required**. Omitting it is an error, not a warning. Its value is one of the font library's identifiers, like `assistant_n4` or `helvetica_n4` (the `n4` suffix encodes style and weight: normal, weight 400). You can find valid values in [Shopify's list of available fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts).

When you read the setting's value in Liquid, you get back a [`font` object](https://shopify.dev/docs/api/liquid/objects/font), not a plain string. See [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/) for its properties and how to turn it into actual CSS.

## One font_picker per role, not one for the whole theme

A typical theme has at least two font roles: a heading font and a body font. Give each its own `font_picker` setting, instead of forcing merchants to use the same typeface everywhere:

```json
// config/settings_schema.json (excerpt)
{
  "name": "t:general.typography",
  "settings": [
    { "type": "header", "content": "t:labels.headings" },
    { "type": "font_picker", "id": "type_header_font", "label": "t:labels.font", "default": "assistant_n7" },
    { "type": "header", "content": "t:labels.body" },
    { "type": "font_picker", "id": "type_body_font", "label": "t:labels.font", "default": "assistant_n4" }
  ]
}
```

Two roles, two settings, is enough for almost every theme. Adding a third or fourth `font_picker` (an accent font, a button font) usually adds more decisions for the merchant than it's worth. See the pairing rule below for why.

## The Theme Store's font pairing rule

Theme Store review checks typography as part of its broader design-consistency pass: **one consistent font pairing used throughout the theme**, not three or more typefaces competing for attention.

| ✅ Do | ❌ Don't |
|---|---|
| Ship with a heading font and a body font that are deliberately paired, applied consistently everywhere | Let individual sections default to different fonts, so the page reads inconsistently |
| Keep the total number of typefaces on a page to two (occasionally three, if there's a real reason) | Add a font_picker per section "for flexibility," letting a merchant assemble a page with four unrelated typefaces |

This is a design-consistency rule as much as a technical one. A theme is easy to get technically right (a required `default`, real font library values) while still failing this rule, because the failure is about how many typefaces are actually possible on one page, not whether the settings are configured correctly.

## Best practices

- Give each font *role* (heading, body) its own `font_picker`, and stop there unless there's a real design reason for a third.
- Always set a real, deliberately-chosen `default`. An empty or placeholder default shows a broken-looking font picker the moment the theme is installed.
- Only use fonts from [Shopify's available fonts list](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts) as a default or in a preset. A custom-uploaded or discontinued font breaks the setting for anyone who doesn't already have it.

## Common mistakes

- **Leaving `default` empty or missing.** This isn't a soft warning, `font_picker` requires it and errors without one.
- **Adding a `font_picker` per section instead of per role.** This lets a merchant unintentionally combine four unrelated typefaces on one page, and fails Theme Store review's pairing rule.
- **Defaulting to a font that isn't in the current font library**, which breaks on fresh installs and in presets.

## Key takeaways
- `font_picker` returns a `font` object, populated from Shopify's font library (system fonts + curated Google Fonts).
- `default` is required, must be a real, currently available font library value.
- One `font_picker` per role (heading, body), not one per section.
- Theme Store review checks for one consistent font pairing across the whole theme, not competing typefaces.

## Further reading

- [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/): sizing and line-height, once the typeface itself is chosen
- [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/): turning a `font` object into real CSS
- [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/): readable sizes and avoiding extra font loads
- [font_picker](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#font_picker) (shopify.dev)
- [Available fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts) (shopify.dev)
