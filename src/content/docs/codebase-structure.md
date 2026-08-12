---
title: Codebase Structure
description: How a Shopify theme's files fit together.
---

**TL;DR:** How a Shopify theme's files fit together.

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

It really pays off to keep this chain in mind. Most "why isn't my change showing up" problems come down to one thing: not knowing which layer your code actually lives in, especially now that blocks can nest inside other blocks.

## The Horizon-era change that matters most here

If your prior theme experience is Dawn-era, the one structural shift to internalize is that **blocks can now hold other blocks**, several levels deep, targeted with `@theme`/`@app`. That changes how you decide what's a section vs. a block vs. a nested block, and it's the source of most "which layer does this belong in" mistakes on this project. See [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) for the full rules.

## What's on this page group

- [Folder Structure](/codebase-structure/folder-structure/): the folders every theme must have.
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/): the big change, blocks that can now hold other blocks.
- [Sections & Section Groups](/codebase-structure/sections-and-section-groups/): how the header and footer stay editable by merchants.
- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/): reusable Liquid code, and how we name our files.
- [Modern Shopify Features to Utilize](/codebase-structure/modern-shopify-features/): newer Shopify features worth using beyond the basics.
- [Complete Worked Example](/codebase-structure/complete-worked-example/): a full example, with a snippet, block, section, schema, locale files, and presets, ready to copy, with the code explained step by step.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Before you add a new file, check the rendering chain above first. Work out which layer it belongs to. Getting this wrong early (like building a snippet when you actually needed a block) is easy to fix. Fixing it later, once other code depends on it, is much harder. | **Mixing up a block edit with a section edit** (or the other way around), then getting confused when your changes don't show up where you expected. |
| If your change isn't showing up on the page, check which layer you actually edited. Don't assume something is broken. This one check solves most early confusion. | **Treating `snippets/` as a catch-all for anything reusable**, when some of that content should really be a theme block with settings a merchant can edit. |
| Read this whole page once before you build your first Solis section. The nested-block model is the one part of this that's genuinely new, even if you've built Dawn-era themes before. | **Assuming old Dawn-theme patterns still apply.** The biggest change here (blocks nested inside other blocks) changes how you should build new code, not just what's technically possible. |

## Further reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
