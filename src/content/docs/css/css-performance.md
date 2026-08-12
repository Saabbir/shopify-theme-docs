---
title: CSS Performance
description: How Shopify's stylesheet subsetting affects critical CSS strategy, plus containment, selector cost, and other CSS-specific performance levers.
---

**TL;DR:** How Shopify's stylesheet subsetting affects critical CSS strategy, plus containment, selector cost, and other CSS-specific performance levers.

The [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/) article covers the full picture: images, JavaScript, preload/prefetch. This page is the CSS-specific half, going deeper on the levers that are purely about how you write and structure stylesheets.

## Subsetting already does most of your "critical CSS" work

"Critical CSS" traditionally means hand-extracting the small set of styles needed for above-the-fold content and inlining them, a separate build step most static sites need. In a Shopify theme, [stylesheet subsetting](/css/css-in-shopify/#how-subsetting-works) gets you most of that benefit automatically: each page only downloads `{% stylesheet %}` CSS from files actually in its render tree, so a product page never loads a "Testimonials" section's CSS if that section isn't on the page.

| ✅ Do | ❌ Avoid |
|---|---|
| Keep the global stylesheet to true cross-page basics (resets, tokens, header/footer) | Growing the global stylesheet to include every section's CSS "just in case" |
| Let `{% stylesheet %}` scoping naturally limit what loads per page | Manually maintaining a separate hand-built "critical.css" file that drifts out of sync with the real above-the-fold content |
| Keep a file's classes self-contained (see [CSS in Shopify](/css/css-in-shopify/#the-pattern-that-breaks-cross-file-css-dependencies)) so subsetting works correctly | Relying on a cross-file class dependency that breaks the moment a page doesn't render the defining file |

The practical upshot: don't build a separate critical-CSS pipeline. Keep the global stylesheet lean and keep `{% stylesheet %}` scoping disciplined, and you get most of critical CSS's benefit for free.

## Selector cost: mostly not worth optimizing, with one exception

Modern browsers evaluate selectors extremely fast. Micro-optimizing selector specificity for raw performance is rarely worth it, the readability cost isn't worth a speed gain you won't measure. The one real exception is the universal selector `*` combined with expensive properties, or deeply chained descendant selectors evaluated on a very large DOM:

```css
/* Fine in virtually all real cases — don't avoid descendant
   selectors out of unfounded performance fear */
.product-grid .product-card .price { }

/* The actual concern: applying an expensive property via a broad
   selector, which forces the browser to recompute layout/paint
   for every matched element on every change */
* { transition: all 0.3s; }
```

Write selectors for readability and maintainability first, per [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/). Selector performance is very rarely your actual bottleneck, images and render-blocking resources are.

## `content-visibility` and `contain`: skip rendering work for off-screen content

`content-visibility: auto` tells the browser to skip layout and paint work for an element until it's near the viewport, similar in spirit to `loading="lazy"` for images, but for arbitrary content:

```css
/* A long list of below-the-fold sections (e.g. a large FAQ, or a
   collection page with many product rows) can defer rendering cost
   for the parts not yet visible */
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px; /* an estimated placeholder size,
    prevents layout shift before the real content is measured */
}
```

Reach for this on genuinely long pages with many off-screen sections. It's not a general-purpose optimization to sprinkle everywhere, and skipping `contain-intrinsic-size` causes layout shift as content pops in.

`contain` (`contain: layout` / `contain: paint`) tells the browser a subtree's internals won't affect layout or paint outside its own boundary, letting the browser skip recalculating the rest of the page when something changes inside that subtree. Useful for an independently-updating widget (like a live cart count) inside an otherwise static page.

## Animate cheap properties, not expensive ones

Animating `transform` and `opacity` is cheap, the browser can handle both on the compositor thread, without recalculating layout. Animating `width`, `height`, `top`, `left`, or `margin` is expensive, each frame forces the browser to recompute layout for the animated element and potentially its neighbors:

```css
/* ❌ WRONG — animates layout-affecting properties, forcing a
   layout recalculation on every frame */
.modal { transition: left 0.3s, top 0.3s; }

/* ✅ RIGHT — animates transform, handled on the compositor thread,
   no layout recalculation needed */
.modal { transition: transform 0.3s; }
.modal--open { transform: translateY(0); }
.modal--closed { transform: translateY(100%); }
```

## `will-change`: a hint, not a free performance boost

`will-change` tells the browser to prepare an optimized rendering path for a property that's about to change, but it has a real memory cost, since the browser has to create and maintain a separate compositor layer for that element:

```css
/* ❌ WRONG — applied permanently to every card, creating a
   compositor layer for every single one, most of which never animate */
.product-card { will-change: transform; }

/* ✅ RIGHT — applied only while the interaction is actually happening,
   then removed */
.product-card:hover { will-change: transform; }
```

Use `will-change` sparingly, only on elements that are actually about to animate, and remove it once the animation finishes if you're setting it via JavaScript. Applying it broadly and permanently does the opposite of what it's meant for.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Trust `{% stylesheet %}` subsetting to do critical-CSS-equivalent work automatically. Don't build a separate hand-maintained critical CSS pipeline. | **Hand-building a separate critical.css pipeline** in a Shopify theme, duplicating work that disciplined `{% stylesheet %}` scoping already does. |
| Reach for `content-visibility: auto` on genuinely long pages with many off-screen sections, always paired with a `contain-intrinsic-size` estimate. | **Animating `width`/`top`/`margin`** instead of `transform`, forcing a layout recalculation on every frame. |
| Animate `transform` and `opacity`, not layout-affecting properties like `width`, `top`, or `margin`. | **Applying `will-change` permanently to every instance of a component**, creating unnecessary compositor layers and using more memory than the optimization saves. |
| Apply `will-change` only while an interaction is actually happening, not permanently on every instance of a component. | **Using `content-visibility: auto` without `contain-intrinsic-size`**, causing visible layout shift as content scrolls into view. |

## Key takeaways
- Stylesheet subsetting already gives you most of critical CSS's benefit. Keep the global stylesheet lean instead of building a separate pipeline.
- Selector performance is rarely a real bottleneck. Write for readability first.
- `content-visibility: auto` (with `contain-intrinsic-size`) defers rendering work for long, off-screen content.
- Animate `transform`/`opacity`. Avoid animating layout-affecting properties.
- `will-change` is a targeted, temporary hint, not a permanent blanket setting.

## Further reading

- [CSS in Shopify: stylesheet, style & Subsetting](/css/css-in-shopify/): the subsetting mechanism this page's critical-CSS section builds on
- [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/): the full performance picture beyond CSS
- [CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment) (MDN)
- [`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) (MDN)
