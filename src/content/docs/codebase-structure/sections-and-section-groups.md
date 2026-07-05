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

```liquid
{% comment %} ❌ WRONG — hardcoded directly into the layout file. This
   passes a casual glance but fails Theme Store review, and merchants
   can't reorder or remove the announcement bar without editing code. {% endcomment %}
<body>
  {% section 'announcement-bar' %}
  {% section 'header' %}
  {{ content_for_layout }}
  {% section 'footer' %}
</body>
```

```liquid
{% comment %} ✅ RIGHT — rendered through section groups, so merchants
   get full add/remove/reorder control in the theme editor. {% endcomment %}
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

### A worked example: designing Solis's footer

Say Solis's footer needs: a newsletter signup, a multi-column link menu, and social icons — and the merchant should be able to reorder or remove any of the three independently.

```json
// ✅ RIGHT — sections/footer-group.json
{
  "type": "footer",
  "sections": {
    "footer-menu": { "type": "footer-menu" },
    "newsletter": { "type": "newsletter" },
    "footer-social": { "type": "footer-social" }
  },
  "order": ["footer-menu", "newsletter", "footer-social"]
}
```

Each of those three is its own section file (`sections/footer-menu.liquid`, etc.), independently addable/removable/reorderable through the group. Compare that to cramming all three into one giant `footer.liquid` section — technically simpler to write, but merchants lose the ability to remove just the newsletter signup without losing the whole footer.

## Best practices

- Default to section groups for header and footer from the very first commit — retrofitting this after `theme.liquid` has grown organically is a bigger refactor than starting correctly.
- Split a "kitchen sink" section (one file doing three unrelated jobs) into multiple smaller sections inside a section group whenever merchants would plausibly want to control each piece independently.
- Keep the `order` array in a section group JSON file in sync with the actual visual order — a mismatch is a subtle bug that's easy to miss in review.

## Common mistakes

- **Hardcoding the header/footer directly into `theme.liquid`** because it feels simpler during early development — this is an explicit Theme Store rejection reason, not just a style preference.
- **Building one large section that does several jobs** (menu + newsletter + social in one file) instead of letting merchants control each piece independently via a section group.
- **Forgetting to update the `order` array** when adding a new section to an existing group, so the new section renders but not where expected.

## Quick Reference

- Sections are the page-content unit; section groups manage sections within header/footer.
- Header and footer must use section groups — hardcoding them into `theme.liquid` fails Theme Store review.
- `{% sections 'group-name' %}` renders a section group from the layout file.
- Split "kitchen sink" sections into smaller ones inside a group when merchants would want independent control.

## Further Reading

- [Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) — shopify.dev
- [Section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups) — shopify.dev
