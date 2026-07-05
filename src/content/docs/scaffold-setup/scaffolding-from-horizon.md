---
title: Scaffolding From Horizon
description: Why we clone Skeleton Theme instead of Horizon, in detail.
---

## The short version

We follow **Horizon's architecture** (nested theme blocks, `@theme`/`@app` targeting, `{% stylesheet %}`/`{% javascript %}` tags) because it's Shopify's current best-practice pattern. We scaffold from **Skeleton Theme**, a different repository, because Horizon itself can't legally be the base of a Theme Store submission.

## Why, in Shopify's own words

From [Shopify's Horizon repository](https://github.com/Shopify/horizon):

> "If you're building a theme for the Shopify Theme Store, then do not use Horizon as a starting point. Themes based on, derived from, or incorporating Horizon are not eligible for submission to the Shopify Theme Store. Use the Skeleton Theme instead."

And from Shopify's [official Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes):

> "Shopify's Skeleton Theme is the only approved codebase for Theme Store development. Otherwise, themes must be built with fully original code. New theme submissions built on or derived from Dawn or Horizon are not eligible for the Shopify Theme Store."

Horizon is Shopify's own first-party flagship theme (plus nine sibling presets). Dawn, Shopify's older reference theme, is also excluded now. **Skeleton Theme** is the one repository Shopify explicitly built and blesses as a Theme Store starting point — deliberately minimal, with no opinionated design of its own for you to accidentally inherit, but built with the same modern block architecture as Horizon.

| ✅ Do | ❌ Don't |
|---|---|
| `git clone`/`shopify theme init` from Skeleton Theme | `git clone` Horizon or Dawn as a starting point |
| Study Horizon's public source for architecture patterns (how it structures a section, how it uses `@theme`/`@app`) | Copy Horizon's actual markup/CSS/design wholesale into Solis |
| Build Solis's visual identity entirely from scratch | Assume "inspired by Horizon" is different enough from "derived from Horizon" — Shopify's review treats close derivation as ineligible regardless of intent |

## Setting up

```bash
# Clone Skeleton Theme via Shopify CLI (this is what shopify theme init does)
shopify theme init
# → prompts for a folder name, clones github.com/Shopify/skeleton-theme into it
cd solis
```

Skeleton Theme's own folder layout confirms it uses the current architecture:

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

This is intentional — Skeleton Theme gives you correct plumbing, not a design to copy. The uniqueness requirement (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)) means Solis's actual look, information architecture, and section behavior all need to be original.

## How to actually use Horizon as a reference without crossing the line

It's genuinely useful to look at Horizon's public source for *architectural patterns* — how it structures a section's schema, how it handles `@theme`/`@app` targeting, how it organizes `{% stylesheet %}` blocks. That's different from copying its markup or design decisions.

| ✅ Fine to learn from Horizon | ❌ Crosses the line |
|---|---|
| "How does Horizon structure its `blocks` schema attribute?" | Copying a Horizon section's actual Liquid file and modifying colors/text |
| "What does Horizon's `{% stylesheet %}` tag usage look like in practice?" | Copying Horizon's CSS wholesale and re-skinning it |
| General patterns: naming, nesting depth, use of CSS custom properties | Solis's actual visual layout matching a specific Horizon section closely enough that a reviewer would recognize it |

A useful gut check: if you showed a specific piece of Solis code side by side with the Horizon file it was "inspired by," would a reviewer call it a close derivation? If there's any doubt, write it from scratch instead.

## Best practices

- Read a Horizon section's source for the *pattern*, then close the tab and write Solis's version from a blank file — don't keep it open and adapt it line by line.
- When your AI tool suggests code that looks suspiciously like a well-known Horizon or Dawn pattern, treat that as a signal to ask it to try a structurally different approach, not just accept it.
- If you're ever unsure whether something is "architecture inspiration" or "derivation," treat it as derivation and rewrite from scratch — the cost of being wrong here is a full Theme Store rejection.

## Common mistakes

- **Cloning Horizon or Dawn directly "just to get started faster," planning to replace it later.** In practice, "later" often doesn't fully happen, and residual patterns survive into the submission.
- **Copying a specific Horizon section's code and modifying it**, rather than using it purely as a conceptual reference.
- **Assuming AI-generated code is automatically safe from this issue.** AI tools are frequently trained on public theme source code and may reproduce recognizable patterns from Horizon or Dawn — review AI output with this specific risk in mind (see [AI-Assisted Development](/ai-assisted-development/)).

## Quick Reference

- Architecture reference: Horizon (patterns only, never cloned).
- Actual scaffold: Skeleton Theme, via `shopify theme init`.
- Skeleton Theme gives you structure, not design — the design work is still 100% ours.
- Learn from Horizon's patterns; never copy its markup, CSS, or specific design decisions.

## Further Reading

- [Horizon theme source](https://github.com/Shopify/horizon) — GitHub
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme) — GitHub
- [Theme Store uniqueness requirement](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes) — shopify.dev
