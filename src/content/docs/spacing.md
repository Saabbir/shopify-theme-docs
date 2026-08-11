---
title: Spacing
description: Everything about managing spacing in Solis — the scale, settings, and code, from both a developer and merchant perspective.
---

**TL;DR:** Everything about managing spacing in Solis — the scale, settings, and code, from both a developer and merchant perspective.

Everything about spacing, in one place. If you have a question about how spacing works in Solis, whether you're a developer defining the scale or deciding whether a value should be merchant-editable, it should be answered somewhere in this section.

## What's in this section

| Page | Answers |
|---|---|
| [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/) | A defined scale instead of one-offs, semantic roles, fluid spacing with `clamp()`, naming rules |
| [Spacing in Settings](/spacing/spacing-in-settings/) | The `range` setting type, and when a spacing value should actually be merchant-editable |
| [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/) | Logical properties for RTL, `gap` over margin hacks, custom property vs. class |

## How the pieces fit together

Spacing starts as a fixed scale in CSS (see [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/)), most of which stays fixed rather than merchant-editable. [Spacing in Settings](/spacing/spacing-in-settings/) covers the specific, low-risk cases (mostly section-level padding) where a `range` setting is actually worth adding. [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/) covers how spacing gets written correctly day to day: logical properties so it works in RTL languages, and the rule for choosing between a custom property and a class.

## Quick answers

**"Should spacing be a merchant-facing setting?"** Usually no. Most spacing is a fixed design decision. Section padding is the main exception. See [Spacing in Settings](/spacing/spacing-in-settings/).

**"Why does my spacing look wrong in Arabic/Hebrew?"** You're probably using a physical property (`margin-left`) instead of a logical one (`margin-inline-start`). See [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/#logical-properties-required-for-rtl).

**"How do I avoid a `:last-child` margin hack?"** Use `gap` on the container instead. See [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/#gap-over-margin-hacks-for-spacing-between-siblings).

**"What do I name a spacing token?"** After its role or scale position (`--spacing-section-block`, `--space-lg`), never its current value. See [Spacing Scale & Tokens](/spacing/spacing-scale-and-tokens/#naming-role-first-value-never).

**"One custom property or a class?"** One property varying → custom property. Several varying together → class. See [Spacing in Liquid & CSS](/spacing/spacing-in-liquid-and-css/#one-property-varies--a-custom-property-several-vary-together--a-class).

## Further reading

- [Design System & Configuration](/design-system/): the broader section this one was split out of
- [Fonts](/fonts/): the companion section for typography tokens and settings
- [Colors](/colors/): the companion section for color tokens and settings
