---
title: Design Tokens, Color & Type System
description: How to structure tokens, colors, and type scales so the theme stays maintainable in year three, not just week one.
---

[Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) covers pulling tokens *from* Figma. This article is about the token architecture itself — the naming and structure decisions that determine whether your token system is still coherent after 40 sections and three redesigns, or has quietly become three overlapping, half-consistent systems.

## The three-tier token model

A durable token system separates **raw values**, **semantic roles**, and **component usage** — three tiers, each referencing the one below it:

```css
:root {
  /* Tier 1: raw values — the actual colors/numbers, rarely referenced directly */
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

A one-tier system (components reference raw values directly) works fine until the first redesign, when "primary" changes from green to blue — now every component referencing `--raw-green-700` directly has to be found and updated individually, because there was never a "primary" concept to redefine in one place. The semantic tier is what makes a rebrand a one-line change instead of a find-and-replace across the codebase.

## Naming: role first, appearance never

```
✅ --color-primary, --color-accent, --color-danger, --color-surface
❌ --color-green, --color-orange-ish, --color-red-error, --color-white-bg
```

A color named after its current hex value or a generic color word becomes actively misleading the moment the design changes — "primary" describes a role that survives a redesign; "green" describes an appearance that doesn't. See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for the same naming principle applied more broadly.

## The color system: a Theme Store-ready structure

Shopify's `color_scheme_group` setting type is the standard mechanism for merchant-selectable color schemes (e.g. "Scheme 1," "Scheme 2," dark variants) applied per-section. Structure your semantic tier to map cleanly onto a color scheme's roles:

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

This is why the semantic tier matters even more in a Shopify theme than a typical web project — merchants select from *multiple* color schemes per section, and every scheme needs the same semantic roles (`background`, `text`, `primary`) filled in with different values, not a different set of role names each time.

## The type system: a scale, not a pile of one-off sizes

```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.75rem;
  --font-size-2xl: 2.5rem;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
}
```

```css
/* ❌ WRONG — an arbitrary one-off size, not on the scale, chosen because
   it "looked right" for this one heading — the first of many such
   one-offs that eventually make the type system meaningless */
.section-heading { font-size: 1.6rem; }

/* ✅ RIGHT — reaches for the nearest scale step, or prompts a
   conversation with design about whether the scale needs a new step */
.section-heading { font-size: var(--font-size-xl); }
```

A one-off size isn't wrong because 1.6rem is a bad value — it's wrong because it starts a pattern where "the type scale" stops being an accurate description of what the theme actually uses, and every subsequent developer has to guess whether a given size is intentional or another one-off.

### Fluid type: `clamp()` over fixed breakpoint overrides

```css
/* ❌ WRONG — a separate override per breakpoint, verbose and easy to
   leave inconsistent between breakpoints */
.hero-heading { font-size: 2rem; }
@media (min-width: 750px) { .hero-heading { font-size: 3rem; } }
@media (min-width: 990px) { .hero-heading { font-size: 4rem; } }

/* ✅ RIGHT — one declaration, scales continuously between a min and max */
.hero-heading { font-size: clamp(2rem, 1.2rem + 3vw, 4rem); }
```

## Where tokens live vs. where they're merchant-editable

| Token | Lives in (always) | Also merchant-editable via |
|---|---|---|
| Semantic colors | CSS custom properties, computed from settings | `color`/`color_scheme_group` settings in `settings_schema.json` |
| Spacing scale | CSS custom properties | Usually fixed — see [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/#step-3-decide-merchant-editable-vs-fixed-per-token) on why spacing is rarely exposed |
| Type scale | CSS custom properties | A `font_picker` for the family; sizes are usually fixed to preserve scale integrity |
| Radii/shadows | CSS custom properties | Rarely merchant-editable — a fixed brand decision |

## Best practices

- Structure tokens in three tiers (raw → semantic → component) even in a theme that currently seems too small to need it — retrofitting the semantic tier after 40 sections reference raw values directly is a much bigger job than starting with it.
- Name every token after its role, never its current appearance or value.
- Reach for the nearest existing scale step before adding a one-off value — treat "this doesn't fit the scale" as a conversation with design, not a silent one-off.
- Use `clamp()` for fluid type instead of stacking breakpoint-specific overrides.

## Common mistakes

- **Skipping the semantic tier**, having components reference raw values directly — turns a rebrand into a find-and-replace instead of a one-line token change.
- **Naming a token after its appearance** (`--color-green`) instead of its role (`--color-primary`) — becomes actively wrong the moment the design changes.
- **Letting one-off font sizes accumulate** outside the type scale, until "the type scale" no longer accurately describes what the theme actually uses.
- **Exposing every token as a merchant setting** "to be flexible," creating an overwhelming theme settings panel and a design that can be broken more easily than it can be usefully customized.

## Quick Reference

- Three tiers: raw values → semantic roles → component usage. Components reference semantic roles, never raw values.
- Name tokens after role, never appearance or current value.
- Type: a defined scale plus `clamp()` for fluid sizing, not one-off values or per-breakpoint overrides.
- Not every token should be merchant-editable — decide deliberately per Figma Tokens → Theme Settings' Step 3 table.

## Further Reading

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) — pulling these tokens from Figma
- [CSS Style Guide](/style-guides/css/) — day-to-day custom property conventions
- [Color schemes](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes) — shopify.dev
