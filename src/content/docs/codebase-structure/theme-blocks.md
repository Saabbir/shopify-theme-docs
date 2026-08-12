---
title: Theme Blocks & Nesting
description: The biggest change since Dawn, blocks that contain other blocks.
---

**TL;DR:** The biggest change since Dawn, blocks that contain other blocks.

This is the single biggest difference between our theme and older Dawn-era themes. It's worth taking the time to understand it well.

## Old pattern vs. current pattern

**Old pattern (Dawn-era, don't write this today):** a section defined its own blocks inline, right inside the section's own schema. Those blocks could only ever be used inside that one section, and a block couldn't contain other blocks.

**Current pattern (what we write):** blocks live as their own files in `/blocks`. They can be reused across any section, and they can contain other blocks, several levels deep. A section either defines blocks locally, or accepts theme blocks, but never both at the same time.

```liquid
{% comment %} ❌ OLD PATTERN — don't write this today. Blocks defined
   inline inside the section's own schema, locked to this one section. {% endcomment %}
{% comment %} sections/main-product.liquid %}
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'title' %}<h1>{{ product.title }}</h1>
    {% when 'price' %}{% render 'price', product: product %}
  {% endcase %}
{% endfor %}

{% schema %}
{
  "blocks": [
    { "type": "title", "name": "Title" },
    { "type": "price", "name": "Price" }
  ]
}
{% endschema %}
```

```liquid
{% comment %} ✅ CURRENT PATTERN — blocks live in /blocks, reusable
   anywhere, and can be nested. {% endcomment %}
{% comment %} sections/main-product.liquid %}
<div class="product-main">
  {% content_for 'blocks' %}
</div>

{% schema %}
{ "blocks": [{ "type": "@theme" }, { "type": "@app" }] }
{% endschema %}
```

## A minimal theme block

```liquid
{% comment %} /blocks/text.liquid {% endcomment %}
<div class="text-block text-{{ block.settings.alignment }}">
  {{ block.settings.text }}
</div>

{% stylesheet %}
  .text-left { text-align: left; }
  .text-center { text-align: center; }
{% endstylesheet %}

{% schema %}
{
  "name": "Text",
  "settings": [
    { "type": "richtext", "id": "text", "label": "Text" },
    { "type": "text_alignment", "id": "alignment", "label": "Alignment" }
  ],
  "presets": [
    { "name": "Text" },
    { "name": "Content", "settings": { "text": "<p>Hello, world!</p>" } }
  ]
}
{% endschema %}
```

Notice two things that are easy to miss:

- **Presets are required, not optional,** if you want merchants to actually see this block in the theme editor's block picker.
- A theme block can reference `block.settings` and the `section` object of whatever section rendered it. It **cannot** access variables from outside itself. You can't pass it variables the way you would a snippet.

```liquid
{% comment %} ❌ WRONG — no presets means this block is defined correctly
   but literally invisible in the editor's "add block" picker. A common,
   confusing bug: "I wrote the block but merchants can't find it." {% endcomment %}
{% schema %}
{
  "name": "Text",
  "settings": [{ "type": "richtext", "id": "text", "label": "Text" }]
}
{% endschema %}

{% comment %} ✅ RIGHT — at least one preset, so it appears in the picker {% endcomment %}
{% schema %}
{
  "name": "Text",
  "settings": [{ "type": "richtext", "id": "text", "label": "Text" }],
  "presets": [{ "name": "Text" }]
}
{% endschema %}
```

## Letting a section accept blocks

```liquid
{% comment %} /sections/custom-section.liquid {% endcomment %}
<div class="custom-section color-{{ section.settings.color_scheme }}">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Custom section",
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" }
  ]
}
{% endschema %}
```

`"type": "@theme"` means "accept any theme block." `"type": "@app"` means "accept app blocks too." Theme Store themes are required to accept `@app` blocks in specific sections (see [App Compatibility](/theme-store-requirements/app-compatibility/)). If you need to restrict which specific blocks a section accepts, use [block targeting](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/targeting) instead of `@theme`.

```json
// ✅ RIGHT — a purpose-specific section restricted to specific block
// types, instead of accepting literally anything
{
  "name": "Testimonials",
  "blocks": [
    { "type": "quote" },
    { "type": "@app" }
  ]
}
```

```json
// ❌ AVOID — using "@theme" on a section with a very specific visual
// purpose, letting merchants drop in wildly unrelated blocks that break
// the intended layout
{
  "name": "Testimonials",
  "blocks": [{ "type": "@theme" }]
}
```

`@theme` is the right choice for containers that are genuinely general-purpose, like a "Group" or "Row" layout block. For a section with one clear purpose, restrict which block types it accepts instead.

## Nesting blocks inside blocks

A block becomes a container the same way a section does. Give it its own `blocks` schema attribute, and render `{% content_for 'blocks' %}` inside it:

```liquid
{% comment %} /blocks/group.liquid {% endcomment %}
<div class="group-block color-{{ block.settings.color_scheme }}">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Group",
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [
    {
      "name": "Column",
      "blocks": [
        { "type": "text", "settings": { "text": "<h3>Hello, world!</h3>" } },
        { "type": "text", "settings": { "text": "<p>How's it going?</p>" } }
      ]
    }
  ]
}
{% endschema %}
```

That `Column` preset nests two `text` blocks inside a `group` block. This is exactly what merchants do visually in the theme editor, when they drag one block inside another. You're just pre-building a common combination as a preset, so merchants don't have to assemble it from scratch every time.

## How deep should nesting actually go?

Horizon supports several levels of nesting, but "supported" doesn't mean "a good idea everywhere." Here's a useful rule of thumb:

| Nesting depth | When it's appropriate |
|---|---|
| 1 level (section → blocks) | Almost every section |
| 2 levels (section → group block → content blocks) | Layout containers, like columns, grids, or tabs |
| 3+ levels | Rare. Usually a sign the design should be split into more, simpler sections instead |

Deeply nested structures are harder for merchants to navigate in the theme editor sidebar, and harder for you to work through when you're debugging. Nest blocks because the design genuinely needs a flexible container, not just because you can.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Always include at least one `presets` entry on every theme block. A block with no preset just silently fails to appear. There's no error message, which makes it easy to miss during testing. | **Forgetting `presets` on a new theme block**, then wondering why it doesn't show up anywhere in the editor. |
| Restrict a section's `blocks` array to specific types when the section has one clear purpose. Save `@theme` for containers that are genuinely general-purpose. | **Using `@theme` everywhere by default** instead of restricting sections to the specific blocks they're designed for. This lets merchants accidentally break layouts. |
| Keep nesting to 1-2 levels for most content. Treat 3+ levels as a sign to reconsider the design, not just a technical option you're free to use. | **Trying to pass a variable into a block like you would a snippet**, thinking in terms of `{% render_block %}`. Blocks only ever see `block` and `section`, never any data you pass in directly. |
| Always include `@app` alongside `@theme` (or alongside your specific block types) in any section where merchants might reasonably want to add a block from a third-party app. | **Defining blocks inline in a section's schema "because it's simpler for now."** This is the old Dawn-era pattern, and it locks that block to one section instead of letting you reuse it. |

## Key takeaways
- Blocks live in `/blocks`, are reusable across sections, and can nest inside each other.
- A section either defines blocks inline or accepts theme blocks, never both.
- `{% content_for 'blocks' %}` renders whatever blocks were added, in the order stored in the JSON template.
- Presets are what make a block appear in the editor's block picker at all.
- A block can't receive variables like a snippet can. It only sees `block` and `section`.
- Keep nesting to 1-2 levels for most content. Deeper nesting is a signal to reconsider the design.

## Further reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) (shopify.dev)
- [Theme block schema](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema) (shopify.dev)
- [Block targeting](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/targeting) (shopify.dev)
- [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) (shopify.dev)
