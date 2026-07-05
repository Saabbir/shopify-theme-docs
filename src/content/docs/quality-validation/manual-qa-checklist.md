---
title: Manual QA Checklist
description: Testing real pages with real — and unusually shaped — content.
---

Linting can't tell you a layout looks broken. Run this by hand whenever a section or page changes meaningfully, using your dev store's real product/collection data plus deliberately awkward test cases. This is grouped the same way our old QA checklist was — by area of the store — so you can run just the section relevant to what you changed.

## Home page

- [ ] Loads correctly with zero sections added (a nearly blank homepage shouldn't error)
- [ ] Loads correctly with one section added
- [ ] Loads correctly with many sections added (10+), no layout collisions between them
- [ ] Every section's empty state (no products in a featured collection, no blog posts, no reviews) displays a sensible message, not a blank gap
- [ ] Page loads acceptably fast on a throttled mobile connection, not just on your local Wi-Fi
- [ ] No console errors on load (check DevTools)

## Header

- [ ] Multi-level (nested) menu opens and closes correctly on desktop
- [ ] Multi-level (nested) menu opens and closes correctly on mobile (often a separate implementation — test both explicitly)
- [ ] Search, cart, and account icons all reachable and operable by keyboard alone
- [ ] Long menu item labels (test with a genuinely long collection/page name) don't break the layout or overflow
- [ ] Cart icon updates immediately when an item is added, without a full page reload
- [ ] Sticky header (if implemented) doesn't overlap content or break on scroll
- [ ] Announcement bar (if present) can be dismissed/rotates correctly, and doesn't reappear after dismissal on the same session

## Footer

- [ ] Renders as a section group — merchant can add/remove/reorder footer sections in the theme editor
- [ ] Newsletter signup form validates email format and shows a clear success/error message
- [ ] Newsletter signup handles a duplicate/already-subscribed email gracefully
- [ ] Footer menu links all resolve correctly (no dead links to placeholder pages)
- [ ] Social icons only show for platforms the merchant has actually configured — no dead/empty icons for unconfigured platforms

## Sections (general — apply to every section you build)

- [ ] Survives zero blocks (see [Your First Section & Block](/scaffold-setup/first-section-and-block/) for the pattern)
- [ ] Survives one block
- [ ] Survives 10+ blocks
- [ ] Survives a 200-character heading without breaking layout
- [ ] Survives the longest realistic body text you can construct
- [ ] Color scheme setting actually changes the section's colors, including text contrast in every scheme option
- [ ] Renders correctly in the theme editor's live preview, not just the storefront (check `request.design_mode` behavior if the section has any editor-specific logic)

## Pages

- [ ] Standard page renders `page.title` and `page.content` correctly, including any embedded rich-text formatting (lists, headings, links)
- [ ] Contact page's alternate template works and submits successfully
- [ ] Contact form shows a clear validation error for a missing required field
- [ ] Contact form shows a clear success message/state after submission
- [ ] 404 page displays for a genuinely broken URL, with a working search bar or homepage link

## Link sharing (social + Open Graph)

- [ ] Sharing a product link on Facebook/Twitter shows the correct title, description, and thumbnail
- [ ] Sharing a collection or blog article link shows correct metadata (not just the homepage's default)
- [ ] A product with no image falls back to a sensible default share image instead of a broken image

## Local pickup

- [ ] Pickup availability shows correctly on the product page when enabled for a location
- [ ] Pickup availability is hidden or shows a sensible message when the merchant has zero pickup locations configured
- [ ] Selecting a different variant updates pickup availability if it differs by variant

## Unit pricing

- [ ] Unit price displays correctly on the collection page when a product has unit pricing enabled
- [ ] Unit price displays correctly on the product page
- [ ] Unit price displays correctly on the cart page
- [ ] Unit price displays correctly on the customer order page
- [ ] Products without unit pricing enabled don't show a broken or empty unit-price element

## Rich media

- [ ] 3D models load and are interactive in the product gallery
- [ ] Embedded video (YouTube/Vimeo) loads and plays correctly in the product gallery
- [ ] Native/uploaded video plays correctly, with expected controls
- [ ] A product with only static images (no rich media) doesn't show a broken media placeholder

## Selling plans (subscriptions)

- [ ] Selected selling plan displays correctly in the cart
- [ ] Selected selling plan displays correctly on the customer's order page
- [ ] A product with no selling plans configured doesn't show a broken or empty subscription UI
- [ ] Switching between one-time purchase and a subscription option updates the displayed price correctly

## A note on how to actually run this

Don't try to run the entire list above for every single PR — that's how QA checklists get skipped entirely under time pressure. Instead:

- Run the **"Sections (general)"** group on every section you touch, always — it's the highest-value, most universally applicable set.
- Run the specific feature group (Local pickup, Unit pricing, Rich media, Selling plans) only when your change actually touches that feature.
- Run the **full list**, top to bottom, as part of the [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) before shipping.

## Best practices

- Build a small set of "torture test" data in your dev store once (a product with a 250-character title, an empty collection, a sold-out variant, a product with 20 variants) and reuse it for every QA pass instead of improvising test data each time.
- Run the general "Sections" checklist as a default habit on every PR touching a section, even a seemingly minor change — regressions here are the most common and the cheapest to catch immediately.
- Treat a failed manual QA check the same as a failed CI check — don't merge past it "to fix later."

## Common mistakes

- **Only testing with your demo store's curated, well-behaved data.** The bugs that get caught in review are almost always the ones that only show up with awkward real-world data.
- **Skipping the general "Sections" checklist because a change "is small."** Small changes are exactly where an overlooked edge case (a missing blank check, a broken empty state) slips through.
- **Treating feature-specific checks (unit pricing, selling plans) as one-time setup validation** instead of re-running them whenever the surrounding code changes, even if the feature itself wasn't the target of the change.

## Quick Reference

- Test every section with zero/one/many blocks and unusually long text — this is the single most common thing that breaks and gets caught late.
- Test features (local pickup, unit pricing, selling plans, rich media) with real settings enabled, not just visually inspected in isolation.
- Build reusable "torture test" data once in your dev store rather than improvising it per QA pass.

## Further Reading

- [Theme Store requirements — Features & Pages](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
