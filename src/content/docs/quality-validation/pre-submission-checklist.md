---
title: Pre-Submission Checklist
description: The final gate before you submit to the Shopify Theme Store.
---

**TL;DR:** The final gate before you submit to the Shopify Theme Store.

Run this checklist once, all the way through, right before you submit. It highlights the highest-risk items from all 22 official requirements. See [Theme Store Requirements](/theme-store-requirements/) for the full detail behind each line.

## Structural

- [ ] Scaffolded from Skeleton Theme, or fully original code, with nothing derived from Dawn or Horizon
- [ ] All 14 required templates present and rendering (see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/))
- [ ] Main product section and featured product section accept `@app` blocks
- [ ] A Custom Liquid section and block exist, each with a `liquid`-type setting
- [ ] Header and footer are rendered via section groups, not hardcoded into `theme.liquid`

## Performance & accessibility

- [ ] Lighthouse Performance ≥ 60 and Accessibility ≥ 90, averaged across product/collection/home, on both desktop and mobile, tested against real content
- [ ] Keyboard-only pass completed on the full purchase flow (home to product to cart to checkout)
- [ ] Color contrast checked: 4.5:1 for body text, 3:1 for large text and icons, in every color scheme the theme offers
- [ ] Focus states are visible throughout, not just where a default browser style you haven't touched happens to show one

## Content & design

- [ ] Demo store uses real photography and real copy, with no Lorem Ipsum placeholder text
- [ ] Theme name is 1–2 words, under 30 characters, and doesn't collide with a Shopify, industry, or SEO term
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

- [ ] Tested on the required desktop browsers (Safari, Chrome, Firefox, Edge, see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/))
- [ ] Tested on the required mobile browsers (Mobile Safari, Chrome Mobile, Samsung Internet)
- [ ] Tested in at least one required webview (Instagram, Facebook, or Pinterest)

## Business readiness

- [ ] Theme documentation and a public contact form exist and are linked from your listing
- [ ] Support workflow in place to answer merchant requests within 2 business days
- [ ] Version number and release notes prepared for this submission (see [After Approval](/publishing/after-approval/), though `release-notes.md` is excluded from your *first* submission specifically)

## How to actually run this checklist without missing anything

A checklist this long is easy to skim past under deadline pressure. Here's a more reliable way to run it:

1. **Have someone else run it, not just you.** Ask someone who didn't build the feature to go through this list. A second pair of eyes catches things the builder has stopped noticing.
2. **Work top to bottom, in one sitting,** instead of checking off items over several days. When you check things partially, an item can quietly get marked "done" without actually being re-tested after a later change.
3. **Re-run it after any change you make following your first full pass,** even something that feels unrelated. A late CSS tweak or copy change is a common way a previously-passing item breaks again.

## Best practices

- Run this checklist on a fresh theme install on a brand-new dev store, not just your main working store. This is the closest you can get to what an actual merchant will see when they install your theme.
- Keep a copy of your results (screenshots, Lighthouse scores) for your own records. If Shopify's review flags something you thought you'd already checked, you'll want proof of what you tested and when.
- Set aside real time for this pass. If you treat it as a quick final glance, items get checked off without actually being re-tested.

## Common mistakes

- **Checking items off from memory,** telling yourself "we handled accessibility earlier," instead of actually re-testing them against the current, final code.
- **Running this checklist only once, early on**, and assuming later changes don't affect what you already checked.
- **Having the same person who built a feature be the only one who checks it off here.** Self-review misses the same blind spots that let the issue into the code in the first place.

## Key takeaways
- This is the last gate, not the first pass. Everything here should already be true well before submission day. You're just confirming it one more time.
- A single missing item can cause full rejection. Treat every checkbox as required, not optional.
- Have someone other than the feature's builder run the final pass.

## Further reading

- [Full Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
- [Submitting your theme](/publishing/packaging-and-submitting/) (from this handbook)
