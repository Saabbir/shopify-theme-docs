---
title: Schema.json Best Practices
description: Writing settings that merchants can actually understand and use.
---

Shopify reviews your `{% schema %}` blocks for merchant usability, not just technical correctness. Here's what they check.

## Wording rules

| Use this | Not this | Why |
|---|---|---|
| "Logo position on large screens" with options "Middle left," "Top left" | "Position 1," "Position 2" | Numbered options force merchants to guess |
| "Horizontal position" | "X position" | Plain language over technical jargon |
| "Button label" | "CTA label" | No unexplained jargon |
| "Use a custom logo" | "Use a custom logo?" | Declarative, not a question |
| American spelling: "color," "customize," "center" | "colour," "customise," "centre" | Shopify requires American English |

Other rules: sentence case for section/preset names (only capitalize the first word and proper nouns), no ampersands, active voice, every button/action starts with a verb, and don't repeat the section's subject in every setting name ("Slideshow," "Slideshow color," "Slideshow image" → just "Color," "Image").

## Color system

- Minimum 4 color settings.
- Every background color setting needs a matching foreground/text color setting, so merchants can't accidentally create unreadable combinations.
- Use `"type": "color"` — never a free-text field for colors.

## Font picker

- Use `"type": "font_picker"` for every font setting.
- Set a real default (e.g. `"default": "work_sans_n6"`), never leave it unset.
- Only use [currently available fonts](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts) — no custom font uploads.
- Load bold/italic/bold-italic variants with the `font_modify` filter so weight/style settings actually work.

## General settings hygiene

- Every setting needs a `label`.
- `link_list` settings in the header/footer must default to `main-menu`/`footer` respectively — a blank default breaks navigation on install.
- Default values for resource settings (a product, a metaobject) must point at something that will actually exist on every store — never a resource that only exists in your demo store.
- Include a `theme_info` block in `config/settings_schema.json`.

## Example: a well-written setting

```json
{
  "type": "select",
  "id": "logo_position",
  "label": "Logo position on large screens",
  "options": [
    { "value": "left", "label": "Top left" },
    { "value": "center", "label": "Top center" }
  ],
  "default": "left"
}
```

## Quick Reference

- American English, sentence case, declarative statements, active voice, verbs on buttons.
- At least 4 colors, each with a paired foreground color.
- Font settings: `font_picker` type, a real default, an available font, `font_modify` for variants.
- Every setting has a `label`; every resource default actually exists on a fresh store.

## Further Reading

- [Settings requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#14-settings) — shopify.dev
- [Settings schema reference](https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json) — shopify.dev
