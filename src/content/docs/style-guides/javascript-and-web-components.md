---
title: JavaScript & Web Components Style Guide
description: The {% javascript %} tag, native Web Components, state and events, and when JS is the wrong tool.
---

We write JavaScript as native ES modules. This just means we use the browser's built-in `import`/`export` system, instead of a build tool that bundles files together. Anything with state (data that changes) or interactivity, we ship as a **Web Component**: a custom HTML element you define yourself, backed by a JS class.

You don't need a bundler (a tool that combines many files into one) at runtime, and you don't need a framework like React or Vue. The browser handles loading the modules on its own. Custom Elements, the browser feature behind Web Components, gives you the same kind of reusable, self-contained pieces a framework would otherwise give you.

This page covers the baseline rules. For the two concrete patterns a component can follow, including Shopify's own Horizon theme's more advanced `refs`/declarative-event pattern (checked directly against its actual shipped code), see [Web Components Guideline](/style-guides/web-components/).

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

Like `{% stylesheet %}`, Shopify removes duplicate `{% javascript %}` output and only loads it on pages where the component actually appears.

## Web Components: the default pattern for interactive UI

A native Web Component is a class that extends `HTMLElement` and gets registered with `customElements.define`. It's your default building block for anything with behavior: a carousel, an accordion, a quantity selector, or a live-updating cart total.

### Why Web Components here, specifically

- **No framework to depend on.** It works in any Shopify theme with no build step and no runtime library to keep updated.
- **Progressive enhancement fits naturally.** ("Progressive enhancement" means the page works with plain HTML first, then JavaScript adds extra behavior on top.) The element can show real, server-rendered Liquid markup first, then the component's `connectedCallback` method enhances it. If the JS fails to load, the underlying HTML, like a `<details>` element or a real `<button>`, still works.
- **You get encapsulation without needing a framework's mental model.** ("Encapsulation" just means a component's behavior stays bundled with its own markup and styling.) That's the same idea behind keeping `{% stylesheet %}` and `{% javascript %}` next to the component's markup.

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

Notice three things happening here. Attributes are used for configuration (`min`/`max`). A `CustomEvent` (a custom signal a component sends out) is used to talk to the outside world, instead of reaching directly into a parent component's internals. And `disconnectedCallback` cleans up the listener that was added, so it doesn't linger after the component is removed.

| ✅ Do | ❌ Don't |
|---|---|
| Communicate outward via `CustomEvent` (`bubbles: true`) | Have a component reach up into `closest('parent-component')` and call its methods directly |
| Clean up listeners/observers in `disconnectedCallback` | Add a listener in `connectedCallback` and never remove it |
| Read configuration from attributes (`min`, `max`, `data-*`) | Hardcode a value in JS that should come from the Liquid-rendered markup/settings |
| Let server-rendered markup work without JS where feasible (progressive enhancement) | Render empty markup that only becomes meaningful once JS runs |

## State: attributes and properties, not a framework store

"State" is just the current data a component is tracking. Is this panel open right now? What's the current quantity? Things like that.

Without a framework, that state should live in one of these places, in this order of preference:

1. **The DOM itself**: an `open` attribute on a `<details>` element, or `aria-expanded` on a button. This is the simplest and most reliable option. Other code, including CSS using attribute selectors, can read it for free.
2. **The custom element's own properties or attributes**: for state that's specific to that one component instance.
3. **A shared store at the module level** (a small plain object, or a signal-like pattern): only when several unrelated components genuinely need to react to the same piece of state. For example, a cart item count shown in both the header and a cart drawer (a slide-out panel showing cart contents).

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

Say one component needs to tell another component that something happened. For example, a variant picker (where a shopper picks a size or color) changes, and the price display needs to know about it. In a case like that, dispatch (send out) a `CustomEvent` and let whoever's interested listen for it.

Don't import one component into another and call its methods directly. That creates "coupling," where the two components become dependent on each other's internal details and harder to change independently.

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

This keeps each component reusable on its own. The price display doesn't need to know a variant picker even exists. It only needs to know that a `variant:change` event might happen.

## When JS is the wrong tool

Reach for native HTML/CSS first. See [CSS Style Guide](/style-guides/css/) for the same idea applied to layout:

| Need | Use instead of JS | 
|---|---|
| A collapsible section | `<details>`/`<summary>` |
| A modal dialog | `<dialog>` with `.showModal()` |
| A simple carousel | CSS `scroll-snap` |
| Form validation messaging | Native HTML validation (`required`, `pattern`) + `:invalid`/`:user-invalid` |
| Tooltips | The upcoming `popover` attribute / CSS anchor positioning where support allows |

## No framework, no bundler magic

- No React, Vue, or Svelte component syntax ever renders storefront markup, not even for "just this one complex piece."
- Ship plain ES modules. `import`/`export` already work natively in browsers, and Shopify serves `assets/*.js` files as-is, with no build step required.
- Don't add an npm dependency for anything that about 50 lines of plain JS can do.

## Best practices

- Default to a Web Component for anything with behavior, and default to plain markup and CSS for anything that's purely visual.
- Have components talk to each other through `CustomEvent`, not direct method calls across component boundaries. This is what keeps a component reusable outside the context it was built for.
- Let the DOM be the source of truth for simple state (`aria-expanded`, `open`, `hidden`) instead of a separate JS variable that can fall out of sync with it.
- Clean up what you set up. Every `addEventListener` or `observe` call in `connectedCallback` needs a matching removal in `disconnectedCallback`.

## Common mistakes

- **Reaching directly into another component's internals** (`document.querySelector('other-component').someMethod()`) instead of dispatching an event. This quietly ties together two components that should stay independent.
- **Letting a JS variable and a DOM attribute both represent the same state.** One update path ends up forgetting to sync the other, and the UI shows stale, incorrect state.
- **Adding a UI library for something HTML already does**, like a `<details>` replacement, or a modal library instead of `<dialog>`. That's more code to maintain and ship for no real benefit.
- **Skipping `disconnectedCallback` cleanup**, which leaks listeners on components that get added and removed dynamically, like inside a cart drawer that re-renders.

## Quick Reference

- Global JS lives in `assets/global.js`. Component JS lives in `{% javascript %}`, next to its markup, the same pattern as `{% stylesheet %}`.
- Interactive UI = a native Web Component (`extends HTMLElement`, `customElements.define`).
- State lives in the DOM first, component properties second, and a shared store only when it's genuinely needed across components.
- Communicate outward via `CustomEvent`, not direct cross-component method calls.
- No framework renders storefront markup. No dependency for anything about 50 lines of vanilla JS/CSS can do.

## Further Reading

- [Web Components Guideline](/style-guides/web-components/) (the simple pattern here vs. Horizon's advanced `refs`/declarative-event pattern, and how to choose between them)
- [Theme Editor & Storefront Events](/style-guides/theme-editor-events/) (the `shopify:section:load` events a well-built component often doesn't need special handling for, and the cases where it still does)
- [`{% javascript %}` tag](https://shopify.dev/docs/api/liquid/tags/javascript) (shopify.dev)
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) (MDN)
