---
title: Colors
description: Everything about managing color in Solis — settings, tokens, code, and accessibility, from both a developer and merchant perspective.
---

**TL;DR:** Everything about managing color in Solis — settings, tokens, code, and accessibility, from both a developer and merchant perspective.

Everything about color, in one place. If you have a question about how color works in Solis, whether you're a developer wiring up settings or a merchant picking brand colors in the theme editor, it should be answered somewhere in this section.

## What's in this section

| Page | Answers |
|---|---|
| [Color Palettes](/colors/color-palettes/) | What `color_palette` is, how it differs from individual `color` settings, and whether Solis should adopt it |
| [Color Schemes](/colors/color-schemes/) | What `color_scheme_group` and `color_scheme` are, how swappable schemes work, and the Theme Store's minimum color-settings rule |
| [Color Design Tokens](/colors/color-design-tokens/) | The three-tier token model (raw → semantic → component), naming rules, and mapping a Figma color collection onto theme settings |
| [Color in Liquid & CSS](/colors/color-in-liquid-and-css/) | Deriving hover states, tints, and format conversions from one stored color with Liquid's color filters |
| [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/) | WCAG contrast ratios, testing every color scheme, and focus state contrast |

## The two settings mechanisms, at a glance

Solis has two different mechanisms for exposing color to merchants, and they solve different problems:

| | `color_palette` | `color_scheme_group` |
|---|---|---|
| What it is | One flat grid of named raw colors | Several full, swappable schemes, each a bundle of roles |
| Merchant sees | A single color grid they edit directly | A picker for named schemes, applied per section |
| Typical use | The theme's actual brand colors (primary, accent, secondary) | "Scheme 1 is light, Scheme 2 is dark," picked per section |

See [Color Palettes](/colors/color-palettes/) and [Color Schemes](/colors/color-schemes/) for the full detail on each, including how they commonly work together in the same theme.

## How the pieces fit together

A merchant sets colors through `color_palette` and/or `color_scheme_group` settings in the theme editor. Those values flow into [Color Design Tokens](/colors/color-design-tokens/): the three-tier system (raw, semantic, component) that keeps them organized in code. From there, [Color in Liquid & CSS](/colors/color-in-liquid-and-css/) covers deriving hover states, tints, and format conversions from those stored values at render time, instead of hardcoding every variant. And [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/) covers the WCAG rules every one of those color pairings has to satisfy, checked against every scheme a merchant can pick.

## Quick answers

**"Should I use `color_palette` or `color_scheme_group`?"** Usually both. A palette for the theme's core brand colors, schemes for swappable full-section looks. See the comparison table in [Color Schemes](/colors/color-schemes/#color_scheme_group-vs-color_palette).

**"How do I add a hover state without a new setting?"** Derive it from the base color with `color_darken` or `color_lighten`. See [Color in Liquid & CSS](/colors/color-in-liquid-and-css/).

**"What contrast ratio do I need?"** 4.5:1 for body text, 3:1 for large text, icons, and borders, checked against every scheme a merchant can select. See [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/).

**"What do I name a color token?"** After its role (`--color-primary`), never its appearance or hex value (`--color-green`). See [Color Design Tokens](/colors/color-design-tokens/#naming-role-first-appearance-never).

**"Does Theme Store review check my colors?"** Yes: at least 4 color settings total, every background paired with a text/foreground color, and WCAG contrast on every scheme. See [Color Schemes](/colors/color-schemes/#the-theme-stores-minimum-color-settings-rule) and [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/).

## Further reading

- [Design System & Configuration](/design-system/): the broader section this one was split out of, covering settings architecture beyond just color
- [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/): the full nine-item accessibility checklist, of which color contrast is one part
