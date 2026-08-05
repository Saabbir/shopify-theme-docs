---
title: Web Components Guideline
description: Two valid patterns for a theme Web Component, a simple one and Horizon's advanced one, and how to choose between them.
---

The [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) covers the basic rules: build with progressive enhancement, use `CustomEvent` instead of coupling components directly together, and clean up after yourself. This page goes a step further.

It covers two real patterns for structuring what's inside a component. We checked both against what Shopify's own Horizon theme actually ships, and this page shows you how to decide which one a given component needs.

## Two valid patterns, not one required one

| | Simple pattern | Advanced pattern (Horizon-style) |
|---|---|---|
| Base class | `HTMLElement` directly | A small shared `Component` base class every component extends |
| Finding child elements | `this.querySelector(...)` in `connectedCallback` | Declarative `ref="name"` attributes in the Liquid markup, auto-collected into `this.refs.name` |
| Wiring up events | `this.addEventListener(...)` + matching `removeEventListener` in `disconnectedCallback` | Declarative `on:click="methodName"` attributes in the markup, handled by one shared, delegated listener |
| Best for | A component with one or two behaviors, used in one or two places | A theme with many components, where the boilerplate of manual `querySelector`/`addEventListener` pairs has become repetitive and error-prone across dozens of files |
| Cost | None, it's just `HTMLElement` | You maintain the shared `Component` base class yourself (Skeleton Theme doesn't ship one) |

Neither pattern is "more correct" than the other. The simple pattern is what [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) shows by default, and it's the right choice for most components in a theme Solis's current size.

The advanced pattern is what Shopify's own Horizon theme uses throughout. We checked this directly against its shipped `assets/component.js` and component files. It's worth adopting once a theme has enough components that the simple pattern's repetition starts costing you real maintenance time.

## The simple pattern

This pattern is covered in full in [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/#a-minimal-well-structured-web-component). In short, it's a class that extends `HTMLElement` directly, using manual `querySelector` calls and matching `addEventListener`/`removeEventListener` pairs. Use this pattern by default.

## The advanced pattern: a shared `Component` base class

This is the pattern Horizon's own theme uses for every interactive component. It costs a small amount of upfront setup, since you write a base class once, but it pays off once a theme has dozens of components.

You get two real benefits from it. First, no more manual `querySelector`/`addEventListener` code repeated in every file. Second, a contract you can see right in the markup: you can read a component's Liquid file and see exactly which elements it needs (`ref="..."`) and which events it handles (`on:click="..."`), without ever opening the JS file.

### Part 1: `ref` attributes instead of `querySelector`

Instead of writing `this.querySelector('[data-price]')` in every component, mark the elements you need directly in the markup, and let a base class collect them automatically.

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

The `Component` base class shown further down finds every `[ref]` element inside it once, right when the component connects to the page. It keeps that list up to date using a `MutationObserver` as the page changes. This matters for Section Rendering API re-renders, which update markup in place. The whole list becomes available to you as `this.refs`.

### Part 2: declarative event binding instead of manual listeners

Instead of calling `addEventListener` in every `connectedCallback`, you can bind an event to a method by name, right in the markup.

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

Here's how it works under the hood: one shared listener, registered once and globally by the base class, reads the `on:click`, `on:change`, and similar attributes, then calls the named method on the nearest `Component` ancestor. There's no per-component `addEventListener` call, and nothing to clean up in `disconnectedCallback` for these bindings, since the listener isn't attached separately for each component instance.

### A minimal version of the base class

This is our own compact version of the pattern above. It's inspired by how Horizon is built (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) for why we look at Horizon's patterns without copying our codebase from it directly), but it isn't a copy of Shopify's actual `assets/component.js`. Adapt it to what Solis's components actually need.

It's deliberately smaller than Horizon's version, which also handles declarative shadow DOM hydration, `ref="name[]"` array collection, and a `requiredRefs` check.

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

Call `registerDeclarativeEvents()` once, in your global JavaScript entry point. From then on, every component extends `Component` instead of `HTMLElement` directly, and gets `this.refs` and `on:*` binding for free.

:::note[This is genuinely optional]
Skeleton Theme doesn't ship anything like this. Plain, per-component Web Components are its default, which is exactly [the simple pattern](#the-simple-pattern) described above. Only build and adopt this base class once you notice the same `querySelector`/`addEventListener` code repeating across enough components that a shared setup pays for itself. Adding it for a theme with three or four simple components is solving a problem you don't have yet. See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for why it's worth waiting for the third real occurrence of a pattern before you extract it into shared code.
:::

## Naming rules

- **Custom element tag names:** use kebab-case, like `price-display`, matching what the component does, not the name of the file it lives in if those differ. Horizon's own components follow this exactly.
- **`ref` names:** use camelCase (like `priceContainer`, `volumePricingNote`). This matches the JS property name they become on `this.refs`.
- **Use `data-testid` for test and automation hooks, kept separate from `ref`.** A `ref` is for the component's own internal wiring. `data-testid` is for anything external, like Playwright or Cypress (testing tools), that needs a stable, predictable selector regardless of how the component is built inside. Horizon uses this pattern (`data-testid="divider-{{ section.id }}"`) throughout its sections.
- **Guard every `customElements.define` call,** for example: `if (!customElements.get('price-display')) { customElements.define(...) }`. A component's JS module can run more than once in some Section Rendering API or theme editor situations, and a duplicate `customElements.define` call throws an error.

## Shadow DOM: light DOM by default

Default to **light DOM** (meaning you never call `attachShadow`) for theme components. This keeps global CSS custom properties, the normal styling cascade, and `{% stylesheet %}`-scoped styles all working as expected. It also keeps a component's markup visible to `Ctrl+F` searches, accessibility tools, and browser extensions with no extra work from you.

Reach for Shadow DOM only when you specifically need style or DOM isolation strong enough that global CSS shouldn't reach inside. That situation is rare in a theme, and more common in a widget meant to be embedded on someone else's page.

## Accessibility patterns worth calling out specifically

- **Every interactive custom element needs a real, focusable, semantic element inside it.** Use a `<button>` for a click target, not a `<div on:click="...">` with no way to reach it by keyboard. The custom element wraps semantic HTML, it doesn't replace the need for it.
- **Set `aria-expanded`, `aria-live`, `hidden`/`aria-hidden` as real DOM state** (see [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/#state-attributes-and-properties-not-a-framework-store)), not just implied visually by a CSS class, so assistive tech gets the same information sighted users do.
- **A component that updates content on its own,** like a price after a variant change or a cart count, should update through a live region (`aria-live="polite"`) if the change isn't already inside something the user just interacted with directly. Otherwise, a screen reader user gets no sign that anything changed.

## Best practices

- Default to the simple pattern. Only adopt the advanced `Component`/`refs`/`on:*` pattern once repeated code across several components makes a shared setup worth the cost.
- Whichever pattern you use, stay consistent across the theme. Mixing both patterns across different components makes the codebase harder to read, not more flexible.
- Use light DOM by default. Reach for Shadow DOM only when you genuinely need isolation.
- Guard every `customElements.define` call against double registration.
- Wrap real semantic HTML (`<button>`, `<dialog>`, `<details>`) inside a custom element. The element adds behavior, it doesn't replace the need for accessible markup underneath.

## Common mistakes

- **Building the advanced `Component` base class for a theme with only a handful of simple components.** It's pure overhead until the repetition it solves actually exists.
- **Mixing `ref`/`on:*` attributes into a component that extends plain `HTMLElement`** with no base class reading them. The attributes silently do nothing, since nothing is looking for them.
- **A `<div on:click>` or `<span on:click>` with no real interactive element underneath.** It's unreachable by keyboard and invisible to a screen reader as something you can act on.
- **Attaching Shadow DOM out of habit,** thinking "that's what real Web Components do," when light DOM would have kept global styles and accessibility tools working with zero extra effort.
- **Forgetting the `customElements.get` guard,** which causes an "already defined" error the first time a component's module happens to run twice.

## Quick Reference

- Two valid patterns: simple (`HTMLElement`, manual `querySelector`/`addEventListener`) and advanced (shared `Component` base class, `ref` attributes, declarative `on:*` event binding). Pick based on how much repeated code the theme actually has, not by default.
- Tag names: kebab-case. `ref` names: camelCase. Use `data-testid` for external test hooks, kept separate from `ref`.
- Use light DOM by default. Reach for Shadow DOM only when you genuinely need isolation.
- Guard `customElements.define` against double registration.
- Wrap real semantic, focusable HTML inside every interactive custom element.

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) - the baseline rules this page builds on
- [JavaScript & Web Components Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/) - the custom element lifecycle in detail
- [Complete Worked Example](/codebase-structure/complete-worked-example/) - a full block using the simple pattern, explained alongside its code
- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) - MDN
- [Declarative Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html) - MDN
