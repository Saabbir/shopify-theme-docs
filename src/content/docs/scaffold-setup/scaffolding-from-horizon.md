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

## Quick Reference

- Architecture reference: Horizon (patterns only, never cloned).
- Actual scaffold: Skeleton Theme, via `shopify theme init`.
- Skeleton Theme gives you structure, not design — the design work is still 100% ours.

## Further Reading

- [Horizon theme source](https://github.com/Shopify/horizon) — GitHub
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme) — GitHub
- [Theme Store uniqueness requirement](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes) — shopify.dev
