---
title: CSS Custom Properties (Variables)
description: How custom properties actually work, runtime vs. compile-time, fallback values, and using them as the bridge between Liquid settings and CSS.
---

Custom properties (informally, "CSS variables") are the mechanism that holds every design token in this handbook together, color, type, spacing, radii. This page covers how they actually behave, which is different from how a Sass variable behaves, in ways that matter for a Shopify theme specifically.

## Runtime, not compile-time

This is the difference that trips up anyone coming from Sass. A Sass variable resolves once, when your CSS is built, and after that it's a fixed value baked into the output file forever. A CSS custom property resolves when the page renders in the browser, so it can change dynamically, even after the page has already loaded.

```css
:root {
  --color-primary: #1a5f4f;
}
.button { background: var(--color-primary); }
```

```liquid
{% comment %} Because custom properties resolve at render time, you can
   set one per-instance, inline, straight from a Liquid setting {% endcomment %}
<div class="progress-bar" style="--percent: {{ product.metafields.custom.stock_percent }}%;">
```

```css
.progress-bar::before { width: var(--percent); }
```

This is exactly why a custom property, not a Sass variable and not a JS-computed inline style set property-by-property, is the right tool whenever one merchant setting needs to map to one CSS value.

## Syntax and scope

A custom property name always starts with two dashes, and it's read with `var()`:

```css
:root {
  --color-primary: #1a5f4f; /* declared on :root, available everywhere */
}

.card {
  --card-gap: 1rem; /* declared on .card, only available within .card and its descendants */
  gap: var(--card-gap);
}
```

Custom properties follow normal CSS inheritance and cascade rules. A property declared on `:root` is available to every element on the page. A property declared on a specific selector is scoped to that selector and its descendants, which is useful for a value that should only apply within one component's subtree.

## Fallback values

`var()` accepts a second argument: a fallback used if the custom property isn't set:

```css
.section {
  /* falls back to --spacing-section-block if --section-padding was
     never set inline, instead of collapsing to nothing */
  padding-block: var(--section-padding, var(--spacing-section-block));
}
```

Always provide a fallback for any custom property that's meant to be set conditionally (like a per-instance value from a `range` setting, see [Spacing in Settings](/spacing/spacing-in-settings/#the-range-setting-type)). Without one, a missing value resolves to nothing, which for most properties means the declaration is simply ignored, not defaulted to zero. That said, some properties (like `width` or `padding`) effectively behave as if unset when the custom property is missing and there's no fallback, so always test the actual behavior rather than assuming.

## One property varies → a custom property. Several vary together → a class.

This is the core rule for deciding whether a merchant-facing setting should become an inline custom property or a CSS class:

```liquid
{% comment %} ✅ RIGHT — one property (gap) varies, so it's a custom property {% endcomment %}
<div class="testimonials" style="--gap: {{ section.settings.gap }}px;">

{% comment %} ✅ RIGHT — several properties change together (layout direction,
   alignment, spacing all shift), so it's a class driven by a select setting {% endcomment %}
<div class="testimonials testimonials--{{ section.settings.layout }}">
```

```css
/* ❌ WRONG — five separate custom properties for what's really one
   coherent layout mode, forcing every consumer to set all five correctly */
.testimonials {
  flex-direction: var(--direction);
  align-items: var(--align);
  gap: var(--gap-override);
  padding: var(--padding-override);
  text-align: var(--text-align-override);
}

/* ✅ RIGHT — one class encodes the whole coherent state */
.testimonials--stacked { flex-direction: column; align-items: center; text-align: center; }
.testimonials--row { flex-direction: row; align-items: flex-start; text-align: start; }
```

## Custom properties as design tokens

In CSS, design tokens are custom properties, declared once on `:root` and referenced everywhere:

```css
:root {
  --color-text: #1a1a1a;
  --color-bg: #ffffff;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;

  --radius-sm: 4px;
  --radius-md: 8px;
}
```

This is the mechanism behind the three-tier token model (raw values → semantic roles → component usage), see [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/) for the general reasoning, and [Colors](/colors/color-design-tokens/), [Fonts](/fonts/type-scale-and-typography-tokens/), and [Spacing](/spacing/spacing-scale-and-tokens/) for the domain-specific versions.

## `@property`: typed custom properties (progressive enhancement)

The `@property` at-rule lets you register a custom property with an explicit type, an initial value, and whether it inherits. This is what makes custom properties **animatable** by the browser, something plain `var()` values normally aren't (the browser can't interpolate between two arbitrary strings, but it can interpolate between two typed numbers or colors):

```css
@property --progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.progress-bar {
  --progress: 0%;
  width: var(--progress);
  transition: --progress 0.3s ease;
}
```

Treat `@property` as progressive enhancement: browsers that don't support it simply treat the custom property as an untyped string, exactly as before, so nothing breaks. Reach for it specifically when you need the browser to smoothly animate a custom-property-driven value.

## Best practices

- Declare shared tokens once, on `:root`, in the global stylesheet. Scope component-specific custom properties to that component's own selector.
- Always pass a fallback to `var()` for any custom property that's set conditionally or per-instance.
- One varying property → a custom property. Several varying together as one coherent state → a class.
- Reach for `@property` only when you specifically need the browser to animate a custom-property value.

## Common mistakes

- **Treating a custom property like a Sass variable**, and being surprised when a value set inline from Liquid actually works dynamically per-instance. That behavior is the whole point, not a bug.
- **Omitting a fallback value** on a conditionally-set custom property, leaving the declaration silently ignored when the property isn't set.
- **Exposing five separate custom properties for one coherent layout state**, instead of a single class.
- **Assuming a custom property is automatically animatable.** Without `@property`, the browser can't interpolate between two arbitrary string values.

## Quick Reference

- Custom properties resolve at render time (unlike Sass variables), so they can be set dynamically, per-instance, from Liquid.
- Scope: `:root` for global tokens, a specific selector for component-scoped values.
- Always provide a `var()` fallback for conditionally-set properties.
- One varying property → custom property. Several together → class.
- `@property` adds a type, enabling smooth animation, and degrades gracefully where unsupported.

## Further Reading

- [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/): the token structure custom properties implement
- [CSS in Shopify: stylesheet, style & Subsetting](/css/css-in-shopify/): where custom properties can and can't be set from Liquid
- [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (MDN)
- [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) (MDN)
