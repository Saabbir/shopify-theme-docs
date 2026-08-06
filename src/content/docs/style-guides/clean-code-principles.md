---
title: Clean Code Principles
description: What clean, modular, readable code looks like in a Shopify theme, with one complete worked example.
---

**TL;DR:** What clean, modular, readable code looks like in a Shopify theme, with one complete worked example.

"Clean code" is a phrase people use a lot, but it's hard to pin down. It becomes clear once you see two versions of the same code side by side, and you can point at exactly what makes one harder to work with than the other.

This page does that for you. First, it lists the principles briefly. Then it walks through one full example from start to finish: a messy version of a section, and a clean version of the same section, so every principle is tied to something real you can see.

## The principles, briefly

| Principle | In practice |
|---|---|
| **Readable over clever** | Code should be easy to understand the first time you read it, not admired for being short. If a reviewer has to stop and puzzle out a line, it isn't clean, no matter how few characters it uses. |
| **Modular over monolithic** | A section's markup, styling, and behavior should each stand on their own. A snippet does one thing. A Web Component owns one piece of behavior. |
| **Named for meaning** | Variables, classes, and setting `id`s should describe what something *is for*, not what it happens to look like right now. See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/). |
| **Consistent, not novel** | The tenth section you write should look like it was written by the same person as the first one. See [Style Guides](/style-guides/) for more on this. |
| **Guarded, not optimistic** | Nil checks, empty states, and handling for long content are part of the code. They're not something you add later if you remember. See [Liquid Style Guide](/style-guides/liquid/). |

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
| Cryptic names (`fp`, `h`, `c`, `p`, `col`, `t`, `pr`) instead of names that say what they mean | Throughout |
| Inline `style=` attributes instead of scoped CSS. These are hard to maintain and hard to make responsive. | The grid and card `style` attributes |
| The old `img_url` filter instead of the current `image_url`/`image_tag` | The image line |
| Manual currency math (`divided_by: 100.0`) instead of the `money` filter. This breaks for stores using other currencies. | The price line |
| No `alt` text, no `width`/`height`, no `loading="lazy"` on the image | The image line |
| Hardcoded English schema labels (`"Heading"`, `"Collection"`) instead of `t:` locale keys | The schema |
| No handling for an empty collection with zero products | Nowhere handles this |
| A global, unscoped `<script>` in the section instead of `{% javascript %}`. It doesn't rerun correctly (or at all) after a theme editor edit. See [Theme Editor & Storefront Events](/javascript/theme-editor-and-storefront-events/). | The script block |
| A whole card wrapped in a click handler instead of a real `<a>` link. This isn't accessible, can't be reached by keyboard, and doesn't behave like a real link (it can't open in a new tab, and shows no status bar preview). | The script block |
| A fixed 4-column grid using `calc(25% - 12px)` instead of a responsive grid. This breaks badly on mobile. | The card `style` |
| No `paginate` (Liquid's tool for splitting a long list across pages). This one case is safe, since `limit: 8` stays under Liquid's 50-item loop limit, but it's still worth using the theme's real pagination pattern in case that ever changes. | The `for` loop |

### The clean version

```liquid
{%- doc -%}
  Renders a responsive grid of products from a chosen collection.
{%- enddoc -%}

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
  "name": "t:names.featured_collection",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:settings.heading" },
    { "type": "collection", "id": "collection", "label": "t:settings.collection" }
  ],
  "presets": [{ "name": "t:names.featured_collection" }]
}
{% endschema %}
```

```liquid
{%- doc -%}
  Renders one product card: image, title, price, sale badge.
  @param {object} product - The product to render.
{%- enddoc -%}

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
| `featured_collection`, `product_card`, `heading`, `collection`: every name says what it is | Named for meaning |
| The product card is pulled out into its own snippet, and reused anywhere a product card is needed | Modular over monolithic |
| A real `<a>` wraps the whole card. It works with the keyboard, works with right-click, and opens correctly in a new tab. | Readable, and guarded rather than optimistic |
| `image_tag`, `money`, and `t:` locale keys used throughout | Consistent with the rest of this handbook's rules |
| An explicit empty state for when the collection has no products | Guarded, not optimistic |
| `{% stylesheet %}` scoped CSS, no inline `style=` attributes, and a responsive grid using `auto-fit`/`minmax` | Modular, and responsive without manual breakpoints |
| No `<script>` at all. This section doesn't need JS, so it doesn't have any. | Readable, with nothing extra left to maintain |

Notice that the clean version isn't cleverer than the messy one. If anything, it's a bit longer in places, like the explicit empty-state branch and the doc comments. That's fine. Clean code aims for how fast the next person can understand it, not for how few lines it takes.

## Best practices

- When reviewing a section, check it against this page's table the same way you'd check it against [Theme Store Requirements](/theme-store-requirements/). Readability and modularity are things you review for, not just personal taste.
- Pull code out into a snippet the moment the same markup is used a second time in a truly identical way. See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for the "third occurrence" rule on when to go further and generalize it.
- Prefer a few extra lines of explicit, guarded code (an empty-state branch, a nil check) over fewer lines that just assume everything always goes right.

## Common mistakes

- **Optimizing for fewer lines instead of faster understanding.** Clean code is judged by how quickly the next person gets it, not by how few characters it uses.
- **Reaching for inline `style=` attributes** instead of scoped `{% stylesheet %}` CSS. This makes a section's visual behavior harder to find, override, or make responsive.
- **Skipping the empty or nil-check branch** because your test data never triggers it. This is exactly the kind of bug that [Liquid Style Guide](/style-guides/liquid/) and [Accessibility Deep Dive](/accessibility/accessibility-deep-dive/) both warn about.

## Key Takeaways
- Readable over clever, modular over monolithic, named for meaning, consistent, and guarded: five principles you can actually check for, not just a vague feeling.
- The worked example above is the concrete reference. When you're not sure what "clean" means here, compare your code against it.
- Clean code is judged by how fast the next reader understands it, not by how short it is.

## Further Reading

- [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) (the longer-term version of this same discipline)
- [Liquid Style Guide](/style-guides/liquid/) · [CSS](/css/) · [JavaScript](/javascript/)
