---
title: Theme Blocks & Nesting
description: The headline architecture change since Dawn — blocks that contain blocks.
---

This is the single biggest difference between our theme and older Dawn-era themes. Understanding it well is worth the time.

## Old pattern vs. current pattern

**Old pattern (Dawn-era, don't write this today):** a section defined its own blocks inline, in the section's own schema. Those blocks could only ever be used inside that one section, and a block couldn't contain other blocks.

**Current pattern (what we write):** blocks live as their own files in `/blocks`, can be reused across any section, and can contain other blocks — up to several levels deep. A section either defines blocks locally, or opts into theme blocks — never both at once.

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

- **Presets are required**, not optional, if you want merchants to actually see this block in the theme editor's block picker.
- A theme block references `block.settings` and the `section` object of whatever section rendered it — it **cannot** access variables from outside itself, and you can't pass it variables like you would a snippet.

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

`"type": "@theme"` means "accept any theme block." `"type": "@app"` means "accept app blocks too" — and Theme Store themes are required to accept `@app` blocks in specific sections (see [App Compatibility](/theme-store-requirements/app-compatibility/)). Use [block targeting](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/targeting) instead of `@theme` if you need to restrict which specific blocks a section accepts.

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

`@theme` is the right choice for genuinely general-purpose containers (a "Group" or "Row" layout block). For a section with one clear purpose, restrict its accepted block types explicitly.

## Nesting blocks inside blocks

A block becomes a container the same way a section does — give it its own `blocks` schema attribute and render `{% content_for 'blocks' %}` inside it:

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

That `Column` preset nests two `text` blocks inside a `group` block. This is exactly what merchants do visually in the theme editor when they drag one block inside another — you're just pre-assembling a common combination as a preset so they don't have to build it from scratch every time.

## How deep should nesting actually go?

Horizon's architecture supports several levels of nesting, but "supported" isn't the same as "a good idea everywhere." A useful rule of thumb:

| Nesting depth | When it's appropriate |
|---|---|
| 1 level (section → blocks) | Almost every section |
| 2 levels (section → group block → content blocks) | Layout containers — columns, grids, tabs |
| 3+ levels | Rare — usually a sign the design should be decomposed into more, simpler sections instead |

Deeply nested structures are harder for merchants to navigate in the theme editor sidebar, and harder for you to reason about when debugging. Nest because the design genuinely calls for a flexible container, not because it's technically possible.

## Best practices

- Always include at least one `presets` entry on every theme block — a block with no preset is a silent dead end, not an error, which makes it easy to miss in testing.
- Restrict a section's `blocks` array to specific types when it has one clear purpose; reserve `@theme` for genuinely general-purpose containers.
- Keep nesting to 1–2 levels for most content; treat 3+ levels of nesting as a signal to reconsider the design, not just a technical option.
- Always include `@app` alongside `@theme` (or alongside your specific block types) in any section where merchants might reasonably want to add a third-party app's block.

## Common mistakes

- **Forgetting `presets` on a new theme block** and then wondering why it doesn't show up anywhere in the editor.
- **Using `@theme` by default everywhere** instead of restricting sections to the specific blocks they're designed for, leading to layouts merchants can accidentally break.
- **Trying to pass a variable into a block like you would a snippet** (`{% render_block %}`-style thinking) — blocks only ever see `block` and `section`, never arbitrary passed-in data.
- **Defining blocks inline in a section's schema "because it's simpler for now"** — this is the Dawn-era pattern, and it locks that block to one section instead of being reusable.

## Quick Reference

- Blocks live in `/blocks`, are reusable across sections, and can nest inside each other.
- A section either defines blocks inline OR accepts theme blocks — never both.
- `{% content_for 'blocks' %}` renders whatever blocks were added, in the order stored in the JSON template.
- Presets are what make a block appear in the editor's block picker at all.
- A block can't receive variables like a snippet can — it only sees `block` and `section`.
- Keep nesting to 1–2 levels for most content; deeper nesting is a signal to reconsider the design.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) — shopify.dev
- [Theme block schema](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema) — shopify.dev
- [Block targeting](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/targeting) — shopify.dev
- [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) — shopify.dev
