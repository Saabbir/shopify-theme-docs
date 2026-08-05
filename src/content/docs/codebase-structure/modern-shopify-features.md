---
title: Modern Shopify Features to Use
description: Newer Shopify features worth using, beyond the basics already covered in this section.
---

[Folder Structure](/codebase-structure/folder-structure/) through [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) cover what every theme needs. This page is different. It's a quick tour of specific, newer Shopify features. You don't strictly need them, but they're worth using because they solve real problems better than an older or more manual approach would.

## Metaobjects, used globally in the theme editor

Metaobjects can now be connected and used all over the theme editor through **dynamic sources**.

Dynamic sources let a merchant pick a metaobject field as a section or block's content source, right inside the editor. A developer doesn't need to write a specific Liquid reference for that one case.

```liquid
{% comment %} A block that accepts a dynamic source, rather than a
   hardcoded metaobject reference — a merchant picks which metaobject
   field feeds this block, directly in the editor {% endcomment %}
{{ block.settings.content }}
```

```json
{ "type": "text", "id": "content", "label": "t:settings.content" }
```

Here's the trick. Write your setting generically, using a `text`, `richtext`, or `image_picker` type that doesn't assume one specific metaobject. Then a merchant can connect it to *any* compatible metaobject field, right in the editor.

That means the same block can pull from a "Brand," a "Size Guide," or any other metaobject a merchant has created, without you writing separate code for each one. This is far more flexible than a section that's hardcoded to read one specific metaobject type. Reach for this approach whenever a block's content is really just "some structured data a merchant defines," rather than something tied to this one specific theme.

## Theme blocks nested arbitrarily deep

This topic gets its own full page at [Theme Blocks & Nesting](/codebase-structure/theme-blocks/), but it's worth a quick reminder here. Use nested blocks, and don't fall back on the old pattern.

A block that contains other blocks is a powerful idea. Picture a "Group" block that holds a "Text" block and an "Image" block inside it, and a merchant can arrange or reorder them freely. This replaces what used to require a custom, single-purpose section schema for every layout variation.

If you catch yourself building a section with rigid content that a merchant can't reorder, stop and check whether nested theme blocks would let the merchant get the same result more flexibly instead.

## `{% style %}` — live-updating CSS in the editor

`{% style %}` is different from `{% stylesheet %}`, which is for static CSS that doesn't need to change instantly. Use `{% style %}` specifically for CSS that should **update live while a merchant adjusts a color setting in the editor**, without the whole section having to reload.

```liquid
{% style %}
  .hero-{{ section.id }} {
    background-color: {{ section.settings.background_color }};
  }
{% endstyle %}
```

Use `{% style %}` for values that come from settings, especially colors, where instant feedback matters while a merchant drags a color picker around. Use `{% stylesheet %}` for everything else, which is most of a component's actual CSS.

## The View Transitions API for section/page changes

The View Transitions API lets you animate between two states of a page. Think of a product image that smoothly swaps when a shopper picks a different variant, or a full page navigation that fades instead of jumping. You get a simple CSS-driven cross-fade or morph, and you don't have to hand-write any JavaScript animation logic for it:

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

Always check that the browser supports this first, using `document.startViewTransition`, and fall back to an immediate update in browsers that don't support it. Treat this as a nice-to-have extra, not something the page depends on to work.

## `{% content_for %}` for theme blocks

This is covered fully in [Theme Blocks & Nesting](/codebase-structure/theme-blocks/). It's mentioned here as the modern replacement for hardcoding a fixed list of block types into a section's markup. `{% content_for 'blocks' %}` renders whatever blocks a merchant has actually added, in whatever order they added them. The section template doesn't need to know the exact set of block types ahead of time.

## Native HTML elements over custom-built equivalents

This tip isn't specific to Shopify, but it's worth repeating because this handbook relies on it often. Use `<dialog>` for popup windows (modals), `<details>`/`<summary>` for expandable sections, and native form validation instead of building your own from scratch.

These native HTML elements are stable, well-supported by browsers, and they save you a whole category of accessibility and JavaScript-maintenance work. See [Clean Code Principles](/style-guides/clean-code-principles/) and [Third-Party Libraries](/style-guides/third-party-libraries/) for the full reasoning.

## Deciding whether a "modern feature" is worth adopting

Not every new Shopify feature is automatically worth using in every theme. Here's a quick way to decide:

| Ask | If yes → |
|---|---|
| Does it replace something we'd otherwise hand-build (a live-updating color preview, a flexible content block)? | Likely worth adopting |
| Does it require a fallback for meaningfully-used older browsers, and do we have one? | Adopt, with the fallback in place |
| Is it primarily "new" rather than "actually solves a problem we have"? | Worth knowing about, not necessarily worth reaching for on the next section you build |

## Best practices

- Use generic settings that work with dynamic sources (`text`, `richtext`, `image_picker`) instead of a hardcoded metaobject reference, whenever a block's content is really just generic structured data.
- Use `{% style %}` only for settings-driven values that benefit from a live preview, colors especially. Keep the bulk of your CSS in `{% stylesheet %}`.
- Check for browser support before using the View Transitions API, and always provide a working fallback. Don't assume every browser supports it.

## Common mistakes

- **Hardcoding a metaobject reference** when a generic, dynamic-source-compatible setting would let merchants connect any compatible metaobject without extra code.
- **Using `{% style %}` for a component's entire CSS** instead of just the settings-driven values that need a live preview. This bloats CSS that should stay static and cacheable.
- **Using the View Transitions API with no fallback.** In browsers that don't support it, this breaks the experience instead of simply skipping the animation.

## Quick Reference

- Metaobjects and dynamic sources: write generic settings, and let merchants connect any compatible metaobject field in the editor.
- `{% style %}` is for live-updating, settings-driven CSS, especially colors. `{% stylesheet %}` is for everything else.
- View Transitions API: check for support first, and always provide a fallback.
- A "modern feature" is worth adopting when it replaces something you'd otherwise have to hand-build, not just because it's new.

## Further Reading

- [Dynamic data sources](https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources) (shopify.dev)
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) (this handbook)
- [`{% style %}` tag](https://shopify.dev/docs/api/liquid/tags/style) (shopify.dev)
