---
title: Font Accessibility & Performance
description: Readable sizes and line-height, and why font_picker's built-in loading beats a custom web font import.
---

Typography choices affect two things reviewers and real users both notice: whether text is comfortable to read, and how much a font adds to page load. Both are checkable, not subjective.

## Readability: size, line-height, and line length

| Guideline | Target |
|---|---|
| Body text minimum size | 16px (`1rem`) or larger. Smaller body text is a common source of complaints, especially on mobile |
| Line-height for body text | 1.4–1.6 (unitless, meaning relative to the font size) |
| Line length | Roughly 50–75 characters per line for body text. Much longer, and readers lose their place jumping to the next line |

These aren't Shopify-specific rules, they're general typography practice that Theme Store review and real users both expect. A theme that technically passes every schema check but ships 13px body text still fails the actual goal: text people can read comfortably.

```css
/* ❌ WRONG — small body text, tight line-height, no line-length constraint */
.rte { font-size: 0.8125rem; line-height: 1.1; }

/* ✅ RIGHT — comfortable size and line-height, width constrained
   so lines don't run edge-to-edge on wide screens */
.rte {
  font-size: 1rem;
  line-height: 1.5;
  max-width: 65ch;
}
```

`ch` is a CSS unit equal to the width of the `0` character in the current font, which makes it a convenient way to cap line length without hardcoding a pixel value that ignores the actual font.

## Distinct heading levels

This overlaps with the general accessibility checklist (see [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/)): h1 through h6 should each look visually different from one another, using the type scale from [Type Scale & Typography Tokens](/fonts/type-scale-and-typography-tokens/). A heading level that's styled identically to the level above or below it removes a visual cue sighted users rely on, on top of the semantic issue of using heading levels incorrectly.

## Performance: use font_picker instead of a custom web font import

| ✅ Do | ❌ Don't |
|---|---|
| Use the theme's `font_picker` setting for typography | Load an extra custom web font via `@import` or a third-party CDN link |
| Let `font_face` (see [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/)) handle font loading | Hand-write your own `@font-face` rules pointing at an external font host |
| Load only the weights/styles the theme actually uses | Load every weight and style "just in case" |

`font_picker` fonts are served from Shopify's own CDN, already optimized (WOFF2 with WOFF fallback) and cached alongside the rest of the store's assets. A custom `@import` from Google Fonts or another external host adds an extra DNS lookup, an extra connection, and a render-blocking request that Shopify's own delivery avoids. See [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/) for how font loading fits into the broader performance picture.

### Only load the weights you actually use

Every weight and style `font_modify` derives (see [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/#deriving-weights-and-styles-font_modify)) is a separate file the browser has to fetch. Generate `font_face` declarations only for the variants your CSS actually references, a base weight and a bold weight, for example, not the full range of `100` through `900` "in case a component needs it someday."

### `font-display: swap` avoids invisible text during load

```liquid
{{ settings.type_header_font | font_face: font_display: 'swap' }}
```

Without `font_display: 'swap'`, some browsers hide text entirely until the custom font finishes loading (a pattern often called a "flash of invisible text"). `swap` shows the fallback font immediately, then swaps in the real font once it's ready, so text is always visible.

## Best practices

- Keep body text at 16px or larger, with 1.4–1.6 line-height, and cap line length around 65 characters for long-form text.
- Make sure every heading level is visually distinct from its neighbors, following the type scale.
- Use `font_picker` and `font_face` instead of a custom web font import. Shopify's own font delivery is already optimized.
- Generate `@font-face` declarations only for the weights and styles actually used in CSS, and pass `font_display: 'swap'` on each.

## Common mistakes

- **Shipping body text smaller than 16px** to fit more content on screen, at the cost of readability.
- **Loading a custom web font via `@import` or an external CDN link** instead of using `font_picker`, adding avoidable render-blocking requests.
- **Generating `font_face` for every possible weight and style** instead of only the ones the theme's CSS actually references.
- **Omitting `font_display: 'swap'`**, which can leave text invisible during font load on some browsers.

## Quick Reference

- Body text: 16px+ minimum, 1.4–1.6 line-height, ~65ch max line length.
- Every heading level visually distinct from its neighbors.
- Use `font_picker`/`font_face`, never a custom `@import` or external font host.
- Generate `@font-face` only for weights/styles actually used, with `font_display: 'swap'`.

## Further Reading

- [Typography in Liquid & CSS](/fonts/typography-in-liquid-and-css/): the `font_face`/`font_modify` filters referenced above
- [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/): the broader accessibility checklist this page's readability section belongs to
- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/): where font loading fits into overall page performance
