---
title: "Learning Article: JavaScript & Web Components Deep Dive"
description: How custom elements work, how components should talk to each other, and why you don't need a framework for this.
---

The [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) tells you the rules to follow. This article explains the thinking behind them. You'll learn how the custom element lifecycle (the set order of events a component goes through, from being created to being removed) actually works, and why components should talk to each other using events instead of calling each other's code directly.

## Step 1: what a Custom Element actually is

A Custom Element is a small building block for your page. In code terms, it's a class (a blueprint for creating objects) that extends `HTMLElement`, and it gets registered with the browser using `customElements.define(tagName, ClassName)`.

Once it's registered, the browser watches it and automatically calls certain methods on your class at certain moments, like when it appears on the page or gets removed. This set of methods is called the "lifecycle," because it describes the life of the component from start to finish:

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

Here's something that surprises a lot of people. A component is only constructed once, but it can be connected, disconnected, and reconnected to the page several times. This can happen if it's moved somewhere else in the DOM (the Document Object Model, which is the browser's live tree of everything on the page), or if some framework-like code removes it and adds it back.

So if your setup code assumes "this only happens once," it's in the wrong place. It belongs in `connectedCallback`, with matching cleanup in `disconnectedCallback`, not in the constructor.

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

Your markup (the HTML structure of the page) is rendered on the server by Liquid, Shopify's templating language. Because of that, a Web Component should add behavior on top of HTML that already exists and already works, rather than needing JavaScript just to show anything meaningful in the first place. This idea is called "progressive enhancement": start with something that works for everyone, then layer extra features on top for browsers that support them.

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

Think about what happens if the JavaScript fails to load. Maybe there's a network hiccup, or a script error somewhere else on the page. Either way, the merchant's content is still readable, and the disclosure still works. It just loses the extra animation.

Now compare that to a component that renders nothing until its JavaScript runs. That kind of component fails completely under the exact same conditions. This is why progressive enhancement matters: a small hiccup should never mean a broken page.

## Step 3: the event model — why `CustomEvent` over direct coupling

Imagine two components that call each other's methods directly, like two people who can only talk by grabbing each other's notebook and writing in it. They become tied together, and neither one can be used, tested, or understood without the other. In code, we call this "tight coupling," and it makes your components harder to reuse or change later.

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

Look at the difference in the code above. The `CustomEvent` version lets `VariantPicker` announce a fact about itself instead of reaching out and controlling another element. Now `VariantPicker` can be tested on its own, reused elsewhere, or dropped into a page that has no `PriceDisplay` at all, and nothing breaks. It just announces an event, and if nobody's listening, that's fine too.

## Step 4: state — the DOM as the source of truth

"State" just means the current data or condition of your component, like whether a menu is open or closed. When you write JavaScript by hand instead of using a framework that manages state for you, a sneaky kind of bug can creep in: the same piece of state ends up living in two places, and those two places can quietly drift out of sync with each other.

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

Look at the difference above. In the first example, `isOpen` (a variable in your JavaScript) and the actual `hidden` attribute in the DOM can end up disagreeing if some code path updates one but forgets the other. In the second example, there's only one source of truth: the DOM itself. Whenever you can represent state as a DOM attribute or property, do that instead of keeping a separate JS variable for it. It's not just simpler, it removes this entire kind of bug, because there's nothing left to drift out of sync.

## Step 5: when a shared store is actually justified

Sometimes two components that aren't related to each other really do need the same piece of state. For example, a cart item count might need to show up in both the header badge and the cart drawer at the same time. Here's a minimal shared-state pattern (a small, reusable way of keeping state in sync) that needs no framework:

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

This extra complexity is worth it specifically because the state is genuinely shared across components that have nothing else to do with each other. As a rule of thumb, reach for `CustomEvent` first. Only bring in a shared module like this one when a `CustomEvent` would mean too many separate listeners all doing the same bookkeeping.

## Quick Reference

- Lifecycle order: `constructor` (minimal setup), then `connectedCallback` (real setup, listeners), then `disconnectedCallback` (cleanup), then `attributeChangedCallback` (react to observed attribute changes).
- Match every `connectedCallback` listener or observer with a `disconnectedCallback` teardown.
- Progressive enhancement means a component should add behavior to markup that already works, not be required for that markup to make sense.
- Use `CustomEvent` for cross-component communication. Avoid direct method calls across component boundaries.
- Use DOM attributes as the source of truth for simple state. Reach for a shared module only when state is genuinely shared across components.

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/): the rules this article explains.
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements): the MDN reference page.
