---
title: Sections & Section Groups
description: The difference between a section and a section group, and why headers/footers are special.
---

## Sections

A section is a Liquid file with a `{% schema %}` block that merchants can add, remove, reorder, and configure from the theme editor. Any JSON template can include any number of sections.

```liquid
{% comment %} /sections/image-banner.liquid {% endcomment %}
<div class="image-banner color-{{ section.settings.color_scheme }}">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Image banner",
  "settings": [
    { "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" }
  ],
  "blocks": [{ "type": "@theme" }],
  "presets": [{ "name": "Image banner" }]
}
{% endschema %}
```

## Section groups

Section groups are JSON files that let merchants add, remove, and reorder **sections** within a specific area of the layout — most commonly the header and footer. Our Theme Store requirement here is explicit: **header and footer sections must be rendered inside section groups**, not hardcoded directly into `theme.liquid`.

```json
// sections/header-group.json
{
  "type": "header",
  "sections": {
    "announcement-bar": { "type": "announcement-bar" },
    "main-header": { "type": "header" }
  },
  "order": ["announcement-bar", "main-header"]
}
```

```liquid
{% comment %} layout/theme.liquid %}
<body>
  {% sections 'header-group' %}
  {{ content_for_layout }}
  {% sections 'footer-group' %}
</body>
```

## Section vs. section group vs. block — the quick test

| If it... | Use |
|---|---|
| Is a whole page-width piece of content a merchant adds to a template | Section |
| Needs to live in the header or footer area and be independently reordered | Section group |
| Is a smaller reusable piece inside a section | Block |

## Quick Reference

- Sections are the page-content unit; section groups manage sections within header/footer.
- Header and footer must use section groups — hardcoding them into `theme.liquid` fails Theme Store review.
- `{% sections 'group-name' %}` renders a section group from the layout file.

## Further Reading

- [Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) — shopify.dev
- [Section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups) — shopify.dev
