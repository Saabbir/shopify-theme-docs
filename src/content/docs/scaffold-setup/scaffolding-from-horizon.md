---
title: Scaffolding From Horizon
description: Why we clone Skeleton Theme instead of Horizon, in detail.
---

**TL;DR:** Why we clone Skeleton Theme instead of Horizon, in detail.

## The short version

We build things the same way **Horizon** does. That means nested theme blocks, `@theme`/`@app` targeting, and `{% stylesheet %}`/`{% javascript %}` tags, because that's Shopify's current recommended pattern. But we start our project (we "scaffold" it) from **Skeleton Theme**, a different repository. We do this because Horizon itself can't legally be the starting point for a Theme Store submission.

## Why, in Shopify's own words

From [Shopify's Horizon repository](https://github.com/Shopify/horizon):

> "If you're building a theme for the Shopify Theme Store, then do not use Horizon as a starting point. Themes based on, derived from, or incorporating Horizon are not eligible for submission to the Shopify Theme Store. Use the Skeleton Theme instead."

And from Shopify's [official Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes):

> "Shopify's Skeleton Theme is the only approved codebase for Theme Store development. Otherwise, themes must be built with fully original code. New theme submissions built on or derived from Dawn or Horizon are not eligible for the Shopify Theme Store."

Horizon is Shopify's own flagship theme, plus nine sibling presets. Dawn, Shopify's older reference theme, is also excluded now. **Skeleton Theme** is the one repository Shopify built and approved as a Theme Store starting point. It's deliberately bare-bones, with no design opinions of its own that you could accidentally copy. At the same time, it's still built the same modern way as Horizon, using the same block structure.

| ✅ Do | ❌ Don't |
|---|---|
| `git clone`/`shopify theme init` from Skeleton Theme | `git clone` Horizon or Dawn as a starting point |
| Study Horizon's public source for architecture patterns (how it structures a section, how it uses `@theme`/`@app`) | Copy Horizon's actual markup, CSS, or design wholesale into Solis |
| Build Solis's visual identity entirely from scratch | Assume "inspired by Horizon" is different enough from "derived from Horizon." Shopify's review treats close derivation as ineligible no matter what you intended. |

## Setting up

```bash
# Clone Skeleton Theme via Shopify CLI (this is what shopify theme init does)
shopify theme init
# → prompts for a folder name, clones github.com/Shopify/skeleton-theme into it
cd solis
```

Skeleton Theme's own folder layout shows it uses the same modern structure:

```
.
├── assets
├── blocks     ← nestable theme blocks, same as Horizon
├── config
├── layout
├── locales
├── sections
├── snippets
└── templates
```

## What you inherit vs. what you build

| From Skeleton Theme | You build |
|---|---|
| Folder structure, `.theme-check.yml`, `.shopifyignore`, a CI workflow stub | All actual sections, blocks, and design |
| The pattern for `{% stylesheet %}`/`{% javascript %}` tags, `critical.css` | Solis's specific visual identity |
| Nothing opinionated about layout or visual design | Everything a merchant will actually see |

This split is intentional. Skeleton Theme gives you correct groundwork, not a design to copy. Because of the uniqueness requirement (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)), Solis's actual look, structure, and section behavior all need to be original.

## How to actually use Horizon as a reference without crossing the line

It's genuinely useful to look at Horizon's public source code to see how it's built. You can learn how it structures a section's schema, how it handles `@theme`/`@app` targeting, and how it organizes `{% stylesheet %}` blocks. That's completely different from copying its markup or design decisions.

| ✅ Fine to learn from Horizon | ❌ Crosses the line |
|---|---|
| "How does Horizon structure its `blocks` schema attribute?" | Copying a Horizon section's actual Liquid file and modifying colors/text |
| "What does Horizon's `{% stylesheet %}` tag usage look like in practice?" | Copying Horizon's CSS wholesale and re-skinning it |
| General patterns: naming, nesting depth, use of CSS custom properties | Solis's actual visual layout matching a specific Horizon section closely enough that a reviewer would recognize it |

Here's a useful gut check. Put a piece of Solis code side by side with the Horizon file it was "inspired by." Would a reviewer call it a close copy? If there's any doubt, write it from scratch instead.

## Best practices

- Read a Horizon section's source to understand the pattern, then close the tab and write Solis's version in a new, blank file. Don't keep it open and adapt it line by line.
- If your AI tool suggests code that looks a lot like a well-known Horizon or Dawn pattern, don't just accept it. Ask it to try a different approach instead.
- If you're ever unsure whether something counts as "inspiration" or "copying," treat it as copying and rewrite it from scratch. Getting this wrong can mean a full Theme Store rejection.

## Common mistakes

- **Cloning Horizon or Dawn directly "just to get started faster," planning to replace it later.** In practice, "later" often doesn't fully happen, and leftover patterns end up in the final submission.
- **Copying a specific Horizon section's code and modifying it**, instead of using it purely as a reference for ideas.
- **Assuming AI-generated code is automatically safe from this problem.** AI tools are often trained on public theme source code and can reproduce patterns from Horizon or Dawn that a reviewer would recognize. Keep this risk in mind when you review AI output (see [AI-Assisted Development](/ai-assisted-development/)).

## Key takeaways
- Reference for patterns: Horizon (look at it, never clone it).
- Actual scaffold: Skeleton Theme, via `shopify theme init`.
- Skeleton Theme gives you structure, not design. The design work is still 100% ours.
- Learn from Horizon's patterns; never copy its markup, CSS, or specific design decisions.

## Further reading

- [Horizon theme source](https://github.com/Shopify/horizon): GitHub
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme): GitHub
- [Theme Store uniqueness requirement](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes): shopify.dev
