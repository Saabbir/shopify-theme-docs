---
title: Shopify Theme Store Requirements
description: What Shopify requires before it will list your theme, in plain English.
---

Shopify's [official requirements page](https://shopify.dev/docs/storefronts/themes/store/requirements) lists 22 numbered rules. Think of this page as a map. Each sub-page below covers a group of those rules in depth. You'll get the reason behind each rule, a code example, and a link back to the exact official rule.

:::caution[Read this first]
As of 2025, **Shopify only approves the Skeleton Theme as a starting point for Theme Store submissions.** You can't build a new theme on top of Dawn or Horizon. Only the Skeleton Theme or fully original code is allowed. See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) to learn what this means for us.
:::

## Why this section matters more than it might seem

Every one of the 22 requirements is a hard rule, not a suggestion. Shopify's review team checks all of them, one by one (see [Review Process & Rejections](/publishing/review-process-and-rejections/)). If you miss even one item, like a missing `@app` block, a forgotten `label` on a setting, or a stray `.scss` file, Shopify rejects the whole submission. There's no partial credit.

So build every requirement in from day one. Treat this section as a running checklist while you work, and check everything again right before you submit (see [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/)). Don't leave this for the end and try to patch it all in at once, it's much harder that way.

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

Short on time? Triple-check these before you submit Solis. These are the things that trip up most first-time Theme Partners:

- ☑ Scaffolded from Skeleton Theme (or fully original code), never Dawn or Horizon
- ☑ Structurally unique design, not a reskin of an existing Theme Store theme
- ☑ Lighthouse Performance ≥ 60, Accessibility ≥ 90 on real content
- ☑ `@app` blocks in the main product section and featured product section
- ☑ Realistic demo store, no Lorem Ipsum, no placeholder copy
- ☑ Every `metaobject`/`metaobject_list` setting uses a standard definition, never a custom one

## How to use this section day to day

- **When you're building a new section or feature**, check [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) and [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) first, before you start writing code.
- **When you're reviewing a PR** (short for "pull request," the set of code changes someone wants to merge in), check it against [Accessibility](/theme-store-requirements/accessibility/) and [Performance & Lighthouse](/theme-store-requirements/performance/). These two break most often, usually because of an unrelated change somewhere else.
- **Right before submission**, go through every sub-page here, start to finish. See [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) for the full combined list.

## Best practices

- Build each requirement in as you go, section by section. Don't save this list for a "fix it before submission" pass. Adding accessibility or app-block support to 20 sections after the fact costs far more work than building it in from the first one.
- If a requirement seems unclear for a specific design decision, go with the stricter reading. What feels like a pass to you can still read as a clear fail to Shopify's review team.
- Re-read these pages every so often, not just once at the start of the project. Shopify updates these requirements, so a rule you memorized early on may have changed by the time you submit.

## Common mistakes

- **Treating requirements as a final check instead of a rule you build with from the start.** If you build 15 sections without app-block support, adding it later means touching every single one of them.
- **Assuming something "basically" meets a requirement.** Shopify's review is pass or fail per rule. There's no partial credit for an accessibility rule you "mostly" followed.
- **Not re-reading updated requirements.** Shopify keeps changing this list on its end. Check the [official page](https://shopify.dev/docs/storefronts/themes/store/requirements) every so often, not just once.

## Quick Reference

- 22 official requirement categories, all listed at [shopify.dev/.../store/requirements](https://shopify.dev/docs/storefronts/themes/store/requirements).
- Miss even one requirement and your submission gets rejected. None of these are optional.
- Test thoroughly before submitting. Shopify rejects poorly-tested themes without further review.
- Build requirements in as you develop, not in a last-minute scramble before submission.

## Further Reading

- [Theme Store requirements (full list)](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
- [Submitting your theme](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) (shopify.dev)
