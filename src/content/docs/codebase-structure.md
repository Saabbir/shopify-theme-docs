---
title: Codebase Structure
description: How a Horizon-era Shopify theme's files fit together.
---

A Shopify theme is a fixed folder structure plus a rendering model: layouts wrap templates, templates arrange sections, sections arrange blocks, and blocks can now contain more blocks. This section explains each layer.

## The rendering chain

```
layout (theme.liquid)
  └─ template (e.g. product.json)
       └─ sections (e.g. main-product.liquid)
            └─ blocks (e.g. a "text" block)
                 └─ blocks (a block can nest more blocks — new in Horizon's architecture)
```

## What's on this page group

- [Folder Structure](/codebase-structure/folder-structure/) — the required top-level directories.
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — the headline architecture change: blocks that contain blocks.
- [Sections & Section Groups](/codebase-structure/sections-and-section-groups/) — how the header/footer areas stay merchant-editable.
- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) — reusable Liquid, and how we name files.

## Quick Reference

- Rendering order: layout → template → sections → blocks → nested blocks.
- The big architectural shift from Dawn-era themes: blocks can now contain other blocks, up to several levels deep.

## Further Reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
