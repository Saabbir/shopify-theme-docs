---
title: Modern Shopify Features to Utilize
description: Current platform capabilities worth building on — beyond the baseline architecture already covered in this section.
---

[Folder Structure](/codebase-structure/folder-structure/) through [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) cover the architecture every theme needs. This page is different: it's a survey of specific, current Shopify platform features that aren't strictly required, but are worth actively reaching for because they solve real problems better than an older or more manual approach would.

## Metaobjects, used globally in the theme editor

Metaobjects (custom structured data types a merchant defines — e.g. a "Brand" object with a name, logo, and story) can now be connected and used broadly across the theme editor via **dynamic sources** — a merchant can pick a metaobject field as a section/block's content source directly in the editor, without a developer wiring up a specific Liquid reference for that one use case.

```liquid
{% comment %} A block that accepts a dynamic source, rather than a
   hardcoded metaobject reference — a merchant picks which metaobject
   field feeds this block, directly in the editor {% endcomment %}
{{ block.settings.content }}
```

```json
{ "type": "text", "id": "content", "label": "t:blocks.brand_story.settings.content.label" }
```

When a setting is written generically enough (a `text`/`richtext`/`image_picker` setting, without assuming a specific hardcoded metaobject type), a merchant can connect it to *any* compatible metaobject field via dynamic source selection in the editor — meaning the same block can pull from a "Brand," a "Size Guide," or any other metaobject definition without you writing separate code for each. This is a meaningfully more flexible pattern than a section hardcoded to read one specific metaobject type, and worth reaching for whenever a block's content is conceptually "some structured data a merchant defines," rather than something inherently theme-specific.

## Theme blocks nested arbitrarily deep

Covered fully in [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — worth calling out here specifically as a "use this, don't reach for the old pattern" reminder: a block containing other blocks (a "Group" block holding a "Text" block and an "Image" block, arranged and reordered freely by a merchant) replaces what used to require bespoke, single-purpose section schema for every layout variation. If you find yourself building a section with rigid, non-reorderable sub-content, check whether nested theme blocks would let a merchant achieve the same result more flexibly instead.

## `{% style %}` — live-updating CSS in the editor

Distinct from `{% stylesheet %}` (static, compiled CSS for a component): `{% style %}` is specifically for CSS that should **live-update as a merchant adjusts a color setting in the editor**, without a full section re-render.

```liquid
{% style %}
  .hero-{{ section.id }} {
    background-color: {{ section.settings.background_color }};
  }
{% endstyle %}
```

Use `{% style %}` specifically for settings-driven values (especially colors) where instant visual feedback while a merchant drags a color picker matters; use `{% stylesheet %}` for everything else (the bulk of a component's actual CSS).

## The View Transitions API for section/page changes

The View Transitions API lets you animate between two DOM states (e.g. a product image swap on variant change, or a full page navigation) with a simple CSS-driven cross-fade/morph, instead of hand-rolled JS animation logic:

```css
::view-transition-old(product-image),
::view-transition-new(product-image) {
  animation-duration: 0.3s;
}
```

```javascript
if (document.startViewTransition) {
  document.startViewTransition(() => updateProductImage(newImage));
} else {
  updateProductImage(newImage); // fallback for unsupported browsers
}
```

Always feature-detect (`document.startViewTransition`) and fall back to the immediate update for unsupported browsers — this is a progressive enhancement, not a required behavior.

## `{% content_for %}` for theme blocks

Covered in [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — flagged here as the modern replacement for what used to require a fixed, hardcoded list of block types in a section's markup. `{% content_for 'blocks' %}` renders whatever blocks a merchant has actually added, in whatever order, without the section template needing to know the specific set of block types in advance.

## Native HTML elements over custom-built equivalents

Not new to Shopify specifically, but worth calling out as a *current* best practice this handbook leans on repeatedly: `<dialog>` for modals, `<details>`/`<summary>` for disclosures, native form validation. These are stable, well-supported, and remove an entire category of accessibility/JS-maintenance work — see [Clean Code Principles](/style-guides/clean-code-principles/) and [Third-Party Libraries](/style-guides/third-party-libraries/) for the fuller reasoning.

## Deciding whether a "modern feature" is worth adopting

Not every new platform capability is automatically worth using in every theme. A quick filter:

| Ask | If yes → |
|---|---|
| Does it replace something we'd otherwise hand-build (a live-updating color preview, a flexible content block)? | Likely worth adopting |
| Does it require a fallback for meaningfully-used older browsers, and do we have one? | Adopt, with the fallback in place |
| Is it primarily "new" rather than "actually solves a problem we have"? | Worth knowing about, not necessarily worth reaching for on the next section you build |

## Best practices

- Prefer dynamic-source-compatible settings (generic `text`/`richtext`/`image_picker`) over a hardcoded metaobject reference whenever a block's content is conceptually generic structured data.
- Use `{% style %}` specifically for settings-driven values that benefit from live preview (colors especially); keep the bulk of CSS in `{% stylesheet %}`.
- Feature-detect the View Transitions API and always provide a working fallback — don't assume universal support.

## Common mistakes

- **Hardcoding a metaobject reference** when a generic, dynamic-source-compatible setting would let merchants connect any compatible metaobject without additional code.
- **Using `{% style %}` for a component's entire CSS** instead of just the settings-driven values that need live preview — bloats what should be static, cacheable CSS.
- **Using the View Transitions API with no fallback**, breaking the experience (rather than just being less animated) in browsers that don't support it.

## Quick Reference

- Metaobjects + dynamic sources: write generic settings, let merchants connect any compatible metaobject field in the editor.
- `{% style %}` for live-updating, settings-driven CSS (colors); `{% stylesheet %}` for everything else.
- View Transitions API: feature-detect, always provide a fallback.
- A "modern feature" is worth adopting when it replaces something you'd otherwise hand-build — not just because it's new.

## Further Reading

- [Dynamic data sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources) — shopify.dev
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — this handbook
- [`{% style %}` tag](https://shopify.dev/docs/api/liquid/tags/style) — shopify.dev
