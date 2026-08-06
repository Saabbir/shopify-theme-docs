---
title: Internationalization & Locales
description: Everything about translating a theme and supporting multiple languages and regions, in one place.
---

**TL;DR:** Everything about translating a theme and supporting multiple languages and regions, in one place.

Translation and locale work touches several parts of a theme at once: what's required for the Theme Store, the actual `locales/*.json` files, and how those files connect back to `config/settings_schema.json`. This section gathers all of it together instead of leaving it spread across the requirements list and the deep-dive articles.

## What's on this page group

- [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/): what Shopify actually requires for language and region support, what's best practice beyond that, and how to support right-to-left layouts.
- [Managing Locale Files](/internationalization-and-locales/managing-locale-files/): the two kinds of locale files side by side with real examples, how `settings_schema.json`'s `t:` keys resolve into them, pluralization, variables, and adding a new language end to end.

## How this connects to the rest of the handbook

Locale files aren't isolated from the rest of a theme's config. [settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/) covers what the schema file itself is for; the `t:` resolution mechanics live here instead, since they're really about locale files, not the schema's structure. [Liquid Style Guide](/style-guides/liquid/) and [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/) both use the `t` filter and the `localization` object in passing; this section is where those get their full treatment.

## Best practices

- Treat locale files as part of a section's initial build, not a cleanup pass at the end. Running every string through `t:`/`| t` from the start is far cheaper than finding and replacing dozens of hardcoded strings later.
- Keep `en.default.schema.json` in sync with `settings_schema.json` as you add or rename settings. A `t:` key with nothing on the other end renders as raw text in the theme editor, silently.
- Remember the storefront and the theme editor are translated independently: `<lang>.json` follows the shopper's storefront locale, `<lang>.schema.json` follows the merchant's Shopify admin language.

## Common mistakes

- **Hardcoding strings "to get something working," then leaving them for later.** They pile up, and a late translation pass is far more error-prone than translating as you go.
- **Assuming one locale file pair covers both the storefront and the theme editor.** They're separate files, translated separately, and read by two different audiences.
- **Adding a `t:` key without its counterpart in `en.default.schema.json`.** Nothing errors. The theme editor just shows the raw key text instead of a real label.

## Key Takeaways
- [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/) · [Managing Locale Files](/internationalization-and-locales/managing-locale-files/)
- Storefront strings live in `<lang>.json`. Theme editor labels live in `<lang>.schema.json`. Different files, different audiences, different language settings.
- `settings_schema.json`'s `t:` keys are dot-path lookups into `<lang>.schema.json`, same mechanics as the `t` filter, different file.

## Further Reading

- [Locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales) (shopify.dev)
- [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev), current policy on RTL and i18n
