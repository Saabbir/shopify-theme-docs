---
title: Managing Locale Files
description: How to keep translation files organized and complete as your theme grows to support more languages.
---

**TL;DR:** How to keep translation files organized and complete as your theme grows to support more languages.

Shopify has a rule about translation. Every piece of text in your theme must be translatable into another language. This rule is called internationalization (see [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/)).

This article covers the everyday work of keeping your `locales/` files correct and complete. As your theme grows past its first language, you need a clear system for managing these files, and that's what this article walks you through.

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
| `<lang>.json` | The storefront, via `{{ 'key' \| t }}` | Customer-facing strings, like "Add to cart," "Sold out," and error messages | Grouped by feature (see Step 4 below) |
| `<lang>.schema.json` | The theme editor only | Setting labels, section names, and block names. Merchants see these, but shoppers never do. | Flat and shared across the whole theme, organized by purpose rather than by feature. Step 3 shows exactly how `settings_schema.json` looks these up. |

Exactly **one** language file pair should be marked `.default.`. Shopify falls back to this default file whenever a key is missing from another language's file. That's why the default file always needs to stay complete: it's the safety net for every other language.

### Naming the file itself

File names follow the IETF language tag format: a lowercase language code, plus an uppercase region code if you need one. Skip the region code for a language that isn't region-specific:

| Language | Storefront | Schema |
|---|---|---|
| English — Great Britain | `en-GB.json` | `en-GB.schema.json` |
| Spanish — Spain | `es-ES.json` | `es-ES.schema.json` |
| French — Canada | `fr-CA.json` | `fr-CA.schema.json` |
| Finnish — all regions | `fi.json` | `fi.schema.json` |
| Bengali — all regions | `bn.json` | `bn.schema.json` |

### Hard limits

Shopify caps both file types the same way: a maximum of **3,400 translation keys** in a single locale file, and **1,000 characters** per translated value. Both are enforced by Shopify, not by Theme Check, so a file that exceeds either limit fails at push/deploy time rather than at lint time.

## Step 2: all four files, side by side, with matching real content

The table in Step 1 tells you what each file is for. Seeing the same two pieces of content (a storefront string and a theme editor label) actually translated across all four files makes the split concrete:

```json title="locales/en.default.json — storefront, English"
{
  "products": {
    "sold_out": "Sold out",
    "add_to_cart": "Add to cart"
  }
}
```

```json title="locales/fr.json — storefront, French"
{
  "products": {
    "sold_out": "Épuisé",
    "add_to_cart": "Ajouter au panier"
  }
}
```

```json title="locales/en.default.schema.json — theme editor, English"
{
  "general": {
    "colors": "Colors"
  },
  "labels": {
    "color_primary": "Primary color"
  }
}
```

```json title="locales/fr.schema.json — theme editor, French"
{
  "general": {
    "colors": "Couleurs"
  },
  "labels": {
    "color_primary": "Couleur principale"
  }
}
```

```liquid
{# Reads from <lang>.json — shows "Sold out" or "Épuisé" #}
{{ 'products.sold_out' | t }}
```

```json
// Reads from <lang>.schema.json — shows "Primary color" or "Couleur principale"
{ "type": "color", "id": "color_primary", "label": "t:labels.color_primary" }
```

There's one distinction here that trips people up more than any other: **the two file pairs aren't controlled by the same language setting.**

| File pair | Seen by | Language controlled by |
|---|---|---|
| `<lang>.json` | Shoppers, on the storefront | The shopper's chosen storefront language (`localization.language`, or a locale-prefixed URL like `/fr/`) |
| `<lang>.schema.json` | Merchants, inside the theme editor | The merchant's own Shopify **admin** language, set in their staff account, not the storefront's active locale |

A French shopper browsing an English-only store and a French merchant editing that same theme in Shopify admin are two completely independent things. The shopper needs `fr.json` to exist. The merchant needs `fr.schema.json` to exist. A store can have one without the other, and both files are optional per language, Shopify just falls back to the `.default.` pair for whichever one is missing.

## Step 3: how `settings_schema.json`'s `t:` keys resolve into locale files

[settings_schema.json: Rules & Conventions](/config-and-settings/settings-schema-json/) covers what `settings_schema.json` is for. This is the part that connects it back to the files on this page: every `"t:..."` string inside `settings_schema.json` is a lookup into `<lang>.schema.json`, using the same dot-path structure as the `t` filter, just pointed at the editor-only file instead of the storefront one.

```json title="config/settings_schema.json (excerpt)"
[
  {
    "name": "t:general.colors",
    "settings": [
      { "type": "header", "content": "t:labels.colors_heading" },
      {
        "type": "color",
        "id": "color_primary",
        "label": "t:labels.color_primary",
        "default": "#1a5f4f"
      },
      {
        "type": "select",
        "id": "page_width",
        "label": "t:labels.page_width",
        "options": [
          { "value": "narrow", "label": "t:options.page_width.narrow" },
          { "value": "wide", "label": "t:options.page_width.wide" }
        ]
      }
    ]
  }
]
```

```json title="locales/en.default.schema.json — the entries that resolve every t: key above"
{
  "general": {
    "colors": "Colors"
  },
  "labels": {
    "colors_heading": "Color settings",
    "color_primary": "Primary color",
    "page_width": "Page width"
  },
  "options": {
    "page_width": {
      "narrow": "Narrow",
      "wide": "Wide"
    }
  }
}
```

| In `settings_schema.json` | Strip `t:`, look up this path in `en.default.schema.json` | Shows up in the theme editor as |
|---|---|---|
| `"name": "t:general.colors"` | `general.colors` | The settings group's name, in the sidebar |
| `"content": "t:labels.colors_heading"` | `labels.colors_heading` | A header line inside that group |
| `"label": "t:labels.color_primary"` | `labels.color_primary` | The color picker's own label |
| `"label": "t:options.page_width.narrow"` | `options.page_width.narrow` | One option's text inside the `page_width` select |

There's no fuzzy matching here. `t:a.b.c` means "look up the key `a.b.c` in `<lang>.schema.json`," exactly the same dot-path mechanics as `{{ 'a.b.c' | t }}` on the storefront, just resolved against the other file. If the path doesn't exist in `en.default.schema.json`, the theme editor shows the literal string (`labels.color_primary`) instead of real text, with no error to flag it. This is why [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) requires every schema string to use a `t:` key in the first place, and it's also why `en.default.schema.json` has to stay in sync with `settings_schema.json` as you add or rename settings: a `t:` key with nothing on the other end just renders as raw text in the editor, silently.

### Not every property accepts a `t:` key

Only specific properties are actually translatable through a schema locale file. Using `t:` somewhere else in `settings_schema.json` doesn't error, it just doesn't get looked up, so it's worth knowing the actual list:

| Where | Property |
|---|---|
| Any setting | `label`, `info` |
| `settings_schema.json`, section schema, `block` | `name` |
| `select` | `group` |
| `html`, `number`, `text`, `textarea`, `video_url` | `placeholder` |
| `range` | `unit` |
| `header`, `paragraph` | `content` |
| `presets` | `name`, `category` |
| `html`, `inline_richtext`, `liquid`, `richtext`, `text`, `textarea`, `url`, `video`, `video_url` | `default` |

## Step 4: naming and structuring keys correctly

A "key" is just the name you use to look up a piece of translated text, like `products.add_to_cart`.

### Naming convention: `snake_case`, always

Locale keys use lowercase `snake_case` segments, the same convention this handbook uses for setting `id`s (see [Complete Worked Example](/codebase-structure/complete-worked-example/)). No camelCase, no kebab-case, no spaces:

```json
// ✅ RIGHT
{ "add_to_cart": "Add to cart" }

// ❌ WRONG — camelCase
{ "addToCart": "Add to cart" }

// ❌ WRONG — kebab-case, and JSON keys can't contain unescaped characters
// that make them awkward to reference from Liquid anyway
{ "add-to-cart": "Add to cart" }
```

### Shopify's own recommended structure: Category → Group → Description

This isn't just our convention, it's [Shopify's documented structure](https://shopify.dev/docs/storefronts/themes/architecture/locales/storefront-locale-files) for both file types: a top-level **category**, a second-level **group** within it, and a third-level **description**, which is the actual translated string:

```json
{
  "my_category": {
    "my_group": {
      "my_description": "translation text"
    }
  }
}
```

Shopify's own docs suggest starting categories along these lines, which lines up closely with how this handbook already groups things:

| Category | Covers |
|---|---|
| `general` | 404, breadcrumbs, search, pagination |
| `blogs` | Article, article comments, blog sidebar |
| `cart` | Cart contents, updates, notes, checkout link |
| `collection` | Collection page, collection loop |
| `products` | Product page, product loop, related products |
| `layout` | Field titles and identifiers shared across the theme |
| `customer` | Account, orders, addresses, login, registration |

If you're translating strings inside a snippet, group them with whichever category matches the snippet's role, not a category named after the snippet itself. A `related-products.liquid` snippet's strings belong under `products`, not under a new `related_products` category.

If you keep all your keys in one flat list instead of using this category/group structure, that list gets hard to manage once you pass a few dozen strings. Group your keys by feature or section:

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

One more naming habit worth adopting: make the description level specific enough to give context on its own. `products.add_to_cart.submit_button_text` tells a translator exactly what they're translating; `products.add_to_cart.submit` makes them go find the actual markup to be sure.

## Step 5: pluralization — never string-concatenate a count

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

In English, pluralization only has two forms, but that's not true everywhere. Arabic, for example, has six different plural forms depending on the number. Shopify's translation system handles all of this automatically for each language, as long as you use the right plural keys instead of hardcoding a count into a single fixed string.

`one` and `other` cover English, but they're not the full set. Shopify supports all six [CLDR](https://github.com/unicode-org/cldr) plural categories, and only include the ones a given language actually needs:

| Key | Used by |
|---|---|
| `zero` | Some languages (Arabic, Latvian) need an explicit zero form |
| `one` | Singular, e.g. English "1 item" |
| `two` | Dual forms (Arabic, Welsh) |
| `few` | Small-count forms (Arabic, Polish, Russian) |
| `many` | Large-count forms (Arabic, Polish) |
| `other` | The catch-all/default form, required in every language |

You don't need to guess which keys a language needs. Write `one`/`other` for English source strings; a translator working on a language that needs `zero`, `two`, `few`, or `many` adds those keys when they translate it.

## Step 6: variables in translated strings — never assemble a sentence from parts

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

### Allowing HTML in a translation: the `_html` suffix

Translated storefront strings are HTML-escaped by default, on purpose, so a translator's text can never accidentally inject markup. If a string genuinely needs to contain HTML, like a `<strong>` tag around one word, add `_html` to the end of the key's description segment. That suffix, and only that suffix, turns escaping off for that key:

```json
// ❌ WRONG — the <strong> tags render as literal text on the page,
// because this key has no _html suffix
{ "announcement_bar_text": "Spend $50 and get <strong>FREE</strong> shipping" }

// ✅ RIGHT — the _html suffix tells Shopify not to escape this value
{ "announcement_bar_text_html": "Spend $50 and get <strong>FREE</strong> shipping" }
```

```liquid
{{ 'layout.announcement_bar_text_html' | t }}
```

Only add `_html` to a key that actually needs markup in it. Escaping is the safe default for a reason, don't turn it off on a key just because it's convenient.

## Step 7: adding a new language, end to end

1. Copy `en.default.json` and `en.default.schema.json` to `<new-lang>.json` and `<new-lang>.schema.json`.
2. Translate every value, but never translate the keys. Keys stay in English because they're identifiers, not content shoppers actually see.
3. Check for any string that assumes English grammar, like a concatenated sentence or a missing plural form. This is the moment to fix the kind of mistakes covered in Step 5 and Step 6. They're much cheaper to fix now than after a translator has already translated the broken structure.
4. Run the theme with `?locale=<new-lang>` (or however your setup previews a locale) and check it by hand for three things. First, look for untranslated strings that unexpectedly fall back to English, which usually means a missing key. Second, look for text that overflows its container, since some languages run 30% or more longer than English for the same meaning. Third, check for RTL layout issues if the language needs them (see [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/)).
5. Check `<new-lang>.schema.json` separately, inside the theme editor. It's easy to forget this step, since this file never shows up on the actual storefront.

## Step 8: countries vs. languages — they're not the same axis

A theme can support one language across many countries, each with its own currency and shipping messaging. Or it can support many languages within a single country. These are two separate things, and Shopify's `localization` object keeps them separate too:

```liquid
{{ localization.language.iso_code }}   {# e.g. "en", "fr" #}
{{ localization.country.iso_code }}    {# e.g. "US", "CA" #}
```

Don't assume a country implies a language, or the other way around. A Canadian storefront might need both English and French. A single-language storefront might still need country-specific price and shipping formatting. Base anything locale-dependent, like showing a shipping estimate, on `localization.country`. Base text translation on `localization.language`. A merchant configures these two settings independently, so your theme's logic should treat them independently too.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `snake_case` for every locale key segment, and structure keys as category → group → description, matching Shopify's own documented convention. | **Using camelCase or kebab-case for locale keys.** `snake_case` is the convention. It's not enforced by JSON syntax, but it's what every other key in the theme uses. |
| Group locale keys by feature, not by page. It makes life easier for both translators and developers as the file grows. | **Concatenating strings around a variable** ("Showing" + count + "of" + total) instead of using one interpolated sentence. This breaks translatability for any language with a different word order. |
| Never concatenate translated fragments into a sentence. Always interpolate variables into one complete, translatable string. | **Hardcoding a count into a string** instead of using the right CLDR plural keys, which produces "1 items" and worse problems in other languages. |
| Use the right CLDR plural keys for each language, not just `one`/`other`. Never splice a hardcoded count into a fixed string. | **Adding `_html` to a key "just in case."** Escaping is the safe default. Only turn it off on a key that actually contains markup. |
| Only add the `_html` suffix to a key that genuinely needs markup in its value. Leave escaping on everywhere else. | **Forgetting `.schema.json` when adding a language.** The storefront gets translated, but the theme editor still shows English labels to a non-English-speaking merchant. |
| Test a new language by actually previewing it, not just by checking that the JSON is valid. You can only spot text overflow and RTL layout issues by looking at the page. | **Assuming a flat, ungrouped locale file will stay manageable.** Grouping keys early is much cheaper than reorganizing a 500-key flat file later. |
| Keep `.schema.json` translation up to date even though it's editor-only. Merchants configuring the theme in a non-English language see it directly. | **Assuming the storefront's active language also controls what a merchant sees in the theme editor.** They're two independent settings, shopper language vs. merchant admin language, backed by two separate files. |
| When you add a setting to `settings_schema.json`, add its `t:` key's counterpart to `en.default.schema.json` in the same change, not as a follow-up. A missing entry renders the raw key as text, silently. | **Adding a `t:` key to `settings_schema.json` without a matching entry in `en.default.schema.json`, or using `t:` on a property that isn't actually translatable.** Both fail silently, the editor just shows raw text or the literal key instead of erroring. |

## Key takeaways
- Two file types: `<lang>.json` (storefront) and `<lang>.schema.json` (theme editor). Both need translating.
- File naming is IETF language tags: `bn.json` for a language, `en-GB.json` when you need a region. Exactly one pair per type gets `.default.`.
- Limits: 3,400 keys per locale file, 1,000 characters per value.
- Storefront language and theme editor language are independent: `<lang>.json` follows the shopper's storefront locale, `<lang>.schema.json` follows the merchant's Shopify admin language.
- Every `t:` key in `settings_schema.json` is a dot-path lookup into `<lang>.schema.json`, resolved the same way the `t` filter resolves storefront strings, but only on specific properties (`label`, `name`, `content`, `info`, and a handful of others).
- Keys use `snake_case`, structured as category → group → description. Group by feature (`cart.item_count`, not a flat `item_count_label`).
- Never concatenate translated fragments. Use one full sentence per key, with interpolated variables.
- Use all six CLDR plural keys as needed (`zero`, `one`, `two`, `few`, `many`, `other`), not just `one`/`other`.
- Add `_html` to a key's description segment only when its value needs to contain real markup.
- Language and country are independent settings. Don't assume one implies the other.

## Further reading

- [Config & Global Settings](/config-and-settings/): what settings_schema.json itself is for, and how it relates to settings_data.json
- [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/): the Theme Store requirement this supports
- [Locales](https://shopify.dev/docs/storefronts/themes/architecture/locales) (shopify.dev): the overview page this article's official rules are drawn from
- [Storefront locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales/storefront-locale-files) (shopify.dev): naming, structure, interpolation, `_html`, and pluralization in full
- [Schema locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales/schema-locale-files) (shopify.dev): the full list of translatable schema properties
- [CLDR plural rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) (unicode.org): which languages need which plural keys
