---
title: "CSS Units: rem, em & the 62.5% Technique"
description: When to use rem vs em vs px, the 62.5% font-size trick for easy mental math, and where viewport units fit in.
---

**TL;DR:** When to use rem vs em vs px, the 62.5% font-size trick for easy mental math, and where viewport units fit in.

Picking a unit isn't a style preference, it decides whether your sizing respects a visitor's own font-size settings or silently ignores them. This page covers the units that actually matter in theme CSS, and the classic technique for making `rem` math easy.

## rem vs em vs px, in one table

| Unit | Relative to | Use for |
|---|---|---|
| `rem` | The **root** element's (`<html>`) font size, always. Never changes based on nesting | Almost everything: font sizes, spacing, widths, radii. This handbook's default |
| `em` | The **current** element's own font size, which can compound through nesting | Values that should scale *with the text right next to them* specifically, like padding inside a button that should grow if the button's own font-size setting grows |
| `px` | Nothing, an absolute pixel value | Things that shouldn't scale with text at all: hairline borders, box-shadow offsets, and other fine detail |

The critical difference between `rem` and `em`: `rem` always reads from the root, so it's predictable no matter how deeply nested an element is. `em` reads from the element's *own* font size, which means it compounds when several nested elements each set their own font-size:

```css
/* ❌ WRONG — em compounds unpredictably through nesting */
.card { font-size: 1.2em; }        /* 1.2× the parent */
.card .badge { font-size: 1.2em; } /* 1.2× the CARD's size, not the root — now 1.44× the root */

/* ✅ RIGHT — rem always reads from the root, regardless of nesting depth */
.card { font-size: 1.2rem; }
.card .badge { font-size: 1rem; }  /* exactly 1rem, no compounding surprise */
```

This is why `rem` is the default for sizing in this handbook. `em`'s compounding behavior is occasionally exactly what you want (see below), but it's a surprise most of the time.

## When `em` is actually the right choice

`em` earns its place for one specific case: a value that should scale proportionally with an element's *own* font size, especially inside a reusable component whose font size might change:

```css
/* ✅ RIGHT — button padding scales with the button's own font size.
   A "large" button variant that bumps font-size automatically gets
   proportionally larger padding too, without a second padding rule */
.button {
  font-size: 1rem;
  padding: 0.5em 1em;
}
.button--large {
  font-size: 1.25rem;
  /* padding is still 0.5em/1em, but now relative to 1.25rem — it
     scales automatically, no separate padding override needed */
}
```

If you used `rem` for that padding instead, a `.button--large` variant would need its own explicit padding override, since `rem` never picks up the local font-size change.

## The 62.5% technique: making rem math easy

Browsers default the root font size to `16px`, which means `1rem = 16px`. That's a fine default, but it makes mental math awkward: `1.5rem` is `24px`, `0.875rem` is `14px`, and so on. None of it lines up cleanly.

The 62.5% technique sets the root font size to 62.5% of the browser default, which makes `1rem = 10px`, and every other value a clean multiple of 10:

```css
:root {
  font-size: 62.5%; /* 62.5% of 16px = 10px, so 1rem = 10px */
}

body {
  font-size: 1.6rem; /* 1.6 × 10px = 16px, the same real-world size as before */
}
```

```
1rem   = 10px
1.2rem = 12px
1.4rem = 14px
1.6rem = 16px
2rem   = 20px
2.4rem = 24px
3.2rem = 32px
```

With this in place, converting a design spec's pixel value to `rem` is just "move the decimal point one place," instead of dividing by 16 every time.

### Why `62.5%` and not a fixed `10px`

```css
/* ❌ WRONG — a fixed pixel root size overrides the user's browser
   font-size preference entirely, which is an accessibility problem.
   A visitor who bumped their default to 20px for readability gets
   overridden back down to a fixed 10px */
:root { font-size: 10px; }

/* ✅ RIGHT — a percentage still respects the user's own browser
   default. If they set 20px as their default, 62.5% of that is
   12.5px, and every rem value in the theme scales up accordingly */
:root { font-size: 62.5%; }
```

This is the entire reason to use `62.5%` instead of just declaring `10px` directly. A visitor with a vision impairment who has increased their browser's default font size for readability should see your theme scale up too, not get silently reset to a fixed size. `62.5%` preserves that; a hardcoded pixel value defeats it.

### Reset `body` back to a real font size

Because `:root { font-size: 62.5%; }` makes `1rem = 10px`, and `10px` is small, always set a real base font size on `body` (or another wrapper) in `rem`, so the page's default text isn't tiny:

```css
:root { font-size: 62.5%; }
body { font-size: 1.6rem; } /* 16px equivalent, same as browser default */
```

Skipping this step is the most common mistake with this technique: setting the root to 62.5% and then forgetting that unstyled text now renders at 10px instead of the expected 16px.

## Viewport units: `vw`, `vh`, and the dynamic variants

Viewport units size relative to the browser window itself, not the font or the root:

| Unit | Relative to |
|---|---|
| `vw` / `vh` | 1% of the viewport's width / height |
| `dvw` / `dvh` | The **dynamic** viewport size, which accounts for mobile browser chrome (address bars) showing and hiding as the user scrolls |
| `svh` / `lvh` | The **smallest** / **largest** possible viewport height, useful for guaranteeing a layout fits even in the most cramped case |

```css
/* ❌ RISKY on mobile — 100vh can be taller than the visible area
   once a mobile browser's address bar is accounted for, causing
   content to be cut off or requiring a scroll to see the bottom */
.hero { height: 100vh; }

/* ✅ RIGHT — dvh accounts for mobile browser chrome dynamically */
.hero { height: 100dvh; }
```

Viewport units are rarely the right choice for font sizes on their own (a heading that's purely `5vw` shrinks illegibly small on a narrow phone), which is why `clamp()` combining a `rem` floor, a `vw` component, and a `rem` ceiling is the standard pattern instead, see [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/#fluid-type-clamp-over-fixed-breakpoint-overrides) and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/#fluid-spacing-clamp-for-the-same-reason-as-fluid-type).

## Best practices

- Default to `rem` for font sizes, spacing, widths, and radii. It's predictable regardless of nesting depth.
- Reach for `em` only when a value should scale with a specific element's own font size, most often internal component padding.
- Use `px` for things that shouldn't scale with text at all: hairline borders, shadow offsets, fine details.
- If using the 62.5% technique, always set a real `rem`-based font size on `body` immediately after, so default text isn't tiny.
- Use `dvh`/`svh` over plain `vh` for full-height mobile layouts, to account for browser chrome.

## Common mistakes

- **Setting `:root { font-size: 10px; }` directly** instead of `62.5%`, which overrides a visitor's browser font-size preference and defeats accessibility.
- **Setting `62.5%` on `:root` and forgetting to reset `body`'s font size**, leaving default text rendering at a tiny 10px.
- **Using `em` for everything**, which compounds unpredictably through nested components and becomes hard to reason about.
- **Using plain `vh` for full-height mobile sections**, which can be taller than what's actually visible once mobile browser chrome is accounted for.

## Key Takeaways
- `rem`: relative to root, predictable, the default choice for most sizing.
- `em`: relative to the current element, compounds through nesting, right for component-internal scaling (like button padding).
- `px`: absolute, right for hairline borders and shadow details that shouldn't scale.
- 62.5% technique: `:root { font-size: 62.5%; }` makes `1rem = 10px` for easy mental math, but always reset `body`'s font size afterward.
- `dvh`/`svh` over `vh` for mobile-safe full-height layouts.

## Further Reading

- [CSS Custom Properties (Variables)](/css/css-custom-properties/): storing these unit values as reusable tokens
- [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/) and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/): the scales built on top of `rem`
- [CSS values and units](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units) (MDN)
