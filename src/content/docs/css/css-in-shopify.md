---
title: "CSS in Shopify: stylesheet, style & Subsetting"
description: The three ways CSS gets into a theme, how Shopify subsets stylesheet output per page, and the Theme Check rule that catches broken cross-file dependencies.
---

Shopify has three distinct ways to ship CSS in a theme, and they behave differently enough that picking the wrong one causes real bugs, not just style preferences. This page covers all three, plus the subsetting mechanism that makes `{% stylesheet %}` fast.

## The three mechanisms

| Mechanism | Where it lives | Liquid rendered inside? | Subsetted per page? |
|---|---|---|---|
| `{% stylesheet %}` | Inside a section/block/snippet `.liquid` file | No | Yes, see below |
| `{% style %}` | Inside a section/block/snippet `.liquid` file | Yes | No, always included |
| Asset stylesheet (`assets/*.css` via `stylesheet_tag`) | A `.css` file, linked from a layout/template | No (it's a plain CSS file) | No, loaded wherever you reference it |

### `{% stylesheet %}`: static, component-scoped CSS

This is where most of a component's CSS belongs:

```liquid
{% comment %} sections/testimonials.liquid {% endcomment %}
<div class="testimonials">...</div>

{% stylesheet %}
.testimonials {
  display: grid;
  gap: var(--space-md);
}
{% endstylesheet %}
```

Each section, block, or snippet file can have **only one** `{% stylesheet %}` tag, a second one is a syntax error. Shopify collects the content from every file's `{% stylesheet %}` tag into a single generated `styles.css`, injected automatically via `content_for_header`.

:::caution[Liquid isn't rendered inside `{% stylesheet %}`]
This is the single most common mistake with this tag. Writing `{{ settings.color_primary }}` inside a `{% stylesheet %}` block doesn't interpolate, it can cause a syntax error or simply fail to apply. If a value needs to come from a Liquid object or setting, reference a custom property from *outside* the tag instead (an inline `style` attribute, or `{% style %}`), and consume it with `var()` inside `{% stylesheet %}`:

```liquid
{% comment %} ✅ RIGHT — the dynamic value is set outside {% stylesheet %},
   consumed with var() inside it {% endcomment %}
<div class="hero" style="--hero-bg: {{ section.settings.background_color }};">

{% stylesheet %}
.hero { background: var(--hero-bg); }
{% endstylesheet %}
```
:::

### `{% style %}`: live-updating CSS for the theme editor

`{% style %}` generates a real `<style data-shopify>` tag, rendered inline, with Liquid fully processed:

```liquid
{% style %}
  .hero-{{ section.id }} {
    background-color: {{ section.settings.background_color }};
  }
{% endstyle %}
```

Its specific purpose: when a merchant references a **color setting** inside `{% style %}`, the theme editor updates that CSS live as they drag the color picker, without a full page refresh. That live-preview behavior is documented specifically for color settings. Use `{% style %}` for that narrow case, values that benefit from instant visual feedback in the editor, and keep everything else in `{% stylesheet %}`.

```liquid
{% comment %} ❌ WRONG — a component's whole CSS in {% style %} "just in
   case," when only the color actually needs live-preview {% endcomment %}
{% style %}
  .hero-{{ section.id }} {
    background-color: {{ section.settings.background_color }};
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
  }
{% endstyle %}

{% comment %} ✅ RIGHT — only the live-preview-relevant value is in
   {% style %}; the rest of the component's CSS stays in {% stylesheet %},
   which is subsetted and cacheable {% endcomment %}
{% style %}
  .hero-{{ section.id }} { --hero-bg: {{ section.settings.background_color }}; }
{% endstyle %}
{% stylesheet %}
.hero { background: var(--hero-bg); display: grid; gap: 2rem; grid-template-columns: repeat(2, 1fr); }
{% endstylesheet %}
```

`{% style %}` output isn't subsetted the way `{% stylesheet %}` is, and it can't be cached as an external stylesheet the way asset files can. Overusing it bloats every page's HTML with CSS that should have stayed static.

### Asset stylesheets: truly global, cross-page CSS

For CSS genuinely shared across many unrelated files (resets, base typography, utility classes), a plain `.css` file in `assets/`, linked once in your layout, is the right tool:

```liquid
{{ 'base.css' | asset_url | stylesheet_tag }}
```

Asset stylesheets aren't subsetted. They load wherever you reference them, cache like any other static asset, and their classes are exempt from the subsetting check described below.

## How subsetting works

Shopify doesn't ship every file's `{% stylesheet %}` CSS on every page. Instead, it identifies the **render tree**, the set of section, block, and snippet files actually rendered on that specific page, and includes only their combined CSS in `styles.css`. A collection page never downloads CSS that only a "Testimonials" section would use, if that section never appears on it.

A parent file's styles are always included alongside a child it renders with `{% render %}`, since the parent is guaranteed to be in the render tree whenever the child is:

```liquid
{% comment %} sections/collection.liquid {% endcomment %}
{% stylesheet %}
.collection-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
.collection-grid__item { border: 1px solid var(--color-border); }
{% endstylesheet %}
<div class="collection-grid">
  {% for product in collection.products %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

```liquid
{% comment %} snippets/product-card.liquid — safe: uses a class defined
   by its parent, which is always in the render tree alongside it {% endcomment %}
<div class="collection-grid__item">{{ product.title }}</div>
```

### The pattern that breaks: cross-file CSS dependencies

A class defined in one file's `{% stylesheet %}` but used in a *different, unrelated* file is unsafe, if the defining file isn't in that page's render tree, the styles simply won't be there:

```liquid
{% comment %} sections/header.liquid {% endcomment %}
{% stylesheet %}
.site-banner { background: var(--color-accent); padding: 0.5rem 1rem; }
{% endstylesheet %}
<div class="site-banner">{{ section.settings.announcement }}</div>
```

```liquid
{% comment %} ❌ sections/footer.liquid — uses .site-banner but never
   defines it. Relies on header.liquid happening to be on the same page.
   On a page without a header section, this is unstyled. {% endcomment %}
<div class="site-banner">{{ section.settings.promo_text }}</div>
```

Fix it one of two ways: define the class in each file that uses it (or in a shared parent), or, if the class is genuinely global, move it to an asset stylesheet instead, since those aren't subsetted.

### Theme Check catches this automatically

The `ValidScopedCSSClass` check (enabled by default) flags a class used in an HTML `class` attribute when it's defined in another file's `{% stylesheet %}` and that file isn't a direct ancestor in the render tree:

```
CSS class `site-banner` is defined in another liquid file's stylesheet tags
that isn't an explicit ancestor: `sections/header.liquid`
```

Treat this warning as a real bug, not noise. It means the flagged class will be silently unstyled on some page that doesn't happen to render the defining file. Classes defined in `assets/*.css` are allowlisted and never trigger it.

## Instance-specific CSS

Both `{% stylesheet %}` and `{% javascript %}` output are injected **once per file**, not once per instance of that file on the page. If a section is rendered twice on one page and needs per-instance CSS values (not just per-instance JS data attributes), use an inline `style` attribute or `{% style %}` with `{{ section.id }}` in the selector, exactly as shown in the `{% style %}` example above.

## Best practices

- Default to `{% stylesheet %}` for a component's CSS. Reach for `{% style %}` only for the specific values that need theme-editor live preview, mainly colors.
- Never write `{{ }}` Liquid interpolation directly inside `{% stylesheet %}`. Set a custom property outside it instead, and consume it with `var()` inside.
- Keep a `{% stylesheet %}` file's classes self-contained, used only within that file or files it directly renders, so subsetting works correctly.
- Move truly global, cross-page CSS (resets, utility classes) to an asset stylesheet, not a shared `{% stylesheet %}` dependency.
- Run `shopify theme check` and treat `ValidScopedCSSClass` warnings as real bugs.

## Common mistakes

- **Writing Liquid interpolation directly inside `{% stylesheet %}`.** It isn't rendered there and can cause a syntax error.
- **Using `{% style %}` for a component's entire CSS** instead of just the live-preview-relevant values, which bloats every page's HTML with CSS that should have been static and subsetted.
- **Defining a class in one file and using it in an unrelated file**, which breaks silently the moment a page doesn't render the defining file.
- **Adding a second `{% stylesheet %}` or `{% javascript %}` tag to one file.** Each file gets exactly one; a second is a syntax error.

## Quick Reference

- `{% stylesheet %}`: static, subsetted per render tree, no Liquid rendering, one per file.
- `{% style %}`: live-updating (color settings especially), full Liquid rendering, not subsetted, use sparingly.
- Asset stylesheets: truly global CSS, not subsetted, cached like any static file.
- Keep a file's `{% stylesheet %}` classes self-contained to that file or its rendered children. Cross-file dependencies break when the defining file isn't in the render tree.
- `shopify theme check`'s `ValidScopedCSSClass` rule catches broken cross-file dependencies automatically.

## Further Reading

- [CSS Performance](/css/css-performance/): why subsetting matters for load time, and how it fits into critical CSS strategy
- [CSS Custom Properties (Variables)](/css/css-custom-properties/): the `var()`-based bridge between `{% style %}`/inline values and `{% stylesheet %}` CSS
- [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) (shopify.dev)
- [Stylesheet content subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting) (shopify.dev)
- [`{% style %}` tag](https://shopify.dev/docs/api/liquid/tags/style) (shopify.dev)
