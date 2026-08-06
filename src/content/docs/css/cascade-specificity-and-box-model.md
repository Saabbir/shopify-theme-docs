---
title: Cascade, Specificity & the Box Model
description: How the cascade actually resolves conflicts, specificity calculated by hand, and why box-sizing border-box matters.
---

**TL;DR:** How the cascade actually resolves conflicts, specificity calculated by hand, and why box-sizing border-box matters.

Most "why isn't my CSS working" problems are really specificity or source-order problems in disguise. This page explains the mechanics behind them, not just rules to memorize.

## The cascade is a conflict-resolution system

Sometimes two CSS rules try to style the same element and the same property at the same time. When that happens, the browser has to pick a winner. This process is the "cascade," and it always follows the same strict order:

1. **Origin and importance.** The browser checks its own default styles first, then your styles, then any of your styles marked `!important`. (Simplified — the real process has more layers, but this covers what you'll run into most days.)
2. **Specificity.** A more specific selector wins over a less specific one, no matter which one appears first in the file.
3. **Source order.** If two rules are equally specific, whichever one is written later in the stylesheet wins.

Once you can look at two selectors and say which one wins and why, most cascade confusion goes away.

## Specificity, calculated by hand

Specificity is a scorecard with three numbers, compared left to right: (ID selectors, class/attribute/pseudo-class selectors, element/pseudo-element selectors).

| Selector | Specificity (id, class, element) |
|---|---|
| `.product-card` | (0, 1, 0) |
| `.product-card.product-card--sold-out` | (0, 2, 0) |
| `#main-product .price` | (1, 1, 0) |
| `div.product-card` | (0, 1, 1) |

`#main-product .price` beats `.product-card.product-card--sold-out`, even though the second selector has more classes. One ID always outweighs any number of classes. This is why this handbook avoids ID selectors for styling (see [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/)). Once you write a rule with an ID selector, it's almost impossible to override later without another ID or `!important`, and both just make the next override even harder.

```css
/* ❌ Once written, overriding this later requires another ID selector
   or !important — the specificity war only escalates from here */
#main-product .price { color: red; }

/* ✅ A class-based rule can be overridden by another class-based rule
   with normal source-order/specificity rules, no escalation needed */
.price--sale { color: var(--color-sale); }
```

### Diagnose this real bug

```css
.badge { color: red; }
.product-card .badge { color: var(--color-sale); }
#featured-product .badge { color: blue; }
```

A merchant reports that a badge inside `#featured-product .product-card` shows up blue when it should be sale-red. Try to work out why using the rules above before reading on.

The answer: the ID selector `(1,0,0)` beats the two-class selector `(0,2,0)`, no matter what order they're written in. The fix is to remove the ID selector. (You could instead match its specificity with an equally specific override, but that just escalates the same problem.)

### `:is()` and `:where()` for grouping without a specificity cost

Two modern pseudo-classes let you group selectors without the specificity math getting complicated:

```css
/* :is() takes the specificity of its most specific argument */
:is(.card, .badge, #legacy-widget) .title { }

/* :where() always has zero specificity, regardless of its arguments —
   useful for low-priority defaults that should be trivially overridable */
:where(.card, .badge) .title { color: var(--color-text); }
```

`:where()` is particularly useful for base/reset-style rules you want any real component rule to override without a fight, since it contributes nothing to the specificity score.

## The box model, and why `box-sizing: border-box` matters

Every element is a box made of layers: content in the middle, then padding, then a border. By default, `width` and `height` only set the size of the *content* layer, padding and border get added on top of that.

An element with `width: 200px`, `padding: 20px`, and a `1px` border actually takes up 242px on screen, not 200px. `box-sizing: border-box` fixes this: it changes `width` and `height` so they include padding and border too. With it on, the number you write is the number you get:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

This one global rule (part of most themes' CSS reset) is why width math "just works" in practice. Without it, adding padding or a border anywhere forces you to recalculate widths everywhere else.

## Best practices

- Avoid ID selectors for styling entirely. Use classes, so overrides stay simple.
- Reach for `:where()` when writing low-priority default styles you want other rules to override without a specificity fight.
- Keep `box-sizing: border-box` in your global reset. Don't reintroduce content-box sizing per-component.
- When two rules conflict unexpectedly, check specificity and source order before assuming something's broken.

## Common mistakes

- **Reaching for an ID selector "just this once."** It escalates every future override into an ID-or-`!important` fight.
- **Not realizing `:is()` takes on the specificity of its most specific argument**, while `:where()` always has zero, leading to a surprising override.
- **Forgetting `box-sizing: border-box`**, especially in a hand-written component that bypasses the global reset, causing size math to be off by the padding/border amount.
- **Reaching for `!important`** as the first fix for a specificity conflict, instead of fixing the actual selector.

## Key Takeaways
- Cascade order: origin/importance, then specificity, then source order.
- Specificity: (IDs, classes, elements), compared left to right. Avoid ID selectors for styling.
- `:is()` takes the specificity of its most specific argument. `:where()` always has zero.
- `box-sizing: border-box` makes width/height math include padding and border.

## Further Reading

- [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/): the naming conventions that keep specificity manageable in the first place
- [CSS cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade) (MDN)
- [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity) (MDN)
