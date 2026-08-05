---
title: "Figma Tokens → Theme Settings"
description: How to take a Figma variable collection and turn it into settings_schema.json entries and CSS custom properties, the right way.
---

A Figma file has a **Variables** panel. It holds colors, spacing, type, and radii, all organized into collections and modes. This panel is the real source of truth for a theme's design tokens, not a developer's guess based on looking at the design canvas.

This article shows you the exact mapping from "what's in Figma" to "what's in the theme."

## Step 1: identify what's actually a token vs. a one-off value

Not everything in a Figma file is a token. A token is a value that's reused on purpose, and named because it represents a real design decision, not just because it happens to repeat by coincidence:

| In Figma | Is it a token? |
|---|---|
| A color used across 12 components, named `brand/primary` in the Variables panel | Yes, this is a real token |
| A one-off dark overlay opacity used on a single hero image | No, it's a local, component-specific value. Don't create a global token for it |
| A spacing value that happens to be `24px` in three unrelated places by coincidence, not by design intent | Maybe. Check with design whether this is intentional (a real `space-md` token) or just a coincidence, before turning it into a token |

If you pull every single number out of Figma's inspector panel and turn it into a token, you'll end up with a long, meaningless token list that nobody can use well. Instead, pull tokens from the **Variables panel** specifically. That's the place where a designer has already decided, "this is a reusable value."

## Step 2: map Figma collections/modes to theme setting groups

Figma organizes variables into **collections**, like "Colors," "Spacing," or "Type." Inside each collection, there can be **modes**, like a "Light" and "Dark" mode inside the "Colors" collection.

Map this structure directly onto groups in `config/settings_schema.json`:

| Figma structure | Theme equivalent |
|---|---|
| Collection: "Colors," Variable: `brand/primary` | A key (`primary`) in a `color_palette` setting, see the worked example below and [Color Palettes](/design-system/color-palettes/) |
| Collection: "Colors," Mode: "Dark" | A `color_scheme_group` / `color_scheme` setting, or a merchant-facing dark-mode toggle, depending on whether dark mode is a Theme Store color scheme or a permanent site mode |
| Collection: "Spacing," Variable: `space/md` | Either a fixed CSS custom property (if not merchant-editable) or a `range` setting, following the rule below |
| Collection: "Type," Variable: `heading/size-lg` | A `font_picker` plus a `range` size setting, or a fixed CSS custom property if the type scale isn't meant to be adjustable by merchants |

### A worked example: mapping a Figma color collection

Let's walk through an example. Say Figma has a "Colors" collection with these variables: `brand/primary` (#1a5f4f), `brand/secondary` (#e8b04b), `text/body` (#1a1a1a), and `surface/background` (#ffffff).

Map the whole collection onto **one `color_palette` setting**, instead of creating a separate `color` setting for each variable. This is the current recommended approach. See [Color Palettes](/design-system/color-palettes/) for the full picture:

```json
// config/settings_schema.json (excerpt)
{
  "name": "t:general.colors",
  "settings": [
    {
      "type": "color_palette",
      "id": "colors",
      "default": {
        "primary": "#1a5f4f",
        "secondary": "#e8b04b",
        "text": "#1a1a1a",
        "background": "#ffffff"
      }
    }
  ]
}
```

```css
/* assets/base.css — generated once from settings, referenced everywhere */
:root {
  --color-primary: {{ settings.colors.primary }};
  --color-secondary: {{ settings.colors.secondary }};
  --color-text: {{ settings.colors.text }};
  --color-background: {{ settings.colors.background }};
}
```

Name each palette key after the token's *role*, like `primary`. This should match what Figma's variable name (`brand/primary`) means, not its current hex value.

See [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) for the full naming rules. See [Color Palettes](/design-system/color-palettes/) for `color_palette`'s rules (one per theme, 2 to 20 hex colors, no `label`/`info`/`visible_if`), and to learn how individual section or block `color` settings can default to a palette entry instead of a hardcoded hex value.

:::note[If you're on an older schema]
A theme that already shipped brand colors as separate `color` settings (`color_primary`, `color_secondary`, and so on) doesn't need to migrate right away. That pattern still works fine. If you do migrate to `color_palette`, treat it as its own deliberate, reviewed change, not something you slip in as a quick edit. See [Color Palettes](/design-system/color-palettes/#should-solis-adopt-this-now) for why.
:::

## Step 3: decide merchant-editable vs. fixed, per token

Not every design token should turn into a setting that merchants can see and change. Some tokens are fixed brand decisions, and a merchant shouldn't be able to break them:

| Token type | Typically merchant-editable? | Why |
|---|---|---|
| Brand colors (primary, secondary, accent) | Yes | Merchants reasonably want to adjust brand colors without needing a developer |
| Semantic colors (error, success, sale-price) | Sometimes | Often fixed to stay consistent with platform conventions (for example, a red "sold out" badge that merchants shouldn't accidentally turn green) |
| Spacing scale | Rarely | Usually a fixed design decision. Exposing 6 spacing values as settings often adds confusion for merchants without much real benefit |
| Type scale | Sometimes | A `font_picker` is standard. Exposing every individual size in the scale as its own setting is usually overkill |
| Component-specific one-off values | No | These aren't tokens, they're implementation details. See Step 1 |

## Step 4: color functions — using Liquid's color filters instead of hardcoding derived values

Shopify's Liquid color filters can calculate derived colors, like a hover state, a tint, or a shade, starting from just one merchant-set color. That means you don't need a separate setting for every shade:

```liquid
{% comment %} ❌ WRONG — a separate setting for the hover state,
   which can drift out of sync with the base color if a merchant
   updates one but not the other {% endcomment %}
{{ settings.colors.primary }}
{{ settings.color_primary_hover }}

{% comment %} ✅ RIGHT — one setting, computed derived values. Works
   identically whether the base color comes from a color_palette
   entry (shown here) or a plain color setting {% endcomment %}
{%- assign color_primary_hover = settings.colors.primary | color_darken: 10 -%}
```

```css
:root {
  --color-primary: {{ settings.colors.primary }};
  --color-primary-hover: {{ settings.colors.primary | color_darken: 10 }};
  --color-primary-tint: {{ settings.colors.primary | color_lighten: 40 }};
}
```

Available color filters include `color_darken`, `color_lighten`, `color_mix`, `color_modify`, `color_saturate`, `color_brightness`, and the conversion filters `color_to_hex`, `color_to_hsl`, `color_to_rgb`, and `color_to_oklch`. Use these instead of asking a merchant to separately set up every derived shade by hand.

## Step 5: keeping Figma and the theme in sync as the design evolves

Design tokens can drift out of sync with your code. This happens the moment someone updates a Figma variable without updating the matching setting default, or does it the other way around. A few habits help prevent this:

- Treat a Figma variable rename as a reminder to check whether the matching setting's `id` (its unique name) or label needs updating too. This doesn't automatically mean you should change the `id` itself. See [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) for why setting IDs shouldn't change casually.
- If your team maintains **Figma Code Connect** (see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/)), link components that use tokens back to their Figma source. This lets an AI tool or a developer trace a component back to Figma quickly.
- When a design review changes a token's actual value, not just a component's local styling, update the setting's *default* in `settings_data.json`'s preset definitions too (see [Managing Presets](/design-system/managing-presets/)). Updating only the schema default isn't enough on its own, since that only affects fresh installs.

## Best practices

- Pull tokens from Figma's Variables panel specifically, not by guessing values off the design canvas. The Variables panel is where design has already decided "this is a reusable value."
- Use Liquid's color filters (`color_darken`, `color_mix`, and so on) to create related shades from one merchant setting, instead of adding a separate setting for each derived value.
- Decide merchant-editable vs. fixed for each token on purpose, using Step 3's table as your guide, not as a blanket "expose everything" or "expose nothing" policy.

## Common mistakes

- **Turning a value that just happens to repeat into a token**, even though it wasn't a deliberate design decision. This fills the settings schema with meaningless options.
- **Exposing every derived shade as its own setting** instead of computing it with a color filter. This creates settings that can drift out of sync with each other.
- **Naming a setting after Figma's current value** instead of its role, so the name becomes misleading the moment the design changes.

## Quick Reference

- Tokens come from Figma's Variables panel, not the design canvas. That's where the "reusable decision" has already been made.
- Map collections and modes to settings schema groups. Decide merchant-editable vs. fixed for each token type.
- Use color filters (`color_darken`, `color_mix`, and so on) to derive shades instead of adding separate settings.
- Keep Figma and the theme in sync on purpose. A renamed variable or a changed value is a reminder to check the matching setting. It doesn't sync automatically.

## Further Reading

- [Color Palettes](/design-system/color-palettes/), the full `color_palette` feature used in this page's worked example
- [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/), on pulling this same design data directly into an AI coding tool
- [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/), the token structure and naming approach this article assumes
- [Liquid color filters](https://shopify.dev/docs/api/liquid/filters/color-filters), from shopify.dev
