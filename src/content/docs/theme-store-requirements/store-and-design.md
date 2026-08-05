---
title: Store & Design Requirements
description: Exclusivity, uniqueness, design/UX quality, naming, and demo stores.
---

## Exclusivity

You can only sell your theme through the Shopify Theme Store. You can't list it, or a near-identical version of it, on any other marketplace. Don't add designer credits or affiliate links anywhere in the theme files either.

| ✅ Do | ❌ Don't |
|---|---|
| Sell Solis exclusively through the Shopify Theme Store | List Solis (or a near-identical variant) on a third-party theme marketplace too |
| Keep all developer/agency branding out of the shipped theme code | Include a "Built by [agency]" credit or link anywhere in the theme, even in a footer or code comment |
| Link to your own support contact form (see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/)) | Include an affiliate or referral link anywhere in theme files or demo store content |

## Uniqueness

This is the rule that trips up new Theme Partners more than any other. Shopify rejects themes that are just a reskin of an existing theme. A reskin means you took an existing theme and swapped in new colors, new fonts, and a few extra sections, without changing how it actually works underneath.

Your theme needs **structural** differences instead: changes a merchant couldn't recreate just by adjusting settings on another theme. That means building different systems for navigation, product cards, media layout, and page structure, not just giving it a different look.

:::caution
[Shopify's Skeleton Theme](https://github.com/shopify/skeleton-theme) is the only starting codebase Shopify approves. If your theme is built on or copied from Dawn or Horizon (two of Shopify's other themes), it won't be accepted, no matter how much you customize it.
:::

### What counts as genuine uniqueness vs. a reskin

| ✅ Structural uniqueness (accepted) | ❌ Cosmetic changes (rejected) |
|---|---|
| A different navigation system (for example, Solis uses a mega-menu with product images built into the schema, not just a text dropdown) | Changing an existing theme's color palette and fonts |
| A distinct product card system (custom badge logic, a different hover interaction, a different order of information) | Adding a gradient, drop shadow, or rounded corners to an existing card component |
| A different information architecture across templates (e.g. a unique collection filtering layout built from scratch) | Adding a handful of extra sections to an otherwise identical theme |
| Custom block or section structures that produce layouts a merchant couldn't recreate by tweaking settings on another theme | Reordering existing sections or adjusting spacing and margins |

**A useful test:** could a merchant, using only the theme editor, make an existing Theme Store theme look and behave like yours? If your honest answer is "with enough tweaking, yes," it's not unique enough yet.

## Design & UX

A human reviewer judges five things here, and yes, it's subjective. There's no automatic test for good design, so try to look at your theme the way a reviewer would.

1. **Visual design**: distinctive, professional-quality images and icons, and a color palette that holds together.
2. **Layout**: a clear grid, consistent spacing, and a layout that still looks intentional when content is unusually short or long, like a 200-character title or an empty collection.
3. **Consistency**: one font pairing used everywhere, consistent button, link, and form styling, and settings grouped so merchants can find them without searching.
4. **Shopping experience**: a customer can go from the home page to a product page to the cart to checkout with no confusion.
5. **Demo store**: realistic products, real photography, and real writing. No "Lorem Ipsum" (placeholder filler text) anywhere.

### Design checklist

| ✅ Recommended | ❌ Avoid |
|---|---|
| One consistent font pairing across the entire theme | Three or more typefaces competing for attention |
| A color system that works well together, with clear primary and secondary roles | Colors chosen section by section, with no shared palette |
| Layouts tested with a 200-character product title and with an empty collection | Layouts only ever tested with your own curated demo content |
| Buttons, links, and form fields styled identically everywhere they appear | A "primary button" that looks different on the homepage than on the cart page |
| High-resolution, correctly cropped product photography | Blurry, stretched, or mismatched-aspect-ratio images |

### Layout resilience — the check reviewers actually run

A design that only looks good with your demo store's hand-picked content is a common reason themes get rejected. Before you call any section "done," test it against:

- A product title at or near 255 characters
- A collection with zero products
- A collection with only one product
- A product with 20 or more variants
- A section with the maximum number of blocks a merchant could add

If any of these breaks the layout, the section isn't finished yet, no matter how good it looks in your demo store.

## Naming your theme

- Keep it to 1 or 2 words, under 30 characters.
- Don't reuse or resemble a Shopify product or event name ("Shopify," "Unite," "Polaris"), a company name, an industry name ("Fashion," "Jewelry"), or an SEO term ("Performance," "Sales"). Shopify doesn't want theme names that read like a marketing claim.
- It must be a noun, easy to spell, and not already used by another Theme Store listing.

| ✅ Good theme names | ❌ Rejected theme names | Why |
|---|---|---|
| Solis | Fashion Pro | "Fashion" is an industry term, "Pro" implies an SEO/marketing claim |
| Vessel | Shopify Elite | Contains a Shopify product-adjacent term |
| Ritual | SEO Booster Theme | Explicit SEO claim, and also 3 words |
| Fabric | Jewelry Store | Industry term, and "Store" is generic rather than a name |

## Demo stores

Every preset needs its own demo store. Build it as a [Client transfer store](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores/create-client-transfer-stores) from your Partner Dashboard, with:

| ✅ Required | ❌ Not allowed |
|---|---|
| Real product photography and real, original copy | "Lorem Ipsum" or onboarding placeholder text anywhere on the storefront |
| Test-mode payments only (Bogus Gateway or Shopify Payments test mode) | Live payment processing enabled on a demo store |
| The unmodified `powered_by_link` | An altered or removed `powered_by_link` |
| Realistic product variety appropriate to the preset's industry/catalog size | Apps used to fake functionality your theme doesn't actually have built in |

## Best practices

- Design and build for changing content from the very first section, not just in a final polish pass. See "Layout resilience" above.
- Pick your theme name early, and search the current Theme Store listing for name collisions before you get attached to it.
- Build your demo store content alongside the theme, not as an afterthought right before submission. Realistic content often reveals layout bugs you wouldn't otherwise catch.
- When you're unsure whether a design choice is unique enough, compare it against 3 or 4 current Theme Store listings directly, instead of just trusting your gut feeling.

## Common mistakes

- **Confusing visual polish with structural uniqueness.** A beautifully executed reskin of an existing theme is still a reskin.
- **Designing only against your demo store's hand-picked content.** The most common way a design "looks done" in review and then fails later is content no one tested, like a long title or an empty collection.
- **Picking a theme name that collides with an industry or Shopify term without checking first.** This usually gets caught late, forcing a rename after a lot of work already references the old name.
- **Leaving demo store text as placeholder copy "for later."** It rarely gets fixed later, and it's an explicit reason themes get rejected.

## Quick Reference

- Aim for structural uniqueness, not a reskin, and use Skeleton Theme or fully original code as your base.
- Design is judged on visual quality, layout, consistency, and shopping-flow clarity.
- Theme names: 1 or 2 words, under 30 characters, not a Shopify, industry, or SEO term.
- Every preset needs a realistic demo store.
- Test every layout against a 200-character title and an empty collection before calling it done.

## Further Reading

- [Theme Store requirements, sections 1-3, 18, 20](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
- [Design best practices](https://shopify.dev/docs/storefronts/themes/best-practices/design) (shopify.dev)
- [Skeleton Theme](https://github.com/shopify/skeleton-theme) (GitHub), the only Shopify-approved starting codebase
- [Client transfer stores](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores/create-client-transfer-stores) (help.shopify.com), how to build a preset demo store
