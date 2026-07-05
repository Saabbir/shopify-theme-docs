---
title: Pre-Submission Checklist
description: The final gate before you submit to the Shopify Theme Store.
---

Run this once, in full, before you submit. It pulls the highest-risk items from all 22 official requirements — see [Theme Store Requirements](/theme-store-requirements/) for the complete detail behind each line.

## Structural

- [ ] Scaffolded from Skeleton Theme, or fully original code — nothing derived from Dawn or Horizon
- [ ] All 14 required templates present and rendering (see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/))
- [ ] Main product section and featured product section accept `@app` blocks
- [ ] A Custom Liquid section and block exist, each with a `liquid`-type setting
- [ ] Header and footer are rendered via section groups, not hardcoded into `theme.liquid`

## Performance & accessibility

- [ ] Lighthouse Performance ≥ 60 and Accessibility ≥ 90, averaged across product/collection/home, desktop + mobile, tested against real content
- [ ] Keyboard-only pass completed on the full purchase flow (home → product → cart → checkout)
- [ ] Color contrast checked: 4.5:1 body text, 3:1 large text/icons

## Content & design

- [ ] Demo store uses real photography and real copy — no Lorem Ipsum
- [ ] Theme name is 1–2 words, under 30 characters, and doesn't collide with a Shopify/industry/SEO term
- [ ] Theme is structurally unique, not a reskin (see [Store & Design Requirements](/theme-store-requirements/store-and-design/))

## Settings & schema

- [ ] Every setting has a `label`, uses `t:` locale keys, and follows [Shopify's terminology list](/theme-store-requirements/schema-best-practices/)
- [ ] `metaobject`/`metaobject_list` settings use only standard definitions
- [ ] No `settings_data.json` default points at a resource that only exists in your demo store
- [ ] At least 4 color settings, each with a paired foreground color

## Assets & code quality

- [ ] No Sass/SCSS files anywhere in the theme
- [ ] No pre-minified CSS/JS (except approved third-party libraries)
- [ ] `shopify theme check` passes with zero offenses

## Business readiness

- [ ] Theme documentation and a public contact form exist and are linked from your listing
- [ ] Support workflow in place to answer merchant requests within 2 business days
- [ ] Version number and release notes prepared for this submission

## Quick Reference

- This is the last gate, not the first pass — everything here should already be true well before submission day, confirmed one more time.
- A single missing item causes full rejection — treat every checkbox as mandatory, not aspirational.

## Further Reading

- [Full Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
- [Submitting your theme](/publishing/packaging-and-submitting/) — this handbook
