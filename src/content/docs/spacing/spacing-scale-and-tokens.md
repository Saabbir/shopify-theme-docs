---
title: Spacing Scale & Tokens
description: A defined spacing scale instead of one-off values, fluid spacing with clamp(), and naming rules.
---

Spacing is the token type most likely to quietly fall apart in a large theme, because a one-off `padding: 18px` doesn't look wrong the way a clashing color does. It just slowly makes "the spacing scale" stop meaning anything. This page covers building a scale that holds up.

## A scale, not a pile of one-off values

```css
:root {
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
}
```

```css
/* ❌ WRONG — an arbitrary one-off value, not on the scale, picked
   because it "looked right" for this one section */
.hero { padding-block: 18px; }

/* ✅ RIGHT — reaches for the nearest scale step */
.hero { padding-block: var(--space-lg); }
```

The same reasoning that applies to color and type tokens applies here: this is the three-tier model (raw values → semantic roles → component usage) covered in [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/#the-three-tier-token-model). A raw value like `2rem` becomes a semantic role like `--space-lg` (or, better, a role tied to its purpose, like `--spacing-section-gap`), and components reference the role.

### Semantic spacing roles, not just a raw scale

A raw scale (`--space-xs` through `--space-3xl`) is the foundation, but for spacing used in the same place repeatedly across the theme, add a semantic layer on top of it:

```css
:root {
  /* Tier 1: raw scale */
  --space-md: 1.5rem;
  --space-xl: 3rem;

  /* Tier 2: semantic roles, tied to purpose */
  --spacing-section-block: var(--space-xl);
  --spacing-card-padding: var(--space-md);
}
```

```css
.section { padding-block: var(--spacing-section-block); }
.card { padding: var(--spacing-card-padding); }
```

If "section spacing" changes theme-wide, you redefine `--spacing-section-block` once. Without the semantic layer, you'd have to find and update every section that happened to use `--space-xl` directly, including ones where that was a coincidence, not an intentional link to "section spacing."

## Naming: role first, value never

```
✅ --spacing-section-block, --spacing-card-padding, --space-lg
❌ --spacing-32px, --gap-thing-2, --padding-1
```

Name a spacing token after its role or its position in a defined scale, never its current pixel or rem value. A scale step name like `--space-lg` is fine, since "large" is a stable position in the scale even if the underlying value changes. A name like `--spacing-32px` breaks the moment that value changes to `36px`. See [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/#naming-role-first-appearance-never) for this same rule applied to tokens generally.

## Fluid spacing: `clamp()` for the same reason as fluid type

`clamp()` isn't just for font sizes (see [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/#fluid-type-clamp-over-fixed-breakpoint-overrides)). It works identically for spacing, letting section padding scale smoothly with viewport width instead of jumping at breakpoints:

```css
/* ❌ WRONG — spacing jumps abruptly at each breakpoint */
.section { padding-block: 2rem; }
@media (min-width: 750px) { .section { padding-block: 3rem; } }
@media (min-width: 990px) { .section { padding-block: 5rem; } }

/* ✅ RIGHT — scales continuously between a min and max */
.section { padding-block: clamp(2rem, 1rem + 4vw, 5rem); }
```

## Mapping a Figma spacing collection onto theme tokens

Figma's Variables panel typically has a "Spacing" collection with variables like `space/md`. Map each one onto a step in your CSS scale:

| Figma variable | Theme mapping |
|---|---|
| `space/md` | `--space-md` in the global stylesheet |
| A spacing value used consistently for one purpose (card padding, section gaps) | A semantic role built on top of the raw scale, like `--spacing-card-padding` |

Most spacing values stay fixed in CSS rather than becoming merchant-facing settings. See [Spacing in Settings](/spacing/spacing-in-settings/) for when exposing spacing as a setting actually makes sense, and when it doesn't.

## Best practices

- Define a raw spacing scale once, in the global stylesheet, before your first section's CSS. Adding a scale after 20 sections already use one-off values is a much bigger job than starting with it.
- Add semantic roles on top of the raw scale for any spacing value used repeatedly for the same purpose (section padding, card padding, gaps between related items).
- Name tokens after their role or scale position, never their current value.
- Use `clamp()` for spacing that should scale smoothly across viewport widths, the same way you would for fluid type.

## Common mistakes

- **Letting one-off spacing values pile up** outside the defined scale, because a slightly-off padding value doesn't look wrong the way a clashing color does.
- **Naming a spacing token after its current value** (`--spacing-32px`) instead of its role or scale position.
- **Skipping the semantic layer** for spacing that's reused for one specific purpose, making a later change to "section spacing" a find-and-replace job instead of a one-line edit.
- **Writing a separate padding/margin override per breakpoint** instead of one `clamp()` declaration.

## Quick Reference

- Define a raw spacing scale (`--space-3xs` through `--space-3xl`, or similar) before writing section CSS.
- Add semantic roles for spacing reused for one specific purpose.
- Name tokens after their role or scale position, never their current value.
- `clamp()` works for spacing exactly as it does for type, for smooth cross-viewport scaling.

## Further Reading

- [Spacing in Settings](/spacing/spacing-in-settings/): when a spacing value should become a merchant-facing `range` setting
- [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/): logical properties, and the custom-property-vs-class rule for spacing
- [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/): the general three-tier token model this page's scale follows
- [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/): the equivalent scale for type, including the same `clamp()` technique
