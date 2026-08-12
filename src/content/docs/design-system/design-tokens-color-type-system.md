---
title: "Design Tokens: The Three-Tier Model"
description: The general raw-value/semantic-role/component-usage token structure every domain (color, type, spacing) in this handbook builds on.
---

**TL;DR:** The general raw-value/semantic-role/component-usage token structure every domain (color, type, spacing) in this handbook builds on.

[Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) covers pulling tokens *from* Figma. This article is about something different: the general structure behind the tokens themselves, the same structure color, type, and spacing tokens all follow.

That means the naming and structure choices that decide whether your token system still makes sense after 40 sections and three redesigns. Get it wrong, and you quietly end up with several overlapping systems that don't quite agree with each other.

:::note[Looking for a specific domain?]
This page covers the general model. For the fully worked-out version in each domain, see [Colors](/colors/color-design-tokens/), [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/), and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/).
:::

## The three-tier token model

A token system that lasts separates values into three tiers, or layers: **raw values**, **semantic roles**, and **component usage**. Each tier only looks at the tier just below it:

```css
:root {
  /* Tier 1: raw values — the actual numbers, rarely referenced directly */
  --raw-space-4: 1rem;
  --raw-space-8: 2rem;
  --raw-font-size-28: 1.75rem;

  /* Tier 2: semantic roles — what a raw value MEANS in this theme */
  --spacing-section: var(--raw-space-8);
  --spacing-element: var(--raw-space-4);
  --font-size-heading: var(--raw-font-size-28);

  /* Tier 3: component usage — specific components reference semantic roles,
     never raw values directly */
}
```

```css
/* ✅ RIGHT — a component references the semantic role */
.section { padding-block: var(--spacing-section); }

/* ❌ WRONG — a component references a raw value directly, bypassing
   the semantic layer entirely. If "spacing-section" is later redefined
   to a different raw value, this component silently doesn't follow along */
.section { padding-block: var(--raw-space-8); }
```

### Why three tiers, not one

A one-tier system, where components use raw values directly, works fine at first. But then comes your first redesign. Say your section spacing changes across the board.

Now every component that used `--raw-space-8` directly has to be found and updated, one by one. There was never a "section spacing" concept you could redefine in a single place.

The semantic tier is what turns a redesign into a one-line change, instead of a search-and-replace across your whole codebase. This same reasoning is exactly why color, type, and spacing tokens all use the same three-tier structure, see [Color Design Tokens](/colors/color-design-tokens/), [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/), and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/).

## Naming: role first, appearance never

```
✅ --spacing-section, --spacing-element, --font-size-heading
❌ --spacing-32px, --font-size-big, --gap-thing-2
```

A token named after its current value, or a vague placeholder word, becomes misleading the moment the design changes. "Section spacing" describes a role, and that role survives a redesign. "32px" just describes a value, and values change.

See [Writing Maintainable Code at Scale](/learning-articles/writing-maintainable-code-at-scale/) for this same naming idea, applied more broadly across your code, and the domain-specific naming sections in [Color Design Tokens](/colors/color-design-tokens/#naming-role-first-appearance-never), [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/#naming-role-first-appearance-never), and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/#naming-role-first-value-never).

## A defined scale, not a pile of one-off values

Whatever the domain, values that come in a range (sizes, spacings, radii) work best as a defined scale, not values invented one at a time as new components need them:

```css
/* ❌ WRONG — an arbitrary one-off value, not on any defined scale,
   chosen because it "looked right" for this one component — the first
   of many such one-offs that eventually make the scale meaningless */
.section-heading { font-size: 1.6rem; }

/* ✅ RIGHT — reaches for the nearest scale step, or prompts a
   conversation with design about whether the scale needs a new step */
.section-heading { font-size: var(--font-size-xl); }
```

Once you allow one exception, the scale stops accurately describing what the theme actually uses. Every developer who comes after you has to guess whether a given value was intentional, or just another one-off. See [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/) and [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/) for the fully worked-out scale in each domain, including `clamp()` for fluid sizing across viewport widths.

## Where tokens live vs. where they're merchant-editable

| Token | Lives in (always) | Also merchant-editable via |
|---|---|---|
| Spacing scale | CSS custom properties | Usually fixed, see [Spacing in Settings](/spacing/spacing-in-settings/) for the cases worth exposing |
| Type scale | CSS custom properties | A `font_picker` for the font family, sizes are usually fixed, see [Fonts](/fonts/) |
| Radii/shadows | CSS custom properties | Rarely merchant-editable, this is usually a fixed brand decision |
| Colors | CSS custom properties, computed from settings | `color_palette` and/or `color_scheme_group`, see [Colors](/colors/) |

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Structure your tokens in three tiers (raw, semantic, and component), even in a theme that currently feels too small to need it. Adding the semantic tier after 40 sections already use raw values directly is a much bigger job than starting with it from day one. | **Skipping the semantic tier**, so components use raw values directly. This turns a redesign into a search-and-replace job instead of a one-line token change. |
| Name every token after its role, never its current appearance or value. | **Naming a token after its current value** (`--spacing-32px`) instead of its role (`--spacing-section`). This becomes wrong the moment the design changes. |
| Reach for the nearest existing scale step before adding a one-off value. If nothing on the scale fits, talk to design about it instead of quietly adding a one-off. | **Letting one-off values pile up** outside the defined scale, until the scale no longer describes what the theme actually uses. |
| — | **Exposing every token as a merchant setting** just "to be flexible." This creates an overwhelming settings panel and a design that's easier to break than to usefully customize. |

## Key takeaways
- Three tiers: raw values, then semantic roles, then component usage. Components use semantic roles, never raw values.
- Name tokens after their role, never their appearance or current value.
- Use a defined scale for values that come in a range, not one-off values invented per component.
- Not every token should be merchant-editable. Decide this on purpose, per domain: see [Colors](/colors/), [Fonts](/fonts/), and [Spacing](/spacing/).

## Further reading

- [Colors](/colors/), the dedicated section for color tokens, `color_palette`, `color_scheme_group`, and color accessibility
- [Fonts](/fonts/), the dedicated section for typography tokens, `font_picker`, and font accessibility/performance
- [Spacing](/spacing/), the dedicated section for spacing tokens, `range` settings, and logical properties
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/), on pulling these tokens from Figma
- [CSS Custom Properties (Variables)](/css/css-custom-properties/), for day-to-day custom property conventions
