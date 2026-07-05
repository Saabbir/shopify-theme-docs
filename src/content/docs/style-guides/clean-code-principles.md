---
title: Clean Code Principles
description: Clean, modular, readable code principles for Shopify theme development — with one complete, worked example.
---

"Clean code" is vague until you can point at two versions of the same real section and say exactly what makes one harder to work with than the other. This page states the principles briefly, then works through one complete example end to end — a messy version and a clean version of the same section — so every principle is grounded in something concrete.

## The principles, briefly

| Principle | In practice |
|---|---|
| **Readable over clever** | Code should be understandable on first read, not admired for compactness. If a reviewer has to pause and decode a line, it's not clean, however short it is. |
| **Modular over monolithic** | A section's markup, styling, and behavior are each scoped and separable — a snippet does one thing, a Web Component owns one piece of behavior. |
| **Named for meaning** | Variables, classes, and setting `id`s describe what something *is for*, not what it currently looks like — see [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/). |
| **Consistent, not novel** | The tenth section should look like it was written by the same person as the first — see [Style Guides](/style-guides/) generally. |
| **Guarded, not optimistic** | Nil checks, empty states, and long-content handling are part of the code, not an afterthought — see [Liquid Style Guide](/style-guides/liquid/). |

## The complete example: a "Featured Collection" section, messy vs. clean

### The messy version

```liquid
{% comment %} sections/featured-products.liquid — MESSY VERSION {% endcomment %}
<div class="fp">
  <h2>{{ section.settings.h }}</h2>
  <div class="grid" style="display:flex;flex-wrap:wrap;gap:16px">
    {% assign col = collections[section.settings.c] %}
    {% for p in col.products limit: 8 %}
      <div class="card" style="width:calc(25% - 12px)">
        {% if p.featured_image != blank %}
          <img src="{{ p.featured_image | img_url: '400x400' }}">
        {% endif %}
        <div class="t">{{ p.title }}</div>
        <div class="pr">${{ p.price | divided_by: 100.0 }}</div>
        {% if p.compare_at_price > p.price %}<div class="sale">SALE</div>{% endif %}
      </div>
    {% endfor %}
  </div>
</div>
<script>
document.querySelectorAll('.card').forEach(function(c) {
  c.addEventListener('click', function() {
    window.location = '/products/' + c.dataset.handle;
  });
});
</script>
{% schema %}
{ "name": "Featured Products", "settings": [
  { "type": "text", "id": "h", "label": "Heading" },
  { "type": "collection", "id": "c", "label": "Collection" }
]}
{% endschema %}
```

### Everything wrong with it, specifically

| Problem | Where |
|---|---|
| Cryptic names (`fp`, `h`, `c`, `p`, `col`, `t`, `pr`) instead of meaningful ones | Throughout |
| Inline `style=` attributes instead of scoped CSS — unmaintainable and impossible to make responsive cleanly | The grid and card `style` attributes |
| Deprecated `img_url` filter instead of current `image_url`/`image_tag` | The image line |
| Manual currency math (`divided_by: 100.0`) instead of the `money` filter — breaks for other currencies | The price line |
| No `alt` text, no `width`/`height`, no `loading="lazy"` on the image | The image line |
| Hardcoded English schema labels (`"Heading"`, `"Collection"`) instead of `t:` locale keys | The schema |
| No empty-state handling if the collection has zero products | Nowhere handles this |
| Global, unscoped `<script>` in the section instead of `{% javascript %}`, and it re-runs incorrectly (or not at all) after a theme editor edit — see [Theme Editor & Storefront Events](/style-guides/theme-editor-events/) | The script block |
| A whole card wrapped in a click handler instead of a real `<a>` — inaccessible, not keyboard operable, not a real link (can't open in a new tab, no status bar preview) | The script block |
| Fixed 4-column grid via `calc(25% - 12px)` instead of a responsive grid — breaks badly on mobile | The card `style` |
| No `paginate`, though this specific case is safe under the 50-item Liquid loop limit given `limit: 8` — still worth using the theme's real pagination pattern if this ever changes | The `for` loop |

### The clean version

```liquid
{% doc %}
  Renders a responsive grid of products from a chosen collection.
{% enddoc %}

<div class="featured-collection">
  {%- if section.settings.heading != blank -%}
    <h2 class="featured-collection__heading">{{ section.settings.heading }}</h2>
  {%- endif -%}

  {%- assign collection = collections[section.settings.collection] -%}
  {%- if collection != blank and collection.products.size > 0 -%}
    <div class="featured-collection__grid">
      {%- for product in collection.products limit: 8 -%}
        {%- render 'product-card', product: product -%}
      {%- endfor -%}
    </div>
  {%- else -%}
    <p class="featured-collection__empty">{{ 'sections.featured_collection.empty' | t }}</p>
  {%- endif -%}
</div>

{% stylesheet %}
.featured-collection__grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.featured-collection__empty {
  color: var(--color-text-subdued);
}
{% endstylesheet %}

{% schema %}
{
  "name": "t:sections.featured_collection.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:sections.featured_collection.settings.heading.label" },
    { "type": "collection", "id": "collection", "label": "t:sections.featured_collection.settings.collection.label" }
  ],
  "presets": [{ "name": "t:sections.featured_collection.presets.default.name" }]
}
{% endschema %}
```

```liquid
{% doc %}
  Renders one product card: image, title, price, sale badge.
  @param {object} product - The product to render.
{% enddoc %}

<a href="{{ product.url }}" class="product-card">
  {%- if product.featured_image -%}
    {{ product.featured_image | image_url: width: 400 | image_tag:
      loading: 'lazy',
      widths: '200, 400, 600',
      sizes: '(min-width: 990px) 25vw, 50vw',
      alt: product.featured_image.alt
    }}
  {%- endif -%}
  <span class="product-card__title">{{ product.title }}</span>
  <span class="product-card__price">{{ product.price | money }}</span>
  {%- if product.compare_at_price > product.price -%}
    <span class="product-card__badge">{{ 'products.product.on_sale' | t }}</span>
  {%- endif -%}
</a>

{% stylesheet %}
.product-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  color: inherit;
  text-decoration: none;
}
{% endstylesheet %}
```

### What changed, mapped back to the principles

| Clean version does this | Principle |
|---|---|
| `featured_collection`, `product_card`, `heading`, `collection` — every name says what it is | Named for meaning |
| Product card extracted into its own snippet, reused wherever a product card is needed | Modular over monolithic |
| A real `<a>` for the whole card — keyboard operable, right-clickable, opens in a new tab correctly | Readable/guarded, not optimistic |
| `image_tag`, `money`, `t:` locale keys throughout | Consistent with the rest of this handbook's conventions |
| An explicit empty state when the collection has no products | Guarded, not optimistic |
| `{% stylesheet %}` scoped CSS, no inline `style=` attributes, a responsive grid via `auto-fit`/`minmax` | Modular, and correctly responsive without manual breakpoints |
| No `<script>` at all — this section needs no JS, so it has none | Readable — nothing to maintain that isn't earning its place |

Notice the clean version isn't cleverer — if anything it's more verbose in places (the explicit empty-state branch, the doc comments). Clean code optimizes for the next reader's speed of understanding, not for line count.

## Best practices

- When reviewing a section, check it against this page's table the same way you'd check it against [Theme Store Requirements](/theme-store-requirements/) — readability and modularity are review criteria, not just personal taste.
- Extract a snippet the moment markup is used a second time in a genuinely identical way — see [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) on the "third occurrence" rule for when to go further and generalize it.
- Prefer a few extra lines of explicit, guarded code (an empty-state branch, a nil check) over fewer lines that assume the happy path always holds.

## Common mistakes

- **Optimizing for fewer lines instead of faster comprehension** — clean code is judged by how quickly the next person understands it, not by character count.
- **Reaching for inline `style=` attributes** instead of scoped `{% stylesheet %}` CSS, making a section's visual behavior harder to find, override, or make responsive.
- **Skipping the empty/nil-check branch** because the demo data never triggers it — this is exactly the class of bug [Liquid Style Guide](/style-guides/liquid/) and [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/) both call out.

## Quick Reference

- Readable over clever, modular over monolithic, named for meaning, consistent, and guarded — five checkable principles, not a vibe.
- The worked example above is the concrete reference — when in doubt about what "clean" means here, compare against it.
- Clean code is judged by the next reader's speed of understanding, not brevity.

## Further Reading

- [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) — the longer-horizon version of this same discipline
- [Liquid Style Guide](/style-guides/liquid/) · [CSS Style Guide](/style-guides/css/) · [JavaScript & Web Components](/style-guides/javascript-and-web-components/)
