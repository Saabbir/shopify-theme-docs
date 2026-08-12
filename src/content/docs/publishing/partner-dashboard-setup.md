---
title: Partner Dashboard Setup
description: The accounts and access you need before you can submit anything.
---

**TL;DR:** The accounts and access you need before you can submit anything.

The Partner Dashboard is a website where you manage everything related to your theme business: your stores, your submissions, and your account settings. Think of it as your control room. Before you can submit a theme, you need a few things set up inside it.

:::note[Flagging this clearly]
Shopify changes the Partner Dashboard sign-up flow and screens fairly often. The account types and general steps below are correct as of when this was written, but check the exact current steps at [partners.shopify.com](https://www.shopify.com/partners) before you rely on this page for a real submission.
:::

## Accounts you need

- **Shopify Partner account**: this is free. Sign up at [partners.shopify.com](https://www.shopify.com/partners). You'll use this account to manage theme submissions, development stores, and client stores.
- **A development store**: this is your working sandbox, a store you can build and test in without any risk to a real merchant. Create it from the Partner Dashboard. You'll use it throughout [Getting Started](/getting-started/) and [Scaffold Setup](/scaffold-setup/).
- **A Client transfer store**: you need this specifically for your demo store (see [Store & Design Requirements](/theme-store-requirements/store-and-design/)). Development stores with developer previews turned on can't be transferred, so decide ahead of time which store type you'll use for which purpose.

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

Shopify's review team emails whatever address is in your theme's **Theme submission contact email** field. Note that this isn't necessarily the same as your account email. Add `themes@shopify.com` and `noreply@shopify.com` to your allowed senders list. Otherwise, a rejection notice or a request for changes could land in spam and quietly stall your submission.

### A concrete scenario this actually prevents

Here's a common, avoidable delay: a theme sits in "changes requested" status for two extra weeks because the notification email landed in a spam folder nobody checked. Meanwhile, the team just assumes review is running slow. Whitelisting Shopify's sender addresses, and checking the Partner Dashboard status directly instead of just waiting for an email, avoids this problem entirely.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Set up two-factor authentication (2FA) on your Partner account right away. This account has billing and submission access, so if someone else gets into it, that's a serious problem. | **Discovering account verification takes longer than expected** because setup was left until submission week. |
| Confirm which team member's email is the submission contact before you submit, not after. Make sure that person actually checks their email regularly during the review window. | **Turning on developer previews on the store meant to become your demo store**, then finding out it can't be transferred like you need it to be. |
| Check the Partner Dashboard status directly on a regular basis during review, instead of relying only on email notifications showing up on time. | **Missing a rejection or changes-requested email** because Shopify's sender addresses weren't whitelisted, and assuming review is just slow instead of checking the dashboard directly. |

## Key takeaways
- Partner account (free) + a dev store + a Client transfer store for your demo.
- Submission contact email is set per theme, separate from your login email. Whitelist Shopify's sender addresses.
- Check Partner Dashboard status directly during review, don't rely on email alone.

## Further reading

- [Shopify Partners](https://www.shopify.com/partners) (shopify.com)
- [Development stores](https://shopify.dev/docs/storefronts/themes/tools/development-stores) (shopify.dev)
