---
title: Presets
description: Everything about presets in one place — theme presets, section presets, and block presets, with real-world examples, benefits, and every rule stated as mandatory or optional.
---

**TL;DR:** Everything about presets in one place — theme presets, section presets, and block presets, with real-world examples, benefits, and every rule stated as mandatory or optional.

"Preset" means three genuinely different things in a Shopify theme, at three different scopes, sharing one word by coincidence more than by design. A [theme preset](/presets/theme-presets/) configures an entire theme's look. A [section preset](/presets/section-presets/) configures what a merchant gets when they add one section. A [block preset](/presets/block-presets/) configures what they get when they add one block. This section pulls all three into one place, with the rules, real-world examples, and Theme Store requirements that used to be scattered across other sections. Facts throughout are verified directly against shopify.dev's schema and Theme Store requirements documentation.

## Quick answers: required vs. optional

| Piece | Required? |
|---|---|
| At least one theme preset in `settings_data.json` | **Required** — every theme needs one |
| More than one theme preset | Optional — one preset is a complete, valid submission |
| No more than 5 theme presets, `settings_data.json` under 1.5MB | **Required hard limits**, not guidelines |
| A demo store per theme preset, and a cohesive look across every template | **Required** for every preset you submit |
| A `"presets"` array on a **section**'s schema | Optional, but strongly recommended for a merchant-added section |
| A `"presets"` array on a **dynamic block**'s schema | **Effectively required** — a block with none never appears in the "Add block" picker |
| A `"presets"` array on a **static block** | Not applicable — static blocks render regardless, from their Liquid placement |
| Realistic example content in preset blocks | **Required** per Theme Store design review |
| `t:` localization and sentence-case naming on preset names | **Required** convention, same as the rest of the schema |

See [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/) for the complete master table.

## Quick answers

**"Why isn't my new block showing up in the editor?"** See [Block Presets: the rule that's easy to miss](/presets/block-presets/#the-rule-that-s-easy-to-miss-dynamic-blocks-need-a-preset-to-appear-at-all). A dynamic block with zero `"presets"` entries never appears in the "Add block" picker at all.

**"I switched a theme preset and my hero image/text didn't change — is that a bug?"** No — see [Theme Presets: how the current/default preset works](/presets/theme-presets/#how-the-currentdefault-preset-actually-works). A preset switch only updates presentational setting types; content settings like text and images are left alone unless you edit that preset's `"sections"` data directly.

**"How many theme presets can I ship?"** Five, maximum. See [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/#master-table-mandatory-vs-optional-every-preset-rule-in-one-place).

**"Should I add a second preset to a section, or just add a setting?"** Depends on how different the two starting points really are — see [Section Presets: when to use more than one preset](/presets/section-presets/#when-to-use-more-than-one-preset-on-the-same-section).

**"Does a static block need a preset to show up?"** No — see [Block Presets: static vs. dynamic blocks](/presets/block-presets/#static-vs-dynamic-blocks-a-different-preset-rule). Static blocks render from their `content_for "block"` placement in Liquid regardless of presets.

## What's in this section

| Page | Covers |
|---|---|
| [Theme Presets](/presets/theme-presets/) | The whole-theme preset: how current/default works, why shipping more than one is worth it, extending a theme step by step, the 5-preset hard limit, and the Theme Store `/listings` mapping |
| [Section Presets](/presets/section-presets/) | The `"presets"` array on a section's schema: full attribute reference, `category` grouping, static-rendering caveats, real-world examples |
| [Block Presets](/presets/block-presets/) | The `"presets"` array on a block's schema: why a dynamic block needs one to appear at all, static vs. dynamic preset rules, nested block presets, real-world examples |
| [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/) | Every rule across all three preset types, in one master table, each one marked mandatory or optional |
| [Real-World Preset Examples](/presets/real-world-preset-examples/) | A full worked multi-preset strategy for Solis, end to end: the business case, the settings_data.json, shared section and block presets, and packaging |

## Why presets exist at all: the benefit in one sentence

A preset turns "configure this from nothing" into "adjust this from something reasonable, already tuned to a real use case." That's true at every scope: a theme preset gives a merchant an entire pre-styled storefront instead of a blank canvas, a section preset gives them a populated, laid-out section instead of an empty one, and a block preset gives them a named, ready-to-use option instead of a generic block they have to fill in themselves. Every page in this section develops that same idea at a different scope, with real Theme Store rules and worked examples attached.

## Best practices

- Start with [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/) if you want the mandatory-vs-optional answer fast, then read the specific page for the scope you're working at.
- Treat a dynamic block's first preset as required, not optional, it's the only thing standing between your block and total invisibility in the editor.
- Reach for a second preset, at any scope, only when there's a genuinely distinct real-world use case behind it, not as a way to expose every settings combination.
- Read [Real-World Preset Examples](/presets/real-world-preset-examples/) before planning your own multi-preset strategy, it walks through the business reasoning, not just the schema syntax.

## Further Reading

- [Config & Global Settings](/config-and-settings/): the `settings_schema.json`/`settings_data.json` architecture theme presets are built on
- [Codebase Structure](/codebase-structure/): where sections and theme blocks (and their local presets) live
- [Theme Store Requirements](/theme-store-requirements/): the full submission checklist presets are one part of
- [Settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) (shopify.dev)
