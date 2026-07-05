---
title: Store Setup for Submission
description: The operational checklist for configuring a demo store correctly — distinct from the account setup and the content quality bar.
---

[Partner Dashboard Setup](/publishing/partner-dashboard-setup/) covers the *accounts* you need. [Store & Design Requirements](/theme-store-requirements/store-and-design/) covers the *content quality bar* your demo store's photography and copy need to clear. This page is the operational checklist in between: how to actually configure a demo store so it's ready for a reviewer to open and test.

## One store per preset, matching that preset's positioning

Every theme preset needs its own demo store, and each demo store's industry and catalog size should genuinely match what that preset is positioned/tagged as. A "Boutique" preset demoed with a hardware-store catalog undermines the reviewer's ability to judge whether the preset actually works for its stated audience.

## Showcase real variability, not just your best-case content

Shopify's own guidance is specific about what a demo store should actually contain — not just "nice photos," but examples of the states a real merchant's catalog will include:

- A product that's on sale (with a compare-at price).
- A sold-out product, and a sold-out *variant* on an otherwise-available product.
- A product with multiple variants (color/size combinations).
- A gift card product.
- Realistic product titles and descriptions — including at least one on the longer end, per [Store & Design Requirements](/theme-store-requirements/store-and-design/#layout-resilience--the-check-reviewers-actually-run)'s layout-resilience testing.

A demo store that only shows the easy, uniform case (every product in stock, every title short, no sales) doesn't give a reviewer — or a prospective merchant browsing the Theme Store listing — any evidence that the theme handles real-world catalog variety.

## Storefront password: the same one, shared

All of your demo stores should use the **same** storefront password, shared clearly as part of your submission — reviewers need to access every demo store's live storefront directly, and a mismatched or missing password is friction that stalls review for no good reason.

## Use the actual, current version of your theme

The demo store must run the **same version you're submitting** — not an older build. This sounds obvious, but it's an easy thing to lose track of if the demo store was set up early in the project and not re-pushed after later changes; re-push before every submission (or resubmission), don't assume it's still current.

## Be ready for admin-level access

Shopify's review team may access the demo store's Shopify admin (not just the storefront) as part of review — this means the admin should be in a genuinely presentable, realistic state too: sensible settings, no test/debug data left over from development, no half-configured apps.

## Payments: test mode only

Use Bogus Gateway or Shopify Payments' test mode — never live payment processing on a demo store. This is also called out in [Store & Design Requirements](/theme-store-requirements/store-and-design/#demo-stores); worth repeating here because it's an easy thing to accidentally leave enabled from earlier testing.

## Legal and policy pages, actually filled in

Checkout and footer templates commonly link to a privacy policy, refund policy, shipping policy, and terms of service. A demo store with these left as Shopify's default placeholder text (or missing entirely) undermines the "real store" impression the whole demo-store requirement is about — fill them in with realistic (even if generic) policy content before submission.

## Navigation menus matching your theme's actual defaults

If your theme's `link_list` settings default to `main-menu`/`footer` (see the pre-zip sanity checklist in [Packaging & Submitting](/publishing/packaging-and-submitting/)), confirm the demo store's actual menus under those handles are populated with a realistic structure — an empty or single-item main menu makes every template look sparse regardless of how good the section code is.

## Apps: none that fake functionality your theme doesn't have

Only install apps on a demo store that are incidental to demonstrating the theme (e.g. a review app if your theme has genuine review-section support) — never an app used to paper over something the theme doesn't actually do natively. A reviewer testing the theme's own settings, not an app's, needs to see the theme's real behavior.

## A pre-submission store checklist

- [ ] Demo store's industry/catalog matches this preset's positioning.
- [ ] Catalog includes: an on-sale product, a sold-out product/variant, a multi-variant product, a gift card product, and at least one long product title.
- [ ] Storefront password set, and identical across every preset's demo store.
- [ ] Demo store is running the exact version being submitted (re-pushed recently, not stale).
- [ ] Admin itself is in a presentable state — no leftover test/debug data.
- [ ] Payments are test-mode only.
- [ ] Privacy policy, refund policy, shipping policy, and terms of service pages are filled in with real content.
- [ ] Main and footer navigation menus are populated realistically, matching the theme's default `link_list` handles.
- [ ] No apps installed that fake functionality the theme doesn't actually provide.

## Best practices

- Build demo store content alongside the theme, not as a rushed final step — see [Store & Design Requirements](/theme-store-requirements/store-and-design/)'s note on why this also surfaces real layout bugs earlier.
- Re-push the theme to every demo store immediately before each submission, rather than assuming an earlier push is still current.
- Walk through the pre-submission store checklist above as an actual checklist, not a mental skim — several of these items are easy to forget specifically because they were "already done" weeks earlier and silently drifted (a re-enabled live payment method, a stale theme version).

## Common mistakes

- **Demoing a preset with content that doesn't match its stated industry/catalog size.**
- **Showing only the easy-case catalog** — no sale, no sold-out items, no multi-variant products — leaving no evidence the theme handles real variability.
- **Different or missing storefront passwords across presets' demo stores**, creating avoidable review friction.
- **Submitting against a stale demo store** that doesn't reflect the actual version under review.
- **Leaving policy pages as placeholder text**, undermining the "realistic store" impression the whole requirement exists for.

## Quick Reference

- One demo store per preset, matching its positioning; same storefront password across all of them.
- Show real catalog variety: on-sale, sold-out, multi-variant, gift card, and a long title.
- Keep the demo store's theme version current, and its admin presentable — reviewers may access both.
- Test-mode payments only; real policy pages; realistic, populated navigation menus.

## Further Reading

- [Store & Design Requirements](/theme-store-requirements/store-and-design/) — the content quality bar this checklist supports
- [Partner Dashboard Setup](/publishing/partner-dashboard-setup/) — the account/access layer beneath this
- [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
