---
title: Performance & Lighthouse
description: The exact Lighthouse thresholds Shopify enforces, and how to hit them.
---

## The numbers

Shopify runs Lighthouse against your product, collection, and home page, on both desktop and mobile, using a benchmark dataset (real content, not empty sections). You need:

| Metric | Minimum score |
|---|---|
| Performance | 60 (average across all pages/devices) |
| Accessibility | 90 (average across all pages/devices) |

These are averages, so one weak page can be pulled up by strong ones — but don't rely on that. Treat 60/90 as the floor, not the target.

## Practical ways to hit these numbers

- **Images**: always use a responsive image strategy (multiple sizes via `srcset`, lazy-loaded except above-the-fold). See [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) for the exact requirement.
- **CSS/JS**: ship only what a page needs. Use Horizon-style scoped `{% stylesheet %}`/`{% javascript %}` tags inside sections and blocks instead of one giant global bundle — see [Sections & Section Groups](/codebase-structure/sections-and-section-groups/).
- **Fonts**: use the theme's `font_picker` setting (required anyway — see [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/)) rather than loading extra custom web fonts.
- **Third-party scripts**: every extra script is a performance cost. Don't add a library for something 40 lines of vanilla JS can do.

## Test before you submit

Run a Lighthouse audit against Shopify's benchmark dataset before submitting — don't find out your score during review. See [Manual QA Checklist](/quality-validation/manual-qa-checklist/) for how this fits into your pre-submission routine.

## Quick Reference

- Performance ≥ 60, Accessibility ≥ 90, averaged across product/collection/home, desktop + mobile.
- Sections must have real content when tested — empty sections don't count.
- Test against the benchmark dataset before you submit, not after rejection.

## Further Reading

- [Lighthouse performance and accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#6-lighthouse-performance-and-accessibility) — shopify.dev
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) — shopify.dev
