---
title: Store Setup for Submission
description: The step-by-step checklist for setting up a demo store correctly, separate from account setup and content quality.
---

**TL;DR:** The step-by-step checklist for setting up a demo store correctly, separate from account setup and content quality.

A demo store is a real, working Shopify store that you set up just to show off your theme. Shoppers browsing the Theme Store, and Shopify's reviewers, click through it like a real customer would, so it needs to look and behave like one.

[Partner Dashboard Setup](/publishing/partner-dashboard-setup/) covers the *accounts* you need. [Store & Design Requirements](/theme-store-requirements/store-and-design/) covers the *quality bar* your demo store's photos and copy need to meet. This page is the checklist in between: how to actually set up a demo store so it's ready for a reviewer to open and test.

## One store per preset, matching that preset's positioning

Every theme preset needs its own demo store. Each demo store's industry and catalog size should genuinely match what that preset is meant to be. If you demo a "Boutique" preset with a hardware-store catalog, the reviewer can't properly judge whether the preset actually works for its intended audience.

## Showcase real variability, not just your best-case content

Shopify is specific about what a demo store should contain. It's not just about "nice photos." You need examples of the real situations a merchant's catalog will run into:

- A product that's on sale (with a compare-at price).
- A sold-out product, and a sold-out *variant* on an otherwise-available product.
- A product with multiple variants (color/size combinations).
- A gift card product.
- Realistic product titles and descriptions, including at least one on the longer end, per [Store & Design Requirements](/theme-store-requirements/store-and-design/#layout-resilience--the-check-reviewers-actually-run)'s layout-resilience testing.

A demo store that only shows the easy, uniform case (every product in stock, every title short, no sales) doesn't prove anything to a reviewer, or to a merchant browsing the Theme Store listing, about whether the theme handles real-world catalog variety.

## Storefront password: the same one, shared

All your demo stores should use the **same** storefront password. Share it clearly as part of your submission. Reviewers need to get into every demo store's live storefront directly, and a missing or mismatched password just slows down review for no good reason.

## Use the actual, current version of your theme

The demo store must run the **same version you're submitting**, not an older build. This sounds obvious, but it's easy to lose track of if you set up the demo store early in the project and never re-pushed it after later changes. Re-push before every submission or resubmission. Don't just assume it's still current.

## Be ready for admin-level access

Shopify's review team may look at the demo store's Shopify admin, not just the storefront, as part of review. That means the admin needs to be in a genuinely presentable, realistic state too: sensible settings, no leftover test or debug data from development, and no half-configured apps.

## Payments: test mode only

Use Bogus Gateway or Shopify Payments' test mode. Never use live payment processing on a demo store. [Store & Design Requirements](/theme-store-requirements/store-and-design/#demo-stores) also mentions this. It's worth repeating here because it's easy to accidentally leave live payments enabled from earlier testing.

## Legal and policy pages, actually filled in

Checkout and footer templates commonly link to a privacy policy, refund policy, shipping policy, and terms of service. If a demo store leaves these as Shopify's default placeholder text, or leaves them out entirely, it undermines the "real store" impression that the whole demo-store requirement is about. Fill them in with realistic, even if generic, policy content before you submit.

## Navigation menus matching your theme's actual defaults

If your theme's `link_list` settings default to `main-menu`/`footer` (see the pre-zip sanity checklist in [Packaging & Submitting](/publishing/packaging-and-submitting/)), check that the demo store's actual menus under those handles have a realistic structure. An empty or single-item main menu makes every template look sparse, no matter how good your section code is.

## Apps: none that fake functionality your theme doesn't have

Only install apps on a demo store if they're incidental to showing off the theme. For example, a review app is fine if your theme genuinely supports a review section. Never install an app to cover up something the theme doesn't actually do on its own. A reviewer is testing the theme's own settings, not an app's, so they need to see the theme's real behavior.

## A pre-submission store checklist

- [ ] Demo store's industry/catalog matches this preset's positioning.
- [ ] Catalog includes: an on-sale product, a sold-out product/variant, a multi-variant product, a gift card product, and at least one long product title.
- [ ] Storefront password set, and identical across every preset's demo store.
- [ ] Demo store is running the exact version being submitted (re-pushed recently, not stale).
- [ ] Admin itself is in a presentable state, no leftover test/debug data.
- [ ] Payments are test-mode only.
- [ ] Privacy policy, refund policy, shipping policy, and terms of service pages are filled in with real content.
- [ ] Main and footer navigation menus are populated realistically, matching the theme's default `link_list` handles.
- [ ] No apps installed that fake functionality the theme doesn't actually provide.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Build demo store content alongside the theme, not as a rushed final step. See the note in [Store & Design Requirements](/theme-store-requirements/store-and-design/) on why this also helps you find real layout bugs earlier. | **Demoing a preset with content that doesn't match its stated industry/catalog size.** |
| Re-push the theme to every demo store right before each submission, instead of assuming an earlier push is still current. | **Showing only the easy-case catalog**: no sale, no sold-out items, no multi-variant products. This leaves no evidence the theme handles real variability. |
| Walk through the pre-submission store checklist above as an actual checklist, not just a quick mental scan. Several of these items are easy to forget precisely because they were "already done" weeks earlier and then quietly drifted out of date, like a live payment method that got turned back on, or a theme version that went stale. | **Using different or missing storefront passwords across your presets' demo stores**, which creates avoidable friction during review. |
| — | **Submitting against a stale demo store** that doesn't reflect the actual version under review. |
| — | **Leaving policy pages as placeholder text**, which undermines the "realistic store" impression the whole requirement is about. |

## Key takeaways
- One demo store per preset, matching its positioning; same storefront password across all of them.
- Show real catalog variety: on-sale, sold-out, multi-variant, gift card, and a long title.
- Keep the demo store's theme version current, and its admin presentable. Reviewers may access both.
- Test-mode payments only; real policy pages; realistic, populated navigation menus.

## Further reading

- [Store & Design Requirements](/theme-store-requirements/store-and-design/) (the content quality bar this checklist supports)
- [Partner Dashboard Setup](/publishing/partner-dashboard-setup/) (the account/access layer beneath this)
- [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
