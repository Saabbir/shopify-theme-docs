---
title: Fonts
description: Everything about managing typography in Solis — settings, tokens, code, accessibility, and performance, from both a developer and merchant perspective.
---

**TL;DR:** Everything about managing typography in Solis — settings, tokens, code, accessibility, and performance, from both a developer and merchant perspective.

Everything about fonts and typography, in one place. If you have a question about how type works in Solis, whether you're a developer wiring up `font_picker` settings or a merchant choosing a typeface in the theme editor, it should be answered somewhere in this section.

## What's in this section

| Page | Answers |
|---|---|
| [Font Settings](/fonts/font-settings/) | What `font_picker` is, the Shopify font library, required defaults, and the Theme Store's font pairing rule |
| [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/) | A defined size/line-height scale instead of one-offs, fluid type with `clamp()`, naming rules |
| [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/) | The `font` object, generating `@font-face` with `font_face`, deriving weights/styles with `font_modify` |
| [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/) | Readable sizes and line-height, and why `font_picker` beats a custom web font import |

## How the pieces fit together

A merchant picks a typeface through a `font_picker` setting (see [Font Settings](/fonts/font-settings/)). In code, that value becomes a `font` object with properties like `family` and `weight`, turned into real CSS with the `font_face` and `font_modify` filters (see [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/)). Sizing and line-height come from a separate, deliberately-designed scale (see [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/)) that's usually fixed in CSS rather than merchant-editable, to keep it internally consistent. And [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/) covers the readability and loading-performance rules every one of those choices has to satisfy.

## Quick answers

**"How many font settings should my theme have?"** Usually two: one `font_picker` for headings, one for body text. See [Font Settings](/fonts/font-settings/#one-font_picker-per-role-not-one-for-the-whole-theme).

**"How do I get a bold or italic version of the merchant's chosen font?"** Derive it with `font_modify`, don't add a second setting. See [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/#deriving-weights-and-styles-font_modify).

**"What size should body text be?"** 16px or larger, 1.4–1.6 line-height. See [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/).

**"Should I load a custom Google Font via `@import`?"** No, use `font_picker`. See [Font Accessibility & Performance](/fonts/font-accessibility-and-performance/#performance-use-font_picker-instead-of-a-custom-web-font-import).

**"Does Theme Store review check my fonts?"** Yes: a required `default` on every `font_picker`, only currently available fonts, and one consistent font pairing across the whole theme. See [Font Settings](/fonts/font-settings/#the-theme-stores-font-pairing-rule).

## Further reading

- [Design System & Configuration](/design-system/): the broader section this one was split out of, covering settings architecture beyond just typography
- [Spacing](/spacing/): the companion section for spacing tokens and settings
- [Colors](/colors/): the companion section for color tokens and settings
