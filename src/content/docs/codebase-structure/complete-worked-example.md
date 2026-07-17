---
title: Complete Worked Example
description: A real snippet, block, section, schema, theme settings, and presets — copy-paste ready, matching conventions verified against Horizon and Skeleton Theme's actual shipped source.
---

Every other page in this handbook shows one convention at a time. This page assembles all of them into one working feature — a testimonials section with a reorderable quote block — so you can see how they fit together, and copy the whole thing as a starting point. Every convention used here (LiquidDoc syntax, locale key structure, BEM naming, setting ID casing) was checked directly against Shopify's actual shipped Horizon and Skeleton Theme source, not just against generic guidance — see [AGENTS.md's "Horizon-verified conventions"](/ai-assisted-development/setting-up-ai-rules/) for where each one was confirmed.

## What we're building

A `testimonials` section, full-width, with a heading and a repeatable `quote` block merchants can add/remove/reorder — each quote rendered through a shared `quote-card` snippet so the same markup can be reused elsewhere (a reviews page, a product page testimonial callout) without duplicating it.

```
sections/testimonials.liquid   ← the section: heading setting, accepts quote blocks + @app
blocks/quote.liquid            ← the block: quote text, author, rating — merchant-editable
snippets/quote-card.liquid     ← the snippet: shared rendering, reused by both the block and elsewhere
locales/en.default.json        ← storefront strings
locales/en.default.schema.json ← editor labels (flat namespace — see below)
```

## 1. The snippet — `snippets/quote-card.liquid`

Reusable rendering logic, explicit parameters, documented with LiquidDoc. This is what actually gets called from the block below, and could equally be called from anywhere else in the theme that needs to render a quote the same way.

```liquid
{%- doc -%}
  Renders a single quote card — text, optional author, optional rating.

  @param {string} text - The quote text (required).
  @param {string} [author] - The person being quoted.
  @param {number} [rating] - A rating out of 5. Omit to hide the rating row.

  @example
  {% render 'quote-card', text: "Great product!", author: "Jamie", rating: 5 %}
{%- enddoc -%}

{%- liquid
  assign rating = rating | default: 0
-%}

<div class="quote-card">
  <blockquote class="quote-card__text">{{ text }}</blockquote>
  {%- if author != blank -%}
    <cite class="quote-card__author">{{ author }}</cite>
  {%- endif -%}
  {%- if rating > 0 -%}
    <div
      class="quote-card__rating"
      role="img"
      aria-label="{{ 'content.rating_out_of_five' | t: rating: rating }}"
    >
      {%- for i in (1..5) -%}
        <span class="quote-card__star{% if i <= rating %} quote-card__star--filled{% endif %}" aria-hidden="true">★</span>
      {%- endfor -%}
    </div>
  {%- endif -%}
</div>
```

**Why a snippet, not inline markup in the block:** the same rendering might be needed somewhere the data isn't coming from a theme block at all (a metaobject-driven reviews page, say). A snippet with explicit parameters can be called from anywhere; markup written directly inside `blocks/quote.liquid` can't.

## 2. The block — `blocks/quote.liquid`

Merchant-editable (text, author, rating are all settings), addable/removable/reorderable within the section — this is what makes it a **block**, not just a call to the snippet above.

```liquid
{%- doc -%}
  A single testimonial quote. Merchant-editable via the theme editor —
  see snippets/quote-card.liquid for the shared rendering this wraps.
{%- enddoc -%}

{% render 'quote-card', text: block.settings.text, author: block.settings.author, rating: block.settings.rating %}

{% schema %}
{
  "name": "t:names.quote",
  "settings": [
    {
      "type": "richtext",
      "id": "text",
      "label": "t:settings.quote_text"
    },
    {
      "type": "text",
      "id": "author",
      "label": "t:settings.author"
    },
    {
      "type": "range",
      "id": "rating",
      "label": "t:settings.rating",
      "min": 0,
      "max": 5,
      "step": 1,
      "default": 5
    }
  ],
  "presets": [
    {
      "name": "t:names.quote",
      "category": "t:categories.text"
    }
  ]
}
{% endschema %}
```

**Notes matching verified real-world convention:**
- Setting `id`s are `snake_case` (`author`, `rating`) — the general rule. None of these happen to mirror a CSS custom property directly, so none use the kebab-case exception (see the section below for one that does).
- `"name": "t:names.quote"` and the preset's `"name"` reuse the **same** locale key — this is normal; the block's display name and its preset's picker name are usually identical.
- **A `presets` array is required** — without at least one entry, this block never appears in the theme editor's "Add block" picker, even though the file is otherwise perfectly valid.

## 3. The section — `sections/testimonials.liquid`

Accepts `quote` blocks by type (not `@theme` generically, since this section has exactly one purpose) plus `@app`, has its own heading setting, and demonstrates the single-property-vs-multi-property CSS rule from [CSS Style Guide](/style-guides/css/) in the same file.

```liquid
{%- doc -%}
  Testimonials section — a heading plus a row of reorderable quote blocks.
{%- enddoc -%}

<div
  class="testimonials testimonials--{{ section.settings.layout }}"
  style="--gap: {{ section.settings.gap }}px;"
  data-testid="testimonials-{{ section.id }}"
>
  {%- if section.settings.heading != blank -%}
    <h2 class="testimonials__heading">{{ section.settings.heading }}</h2>
  {%- endif -%}

  {%- if section.blocks.size > 0 -%}
    <div class="testimonials__list">
      {%- for block in section.blocks -%}
        <div class="testimonials__item" {{ block.shopify_attributes }}>
          {%- render block -%}
        </div>
      {%- endfor -%}
    </div>
  {%- endif -%}
</div>

{% stylesheet %}
.testimonials__list {
  display: flex;
  gap: var(--gap);
  padding-inline: var(--padding-inline-md, 1rem);
}

/* One property (gap) varies by setting → a custom property, set inline above. */

/* Several properties change together by layout mode → a class, not more variables. */
.testimonials--row .testimonials__list {
  flex-direction: row;
  overflow-x: auto;
}
.testimonials--stacked .testimonials__list {
  flex-direction: column;

  .testimonials__item {
    max-width: 40rem;
    margin-inline: auto;
  }
}
{% endstylesheet %}

{% schema %}
{
  "name": "t:names.testimonials",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:settings.heading",
      "default": "What customers say"
    },
    {
      "type": "select",
      "id": "layout",
      "label": "t:settings.layout",
      "options": [
        { "value": "row", "label": "t:options.row" },
        { "value": "stacked", "label": "t:options.stacked" }
      ],
      "default": "row"
    },
    {
      "type": "range",
      "id": "gap",
      "label": "t:settings.gap",
      "min": 0,
      "max": 64,
      "step": 4,
      "unit": "px",
      "default": 16
    }
  ],
  "blocks": [
    { "type": "quote" },
    { "type": "@app" }
  ],
  "presets": [
    {
      "name": "t:names.testimonials",
      "category": "t:categories.text",
      "blocks": [
        { "type": "quote" },
        { "type": "quote" },
        { "type": "quote" }
      ]
    }
  ]
}
{% endschema %}
```

**Why `{ "type": "quote" }` instead of `{ "type": "@theme" }`:** this section has exactly one purpose — showing quotes — so restricting it to the specific block type it's designed for is correct (per [Theme Blocks & Nesting](/codebase-structure/theme-blocks/)). `@theme` (accepting any theme block generically) is for genuinely general-purpose containers, which this isn't. `@app` is still included regardless, since accepting app blocks is expected wherever merchant apps might reasonably want to inject content.

**Why the preset includes three starter `quote` blocks:** so a merchant adding this section from the picker sees a populated example, not an empty shell they have to figure out how to fill from scratch.

## 4. The locale files — two different key conventions, on purpose

This is the part most often gotten wrong, because the two files look similar but follow different real-world conventions.

### `locales/en.default.json` — storefront strings, nested by feature

```json
{
  "content": {
    "rating_out_of_five": "Rated {{ rating }} out of 5"
  }
}
```

This file is read via `{{ 'key' | t }}` in Liquid for actual rendered storefront text. Nesting by feature (as shown) is fine here — see [Managing Locale Files](/learning-articles/managing-locale-files/) for the full guideline on this file specifically.

### `locales/en.default.schema.json` — editor labels, flat shared namespaces

```json
{
  "names": {
    "quote": "Quote",
    "testimonials": "Testimonials"
  },
  "settings": {
    "quote_text": "Quote text",
    "author": "Author",
    "rating": "Rating",
    "heading": "Heading",
    "layout": "Layout",
    "gap": "Gap"
  },
  "options": {
    "row": "Row",
    "stacked": "Stacked"
  },
  "categories": {
    "text": "Text"
  }
}
```

**This is the convention verified against Horizon's and Skeleton's actual shipped `en.default.schema.json` files — flat, top-level, purpose-based namespaces** (`names`, `settings`, `options`, `categories`), not nested per-component keys like `sections.testimonials.settings.heading`. The reason: a label like "Heading" or "Gap" gets reused by dozens of unrelated sections and blocks across a real theme. Nesting it per-component would mean writing "Heading" as a translated string dozens of separate times instead of once, referenced everywhere it's needed. `t:settings.heading` in this section's schema and `t:settings.heading` in a completely different section's schema both resolve to the same one entry.

| ❌ Don't (nested per-component) | ✅ Do (flat, shared, purpose-based) |
|---|---|
| `"sections": { "testimonials": { "settings": { "heading": "Heading" } } }` | `"settings": { "heading": "Heading" }` |
| A new section needing a "Heading" setting adds its own duplicate translated string | A new section needing a "Heading" setting reuses `t:settings.heading` — nothing new to translate |

## 5. Theme-wide settings — when something belongs in `config/settings_schema.json` instead

If every section on the site should share one typography choice (not just this one), that's a **theme setting**, not a section setting:

```json
{
  "name": "t:general.typography",
  "settings": [
    {
      "type": "font_picker",
      "id": "type_heading_font",
      "label": "t:labels.heading_font",
      "default": "work_sans_n7"
    }
  ]
}
```

Referenced from any section/block via the global `settings` object, not `section.settings`:

```liquid
<h2 class="testimonials__heading" style="font-family: {{ settings.type_heading_font.family }};">
```

See [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/) for the full distinction between where a setting is *defined* (`settings_schema.json`) and where a merchant's actual *chosen values* live (`settings_data.json`, never hand-edited).

## Putting it together: the decision points, recapped

| Decision | What we chose here | Why |
|---|---|---|
| Snippet vs. inline markup in the block | Snippet (`quote-card`) | Reusable outside this one block |
| Block vs. hardcoded section content | Block (`quote`) | Merchant needs to add/remove/reorder |
| `{ "type": "quote" }` vs. `{ "type": "@theme" }` | Specific type | Section has one clear purpose |
| `gap` as a custom property vs. `layout` as a class | Both, per-setting | One CSS property varies (gap) vs. several vary together (layout) |
| Section-level setting vs. theme setting | Section (`heading`, `layout`, `gap`); theme (`type_heading_font`) | Scoped to this section vs. shared sitewide |
| Locale key structure | Nested (`en.default.json`) vs. flat (`en.default.schema.json`) | Storefront content vs. editor labels — verified against real Horizon/Skeleton source |

## Best practices

- Build a snippet first when rendering logic might be reused outside the block/section that first needed it — retrofitting a snippet out of inline markup later is more work than starting with one.
- Reach for a specific block type (`{ "type": "quote" }`) by default; only use `@theme` for genuinely general-purpose containers.
- Keep schema locale keys in the shared, flat namespaces (`settings.*`, `options.*`, `names.*`, `categories.*`) — check whether a label you're about to add already exists before adding a near-duplicate.
- Always include at least one preset on a block, or it silently never appears in the editor's picker.

## Common mistakes

- **Writing rendering logic directly in a block file** instead of a snippet, discovering later it's needed elsewhere, and duplicating it rather than refactoring.
- **Nesting schema locale keys per-component** (`sections.testimonials.settings.heading`) instead of the shared, flat convention — creates duplicate near-identical strings across a real theme's dozens of schemas.
- **Forgetting the block's `presets` array** — the block works perfectly if manually added via `@theme`, but never appears in the picker on its own.
- **Putting a sitewide choice in a section's own schema** instead of `config/settings_schema.json`, forcing a merchant to set the same value on every section individually.

## Quick Reference

- Snippet = reusable rendering, explicit params. Block = merchant-editable, addable/removable/reorderable, wraps a snippet when the rendering itself is shared.
- `{% schema %}` blocks array: a specific type by default, `@theme` only for general-purpose containers, always include `@app`.
- One CSS property varies → custom property. Several vary together → a class.
- `en.default.json` (storefront): nest by feature. `en.default.schema.json` (editor): flat, shared, purpose-based namespaces — verified against Horizon/Skeleton.
- A theme-wide choice belongs in `config/settings_schema.json`, referenced via the global `settings` object — not duplicated per-section.

## Further Reading

- [AGENTS.md "Horizon-verified conventions"](/ai-assisted-development/setting-up-ai-rules/) — where each convention on this page was checked against real shipped source
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) — the `@theme`/`@app` targeting decision in full
- [CSS Style Guide](/style-guides/css/) — the single/multi-property rule used in the section's stylesheet above
- [Managing Locale Files](/learning-articles/managing-locale-files/) — the storefront locale file in full
- [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/) — theme-wide settings in full
- [Web Components Guideline](/style-guides/web-components/) — for adding interactive behavior to a block like this one
