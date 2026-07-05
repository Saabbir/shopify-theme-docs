---
title: Internationalization & RTL
description: What Shopify actually requires for language and region support, and what's best practice beyond that.
---

:::note[Flagging this clearly]
Shopify's official requirements list doesn't have a single numbered "internationalization" or "RTL" section — the requirements are split across **Features** and **Pages**. RTL (right-to-left) layout support specifically is **not** called out as a hard Theme Store requirement in the current official list. We recommend building it in anyway (see below), but don't take this page as "Shopify will reject you for missing RTL" — that's our best-practice recommendation, not a documented rule. If you're aiming at a market where RTL matters, confirm current policy on [shopify.dev](https://shopify.dev/docs/storefronts/themes/store/requirements) before you rely on this.
:::

## What's actually required

**Locale files.** Store every piece of theme text in `locales/*.json`, not hardcoded in Liquid, so merchants can translate the theme. See [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) for file layout.

**The `lang` attribute.** Your `<html>` tag must declare the page's language, driven by Shopify, not hardcoded:

```html
<html ... lang="{{ request.locale.iso_code }}">
```

**Language selector.** If a merchant sells in multiple languages, customers must be able to switch language on the storefront, following [Shopify's country/language selector UX guidelines](https://shopify.dev/docs/storefronts/themes/markets/country-language-ux).

**Country/currency selector.** Same idea, for merchants selling in multiple currencies — customers need a way to pick their country/region and see local pricing.

**Dynamic URLs.** Always build links with the `routes` object (`{{ routes.root_url }}`), never hardcoded paths like `/`. Hardcoded paths break the moment a store adds a second language, because Shopify prefixes localized URLs.

## RTL — our recommendation, not a documented requirement

Arabic, Hebrew, and other right-to-left languages are common in Shopify Markets. Supporting them well means:

- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical ones (`margin-left`, `padding-right`) so layout flips automatically with `dir="rtl"`.
- Test icons and arrows that imply direction (a "next" chevron) — they usually need to mirror in RTL.
- Don't assume text always grows left-to-right when sizing containers.

```css
/* WRONG — breaks in RTL */
.card { margin-left: 1rem; }

/* RIGHT — flips automatically with dir="rtl" */
.card { margin-inline-start: 1rem; }
```

## Quick Reference

- Required: locale files, dynamic `lang` attribute, language/country selectors (if multi-language/currency), `routes` object for all links.
- Not a documented hard requirement, but our recommendation: RTL support via CSS logical properties.

## Further Reading

- [Selling in multiple languages](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages) — shopify.dev
- [Country/language selector UX](https://shopify.dev/docs/storefronts/themes/markets/country-language-ux) — shopify.dev
- [Locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales) — shopify.dev
