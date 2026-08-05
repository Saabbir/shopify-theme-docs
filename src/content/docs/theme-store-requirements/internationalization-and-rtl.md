---
title: Internationalization & RTL
description: What Shopify actually requires for language and region support, and what's best practice beyond that.
---

:::note[Flagging this clearly]
Shopify's official requirements list doesn't have one numbered "internationalization" or "RTL" section. These rules are split across the **Features** and **Pages** sections instead. RTL (right-to-left) layout support, used for languages like Arabic and Hebrew, is **not** listed as a hard Theme Store requirement right now. We recommend building it in anyway (see below), but don't read this page as "Shopify will reject you for missing RTL," that's our own best-practice advice, not a documented rule. If you're targeting a market where RTL matters, check the current policy on [shopify.dev](https://shopify.dev/docs/storefronts/themes/store/requirements) before you rely on this.
:::

## What's actually required

| Requirement | ✅ Do | ❌ Don't |
|---|---|---|
| Locale files | Store every piece of theme text in `locales/*.json` | Hardcode English strings directly in Liquid or schema |
| The `lang` attribute | Drive it dynamically from Shopify | Hardcode `lang="en"` regardless of the storefront's actual locale |
| Language selector | Provide one if selling in multiple languages, following Shopify's UX guidelines | Silently support multiple languages with no way for a customer to switch |
| Country/currency selector | Provide one if selling in multiple regions/currencies | Assume every customer sees the same currency |
| Dynamic URLs | Use the `routes` object everywhere | Hardcode paths like `href="/"` or `href="/products/"` |

### The `lang` attribute

```html
<!-- ❌ WRONG: hardcoded, breaks the moment a second language is added -->
<html lang="en">

<!-- ✅ RIGHT: driven by Shopify, correct for every locale automatically -->
<html lang="{{ request.locale.iso_code }}">
```

### Dynamic links

```liquid
{% comment %} ❌ WRONG — breaks once a store adds a second language, since Shopify prefixes localized URLs {% endcomment %}
<a href="/">Home</a>
<a href="/collections/all">Shop all</a>

{% comment %} ✅ RIGHT — always resolves to the correct localized path {% endcomment %}
<a href="{{ routes.root_url }}">Home</a>
<a href="{{ routes.all_products_collection_url }}">Shop all</a>
```

### Locale files

```json
// locales/en.default.json (excerpt)
{
  "products": {
    "price": {
      "sale": "Sale",
      "regular_price": "Regular price",
      "sold_out": "Sold out"
    }
  }
}
```

```liquid
{% comment %} ❌ WRONG — hardcoded, can't be translated {% endcomment %}
<span class="badge">Sold out</span>

{% comment %} ✅ RIGHT — translatable {% endcomment %}
<span class="badge">{{ 'products.price.sold_out' | t }}</span>
```

## RTL — our recommendation, not a documented requirement

RTL stands for "right-to-left." Arabic, Hebrew, and other right-to-left languages read from right to left instead of left to right, the way a mirror flips a page. These languages are common among stores using Shopify Markets (Shopify's tool for selling in multiple countries). Supporting them well means:

| ✅ Do | ❌ Avoid |
|---|---|
| Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`) | Physical properties (`margin-left`, `padding-right`, `left`) that don't flip with `dir="rtl"` |
| Use `text-align: start` / `end` | `text-align: left` / `right` hardcoded |
| Mirror directional icons (arrows, chevrons) in RTL | Assume a "next" arrow always points visually right |
| Test with a genuinely long RTL string, not just a mirrored layout screenshot | Assume RTL support is "done" once the layout visually flips |

```css
/* ❌ WRONG — breaks in RTL: this margin stays on the physical left
   even when the page direction flips */
.card {
  margin-left: 1rem;
  text-align: left;
}

/* ✅ RIGHT — flips automatically with dir="rtl" */
.card {
  margin-inline-start: 1rem;
  text-align: start;
}
```

```html
<!-- ❌ WRONG: an arrow icon that always points right, even in RTL where
     "next" visually should point left -->
<button class="next-btn">
  <svg><!-- right-pointing arrow --></svg>
</button>

<!-- ✅ RIGHT: mirror direction-dependent icons using a CSS rule keyed to [dir] -->
<button class="next-btn">
  <svg class="icon-chevron"><!-- right-pointing arrow --></svg>
</button>
```

```css
[dir="rtl"] .icon-chevron {
  transform: scaleX(-1);
}
```

## Best practices

- Run every piece of text through `t:`/`| t` (Shopify's translation filter) from the start of a section's development. Don't leave it for a cleanup pass, fixing dozens of hardcoded strings later is tedious and easy to get wrong.
- Use CSS logical properties by default in new code, even before RTL is a concrete requirement. They cost nothing in left-to-right layouts and make RTL support almost free later.
- Test at least one real RTL locale, not just a mirrored screenshot, before you consider internationalization "done" for a section.

## Common mistakes

- **Hardcoding `lang="en"` early "to get something working," then forgetting to make it dynamic before shipping.**
- **Using physical CSS properties (`margin-left`) everywhere, then discovering you need a whole separate RTL stylesheet** instead of one that just works automatically.
- **Forgetting to mirror directional icons.** A "next" chevron pointing the wrong way in RTL is a subtle but very visible bug.
- **Hardcoding internal links with `/` prefixes.** These quietly break the moment a store adds a second language, because Shopify starts prefixing localized URLs.

## Quick Reference

- Required: locale files, dynamic `lang` attribute, language/country selectors (if multi-language/currency), `routes` object for all links.
- Not a documented hard requirement, but our recommendation: RTL support via CSS logical properties (`margin-inline-start`, `text-align: start`) and mirrored directional icons.

## Further Reading

- [Selling in multiple languages](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages) (shopify.dev)
- [Country/language selector UX](https://shopify.dev/docs/storefronts/themes/markets/country-language-ux) (shopify.dev)
- [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev), current policy on RTL and i18n
- [Locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales) (shopify.dev)
