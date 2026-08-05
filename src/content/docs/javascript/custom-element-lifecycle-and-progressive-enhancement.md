---
title: "Learning Article: Custom Element Lifecycle & Progressive Enhancement"
description: A step-by-step deep dive into what a Custom Element actually is, its lifecycle, progressive enhancement, and when a shared store is actually justified.
---

[JavaScript Architecture](/javascript/javascript-architecture-state-and-events/) states the policy: Web Components, DOM as source of truth, `CustomEvent` for communication. This article is the deep dive underneath that policy — what a custom element actually is, why its lifecycle works the way it does, and where each rule comes from.

## Step 1: what a Custom Element actually is

A Custom Element is a class that extends `HTMLElement` and gets registered with the browser under a tag name you choose:

```javascript
class QuantitySelector extends HTMLElement {
  constructor() {
    super(); // required — always call this first
  }

  connectedCallback() {
    // runs each time the element is inserted into the DOM
  }

  disconnectedCallback() {
    // runs each time the element is removed from the DOM
  }

  static observedAttributes = ['quantity'];

  attributeChangedCallback(name, oldValue, newValue) {
    // runs whenever an observed attribute changes
  }
}

customElements.define('quantity-selector', QuantitySelector);
```

From that point on, `<quantity-selector>` is a real HTML tag. The browser calls these lifecycle methods for you, automatically, at the right moments. You never call them yourself.

## Why `connectedCallback`, not the constructor

This is the single most common Custom Element mistake, and it's worth understanding exactly why it happens.

```javascript
// ❌ WRONG — the constructor runs once, when the element is created,
// which can happen before it's even attached to the page. Querying
// child elements here can return nothing, because they may not exist yet.
class QuantitySelector extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input'); // may be null
    this.addEventListener('click', this.handleClick); // fine, but easy to forget to remove
  }
}

// ✅ RIGHT — connectedCallback runs once the element (and its
// children) are actually in the DOM, and it runs again every time
// the element is reconnected — so setup here always has real children to find
class QuantitySelector extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input');
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }
}
```

Here's the part that actually causes bugs: `connectedCallback` can run more than once on the same element. If the theme editor removes and reinserts a section (common during drag-to-reorder or a live preview refresh), your element disconnects and reconnects. If you added an event listener in `connectedCallback` but never removed it in `disconnectedCallback`, the *next* reconnect adds a second, duplicate listener on top of the first, one that's now impossible to remove because you no longer have a reference to it. Every reconnect after that stacks another one. A single click can end up firing a handler three or four times, and the bug only shows up after a merchant reorders sections in the editor, not on your first page load.

The fix is always the same: every `addEventListener` in `connectedCallback` gets a matching `removeEventListener` in `disconnectedCallback`.

## Step 2: progressive enhancement

A Custom Element should enhance markup that already works without JavaScript, not create the markup from scratch. Start from real, functional HTML, then use `connectedCallback` to layer richer behavior on top.

```html
<!-- The <details>/<summary> pair works with zero JavaScript: click to
     open, click to close, keyboard-accessible, screen-reader friendly. -->
<enhanced-disclosure>
  <details>
    <summary>Shipping & returns</summary>
    <div>Ships in 2–3 business days. Free returns within 30 days.</div>
  </details>
</enhanced-disclosure>
```

```javascript
class EnhancedDisclosure extends HTMLElement {
  connectedCallback() {
    const details = this.querySelector('details');
    // add an animated open/close transition — a nice-to-have layer
    // on top of behavior that already worked without it
    details.addEventListener('toggle', () => this.animateToggle(details));
  }
}
customElements.define('enhanced-disclosure', EnhancedDisclosure);
```

If the JavaScript fails to load, or a bot crawler never executes it, or a merchant's browser has an extension that breaks the script, the disclosure still opens and closes. The animation is the only casualty, not the whole feature. Compare that to building the same disclosure as a `<div>` with `onclick` handlers added entirely by JavaScript: no JS means no working feature at all, for any visitor.

## Step 3: events — CustomEvent, not tight coupling

[JavaScript Architecture](/javascript/javascript-architecture-state-and-events/#events-customevent-not-direct-coupling) already states the rule. Here's the failure mode that makes the rule necessary, worked through in full.

```javascript
// ❌ WRONG — variant-picker.js reaches directly into price-display,
// which means it has to know price-display's tag name and its exact
// method signature. Rename updatePrice, and this silently breaks.
class VariantPicker extends HTMLElement {
  handleChange(variant) {
    document.querySelector('price-display').updatePrice(variant.price);
  }
}

// ✅ RIGHT — variant-picker announces what happened and moves on; it
// doesn't know or care whether price-display, or anything else, is listening
class VariantPicker extends HTMLElement {
  handleChange(variant) {
    this.dispatchEvent(new CustomEvent('variant:change', {
      bubbles: true,
      composed: true,
      detail: { variant },
    }));
  }
}

class PriceDisplay extends HTMLElement {
  connectedCallback() {
    document.addEventListener('variant:change', (event) => {
      this.textContent = formatMoney(event.detail.variant.price);
    });
  }
}
```

Now `price-display` can be added, removed, or renamed without ever touching `variant-picker.js`. Neither component needs to know the other exists.

## Step 4: state — the DOM is the source of truth

```javascript
// ❌ WRONG — isOpen lives only in JS memory. CSS has no way to
// select on it, dev tools show nothing useful, and a second piece
// of code that also needs to know "is this open?" has no way to ask.
class Dropdown extends HTMLElement {
  isOpen = false;
  toggle() {
    this.isOpen = !this.isOpen;
    this.querySelector('.menu').style.display = this.isOpen ? 'block' : 'none';
  }
}

// ✅ RIGHT — the hidden attribute IS the state. CSS can select
// [hidden], dev tools show it in the Elements panel, and any other
// script can check it with a plain attribute read — no shared JS
// variable required.
class Dropdown extends HTMLElement {
  toggle() {
    this.querySelector('.menu').toggleAttribute('hidden');
  }
}
```

```css
/* CSS can react directly to the DOM state, with no JS class to coordinate with */
dropdown-menu .menu[hidden] {
  display: none;
}
```

## Step 5: when a shared store is actually justified

Most state belongs on one element, as an attribute or a property. Occasionally, several unrelated components genuinely need the same piece of state, and passing it through DOM attributes or bubbling events between them becomes more awkward than a small shared store. Cart contents are the clearest example in a Shopify theme: the header cart icon, a cart drawer, and an "added to cart" toast are all unrelated components that each need to know the current cart state.

```javascript
// assets/cart-state.js — a minimal pub/sub store, not a state-management library
const listeners = new Set();
let cart = null;

export function getCart() {
  return cart;
}

export function setCart(newCart) {
  cart = newCart;
  listeners.forEach((listener) => listener(cart));
}

export function onCartChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener); // unsubscribe function, called from disconnectedCallback
}
```

```javascript
class CartIcon extends HTMLElement {
  connectedCallback() {
    this.unsubscribe = onCartChange((cart) => {
      this.textContent = cart.item_count;
    });
  }

  disconnectedCallback() {
    this.unsubscribe(); // prevents a leaked listener every time this reconnects
  }
}
```

Notice this is still small and specific: a `Set` of listener functions and two functions to read/write one value. It's not a general-purpose state library, and it's only reached for because the cart genuinely has multiple, unrelated subscribers. If you find yourself wanting this pattern for state only one component uses, that's a sign to move the state back onto that one component instead.

## Best practices

- Put setup in `connectedCallback`, teardown in `disconnectedCallback` — never in the constructor.
- Build from real, working HTML first (`<details>`, `<dialog>`, a real `<button>`), then enhance it. Don't build interactive markup from nothing in JavaScript.
- Pair every `addEventListener` with a `removeEventListener`, every subscription with an unsubscribe call.
- Reach for a shared store only when state genuinely has multiple, unrelated subscribers — cart contents, not a single dropdown's open state.

## Common mistakes

- **Querying child elements in the constructor**, before they're guaranteed to exist.
- **Adding a listener in `connectedCallback` with no matching removal in `disconnectedCallback`**, causing duplicate listeners after a theme-editor reconnect.
- **Building interactive markup entirely in JavaScript** instead of enhancing real HTML, so a JS failure means a completely broken feature instead of a degraded one.
- **Reaching for a shared store for state only one component actually uses.**

## Quick Reference

- Lifecycle: `constructor` (call `super()`, nothing else) → `connectedCallback` (setup, can run more than once) → `disconnectedCallback` (teardown) → `attributeChangedCallback` (reacts to observed attribute changes).
- Progressive enhancement: start from working HTML, layer richer behavior on top in `connectedCallback`.
- Events: `CustomEvent` with `bubbles: true` (add `composed: true` for Shadow DOM), not direct method calls between components.
- State: DOM attributes first; a shared store only for genuinely cross-component state like cart contents.

## Further Reading

- [JavaScript Architecture: Global vs. Scoped, State & Events](/javascript/javascript-architecture-state-and-events/): the policy this article explains in depth
- [Web Components: Two Patterns](/javascript/web-components-patterns/): how to structure a component's internals once you understand the lifecycle
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) (MDN)
- [Lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks) (MDN)
