---
title: Sections & Section Groups
description: The difference between a section and a section group, and why headers and footers are special.
---

**TL;DR:** The difference between a section and a section group, and why headers and footers are special.

## Sections

A section is a Liquid file that includes a `{% schema %}` block. That schema is what lets merchants add, remove, reorder, and configure the section from the theme editor. Any JSON template can include as many sections as it needs.

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

A section group is a JSON file. It lets merchants add, remove, and reorder **sections** within one specific area of the layout, most often the header and footer. Shopify has a clear rule for the Theme Store here: **header and footer sections must be rendered inside section groups**, not hardcoded directly into `theme.liquid`.

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

Let's say Solis's footer needs three things: a newsletter signup, a multi-column link menu, and social icons. The merchant should be able to reorder or remove any of the three on their own.

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

Each of those three pieces is its own section file (`sections/footer-menu.liquid`, and so on). Each one can be added, removed, or reordered on its own through the group. Compare that to cramming all three into one giant `footer.liquid` section. That single file is technically simpler to write, but merchants lose the ability to remove just the newsletter signup without losing the whole footer.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use section groups for the header and footer from your very first commit. Adding this later, after `theme.liquid` has already grown on its own, is a much bigger job than starting correctly. | **Hardcoding the header or footer directly into `theme.liquid`** because it feels simpler early on. This is an explicit reason for Theme Store rejection, not just a style preference. |
| Split a "kitchen sink" section (one file doing three unrelated jobs) into several smaller sections inside a section group, whenever merchants would reasonably want to control each piece on its own. | **Building one large section that does several jobs** (menu, newsletter, and social all in one file) instead of letting merchants control each piece on its own through a section group. |
| Keep the `order` array in a section group JSON file matching the actual visual order. A mismatch is a subtle bug that's easy to miss during review. | **Forgetting to update the `order` array** when you add a new section to an existing group. The new section still renders, just not where you expect it to. |

## Key takeaways
- A section is the basic unit of page content. A section group manages sections within the header or footer.
- Header and footer must use section groups. Hardcoding them into `theme.liquid` fails Theme Store review.
- `{% sections 'group-name' %}` renders a section group from the layout file.
- Split "kitchen sink" sections into smaller ones inside a group when merchants would want independent control.

## Further reading

- [Sections](https://shopify.dev/docs/storefronts/themes/architecture/sections) (shopify.dev)
- [Section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups) (shopify.dev)
