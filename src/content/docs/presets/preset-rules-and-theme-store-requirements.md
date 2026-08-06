---
title: Preset Rules & Theme Store Requirements
description: Every preset rule across theme, section, and block presets — hard platform limits, wording and naming conventions, and Theme Store submission requirements — with what's mandatory and what's optional stated plainly.
---

**TL;DR:** Every preset rule across theme, section, and block presets — hard platform limits, wording and naming conventions, and Theme Store submission requirements — with what's mandatory and what's optional stated plainly.

Three different things share the word "preset" in a Shopify theme: a [theme preset](/presets/theme-presets/), a [section preset](/presets/section-presets/), and a [block preset](/presets/block-presets/). Each has its own rules, scattered across their own pages by design, since they're genuinely different mechanisms. This page exists to answer one specific question fast: **is this rule mandatory, or is it a recommendation?** Everything here is checked directly against shopify.dev's schema references and the Theme Store requirements documentation, not general assumptions.

## Master table: mandatory vs. optional, every preset rule in one place

| Rule | Applies to | Mandatory or optional? |
|---|---|---|
| At least one theme preset in `settings_data.json` | Theme presets | **Mandatory** — every theme needs a `"current"` and at least one entry in `"presets"` |
| No more than 5 theme presets total | Theme presets | **Mandatory hard limit** — a platform ceiling, not a guideline |
| `settings_data.json` under 1.5MB | Theme presets | **Mandatory hard limit** |
| More than one theme preset | Theme presets | **Optional** — one preset is a complete, valid submission |
| A dedicated demo store per theme preset | Theme presets | **Mandatory** for every preset you submit |
| A cohesive look across every template (index, product, collection, blog, search, cart) per preset | Theme presets | **Mandatory** — reviewers check this explicitly, not just the homepage |
| Listing/marketing information (photography, description, industry, catalog size) per preset in the Partner Dashboard | Theme presets | **Mandatory** for every preset to actually appear on the Theme Store, including ones added after launch |
| A `"presets"` array on a **section**'s schema | Section presets | **Optional**, but strongly recommended for any section a merchant adds from the picker |
| More than one preset on a single section | Section presets | **Optional** — reach for it only when there's a genuinely distinct second starting point |
| A `"presets"` array on a **dynamic block**'s schema | Block presets | **Effectively mandatory** — a dynamic block with none never appears in the "Add block" picker at all |
| A `"presets"` array on a **static block** | Block presets | **Not applicable / optional** — static blocks render from their `content_for "block"` placement regardless; a preset entry only overrides default settings |
| `category` on a section or block preset | Section & block presets | **Optional** — recommended once a section or block offers 3+ presets |
| Realistic example content in preset blocks, not placeholder text | Section & block presets | **Mandatory** per Theme Store design review |
| `t:` localization on every preset `name` and `category` | All preset types | **Mandatory** convention, same as the rest of the schema (see [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/#setting-groups-the-t-convention)) |
| Sentence case for preset names, no ampersands | All preset types | **Mandatory** wording convention (see [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/)) |
| `"default"` instead of `"presets"` on a statically rendered section | Section presets | **Mandatory** — a statically rendered section's `"presets"` array is simply never used |

## Theme Store review: what a reviewer actually checks

Beyond the platform's hard technical limits, a human reviewer evaluates presets as part of the broader [Store & Design Requirements](/theme-store-requirements/store-and-design/) review:

1. **Every preset has its own realistic demo store.** No shared demo store across presets, and no "Lorem Ipsum" or onboarding placeholder content anywhere on it.
2. **Every preset looks intentional and finished on every template**, not just the marketing screenshots. A reviewer clicks through index, a product page, a collection, the blog, search, and cart for each preset.
3. **Every preset's settings schema passes the same wording and hygiene rules** as the base theme: sentence case, no ampersands, no numbered options, every setting has a label. See [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) for the full rule set, it applies identically inside preset-populated settings.
4. **Presets aren't a cosmetic reskin of each other.** Two presets that are identical except for a color swap don't meaningfully help a merchant choose, and undermine the case for shipping more than one in the first place (see [Store & Design Requirements: uniqueness](/theme-store-requirements/store-and-design/#uniqueness) for the same principle applied at the whole-theme level).

## The zip structure requirement, briefly

Submitting more than one theme preset changes your zip's folder structure: each additional preset needs a `/listings/<preset-name>/` folder containing only the files it overrides, while the base `/templates` and `/sections` folders remain the fallback every preset inherits from. This is a packaging mechanic, not a schema rule, covered in full in [Packaging & Submitting](/publishing/packaging-and-submitting/). One preset needs no `/listings` folder at all — it's only required once you have more than one.

## Common mistakes across all three preset types

- **Treating "optional" as "skippable without cost."** A dynamic block with no preset isn't technically broken, it's just invisible, which is worse: it produces no error and no warning anywhere in the toolchain.
- **Building a second theme preset that's a cosmetic reskin of the first**, spending real engineering time on something that doesn't actually widen your Theme Store reach.
- **Forgetting the demo store and listing information are separate deliverables from the code.** A perfectly coded second preset that never gets a demo store or listing submission never becomes visible to merchants.
- **Applying the mandatory `t:` and sentence-case rules to a section's own settings but forgetting they apply equally to preset `name` and `category` strings.**

## Key Takeaways
- Mandatory, hard platform limits: at least one theme preset, max 5 theme presets, `settings_data.json` under 1.5MB.
- Mandatory for any dynamic block you want merchants to find: at least one block preset.
- Mandatory for every preset you submit: its own demo store, a cohesive look across every template, and listing information in the Partner Dashboard.
- Optional everywhere else: extra theme presets, extra section/block presets, and `category` grouping, all genuinely optional, reach for them only when there's a real, distinct use case.
- Static blocks are the one place `"presets"` isn't a visibility requirement at all, they render from Liquid regardless.

## Further Reading

- [Theme Presets](/presets/theme-presets/), [Section Presets](/presets/section-presets/), [Block Presets](/presets/block-presets/): the full detail behind every rule summarized here
- [Real-World Preset Examples](/presets/real-world-preset-examples/): worked examples applying these rules
- [Store & Design Requirements](/theme-store-requirements/store-and-design/): the demo store and design-consistency requirements in full
- [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/): the wording and hygiene rules that apply inside presets too
- [Packaging & Submitting](/publishing/packaging-and-submitting/): the `/listings` zip structure for multi-preset submissions
- [Theme store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
