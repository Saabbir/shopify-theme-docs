---
title: "Figma Tokens → Theme Settings"
description: Taking a Figma variable collection and turning it into settings_schema.json entries and CSS custom properties, correctly.
---

A Figma file's **Variables** panel (colors, spacing, type, radii, organized into collections and modes) is the actual source of truth for a theme's design tokens — not a developer's eyeballed read of the canvas. This article is the concrete mapping from "what's in Figma" to "what's in the theme."

## Step 1: identify what's actually a token vs. a one-off value

Not everything in a Figma file is a token. A token is a value that's reused deliberately and named as a decision, not a coincidence:

| In Figma | Is it a token? |
|---|---|
| A color used across 12 components, named `brand/primary` in the Variables panel | Yes — a real token |
| A one-off dark overlay opacity used on a single hero image | No — a local, component-specific value; don't manufacture a global token for it |
| A spacing value that happens to be `24px` in three unrelated places by coincidence, not by design intent | Maybe — check with design whether this is intentional (a real `space-md` token) or coincidental before promoting it |

Pulling every numeric value out of Figma's inspector and turning it into a token produces a bloated, meaningless token list. Pull from the **Variables panel** specifically — that's where a designer has already made the "this is a reusable decision" call.

## Step 2: map Figma collections/modes to theme setting groups

Figma organizes variables into **collections** (e.g. "Colors," "Spacing," "Type") and **modes** within a collection (e.g. a "Light"/"Dark" mode within "Colors"). Map this structure directly onto `config/settings_schema.json` groups:

| Figma structure | Theme equivalent |
|---|---|
| Collection: "Colors," Variable: `brand/primary` | A `color` setting: `id: "color_primary"` in a "Colors" schema group |
| Collection: "Colors," Mode: "Dark" | A `color_scheme_group` / `color_scheme` setting, or a merchant-facing dark-mode toggle, depending on whether dark mode is a Theme Store color scheme or a persistent site mode |
| Collection: "Spacing," Variable: `space/md` | Either a fixed CSS custom property (if not merchant-editable) or a `range` setting, per the single-vs-multi-property rule below |
| Collection: "Type," Variable: `heading/size-lg` | A `font_picker` + `range` size setting, or a fixed CSS custom property if the type scale isn't meant to be merchant-adjustable |

### A worked example: mapping a Figma color collection

Say Figma has a "Colors" collection with these variables: `brand/primary` (#1a5f4f), `brand/secondary` (#e8b04b), `text/body` (#1a1a1a), `surface/background` (#ffffff).

```json
// config/settings_schema.json (excerpt)
{
  "name": "t:general.colors",
  "settings": [
    { "type": "header", "content": "t:labels.colors_heading" },
    { "type": "color", "id": "color_primary", "label": "t:labels.color_primary", "default": "#1a5f4f" },
    { "type": "color", "id": "color_secondary", "label": "t:labels.color_secondary", "default": "#e8b04b" },
    { "type": "color", "id": "color_text", "label": "t:labels.color_text", "default": "#1a1a1a" },
    { "type": "color", "id": "color_background", "label": "t:labels.color_background", "default": "#ffffff" }
  ]
}
```

```css
/* assets/base.css — generated once from settings, referenced everywhere */
:root {
  --color-primary: {{ settings.color_primary }};
  --color-secondary: {{ settings.color_secondary }};
  --color-text: {{ settings.color_text }};
  --color-background: {{ settings.color_background }};
}
```

Name the setting `id` after the token's *role* (`color_primary`), matching Figma's variable name (`brand/primary`) conceptually — not after its current hex value. See [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) for the full naming discipline.

## Step 3: decide merchant-editable vs. fixed, per token

Not every design token should become a merchant-facing setting — some are fixed brand decisions the merchant shouldn't be able to break:

| Token type | Typically merchant-editable? | Why |
|---|---|---|
| Brand colors (primary, secondary, accent) | Yes | Merchants reasonably want to adjust brand colors without a developer |
| Semantic colors (error, success, sale-price) | Sometimes | Often fixed for consistency with platform conventions (e.g. a red "sold out" badge merchants shouldn't accidentally make green) |
| Spacing scale | Rarely | Usually a fixed design decision — exposing 6 spacing values as settings often adds merchant confusion without real benefit |
| Type scale | Sometimes | A `font_picker` is standard; exposing every individual size in the scale as a separate setting is usually overkill |
| Component-specific one-off values | No | These aren't tokens — they're implementation details, see Step 1 |

## Step 4: color functions — using Liquid's color filters instead of hardcoding derived values

Shopify's Liquid color filters compute derived colors (a hover state, a tint, a shade) from a single merchant-set color, so you don't need a separate setting for every shade:

```liquid
{% comment %} ❌ WRONG — a separate setting for the hover state,
   which can drift out of sync with the base color if a merchant
   updates one but not the other {% endcomment %}
{{ settings.color_primary }}
{{ settings.color_primary_hover }}

{% comment %} ✅ RIGHT — one setting, computed derived values {% endcomment %}
{%- assign color_primary_hover = settings.color_primary | color_darken: 10 -%}
```

```css
:root {
  --color-primary: {{ settings.color_primary }};
  --color-primary-hover: {{ settings.color_primary | color_darken: 10 }};
  --color-primary-tint: {{ settings.color_primary | color_lighten: 40 }};
}
```

Available color filters include `color_darken`, `color_lighten`, `color_mix`, `color_modify`, `color_saturate`, `color_brightness`, and conversions `color_to_hex`/`color_to_hsl`/`color_to_rgb`/`color_to_oklch` — reach for these instead of asking a merchant to separately configure every derived shade.

## Step 5: keeping Figma and the theme in sync as the design evolves

Design tokens drift from implementation the moment someone updates a Figma variable without updating the corresponding setting default, or vice versa. A few habits that prevent this:

- Treat a Figma variable rename as a signal to check whether the corresponding setting `id`/label needs a matching update (not necessarily the `id` itself — see [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) on why setting IDs shouldn't casually change).
- If your team maintains **Figma Code Connect** (see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/)), link token-consuming components so an AI tool or developer can trace a component back to its Figma source quickly.
- When a design review changes a token's value (not just a component's local styling), update the setting's *default* in `settings_data.json`'s preset definitions (see [Managing Presets](/design-system/managing-presets/)) — not just the schema default, which only affects fresh installs.

## Best practices

- Pull tokens from Figma's Variables panel specifically, not by eyeballing values off the canvas — the Variables panel is where "this is a reusable decision" has already been decided by design.
- Use Liquid's color filters (`color_darken`, `color_mix`, etc.) to derive related shades from one merchant setting, instead of a separate setting per derived value.
- Decide merchant-editable vs. fixed per token deliberately (Step 3's table), not as a blanket "expose everything" or "expose nothing" policy.

## Common mistakes

- **Manufacturing a token from a coincidental repeated value** that wasn't actually a deliberate design decision, bloating the settings schema with meaningless options.
- **Exposing every derived shade as its own setting** instead of computing it with a color filter, creating settings that can drift out of sync with each other.
- **Naming a setting after Figma's current value** instead of its role, so the name becomes misleading the moment the design changes.

## Quick Reference

- Tokens come from Figma's Variables panel, not the canvas — that's where "reusable decision" has already been made.
- Map collections/modes to settings schema groups; decide merchant-editable vs. fixed per token type.
- Use color filters (`color_darken`, `color_mix`, etc.) to derive shades instead of separate settings.
- Keep Figma and the theme in sync deliberately — a renamed variable or changed value is a prompt to check the corresponding setting, not something that syncs automatically.

## Further Reading

- [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) — pulling this same design data directly into an AI coding tool
- [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) — the token architecture and naming discipline this article assumes
- [Liquid color filters](https://shopify.dev/docs/api/liquid/filters/color-filters) — shopify.dev
