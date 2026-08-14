---
title: Scaffold Setup Guide
description: Going from an empty folder to a working first section and block.
---

**TL;DR:** Going from an empty folder to a working first section and block.

In Section 1, you got Solis running on your own computer. Solis is already scaffolded, so you won't be running `shopify theme init` or building the folder structure yourself, that already happened. This section covers why it was built the way it was (scaffolded from Skeleton Theme, not Horizon), then walks you through building a practice section and block by hand, step by step, using our conventions, before you touch a real ticket.

## What's on this page group

- [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/): why Solis was scaffolded from Skeleton Theme instead of Horizon, and what that means for how you use Horizon as a reference.
- [Your First Section & Block](/scaffold-setup/first-section-and-block/): a full worked example, from start to finish, to practice the workflow before you build something real.
- [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/): the difference between theme-level settings and section or block settings.

## What "ready to build" looks like

Before you move on to building real Solis features, check that you have all of these:

- ☑ Solis cloned and running locally with `shopify theme dev`
- ☑ At least one practice section and block that you built yourself, start to finish (see [Your First Section & Block](/scaffold-setup/first-section-and-block/)), not just read through the existing ones
- ☑ Read `config/settings_schema.json` and know what's already in it, and added one small theme-wide setting yourself as practice
- ☑ A clear idea of when a setting belongs in theme settings, section settings, or block settings

If you're missing any of these, work through the three pages in this section before you start a real ticket. The first section you build sets the pattern for everything you build after it, so it's worth getting right from the start.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Build one small, low-risk section first. See [Your First Section & Block](/scaffold-setup/first-section-and-block/) for a full example. Use it to practice the whole process: writing the code, building the schema, previewing it, and opening a pull request. Do this before you take on a real feature. | **Skipping straight to a real, complex feature as your first section.** A testimonials section or a simple banner is a much better first exercise than a full product page. |
| Don't copy an existing theme's section code just to save time. Read [Store & Design Requirements](/theme-store-requirements/store-and-design/) to understand why your code needs to be original, then build your own pattern from scratch. | **Copying patterns from another theme's public source code without changing them.** It's tempting because it's quicker, but it risks breaking the uniqueness rule. You can also end up with patterns that don't match our style. |
| Keep a running list of the settings you add to `config/settings_schema.json`. If the theme-wide settings panel grows without a clear pattern, merchants find it confusing fast. | **Adding settings at the wrong level.** This means making something theme-wide when it should be per-section, or the other way around. See [Settings Schema Walkthrough](/scaffold-setup/settings-schema-walkthrough/) for help deciding. |

## Further reading

- [Create a theme](https://shopify.dev/docs/storefronts/themes/getting-started/create) (shopify.dev)
