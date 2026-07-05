---
title: Manual QA Checklist
description: Testing real pages with real — and unusually shaped — content.
---

Linting can't tell you a layout looks broken. Run this by hand whenever a section or page changes meaningfully, using your dev store's real product/collection data plus deliberately awkward test cases.

## Home page

- [ ] Loads correctly with zero, one, and many sections added
- [ ] Every section's empty state (no products in a featured collection, no blog posts) displays a sensible message, not a blank gap

## Header

- [ ] Multi-level (nested) menu opens and closes correctly on desktop and mobile
- [ ] Search, cart, and account icons all reachable by keyboard
- [ ] Long menu item labels don't break the layout

## Footer

- [ ] Renders as a section group — merchant can add/remove/reorder footer sections in the theme editor
- [ ] Newsletter signup form validates and shows a clear success/error message

## Sections (general)

- [ ] Every section survives: zero blocks, one block, and 10+ blocks
- [ ] Every section survives a 200-character heading without breaking layout
- [ ] Color scheme setting actually changes the section's colors

## Pages

- [ ] Standard page renders `page.title` and `page.content` correctly
- [ ] Contact page's alternate template works and submits successfully

## Link sharing (social + Open Graph)

- [ ] Sharing a product/page link on Facebook/Twitter shows the correct title, description, and thumbnail

## Local pickup

- [ ] Pickup availability shows correctly on the product page when enabled for a location

## Unit pricing

- [ ] Unit price displays correctly on collection, product, cart, and customer pages when a product has unit pricing enabled

## Rich media

- [ ] 3D models and embedded video load and play correctly in the product gallery

## Selling plans (subscriptions)

- [ ] Selected selling plan displays correctly in the cart and on the customer's order page

## Quick Reference

- Test every section with zero/one/many blocks and unusually long text — this is the single most common thing that breaks and gets caught late.
- Test features (local pickup, unit pricing, selling plans, rich media) with real settings enabled, not just visually inspected in isolation.

## Further Reading

- [Theme Store requirements — Features & Pages](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
