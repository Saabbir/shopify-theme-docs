---
title: "JavaScript in Shopify: the {% javascript %} Tag & Asset Scripts"
description: How the {% javascript %} tag compiles, concatenates, and loads — and how it compares to a plain asset script tag.
---

**TL;DR:** How the {% javascript %} tag compiles, concatenates, and loads — and how it compares to a plain asset script tag.

Shopify gives you two ways to ship JavaScript in a theme: the `{% javascript %}` tag, scoped to a section, block, or snippet, and a plain script loaded from `assets/` via `asset_url`. Picking the right one, and understanding exactly what Shopify does with `{% javascript %}` under the hood, avoids a category of bugs that only show up once a page has more than one component on it. Facts on this page are verified directly against [shopify.dev's JavaScript and stylesheet tags documentation](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags).

## `{% javascript %}` vs. an asset script tag

| | `{% javascript %}` | Asset script (`assets/global.js` via `asset_url`) |
|---|---|---|
| Scope | Lives inside the section/block/snippet Liquid file it belongs to | A separate file, loaded independently |
| Loaded on | Only pages that render that section/block/snippet | Every page you add the `<script>` tag to (usually every page, from `theme.liquid`) |
| Where it ends up | Concatenated with every other `{% javascript %}` tag of the same file type into `scripts.js` (sections), `block-scripts.js` (blocks), or `snippet-scripts.js` (snippets) | Its own separate network request |
| Best for | Behavior specific to one section/block/snippet | Truly global behavior every page needs |

Use `{% javascript %}` as the default for component-scoped behavior, and reserve asset scripts for the small set of things every page genuinely needs. See [JavaScript Architecture](/javascript/javascript-architecture-state-and-events/#global-js-vs-component-scoped-js) for the fuller version of this rule.

## How `{% javascript %}` actually compiles

```liquid
{% comment %} sections/testimonials.liquid {% endcomment %}
{% javascript %}
class TestimonialCarousel extends HTMLElement {
  connectedCallback() {
    console.log('testimonials section loaded');
  }
}
customElements.define('testimonial-carousel', TestimonialCarousel);
{% endjavascript %}
```

Three things happen to this code that aren't obvious just from looking at it:

1. **One `{% javascript %}` tag per file, maximum.** A second `{% javascript %}` tag in the same Liquid file is a syntax error, not a second block that gets merged in. If a section needs more JS than fits comfortably in one tag, that's a sign it might be doing too much, or that some of that logic belongs in an imported module instead.
2. **Content from every file is concatenated by file type**, not by page. Every section's `{% javascript %}` content across the whole theme, from files that are actually rendered on a given page, gets combined into one `scripts.js` for that page's render. Blocks concatenate separately into `block-scripts.js`, and snippets into `snippet-scripts.js`.
3. **Each tag's content is wrapped in its own self-executing anonymous function** before concatenation. This gives every section's JS its own closure, so a `class TestimonialCarousel` in one section's `{% javascript %}` tag can't collide with a same-named class in another section's tag, and a runtime error thrown by one section's script doesn't stop the next section's script from running.

## Loading and injection

The compiled scripts are injected into the page via the `content_for_header` object (the same mechanism `{% stylesheet %}` uses for CSS), and loaded with `<script defer>`. That means this JavaScript never blocks HTML parsing, and it runs only after the DOM is ready, in source order.

**Liquid is not rendered inside `{% javascript %}`,** the same caution that applies to `{% stylesheet %}`. Don't write `{{ product.title }}` expecting it to interpolate inside a `{% javascript %}` tag; it won't. Pass data from Liquid to JavaScript through a `data-*` attribute on the markup instead, and read it with `dataset` in JS.

```liquid
{% comment %} ❌ WRONG — Liquid isn't rendered inside {% javascript %},
   so this ships the literal string "{{ product.title }}" to the browser {% endcomment %}
{% javascript %}
console.log('{{ product.title }}');
{% endjavascript %}
```

```liquid
{% comment %} ✅ RIGHT — pass data through the DOM, read it with dataset {% endcomment %}
<product-card data-title="{{ product.title | escape }}"></product-card>

{% javascript %}
class ProductCard extends HTMLElement {
  connectedCallback() {
    console.log(this.dataset.title);
  }
}
customElements.define('product-card', ProductCard);
{% endjavascript %}
```

## Bundled once per file, not per instance

The compiled script for a section is injected **once per file**, no matter how many times that section (or a block inside it) appears on the page. If a "Testimonials" section is added to a page three times, its `{% javascript %}` content still loads exactly once, not three times.

That has a direct consequence for how you write instance-specific behavior: you can't rely on module-level variables to hold per-instance state, because the same script runs against every instance of the element on the page. Use the pattern already covered in [JavaScript Architecture](/javascript/javascript-architecture-state-and-events/#state-the-dom-is-the-source-of-truth): read configuration from `data-*` attributes on each instance, and keep state on the element itself (an instance property or a DOM attribute), not in a shared module-level variable.

```javascript
// ❌ WRONG — a module-level variable is shared across every instance
// of this section on the page, not scoped to one
let currentSlide = 0;

// ✅ RIGHT — state lives on the element instance, so each rendered
// copy of the section tracks its own slide independently
class TestimonialCarousel extends HTMLElement {
  currentSlide = 0;
}
```

## Best practices

- Default to `{% javascript %}` for section/block/snippet-specific behavior; reserve asset scripts for genuinely global code.
- Keep exactly one `{% javascript %}` tag per file. If it's getting long, consider whether some of the logic belongs in an imported module instead of inline.
- Pass data from Liquid to JS through `data-*` attributes, never by expecting Liquid to render inside `{% javascript %}`.
- Store instance-specific state on the element (property or DOM attribute), not in a module-level variable, since the compiled script runs once for all instances of a component on a page.

## Common mistakes

- **Writing a second `{% javascript %}` tag in the same file,** which is a syntax error, not a second block that gets merged.
- **Expecting `{{ liquid_variable }}` to interpolate inside `{% javascript %}`.** It doesn't render — pass data through a `data-*` attribute instead.
- **Using a module-level variable for state that should be per-instance,** which breaks the moment a section or block renders more than once on the same page.

## Key Takeaways
- One `{% javascript %}` tag per file, concatenated by file type (`scripts.js` / `block-scripts.js` / `snippet-scripts.js`), injected via `content_for_header`, loaded with `<script defer>`.
- Each tag's content runs inside its own self-executing anonymous function — one section's error doesn't break another's script.
- Liquid isn't rendered inside `{% javascript %}`. Pass data via `data-*` attributes.
- A section's compiled script loads once per file, regardless of how many times that section/block appears on the page — keep state per-instance, not module-level.

## Further Reading

- [JavaScript Architecture: Global vs. Scoped, State & Events](/javascript/javascript-architecture-state-and-events/): when to use `{% javascript %}` vs. an asset script
- [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/): the JS events that fire as the theme editor re-renders your sections
- [CSS in Shopify](/css/css-in-shopify/): the `{% stylesheet %}`/`{% style %}` equivalent of this same mechanism
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
