---
title: Settings Schema Walkthrough
description: Theme-level settings vs. section/block settings, and when to use which.
---

Shopify has three separate places settings can live. Mixing them up is a common early mistake.

## The three levels

| Level | File | Scope | Example |
|---|---|---|---|
| Theme | `config/settings_schema.json` | Every page, set once in "Theme settings" | Brand color palette, base font |
| Section | Inside the section's own `{% schema %}` | That section instance only | A banner's heading text |
| Block | Inside the block's own `{% schema %}` | That block instance only | One quote's author name |

## Theme settings

```json
// config/settings_schema.json (excerpt)
[
  {
    "name": "theme_info",
    "theme_name": "Solis",
    "theme_author": "Your Company",
    "theme_version": "1.0.0",
    "theme_documentation_url": "https://example.com/docs",
    "theme_support_url": "https://example.com/support"
  },
  {
    "name": "t:settings_schema.colors.name",
    "settings": [
      { "type": "header", "content": "t:settings_schema.colors.settings.header.content" },
      { "type": "color", "id": "color_primary", "label": "t:settings_schema.colors.settings.primary.label", "default": "#1a1a1a" }
    ]
  }
]
```

Access it anywhere in Liquid via the `settings` object: `{{ settings.color_primary }}`. The `theme_info` block is required by Theme Store review (see [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/)).

Notice the `t:` prefixed strings — those pull from `locales/en.default.schema.json` instead of hardcoding English text, so the theme editor UI itself can be translated. Use this for every label and content string in schema, not just some of them.

## Single-property vs. multi-property settings

Skeleton Theme's own conventions (worth following) draw a clear line:

```liquid
{% comment %} A setting that maps to ONE CSS property → use a CSS variable {% endcomment %}
<div class="collection" style="--gap: {{ block.settings.gap }}px">
  {% content_for 'blocks' %}
</div>
{% stylesheet %}
  .collection { gap: var(--gap); }
{% endstylesheet %}
{% schema %}
{ "settings": [{ "type": "range", "id": "gap", "label": "Gap", "min": 0, "max": 100, "unit": "px", "default": 16 }] }
{% endschema %}
```

```liquid
{% comment %} A setting that changes MULTIPLE properties at once → use a CSS class, not several variables {% endcomment %}
<div class="collection {{ block.settings.layout }}">
  {% content_for 'blocks' %}
</div>
{% stylesheet %}
  .collection--full-width { /* several properties */ }
  .collection--narrow { /* several different properties */ }
{% endstylesheet %}
{% schema %}
{ "settings": [{ "type": "select", "id": "layout", "label": "Layout", "values": [
  { "value": "collection--full-width", "label": "Full width" },
  { "value": "collection--narrow", "label": "Narrow" }
] }] }
{% endschema %}
```

## Quick Reference

- Theme-wide → `config/settings_schema.json`. Per-instance → the section/block's own schema.
- Always localize schema strings with `t:` — never hardcode English.
- One CSS property changing → CSS variable. Several properties changing together → a CSS class via a `select` setting.

## Further Reading

- [Settings schema](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) — shopify.dev
- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings) — shopify.dev
