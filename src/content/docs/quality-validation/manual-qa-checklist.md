---
title: Manual QA Checklist
description: Testing real pages with real, and sometimes unusual, content.
---

Linting is an automatic tool that scans your code for mistakes. But it can't tell you if a layout actually looks broken to a real person. That's what this checklist is for.

Run this checklist by hand every time a section or page changes in a real way. Use your dev store (a test version of a Shopify store where you can safely try things out) with real product and collection data. Then add a few deliberately odd test cases too, like a very long product title or an empty collection.

This checklist is grouped by area of the store, the same way our old QA checklist was. That way, you can just run the section that matches what you changed, instead of testing everything every time.

## Home page

- [ ] Loads correctly with zero sections added (an almost blank homepage should not show an error)
- [ ] Loads correctly with one section added
- [ ] Loads correctly with many sections added (10 or more), with no layout collisions between them
- [ ] Every section's empty state (for example, no products in a featured collection, no blog posts, or no reviews) shows a sensible message, not a blank gap
- [ ] Page loads at a reasonable speed on a slow, throttled mobile connection, not just on your fast local Wi-Fi
- [ ] No errors appear in the browser console when the page loads (check this using your browser's DevTools)

## Header

- [ ] A multi-level menu (a menu with sub-menus nested inside it) opens and closes correctly on desktop
- [ ] The same multi-level menu opens and closes correctly on mobile too (mobile menus are often built separately from desktop ones, so test both)
- [ ] You can reach and use the search, cart, and account icons using only your keyboard, with no mouse
- [ ] Long menu labels (test with a genuinely long collection or page name) don't break the layout or spill outside their box
- [ ] The cart icon updates right away when you add an item, without reloading the whole page
- [ ] A sticky header (a header that stays fixed at the top as you scroll), if your theme has one, doesn't overlap content or break while scrolling
- [ ] An announcement bar, if present, can be closed or rotates through messages correctly, and doesn't reappear after you close it in the same session

## Footer

- [ ] Renders as a section group, so the merchant can add, remove, and reorder footer sections in the theme editor
- [ ] The newsletter signup form checks that the email address looks valid, and shows a clear success or error message
- [ ] The newsletter signup handles an email that's already subscribed without a confusing error
- [ ] Every footer menu link works correctly (no dead links pointing to placeholder pages)
- [ ] Social icons only show for platforms the merchant has actually set up, with no empty or dead icons for the rest

## Sections (general, apply to every section you build)

- [ ] Still works correctly with zero blocks added (see [Your First Section & Block](/scaffold-setup/first-section-and-block/) for the pattern to use)
- [ ] Still works correctly with one block
- [ ] Still works correctly with 10 or more blocks
- [ ] Still works correctly with a 200-character heading (a very long title) without breaking the layout
- [ ] Still works correctly with the longest realistic body text you can construct
- [ ] The color scheme setting actually changes the section's colors, and text stays readable (good contrast) in every scheme option
- [ ] Renders correctly inside the theme editor's live preview, not only on the live storefront (check the `request.design_mode` behavior if the section has any editor-only logic)

## Pages

- [ ] A standard page shows `page.title` and `page.content` correctly, including any rich-text formatting inside it, like lists, headings, and links
- [ ] The contact page's alternate template (a separate layout used just for that page) works, and the form submits successfully
- [ ] The contact form shows a clear error message when a required field is left empty
- [ ] The contact form shows a clear success message after you submit it
- [ ] The 404 page (the page shown when a link is broken) appears for a genuinely broken URL, with a working search bar or a link back to the homepage

## Link sharing (social + Open Graph)

- [ ] Sharing a product link on Facebook or Twitter shows the correct title, description, and thumbnail image
- [ ] Sharing a collection or blog article link shows correct metadata (page details), not just the homepage's default
- [ ] A product with no image falls back to a sensible default share image, instead of showing a broken image

## Local pickup

- [ ] Pickup availability shows correctly on the product page when it's turned on for a location
- [ ] Pickup availability is hidden, or shows a sensible message, when the merchant has zero pickup locations configured
- [ ] Selecting a different variant updates pickup availability, if availability differs by variant

## Unit pricing

- [ ] The unit price displays correctly on the collection page when a product has unit pricing enabled
- [ ] The unit price displays correctly on the product page
- [ ] The unit price displays correctly on the cart page
- [ ] The unit price displays correctly on the customer's order page
- [ ] Products without unit pricing enabled don't show a broken or empty unit-price element

## Rich media

- [ ] 3D models load and you can interact with them in the product gallery
- [ ] An embedded video (YouTube or Vimeo) loads and plays correctly in the product gallery
- [ ] A native or uploaded video plays correctly, with the controls you'd expect
- [ ] A product with only static images (no rich media) doesn't show a broken media placeholder

## Selling plans (subscriptions)

- [ ] The selected selling plan (a subscription option, like "deliver every month") displays correctly in the cart
- [ ] The selected selling plan displays correctly on the customer's order page
- [ ] A product with no selling plans configured doesn't show a broken or empty subscription UI
- [ ] Switching between a one-time purchase and a subscription option updates the displayed price correctly

## A note on how to actually run this

Don't try to run the whole list above for every single PR (a PR, or "pull request," is a proposed code change waiting to be reviewed). If you do, the checklist gets so slow that people start skipping it entirely under time pressure. Instead:

- Always run the **"Sections (general)"** group on every section you touch. It's the most useful group, and it applies almost everywhere.
- Run a specific feature group (Local pickup, Unit pricing, Rich media, Selling plans) only when your change actually touches that feature.
- Run the **full list**, top to bottom, as part of the [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) before shipping.

## Best practices

- Build a small set of "torture test" data in your dev store once. A torture test just means data designed to try to break things, like a product with a 250-character title, an empty collection, a sold-out variant, and a product with 20 variants. Reuse this same data for every QA pass instead of making up new test data each time.
- Make the general "Sections" checklist a habit on every PR that touches a section, even one that looks minor. Regressions (bugs that bring back a problem you already fixed) are the most common kind here, and the cheapest to catch right away.
- Treat a failed manual QA check the same as a failed CI check. Don't merge your change and plan to "fix it later."

## Common mistakes

- **Only testing with your demo store's clean, curated data.** The bugs that reviewers catch are almost always the ones that only show up with messy, real-world data.
- **Skipping the general "Sections" checklist because a change "is small."** Small changes are exactly where an overlooked edge case, like a missing blank check or a broken empty state, tends to slip through.
- **Treating feature-specific checks (unit pricing, selling plans) as a one-time setup check**, instead of re-running them whenever the surrounding code changes, even if that feature wasn't the target of the change.

## Quick Reference

- Test every section with zero, one, and many blocks, and with unusually long text. This is the single most common thing that breaks, and it usually gets caught late.
- Test features (local pickup, unit pricing, selling plans, rich media) with real settings turned on, not just by looking at them in isolation.
- Build reusable "torture test" data once in your dev store, instead of making it up for each QA pass.

## Further Reading

- [Theme Store requirements: Features & Pages](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
