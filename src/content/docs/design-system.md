---
title: Design System & Configuration
description: How Figma design tokens become theme settings that are easy to maintain and easy for merchants to use.
---

Every theme has two different people who care about its design choices. There's you, the developer who writes the CSS. And there's the merchant, who uses Shopify's theme editor to pick colors and fonts without touching any code.

This section is about the layer that serves both of you. It covers design tokens (reusable values like your brand colors, spacing, and font sizes), the `settings_schema.json` and `settings_data.json` files that expose those tokens to merchants, presets, and icons.

Get this layer right, and both you and the merchant have a smooth experience. Get it wrong, and you end up with problems like a color picker that doesn't match your CSS, or a preset that breaks quietly the moment someone installs a fresh copy of the theme.

## What's on this page group

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/): how to turn a Figma variable collection into `settings_schema.json` entries and CSS custom properties.
- [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/): how to name and organize your tokens so they stay easy to work with for years, not just for the first few weeks.
- [Color Palettes](/design-system/color-palettes/): Shopify's newer `color_palette` setting. It's one shared grid of brand colors that merchants can edit, and other settings can point to it.
- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/): what each file does, how they work together, and how to change them without breaking merchant data.
- [Managing Presets (Sections & Themes)](/design-system/managing-presets/): section presets, theme presets, and how to submit a theme with more than one preset to the Theme Store.
- [Icon Management](/design-system/icon-management/): SVG sprites vs. inline snippets, how to theme icons with `currentColor`, and how to let merchants pick icons in settings.

## Why this is its own section

[Scaffold Setup Guide](/scaffold-setup/) walks you through building your first section and its settings. This section goes deeper into the same topic.

Here's why it matters. A theme with 40 or more sections, and several presets (ready-made style options a merchant can choose from), only works well if you plan its design tokens and settings schema early. If you don't plan ahead, things get messy section by section, and that mess is hard to clean up later.

Read this section fully before your theme grows past a handful of sections. Adding a token system to 20 sections that already hardcode their own values (write fixed values straight into the code instead of using a shared token) is a much bigger job than starting with a token system from day one.

## Best practices

- Design your token system for colors, spacing, and type before you write your first section's CSS. Don't wait until your third section has different, hardcoded values that don't match.
- Treat `settings_schema.json` as a promise to merchants. See [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) to learn what happens if you break that promise.
- Test your presets often. Every time you change a shared schema, install a fresh copy of the theme with each preset applied, and check that everything still works.

## Common mistakes

- **Building sections before you settle on a token system.** You end up adding tokens later, on top of a growing pile of hardcoded values.
- **Treating presets as something you set up once and forget.** You need to check them again every time the shared schema underneath them changes.

## Quick Reference

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) · [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) · [Color Palettes](/design-system/color-palettes/) · [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) · [Managing Presets](/design-system/managing-presets/) · [Icon Management](/design-system/icon-management/)

## Further Reading

- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings), from shopify.dev
