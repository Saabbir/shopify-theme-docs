---
title: "Learning Article: CSS Deep Dive"
description: How the cascade, specificity, and modern layout actually work, not just a list of rules to memorize.
---

The [CSS Style Guide](/style-guides/css/) tells you what to write. This article explains *why* those rules exist. Once you understand the reasoning behind them, the rules stop feeling random and start making sense.

## Step 1: the cascade is a conflict-resolution system, not a stylesheet reader

Sometimes two CSS rules try to style the same element and the same property at the same time. When that happens, the browser has to pick a winner. This process is called the "cascade," and it always follows the same strict order.

Think of it like a tiebreaker in a competition. If there's a tie, you check the next rule down the list, then the next, until someone wins. CSS works the same way:

1. **Where the rule comes from, and whether it's marked `!important`.** The browser checks its own default styles first, then your styles, then any of your styles marked `!important`. (This is a simplified version. The real process has more layers, but this covers what you'll run into most days.)
2. **Specificity.** A more specific selector (one that targets an element more precisely) wins over a less specific one, no matter which one appears first in the file.
3. **Source order.** If two rules are equally specific, whichever one is written later in the stylesheet wins.

Most "why isn't my CSS working" problems are really just specificity or source-order problems in disguise. Once you can look at two selectors and say which one wins and why, most of that confusion goes away.

## Step 2: specificity, calculated by hand once

Specificity sounds complicated, but it's really just a scorecard with three numbers. You compare these numbers left to right: (number of ID selectors, number of class/attribute/pseudo-class selectors, number of element/pseudo-element selectors).

| Selector | Specificity (id, class, element) |
|---|---|
| `.product-card` | (0, 1, 0) |
| `.product-card.product-card--sold-out` | (0, 2, 0) |
| `#main-product .price` | (1, 1, 0) |
| `div.product-card` | (0, 1, 1) |

Look at the table above. `#main-product .price` beats `.product-card.product-card--sold-out`, even though the second selector has more classes. That's because one ID always outweighs any number of classes. This is why this handbook avoids ID selectors for styling (see [CSS Style Guide](/style-guides/css/)). Once you write a rule with an ID selector, it's almost impossible to override later without using another ID or `!important`, and both of those just make the next override even harder.

```css
/* ❌ Once written, overriding this later requires another ID selector
   or !important — the specificity war only escalates from here */
#main-product .price { color: red; }

/* ✅ A class-based rule can be overridden by another class-based rule
   with normal source-order/specificity rules, no escalation needed */
.price--sale { color: var(--color-sale); }
```

## Step 3: the box model, and why `box-sizing: border-box` matters

Every element on a page is really a box made of layers: content in the middle, then padding, then a border. By default, `width` and `height` only set the size of the *content* layer. Padding and border get added on top of that.

So an element with `width: 200px`, `padding: 20px`, and a `1px` border actually takes up 242px on screen, not 200px. That can be confusing when you're trying to line things up. `box-sizing: border-box` fixes this: it changes `width` and `height` so they include the padding and border too. With it turned on, the number you write is the number you get:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

This one global rule (already part of most themes' CSS reset, the small set of base styles that make browsers behave consistently) is why width math "just works" in practice. Without it, adding padding or a border anywhere would force you to recalculate widths everywhere else.

## Step 4: modern layout — flexbox vs. grid, decided by the actual question you're asking

Picking between flexbox and grid gets a lot easier once you stop thinking about which one is "better" and start thinking about the question you're actually asking. Here's a simple way to decide:

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

If you ever catch yourself reaching for JavaScript to compute a column count or a breakpoint, stop and check first. Grid, flexbox, or container queries can almost always do this for you, declaratively (meaning you describe the result you want, and the browser figures out how to get there), in plain CSS. See [CSS Style Guide](/style-guides/css/#layout-modern-css-over-javascript).

## Step 5: custom properties are runtime, not compile-time

Here's a difference that trips a lot of people up. A Sass variable gets resolved once, when your CSS is built, and after that it's just a fixed value baked into the file. A CSS custom property works differently. It gets resolved when the page renders in the browser, so it can change dynamically, even after the page has loaded.

Because of this, you can set a custom property per instance, inline, straight from Liquid (Shopify's templating language):

```liquid
<div class="progress-bar" style="--percent: {{ product.metafields.custom.stock_percent }}%;">
```

```css
.progress-bar::before {
  width: var(--percent);
}
```

This is why a custom property is the right tool when one merchant setting needs to map to one CSS value. It beats a Sass variable, and it beats a JS-computed inline style set property by property. See [CSS Style Guide](/style-guides/css/#design-tokens-css-custom-properties).

## Exercise: diagnose this real bug

```css
.badge { color: red; }
.product-card .badge { color: var(--color-sale); }
#featured-product .badge { color: blue; }
```

Here's a real-world example to try on your own. A merchant reports that a badge inside `#featured-product .product-card` shows up blue when it should be sale-red. Before reading the answer, try to work out why using the specificity rules from Step 2.

The answer: the ID selector `(1,0,0)` beats the two-class selector `(0,2,0)`, no matter what order they're written in. The fix is to remove the ID selector. (You could instead match its specificity with an equally specific override, but that just escalates the same problem.)

## Quick Reference

- Cascade resolves conflicts in this order: origin/importance, then specificity, then source order.
- Specificity is three numbers (IDs, classes, elements), compared left to right. Avoid ID selectors for styling, since they're hard to override later.
- `box-sizing: border-box` makes width/height math predictable.
- Flexbox handles one dimension. Grid handles two dimensions or an explicit structure. Container queries let a component respond to its own size, not the screen's.
- Custom properties resolve at render time, which makes them the right tool for a per-instance, merchant-controlled value.

## Further Reading

- [CSS Style Guide](/style-guides/css/): the rules this article explains the reasoning behind.
- [CSS cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade): the MDN reference page.
