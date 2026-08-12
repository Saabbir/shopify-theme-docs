---
title: Spacing in Settings
description: The range setting type, and deciding when a spacing value should be merchant-editable versus fixed in CSS.
---

**TL;DR:** The range setting type, and deciding when a spacing value should be merchant-editable versus fixed in CSS.

Most spacing in a theme should be fixed in CSS, not exposed as a setting. This page covers the one setting type spacing does use when it's genuinely merchant-editable, and the reasoning for deciding when that's actually worth doing.

## The `range` setting type

`range` outputs a slider with a paired input field. It's the standard way to expose a numeric, adjustable spacing value:

```json
// A section's {% schema %} (excerpt)
{
  "type": "range",
  "id": "padding_block",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "t:labels.section_padding",
  "default": 48
}
```

| Attribute | Required | What it does |
|---|---|---|
| `min` | Yes | The slider's minimum value |
| `max` | Yes | The slider's maximum value |
| `step` | No (defaults to `1`) | The increment between slider stops. A value that doesn't land on a step rounds to the nearest one |
| `unit` | No | A display-only unit shown next to the input, like `px` |
| `default` | Yes | Required. Omitting it is an error |

A value outside `min`/`max` reverts to the nearest bound. `range` returns a plain [number](https://shopify.dev/docs/api/liquid/basics/types#number) in Liquid, not an object, so it's used directly:

```liquid
<div class="section" style="--section-padding: {{ section.settings.padding_block }}px;">
```

```css
.section { padding-block: var(--section-padding, var(--spacing-section-block)); }
```

Note the CSS fallback: if `--section-padding` isn't set inline for some reason, the rule falls back to the fixed scale token from [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/), instead of collapsing to `0`.

## Deciding whether a spacing value should even be a setting

Most spacing shouldn't be a setting. This is different from color, where merchants very reasonably want to adjust brand colors, and different from fonts, where a `font_picker` per role is standard. Spacing is usually a fixed design decision:

| Spacing type | Typically merchant-editable? | Why |
|---|---|---|
| The overall spacing scale (`--space-xs` through `--space-3xl`) | No | This is a structural design decision. Letting merchants edit the base scale risks breaking every component that references it |
| Section-level block padding (top/bottom space around a whole section) | Sometimes | A `range` setting here is common and genuinely useful, since section padding is one of the few spacing choices that's purely visual and low-risk to adjust |
| Gaps inside a component (between a product card's image and its title, for example) | Rarely | This is usually a fixed relationship the design depends on. Exposing it invites layouts that look broken at the extremes of the range |
| Spacing between unrelated page elements | No | This is layout, not a style preference. It shouldn't be adjustable at all |

The test that matters: could a merchant drag this setting to its minimum or maximum and end up with something that still looks like a reasonably designed page? Section padding usually passes that test. A card's internal gap usually doesn't, because at the extremes it stops looking like the card it was designed as.

## If you do expose it, bound it sensibly

```json
// ❌ WRONG — a huge range with no real reason, most of which
// produces a broken-looking result
{ "type": "range", "id": "padding_block", "min": 0, "max": 500, "step": 1, "default": 48 }

// ✅ RIGHT — bounded to a range that always looks intentional,
// with a step size that matches the spacing scale's own increments
{ "type": "range", "id": "padding_block", "min": 16, "max": 96, "step": 8, "default": 48 }
```

Setting `step` to match your spacing scale's own increments (say, multiples of 8) keeps a merchant-adjusted value visually consistent with the rest of the theme, even though it's not literally reading from a fixed token.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Default to fixed CSS spacing. Only add a `range` setting when there's a genuine, low-risk reason a merchant would want to adjust that specific value. | **Exposing every spacing value as a setting** "to be flexible," which produces an overwhelming settings panel and layouts a merchant can accidentally break. |
| Bound any spacing `range` tightly enough that every value in it still looks like a reasonably designed page, not just the default. | **Setting an unbounded or overly wide `min`/`max`**, so much of the slider's range produces a broken-looking result. |
| Set `step` to align with your spacing scale's own increments, so merchant-adjusted values stay visually consistent. | **Forgetting the `default` attribute**, which is required and errors without one. |
| Always provide a CSS fallback (`var(--custom-prop, var(--fallback-token))`) so a missing or unset value doesn't collapse to zero spacing. | **Not providing a CSS fallback** for a spacing custom property, so a missing value silently collapses to `0` instead of the intended default. |

## Key takeaways
- `range` needs `min`, `max`, and `default`. `step` defaults to `1`, `unit` is display-only.
- Most spacing should stay fixed in CSS. Section-level padding is the most common spacing value that's actually worth exposing.
- The test: would every value across the range still look like a reasonably designed page?
- Bound tightly, align `step` to your scale, and provide a CSS fallback.

## Further reading

- [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/): the fixed scale this page's settings sit alongside
- [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/): logical properties and the custom-property-vs-class rule
- [range](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings#range) (shopify.dev)
