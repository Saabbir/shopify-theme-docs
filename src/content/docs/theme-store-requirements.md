---
title: Shopify Theme Store Requirements
description: What Shopify requires before it will list your theme, in plain English.
---

Shopify's [official requirements page](https://shopify.dev/docs/storefronts/themes/store/requirements) has 22 numbered sections. This page is the map; each sub-page below covers a group of them in depth, with the "why," a code example, and a link back to the exact official requirement.

:::caution[Read this first]
As of 2025, **Shopify's Skeleton Theme is the only approved starting codebase for Theme Store submissions.** New themes built on or derived from Dawn or Horizon are explicitly not eligible — only Skeleton Theme or fully original code. See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) for what this means for us.
:::

## Why this section matters more than it might seem

Every one of the 22 requirements is a hard gate, not a suggestion. Shopify's review team checks all of them in sequence (see [Review Process & Rejections](/publishing/review-process-and-rejections/)), and missing even a single item — a missing `@app` block, a forgotten `label` on a setting, a `.scss` file that slipped in — results in a full rejection, not a partial pass. The practical implication for how we work: build every requirement in from day one, treat this section as a running checklist during development, and re-verify all of it right before submission (see [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/)) rather than trying to retrofit compliance at the end.

## The 22 requirements, grouped

| Group | Official sections | Covered on |
|---|---|---|
| Store identity & design | 1 Exclusivity, 2 Uniqueness, 3 Design & UX, 18 Naming, 20 Demo stores | [Store & Design Requirements](/theme-store-requirements/store-and-design/) |
| Performance | 6 Lighthouse | [Performance & Lighthouse](/theme-store-requirements/performance/) |
| Accessibility | 12 Accessibility | [Accessibility](/theme-store-requirements/accessibility/) |
| Global reach | 4 (language/country selection) | [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/) |
| Apps | 5 (app blocks), 8 (no app-dependent features) | [App Compatibility](/theme-store-requirements/app-compatibility/) |
| Custom data | 14 (metaobject settings) | [Metafields & Metaobjects](/theme-store-requirements/metafields/) |
| Coverage | 4 Features, 5 Templates, 7 Pages, 9 Browsers, 10 Assets, 11 SEO, 13 Social, 19 Versions, 21 Docs, 22 Support | [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) |
| Schema quality | 14 Settings, 15 Font picker, 16 Color system | [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) |

## TL;DR — the requirements that reject the most submissions

If you only have time to triple-check a handful of things before submitting Solis, make it these — based on what most commonly trips up first-time Theme Partners:

- ☑ Scaffolded from Skeleton Theme (or fully original code) — never Dawn or Horizon
- ☑ Structurally unique design, not a reskin of an existing Theme Store theme
- ☑ Lighthouse Performance ≥ 60, Accessibility ≥ 90 on real content
- ☑ `@app` blocks in the main product section and featured product section
- ☑ Realistic demo store — no Lorem Ipsum, no placeholder copy
- ☑ Every `metaobject`/`metaobject_list` setting uses a standard definition, never a custom one

## How to use this section day to day

- **While building a new section or feature**, check [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) and [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) for anything relevant before you start, not after.
- **While reviewing a PR**, cross-check against [Accessibility](/theme-store-requirements/accessibility/) and [Performance & Lighthouse](/theme-store-requirements/performance/) — these are the two most commonly regressed by an unrelated change.
- **Right before submission**, work through every sub-page here once, in full — see [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) for the consolidated version.

## Best practices

- Build every requirement in as you go, section by section — don't treat this list as a "fix it before submission" backlog. Retrofitting accessibility or app-block support across 20 existing sections is far more expensive than building it in from the first one.
- When a requirement is ambiguous for a specific design decision, err toward the stricter reading — a borderline pass on your own judgment often reads as a clear fail to Shopify's review team.
- Re-read this section's sub-pages periodically, not just once at project kickoff — Shopify updates these requirements, and a page you memorized at the start of the project may have changed by the time you submit.

## Common mistakes

- **Treating requirements as a final QA pass instead of a build-time constraint.** By the time you've built 15 sections without app-block support, adding it retroactively touches every one of them.
- **Assuming something "basically" meets a requirement.** Shopify's review is binary per requirement — there's no partial credit for an accessibility rule that's "mostly" followed.
- **Not re-reading updated requirements.** This is a living document on Shopify's side; check the [official page](https://shopify.dev/docs/storefronts/themes/store/requirements) periodically, not just once.

## Quick Reference

- 22 official requirement categories, all listed at [shopify.dev/.../store/requirements](https://shopify.dev/docs/storefronts/themes/store/requirements).
- Missing even one requirement gets your submission rejected — none of these are optional.
- Test thoroughly before submitting; Shopify explicitly rejects poorly-tested themes without further review.
- Build requirements in during development, not as a pre-submission scramble.

## Further Reading

- [Theme Store requirements (full list)](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
- [Submitting your theme](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) — shopify.dev
