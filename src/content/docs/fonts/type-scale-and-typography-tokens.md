---
title: Type Scale & Typography Tokens
description: A defined scale instead of one-off sizes, fluid type with clamp(), and how a Figma type collection maps onto theme settings.
---

**TL;DR:** A defined scale instead of one-off sizes, fluid type with clamp(), and how a Figma type collection maps onto theme settings.

Once a typeface is chosen (see [Font Settings](/fonts/font-settings/)), the next decision is sizing: what sizes exist, how they scale across screen widths, and where those numbers actually live in code. Get this structured, and a theme stays consistent after 40 sections. Get it wrong, and every developer who touches a heading picks their own one-off size.

## A scale, not a pile of one-off sizes

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
   one-offs that eventually make the type scale meaningless */
.section-heading { font-size: 1.6rem; }

/* ✅ RIGHT — reaches for the nearest scale step, or prompts a
   conversation with design about whether the scale needs a new step */
.section-heading { font-size: var(--font-size-xl); }
```

A one-off size isn't wrong because 1.6rem is a bad value on its own. It's wrong because it starts a pattern. Once you allow one exception, "the type scale" stops accurately describing what the theme actually uses, and every developer who comes after has to guess whether a given size was intentional or just another one-off.

This is the same three-tier reasoning (raw values → semantic roles → component usage) covered in [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/#the-three-tier-token-model). A raw size like `1.75rem` becomes a semantic role like `--font-size-heading-lg`, and components reference the role, never the raw number.

## Naming: role first, appearance never

```
✅ --font-size-heading-lg, --font-size-body, --line-height-tight
❌ --font-size-28px, --font-size-big, --line-height-1
```

Name a type token after what it's *for*, not its current pixel or rem value. "Heading large" survives a redesign where the actual size changes. "28px" doesn't. See [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/#naming-role-first-appearance-never) for this same rule applied to tokens generally.

## Fluid type: `clamp()` over fixed breakpoint overrides

Instead of writing a separate font size for every breakpoint, use the CSS `clamp()` function. It smoothly scales a value between a minimum and a maximum as the screen resizes, so you don't need multiple overrides:

```css
/* ❌ WRONG — a separate override per breakpoint, verbose and easy to
   leave inconsistent between breakpoints */
.hero-heading { font-size: 2rem; }
@media (min-width: 750px) { .hero-heading { font-size: 3rem; } }
@media (min-width: 990px) { .hero-heading { font-size: 4rem; } }

/* ✅ RIGHT — one declaration, scales continuously between a min and max */
.hero-heading { font-size: clamp(2rem, 1.2rem + 3vw, 4rem); }
```

## Mapping a Figma type collection onto theme settings

Figma organizes type into a **collection** (often "Type" or "Typography"), with variables like `heading/size-lg` or `body/line-height`. Map this onto theme settings and CSS deliberately, deciding per token whether it's merchant-editable:

| Figma variable | Typical theme mapping |
|---|---|
| `heading/font-family` | A `font_picker` setting, see [Font Settings](/fonts/font-settings/) |
| `heading/size-lg` | A fixed CSS custom property (`--font-size-heading-lg`), or a `range` setting if the theme intentionally lets merchants adjust heading size |
| `body/line-height` | Almost always a fixed CSS custom property. Line-height is rarely something merchants need to adjust |

Most themes expose the font *family* as a setting (via `font_picker`) but keep the *scale* (sizes, line-heights) fixed in CSS. This keeps the scale internally consistent. A merchant picking one wildly large body size on a whim can break a layout in ways a font choice alone can't.

## Best practices

- Reach for the nearest existing scale step before adding a one-off value. If nothing fits, that's a signal to talk to design about adding a real step to the scale, not to quietly add an exception.
- Name every size and line-height token after its role, never its current value.
- Use `clamp()` for fluid type instead of stacking breakpoint-specific overrides.
- Keep the type scale fixed in CSS by default. Only expose individual sizes as settings when there's a specific, deliberate reason to.

## Common mistakes

- **Letting one-off font sizes pile up** outside the defined scale, until "the type scale" no longer describes what the theme actually uses.
- **Naming a size token after its current value** (`--font-size-28px`) instead of its role (`--font-size-heading-lg`).
- **Writing a separate font-size override per breakpoint** instead of one `clamp()` declaration.
- **Exposing every individual size in the scale as its own setting**, which lets a merchant break the scale's internal consistency one field at a time.

## Key Takeaways
- Use a defined scale (`--font-size-xs` through `--font-size-2xl`, or similar), not one-off values.
- Name tokens after their role, never their current size.
- `clamp()` for fluid type, not per-breakpoint overrides.
- Expose the font *family* as a setting; keep the *scale* fixed in CSS by default.

## Further Reading

- [Font Settings](/fonts/font-settings/): the `font_picker` setting this page's scale pairs with
- [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/): reading the chosen font and generating actual CSS
- [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/): the general three-tier token model this page's scale follows
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/): the general Figma-to-settings workflow
