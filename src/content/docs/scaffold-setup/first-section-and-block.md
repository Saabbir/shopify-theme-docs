---
title: Your First Section & Block
description: A worked example of a testimonial section with a nestable quote block.
---

In this guide, you'll build something real: a "Testimonials" section that merchants can add to any page of their store, with "Quote" blocks merchants can add, remove, and reorder.

Let's build the block first, then the section that holds it.

## 1. The block

Here's the code for the Quote block: it defines how one quote looks, plus a small schema at the bottom that tells the theme editor what settings to show merchants.

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

This file does three things. It shows the quote text and author on the page, it adds a little styling with the `{% stylesheet %}` tag, and it defines a `{% schema %}` block so merchants can edit the quote's text and author from the theme editor.

Notice the `{%- if block.settings.author != blank -%}` check. It only shows the author's name if the merchant actually typed one in, so you never end up with an empty author line on the page.

## 2. The section that hosts it

Now let's build the section that holds these Quote blocks.

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

Look at this part of the schema: `"blocks": [{ "type": "quote" }, { "type": "@app" }]`. This line tells Shopify which blocks are allowed inside this section. Here, only `quote` blocks and app blocks (blocks added by external apps) are allowed. Compare that to `@theme`, which would let a merchant drop in any theme block, not just quote blocks.

Use this narrow list when your section has one specific job, like ours does here. Use `@theme` instead when a section is meant to be a flexible, general-purpose container that can hold many different kinds of blocks. A good example is the Group block described in [Theme Blocks & Nesting](/codebase-structure/theme-blocks/).

## 3. Add it to a template

Merchants normally add sections themselves, using the theme editor's drag-and-drop interface. But while you're developing, it's faster to add a section directly to a JSON template file, like this:

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

Now run this command to preview your work in a real store:

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

Open the page in the theme editor. You should see "Testimonials" listed in the section picker. Click "Add block" and you should see "Quote" as an option.

## 5. Stress-test it before calling it done

This step is the one most people skip when they're short on time. It's also the one that Theme Store review actually checks (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)), so it's worth doing properly.

Here's what to test:

| Test case | What to check |
|---|---|
| Zero quote blocks added | `.testimonials__grid` shouldn't show an awkward empty box. Either hide the whole section, or show a sensible fallback |
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

Here's one more way to handle that case: hide the whole section when there are no blocks, so merchants never see a heading sitting above an empty space.

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

- Test every new section with zero, one, and many items, not just the example here. Make this a normal part of your workflow. It catches most of the layout bugs that Theme Store review would otherwise flag.
- Add a blank-value guard (`{% if x != blank %}`) around any markup that only shows up sometimes. Add it by default while you write the code, not later after you spot an empty tag on the page.
- Use `"blocks": [{ "type": "quote" }, { "type": "@app" }]` instead of `@theme` whenever a section has one specific job. This stops merchants from accidentally dropping in unrelated blocks that break the layout you designed.

## Common mistakes

- **Only testing the happy path.** This means testing with a handful of nicely sized quotes, and never testing what happens with zero, one, or many blocks.
- **Forgetting blank checks around optional settings.** This leaves empty tags in the final HTML, which a real accessibility or HTML validator would flag as a problem.
- **Using `@theme` on a purpose-built section "just in case."** It's better to limit the section to the exact block types it's actually designed for.

## Quick Reference

- Block file → `{% schema %}` with settings + presets → done.
- Section file → `{% content_for 'blocks' %}` + a `"blocks"` array in its schema → hosts the block.
- Restrict a section to specific block types instead of `@theme` when it has one clear purpose.
- Always test zero/one/many blocks and blank optional settings before calling a section finished.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) (shopify.dev)
- [Section schema reference](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) (shopify.dev)
