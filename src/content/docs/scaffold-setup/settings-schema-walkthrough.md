---
title: Settings Schema Walkthrough
description: Theme-level settings vs. section/block settings, and when to use which.
---

Shopify has three separate places where settings can live. Mixing them up is a common mistake even for experienced theme developers moving between projects, so here's how we draw the line on Solis.

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
{ "type": "color", "id": "color_primary", "label": "t:labels.color_primary", "default": "#1a1a1a" }
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
    "name": "t:general.colors",
    "settings": [
      { "type": "header", "content": "t:labels.colors_heading" },
      { "type": "color", "id": "color_primary", "label": "t:labels.color_primary", "default": "#1a1a1a" }
    ]
  }
]
```

You can access this setting anywhere in Liquid through the `settings` object, like this: `{{ settings.color_primary }}`. The `theme_info` block is required by Theme Store review (see [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/)).

Notice the strings that start with `t:`. These pull text from `locales/en.default.schema.json` instead of hardcoding English words directly, so the theme editor's interface can be translated into other languages. Use this `t:` pattern for every label and content string in your schema, not just some of them.

```json
// ❌ WRONG — hardcoded English, can't be localized for the theme editor UI
{ "type": "header", "content": "Colors" }

// ✅ RIGHT — pulls from locales/en.default.schema.json
{ "type": "header", "content": "t:labels.colors_heading" }
```

```json
// locales/en.default.schema.json (excerpt)
{
  "general": {
    "colors": "Colors"
  },
  "labels": {
    "colors_heading": "Color palette",
    "color_primary": "Primary color"
  }
}
```

:::note[Flat, not nested]
This is a **flat, shared** namespace (`general.*`, `labels.*`). It isn't nested per group, the way `settings_schema.colors.settings.primary` would be. This matches how Skeleton Theme actually ships its `settings_schema.json` and `en.default.schema.json` files. See the [Complete Worked Example](/codebase-structure/complete-worked-example/) for the full reasoning. A label like "Heading" or "Primary color" gets reused across dozens of unrelated settings groups, so nesting it per group would mean translating the same word over and over again.
:::

## Single-property vs. multi-property settings

Skeleton Theme's own rules (worth following) draw a clear line between two situations.

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

If you find yourself adding a third or fourth CSS variable to control what's really one visual "mode," that's usually a sign. It means you should combine them into a single `select` setting mapped to a CSS class instead.

## Best practices

- Before you add a new setting, ask yourself: "Does this vary per instance, or is it shared everywhere?" This one quick check prevents most setting-placement mistakes.
- Add the `t:` prefix to every schema string as you write it, not as a cleanup job later.
- When a section or block builds up more than 3 to 4 related CSS custom properties that all control one visual mode, consider combining them into a `select` setting with CSS classes instead.

## Common mistakes

- **Defining the same setting (like a brand color) separately in multiple sections** instead of once at the theme level. This creates inconsistency and makes it painful to rebrand the whole store later.
- **Hardcoding schema label/content strings "temporarily"** and never coming back to add the `t:` prefix.
- **Overusing CSS custom properties for something that should be a class-based variant setting.** This leads to a tangle of variables that can end up set in combinations that don't make sense together.

## Quick Reference

- Theme-wide settings go in `config/settings_schema.json`. Per-instance settings go in the section or block's own schema.
- Always add `t:` to schema strings. Never hardcode English text.
- One CSS property changing means use a CSS variable. Several properties changing together means use a CSS class via a `select` setting.

## Further Reading

- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/): the full deep dive on both files, including how they interact and what breaks a merchant's data
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/): mapping a design system onto exactly the settings this page describes
- [Settings schema](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json): shopify.dev
- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings): shopify.dev
