---
title: "Learning Article: Managing Locale Files"
description: How to structure translations for multiple languages and countries without them rotting as the theme grows.
---

Internationalization requirements (see [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/)) mandate that every string be translatable. This article is about the practical, ongoing discipline of keeping `locales/` files correct and complete as a theme grows past its first language.

## Step 1: the two kinds of locale files

```
locales/
  en.default.json          ← storefront strings, default language
  en.default.schema.json   ← theme editor labels, default language
  fr.json                  ← storefront strings, French
  fr.schema.json           ← theme editor labels, French
```

| File | Read by | Contains |
|---|---|---|
| `<lang>.json` | The storefront, via `{{ 'key' \| t }}` | Customer-facing strings — "Add to cart," "Sold out," error messages |
| `<lang>.schema.json` | The theme editor only | Setting labels, section names, block names — merchant-facing, not customer-facing |

**Exactly one** language file pair is marked `.default.` — this is the fallback used when a key is missing from another language's file, so it must always be complete.

## Step 2: structuring keys so they scale

Flat, ever-growing top-level keys become unmanageable past a few dozen strings. Namespace by feature/section instead:

```json
{
  "general": {
    "search": {
      "placeholder": "Search",
      "no_results": "No results found for \"{{ terms }}\""
    }
  },
  "products": {
    "add_to_cart": "Add to cart",
    "sold_out": "Sold out",
    "price": {
      "from": "From {{ price }}"
    }
  },
  "cart": {
    "empty": "Your cart is empty",
    "item_count": {
      "one": "{{ count }} item",
      "other": "{{ count }} items"
    }
  }
}
```

```liquid
{{ 'products.add_to_cart' | t }}
{{ 'cart.item_count' | t: count: cart.item_count }}
```

Namespacing by feature (not by page or by component) means a translator working on "cart" strings can find everything cart-related in one place, and a developer adding a new cart feature knows exactly where its new key belongs.

## Step 3: pluralization — never string-concatenate a count

```liquid
{% comment %} ❌ WRONG — grammatically wrong in many languages,
   and even in English becomes "1 items" {% endcomment %}
{{ cart.item_count }} {{ 'cart.items_label' | t }}

{% comment %} ✅ RIGHT — the t filter picks the right plural form
   based on count, correctly, per-language pluralization rules {% endcomment %}
{{ 'cart.item_count' | t: count: cart.item_count }}
```

```json
"item_count": {
  "one": "{{ count }} item",
  "other": "{{ count }} items"
}
```

Some languages have more than two plural forms (Arabic has six) — Shopify's translation system handles this per-language automatically as long as you use the `one`/`other` (and any additional applicable) keys rather than a single hardcoded string with a count spliced in.

## Step 4: variables in translated strings — never assemble a sentence from parts

```liquid
{% comment %} ❌ WRONG — assumes English word order; breaks in
   any language where the sentence structure differs {% endcomment %}
{{ 'general.showing' | t }} {{ count }} {{ 'general.of' | t }} {{ total }}

{% comment %} ✅ RIGHT — the whole sentence is one translatable unit,
   with variables interpolated into it by the translator's own
   word order for their language {% endcomment %}
{{ 'general.showing_results' | t: count: count, total: total }}
```

```json
"showing_results": "Showing {{ count }} of {{ total }}"
```

A French translator can reorder `{{ count }}` and `{{ total }}` within their translation if French phrasing requires it — but only if the whole sentence was one key to begin with, not several keys concatenated by the Liquid template in a fixed order.

## Step 5: adding a new language, end to end

1. Copy `en.default.json` and `en.default.schema.json` to `<new-lang>.json` and `<new-lang>.schema.json`.
2. Translate every value (never keys — keys stay in English, they're identifiers, not content).
3. Check for any string that assumes English grammar (a concatenated sentence, a missing plural form) — this is the moment to fix Step 3/4-style mistakes, since they're much cheaper to fix before a translator has translated the broken structure too.
4. Run the theme with `?locale=<new-lang>` (or however your setup previews a locale) and manually check for: untranslated strings falling back to English unexpectedly (usually a missing key), text overflow (some languages run 30%+ longer than English for the same meaning), and RTL layout if applicable (see [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/)).
5. Check `<new-lang>.schema.json` separately, in the theme editor — this is easy to forget since it's invisible on the actual storefront.

## Step 6: countries vs. languages — they're not the same axis

A theme can support one language across many countries (different currency, different shipping messaging) or many languages within one country. Shopify's `localization` object separates these two concerns:

```liquid
{{ localization.language.iso_code }}   {# e.g. "en", "fr" #}
{{ localization.country.iso_code }}    {# e.g. "US", "CA" #}
```

Don't assume a country implies a language, or vice versa — a Canadian storefront may need both English and French, and a single-language storefront may still need country-specific price/shipping formatting. Design locale-dependent logic (e.g. showing a shipping estimate) against `localization.country`, and text translation against `localization.language` — they're independent settings a merchant configures separately.

## Best practices

- Namespace locale keys by feature, not by page — makes translators' and developers' lives easier as the file grows.
- Never concatenate translated fragments into a sentence — always interpolate variables into one complete, translatable string.
- Always use `one`/`other` pluralization keys, never a hardcoded count spliced into a fixed string.
- Test a new language by actually previewing it, not just confirming the JSON is valid — text overflow and RTL layout issues only surface visually.
- Keep `.schema.json` translation up to date even though it's editor-only — merchants configuring the theme in a non-English language see it directly.

## Common mistakes

- **Concatenating strings around a variable** ("Showing" + count + "of" + total) instead of one interpolated sentence — breaks translatability for any language with different word order.
- **Hardcoding a count into a string** instead of using `one`/`other` plural keys, producing "1 items" and worse in other languages.
- **Forgetting `.schema.json` when adding a language** — the storefront is translated but the theme editor still shows English labels to a non-English-speaking merchant.
- **Assuming a flat, ungrouped locale file will stay manageable** — namespacing early is much cheaper than reorganizing a 500-key flat file later.

## Quick Reference

- Two file types: `<lang>.json` (storefront) and `<lang>.schema.json` (theme editor) — both need translating.
- Namespace keys by feature (`cart.item_count`, not a flat `item_count_label`).
- Never concatenate translated fragments — one full sentence per key, with interpolated variables.
- Always use `one`/`other` (etc.) pluralization keys.
- Language and country are independent settings — don't assume one implies the other.

## Further Reading

- [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/) — the Theme Store requirement this supports
- [Translate theme content](https://shopify.dev/docs/storefronts/themes/architecture/locales) — shopify.dev
