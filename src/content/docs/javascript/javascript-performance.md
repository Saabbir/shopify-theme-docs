---
title: JavaScript Performance
description: Deferring and scoping scripts, avoiding layout thrashing, and preventing the memory leaks that build up across theme editor sessions.
---

**TL;DR:** Deferring and scoping scripts, avoiding layout thrashing, and preventing the memory leaks that build up across theme editor sessions.

Most of a Shopify theme's JavaScript performance problem is solved before you optimize a single line of code, just by scoping scripts correctly with `{% javascript %}` (see [JavaScript in Shopify](/javascript/javascript-in-shopify/)). This page covers what's left: loading scripts without blocking, avoiding layout thrashing, and preventing the slow leaks that build up over a long theme editor session.

## Deferring and scoping — the two changes that matter most

```html
<!-- ❌ WRONG — blocks HTML parsing until the script downloads and executes -->
<script src="{{ 'global.js' | asset_url }}"></script>

<!-- ✅ RIGHT — module scripts are deferred by default, and don't
   block parsing -->
<script src="{{ 'global.js' | asset_url }}" type="module"></script>
```

Combine this with `{% javascript %}` scoping (see [JavaScript in Shopify](/javascript/javascript-in-shopify/) and [JavaScript Architecture](/javascript/javascript-architecture-state-and-events/)), so each page only ships JavaScript for the components actually rendered on it. A product page shouldn't load JS for a "Testimonials" section that never appears on that template, for the same reason it shouldn't load that section's CSS. These two changes, deferred module scripts and disciplined scoping, account for most of the JS performance work a theme actually needs.

## Avoiding layout thrashing

"Layout thrashing" means repeatedly reading a layout property (like `offsetWidth`) and writing one (like `style.width`) in alternation, forcing the browser to recalculate layout on every single read.

```javascript
// ❌ WRONG — read, write, read, write: each read forces the browser to
// recompute layout again, because the write before it invalidated it
elements.forEach((el) => {
  const width = el.offsetWidth; // read — forces layout
  el.style.width = width + 10 + 'px'; // write — invalidates layout
});

// ✅ RIGHT — batch all reads first, then all writes; layout is only
// recomputed once, not once per element
const widths = elements.map((el) => el.offsetWidth); // all reads
elements.forEach((el, i) => { el.style.width = widths[i] + 10 + 'px'; }); // all writes
```

This matters most inside a loop over many elements, like resizing every product card in a grid, where thrashing multiplies a small cost by however many elements are on the page. For a single one-off measurement, it's not worth restructuring code around.

## Debouncing and throttling

Not every event needs to run your handler on every single firing. `input`, `scroll`, and `resize` events can fire dozens of times a second.

```javascript
// A simple debounce: waits until the user stops typing for 200ms
// before running the expensive work (e.g. a search request)
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

searchInput.addEventListener('input', debounce((event) => {
  fetch('/search.json?q=' + event.target.value);
}, 200));
```

Use debouncing for "wait until it stops happening" (search-as-you-type, a resize handler that recalculates a layout). Use throttling ("run at most once every N milliseconds") for something that needs a steadier stream of updates, like a scroll-linked progress indicator. In many cases, reaching for `IntersectionObserver` or `ResizeObserver` instead (see [Modern JavaScript Features](/javascript/modern-javascript-features/)) avoids needing either technique in the first place, since those APIs are already throttled and batched by the browser.

## Preventing memory leaks across theme editor sessions

This is the JS-specific case of a pattern covered fully in [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/): a merchant can edit the same section many times in one sitting, and every `shopify:section:load` without a matching `shopify:section:unload` cleanup leaves behind an observer, interval, or listener that never gets removed. None of these show up in a quick test, since one edit "seems fine." They only show up as the page gets slower and slower across a real editing session, which is exactly the situation a merchant is in while building out a page in the theme editor.

```javascript
// ✅ Every setup has a matching teardown, whether it's triggered by
// disconnectedCallback (Web Component) or shopify:section:unload (global JS)
class LiveChart extends HTMLElement {
  connectedCallback() {
    this.resizeObserver = new ResizeObserver(this.redraw);
    this.resizeObserver.observe(this);
    this.interval = setInterval(this.refreshData, 5000);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    clearInterval(this.interval);
  }
}
```

Web Components make this easier to get right by default, since `disconnectedCallback` runs automatically alongside `connectedCallback` — there's no separate event to remember to listen for.

## Code you don't ship at all

The fastest JavaScript is JavaScript that never loads. Before optimizing a script, check whether it needs to exist on this page at all:

| Situation | Fix |
|---|---|
| A component's JS is scoped globally (`assets/global.js`) but only one section uses it | Move it into that section's `{% javascript %}` tag |
| A third-party library is loaded on every page but only used on one template | Load it conditionally, only where it's needed |
| A `{% javascript %}` tag does more than the one section it belongs to needs | Split the unrelated logic into its own component |

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Load scripts as `type="module"` (deferred by default), and scope with `{% javascript %}` so pages only ship JS for what they actually render. | **Alternating reads and writes of layout properties in a loop**, forcing a layout recalculation on every iteration instead of once. |
| Batch DOM reads and writes separately in any loop over multiple elements, instead of alternating them. | **Running an expensive handler on every `input`/`scroll`/`resize` event** with no debounce or throttle, and no `IntersectionObserver`/`ResizeObserver` alternative considered first. |
| Debounce "wait until it stops" events (typing, resizing); throttle "steady stream" events. Prefer `IntersectionObserver`/`ResizeObserver` over either, where they fit. | **Setting up an observer, interval, or listener with no cleanup**, which is invisible in a single test but compounds across a real theme editor editing session. |
| Pair every `connectedCallback`/`shopify:section:load` setup with a `disconnectedCallback`/`shopify:section:unload` teardown, without exception. | **Loading a script globally** when only one section on one template actually uses it. |

## Key takeaways
- `type="module"` scripts defer automatically; combine with `{% javascript %}` scoping for the biggest wins.
- Batch DOM reads, then DOM writes — never alternate them in a loop.
- Debounce "wait until it stops"; throttle "steady stream"; prefer `IntersectionObserver`/`ResizeObserver` where they fit instead of either.
- Every setup (`connectedCallback`, `shopify:section:load`) needs a matching teardown (`disconnectedCallback`, `shopify:section:unload`).

## Further reading

- [JavaScript in Shopify](/javascript/javascript-in-shopify/): the `{% javascript %}` scoping mechanism this page builds on
- [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/): the full cleanup pattern for `shopify:section:unload`
- [Modern JavaScript Features](/javascript/modern-javascript-features/): `IntersectionObserver`/`ResizeObserver` as alternatives to manual event handling
- [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/): the theme-wide performance plan this page is one part of
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
