---
title: Codebase Structure
description: How a Shopify theme's files fit together.
---

Every Shopify theme is built the same way. It has a set folder structure, and its pieces render in a clear, fixed order.

Think of it like a set of nested boxes. A layout holds a template. A template holds sections. Sections hold blocks. And now, blocks can even hold other blocks inside them.

This page walks you through each of these layers, one at a time.

## The rendering chain

```
layout (theme.liquid)
  └─ template (e.g. product.json)
       └─ sections (e.g. main-product.liquid)
            └─ blocks (e.g. a "text" block)
                 └─ blocks (a block can nest more blocks — new in Horizon's architecture)
```

It really pays off to understand this chain well. Most "why isn't my change showing up" problems come down to one thing: not knowing which layer your code actually lives in.

For example, say you're editing a block's settings, but nothing changes on the page. Check whether you're actually editing the section instead. This mix-up is one of the most common mistakes when you're new to Shopify themes.

## Why this looks different from a typical web project

If you've worked on a typical component-based frontend project before (think React or Vue), here's a simple way to think about it. The `layout` is like your app shell. The `templates` are like your routes. The `sections` are page-level components, but a non-developer can rearrange them visually. And `blocks` are smaller components nested inside those sections.

Here's the real difference, though. In a normal project, developers move components around in code. In a Shopify theme, **merchants** (the store owners, not developers) add, remove, and reorder sections and blocks themselves. They do this through a visual editor, without touching any code.

That's why the schema matters so much. A schema is the set of settings a merchant sees and can change in that visual editor. It matters just as much as the actual markup (the HTML and Liquid code) behind it.

## What's on this page group

- [Folder Structure](/codebase-structure/folder-structure/): the folders every theme must have.
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/): the big change, blocks that can now hold other blocks.
- [Sections & Section Groups](/codebase-structure/sections-and-section-groups/): how the header and footer stay editable by merchants.
- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/): reusable Liquid code, and how we name our files.
- [Modern Shopify Features to Utilize](/codebase-structure/modern-shopify-features/): newer Shopify features worth using beyond the basics.
- [Complete Worked Example](/codebase-structure/complete-worked-example/): a full example, with a snippet, block, section, schema, locale files, and presets, ready to copy, with the code explained step by step.

## Best practices

- Before you add a new file, check the rendering chain above first. Work out which layer it belongs to. Getting this wrong early (like building a snippet when you actually needed a block) is easy to fix. Fixing it later, once other code depends on it, is much harder.
- If your change isn't showing up on the page, check which layer you actually edited. Don't assume something is broken. This one check solves most early confusion.
- Read this whole page once before you build your first Solis section. Shopify themes work differently enough from a typical frontend project that skimming this now will save you rework later.

## Common mistakes

- **Mixing up a block edit with a section edit** (or the other way around), then getting confused when your changes don't show up where you expected.
- **Treating `snippets/` as a catch-all for anything reusable**, when some of that content should really be a theme block with settings a merchant can edit.
- **Assuming old Dawn-theme patterns still apply.** The biggest change here (blocks nested inside other blocks) changes how you should build new code, not just what's technically possible.

## Quick Reference

- Rendering order: layout → template → sections → blocks → nested blocks.
- The big change from Dawn-era themes: blocks can now contain other blocks, several levels deep.
- Merchants edit sections and blocks visually, so the schema (the settings they see) matters just as much as the markup.

## Further Reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
