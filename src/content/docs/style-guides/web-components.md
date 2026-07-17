---
title: Web Components Guideline
description: Two valid patterns for a theme Web Component — a simple one and Horizon's advanced one — and how to choose between them.
---

[JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) covers the baseline rules (progressive enhancement, `CustomEvent` over direct coupling, cleanup). This page goes deeper: two concrete patterns for structuring a component's internals, verified against what Shopify's own Horizon theme actually ships, and a decision framework for which one a given component deserves.

## Two valid patterns, not one required one

| | Simple pattern | Advanced pattern (Horizon-style) |
|---|---|---|
| Base class | `HTMLElement` directly | A small shared `Component` base class every component extends |
| Finding child elements | `this.querySelector(...)` in `connectedCallback` | Declarative `ref="name"` attributes in the Liquid markup, auto-collected into `this.refs.name` |
| Wiring up events | `this.addEventListener(...)` + matching `removeEventListener` in `disconnectedCallback` | Declarative `on:click="methodName"` attributes in the markup, handled by one shared, delegated listener |
| Best for | A component with one or two behaviors, used in one or two places | A theme with many components, where the boilerplate of manual `querySelector`/`addEventListener` pairs has become repetitive and error-prone across dozens of files |
| Cost | None — it's just `HTMLElement` | You maintain the shared `Component` base class yourself (Skeleton Theme doesn't ship one) |

Neither is "more correct." The simple pattern is what [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) shows by default, and it's the right choice for most components in a theme of Solis's current size. The advanced pattern is what Shopify's own Horizon theme uses throughout — verified directly against its shipped `assets/component.js` and component files — and it's worth adopting once a theme has enough components that the simple pattern's repetition becomes the actual maintenance cost.

## The simple pattern

Covered in full in [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/#a-minimal-well-structured-web-component) — a class extending `HTMLElement` directly, with manual `querySelector` and `addEventListener`/`removeEventListener` pairs. Reach for this by default.

## The advanced pattern: a shared `Component` base class

This is the pattern Horizon's own theme uses for every interactive component. It trades a small amount of upfront infrastructure (a base class you write once) for two things that matter once a theme has dozens of components: **no manual `querySelector`/`addEventListener` boilerplate repeated in every file**, and **a markup-visible contract** — you can read a component's Liquid file and see exactly which elements it depends on (`ref="..."`) and which events it handles (`on:click="..."`), without opening the JS file at all.

### Part 1: `ref` attributes instead of `querySelector`

Rather than writing `this.querySelector('[data-price]')` in every component, mark the elements you need in the markup itself, and let a base class collect them automatically:

```liquid
{% comment %} snippets/price.liquid — mark what the component needs {% endcomment %}
<price-display>
  <span ref="priceContainer">{{ price }}</span>
  <small ref="volumePricingNote" hidden>{{ 'content.volume_pricing_available' | t }}</small>
</price-display>
```

```javascript
// assets/price-display.js
import { Component } from '@theme/component';

class PriceDisplay extends Component {
  connectedCallback() {
    super.connectedCallback();
    // this.refs.priceContainer and this.refs.volumePricingNote are
    // already populated — no querySelector call needed.
    this.refs.priceContainer.textContent = this.formatPrice();
  }
}

customElements.define('price-display', PriceDisplay);
```

The `Component` base class (below) queries every `[ref]` descendant once on connect, keeps that map fresh via a `MutationObserver` as the DOM changes (important for Section Rendering API re-renders, which morph markup in place), and exposes it as `this.refs`.

### Part 2: declarative event binding instead of manual listeners

Instead of `addEventListener` in every `connectedCallback`, bind an event to a method by name directly in the markup:

```liquid
<button on:click="increment">+</button>
<button on:click="decrement">-</button>
```

```javascript
class QuantitySelector extends Component {
  increment() {
    this.refs.input.value = Number(this.refs.input.value) + 1;
  }
  decrement() {
    this.refs.input.value = Math.max(1, Number(this.refs.input.value) - 1);
  }
}
```

One shared, delegated listener (registered once, globally, by the base class) reads `on:click`/`on:change`/etc. attributes and calls the named method on the closest `Component` ancestor — no per-component `addEventListener` call, and nothing to clean up in `disconnectedCallback` for these bindings, since the listener isn't attached per-instance.

### A minimal version of the base class

This is our own compact implementation of the pattern above — inspired by Horizon's architecture (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) for why we reference Horizon's patterns without deriving our codebase from it directly), not a copy of Shopify's actual `assets/component.js`. Adapt it to what Solis's components actually need — this is deliberately smaller than Horizon's version, which additionally handles declarative shadow DOM hydration, `ref="name[]"` array collection, and a `requiredRefs` contract-checking feature.

```javascript
// assets/component.js
export class Component extends HTMLElement {
  refs = {};

  connectedCallback() {
    this.#collectRefs();
    this.#observer = new MutationObserver(() => this.#collectRefs());
    this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['ref'] });
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }

  #observer;

  #collectRefs() {
    const refs = {};
    for (const el of this.querySelectorAll('[ref]')) {
      if (el.closest('[ref]') !== el && el.closest('price-display, quantity-selector') !== this) continue;
      refs[el.getAttribute('ref')] = el;
    }
    this.refs = refs;
  }
}

// One shared, delegated listener for every `on:*` attribute in the theme —
// registered once, not per component instance.
let delegated = false;
export function registerDeclarativeEvents() {
  if (delegated) return;
  delegated = true;
  for (const type of ['click', 'change', 'submit', 'input', 'keydown']) {
    document.addEventListener(type, (event) => {
      const el = /** @type {Element} */ (event.target).closest(`[on\\:${type}]`);
      if (!el) return;
      const methodName = el.getAttribute(`on:${type}`);
      const instance = el.closest('*');
      const component = instance?.closest instanceof Function ? findComponent(instance) : null;
      const method = component && methodName ? component[methodName] : null;
      if (typeof method === 'function') method.call(component, event);
    });
  }
}

function findComponent(el) {
  let node = el;
  while (node) {
    if (node instanceof Component) return node;
    node = node.parentElement;
  }
  return null;
}
```

Call `registerDeclarativeEvents()` once, in your global JS entry point. Every component then extends `Component` instead of `HTMLElement` directly, and gets `this.refs` and `on:*` binding for free.

:::note[This is genuinely optional infrastructure]
Skeleton Theme doesn't ship anything like this — it's plain, per-component Web Components by default, which is exactly [the simple pattern](#the-simple-pattern) above. Only build and adopt this base class once you've noticed the same `querySelector`/`addEventListener` boilerplate repeating across enough components that the shared infrastructure pays for itself. Introducing it for a theme with three or four simple components is premature abstraction — see [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) on waiting for the third real occurrence before extracting a pattern.
:::

## Naming conventions

- **Custom element tag names:** kebab-case, matching what the component does (`price-display`, `quantity-selector`), not the file it lives in if those differ. Horizon's own components follow this exactly.
- **`ref` names:** camelCase (`priceContainer`, `volumePricingNote`) — matches the JS property they become on `this.refs`.
- **`data-testid` for test/automation hooks**, separate from `ref` — `ref` is for the component's own internal wiring; `data-testid` is for anything external (Playwright, Cypress) that needs a stable selector regardless of the component's internal structure. Horizon uses this pattern (`data-testid="divider-{{ section.id }}"`) throughout its sections.
- **Guard `customElements.define` calls** — `if (!customElements.get('price-display')) { customElements.define(...) }` — a component's JS module can execute more than once in some Section Rendering API / theme editor scenarios, and a duplicate `customElements.define` call throws.

## Shadow DOM: light DOM by default

Default to **light DOM** (no `attachShadow` call) for theme components — it keeps global CSS custom properties, the cascade, and `{% stylesheet %}`-scoped styles working normally, and keeps a component's markup visible to `Ctrl+F`/accessibility tooling/browser extensions without extra work. Reach for Shadow DOM only when you specifically need style/DOM encapsulation strong enough that global CSS shouldn't reach inside (rare in a theme, more common in a widget meant to be embedded in arbitrary third-party pages).

## Accessibility patterns worth calling out specifically

- **Every custom element that's interactive needs a real, focusable, semantic element inside it** — a `<button>` for a click target, not a `<div on:click="...">` with no keyboard path. The custom element wraps semantic HTML; it doesn't replace the need for it.
- **`aria-expanded`, `aria-live`, `hidden`/`aria-hidden`** — set these as real DOM state (see [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/#state-attributes-and-properties-not-a-framework-store)), not just visually implied by CSS classes, so assistive tech gets the same information sighted users do.
- **A component that updates content dynamically** (a price after a variant change, a cart count) should update via a live region (`aria-live="polite"`) if the change isn't already inside an element the user just interacted with directly — otherwise a screen reader user gets no indication anything changed.

## Best practices

- Default to the simple pattern; adopt the advanced `Component`/`refs`/`on:*` pattern only once repeated boilerplate across several components makes the shared infrastructure worth its cost.
- Whichever pattern you use, keep it consistent across the theme — mixing both patterns in different components makes the codebase harder to read, not more flexible.
- Light DOM by default; Shadow DOM only for genuine encapsulation needs.
- Guard every `customElements.define` call against double-registration.
- Wrap real semantic HTML (`<button>`, `<dialog>`, `<details>`) inside a custom element — the element adds behavior, it doesn't replace the need for accessible markup underneath.

## Common mistakes

- **Building the advanced `Component` base class for a theme with only a handful of simple components** — pure overhead until the repetition it solves actually exists.
- **Mixing `ref`/`on:*` attributes into a component that extends plain `HTMLElement`** (no base class implementing them) — the attributes silently do nothing, since nothing is reading them.
- **A `<div on:click>` or `<span on:click>` with no real interactive element underneath** — unreachable by keyboard, invisible to a screen reader as an actionable control.
- **Attaching Shadow DOM by habit** ("that's what real Web Components do") when light DOM would have kept global styles and accessibility tooling working with zero extra effort.
- **Forgetting the `customElements.get` guard**, causing a "already defined" error the first time a component's module happens to execute twice.

## Quick Reference

- Two valid patterns: simple (`HTMLElement`, manual `querySelector`/`addEventListener`) and advanced (shared `Component` base class, `ref` attributes, declarative `on:*` event binding) — pick based on how much repeated boilerplate the theme actually has, not by default.
- Tag names: kebab-case. `ref` names: camelCase. `data-testid` for external test hooks, separate from `ref`.
- Light DOM by default; Shadow DOM only for genuine encapsulation needs.
- Guard `customElements.define` against double-registration.
- Wrap real semantic, focusable HTML inside every interactive custom element.

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) — the baseline rules this page builds on
- [JavaScript & Web Components Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/) — the custom element lifecycle in detail
- [Complete Worked Example](/codebase-structure/complete-worked-example/) — a full block using the simple pattern, explained alongside its code
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) — MDN
- [Declarative Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html) — MDN
