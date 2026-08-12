---
title: Modern CSS Features
description: Container queries, :has(), native nesting, cascade layers, subgrid, and other features every modern browser now supports.
---

**TL;DR:** Container queries, :has(), native nesting, cascade layers, subgrid, and other features every modern browser now supports.

CSS gained a wave of genuinely useful features over the past few years, and by 2026 all of them are Baseline "widely available," meaning every major browser engine has shipped them for long enough that you can use them without a fallback or a polyfill. This page covers the ones actually worth reaching for in theme work.

## Container queries: respond to a component's own size

A media query responds to the *viewport's* width. A container query responds to the width of the component's own *container*, which is what you actually want most of the time, a card should reflow based on the space it's given, not the screen size, whether it's in a wide main column or a narrow sidebar.

```css
.product-card {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .product-card { flex-direction: row; }
}
```

| You're asking | Reach for |
|---|---|
| "How does this look at different *screen* sizes?" | A media query |
| "How does this look at different *container* sizes, regardless of screen size?" | A container query |

If you ever catch yourself reaching for a JavaScript `ResizeObserver` to compute a component's own width and toggle a class, stop and check whether a container query does it declaratively instead.

## `:has()`: parent and sibling selection

`:has()` lets a selector match based on what's *inside* or *after* it, something CSS couldn't do at all before this:

```css
/* Style a card differently when it contains a sold-out badge,
   without JavaScript adding a class to the parent */
.product-card:has(.badge--sold-out) {
  opacity: 0.6;
}

/* Style a form field's label based on the field's own validity state */
.form-field:has(:invalid) label {
  color: var(--color-danger);
}
```

This replaces a whole category of "add a class with JS because CSS can't select a parent" workarounds. Reach for it before reaching for JavaScript whenever the need is really just conditional styling based on a descendant or sibling's state.

## Native CSS nesting

Browsers support nesting on their own now, no preprocessor required:

```css
/* ✅ RIGHT — nesting scoped to one component's own rule */
.resource-list:not(.hidden--desktop) {
  .collection-card__image {
    aspect-ratio: 1;
  }

  &:not(.collection-card--image-bg) .collection-card__content {
    height: auto;
  }
}
```

Keep nesting shallow, one or two levels, scoped to a single component's own selectors. Think of it as showing "this lives inside that," not a replacement for BEM's flat naming (see [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/)). Don't nest three or four levels deep just to win a specificity fight, that's exactly the problem BEM's flat class names exist to avoid.

## Cascade layers (`@layer`): explicit control over which rules win

Cascade layers let you group CSS into named layers and explicitly control their priority, independent of specificity or source order. A rule in a later-declared layer beats a rule in an earlier layer, even if the earlier layer's selector is more specific:

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; }
}
@layer components {
  .button { padding: 0.5em 1em; }
}
@layer utilities {
  .u-no-padding { padding: 0; } /* wins over .button even though it's a lower-specificity class */
}
```

This is most useful for keeping resets and low-priority defaults from ever needing `!important` to override, and for making the "what beats what" question explicit and declared up front, instead of an emergent property of specificity math. A theme with a large, shared base stylesheet benefits most; a small component library usually doesn't need it.

## Subgrid: aligning nested grids to a parent's tracks

`subgrid` lets a nested grid item's own grid inherit its parent's column or row tracks, instead of defining its own independent grid:

```css
.product-card {
  display: grid;
  grid-template-rows: auto 1fr auto; /* image, content, price */
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

Use this when several cards in a grid need their internal rows (image, title, price) to align across cards, even when one card's title wraps to two lines and another's doesn't. Without `subgrid`, each card's internal layout is independent, and rows drift out of alignment card to card.

## Flexbox vs. grid, decided by the actual question

| You're asking | Reach for |
|---|---|
| "How do these items arrange in one dimension (a row or a column), and how does extra space distribute?" | Flexbox |
| "How does this content fill a two-dimensional area, with explicit rows and columns?" | Grid |
| "How many columns fit, and how do they adjust as the container resizes?" | Grid, `repeat(auto-fit, minmax(...))` |
| "These nested items need to align to a parent grid's tracks" | Subgrid |

```css
/* Flexbox: one-dimensional arrangement, space distribution */
.button-group { display: flex; gap: var(--space-sm); justify-content: flex-end; }

/* Grid: two-dimensional, explicit structure */
.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-md); }
```

## Other widely-supported features worth knowing

| Feature | Use for |
|---|---|
| `gap` (flexbox and grid) | Spacing between items in a flex/grid container, instead of margin-with-`:last-child`-exceptions, see [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/) |
| `aspect-ratio` | Reserving space for an image or video before it loads, without a padding-hack |
| `scroll-snap-type` / `scroll-snap-align` | A scroll-snapping carousel, without a JS carousel library for basic snapping |
| `color-mix()` and OKLCH | Blending and defining colors in a perceptually uniform space, see [Color in Liquid & CSS](/colors/color-in-liquid-and-css/) for Liquid's own color filters, which cover most of the same ground for theme settings |
| `:is()` / `:where()` | Grouping selectors, see [Cascade, Specificity & the Box Model](/css/cascade-specificity-and-box-model/#is-and-where-for-grouping-without-a-specificity-cost) |
| `@scope` | Scoping a block of CSS to a specific DOM subtree, an alternative to nesting-based scoping or careful naming for style isolation |
| View Transitions API | Animating between two states of a page, see [Modern Shopify Features to Utilize](/codebase-structure/modern-shopify-features/#the-view-transitions-api-for-sectionpage-changes) for the Shopify-specific version and its fallback requirement |

## Reach for CSS before JavaScript

If CSS can do it without a script, use CSS:

| Need | Reach for | Not |
|---|---|---|
| Responsive grid of cards | `grid-template-columns: repeat(auto-fit, minmax(...))` | A JS-computed column count |
| Scroll-snapping carousel | `scroll-snap-type` / `scroll-snap-align` | A JS carousel library for basic snapping |
| Container-based responsive behavior | Container queries (`@container`) | A `ResizeObserver` workaround |
| Conditional styling based on a sibling/child's state | `:has()` | Reaching for a JS framework's reactivity for a CSS-only problem |

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Reach for a container query, not a media query, whenever the real question is "how big is this component's own space," not "how big is the screen." | **Reaching for a media query when a container query is the actual right tool**, coupling a component's layout to the viewport instead of its own available space. |
| Use `:has()` for parent/sibling-conditional styling instead of a JavaScript workaround that toggles a class. | **Nesting three or four levels deep to win a specificity fight** instead of fixing the underlying naming or specificity issue. |
| Keep nesting shallow (one or two levels), scoped to a component's own selectors, not a replacement for flat BEM naming. | **Using the View Transitions API with no fallback.** In browsers that don't support it, this can break the experience instead of simply skipping the animation. |
| Reach for `@layer` in a large, shared base stylesheet where reset/defaults keep needing `!important` to override. Skip it for a small, self-contained component. | **Reaching for a JS carousel library or resize-observer workaround** for something `scroll-snap` or a container query already does natively. |
| Always check current browser support and provide a fallback before using the View Transitions API specifically, since it's the one feature on this page with real fallback considerations in a Shopify context. | — |

## Key takeaways
- Container queries respond to a component's own size. Media queries respond to the viewport.
- `:has()` enables parent/sibling-conditional styling natively, no JS class-toggling needed.
- Native nesting is fine, kept shallow and component-scoped. `@layer` gives explicit, declared control over which rules win, useful for large shared stylesheets.
- `subgrid` aligns a nested grid's tracks to its parent's, keeping cards' internal rows aligned across a grid.
- All of these are Baseline widely available in 2026, safe to use without polyfills. The View Transitions API is the one exception worth a support check.

## Further reading

- [Cascade, Specificity & the Box Model](/css/cascade-specificity-and-box-model/): the specificity mechanics `:is()`/`:where()` interact with
- [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/): how nesting fits alongside BEM naming
- [Modern Shopify Features to Utilize](/codebase-structure/modern-shopify-features/): the Shopify-specific version of the View Transitions API, including its fallback requirement
- [Color in Liquid & CSS](/colors/color-in-liquid-and-css/): Liquid's own color-derivation filters, the theme-settings equivalent of `color-mix()`
- [CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment) (MDN), relevant to [CSS Performance](/css/css-performance/)
