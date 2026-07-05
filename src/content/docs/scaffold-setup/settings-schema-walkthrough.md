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

### Choosing the right level

| Ask | If yes → |
|---|---|
| Should every page share this value with no per-instance variation? | Theme setting |
| Does this vary per section instance, but every block within it shares the same value? | Section setting |
| Does this vary per individual block instance? | Block setting |

```json
// ❌ WRONG — a brand color defined per-section means every banner,
// every testimonial, every footer independently "chooses" a brand color,
// creating inconsistency and a maintenance nightmare across dozens of sections
// sections/image-banner.liquid schema (excerpt)
{ "type": "color", "id": "brand_color", "label": "Brand color", "default": "#1a1a1a" }
```

```json
// ✅ RIGHT — one theme-wide setting, referenced everywhere via {{ settings.color_primary }}
// config/settings_schema.json (excerpt)
{ "type": "color", "id": "color_primary", "label": "t:settings_schema.colors.settings.primary.label", "default": "#1a1a1a" }
```

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

```json
// ❌ WRONG — hardcoded English, can't be localized for the theme editor UI
{ "type": "header", "content": "Colors" }

// ✅ RIGHT — pulls from locales/en.default.schema.json
{ "type": "header", "content": "t:settings_schema.colors.settings.header.content" }
```

```json
// locales/en.default.schema.json (excerpt)
{
  "settings_schema": {
    "colors": {
      "name": "Colors",
      "settings": {
        "header": { "content": "Color palette" },
        "primary": { "label": "Primary color" }
      }
    }
  }
}
```

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

### Why mixing these two up is a common mistake

```css
/* ❌ WRONG — using several individual CSS variables for what is really
   one cohesive "layout mode" choice. Easy for the variables to drift
   out of sync with each other as the theme evolves. */
.collection {
  display: var(--collection-display);
  gap: var(--collection-gap);
  grid-template-columns: var(--collection-columns);
}
```

```css
/* ✅ RIGHT — one class encapsulates the whole layout mode as a single,
   internally consistent unit */
.collection--full-width {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

If you find yourself adding a third or fourth CSS variable to control what's really one visual "mode," that's usually a sign it should collapse into a single `select` setting mapped to a CSS class instead.

## Best practices

- Ask "does this vary per instance, or is it shared everywhere?" before adding any new setting — it's a fast check that prevents most misplaced-setting bugs.
- Localize every schema string with `t:` from the moment you write it, not as a batch cleanup later.
- When a section/block accumulates more than 3–4 related CSS custom properties controlling what's really one visual mode, consider collapsing them into a `select` + CSS classes instead.

## Common mistakes

- **Defining the same conceptual setting (like a brand color) independently in multiple sections** instead of once at the theme level — this creates inconsistency and makes global rebrand changes painful.
- **Hardcoding schema label/content strings "temporarily"** and never circling back to localize them.
- **Overusing CSS custom properties for what should be a class-based variant setting**, leading to a tangle of variables that can be set in inconsistent combinations.

## Quick Reference

- Theme-wide → `config/settings_schema.json`. Per-instance → the section/block's own schema.
- Always localize schema strings with `t:` — never hardcode English.
- One CSS property changing → CSS variable. Several properties changing together → a CSS class via a `select` setting.

## Further Reading

- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) — the full deep dive on both files, including how they interact and what breaks a merchant's data
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) — mapping a design system onto exactly the settings this page describes
- [Settings schema](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) — shopify.dev
- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings) — shopify.dev
