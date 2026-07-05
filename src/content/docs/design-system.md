---
title: Design System & Configuration
description: Turning Figma's design tokens into a maintainable, merchant-configurable theme settings surface.
---

Every theme has two customers for its design decisions: the developer writing CSS, and the merchant configuring the theme editor. This section is about the layer that serves both — design tokens, the `settings_schema.json`/`settings_data.json` files that expose them to merchants, presets, and icons. Get this layer right and both audiences have a good experience; get it wrong and you end up with a color picker that doesn't match the CSS, or a preset that silently breaks on a fresh install.

## What's on this page group

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) — mapping a Figma variable collection onto `settings_schema.json` and CSS custom properties.
- [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) — the token architecture itself: naming, structure, and what "maintainable long-term" actually requires.
- [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) — what each file is for, how they interact, and how to manage them without corrupting merchant data.
- [Managing Presets (Sections & Themes)](/design-system/managing-presets/) — section presets, theme presets, and multi-preset Theme Store submissions.
- [Icon Management](/design-system/icon-management/) — SVG sprites vs. inline snippets, theming icons with `currentColor`, and settings-driven icon pickers.

## Why this is its own section

[Scaffold Setup Guide](/scaffold-setup/) gets you to a working first section with a settings walkthrough. This section goes deeper on the same territory — because a theme with 40+ sections and multiple presets lives or dies on whether its design tokens and settings schema were planned deliberately from early on, rather than accreted section by section. Read this section fully before your theme has more than a handful of sections; retrofitting a token system onto 20 already-hardcoded sections is a much bigger job than starting with one.

## Best practices

- Design the token system (colors, spacing, type) before writing the first section's CSS, not after the third section reveals inconsistent hardcoded values.
- Treat `settings_schema.json` as a contract with merchants — see [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) for what breaking that contract costs.
- Build presets test-first: try a fresh install with each preset applied before assuming it works, every time you touch shared schema.

## Common mistakes

- **Building sections before settling on a token system**, then retrofitting tokens across a growing pile of already-hardcoded values.
- **Treating presets as a "set it once" artifact** instead of something that needs re-verifying whenever shared schema changes underneath them.

## Quick Reference

- [Figma Tokens → Theme Settings](/design-system/figma-tokens-to-theme/) · [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/) · [settings_schema.json & settings_data.json](/design-system/settings-schema-and-data/) · [Managing Presets](/design-system/managing-presets/) · [Icon Management](/design-system/icon-management/)

## Further Reading

- [Settings (concept overview)](https://shopify.dev/docs/storefronts/themes/architecture/settings) — shopify.dev
