---
title: CSS Architecture, Naming & Logical Properties
description: Global vs. component-scoped CSS, BEM-ish naming, and logical properties for RTL support.
---

**TL;DR:** Global vs. component-scoped CSS, BEM-ish naming, and logical properties for RTL support.

We write plain, native CSS only. No Sass or SCSS, no CSS-in-JS. Modern CSS already gives us everything those tools used to be needed for: custom properties, container queries, `:has()`, and nesting, all covered elsewhere in this section. This page covers how we organize and name what we write.

## Global CSS vs. component-scoped CSS

| Layer | Lives in | Contains |
|---|---|---|
| **Global** | `assets/base.css` (or similar, loaded in `layout/theme.liquid`) | Design tokens (custom properties), resets, typography defaults, utility classes used across many components |
| **Component-scoped** | A `{% stylesheet %}` tag inside the section/block/snippet `.liquid` file itself | Everything specific to that one component: its layout, its states, anything not reused elsewhere |

Shopify only loads a component's `{% stylesheet %}` CSS on pages that actually render it, see [CSS in Shopify](/css/css-in-shopify/) for exactly how that subsetting works. This gives you the benefit of keeping styles right next to the component they belong to (developers call this "colocation"), without bloating the global file for a section only used on one template.

| ✅ Do | ❌ Don't |
|---|---|
| Put a token used by 3+ components in the global stylesheet | Duplicate the same spacing/color value across several `{% stylesheet %}` blocks |
| Put layout specific to one section inside that section's `{% stylesheet %}` | Add every section's CSS to one global file "to keep it simple" |
| Reference global tokens (`var(--space-md)`) from inside scoped CSS | Hardcode a value in scoped CSS that already exists as a global token |

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

Predictable naming also keeps [CSS subsetting](/css/css-in-shopify/#how-subsetting-works) safe: a class name tied to its file makes it obvious, at a glance, whether that class is meant to be used elsewhere.

## Logical properties (required for RTL)

"Logical properties" are CSS properties like `margin-inline-start`. Instead of describing a fixed side, like "left" or "right," they describe direction based on reading order, using "start" and "end." Use a logical property everywhere a physical property has a logical equivalent, it's what makes your layout work correctly, automatically, in right-to-left languages like Arabic or Hebrew. See [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/) for the broader picture.

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

Test new sections with `dir="rtl"` in your browser's dev tools regularly, not just right before Theme Store submission. Logical-property mistakes are cheap to catch early, but easy to miss if you never actually look. See [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/) for the spacing-specific version of this rule, including `gap` over margin hacks.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Keep component CSS in `{% stylesheet %}`, next to the component, unless a value is genuinely shared elsewhere. This lets you read a component's whole behavior, markup, styling, and JS, in one file. | **Putting every section's CSS in one global file.** This loses the benefit of colocation, and every page ends up loading CSS it doesn't use. |
| Turn any reusable value into a custom property in the global stylesheet before it gets used a second time. | **Hardcoding a color or spacing value that already exists as a token.** It drifts out of sync the next time the token changes, because this one spot wasn't using it. |
| Name classes in a BEM-ish, kebab-case shape (`block__element--modifier`), and tie the block name to the component's file where practical. | **Using physical properties (`margin-left`) out of habit.** This passes review fine in English, then breaks silently the first time the theme runs in a right-to-left market. |
| Use logical properties by default, everywhere. Treat a physical property in new CSS as something to double-check, not your default choice. | **Giving a component's root element a generic class** (`.wrapper`, `.container`) with no relation to what it actually is. |

## Key takeaways
- Global tokens (custom properties) live in `assets/base.css`. Component CSS lives in `{% stylesheet %}`, next to its markup.
- Naming: kebab-case, BEM-shaped (`block__element--modifier`).
- Use logical properties everywhere a physical/logical pair exists. This is what makes RTL work.

## Further reading

- [CSS in Shopify: stylesheet, style & Subsetting](/css/css-in-shopify/): how component-scoped CSS is loaded and subsetted per page
- [Cascade, Specificity & the Box Model](/css/cascade-specificity-and-box-model/): why avoiding ID selectors and keeping naming flat matters
- [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/): logical properties applied specifically to spacing, plus the `gap` rule
- [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/): the broader RTL picture logical properties support
- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) (MDN)
