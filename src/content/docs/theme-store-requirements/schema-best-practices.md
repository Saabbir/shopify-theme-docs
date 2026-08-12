---
title: Schema.json Best Practices
description: Writing settings that merchants can actually understand and use.
---

**TL;DR:** Writing settings that merchants can actually understand and use.

Shopify doesn't just check whether your code works. Reviewers also check whether merchants can understand your settings without guessing. This review focuses on your `{% schema %}` block. Here's what reviewers look for.

## Wording rules

| ✅ Use this | ❌ Not this | Why |
|---|---|---|
| "Logo position on large screens" with options "Middle left," "Top left" | "Position 1," "Position 2" | Numbered options force merchants to guess what each one means |
| "Horizontal position" | "X position" | Plain words are easier to understand than technical terms |
| "Button label" | "CTA label" | Don't use terms merchants won't recognize |
| "Use a custom logo" | "Use a custom logo?" | Write it as a statement, not a question |
| American spelling: "color," "customize," "center" | "colour," "customise," "centre" | Shopify requires American English spelling |
| "Color" (inside a "Slideshow" section) | "Slideshow color" (repeating the subject) | Don't repeat the section's name inside every setting name |

A few more rules to keep in mind:

- Use sentence case for section and preset names: only capitalize the first word and any proper nouns.
- Don't use ampersands (the `&` symbol). Spell out "and" instead.
- Write in active voice, where the subject does the action, instead of passive voice.
- Start every button or action label with a verb, like "Show" or "Add."

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

Color settings have their own dedicated rules, at least 4 color settings, every background paired with a foreground/text setting, and always `"type": "color"` instead of free text. See [Colors](/colors/) for the full section, and specifically [Color Schemes](/colors/color-schemes/#the-theme-stores-minimum-color-settings-rule) for this exact rule in detail.

## Font picker

Font settings have their own dedicated rules too: always `"type": "font_picker"` with a real default, only currently available fonts, and `font_modify` for bold/italic variants instead of assuming they load automatically. See [Fonts](/fonts/) for the full section, and specifically [Font Settings](/fonts/font-settings/) for the setting-level rules and [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/) for `font_modify`.

## General settings hygiene

| ✅ Do | ❌ Don't |
|---|---|
| Give every setting a `label` | Ship a setting with no label. This fails review right away |
| Default `link_list` settings in header/footer to `main-menu`/`footer` | Leave them blank. This breaks navigation on a brand new store |
| Point resource-setting defaults (product, metaobject) at something that exists on every store | Default to a resource that only exists in your demo store |
| Include a `theme_info` block in `config/settings_schema.json` | Leave out `theme_info` completely |

## Example: a well-written setting, start to finish

```json
{
  "name": "t:general.colors",
  "settings": [
    {
      "type": "header",
      "content": "t:labels.colors_heading"
    },
    {
      "type": "color",
      "id": "color_background",
      "label": "t:labels.color_background",
      "default": "#FFFFFF"
    },
    {
      "type": "color",
      "id": "color_foreground",
      "label": "t:labels.color_foreground",
      "default": "#1A1A1A"
    },
    {
      "type": "select",
      "id": "logo_position",
      "label": "t:labels.logo_position",
      "options": [
        { "value": "left", "label": "t:options.left" },
        { "value": "center", "label": "t:options.center" }
      ],
      "default": "left"
    }
  ]
}
```

Notice three things in this example. Every string uses a `t:` locale key. The color settings come in a pair: background and foreground. And the `select` options use words like "left" and "center" instead of numbers.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Write schema labels the way you'd explain the setting out loud to a merchant with no coding background. Then turn that into sentence case, adding a verb where it makes sense. | **Phrasing settings as questions** ("Show price?") instead of plain statements ("Show price"). |
| Route every schema string through a locale key from the start. Adding translations to a large schema file later is slow and easy to get wrong. | **Using numbered options** ("Layout 1," "Layout 2") instead of descriptive labels merchants can understand without trial and error. |
| When you add a new color setting, add its matching foreground or text color setting in the same pull request. Don't leave it for later. | **Adding a background color without a matching foreground color.** This risks text and background combinations that are hard to read. |
| — | **Hardcoding English text "temporarily" and forgetting to translate it** before submission. |

## Key takeaways
- American English, sentence case, plain statements (not questions), active voice, verbs on buttons.
- At least 4 colors, each with a matching foreground color. See [Colors](/colors/).
- Font settings: use `font_picker`, set a real default, pick an available font, and use `font_modify` for variants. See [Fonts](/fonts/).
- Every setting has a `label`, and every resource default actually exists on a brand new store.

## Further reading

- [Colors](/colors/), the dedicated section for color settings rules, tokens, and accessibility
- [Fonts](/fonts/), the dedicated section for font settings rules, the type scale, and typography in code
- [Settings requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#14-settings) (shopify.dev)
- [Settings schema reference](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) (shopify.dev)
