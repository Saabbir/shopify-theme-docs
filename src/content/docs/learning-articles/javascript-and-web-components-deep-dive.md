---
title: "Learning Article: JavaScript & Web Components Deep Dive"
description: The custom element lifecycle, the event model, and why this replaces a framework for theme development.
---

[JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) states the rules. This article builds the understanding underneath them — the custom element lifecycle in detail, and why events (not direct references) are how components should talk to each other.

## Step 1: what a Custom Element actually is

A Custom Element is a class extending `HTMLElement`, registered with the browser via `customElements.define(tagName, ClassName)`. Once registered, the browser calls specific methods on your class automatically at specific moments — this is the "lifecycle":

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    // Called when the element is created (via `new MyComponent()` or
    // when the parser encounters the tag). DOM isn't guaranteed ready
    // yet — avoid touching children here.
  }

  connectedCallback() {
    // Called every time the element is inserted into the DOM.
    // This is where you set up listeners, read initial attributes,
    // and do your "component just appeared" work.
  }

  disconnectedCallback() {
    // Called every time the element is removed from the DOM.
    // Clean up anything connectedCallback set up — listeners,
    // observers, timers — here.
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Called when an observed attribute changes. Only fires for
    // attributes listed in `static observedAttributes`.
  }

  static observedAttributes = ['open', 'variant'];
}

customElements.define('my-component', MyComponent);
```

### Why `connectedCallback`, not `constructor`, is where real setup happens

A component can be constructed once but connected/disconnected/reconnected multiple times — e.g. if it's moved in the DOM, or if a framework-like re-render removes and re-inserts it. Setup that assumes "this only happens once" belongs in `connectedCallback` with matching teardown in `disconnectedCallback`, not the constructor.

```javascript
// ❌ WRONG — if this element is ever removed and reconnected, the
// listener from the first connection is still there, and a second
// one gets added, causing the handler to fire twice
constructor() {
  super();
  this.addEventListener('click', this.handleClick);
}

// ✅ RIGHT — listener lifecycle matches connection lifecycle
connectedCallback() {
  this.addEventListener('click', this.handleClick);
}
disconnectedCallback() {
  this.removeEventListener('click', this.handleClick);
}
```

## Step 2: progressive enhancement — the component should degrade gracefully

Because the markup is server-rendered Liquid, a Web Component should enhance existing HTML rather than requiring JS to render anything meaningful in the first place:

```liquid
{% comment %} The <details> element already works with zero JS —
   the custom element only adds enhanced behavior on top {% endcomment %}
<enhanced-disclosure>
  <details>
    <summary>{{ block.settings.heading }}</summary>
    <div>{{ block.settings.content }}</div>
  </details>
</enhanced-disclosure>
```

```javascript
class EnhancedDisclosure extends HTMLElement {
  connectedCallback() {
    // Add smooth-height animation on top of <details>'s native
    // open/close behavior — if this JS fails to load, <details>
    // still works, just without the animation.
    const details = this.querySelector('details');
    details.addEventListener('toggle', () => this.#animateHeight(details));
  }
  #animateHeight(details) { /* ... */ }
}
```

If JS fails to load (a network hiccup, a script error elsewhere on the page), the merchant's content is still readable and the disclosure still works — just without the extra polish. Compare to a component that renders nothing until JS runs, which fails completely under the same conditions.

## Step 3: the event model — why `CustomEvent` over direct coupling

Two components that call each other's methods directly are coupled: neither can be reused, tested, or reasoned about independently of the other.

```javascript
// ❌ Tightly coupled — variant-picker.js now has to know that a
// price-display element exists, with exactly this method name
class VariantPicker extends HTMLElement {
  updatePrice(newPrice) {
    document.querySelector('price-display').setPrice(newPrice);
  }
}
```

```javascript
// ✅ Decoupled — variant-picker announces a fact about itself.
// It doesn't know or care what's listening, or whether anything is.
class VariantPicker extends HTMLElement {
  #announceVariantChange(variant) {
    this.dispatchEvent(new CustomEvent('variant:change', {
      detail: { variantId: variant.id, price: variant.price },
      bubbles: true,   // lets ancestors listen without a direct reference
      composed: true,  // crosses shadow DOM boundaries, if you're using one
    }));
  }
}

// price-display.js listens without variant-picker knowing it exists:
class PriceDisplay extends HTMLElement {
  connectedCallback() {
    document.addEventListener('variant:change', (e) => {
      this.textContent = formatMoney(e.detail.price);
    });
  }
}
```

Now `VariantPicker` can be tested, reused, or dropped into a page with no `PriceDisplay` at all, and nothing breaks — it just announces an event nobody happens to be listening for.

## Step 4: state — the DOM as the source of truth

A subtle bug class unique to hand-rolled JS (vs. a framework that manages state for you) is state living in two places that can drift apart:

```javascript
// ❌ isOpen (a JS variable) and the actual DOM state (the hidden
// attribute) can disagree if any code path updates one but not
// the other — and as the component grows, that becomes likely
let isOpen = false;
function toggle() {
  isOpen = !isOpen;
  if (isOpen) panel.removeAttribute('hidden');
  // bug: forgot the else branch — isOpen and the DOM now disagree
}
```

```javascript
// ✅ There's only one source of truth: the DOM. Nothing can drift,
// because there's nothing to drift from
function toggle() {
  panel.toggleAttribute('hidden');
}
function isOpen() {
  return !panel.hasAttribute('hidden');
}
```

Whenever state can be represented as a DOM attribute/property, prefer that over a parallel JS variable — it's not just simpler, it's a whole bug class removed by construction.

## Step 5: when a shared store is actually justified

Sometimes two unrelated components genuinely need the same piece of state (cart item count shown in the header badge and inside the cart drawer). A minimal shared-state pattern, no framework required:

```javascript
// cart-state.js — a tiny pub/sub, imported by any component that needs it
const listeners = new Set();
let itemCount = 0;

export function setItemCount(count) {
  itemCount = count;
  listeners.forEach((fn) => fn(itemCount));
}
export function onItemCountChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
```

This is justified specifically because the state is genuinely shared across unrelated components — reach for `CustomEvent` first, and only introduce a shared module like this when a `CustomEvent` would need too many independent listeners doing the same bookkeeping.

## Quick Reference

- Lifecycle: `constructor` (minimal setup) → `connectedCallback` (real setup, listeners) → `disconnectedCallback` (cleanup) → `attributeChangedCallback` (react to observed attribute changes).
- Match every `connectedCallback` listener/observer with a `disconnectedCallback` teardown.
- Progressive enhancement: component should add behavior to working markup, not be required for the markup to mean anything.
- `CustomEvent` for cross-component communication — never direct method calls across component boundaries.
- DOM attributes as the source of truth for simple state; a shared module only when state is genuinely cross-component.

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) — the rules this article explains
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) — MDN
