---
title: JavaScript
description: Everything JavaScript in one place — architecture, Web Components, the {% javascript %} tag, modern features, and performance.
---

**TL;DR:** Everything JavaScript in one place — architecture, Web Components, the {% javascript %} tag, modern features, and performance.

This section covers everything JavaScript in this theme: how it's organized, how Web Components are built and structured, how the `{% javascript %}` tag actually compiles and loads, which modern browser APIs are safe to reach for, and how to keep it fast. If you're new to any of the ideas used throughout (Custom Elements, `CustomEvent`, `{% javascript %}`), this section builds them up from first principles rather than assuming you already know them.

## Quick answers

**"Where does this JavaScript go — `global.js` or `{% javascript %}`?"** See [JavaScript Architecture](/javascript/javascript-architecture-state-and-events/#global-js-vs-component-scoped-js). Global JS for things every page needs; `{% javascript %}` for one section or block.

**"Should I use the simple Web Component pattern or the advanced `Component`/`refs` pattern?"** See [Web Components: Two Patterns](/javascript/web-components-patterns/). Default to simple; adopt the advanced pattern once repeated boilerplate across many components makes it worth the setup cost.

**"Why did my listener fire twice after editing in the theme editor?"** See [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/#why-connectedcallback-not-the-constructor) and [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/). A `connectedCallback` without a matching `disconnectedCallback` cleanup stacks duplicate listeners across reconnects.

**"Can I put `{{ product.title }}` inside a `{% javascript %}` tag?"** No — see [JavaScript in Shopify](/javascript/javascript-in-shopify/#loading-and-injection). Liquid isn't rendered inside `{% javascript %}`. Pass data through a `data-*` attribute instead.

**"Do I need a library for this?"** Probably not — see [Modern JavaScript Features](/javascript/modern-javascript-features/) for what's natively available, and [Third-Party Libraries](/style-guides/third-party-libraries/) for the decision framework if it turns out you do.

## What's in this section

| Page | Covers |
|---|---|
| [JavaScript Architecture: Global vs. Scoped, State & Events](/javascript/javascript-architecture-state-and-events/) | `global.js` vs. `{% javascript %}`, Web Components as the default pattern, the DOM-as-source-of-truth state hierarchy, `CustomEvent` for communication |
| [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/) | A full lifecycle walkthrough, why `connectedCallback` and not the constructor, progressive enhancement, and when a shared store is actually justified |
| [Web Components: Two Patterns](/javascript/web-components-patterns/) | The simple pattern vs. Horizon's advanced `refs`/declarative `on:*` event pattern, naming rules, Shadow DOM, accessibility |
| [JavaScript in Shopify: the `{% javascript %}` Tag & Asset Scripts](/javascript/javascript-in-shopify/) | Exactly how `{% javascript %}` compiles, concatenates, and loads, and how it compares to an asset script |
| [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/) | `shopify:section:load` and the rest of the theme editor's JS events, and how they interact with a component's own lifecycle |
| [Modern JavaScript Features](/javascript/modern-javascript-features/) | `IntersectionObserver`, `ResizeObserver`, `AbortController`, `structuredClone`, `<dialog>`, the Popover API — all Baseline widely available, no polyfill needed |
| [JavaScript Performance](/javascript/javascript-performance/) | Deferring and scoping scripts, avoiding layout thrashing, debouncing/throttling, and preventing memory leaks across theme editor sessions |

## The one-sentence policy

Native ES modules and Web Components, no bundler, no framework. Every page in this section is really just working out the consequences of that one sentence in a specific situation.

## Best practices

- Start with [JavaScript Architecture](/javascript/javascript-architecture-state-and-events/) if you're new to this section. Every other page assumes you already know the global-vs-scoped split and the state/events model it sets up.
- Default to the simple Web Component pattern and native browser APIs. Reach for the advanced `Component` pattern or a third-party library only once there's a real, repeated cost to not having one.
- Treat the theme editor as a first-class environment your JS runs in, not an edge case. Test every interactive component by editing it repeatedly, not just by loading the page once.

## Further Reading

- [Style Guides](/style-guides/): Liquid, clean code, and third-party library guidance that sits alongside this section
- [CSS](/css/): the CSS-side equivalent of this section's depth and structure
- [Performance](/performance/) and [Accessibility](/accessibility/): the theme-wide performance and accessibility strategy this section's JS-specific pages plug into
