---
title: Your First Section & Block
description: A worked example — a testimonial section with a nestable quote block.
---

Let's build something real: a "Testimonials" section merchants can add to any page, made of reusable "Quote" blocks they can add, remove, and reorder.

## 1. The block

```liquid
{% comment %} /blocks/quote.liquid {% endcomment %}
<figure class="quote">
  <blockquote>{{ block.settings.text }}</blockquote>
  {%- if block.settings.author != blank -%}
    <figcaption>{{ block.settings.author }}</figcaption>
  {%- endif -%}
</figure>

{% stylesheet %}
  .quote { max-width: 40ch; }
  .quote blockquote { font-size: 1.25rem; margin: 0 0 .5rem; }
  .quote figcaption { color: var(--color-foreground-75); }
{% endstylesheet %}

{% schema %}
{
  "name": "Quote",
  "settings": [
    { "type": "richtext", "id": "text", "label": "Quote" },
    { "type": "text", "id": "author", "label": "Author" }
  ],
  "presets": [{ "name": "Quote" }]
}
{% endschema %}
```

## 2. The section that hosts it

```liquid
{% comment %} /sections/testimonials.liquid {% endcomment %}
<div class="testimonials color-{{ section.settings.color_scheme }}">
  <div class="page-width">
    {%- if section.settings.heading != blank -%}
      <h2>{{ section.settings.heading }}</h2>
    {%- endif -%}
    <div class="testimonials__grid">
      {% content_for 'blocks' %}
    </div>
  </div>
</div>

{% stylesheet %}
  .testimonials__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Testimonials",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "What customers say" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" }
  ],
  "blocks": [
    { "type": "quote" },
    { "type": "@app" }
  ],
  "presets": [
    {
      "name": "Testimonials",
      "blocks": [
        { "type": "quote", "settings": { "text": "Solis made our storefront feel premium overnight.", "author": "A. Merchant" } },
        { "type": "quote", "settings": { "text": "Setup took an afternoon, not a week.", "author": "B. Owner" } }
      ]
    }
  ]
}
{% endschema %}
```

Notice `"blocks": [{ "type": "quote" }, { "type": "@app" }]` — this restricts the section to only `quote` blocks plus app blocks, instead of `@theme` (any theme block). Use this narrower form when a section has a specific purpose, and `@theme` when it's meant to be a flexible, general-purpose container (like the Group block in [Theme Blocks & Nesting](/codebase-structure/theme-blocks/)).

## 3. Add it to a template

Merchants add sections through the theme editor, but during development you can add one directly to a JSON template:

```json
// templates/page.json (excerpt)
{
  "sections": {
    "testimonials": { "type": "testimonials" }
  },
  "order": ["main", "testimonials"]
}
```

## 4. Preview it

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

Open the page in the theme editor, and you should see "Testimonials" available in the section picker, with an "Add block" option offering "Quote."

## 5. Stress-test it before calling it done

This is the step most likely to get skipped under time pressure, and it's the one Theme Store review actually checks (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)):

| Test case | What to check |
|---|---|
| Zero quote blocks added | `.testimonials__grid` shouldn't show an awkward empty box — either hide the section or show a sensible fallback |
| One quote block | Grid layout shouldn't look broken with just one item (check `auto-fit` behavior at different widths) |
| 10+ quote blocks | Confirm the grid still reads well and doesn't create odd row gaps |
| A quote with a very long text (300+ characters) | Confirm the card grows to fit rather than clipping or overflowing |
| No `author` set on a quote | Confirm the `{% if block.settings.author != blank %}` guard actually prevents an empty `<figcaption>` |

```liquid
{% comment %} ❌ WRONG — this renders an empty, awkward <figcaption></figcaption>
   when no author is set, because there's no blank check {% endcomment %}
<figcaption>{{ block.settings.author }}</figcaption>

{% comment %} ✅ RIGHT — only renders the figcaption when there's real content {% endcomment %}
{%- if block.settings.author != blank -%}
  <figcaption>{{ block.settings.author }}</figcaption>
{%- endif -%}
```

## A common variation: what if a merchant adds zero blocks at all?

```liquid
{% comment %} ✅ Consider hiding the whole section rather than showing
   an empty heading with nothing beneath it {% endcomment %}
{%- if section.blocks.size > 0 -%}
  <div class="testimonials color-{{ section.settings.color_scheme }}">
    <div class="page-width">
      {%- if section.settings.heading != blank -%}
        <h2>{{ section.settings.heading }}</h2>
      {%- endif -%}
      <div class="testimonials__grid">
        {% content_for 'blocks' %}
      </div>
    </div>
  </div>
{%- endif -%}
```

## Best practices

- Build the empty/one-item/many-item test into your normal workflow for every new section, not just this example — it catches the majority of layout bugs Theme Store review would otherwise flag.
- Add a blank-value guard (`{% if x != blank %}`) around any conditionally-rendered piece of markup by default, rather than adding it reactively after noticing an empty tag in the DOM.
- Use `"blocks": [{ "type": "quote" }, { "type": "@app" }]` (not `@theme`) whenever a section has one specific purpose — it keeps merchants from accidentally dropping in unrelated blocks that break the intended layout.

## Common mistakes

- **Building the happy path only** (a handful of nicely-sized quotes) and never testing zero, one, or many blocks.
- **Forgetting blank checks around optional settings**, leaving empty tags in the rendered HTML that a real accessibility/HTML validator would flag.
- **Using `@theme` on a purpose-built section "just in case"** instead of restricting it to the block types it's actually designed for.

## Quick Reference

- Block file → `{% schema %}` with settings + presets → done.
- Section file → `{% content_for 'blocks' %}` + a `"blocks"` array in its schema → hosts the block.
- Restrict a section to specific block types instead of `@theme` when it has one clear purpose.
- Always test zero/one/many blocks and blank optional settings before calling a section finished.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) — shopify.dev
- [Section schema reference](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) — shopify.dev
