---
title: "JavaScript Architecture: Global vs. Scoped, State & Events"
description: How JavaScript is organized in this theme — global.js vs. {% javascript %}, DOM as source of truth, and CustomEvent for communication.
---

**TL;DR:** How JavaScript is organized in this theme — global.js vs. {% javascript %}, DOM as source of truth, and CustomEvent for communication.

This theme has one policy for JavaScript: **native ES modules and Web Components, no bundler, no framework.** Everything else on this page follows from that one decision.

## Global JS vs. component-scoped JS

Not all JavaScript belongs in the same place. Split it by how widely it's actually needed:

| | **Global JS** (`assets/global.js`) | **Component-scoped JS** (`{% javascript %}`) |
|---|---|---|
| Use for | Things every page needs: cart count, mobile nav toggle, a shared utility | Behavior that belongs to one section or block, and nothing else |
| Loaded | Once, on every page, via `<script src="{{ 'global.js' \| asset_url }}" type="module" defer>` | Only on pages that render the section/block, concatenated with other `{% javascript %}` content into `scripts.js` / `block-scripts.js` / `snippet-scripts.js` |
| Cost | Paid on every page, whether or not that page uses it | Paid only where it's actually used |

Defaulting everything to global JS is the most common way a theme's JavaScript bloats over time. If a `<quantity-selector>` element only ever appears inside the product form, its behavior belongs in that section's `{% javascript %}` tag, not in `global.js`. See [JavaScript in Shopify](/javascript/javascript-in-shopify/) for exactly how `{% javascript %}` compiles and loads.

```liquid
{% comment %} sections/testimonials.liquid — scoped JS lives with the
   markup it controls, not in a growing global.js file {% endcomment %}
<testimonial-carousel>
  {% for block in section.blocks %}
    <div class="testimonial" {{ block.shopify_attributes }}>{{ block.settings.quote }}</div>
  {% endfor %}
</testimonial-carousel>

{% javascript %}
class TestimonialCarousel extends HTMLElement {
  connectedCallback() {
    // scoped to this section only — never loaded on a page without one
  }
}
customElements.define('testimonial-carousel', TestimonialCarousel);
{% endjavascript %}
```

## Web Components as the default pattern

Interactive UI in this theme is built as [Web Components](/javascript/web-components-patterns/): a custom element (`class extends HTMLElement`) that manages its own markup, state, and events. This isn't a stylistic preference — it maps directly onto how Shopify sections and blocks already work. A section is a self-contained unit of markup and settings; a custom element is a self-contained unit of markup and behavior. They compose naturally.

```javascript
// assets not needed — this can live entirely inside a section's {% javascript %} tag
class QuantitySelector extends HTMLElement {
  static observedAttributes = ['quantity'];

  connectedCallback() {
    this.input = this.querySelector('input');
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    // mirror every addEventListener with a removeEventListener,
    // or a reconnected element (theme editor re-render) leaks listeners
    this.removeEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    if (event.target.matches('[data-increment]')) {
      this.setAttribute('quantity', Number(this.getAttribute('quantity')) + 1);
    }
  };

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'quantity') this.input.value = newValue;
  }
}
customElements.define('quantity-selector', QuantitySelector);
```

For the full lifecycle explanation (why setup belongs in `connectedCallback`, not the constructor) and the progressive-enhancement pattern, see [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/). For the two patterns we use to structure a component's internals, see [Web Components: Two Patterns](/javascript/web-components-patterns/).

## State: the DOM is the source of truth

Reach for state in this order, and don't skip ahead to the next tier until the one before it genuinely doesn't fit:

1. **DOM attributes.** `open`, `aria-expanded`, `data-variant-id`. Visible in dev tools, stylable in CSS via attribute selectors, and free to keep in sync since the DOM already holds it.
2. **Component properties.** A plain JS variable on the element instance, for state that doesn't need to be visible in the DOM or CSS.
3. **A shared module-level store.** Only when state is genuinely needed by multiple, unrelated components (see [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/) for the cart-state example that justifies this tier).

```javascript
// ❌ WRONG — a JS variable the DOM doesn't know about; CSS can't
// react to it, dev tools can't show it, and it silently drifts out
// of sync with what's actually rendered
let isOpen = false;

// ✅ RIGHT — the DOM attribute IS the state; CSS can select
// [open], dev tools show it, and there's only one source of truth
this.toggleAttribute('open', true);
```

## Events: CustomEvent, not direct coupling

When one component needs to react to another, don't reach into it and call its methods directly. Dispatch a `CustomEvent` and let interested components listen for it.

```javascript
// ❌ WRONG — variant-picker.js now has to know price-display exists,
// know its tag name, and know its method signature; this breaks the
// moment either component's internals change
document.querySelector('price-display').updatePrice(variant.price);

// ✅ RIGHT — variant-picker doesn't know or care who's listening
this.dispatchEvent(new CustomEvent('variant:change', {
  bubbles: true,
  composed: true,
  detail: { variant },
}));

// price-display.js listens independently, with no coupling in the other direction
document.addEventListener('variant:change', (event) => {
  priceDisplay.textContent = formatMoney(event.detail.variant.price);
});
```

`bubbles: true` lets the event travel up through the DOM instead of requiring an exact listener target. `composed: true` lets it cross a Shadow DOM boundary, if one of the components involved uses one (most of ours don't — see [Web Components: Two Patterns](/javascript/web-components-patterns/#shadow-dom-light-dom-by-default)).

## No framework, no bundler magic

Everything on this page works with a `<script type="module">` tag and nothing else. There's no build step translating this JS into something else, and no framework runtime shipped to every visitor to manage state or diff a virtual DOM. If you find yourself wanting a framework's specific feature (say, reactive computed values), check [Third-Party Libraries](/style-guides/third-party-libraries/) for the decision framework before reaching for one — most of what a framework gives you, a Web Component and a `CustomEvent` already cover for the scale of interactivity a Shopify theme needs.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Default new interactive UI to component-scoped JS (`{% javascript %}`), not `global.js`. Promote to global only once something is genuinely needed everywhere. | **Defaulting everything to `global.js`** "just in case," which grows every page's JS payload with code most pages never use. |
| Model state as DOM attributes first, component properties second, and a shared store only as a last resort. | **A JS variable holding state the DOM doesn't reflect**, so CSS and dev tools can't see it and it drifts out of sync. |
| Communicate between components with `CustomEvent`, not direct method calls or `document.querySelector` reaching into another component's internals. | **Tight coupling via direct method calls between components**, which breaks the moment either component's internals change. |
| Always pair `addEventListener` with `removeEventListener` in `disconnectedCallback`. | **Forgetting `bubbles: true`** on a `CustomEvent`, so a listener higher up the DOM never receives it. |

## Key takeaways
- Global JS (`assets/global.js`): needed on every page. Scoped JS (`{% javascript %}`): needed on this section/block only.
- State hierarchy: DOM attributes → component properties → shared module-level store (last resort).
- Cross-component communication: `CustomEvent` with `bubbles: true` (and `composed: true` if Shadow DOM is involved), not direct coupling.
- No bundler, no framework — native ES modules and Web Components are the whole toolchain.

## Further reading

- [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/): why setup belongs in `connectedCallback`, and the full state/events walkthrough
- [Web Components: Two Patterns](/javascript/web-components-patterns/): the simple pattern vs. the advanced `refs`/declarative-event pattern
- [JavaScript in Shopify](/javascript/javascript-in-shopify/): exactly how `{% javascript %}` compiles, concatenates, and loads
- [Third-Party Libraries](/style-guides/third-party-libraries/): the decision framework before reaching for a dependency
- [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) (MDN)
