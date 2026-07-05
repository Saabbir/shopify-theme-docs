---
title: Schema.json Best Practices
description: Writing settings that merchants can actually understand and use.
---

Shopify reviews your `{% schema %}` blocks for merchant usability, not just technical correctness. Here's what they check.

## Wording rules

| ✅ Use this | ❌ Not this | Why |
|---|---|---|
| "Logo position on large screens" with options "Middle left," "Top left" | "Position 1," "Position 2" | Numbered options force merchants to guess |
| "Horizontal position" | "X position" | Plain language over technical jargon |
| "Button label" | "CTA label" | No unexplained jargon |
| "Use a custom logo" | "Use a custom logo?" | Declarative, not a question |
| American spelling: "color," "customize," "center" | "colour," "customise," "centre" | Shopify requires American English |
| "Color" (inside a "Slideshow" section) | "Slideshow color" (repeating the subject) | Don't repeat the section's subject in every setting name |

Other rules: sentence case for section/preset names (only capitalize the first word and proper nouns), no ampersands, active voice, every button/action starts with a verb.

### A full before/after

```json
// ❌ WRONG — questions instead of statements, jargon, numbered options, ampersand
{
  "type": "checkbox",
  "id": "show_price",
  "label": "Show price & compare-at price?"
},
{
  "type": "select",
  "id": "layout",
  "label": "Layout Option",
  "options": [
    { "value": "1", "label": "Layout 1" },
    { "value": "2", "label": "Layout 2" }
  ]
}

// ✅ RIGHT — declarative, plain language, descriptive option labels
{
  "type": "checkbox",
  "id": "show_compare_at_price",
  "label": "Show compare-at price",
  "default": true
},
{
  "type": "select",
  "id": "layout",
  "label": "Layout",
  "options": [
    { "value": "grid", "label": "Grid" },
    { "value": "list", "label": "List" }
  ]
}
```

## Color system

| ✅ Do | ❌ Don't |
|---|---|
| Include at least 4 color settings | Ship with only 1–2 colors, forcing merchants into a narrow palette |
| Pair every background color with a foreground/text color setting | A background color with no corresponding text color control, risking unreadable combinations |
| Use `"type": "color"` | A free-text field for entering hex codes |

## Font picker

| ✅ Do | ❌ Don't |
|---|---|
| Use `"type": "font_picker"` for every font setting | A `select` or free-text setting for choosing a typeface |
| Set a real default (e.g. `"default": "work_sans_n6"`) | Leave the default unset, showing an empty picker on install |
| Only use [currently available fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts) | Reference a custom-uploaded or discontinued font in a default/preset |
| Load bold/italic/bold-italic variants with `font_modify` | Assume a font's variants load automatically without the filter |

## General settings hygiene

| ✅ Do | ❌ Don't |
|---|---|
| Give every setting a `label` | Ship a setting with no label (fails review outright) |
| Default `link_list` settings in header/footer to `main-menu`/`footer` | Leave them blank, breaking navigation on a fresh install |
| Point resource-setting defaults (product, metaobject) at something that exists on every store | Default to a resource that only exists in your demo store |
| Include a `theme_info` block in `config/settings_schema.json` | Omit `theme_info` entirely |

## Example: a well-written setting, start to finish

```json
{
  "name": "t:settings_schema.colors.name",
  "settings": [
    {
      "type": "header",
      "content": "t:settings_schema.colors.settings.header.content"
    },
    {
      "type": "color",
      "id": "color_background",
      "label": "t:settings_schema.colors.settings.background.label",
      "default": "#FFFFFF"
    },
    {
      "type": "color",
      "id": "color_foreground",
      "label": "t:settings_schema.colors.settings.foreground.label",
      "default": "#1A1A1A"
    },
    {
      "type": "select",
      "id": "logo_position",
      "label": "t:settings_schema.header.settings.logo_position.label",
      "options": [
        { "value": "left", "label": "t:settings_schema.header.settings.logo_position.options.left" },
        { "value": "center", "label": "t:settings_schema.header.settings.logo_position.options.center" }
      ],
      "default": "left"
    }
  ]
}
```

Notice every string is a `t:` locale key, the color settings are paired (background + foreground), and the `select` options use descriptive values, not numbers.

## Best practices

- Write schema labels the way you'd explain the setting out loud to a non-technical merchant, then convert that into sentence case with a verb where relevant.
- Route every schema string through a locale key from the start — retrofitting localization across a large schema file later is tedious and error-prone.
- When adding a new color setting, immediately add its paired foreground/text color setting in the same PR, not as a follow-up.

## Common mistakes

- **Phrasing settings as questions** ("Show price?") instead of declarative statements ("Show price").
- **Using numbered options** ("Layout 1," "Layout 2") instead of descriptive labels a merchant can understand without trial and error.
- **Adding a background color without a paired foreground color**, which risks unreadable text/background combinations a merchant could accidentally create.
- **Hardcoding English strings "temporarily" and forgetting to localize them** before submission.

## Quick Reference

- American English, sentence case, declarative statements, active voice, verbs on buttons.
- At least 4 colors, each with a paired foreground color.
- Font settings: `font_picker` type, a real default, an available font, `font_modify` for variants.
- Every setting has a `label`; every resource default actually exists on a fresh store.

## Further Reading

- [Settings requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#14-settings) — shopify.dev
- [Settings schema reference](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) — shopify.dev
