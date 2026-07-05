---
title: JavaScript & Web Components Style Guide
description: The {% javascript %} tag, native Web Components, state and events, and when JS is the wrong tool.
---

JavaScript is native ES modules, shipped as **Web Components** for anything stateful or interactive. No bundler required at runtime, no framework — the browser resolves the module graph and Custom Elements do the componentization a framework would otherwise provide.

## Global JS vs. component-scoped JS

Same split as CSS:

| Layer | Lives in | Contains |
|---|---|---|
| **Global** | `assets/global.js`, loaded in `layout/theme.liquid` | Cart drawer, mobile nav, anything shared across most pages |
| **Component-scoped** | A `{% javascript %}` tag inside the section/block `.liquid` file | Behavior specific to that one component |

```liquid
{% comment %} sections/testimonials.liquid {% endcomment %}
<testimonials-carousel>
  ...
</testimonials-carousel>

{% javascript %}
class TestimonialsCarousel extends HTMLElement {
  connectedCallback() {
    this.querySelector('[data-next]')?.addEventListener('click', () => this.advance(1));
  }
  advance(direction) {
    // ...
  }
}
customElements.define('testimonials-carousel', TestimonialsCarousel);
{% endjavascript %}
```

Like `{% stylesheet %}`, `{% javascript %}` output is deduplicated and only loaded on pages where the component actually renders.

## Web Components: the default pattern for interactive UI

A native Web Component (a class extending `HTMLElement`, registered with `customElements.define`) is the default building block for anything with behavior — a carousel, an accordion, a quantity selector, a live-updating cart total.

### Why Web Components here, specifically

- **No framework dependency** — works in any Shopify theme without a build step or a runtime library to keep updated.
- **Progressive enhancement fits naturally** — the element can render meaningful server-rendered (Liquid) markup first, then the component's `connectedCallback` enhances it. If JS fails to load, the underlying HTML (a `<details>`, a real `<button>`) still works.
- **Encapsulation without a framework's mental model** — a component's behavior lives with its markup and styling, same colocation principle as `{% stylesheet %}`/`{% javascript %}`.

### A minimal, well-structured Web Component

```javascript
class QuantitySelector extends HTMLElement {
  static observedAttributes = ['min', 'max'];

  connectedCallback() {
    this.input = this.querySelector('input');
    this.addEventListener('click', this.#handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick);
  }

  #handleClick = (event) => {
    const step = event.target.closest('[data-step]')?.dataset.step;
    if (!step) return;
    const next = Number(this.input.value) + Number(step);
    this.input.value = Math.min(
      Math.max(next, Number(this.getAttribute('min') ?? 1)),
      Number(this.getAttribute('max') ?? Infinity)
    );
    this.dispatchEvent(new CustomEvent('quantity-change', {
      detail: { value: this.input.value },
      bubbles: true,
    }));
  };
}

customElements.define('quantity-selector', QuantitySelector);
```

Notice: attributes for configuration (`min`/`max`), a `CustomEvent` to communicate outward instead of reaching into a parent's internals, and `disconnectedCallback` cleaning up the listener it added.

| ✅ Do | ❌ Don't |
|---|---|
| Communicate outward via `CustomEvent` (`bubbles: true`) | Have a component reach up into `closest('parent-component')` and call its methods directly |
| Clean up listeners/observers in `disconnectedCallback` | Add a listener in `connectedCallback` and never remove it |
| Read configuration from attributes (`min`, `max`, `data-*`) | Hardcode a value in JS that should come from the Liquid-rendered markup/settings |
| Let server-rendered markup work without JS where feasible (progressive enhancement) | Render empty markup that only becomes meaningful once JS runs |

## State: attributes and properties, not a framework store

Without a framework, component state lives in one of these places, in order of preference:

1. **The DOM itself** — an `open` attribute on a `<details>`, `aria-expanded` on a button. The simplest and most robust option; other code (including CSS via attribute selectors) can read it for free.
2. **The custom element's own properties/attributes** — for state specific to that component instance.
3. **A shared module-level store** (a small plain object or a signal-like pattern) — only when multiple, unrelated components genuinely need to react to the same piece of state (e.g. cart item count shown in both the header and a drawer).

```javascript
/* ✅ RIGHT — state lives in the DOM, CSS can react to it for free */
button.setAttribute('aria-expanded', String(!isOpen));
panel.toggleAttribute('hidden', isOpen);
```

```javascript
/* ❌ WRONG — state duplicated in a JS variable AND the DOM, and they
   can drift out of sync the moment one is updated without the other */
let isOpen = false;
function toggle() {
  isOpen = !isOpen;
  // ...forgot to update the DOM attribute here
}
```

## Events: `CustomEvent`, not direct coupling

When one component needs to inform another of something (a variant picker updating the price display), dispatch a `CustomEvent` and let the interested party listen — don't import one component into another and call its methods directly:

```javascript
// In the dispatching component:
this.dispatchEvent(new CustomEvent('variant:change', {
  detail: { variantId, price },
  bubbles: true,
}));

// In the listening component (anywhere in the DOM tree above it):
document.addEventListener('variant:change', (event) => {
  priceElement.textContent = formatMoney(event.detail.price);
});
```

This keeps components independently reusable — the price display doesn't need to know a variant picker exists, only that a `variant:change` event might occur.

## When JS is the wrong tool

Reach for native HTML/CSS first — see [CSS Style Guide](/style-guides/css/) for the layout-level version of this same principle:

| Need | Use instead of JS | 
|---|---|
| A collapsible section | `<details>`/`<summary>` |
| A modal dialog | `<dialog>` with `.showModal()` |
| A simple carousel | CSS `scroll-snap` |
| Form validation messaging | Native HTML validation (`required`, `pattern`) + `:invalid`/`:user-invalid` |
| Tooltips | The upcoming `popover` attribute / CSS anchor positioning where support allows |

## No framework, no bundler magic

- No React/Vue/Svelte component syntax renders storefront markup, ever — not even for "just this one complex piece."
- Ship plain ES modules. `import`/`export` work natively in browsers; Shopify serves `assets/*.js` as-is, no build step required.
- Don't add an npm dependency for something under ~50 lines of vanilla JS can do.

## Best practices

- Default to a Web Component for anything with behavior, and default to plain markup/CSS for anything that's purely visual.
- Communicate between components via `CustomEvent`, not direct method calls across component boundaries — this is what keeps a component reusable outside its original context.
- Let the DOM be the source of truth for simple state (`aria-expanded`, `open`, `hidden`) instead of a parallel JS variable that can drift out of sync.
- Clean up what you set up — every `addEventListener`/`observe` in `connectedCallback` gets a matching removal in `disconnectedCallback`.

## Common mistakes

- **Reaching into another component's internals directly** (`document.querySelector('other-component').someMethod()`) instead of dispatching an event — this quietly couples two components that should be independent.
- **Letting a JS variable and a DOM attribute both represent the same state**, so one update path forgets to sync the other and the UI shows stale state.
- **Adding a UI library for something HTML already does** (a `<details>` replacement, a modal library instead of `<dialog>`) — more code to maintain and ship for no functional gain.
- **Skipping `disconnectedCallback` cleanup**, leaking listeners on components that get added/removed dynamically (e.g. inside a re-rendered cart drawer).

## Quick Reference

- Global JS in `assets/global.js`. Component JS in `{% javascript %}`, colocated with its markup — same pattern as `{% stylesheet %}`.
- Interactive UI = a native Web Component (`extends HTMLElement`, `customElements.define`).
- State lives in the DOM first, component properties second, a shared store only when genuinely cross-component.
- Communicate outward via `CustomEvent`, not direct cross-component method calls.
- No framework renders storefront markup. No dependency for what ~50 lines of vanilla JS/CSS can do.

## Further Reading

- [Theme Editor & Storefront Events](/style-guides/theme-editor-events/) — the `shopify:section:load` events a well-built component often needs no special handling for, and the cases where it still does
- [`{% javascript %}` tag](https://shopify.dev/docs/api/liquid/tags/javascript) — shopify.dev
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) — MDN
