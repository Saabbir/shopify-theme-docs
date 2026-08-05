---
title: Design Tokens, Color & Type System
description: How to organize tokens, colors, and type scales so your theme stays easy to maintain years later, not just in week one.
---

[Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) covers pulling tokens *from* Figma. This article is about something different: how you build the tokens themselves.

That means the naming and structure choices that decide whether your token system still makes sense after 40 sections and three redesigns. Get it wrong, and you quietly end up with three overlapping systems that don't quite agree with each other.

## The three-tier token model

A token system that lasts separates values into three tiers, or layers: **raw values**, **semantic roles**, and **component usage**. Each tier only looks at the tier just below it:

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

A one-tier system, where components use raw values directly, works fine at first. But then comes your first redesign. Say "primary" changes from green to blue.

Now every component that used `--raw-green-700` directly has to be found and updated, one by one. There was never a "primary" concept you could redefine in a single place.

The semantic tier is what turns a rebrand into a one-line change, instead of a search-and-replace across your whole codebase.

## Naming: role first, appearance never

```
✅ --color-primary, --color-accent, --color-danger, --color-surface
❌ --color-green, --color-orange-ish, --color-red-error, --color-white-bg
```

A color named after its current hex value, or a generic color word, becomes misleading the moment the design changes. "Primary" describes a role, and that role survives a redesign. "Green" just describes an appearance, and appearances change.

See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for this same naming idea, applied more broadly across your code.

## The color system: a Theme Store-ready structure

Shopify gives you two ways to model color at the settings level, and they solve different problems. **`color_palette`** is a newer feature: one shared grid of the theme's actual brand colors, which other `color`/`color_background` settings can use as their default. **`color_scheme_group`** is the standard way to let merchants pick between full color *schemes* (like "Scheme 1," "Scheme 2," or a dark version), applied per section.

See [Color Palettes](/design-system/color-palettes/) for the full picture of the newer feature, including exactly how it works alongside `color_scheme_group` instead of replacing it. The semantic-naming rule on this page applies to both equally.

The rest of this section focuses on `color_scheme_group`, since it maps most directly onto the three-tier model above.

Structure your semantic tier so it maps cleanly onto a color scheme's roles:

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

This is why the semantic tier matters even more in a Shopify theme than in a typical website project. Merchants choose between *multiple* color schemes per section, and every scheme needs the same semantic roles, like `background`, `text`, and `primary`, filled in with different values. It should never be a different set of role names each time.

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

A one-off size isn't wrong because 1.6rem is a bad value on its own. It's wrong because it starts a pattern.

Once you allow one exception, "the type scale" stops accurately describing what the theme actually uses. Every developer who comes after you has to guess whether a given size was intentional, or just another one-off.

### Fluid type: `clamp()` over fixed breakpoint overrides

Instead of writing a separate font size for every breakpoint, you can use the CSS `clamp()` function. It smoothly scales a value between a minimum and a maximum as the screen resizes, so you don't need multiple overrides:

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
| Semantic colors | CSS custom properties, computed from settings | `color_palette` (shared brand colors) and/or `color_scheme_group` (swappable schemes) in `settings_schema.json`, see [Color Palettes](/design-system/color-palettes/) |
| Spacing scale | CSS custom properties | Usually fixed, see [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/#step-3-decide-merchant-editable-vs-fixed-per-token) on why spacing is rarely exposed |
| Type scale | CSS custom properties | A `font_picker` for the font family, sizes are usually fixed to keep the scale consistent |
| Radii/shadows | CSS custom properties | Rarely merchant-editable, this is usually a fixed brand decision |

## Best practices

- Structure your tokens in three tiers (raw, semantic, and component), even in a theme that currently feels too small to need it. Adding the semantic tier after 40 sections already use raw values directly is a much bigger job than starting with it from day one.
- Name every token after its role, never its current appearance or value.
- Reach for the nearest existing scale step before adding a one-off value. If nothing on the scale fits, talk to design about it instead of quietly adding a one-off.
- Use `clamp()` for fluid type instead of stacking breakpoint-specific overrides.

## Common mistakes

- **Skipping the semantic tier**, so components use raw values directly. This turns a rebrand into a search-and-replace job instead of a one-line token change.
- **Naming a token after its appearance** (`--color-green`) instead of its role (`--color-primary`). This becomes wrong the moment the design changes.
- **Letting one-off font sizes pile up** outside the type scale, until "the type scale" no longer describes what the theme actually uses.
- **Exposing every token as a merchant setting** just "to be flexible." This creates an overwhelming settings panel and a design that's easier to break than to usefully customize.

## Quick Reference

- Three tiers: raw values, then semantic roles, then component usage. Components use semantic roles, never raw values.
- Name tokens after their role, never their appearance or current value.
- For type, use a defined scale plus `clamp()` for fluid sizing, not one-off values or per-breakpoint overrides.
- Not every token should be merchant-editable. Decide this on purpose, using Figma Tokens → Theme Settings' Step 3 table as a guide.

## Further Reading

- [Color Palettes](/design-system/color-palettes/), the newer `color_palette` setting, and exactly how it complements `color_scheme_group`
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/), on pulling these tokens from Figma
- [CSS Style Guide](/style-guides/css/), for day-to-day custom property conventions
- [Color schemes](https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes), from shopify.dev
