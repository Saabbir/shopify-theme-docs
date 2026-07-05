---
title: Theme Blocks & Nesting
description: The headline architecture change since Dawn — blocks that contain blocks.
---

This is the single biggest difference between our theme and older Dawn-era themes. Understanding it well is worth the time.

## Old pattern vs. current pattern

**Old pattern (Dawn-era, don't write this today):** a section defined its own blocks inline, in the section's own schema. Those blocks could only ever be used inside that one section, and a block couldn't contain other blocks.

**Current pattern (what we write):** blocks live as their own files in `/blocks`, can be reused across any section, and can contain other blocks — up to several levels deep. A section either defines blocks locally, or opts into theme blocks — never both at once.

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

## Quick Reference

- Blocks live in `/blocks`, are reusable across sections, and can nest inside each other.
- A section either defines blocks inline OR accepts theme blocks — never both.
- `{% content_for 'blocks' %}` renders whatever blocks were added, in the order stored in the JSON template.
- Presets are what make a block appear in the editor's block picker at all.
- A block can't receive variables like a snippet can — it only sees `block` and `section`.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) — shopify.dev
- [Theme block schema](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema) — shopify.dev
- [Block targeting](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/targeting) — shopify.dev
- [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) — shopify.dev
