---
title: Partner Dashboard Setup
description: The accounts and access you need before you can submit anything.
---

:::note[Flagging this clearly]
Partner Dashboard's sign-up flow and screens change fairly often. The account types and general flow below are accurate as of this writing, but confirm the exact current steps at [partners.shopify.com](https://www.shopify.com/partners) before you rely on this page for a real submission.
:::

## Accounts you need

- **Shopify Partner account** — free, sign up at [partners.shopify.com](https://www.shopify.com/partners). This is where you manage theme submissions, development stores, and client stores.
- **A development store** — your working sandbox, created from the Partner Dashboard, used throughout [Getting Started](/getting-started/) and [Scaffold Setup](/scaffold-setup/).
- **A Client transfer store** — required specifically for your demo store (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)). Development stores with developer previews enabled can't be transferred, so plan which store type you're using for which purpose ahead of time.

| ✅ Do | ❌ Don't |
|---|---|
| Set up your Partner account and stores early in the project | Wait until the week you plan to submit to discover setup steps |
| Use a development store for building/testing throughout the project | Try to build the demo store and the dev environment as the same store |
| Create the Client transfer store specifically for your demo store content | Enable developer previews on the store you intend to use as your demo (this blocks transfer) |

## Where things live once you have an account

| Task | Where |
|---|---|
| Create dev/client stores | Partner Dashboard → Stores |
| Submit a theme for review | Partner Dashboard → Themes → Submit a theme |
| Edit a theme's Theme Store listing | Partner Dashboard → Themes → (your theme) → Edit listing |
| Track review status | Partner Dashboard → Themes |

## Email matters more than you'd think

Shopify's review team contacts you at whatever email is on your theme's **Theme submission contact email** field — not necessarily your account email. Add `themes@shopify.com` and `noreply@shopify.com` to your allowed senders list, or a rejection notice or request for changes can land in spam and quietly stall your submission.

### A concrete scenario this actually prevents

A common, entirely avoidable delay: a theme sits in "changes requested" status for two extra weeks because the notification email landed in a spam folder nobody checked, and the team assumed review was simply slow. Whitelisting Shopify's sender addresses and checking the Partner Dashboard status directly (not just waiting for an email) avoids this specific failure mode.

## Best practices

- Set up 2FA on the Partner account immediately — it has billing and submission access, and account compromise here is a genuinely serious problem.
- Confirm which team member's email is the submission contact *before* submitting, not after — and make sure that person actually checks it regularly during the review window.
- Check the Partner Dashboard status directly on a regular cadence during review, rather than relying solely on email notifications arriving promptly.

## Common mistakes

- **Discovering account verification takes longer than expected** because setup was left until submission week.
- **Enabling developer previews on the store meant to become your demo store**, then discovering it can't be transferred as required.
- **Missing a rejection or changes-requested email** because Shopify's sender addresses weren't whitelisted, and assuming review is simply slow instead of checking the dashboard directly.

## Quick Reference

- Partner account (free) + a dev store + a Client transfer store for your demo.
- Submission contact email is set per-theme, separate from your login email — whitelist Shopify's sender addresses.
- Check Partner Dashboard status directly during review, don't rely on email alone.

## Further Reading

- [Shopify Partners](https://www.shopify.com/partners) — shopify.com
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) — shopify.dev
