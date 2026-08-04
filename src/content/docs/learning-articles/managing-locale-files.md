---
title: "Learning Article: Managing Locale Files"
description: How to keep translation files organized and complete as your theme grows to support more languages.
---

Shopify has a rule about translation. Every piece of text in your theme must be translatable into another language. This rule is called internationalization (see [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/)). Internationalization is just a fancy word for making sure your theme works well in different languages and countries.

This article covers the everyday work of keeping your `locales/` files correct and complete. A locale file is a file that holds all the translated text for one language. As your theme grows past its first language, you need a clear system for managing these files, and that's what this article walks you through.

## Step 1: the two kinds of locale files

A locale file is a file that holds all the translated text for one language. Your theme actually uses two different kinds of locale files, and it helps to know the difference right from the start.

```
locales/
  en.default.json          ← storefront strings, default language
  en.default.schema.json   ← theme editor labels, default language
  fr.json                  ← storefront strings, French
  fr.schema.json           ← theme editor labels, French
```

| File | Read by | Contains | Key structure |
|---|---|---|---|
| `<lang>.json` | The storefront, via `{{ 'key' \| t }}` | Customer-facing strings, like "Add to cart," "Sold out," and error messages | Grouped by feature (see Step 2 below) |
| `<lang>.schema.json` | The theme editor only | Setting labels, section names, and block names. Merchants see these, but shoppers never do. | Flat and shared across the whole theme, organized by purpose rather than by feature. This is a different setup from Step 2, and we'll get to why later in this article. |

Exactly **one** language file pair should be marked `.default.`. Shopify falls back to this default file whenever a key is missing from another language's file. That's why the default file always needs to stay complete: it's the safety net for every other language.

## Step 2: structuring keys so they scale

A "key" is just the name you use to look up a piece of translated text, like `products.add_to_cart`. Think of it like a label on a storage box: the key tells you what's inside without you having to open every box and check.

If you keep all your keys in one flat list, that list gets hard to manage once you pass a few dozen strings. It's like keeping every file on your computer in a single folder instead of using subfolders. A better approach is to group your keys by feature or section, the same way you'd organize files into folders:

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

Grouping by feature, instead of by page or component, means a translator working on cart text can find everything cart-related in one place. It also means a developer adding a new cart feature knows exactly where the new key belongs, instead of hunting through a long, unorganized list.

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

Pluralization just means changing a word based on a count, like "1 item" versus "2 items." In English this only has two forms, but that's not true everywhere. Arabic, for example, has six different plural forms depending on the number. Shopify's translation system handles all of this automatically for each language, as long as you use the `one`/`other` keys (and any other plural keys a language needs) instead of hardcoding a count into a single fixed string.

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

A French translator can reorder `{{ count }}` and `{{ total }}` in their translation if that's what French phrasing needs. But that's only possible if the whole sentence was one key to begin with. If you build the sentence by stitching together several separate keys in a fixed order, a translator can never fix the word order, no matter how good their translation is.

## Step 5: adding a new language, end to end

1. Copy `en.default.json` and `en.default.schema.json` to `<new-lang>.json` and `<new-lang>.schema.json`.
2. Translate every value, but never translate the keys. Keys stay in English because they're identifiers, meaning internal names the code uses to find text, not content shoppers actually see.
3. Check for any string that assumes English grammar, like a concatenated sentence or a missing plural form. This is the moment to fix the kind of mistakes covered in Step 3 and Step 4. They're much cheaper to fix now than after a translator has already translated the broken structure.
4. Run the theme with `?locale=<new-lang>` (or however your setup previews a locale) and check it by hand for three things. First, look for untranslated strings that unexpectedly fall back to English, which usually means a missing key. Second, look for text that overflows its container, since some languages run 30% or more longer than English for the same meaning. Third, check for RTL layout issues if the language needs them (see [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/)).
5. Check `<new-lang>.schema.json` separately, inside the theme editor. It's easy to forget this step, since this file never shows up on the actual storefront.

## Step 6: countries vs. languages — they're not the same axis

A theme can support one language across many countries, each with its own currency and shipping messaging. Or it can support many languages within a single country. These are two separate things, and Shopify's `localization` object keeps them separate too:

```liquid
{{ localization.language.iso_code }}   {# e.g. "en", "fr" #}
{{ localization.country.iso_code }}    {# e.g. "US", "CA" #}
```

Don't assume a country implies a language, or the other way around. A Canadian storefront might need both English and French. A single-language storefront might still need country-specific price and shipping formatting. Base anything locale-dependent, like showing a shipping estimate, on `localization.country`. Base text translation on `localization.language`. A merchant configures these two settings independently, so your theme's logic should treat them independently too.

## Best practices

- Group locale keys by feature, not by page. It makes life easier for both translators and developers as the file grows.
- Never concatenate translated fragments into a sentence. Always interpolate variables into one complete, translatable string.
- Always use `one`/`other` pluralization keys, never a hardcoded count spliced into a fixed string.
- Test a new language by actually previewing it, not just by checking that the JSON is valid. You can only spot text overflow and RTL layout issues by looking at the page.
- Keep `.schema.json` translation up to date even though it's editor-only. Merchants configuring the theme in a non-English language see it directly.

## Common mistakes

- **Concatenating strings around a variable** ("Showing" + count + "of" + total) instead of using one interpolated sentence. This breaks translatability for any language with a different word order.
- **Hardcoding a count into a string** instead of using `one`/`other` plural keys, which produces "1 items" and worse problems in other languages.
- **Forgetting `.schema.json` when adding a language.** The storefront gets translated, but the theme editor still shows English labels to a non-English-speaking merchant.
- **Assuming a flat, ungrouped locale file will stay manageable.** Grouping keys early is much cheaper than reorganizing a 500-key flat file later.

## Quick Reference

- Two file types: `<lang>.json` (storefront) and `<lang>.schema.json` (theme editor). Both need translating.
- Group keys by feature (`cart.item_count`, not a flat `item_count_label`).
- Never concatenate translated fragments. Use one full sentence per key, with interpolated variables.
- Always use `one`/`other` (and any other needed) pluralization keys.
- Language and country are independent settings. Don't assume one implies the other.

## Further Reading

- [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/): the Theme Store requirement this supports
- [Translate theme content](https://shopify.dev/docs/storefronts/themes/architecture/locales): shopify.dev
