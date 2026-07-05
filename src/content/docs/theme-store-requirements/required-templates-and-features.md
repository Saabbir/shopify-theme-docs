---
title: Required Templates & Features
description: Every template, page requirement, feature, browser, and SEO rule Shopify checks.
---

## Required templates

| Template | Format |
|---|---|
| Layout | `theme.liquid` |
| Home | `index.json` |
| Product | `product.json` |
| Collection | `collection.json` |
| Collection list | `list-collections.json` |
| Cart | `cart.json` |
| Search | `search.json` |
| Blog | `blog.json` |
| Article | `article.json` |
| Page | `page.json` |
| Contact page | `page.contact.json` |
| 404 | `404.json` |
| Password | `password.json` |
| Gift card | `gift_card.liquid` (the one template that stays plain Liquid, not JSON) |
| Config | `settings_data.json`, `settings_schema.json` |

Every template except Customer Account, Gift Card, and Checkout must support sections.

## Per-page must-haves

- **Product page**: untruncated title, price, unit price, compare-at price, description, option names/values, all images viewable, variant images swap on selection, quantity selector, Add to cart button, first-available-variant loads by default, swatches for options, plus product recommendations, rich media, accelerated checkout (on by default), pickup availability, and Shop Pay Installments.
- **Collection page**: untruncated title, description, image, product grid that doesn't break with varying image ratios, Sale badge when relevant, sort control, empty-collection message, pagination or lazy loading.
- **Cart page**: line item details (title, unit price, image, final price, quantity, options), visible total, checkout button, quantity editing that refreshes the total, empty-cart message, cart notes, selling plans, automatic discount codes, accelerated checkout (on by default).
- **Search page**: no-results message, distinguishes result types (product/blog/page) via `object_type`, pagination or lazy loading.
- **404 page**: a clear "not found" message plus a way forward (search or a homepage link).

## Feature checklist

All of these must work somewhere in the theme:

- Sections on every template (Online Store 2.0 compatibility)
- Discount display on line items and order totals
- Accelerated checkout buttons (product + cart pages)
- Faceted search filtering (collection + search pages)
- Gift cards, with recipient support
- Image focal points
- Social sharing image (`page_image`)
- Country and language selectors (if selling in multiple regions/languages)
- Multi-level (nested) menus
- Newsletter signup
- Pickup availability (product page)
- Related + complementary product recommendations
- Rich product media (3D models, video)
- Search box with predictive search
- Selling plans / subscriptions (cart + customer pages)
- Shop Pay Installments banner (product page)
- Unit pricing (collection, product, cart, customer pages)
- Variant images
- Follow on Shop button (colors must stay unmodified)

## Browser support

| Platform | Browsers |
|---|---|
| Desktop | Safari (latest 2), Chrome (latest 3), Firefox (latest 3), Edge (latest 2) |
| Mobile | Mobile Safari (latest 2), Chrome Mobile (latest 3), Samsung Internet (latest 2) |
| Webviews | Instagram, Facebook, Pinterest (latest release, iOS + Android) |

## Assets

No Sass, no `.scss` files — native CSS only. No pre-minified `.css`/`.js` (Shopify minifies for you); the exception is ES6+ and approved third-party libraries.

## SEO

Theme SEO metadata snippet (title, meta description, canonical URL), Google rich product snippets, no `robots.txt.liquid`.

## Documentation & support

- Public theme documentation + a public contact form, both linked from your Theme Store listing, ready before launch.
- Reply to merchant support requests within **2 business days**.
- Fix critical bugs immediately, or your theme can be pulled from the Theme Store.

## Quick Reference

- 14 required templates — see the table above.
- Product/collection/cart/search/404 pages each have their own must-have field list.
- Browser support spans 4 desktop browsers, 3 mobile browsers, 3 webview apps.
- No Sass, no pre-minified assets.
- 2-business-day support SLA once your theme is live.

## Further Reading

- [Full requirements list](https://shopify.dev/docs/storefronts/themes/store/requirements) — shopify.dev
