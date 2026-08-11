---
title: "Figma Tokens → Theme Settings"
description: How to take a Figma variable collection and turn it into settings_schema.json entries and CSS custom properties, the right way.
---

**TL;DR:** How to take a Figma variable collection and turn it into settings_schema.json entries and CSS custom properties, the right way.

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
| Collection: "Colors," Variable: `brand/primary` | A key (`primary`) in a `color_palette` setting, see [Color Design Tokens](/colors/color-design-tokens/#mapping-a-figma-color-collection-onto-theme-settings) for the full worked example |
| Collection: "Colors," Mode: "Dark" | A `color_scheme_group` / `color_scheme` setting, or a merchant-facing dark-mode toggle, depending on whether dark mode is a Theme Store color scheme or a permanent site mode |
| Collection: "Spacing," Variable: `space/md` | A raw scale step (`--space-md`), see [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/#mapping-a-figma-spacing-collection-onto-theme-tokens) |
| Collection: "Type," Variable: `heading/size-lg` | The font family maps to a `font_picker`, sizes usually stay fixed CSS custom properties, see [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/#mapping-a-figma-type-collection-onto-theme-settings) |

:::note[Mapping a Figma color, type, or spacing collection]
Each domain has its own dedicated worked example. See [Color Design Tokens](/colors/color-design-tokens/#mapping-a-figma-color-collection-onto-theme-settings), [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/#mapping-a-figma-type-collection-onto-theme-settings), and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/#mapping-a-figma-spacing-collection-onto-theme-tokens) for the full walkthrough in each.
:::

## Step 3: decide merchant-editable vs. fixed, per token

Not every design token should turn into a setting that merchants can see and change. Some tokens are fixed brand decisions, and a merchant shouldn't be able to break them:

| Token type | Typically merchant-editable? | Why |
|---|---|---|
| Brand colors (primary, secondary, accent) | Yes | Merchants reasonably want to adjust brand colors without needing a developer |
| Semantic colors (error, success, sale-price) | Sometimes | Often fixed to stay consistent with platform conventions (for example, a red "sold out" badge that merchants shouldn't accidentally turn green) |
| Spacing scale | Rarely | Usually a fixed design decision, see [Spacing in Settings](/spacing/spacing-in-settings/) for the specific cases (mostly section padding) worth exposing |
| Type scale | Sometimes | A `font_picker` is standard for the family, see [Font Settings](/fonts/font-settings/). Exposing every individual size in the scale as its own setting is usually overkill |
| Component-specific one-off values | No | These aren't tokens, they're implementation details. See Step 1 |

## Step 4: keeping Figma and the theme in sync as the design evolves

Design tokens can drift out of sync with your code. This happens the moment someone updates a Figma variable without updating the matching setting default, or does it the other way around. A few habits help prevent this:

- Treat a Figma variable rename as a reminder to check whether the matching setting's `id` (its unique name) or label needs updating too. This doesn't automatically mean you should change the `id` itself. See [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/) for why setting IDs shouldn't change casually.
- If your team maintains **Figma Code Connect** (see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/)), link components that use tokens back to their Figma source. This lets an AI tool or a developer trace a component back to Figma quickly.
- When a design review changes a token's actual value, not just a component's local styling, update the setting's *default* in `settings_data.json`'s preset definitions too (see [Theme Presets](/presets/theme-presets/)). Updating only the schema default isn't enough on its own, since that only affects fresh installs.

## Best practices

- Pull tokens from Figma's Variables panel specifically, not by guessing values off the design canvas. The Variables panel is where design has already decided "this is a reusable value."
- Decide merchant-editable vs. fixed for each token on purpose, using Step 3's table as your guide, not as a blanket "expose everything" or "expose nothing" policy.
- Each domain has its own derivation and settings rules: colors derive shades with Liquid color filters, fonts derive weights/styles with `font_modify`, spacing rarely becomes a setting at all. See [Colors](/colors/), [Fonts](/fonts/), and [Spacing](/spacing/).

## Common mistakes

- **Turning a value that just happens to repeat into a token**, even though it wasn't a deliberate design decision. This fills the settings schema with meaningless options.
- **Naming a setting after Figma's current value** instead of its role, so the name becomes misleading the moment the design changes.

## Key takeaways
- Tokens come from Figma's Variables panel, not the design canvas. That's where the "reusable decision" has already been made.
- Map collections and modes to settings schema groups. Decide merchant-editable vs. fixed for each token type.
- Keep Figma and the theme in sync on purpose. A renamed variable or a changed value is a reminder to check the matching setting. It doesn't sync automatically.
- Color, type, and spacing each have their own dedicated section: see [Colors](/colors/), [Fonts](/fonts/), [Spacing](/spacing/).

## Further reading

- [Colors](/colors/), the dedicated section for `color_palette`, `color_scheme_group`, color tokens, and color filters
- [Fonts](/fonts/), the dedicated section for `font_picker`, the type scale, and font accessibility/performance
- [Spacing](/spacing/), the dedicated section for the spacing scale, `range` settings, and logical properties
- [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/), on pulling this same design data directly into an AI coding tool
- [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/), the token structure and naming approach this article assumes
