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
- [ ] Color contrast checked: 4.5:1 body text, 3:1 large text/icons, in every color scheme the theme offers
- [ ] Focus states are visible throughout, not just on default browser styles you haven't touched

## Content & design

- [ ] Demo store uses real photography and real copy — no Lorem Ipsum
- [ ] Theme name is 1–2 words, under 30 characters, and doesn't collide with a Shopify/industry/SEO term
- [ ] Theme is structurally unique, not a reskin (see [Store & Design Requirements](/theme-store-requirements/store-and-design/))
- [ ] Every section tested against a 200-character heading and an empty-content state

## Settings & schema

- [ ] Every setting has a `label`, uses `t:` locale keys, and follows [Shopify's terminology list](/theme-store-requirements/schema-best-practices/)
- [ ] `metaobject`/`metaobject_list` settings use only standard definitions
- [ ] No `settings_data.json` default points at a resource that only exists in your demo store
- [ ] At least 4 color settings, each with a paired foreground color
- [ ] `theme_info` block present in `config/settings_schema.json`

## Assets & code quality

- [ ] No Sass/SCSS files anywhere in the theme
- [ ] No pre-minified CSS/JS (except approved third-party libraries)
- [ ] `shopify theme check` passes with zero offenses
- [ ] No leftover debug code, `console.log` statements, or commented-out blocks of dead code

## Browser & device coverage

- [ ] Tested on the required desktop browsers (Safari, Chrome, Firefox, Edge — see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/))
- [ ] Tested on the required mobile browsers (Mobile Safari, Chrome Mobile, Samsung Internet)
- [ ] Tested in at least one required webview (Instagram, Facebook, or Pinterest)

## Business readiness

- [ ] Theme documentation and a public contact form exist and are linked from your listing
- [ ] Support workflow in place to answer merchant requests within 2 business days
- [ ] Version number and release notes prepared for this submission (see [After Approval](/publishing/after-approval/) — though `release-notes.md` is excluded from the *first* submission specifically)

## How to actually run this checklist without missing anything

A checklist this long is easy to skim past under deadline pressure. A more reliable approach:

1. **Assign it, don't just "check it yourself."** Have someone who didn't build the feature run this list — a second set of eyes catches what the builder has gone blind to.
2. **Work top to bottom, in one sitting**, rather than partially checking items across several days — partial runs are how an item quietly gets marked "done" without actually being re-verified after a later change.
3. **Re-run it after any change made after your first full pass**, even something that feels unrelated — a late CSS tweak or copy change is a common way a previously-passing item breaks again.

## Best practices

- Run this checklist against a fresh theme install on a brand-new dev store, not just your primary working store — this is the closest simulation of what an actual merchant will experience on install.
- Keep a copy of this checklist's results (screenshots, Lighthouse scores) for your own records — if Shopify's review flags something you believe you already verified, you'll want evidence of what you actually tested and when.
- Budget real time for this pass — treating it as a quick final glance is how items get checked off without being genuinely re-verified.

## Common mistakes

- **Checking items off from memory** ("we handled accessibility earlier") instead of actually re-testing them against the current, final code.
- **Running this checklist only once, early**, and treating later changes as automatically still compliant.
- **Having the same person who built a feature also be the only one to check it off here** — self-review misses the same blind spots that made it into the code in the first place.

## Quick Reference

- This is the last gate, not the first pass — everything here should already be true well before submission day, confirmed one more time.
- A single missing item causes full rejection — treat every checkbox as mandatory, not aspirational.
- Have someone other than the feature's builder run the final pass.

## Further Reading

- [Full Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
- [Submitting your theme](/publishing/packaging-and-submitting/) — this handbook
