---
title: Typography in Liquid & CSS
description: The font object, generating @font-face declarations with font_face, and deriving weights and styles with font_modify.
---

**TL;DR:** The font object, generating @font-face declarations with font_face, and deriving weights and styles with font_modify.

A `font_picker` setting (see [Font Settings](/fonts/font-settings/)) doesn't give you a plain string in Liquid. It gives you a `font` object, with its own properties and its own filters for turning it into working CSS. This page covers that object and the two filters built around it.

## The `font` object

Reading a `font_picker` setting returns a `font` object:

```json
{
  "baseline_ratio": 0.133,
  "fallback_families": "sans-serif",
  "family": "Assistant",
  "style": "normal",
  "system?": false,
  "variants": {},
  "weight": "400"
}
```

| Property | What it holds |
|---|---|
| `family` | The font's family name. Wrapped in double quotes automatically if it contains non-alphanumeric characters |
| `fallback_families` | The fallback stack to use alongside `family` (for example, `"sans-serif"`) |
| `weight` | The font's numeric weight (`400`, `700`, and so on) |
| `style` | `normal`, `italic`, or `oblique` |
| `system?` | `true` for a system font, `false` for a font that needs its own `@font-face` declaration |
| `variants` | An array of every other `font` object available in the same family (other weights/styles) |
| `baseline_ratio` | A decimal used for baseline alignment calculations |

Use the `font` object directly inside a `{% style %}` tag or a Liquid-processed asset, wherever you need to turn a merchant's font choice into real CSS:

```liquid
{% style %}
  :root {
    --font-family-heading: {{ settings.type_header_font.family }}, {{ settings.type_header_font.fallback_families }};
    --font-family-body: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
  }
{% endstyle %}
```

## Loading the font: `font_face`

`system?` tells you whether a font needs loading at all. System fonts (like Helvetica) are already on the visitor's device and need no `@font-face` declaration. Non-system fonts (most of the Google Fonts in Shopify's library) need one, and the `font_face` filter generates it for you:

```liquid
{{ settings.type_header_font | font_face }}
```

```css
@font-face {
  font-family: Assistant;
  font-weight: 400;
  font-style: normal;
  src: url("//your-store.myshopify.com/cdn/fonts/assistant/assistant_n4....woff2") format("woff2"),
       url("//your-store.myshopify.com/cdn/fonts/assistant/assistant_n4....woff") format("woff");
}
```

Pass `font_display` to control the CSS `font-display` property, which decides what text looks like while the font is still loading:

```liquid
{{ settings.type_header_font | font_face: font_display: 'swap' }}
```

`swap` shows fallback text immediately and swaps in the real font once it loads, which avoids invisible text during load. See [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/) for why this matters for perceived performance.

## Deriving weights and styles: `font_modify`

Need a bold or italic variant of a merchant's chosen font, without a second `font_picker` setting? `font_modify` derives it from the base font, the same "derive, don't duplicate the setting" idea covered for color in [Color in Liquid & CSS](/colors/color-in-liquid-and-css/):

```liquid
{%- assign bold_font = settings.type_body_font | font_modify: 'weight', 'bold' -%}

h2 {
  font-weight: {{ bold_font.weight }};
}
```

| Property | Accepts | Returns |
|---|---|---|
| `weight` | `100`–`900`, `normal`, `bold`, `+100`/`-100` (relative), `lighter`, `bolder` | The same family/style, at the requested weight, if that variant exists |
| `style` | `normal`, `italic`, `oblique` | The same family/weight, in the requested style, if that variant exists |

### Handle the case where the variant doesn't exist

Not every font family ships every weight and style. If `font_modify` can't find the requested variant, it returns `nil`, not an error:

```liquid
{%- assign heavy_font = settings.type_body_font | font_modify: 'weight', '900' | default: bold_font -%}
```

Always pair `font_modify` with `default` (falling back to a variant you already know exists, or the base font itself), or check for `nil` explicitly before using the result. A theme that assumes every font has a 900 weight breaks the moment a merchant picks a font that only ships 400 and 700.

## Best practices

- Check `system?` before deciding whether a font needs a `font_face` declaration. Don't unconditionally generate one for every font.
- Pass `font_display: 'swap'` on `font_face` calls so fallback text shows immediately instead of invisible text during load.
- Always pair `font_modify` with a `default` fallback (or an explicit `nil` check). Never assume a requested weight or style exists.
- Read `family` and `fallback_families` together when building a `font-family` CSS value, don't drop the fallback stack.

## Common mistakes

- **Generating `font_face` for every font unconditionally**, including system fonts that don't need it and already exist on the visitor's device.
- **Assuming every font family has a bold and italic variant.** `font_modify` returns `nil` for a variant that doesn't exist, and an un-handled `nil` produces broken CSS.
- **Treating the `font` object like a plain string.** It's an object with `family`, `weight`, `style`, and other properties, not a CSS-ready value on its own.

## Key takeaways
- `font_picker` returns a `font` object: `family`, `fallback_families`, `weight`, `style`, `system?`, `variants`, `baseline_ratio`.
- `font_face` generates the `@font-face` declaration for non-system fonts; pass `font_display: 'swap'` to avoid invisible text during load.
- `font_modify` derives a different weight or style from the base font. Always pair it with `default` or a `nil` check.

## Further reading

- [Font Settings](/fonts/font-settings/): the `font_picker` setting that produces this object
- [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/): `font-display`, avoiding extra font loads, and readable sizing
- [font object](https://shopify.dev/docs/api/liquid/objects/font) (shopify.dev)
- [font_face filter](https://shopify.dev/docs/api/liquid/filters/font_face) (shopify.dev)
- [font_modify filter](https://shopify.dev/docs/api/liquid/filters/font_modify) (shopify.dev)
