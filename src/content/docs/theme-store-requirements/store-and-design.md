---
title: Store & Design Requirements
description: Exclusivity, uniqueness, design/UX quality, naming, and demo stores.
---

## Exclusivity

Your theme can only be sold through the Shopify Theme Store — not on other marketplaces too. No designer credits, no affiliate links anywhere in the theme files.

| ✅ Do | ❌ Don't |
|---|---|
| Sell Solis exclusively through the Shopify Theme Store | List Solis (or a near-identical variant) on a third-party theme marketplace too |
| Keep all developer/agency branding out of the shipped theme code | Include a "Built by [agency]" credit or link anywhere in the theme, even in a footer or code comment |
| Link to your own support contact form (see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/)) | Include an affiliate or referral link anywhere in theme files or demo store content |

## Uniqueness

This is the one that trips up new Theme Partners most. Shopify explicitly rejects themes that are just a reskin of an existing theme (new colors, new fonts, a few extra sections). Your theme needs **structural** differences a merchant couldn't recreate just by changing settings on another theme — different systems for navigation, product cards, media layout, and page structure.

:::caution
[Shopify's Skeleton Theme](https://github.com/shopify/skeleton-theme) is the only approved starting codebase. Themes built on or derived from Dawn or Horizon are not eligible, no matter how much you customize them.
:::

### What counts as genuine uniqueness vs. a reskin

| ✅ Structural uniqueness (accepted) | ❌ Cosmetic changes (rejected) |
|---|---|
| A different navigation system — e.g. Solis uses a mega-menu with product imagery baked into the schema, not just a text dropdown | Changing an existing theme's color palette and fonts |
| A distinct product card system (custom badge logic, different hover interaction, a different information hierarchy) | Adding a gradient, drop shadow, or rounded corners to an existing card component |
| A different information architecture across templates (e.g. a unique collection filtering layout built from scratch) | Adding a handful of extra sections to an otherwise identical theme |
| Custom block/section architecture that produces layouts a merchant couldn't recreate by tweaking settings on another theme | Reordering existing sections or adjusting spacing/margins |

**A useful test:** could a merchant, using only the theme editor, make an existing Theme Store theme look and behave like yours? If the honest answer is "with enough tweaking, yes," it's not unique enough yet.

## Design & UX

Shopify evaluates five things, all judged subjectively by a human reviewer:

1. **Visual design** — distinctive, professional-quality images and icons, a cohesive color palette.
2. **Layout** — a clear grid, consistent spacing, and a layout that still looks intentional when content is unusually short or long (a title with 200 characters, an empty collection).
3. **Consistency** — one font pairing everywhere, consistent button/link/form styling, settings grouped so merchants can find them without searching.
4. **Shopping experience** — a customer can go home → product → cart → checkout with no confusion.
5. **Demo store** — realistic products, real photography, real copy. No "Lorem Ipsum," no placeholder text.

### Design checklist

| ✅ Recommended | ❌ Avoid |
|---|---|
| One consistent font pairing across the entire theme | Three or more typefaces competing for attention |
| A cohesive color system with clear primary/secondary roles | Colors chosen ad hoc per section with no shared palette |
| Layouts tested with a 200-character product title and with an empty collection | Layouts only ever tested with your curated demo content |
| Buttons, links, and form fields styled identically everywhere they appear | A "primary button" that looks different on the homepage vs. the cart page |
| High-resolution, correctly cropped product photography | Blurry, stretched, or mismatched-aspect-ratio images |

### Layout resilience — the check reviewers actually run

A design that only looks good with your demo store's carefully chosen content is a common rejection reason. Before you consider any section "done," test it against:

- A product title at or near 255 characters
- A collection with zero products
- A collection with only one product
- A product with 20+ variants
- A section with the maximum number of blocks a merchant could add

If any of those breaks the layout, the section isn't finished yet — regardless of how good it looks in your demo store.

## Naming your theme

- 1–2 words, under 30 characters.
- Can't reuse or resemble a Shopify product/event name ("Shopify," "Unite," "Polaris"), a company name, an industry name ("Fashion," "Jewelry"), or an SEO term ("Performance," "Sales").
- Must be a noun, easy to spell, and not already used by another Theme Store listing.

| ✅ Good theme names | ❌ Rejected theme names | Why |
|---|---|---|
| Solis | Fashion Pro | "Fashion" is an industry term, "Pro" implies an SEO/marketing claim |
| Vessel | Shopify Elite | Contains a Shopify product-adjacent term |
| Ritual | SEO Booster Theme | Explicit SEO claim, also 3 words |
| Fabric | Jewelry Store | Industry term, and "Store" is generic/descriptive rather than a name |

## Demo stores

Every preset needs its own demo store, built as a [Client transfer store](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores/create-client-transfer-stores) from your Partner Dashboard, with:

| ✅ Required | ❌ Not allowed |
|---|---|
| Real product photography and real, original copy | "Lorem Ipsum" or onboarding placeholder text anywhere on the storefront |
| Test-mode payments only (Bogus Gateway or Shopify Payments test mode) | Live payment processing enabled on a demo store |
| The unmodified `powered_by_link` | An altered or removed `powered_by_link` |
| Realistic product variety appropriate to the preset's industry/catalog size | Apps used to fake functionality your theme doesn't actually have built in |

## Best practices

- Design and build for content variability from the very first section, not just the final polish pass — see "Layout resilience" above.
- Pick your theme name early and search the current Theme Store listing for collisions before you get attached to it.
- Build your demo store content alongside the theme, not as an afterthought right before submission — realistic content often surfaces layout bugs the demo team wouldn't otherwise catch.
- When in doubt about whether a design choice is "unique enough," compare against 3–4 current Theme Store listings directly, not just your own intuition.

## Common mistakes

- **Confusing visual polish with structural uniqueness.** A beautifully executed reskin of an existing theme's architecture is still a reskin.
- **Designing only against your demo store's hand-picked content.** The most common way a design "looks done" in review and then fails is content variability no one tested.
- **Picking a theme name that collides with an industry or Shopify term without checking first** — this is caught late and forces a rename after a lot of work references the old name.
- **Leaving demo store text as placeholder copy until "later."** It rarely gets prioritized later, and it's an explicit rejection reason.

## Quick Reference

- Structural uniqueness, not a reskin — and only Skeleton Theme or fully original code as your base.
- Design is judged on visual quality, layout, consistency, and shopping-flow clarity.
- Theme names: 1–2 words, under 30 characters, not a Shopify/industry/SEO term.
- Every preset needs a realistic demo store.
- Test every layout against a 200-character title and an empty collection before calling it done.

## Further Reading

- [Theme Store requirements — sections 1–3, 18, 20](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
- [Design best practices](https://shopify.dev/docs/storefronts/themes/best-practices/design) — shopify.dev
