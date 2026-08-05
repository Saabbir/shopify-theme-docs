---
title: CSS Style Guide
description: Global CSS, component-scoped stylesheets, custom properties, logical properties, and naming rules.
---

We write plain, native CSS only. That means no Sass or SCSS, and no CSS-in-JS.

Modern CSS already gives us everything those tools used to be needed for: custom properties, container queries, `:has()`, and nesting. We get all of that without needing a build step.

## Global CSS vs. component-scoped CSS

| Layer | Lives in | Contains |
|---|---|---|
| **Global** | `assets/base.css` (or similar, loaded in `layout/theme.liquid`) | Design tokens (custom properties), resets, typography defaults, utility classes used across many components |
| **Component-scoped** | A `{% stylesheet %}` tag inside the section/block/snippet `.liquid` file itself | Everything specific to that one component, its layout, its states, anything not reused elsewhere |

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

Shopify automatically removes duplicate `{% stylesheet %}` output. It also only loads this CSS on pages that actually render the component. This gives you the benefit of keeping styles right next to the component they belong to (developers call this "colocation"), without making the global CSS file bigger for a section that's only used on one template.

| ✅ Do | ❌ Don't |
|---|---|
| Put a token used by 3+ components in the global stylesheet | Duplicate the same spacing/color value across several `{% stylesheet %}` blocks |
| Put layout specific to one section inside that section's `{% stylesheet %}` | Add every section's CSS to one global file "to keep it simple" |
| Reference global tokens (`var(--space-md)`) from inside scoped CSS | Hardcode a value in scoped CSS that already exists as a global token |

## Design tokens: CSS custom properties

In CSS, we define design tokens as custom properties:

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

Use this rule to decide whether a merchant-facing setting (something a store owner can change in the theme editor) should become an inline custom property or a CSS class:

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

"Logical properties" are CSS properties like `margin-inline-start`. Instead of describing a fixed side, like "left" or "right," they describe direction based on reading order, using "start" and "end."

Use a logical property everywhere a physical property has a logical equivalent. This is what makes your layout work correctly, automatically, in right-to-left (RTL) languages like Arabic or Hebrew. See [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/) for more:

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

## Native CSS nesting: fine for a component's own scope

Browsers support CSS nesting on their own now, so you don't need a preprocessor for it. Horizon's own stylesheets (Horizon is Shopify's reference theme) use nesting for the case it's good at: styling a component's states or children without repeating the parent selector every time:

```css
/* ✅ RIGHT — nesting scoped to one component's own rule,
   matches how Horizon's shipped CSS actually uses it */
.resource-list:not(.hidden--desktop) {
  .collection-card__image {
    aspect-ratio: 1;
  }

  &:not(.collection-card--image-bg) .collection-card__content {
    height: auto;
  }
}
```

Keep nesting shallow, just one or two levels, and scoped to a single component's own selectors. Think of it as a way to show "this lives inside that." It's not a replacement for BEM's flat naming style, which we explain below.

Don't nest three or four levels deep just to win a specificity fight. That's exactly the problem BEM's flat class names are meant to avoid.

## Naming: BEM-ish, kebab-case

We don't require strict BEM, but we follow the same block/element/modifier shape, because it keeps class names predictable and greppable:

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

If CSS can do it without a script, use CSS:

| Need | Reach for | Not |
|---|---|---|
| Responsive grid of cards | `grid-template-columns: repeat(auto-fit, minmax(...))` | A JS-computed column count |
| Scroll-snapping carousel | `scroll-snap-type` / `scroll-snap-align` | A JS carousel library for basic snapping |
| Container-based responsive behavior (a card that reflows based on its own width, not viewport width) | Container queries (`@container`) | A resize-observer JS workaround |
| Conditional styling based on a sibling/child's state | `:has()` where supported, or a class toggled by minimal JS | Reaching for a JS framework's reactivity for a CSS-only problem |

## Best practices

- Turn any reusable value into a custom property in the global stylesheet before it gets used a second time. Adding tokens after three components have already hardcoded the same value is more work than starting with the token in the first place.
- Use logical properties by default, everywhere. Treat a physical property in new CSS as something to double-check, not your default choice.
- Keep component CSS in `{% stylesheet %}`, next to the component, unless a value is genuinely shared elsewhere. Keeping things together like this lets you read a component's whole behavior, its markup, styling, and JS, in one file.
- Test new sections with `dir="rtl"` in your browser's dev tools now and then, not just right before Theme Store submission. Logical-property mistakes are cheap to catch early, but easy to miss if you never actually look.

## Common mistakes

- **Hardcoding a color or spacing value that already exists as a token.** The value drifts out of sync the next time the token changes, because this one spot wasn't using it.
- **Using physical properties (`margin-left`) out of habit.** This passes review fine in English, then breaks silently the first time the theme runs in a right-to-left market.
- **Exposing five separate custom properties for what's really one layout state**, instead of a single class. This is harder for merchants to understand (if exposed as settings) and harder for developers to maintain.
- **Putting every section's CSS in one global file.** This loses the benefit of keeping styles next to their component, and every page ends up loading CSS it doesn't use.

## Quick Reference

- Global tokens (custom properties) live in `assets/base.css`. Component CSS lives in `{% stylesheet %}`, next to its markup.
- One property varies → use a custom property. Several vary together → use a class.
- Use logical properties everywhere a physical/logical pair exists. This is what makes RTL work.
- Naming: kebab-case, BEM-shaped (`block__element--modifier`).
- Native CSS nesting is fine, kept shallow and scoped to one component's own selectors. It's not a substitute for BEM's flat naming.
- Prefer modern CSS (grid, scroll-snap, container queries, `:has()`) over JS for anything CSS can do alone.

## Further Reading

- [Spacing](/spacing/), the dedicated section for the spacing scale, `range` settings, and logical properties in more depth
- [Fonts](/fonts/) and [Colors](/colors/), the dedicated sections for those token types
- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) (MDN)
- [`{% stylesheet %}` tag](https://shopify.dev/docs/api/liquid/tags/stylesheet) (shopify.dev)
