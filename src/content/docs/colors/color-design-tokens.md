---
title: Color Design Tokens
description: The three-tier model for structuring color, naming rules, and mapping a Figma color collection onto it.
---

This page is about how you build your color token system, not how you pull it from Figma or expose it to merchants. See [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) for the general token-pulling workflow, and [Color Palettes](/colors/color-palettes/) / [Color Schemes](/colors/color-schemes/) for the settings that expose color to merchants.

Getting this structure right decides whether your color system still makes sense after 40 sections and three redesigns. Get it wrong, and you quietly end up with colors defined in three different places that don't quite agree with each other.

## The three-tier token model

A color system that lasts separates values into three tiers, or layers: **raw values**, **semantic roles**, and **component usage**. Each tier only looks at the tier just below it:

```css
:root {
  /* Tier 1: raw values — the actual colors, rarely referenced directly */
  --raw-green-700: #1a5f4f;
  --raw-amber-500: #e8b04b;
  --raw-gray-900: #1a1a1a;
  --raw-gray-0: #ffffff;

  /* Tier 2: semantic roles — what a raw value MEANS in this theme */
  --color-primary: var(--raw-green-700);
  --color-accent: var(--raw-amber-500);
  --color-text: var(--raw-gray-900);
  --color-background: var(--raw-gray-0);

  /* Tier 3: component usage — specific components reference semantic roles,
     never raw values directly */
}
```

```css
/* ✅ RIGHT — a component references the semantic role */
.button--primary { background: var(--color-primary); }

/* ❌ WRONG — a component references a raw value directly, bypassing
   the semantic layer entirely. If "primary" is later redefined to a
   different raw color, this component silently doesn't follow along */
.button--primary { background: var(--raw-green-700); }
```

### Why three tiers, not one

A one-tier system, where components use raw color values directly, works fine at first. But then comes your first redesign. Say "primary" changes from green to blue.

Now every component that used `--raw-green-700` directly has to be found and updated, one by one. There was never a "primary" concept you could redefine in a single place.

The semantic tier is what turns a rebrand into a one-line change, instead of a search-and-replace across your whole codebase.

## Naming: role first, appearance never

```
✅ --color-primary, --color-accent, --color-danger, --color-surface
❌ --color-green, --color-orange-ish, --color-red-error, --color-white-bg
```

A color named after its current hex value, or a generic color word, becomes misleading the moment the design changes. "Primary" describes a role, and that role survives a redesign. "Green" just describes an appearance, and appearances change.

This same rule applies to `color_palette` keys ([Color Palettes](/colors/color-palettes/)) and `color_scheme_group` roles ([Color Schemes](/colors/color-schemes/)), not just CSS custom properties. Whichever mechanism holds a color, name it by role. See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for this same naming idea, applied more broadly across your code.

## Structuring the semantic tier so it maps onto Shopify's settings

Structure your semantic tier so it maps cleanly onto whichever setting mechanism holds the actual values, whether that's a `color_scheme_group`'s roles or a `color_palette`'s keys:

```json
// config/settings_schema.json (excerpt) — a color_scheme_group definition
{
  "type": "color_scheme_group",
  "id": "color_schemes",
  "definition": [
    { "type": "color", "id": "background", "label": "t:labels.color_background" },
    { "type": "color", "id": "text", "label": "t:labels.color_text" },
    { "type": "color", "id": "primary", "label": "t:labels.color_primary" },
    { "type": "color", "id": "primary_text", "label": "t:labels.color_primary_text" }
  ]
}
```

```liquid
{% comment %} A section applies its selected scheme via a class + custom
   properties, so every section can independently pick a scheme while
   all referencing the same semantic role names {% endcomment %}
<div class="color-{{ section.settings.color_scheme }}">
```

This is why the semantic tier matters even more in a Shopify theme than in a typical website project. Merchants choose between *multiple* color schemes per section, and every scheme needs the same semantic roles, like `background`, `text`, and `primary`, filled in with different values. It should never be a different set of role names each time. See [Color Schemes](/colors/color-schemes/) for the full page on `color_scheme_group`.

## Mapping a Figma color collection onto theme settings

Figma organizes variables into **collections**, like "Colors," with **modes** inside, like a "Light" and "Dark" mode:

| Figma structure | Theme equivalent |
|---|---|
| Collection: "Colors," Variable: `brand/primary` | A key (`primary`) in a `color_palette` setting |
| Collection: "Colors," Mode: "Dark" | A `color_scheme_group` / `color_scheme` setting, or a merchant-facing dark-mode toggle, depending on whether dark mode is a Theme Store color scheme or a permanent site mode |

### A worked example

Say Figma has a "Colors" collection with these variables: `brand/primary` (#1a5f4f), `brand/secondary` (#e8b04b), `text/body` (#1a1a1a), and `surface/background` (#ffffff).

Map the whole collection onto **one `color_palette` setting**, instead of creating a separate `color` setting for each variable. This is the current recommended approach:

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

Name each palette key after the token's *role*, like `primary`. This should match what Figma's variable name (`brand/primary`) means, not its current hex value. See [Color Palettes](/colors/color-palettes/) for `color_palette`'s own rules (one per theme, 2 to 20 hex colors, no `label`/`info`/`visible_if`), and how individual section or block `color` settings can default to a palette entry instead of a hardcoded hex value.

:::note[If you're on an older schema]
A theme that already shipped brand colors as separate `color` settings (`color_primary`, `color_secondary`, and so on) doesn't need to migrate right away. That pattern still works fine. If you do migrate to `color_palette`, treat it as its own deliberate, reviewed change, not something you slip in as a quick edit. See [Color Palettes](/colors/color-palettes/#should-solis-adopt-this-now) for why.
:::

## Deciding whether a color is even a token

Not every color in a Figma file is a token. A token is a value that's reused on purpose, and named because it represents a real design decision, not because it happens to repeat by coincidence. A color used across 12 components and named `brand/primary` in Figma's Variables panel is a real token. A one-off dark overlay used on a single hero image isn't, it's a local, component-specific value that shouldn't become a global token. See [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/#step-1-identify-what's-actually-a-token-vs-a-one-off-value) for the general version of this rule, which applies to spacing and type too.

## Where color tokens live vs. where they're merchant-editable

| Token | Lives in (always) | Also merchant-editable via |
|---|---|---|
| Semantic colors | CSS custom properties, computed from settings | `color_palette` (shared brand colors) and/or `color_scheme_group` (swappable schemes) in `settings_schema.json` |

Brand colors (primary, secondary, accent) are typically merchant-editable, since merchants reasonably want to adjust them without needing a developer. Semantic colors like "error" or "sale-price" are sometimes fixed instead, to stay consistent with platform conventions, for example a red "sold out" badge that merchants shouldn't be able to accidentally turn green.

## Best practices

- Structure your color tokens in three tiers (raw, semantic, and component), even in a theme that currently feels too small to need it. Adding the semantic tier after 40 sections already use raw values directly is a much bigger job than starting with it from day one.
- Name every color token after its role, never its current appearance or hex value.
- Pull color tokens from Figma's Variables panel specifically, not by eyeballing the design canvas. The Variables panel is where a designer has already decided "this is a reusable value."
- Keep the same semantic role names across every `color_scheme_group` scheme and every place a `color_palette` key is referenced, so components never need scheme- or palette-specific logic.

## Common mistakes

- **Skipping the semantic tier**, so components reference raw color values directly. This turns a rebrand into a search-and-replace job instead of a one-line token change.
- **Naming a color token after its appearance** (`--color-green`) instead of its role (`--color-primary`). This becomes wrong the moment the design changes.
- **Turning a color that just happens to repeat into a token**, even though it wasn't a deliberate design decision. This fills the settings schema with meaningless options.
- **Using different semantic role names in different schemes or components** instead of one consistent set, which forces scheme-specific branching everywhere a color is used.

## Quick Reference

- Three tiers: raw values, then semantic roles, then component usage. Components use semantic roles, never raw values.
- Name color tokens after their role, never their appearance or current hex value.
- Pull tokens from Figma's Variables panel, not the design canvas.
- Map a Figma color collection onto one `color_palette` setting, not separate `color` settings per variable.
- Keep semantic role names consistent across every scheme and every reference, so components never branch on which scheme or palette entry is active.

## Further Reading

- [Color Palettes](/colors/color-palettes/): the `color_palette` setting this page's worked example builds toward
- [Color Schemes](/colors/color-schemes/): the `color_scheme_group` mechanism this page's semantic tier maps onto
- [Color in Liquid & CSS](/colors/color-in-liquid-and-css/): reading these tokens and deriving shades with Liquid's color filters
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/): the general token-pulling workflow (spacing, type, radii) this page's color-specific version is drawn from
- [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/): the same role-first naming idea, applied more broadly
