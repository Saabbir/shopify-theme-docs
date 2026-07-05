---
title: Scaffold Setup Guide
description: Going from an empty folder to a working first section and block.
---

Section 1 got a theme running locally. This section explains *why* we scaffold the way we do, and walks through building your first real section and block on top of it.

## What's on this page group

- [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) — why we clone Skeleton Theme, not Horizon, and how to set up the project.
- [Your First Section & Block](/scaffold-setup/first-section-and-block/) — a full worked example, start to finish.
- [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/) — theme-level settings vs. section/block settings.

## What "done scaffolding" looks like

Before moving on to building real Solis features, confirm you have:

- ☑ A cloned Skeleton Theme project, running locally via `shopify theme dev`
- ☑ At least one custom section and block built end to end (not just the scaffold's defaults)
- ☑ `config/settings_schema.json` populated with `theme_info` and your first real theme-wide setting
- ☑ A basic understanding of when something belongs in theme settings vs. section settings vs. block settings

If any of those are missing, work through the three pages in this section before starting a real ticket — the first section you build sets the pattern everything after it follows.

## Best practices

- Build one deliberately small, low-stakes section first (see [Your First Section & Block](/scaffold-setup/first-section-and-block/)) purely to exercise the full loop — code, schema, preview, PR — before taking on a real feature.
- Resist the urge to copy an existing theme's section code wholesale "to save time" — see [Store & Design Requirements](/theme-store-requirements/store-and-design/) on why structural originality matters, and build your own pattern from the start.
- Keep a running list of settings you add to `config/settings_schema.json` — a theme-wide settings panel that grows without a clear pattern becomes confusing for merchants fast.

## Common mistakes

- **Skipping straight to a real, complex feature as your first section.** A testimonials or simple banner section is a much better first exercise than the actual product page.
- **Copying patterns from an existing theme's public source code without adapting them.** Convenient in the moment, but risks both the uniqueness requirement and inheriting patterns that don't match our conventions.
- **Adding settings to the wrong level** (theme-wide when it should be per-section, or vice versa) — see [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/) for the decision criteria.

## Quick Reference

- Scaffold: `shopify theme init` (clones Skeleton Theme).
- Then: build sections in `/sections`, reusable blocks in `/blocks`, wire up `config/settings_schema.json` for global settings.
- Build one small, low-risk section first to exercise the whole workflow before tackling a real feature.

## Further Reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) — shopify.dev
