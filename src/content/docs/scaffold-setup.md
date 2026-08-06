---
title: Scaffold Setup Guide
description: Going from an empty folder to a working first section and block.
---

**TL;DR:** Going from an empty folder to a working first section and block.

In Section 1, you got a Shopify theme running on your own computer. This section walks through why we scaffold from Skeleton Theme specifically, then through building your first real Solis section and block, step by step, using our conventions.

## What's on this page group

- [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/): why we clone Skeleton Theme instead of Horizon, and how to set up the project.
- [Your First Section & Block](/scaffold-setup/first-section-and-block/): a full worked example, from start to finish.
- [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/): the difference between theme-level settings and section or block settings.

## What "done scaffolding" looks like

Before you move on to building real Solis features, check that you have all of these:

- ☑ A cloned Skeleton Theme project, running locally with `shopify theme dev`
- ☑ At least one custom section and block that you built yourself, start to finish (not just the scaffold's default examples)
- ☑ `config/settings_schema.json` filled in with `theme_info` and your first real theme-wide setting
- ☑ A clear idea of when a setting belongs in theme settings, section settings, or block settings

If you're missing any of these, work through the three pages in this section before you start a real ticket. The first section you build sets the pattern for everything you build after it, so it's worth getting right from the start.

## Best practices

- Build one small, low-risk section first. See [Your First Section & Block](/scaffold-setup/first-section-and-block/) for a full example. Use it to practice the whole process: writing the code, building the schema, previewing it, and opening a pull request. Do this before you take on a real feature.
- Don't copy an existing theme's section code just to save time. Read [Store & Design Requirements](/theme-store-requirements/store-and-design/) to understand why your code needs to be original, then build your own pattern from scratch.
- Keep a running list of the settings you add to `config/settings_schema.json`. If the theme-wide settings panel grows without a clear pattern, merchants find it confusing fast.

## Common mistakes

- **Skipping straight to a real, complex feature as your first section.** A testimonials section or a simple banner is a much better first exercise than a full product page.
- **Copying patterns from another theme's public source code without changing them.** It's tempting because it's quicker, but it risks breaking the uniqueness rule. You can also end up with patterns that don't match our style.
- **Adding settings at the wrong level.** This means making something theme-wide when it should be per-section, or the other way around. See [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/) for help deciding.

## Key Takeaways
- Scaffold: `shopify theme init` (clones Skeleton Theme).
- Then: build sections in `/sections`, reusable blocks in `/blocks`, and set up `config/settings_schema.json` for global settings.
- Build one small, low-risk section first, so you can practice the whole workflow before you tackle a real feature.

## Further Reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) (shopify.dev)
