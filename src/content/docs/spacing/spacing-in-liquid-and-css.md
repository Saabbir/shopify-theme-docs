---
title: Spacing in Liquid & CSS
description: Logical properties for RTL, and deciding between a custom property and a class for spacing that varies.
---

**TL;DR:** Logical properties for RTL, and deciding between a custom property and a class for spacing that varies.

Two rules decide most of how spacing actually gets written in a section's CSS: use logical properties instead of physical ones, and know when a varying value belongs in a custom property versus a class. Both come up constantly, and both are easy to get backwards out of habit.

## Logical properties (required for RTL)

"Logical properties" are CSS properties like `margin-inline-start`. Instead of describing a fixed side (left or right), they describe direction based on reading order, using "start" and "end." This is what makes spacing work correctly, automatically, in right-to-left languages like Arabic or Hebrew. See [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/) for the broader RTL picture.

| ❌ Physical (breaks in RTL) | ✅ Logical (works in both directions) |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `left: 0` / `right: 0` | `inset-inline-start: 0` / `inset-inline-end: 0` |
| `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` (or the shorthand `margin-block`) |

```css
/* ❌ WRONG — hardcodes a left-to-right assumption */
.card {
  margin-left: var(--space-md);
  padding: 0 var(--space-lg);
}

/* ✅ RIGHT — flips automatically under dir="rtl" */
.card {
  margin-inline-start: var(--space-md);
  padding-inline: var(--space-lg);
}
```

Use a logical property everywhere a physical property has a logical equivalent. Test with `dir="rtl"` in your browser's dev tools regularly, not just right before Theme Store submission, logical-property mistakes are cheap to catch early and easy to miss if you never actually look.

## One property varies → a custom property. Several vary together → a class.

This rule decides whether a merchant-facing spacing setting should become an inline custom property or a CSS class:

```liquid
{% comment %} ✅ RIGHT — one property (gap) varies, so it's a custom property {% endcomment %}
<div class="testimonials" style="--gap: {{ section.settings.gap }}px;">

{% comment %} ✅ RIGHT — several spacing properties change together (padding,
   gap, and alignment all shift as one coherent layout mode), so it's a
   class driven by a select setting, not five separate custom properties {% endcomment %}
<div class="testimonials testimonials--{{ section.settings.layout }}">
```

```css
/* ❌ WRONG — five separate custom properties for what's really one
   coherent spacing/layout mode, forcing every consumer to set all
   five correctly */
.testimonials {
  gap: var(--gap-override);
  padding: var(--padding-override);
  margin-block: var(--margin-override);
}

/* ✅ RIGHT — one class encodes the whole coherent spacing state */
.testimonials--compact { gap: var(--space-xs); padding: var(--space-sm); }
.testimonials--spacious { gap: var(--space-lg); padding: var(--space-xl); }
```

A single `range` setting (see [Spacing in Settings](/spacing/spacing-in-settings/)) for section padding is a good custom-property candidate, exactly one value varies. A "compact vs. spacious" layout toggle that changes gap, padding, and alignment together belongs in a class instead, because those three values move as a set, not independently.

## `gap` over margin hacks for spacing between siblings

For spacing between repeated sibling elements (cards in a grid, items in a list), prefer `gap` on the container over margins on individual children:

```css
/* ❌ WRONG — every card needs a margin, and the last one needs an
   override so it doesn't add trailing space */
.card-grid .card { margin-inline-end: var(--space-md); }
.card-grid .card:last-child { margin-inline-end: 0; }

/* ✅ RIGHT — one gap declaration on the container, no exceptions needed */
.card-grid { display: grid; gap: var(--space-md); }
```

`gap` also respects logical direction automatically in a grid or flex container, so it doesn't need a logical-property equivalent the way margin and padding do.

## Best practices

- Use logical properties (`margin-inline-start`, `padding-block`, and so on) everywhere a physical/logical pair exists. Treat a physical property in new CSS as something to double-check, not your default.
- Reach for `gap` on the container instead of margin-with-a-last-child-exception for spacing between repeated siblings.
- One spacing property varying → a custom property. Several varying together as a coherent state → a class.
- Test new sections with `dir="rtl"` regularly during development, not just before submission.

## Common mistakes

- **Using physical properties (`margin-left`, `padding-right`) out of habit.** This passes review fine in English and breaks silently the first time the theme runs in a right-to-left market.
- **Reaching for margin-plus-`:last-child`-exception** instead of `gap` for spacing between repeated siblings.
- **Exposing several spacing properties as separate custom properties** when they really represent one coherent layout state that should be a class.

## Key takeaways
- Logical properties everywhere a physical/logical pair exists: this is what makes RTL work.
- `gap` on the container for spacing between siblings, not margin-with-exceptions.
- One varying property → custom property. Several varying together → class.

## Further reading

- [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/): the token scale these properties reference
- [Spacing in Settings](/spacing/spacing-in-settings/): the `range` setting this page's custom-property example reads from
- [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/): the general CSS conventions this page's rules are drawn from
- [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/): the broader RTL picture logical properties support
- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) (MDN)
