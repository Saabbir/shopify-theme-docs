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

Understanding this chain matters more than it might seem at first: almost every "why doesn't my change show up" question traces back to not knowing which layer a given piece of markup lives in. If you're editing a block's settings and nothing changes, check whether you're actually editing the section instead — a very common early mistake.

## Why this looks different from a typical web project

If you're coming from a normal component-based frontend project, the closest mental model is: `layout` is your app shell, `templates` are your routes, `sections` are page-level components a non-developer can rearrange visually, and `blocks` are smaller components nested inside those. The genuinely new part is that **merchants** — not developers — add, remove, and reorder sections and blocks through a visual editor, which is why schema (the settings a merchant sees) is just as important as the markup itself.

## What's on this page group

- [Folder Structure](/codebase-structure/folder-structure/) — the required top-level directories.
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — the headline architecture change: blocks that contain blocks.
- [Sections & Section Groups](/codebase-structure/sections-and-section-groups/) — how the header/footer areas stay merchant-editable.
- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) — reusable Liquid, and how we name files.
- [Modern Shopify Features to Utilize](/codebase-structure/modern-shopify-features/) — current platform capabilities worth building on beyond the baseline.
- [Complete Worked Example](/codebase-structure/complete-worked-example/) — a full snippet + block + section + schema + locale files + presets, copy-paste ready, explained alongside the code.

## Best practices

- Before adding a new file, ask which layer it belongs to using the rendering chain above — a wrong choice (e.g. a snippet that should have been a block) is usually cheap to fix early and expensive to fix once other code depends on it.
- When debugging "my change isn't showing up," check which layer you actually edited before assuming something is broken — this single check resolves a large fraction of early confusion.
- Read this whole section once before writing your first Solis section — the architecture is different enough from a typical frontend project that skimming leads to rework.

## Common mistakes

- **Confusing a block edit with a section edit** (or vice versa) and being confused when changes don't appear where expected.
- **Treating `snippets/` as a dumping ground for anything reusable**, when some of that content should actually be a theme block with merchant-editable settings.
- **Assuming Dawn-era patterns still apply** — the biggest architecture shift (nested theme blocks) changes how you should structure new code, not just what's technically possible.

## Quick Reference

- Rendering order: layout → template → sections → blocks → nested blocks.
- The big architectural shift from Dawn-era themes: blocks can now contain other blocks, up to several levels deep.
- Merchants edit sections/blocks visually — schema quality matters as much as markup quality.

## Further Reading

- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
