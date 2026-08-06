---
title: Design System & Configuration
description: How Figma design tokens become theme settings that are easy to maintain and easy for merchants to use.
---

**TL;DR:** How Figma design tokens become theme settings that are easy to maintain and easy for merchants to use.

Every theme has two different people who care about its design choices. There's you, the developer who writes the CSS. And there's the merchant, who uses Shopify's theme editor to pick colors and fonts without touching any code.

This section is about the layer that serves both of you: the general design token model, and how a Figma token becomes a real theme setting.

Get this layer right, and both you and the merchant have a smooth experience. Get it wrong, and you end up with a settings panel that doesn't match your CSS.

:::note[Looking for color, fonts, spacing, assets, or settings_schema.json itself?]
Each of those has its own dedicated section: see [Colors](/colors/), [Fonts](/fonts/), and [Spacing](/spacing/) for settings, tokens, code, and accessibility in each domain. Icon management moved to its own [Assets Management](/assets/) section, alongside images, video, and 3D media. The `settings_schema.json`/`settings_data.json` files themselves, and the full preset workflow, moved to their own [Config & Global Settings](/config-and-settings/) section.
:::

## What's on this page group

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/): how to turn a Figma variable collection into `settings_schema.json` entries and CSS custom properties.
- [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/): how to name and organize your tokens so they stay easy to work with for years, not just for the first few weeks.

## Why this is its own section

[Scaffold Setup Guide](/scaffold-setup/) walks you through building your first section and its settings. This section goes deeper into the same topic.

Here's why it matters. A theme with 40 or more sections only works well if you plan its design tokens early. If you don't plan ahead, things get messy section by section, and that mess is hard to clean up later.

Read this section fully before your theme grows past a handful of sections. Adding a token system to 20 sections that already hardcode their own values (write fixed values straight into the code instead of using a shared token) is a much bigger job than starting with a token system from day one.

## Best practices

- Design your token system before you write your first section's CSS. Don't wait until your third section has different, hardcoded values that don't match.
- Treat every setting `id` you expose as a promise to merchants. See [Config & Global Settings](/config-and-settings/) to learn what happens if you break that promise.

## Common mistakes

- **Building sections before you settle on a token system.** You end up adding tokens later, on top of a growing pile of hardcoded values.

## Key Takeaways
- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) · [Design Tokens: The Three-Tier Model](/design-system/design-tokens-color-type-system/)
- For color, fonts, spacing, assets, or settings_schema.json/presets specifically: see [Colors](/colors/), [Fonts](/fonts/), [Spacing](/spacing/), [Assets Management](/assets/), [Config & Global Settings](/config-and-settings/).

## Further Reading

- [Colors](/colors/), [Fonts](/fonts/), [Spacing](/spacing/), [Assets Management](/assets/), [Config & Global Settings](/config-and-settings/), the dedicated sections for each domain
- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings), from shopify.dev
