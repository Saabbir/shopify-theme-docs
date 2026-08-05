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

## Product page

| ✅ Must include | ❌ Common gaps |
|---|---|
| Untruncated `product.title` | Titles cut off with `truncate` or fixed-height CSS clipping |
| `variant.price`, `variant.unit_price`, compare-at price | Only the current price shown, no compare-at for sale items |
| `product.description` | Description omitted on a "simplified" alternate layout |
| Option names and values | Options collapsed into an unlabeled dropdown with no visible name |
| All product images viewable | A gallery that hides images beyond the first 3–4 with no way to see the rest |
| Variant images that swap on selection | A static gallery that ignores which variant is selected |
| Quantity selector | Only an "Add to cart" with an implicit quantity of 1 |
| Add to cart button (disabled/replaced when unavailable) | A button that stays clickable and silently fails on sold-out variants |
| First available variant loads by default | The page defaults to the first *listed* variant even if sold out |
| Swatches for product options (`swatch.image`/`swatch.color`) | Plain text option buttons when the product actually has color/pattern swatches configured |
| Product recommendations | Omitted entirely, or only shown on some product types |
| Rich product media (3D, video) | Only static images supported, even when a product has video/3D assets |
| Accelerated checkout buttons, on by default | Present but disabled by default, or missing on some product templates |
| Pickup availability | Omitted, or only shown when a merchant has zero pickup locations (should degrade gracefully, not disappear) |
| Shop Pay Installments banner | Missing on the product template |

```liquid
{% comment %} ❌ WRONG — silently allows checkout attempts on a sold-out variant {% endcomment %}
<button type="submit">Add to cart</button>

{% comment %} ✅ RIGHT — reflects real availability state {% endcomment %}
<button
  type="submit"
  {% unless current_variant.available %}disabled{% endunless %}
>
  {%- if current_variant.available -%}
    {{ 'products.product.add_to_cart' | t }}
  {%- else -%}
    {{ 'products.product.sold_out' | t }}
  {%- endif -%}
</button>
```

## Collection page

| ✅ Must include | ❌ Common gaps |
|---|---|
| Untruncated `collection.title`, description, image | Title truncated by a fixed-width heading with `text-overflow: ellipsis` and no full-text fallback |
| Product grid resilient to varying image aspect ratios | Grid that breaks or misaligns when products mix portrait/landscape/square images |
| Sale badge or `product.compare_at_price_max` shown when relevant | No visual indication a product is discounted |
| Sort control | Products shown in a fixed order with no way to sort |
| Empty-collection message | A blank grid with no explanation when a collection has 0 products |
| Pagination or lazy loading | An unbounded grid that tries to render an entire large catalog at once |
| `product.price_varies` used to show a price range | A single price shown even when variants range widely in price |

## Cart page

| ✅ Must include | ❌ Common gaps |
|---|---|
| Line item details: title, unit price, image, final price, quantity, options | A simplified cart missing unit price or selected option values |
| Visible `cart.total_price` | Total only shown at checkout, not on the cart page itself |
| Checkout button that submits the cart form | A "Continue" button that doesn't actually submit to checkout |
| Quantity editing that refreshes the total immediately | Quantity changes that require a full page reload to reflect in the total |
| Empty-cart message | A blank page with no explanation when the cart has 0 items |
| Cart notes | Omitted entirely |
| Selling plans shown in the cart | Subscription selections silently dropped once added to cart |
| Automatic discount codes reflected | Discounts applied at checkout but invisible in the cart summary |
| Accelerated checkout buttons, on by default | Missing or disabled by default on the cart page |

## Search page

| ✅ Must include | ❌ Common gaps |
|---|---|
| A clear "no results" message | A blank page with no explanation for a query with no matches |
| Distinguishes result types via `object_type` (product/blog/page) | All results rendered identically regardless of type, confusing customers |
| Pagination or lazy loading | An unbounded results list |

## 404 page

| ✅ Must include | ❌ Common gaps |
|---|---|
| A clear "page not found" message | A generic blank error page |
| A way forward: a search bar or a homepage link | A dead end with no navigation options |

## Feature checklist

All of these must work somewhere in the theme:

| Feature | Where it must work |
|---|---|
| Sections on every template (OS 2.0) | Every page-supporting template |
| Discount display | Line items and order totals |
| Accelerated checkout buttons | Product page, cart page |
| Faceted search filtering | Collection page, search page |
| Gift cards, with recipient support | Gift card template |
| Image focal points | Anywhere `image_picker` settings are used |
| Social sharing image (`page_image`) | Any shareable page |
| Country and language selectors | Storefront-wide, if selling multi-region/language |
| Multi-level (nested) menus | Header navigation |
| Newsletter signup | Footer or a dedicated section |
| Pickup availability | Product page |
| Related + complementary product recommendations | Product page |
| Rich product media (3D, video) | Product page, featured product section, quick view if present |
| Search box with predictive search | Header/search template |
| Selling plans / subscriptions | Cart page, customer page |
| Shop Pay Installments banner | Product page |
| Unit pricing | Collection, product, cart, customer pages |
| Variant images | Product page |
| Follow on Shop button (colors unmodified) | Wherever social/follow actions are surfaced |

## Browser support

| Platform | Browsers |
|---|---|
| Desktop | Safari (latest 2), Chrome (latest 3), Firefox (latest 3), Edge (latest 2) |
| Mobile | Mobile Safari (latest 2), Chrome Mobile (latest 3), Samsung Internet (latest 2) |
| Webviews | Instagram, Facebook, Pinterest (latest release, iOS + Android) |

Test in an actual webview, not just the desktop version of the same browser engine. Webviews often behave differently, for example, with `<video>` autoplay rules and viewport sizing.

## Assets

| ✅ Do | ❌ Don't |
|---|---|
| Write or compile stylesheets into `.css`/`.css.liquid` files | Commit `.scss`/`.scss.liquid` files |
| Let Shopify auto-minify your CSS/JS | Commit pre-minified `.css`/`.js` (except ES6+ and approved third-party libraries) |

## SEO

| ✅ Must include | ❌ Don't |
|---|---|
| Theme SEO metadata (title, meta description, canonical URL) | Missing or duplicate canonical URLs across pages |
| Google rich product snippets | No structured data on product pages |
| N/A | A `robots.txt.liquid` template (not allowed at all) |

## Documentation & support

| ✅ Required | ❌ Don't |
|---|---|
| Public theme documentation + contact form, linked from your listing, ready before launch | Launching before documentation/support are in place |
| Reply to merchant support requests within 2 business days | Multi-day or multi-week response times |
| Fix critical bugs immediately | Letting a critical bug sit through your normal release cadence |

## Best practices

- Build the full per-page checklist into your section development process from day one. Adding a missing feature (like unit pricing) across an already-built product/collection/cart/customer flow later is expensive.
- Test every page type with genuinely awkward data early on: a sold-out variant, an empty cart, a zero-result search, a collection with mixed image aspect ratios.
- Treat browser and webview testing as part of your regular QA loop, not a one-time check before submission. It's much cheaper to catch a regression right when it happens.

## Common mistakes

- **Building the "happy path" for each page and skipping the edge-case states** (empty cart, no search results, sold-out variant) until QA finds them later.
- **Testing only in desktop Chrome**, and only finding webview-specific bugs (autoplay, viewport quirks) during review.
- **Treating documentation and support setup as a launch-day task** instead of having it ready ahead of time.

## Quick Reference

- 14 required templates, see the table above.
- Product/collection/cart/search/404 pages each have their own must-have field list, see the tables above for the full ✅/❌ breakdown.
- Browser support spans 4 desktop browsers, 3 mobile browsers, 3 webview apps.
- No Sass, no pre-minified assets.
- 2-business-day support response time (your SLA) once your theme is live.

## Further Reading

- [Full requirements list](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
