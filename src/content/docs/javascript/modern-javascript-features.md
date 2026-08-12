---
title: Modern JavaScript Features to Use
description: Browser-native JavaScript APIs that are Baseline widely available in 2026 — no polyfill, no library needed.
---

**TL;DR:** Browser-native JavaScript APIs that are Baseline widely available in 2026 — no polyfill, no library needed.

Every API on this page is native, well-supported across current browsers, and needs no polyfill or third-party library for a Shopify theme's actual audience. Reach for these before adding a dependency — see [Third-Party Libraries](/style-guides/third-party-libraries/) for the decision framework around when a library is still worth it.

## Observing things, instead of polling or listening to `scroll`/`resize`

```javascript
// ❌ WRONG — fires on every scroll event, hundreds of times a second,
// and does its own visibility math by hand
window.addEventListener('scroll', () => {
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight) revealElement();
});

// ✅ RIGHT — the browser tells you exactly when visibility changes,
// with no per-frame math and no scroll listener at all
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) revealElement(entry.target);
  });
});
observer.observe(element);
```

`IntersectionObserver` is the right tool for lazy-loading content, scroll-triggered animations, and infinite scroll — anywhere you'd otherwise reach for a `scroll` listener and manual math. `ResizeObserver` is the equivalent for size changes: use it instead of a `resize` listener plus `getBoundingClientRect()` when a component needs to react to its own size, not the window's.

```javascript
// A component that needs to know its own size, not the viewport's
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle('is-narrow', entry.contentRect.width < 400);
  }
});
resizeObserver.observe(this);
```

Always disconnect both in `disconnectedCallback`, the same rule as any other observer or listener covered in [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/).

## `AbortController` — cancelling fetches and listeners together

```javascript
// ✅ One AbortController can cancel a fetch AND remove event listeners,
// all in a single call — useful when a component disconnects mid-request
class SearchResults extends HTMLElement {
  connectedCallback() {
    this.controller = new AbortController();
    const { signal } = this.controller;

    this.input.addEventListener('input', this.handleInput, { signal });
    fetch('/search.json?q=' + this.input.value, { signal })
      .then((res) => res.json())
      .then(this.renderResults);
  }

  disconnectedCallback() {
    this.controller.abort(); // cancels the fetch AND removes the listener, in one call
  }
}
```

This is a meaningful upgrade over manually pairing every `addEventListener` with a `removeEventListener`: pass the same `signal` to as many listeners and fetches as you want, and one `abort()` call cleans up all of them at once.

## `structuredClone` — a real deep clone, no library needed

```javascript
// ❌ WRONG — JSON.parse(JSON.stringify(x)) drops undefined, functions,
// Dates (silently becomes a string), and throws on circular references
const copy = JSON.parse(JSON.stringify(cartState));

// ✅ RIGHT — a real structural clone, built into the browser
const copy = structuredClone(cartState);
```

Reach for this whenever you need a deep copy of theme state (before mutating a draft of the cart, for example) instead of the `JSON.parse(JSON.stringify())` workaround or a cloning library.

## Small standard-library additions worth knowing

```javascript
// Array.at() — negative indexing, no more `arr[arr.length - 1]`
const lastVariant = product.variants.at(-1);

// Object.groupBy() — group an array into an object by a key, without a
// hand-rolled reduce()
const byOption = Object.groupBy(product.variants, (variant) => variant.option1);
```

Both are small, but they replace patterns (`arr[arr.length - 1]`, a manual `reduce` for grouping) that show up often enough in theme code to be worth using directly.

## `<dialog>` and the Popover API — native overlays, no library

```html
<!-- A real, accessible modal: focus trapping, Escape-to-close, and a
     ::backdrop, all built in — no modal library required -->
<dialog id="size-guide">
  <button autofocus formmethod="dialog">Close</button>
  <p>Size guide content…</p>
</dialog>
<button commandfor="size-guide" command="show-modal">Size guide</button>
```

```javascript
// Programmatic control, if you're not using the declarative
// commandfor/command attributes above
document.getElementById('size-guide').showModal();
```

`<dialog>` with `showModal()` gives you a real modal: it traps focus, closes on Escape, and creates a `::backdrop` you can style, all without a modal library. For lighter-weight overlays, non-modal ones like a tooltip, dropdown menu, or a toast that shouldn't block the rest of the page, the `popover` attribute is the equivalent for non-modal cases:

```html
<button popovertarget="filter-menu">Filters</button>
<div id="filter-menu" popover>
  <!-- closes automatically on an outside click or Escape -->
</div>
```

See [Third-Party Libraries](/style-guides/third-party-libraries/#the-default-answer-is-no) for the full list of native-first swaps like this one.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `IntersectionObserver`/`ResizeObserver` instead of `scroll`/`resize` listeners with manual math, and always disconnect them in `disconnectedCallback`. | **A `scroll` listener doing visibility math by hand** where `IntersectionObserver` would do it natively, and more efficiently. |
| Use one `AbortController` per component to cancel fetches and remove listeners together, instead of tracking each cleanup separately. | **`JSON.parse(JSON.stringify())` for a deep clone**, silently dropping `undefined` values and breaking on `Date` objects or circular references. |
| Use `structuredClone` for deep copies instead of the `JSON.parse(JSON.stringify())` workaround. | **Building a custom modal from a styled `<div>`** instead of `<dialog>`, and having to hand-roll focus trapping and Escape-to-close as a result. |
| Reach for `<dialog>`/`showModal()` and the `popover` attribute before a modal or dropdown library. | **Tracking multiple cleanup functions separately** when a single shared `AbortController` and `signal` would cancel all of them together. |

## Key takeaways
- `IntersectionObserver` for visibility changes, `ResizeObserver` for size changes — not `scroll`/`resize` listeners.
- `AbortController`: one `signal`, passed to multiple listeners and fetches, cancelled with one `abort()` call.
- `structuredClone(value)` for a real deep clone.
- `Array.at(-1)` for negative indexing; `Object.groupBy()` for grouping without a manual `reduce`.
- `<dialog>` + `showModal()` for modals; the `popover` attribute for non-modal overlays.

## Further reading

- [JavaScript Architecture: Global vs. Scoped, State & Events](/javascript/javascript-architecture-state-and-events/): where these APIs fit into a component's lifecycle
- [Third-Party Libraries](/style-guides/third-party-libraries/): the decision framework for when a native API isn't enough
- [Modern CSS Features](/css/modern-css-features/): the CSS-side equivalent of this page
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) (MDN)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) (MDN)
- [The Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (MDN)
