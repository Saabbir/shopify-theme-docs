---
title: "Learning Article: CSS Deep Dive"
description: The cascade, specificity, and modern layout — from first principles, not just the rulebook.
---

[CSS Style Guide](/style-guides/css/) tells you what to write. This article is about *why* — the mental model that makes the rules obvious in hindsight instead of arbitrary.

## Step 1: the cascade is a conflict-resolution system, not a stylesheet reader

When two rules target the same element and property, the browser needs to decide which wins. It resolves this in a strict order:

1. **Origin and importance** — user-agent styles, then author styles, then `!important` author styles (roughly — the full algorithm has more tiers, but this covers what you'll encounter day to day).
2. **Specificity** — a more specific selector beats a less specific one, regardless of source order.
3. **Source order** — if specificity ties, whichever rule appears later in the stylesheet wins.

Most "why isn't my CSS applying" confusion is actually a specificity or source-order question in disguise. Once you can answer "which of these two rules wins, and why" by inspecting the selectors rather than guessing, most cascade confusion disappears.

## Step 2: specificity, calculated by hand once

Specificity is calculated as three numbers, compared left to right: (ID selectors, class/attribute/pseudo-class selectors, element/pseudo-element selectors).

| Selector | Specificity (id, class, element) |
|---|---|
| `.product-card` | (0, 1, 0) |
| `.product-card.product-card--sold-out` | (0, 2, 0) |
| `#main-product .price` | (1, 1, 0) |
| `div.product-card` | (0, 1, 1) |

`#main-product .price` beats `.product-card.product-card--sold-out` because one ID outweighs any number of classes. This is precisely why this handbook avoids ID selectors for styling ([CSS Style Guide](/style-guides/css/)) — an ID-based rule is nearly impossible to override later without another ID or `!important`, both of which make the next override even harder.

```css
/* ❌ Once written, overriding this later requires another ID selector
   or !important — the specificity war only escalates from here */
#main-product .price { color: red; }

/* ✅ A class-based rule can be overridden by another class-based rule
   with normal source-order/specificity rules, no escalation needed */
.price--sale { color: var(--color-sale); }
```

## Step 3: the box model, and why `box-sizing: border-box` matters

By default, `width`/`height` set the *content* box only — padding and border add on top, so a `width: 200px` element with `padding: 20px` and a `1px` border actually occupies 242px. `box-sizing: border-box` makes `width`/`height` include padding and border, so the number you write is the number you get:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

This single global rule (in most themes' reset) is why width math tends to "just work" in practice — without it, every padding/border addition would require recalculating widths elsewhere.

## Step 4: modern layout — flexbox vs. grid, decided by the actual question you're asking

| You're asking | Reach for |
|---|---|
| "How do these items arrange in one dimension (a row or a column), and how does extra space distribute?" | Flexbox |
| "How does this content fill a two-dimensional area, with explicit rows and columns?" | Grid |
| "How many columns fit, and how do they adjust as the container resizes?" | Grid, `repeat(auto-fit, minmax(...))` |
| "This card should reflow based on *its own* width, not the viewport's" | Container queries (`@container`) |

```css
/* Flexbox: one-dimensional arrangement, space distribution */
.button-group {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

/* Grid: two-dimensional, explicit structure */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
}

/* Container query: a card reflows based on the space it's actually
   given, not the viewport — correct even inside a narrow sidebar */
.product-card {
  container-type: inline-size;
}
@container (min-width: 300px) {
  .product-card { flex-direction: row; }
}
```

Reaching for JavaScript to compute a column count or a breakpoint is almost always solving a problem grid/flexbox/container-queries already solve declaratively — see [CSS Style Guide](/style-guides/css/#layout-modern-css-over-javascript).

## Step 5: custom properties are runtime, not compile-time

Unlike a Sass variable (resolved once, at build time), a CSS custom property is resolved at render time and can be changed dynamically — including per-instance, inline, from Liquid:

```liquid
<div class="progress-bar" style="--percent: {{ product.metafields.custom.stock_percent }}%;">
```

```css
.progress-bar::before {
  width: var(--percent);
}
```

This is why a single custom property (not a Sass variable, not a JS-computed inline style property-by-property) is the right tool for "one merchant setting maps to one CSS value" — see [CSS Style Guide](/style-guides/css/#design-tokens-css-custom-properties).

## Exercise: diagnose this real bug

```css
.badge { color: red; }
.product-card .badge { color: var(--color-sale); }
#featured-product .badge { color: blue; }
```

A merchant reports a badge inside `#featured-product .product-card` is blue when it should be sale-red. Work out why using the specificity rules above before reading on: the ID selector `(1,0,0)` beats the two-class selector `(0,2,0)`, regardless of source order — the fix is removing the ID selector (or, at minimum, matching its specificity with an equally specific override, which just escalates the same problem).

## Quick Reference

- Cascade resolves conflicts by: origin/importance → specificity → source order, in that priority.
- Specificity: (IDs, classes, elements) — compared left to right. Avoid ID selectors for styling; they're hard to override later.
- `box-sizing: border-box` makes width/height math predictable.
- Flexbox = one dimension. Grid = two dimensions/explicit structure. Container queries = component-relative responsiveness.
- Custom properties resolve at render time — the right tool for a per-instance, merchant-controlled value.

## Further Reading

- [CSS Style Guide](/style-guides/css/) — the rules this article explains the reasoning behind
- [CSS cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade) — MDN
