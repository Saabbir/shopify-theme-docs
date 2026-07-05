---
title: CSS Style Guide
description: Global CSS, component-scoped stylesheets, custom properties, logical properties, and naming conventions.
---

Native CSS only — no Sass/SCSS, no CSS-in-JS. Modern CSS (custom properties, container queries, `:has()`, nesting) gives us everything a preprocessor used to be needed for, without a build step.

## Global CSS vs. component-scoped CSS

| Layer | Lives in | Contains |
|---|---|---|
| **Global** | `assets/base.css` (or similar, loaded in `layout/theme.liquid`) | Design tokens (custom properties), resets, typography defaults, utility classes used across many components |
| **Component-scoped** | A `{% stylesheet %}` tag inside the section/block/snippet `.liquid` file itself | Everything specific to that one component — its layout, its states, anything not reused elsewhere |

```liquid
{% comment %} sections/testimonials.liquid {% endcomment %}
<div class="testimonials">
  ...
</div>

{% stylesheet %}
.testimonials {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
{% endstylesheet %}
```

`{% stylesheet %}` output is automatically deduplicated and only loaded on pages that actually render the component — you get colocation without paying a global-bundle-size cost for a section only used on one template.

| ✅ Do | ❌ Don't |
|---|---|
| Put a token used by 3+ components in the global stylesheet | Duplicate the same spacing/color value across several `{% stylesheet %}` blocks |
| Put layout specific to one section inside that section's `{% stylesheet %}` | Add every section's CSS to one global file "to keep it simple" |
| Reference global tokens (`var(--space-md)`) from inside scoped CSS | Hardcode a value in scoped CSS that already exists as a global token |

## Design tokens: CSS custom properties

Every reusable value — color, spacing, radius, shadow, type size — is a custom property, defined once, referenced everywhere:

```css
:root {
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --color-accent: #2c5f4f;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  --radius-sm: 4px;
  --radius-md: 8px;
}
```

### One CSS property changing → a custom property. Several changing together → a class.

This is the rule that decides whether a merchant-facing setting becomes an inline custom property or a CSS class:

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

## Logical properties (required for RTL)

Use logical properties everywhere a physical property has a logical equivalent — this is what makes layout correct automatically in right-to-left languages (see [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/)):

| ❌ Physical (breaks in RTL) | ✅ Logical (works in both directions) |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `left: 0` / `right: 0` | `inset-inline-start: 0` / `inset-inline-end: 0` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |

```css
/* ❌ WRONG — hardcodes a left-to-right assumption */
.card {
  margin-left: var(--space-md);
  text-align: left;
}

/* ✅ RIGHT — flips automatically under dir="rtl" */
.card {
  margin-inline-start: var(--space-md);
  text-align: start;
}
```

## Naming: BEM-ish, kebab-case

We don't require strict BEM, but the same shape — block, element, modifier — keeps class names predictable and greppable:

```css
.testimonials { }              /* block */
.testimonials__heading { }     /* element */
.testimonials--compact { }     /* modifier */
```

| ✅ Do | ❌ Don't |
|---|---|
| `.product-card__price` | `.productCardPrice` (camelCase in CSS) or `.price1` |
| `.product-card--sold-out` for a state variant | A second, unrelated class like `.grayed-out` that isn't obviously tied to `.product-card` |
| Match the class name to the component's file name where practical (`testimonials.liquid` → `.testimonials`) | Give a component's root element a generic class (`.wrapper`, `.container`) with no relation to what it is |

## Layout: modern CSS over JavaScript

Prefer CSS for anything CSS can do without a script:

| Need | Reach for | Not |
|---|---|---|
| Responsive grid of cards | `grid-template-columns: repeat(auto-fit, minmax(...))` | A JS-computed column count |
| Scroll-snapping carousel | `scroll-snap-type` / `scroll-snap-align` | A JS carousel library for basic snapping |
| Container-based responsive behavior (a card that reflows based on its own width, not viewport width) | Container queries (`@container`) | A resize-observer JS workaround |
| Conditional styling based on a sibling/child's state | `:has()` where supported, or a class toggled by minimal JS | Reaching for a JS framework's reactivity for a CSS-only problem |

## Best practices

- Default every reusable value to a custom property in the global stylesheet before it's used a second time — retrofitting tokens after three components have hardcoded the same value is more work than starting with the token.
- Use logical properties by default, everywhere — treat a physical property in new CSS as something to double-check, not the default choice.
- Keep component CSS colocated in `{% stylesheet %}` unless a value is genuinely shared — colocation makes a component's full behavior (markup, styling, JS) readable in one file.
- Run new sections with `dir="rtl"` in dev tools periodically, not just at Theme Store submission time — logical-property mistakes are cheap to catch early and easy to miss without actually looking.

## Common mistakes

- **Hardcoding a color/spacing value that already exists as a token** — the value drifts the next time the token changes, since this one instance wasn't using it.
- **Using physical properties (`margin-left`) by habit** — passes review in English, breaks silently the first time the theme is used in a RTL market.
- **Exposing five separate custom properties for one coherent layout state** instead of a single class — harder for merchants to reason about (if exposed as settings) and harder for developers to maintain.
- **Putting every section's CSS in one global file** — loses colocation, and every page pays for CSS it doesn't use.

## Quick Reference

- Global tokens in `assets/base.css` (custom properties). Component CSS in `{% stylesheet %}`, colocated with its markup.
- One property varies → custom property. Several vary together → a class.
- Logical properties everywhere a physical/logical pair exists — this is what makes RTL work.
- Naming: kebab-case, BEM-shaped (`block__element--modifier`).
- Prefer modern CSS (grid, scroll-snap, container queries, `:has()`) over JS for anything CSS can do alone.

## Further Reading

- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) — MDN
- [`{% stylesheet %}` tag](https://shopify.dev/docs/api/liquid/tags/stylesheet) — shopify.dev
