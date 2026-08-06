---
title: CSS
description: Everything about writing CSS in Solis — units, variables, cascade, architecture, Shopify-specific mechanics, modern features, and performance, all in one place.
---

**TL;DR:** Everything about writing CSS in Solis — units, variables, cascade, architecture, Shopify-specific mechanics, modern features, and performance, all in one place.

Everything about CSS, in one place. If you have a question about how to write, structure, or reason about CSS in Solis, it should be answered somewhere in this section.

## What's in this section

| Page | Answers |
|---|---|
| [CSS Units: rem, em & the 62.5% Technique](/css/css-units-rem-em/) | When to use `rem` vs `em` vs `px`, and the 62.5% root font-size trick |
| [Cascade, Specificity & the Box Model](/css/cascade-specificity-and-box-model/) | Why one rule beats another, calculating specificity by hand, `box-sizing: border-box` |
| [CSS Custom Properties (Variables)](/css/css-custom-properties/) | Runtime vs. compile-time, fallback values, the bridge between Liquid settings and CSS |
| [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/) | Global vs. component-scoped CSS, BEM-ish naming, logical properties for RTL |
| [CSS in Shopify: stylesheet, style & Subsetting](/css/css-in-shopify/) | `{% stylesheet %}` vs `{% style %}` vs asset stylesheets, and how per-page subsetting works |
| [Modern CSS Features](/css/modern-css-features/) | Container queries, `:has()`, nesting, `@layer`, subgrid, and other Baseline-available features |
| [CSS Performance](/css/css-performance/) | Critical CSS via subsetting, containment, animating cheap properties, `will-change` |

## How the pieces fit together

Start with [units](/css/css-units-rem-em/): almost every value in this handbook's CSS is a `rem`, built on a 62.5% root font-size. [Custom properties](/css/css-custom-properties/) turn those values into reusable, runtime-resolved tokens, the mechanism behind every domain's design tokens (see [Colors](/colors/), [Fonts](/fonts/), [Spacing](/spacing/)). [Cascade & specificity](/css/cascade-specificity-and-box-model/) explains how conflicting rules actually resolve, which is what [architecture and naming](/css/css-architecture-naming-and-logical-properties/) is designed around. [CSS in Shopify](/css/css-in-shopify/) covers the platform-specific delivery mechanism, `{% stylesheet %}`, `{% style %}`, and per-page subsetting, that everything above ultimately gets loaded through. [Modern features](/css/modern-css-features/) covers the newer tools worth reaching for. And [performance](/css/css-performance/) ties it together: how Shopify's own delivery mechanism already solves most of what "critical CSS" traditionally means.

## Quick answers

**"rem, em, or px?"** `rem` by default. `em` when a value should scale with a specific element's own font size. `px` for things that shouldn't scale at all, like hairline borders. See [CSS Units](/css/css-units-rem-em/).

**"Why set `html { font-size: 62.5% }`?"** So `1rem = 10px`, making rem math trivial (`1.6rem = 16px`), while still respecting a visitor's own browser font-size preference. See [CSS Units](/css/css-units-rem-em/#the-625-technique-making-rem-math-easy).

**"Why doesn't my `{{ setting }}` work inside `{% stylesheet %}`?"** Liquid isn't rendered inside that tag. Set a custom property outside it, and consume it with `var()` inside. See [CSS in Shopify](/css/css-in-shopify/#stylesheet-static-component-scoped-css).

**"`{% stylesheet %}` or `{% style %}`?"** `{% stylesheet %}` for almost everything. `{% style %}` only for values that need live preview in the theme editor, mainly colors. See [CSS in Shopify](/css/css-in-shopify/).

**"Why isn't my CSS override working?"** Almost always specificity or source order. See [Cascade, Specificity & the Box Model](/css/cascade-specificity-and-box-model/).

**"Media query or container query?"** If the real question is "how big is this component's own space," use a container query, not a media query. See [Modern CSS Features](/css/modern-css-features/#container-queries-respond-to-a-components-own-size).

**"Do I need a critical-CSS build step?"** No. Shopify's stylesheet subsetting already does the equivalent job, as long as `{% stylesheet %}` scoping stays disciplined. See [CSS Performance](/css/css-performance/).

## Further Reading

- [Style Guides](/style-guides/): the broader section this one was split out of, covering JavaScript, Web Components, and Liquid style too
- [Colors](/colors/), [Fonts](/fonts/), [Spacing](/spacing/): the token domains built on the mechanisms covered here
- [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/): the full performance picture beyond CSS
