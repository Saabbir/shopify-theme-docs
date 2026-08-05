---
title: Complete Worked Example
description: A full example with a snippet, block, section, schema, theme settings, and presets. Copy and paste it as a starting point, matching Horizon and Skeleton Theme's actual shipped source.
---

Every other page in this handbook covers one rule at a time. This page is different. It puts all of those rules together into one real feature: a testimonials section with a quote block that merchants can reorder. You'll see how the pieces fit together, and you can copy the whole thing as a starting point for your own project.

Every rule used here comes straight from real Shopify code. That includes the LiquidDoc syntax, the locale key structure, the BEM naming pattern for CSS classes, and how setting IDs are written. We checked each of these against Shopify's actual Horizon and Skeleton Theme source code, not just against general guidance. See [AGENTS.md's "Horizon-verified conventions"](/getting-started/setting-up-ai-rules/) to see where each one was confirmed.

## What we're building

We're going to build a full-width `testimonials` section. It has a heading, plus a `quote` block that merchants can add, remove, and reorder as many times as they like. Each quote is rendered through a shared `quote-card` snippet, so the same markup can be reused somewhere else too, like on a reviews page or a product page testimonial, without copying any code.

```
sections/testimonials.liquid   ← the section: heading setting, accepts quote blocks + @app
blocks/quote.liquid            ← the block: quote text, author, rating — merchant-editable
snippets/quote-card.liquid     ← the snippet: shared rendering, reused by both the block and elsewhere
locales/en.default.json        ← storefront strings
locales/en.default.schema.json ← editor labels (flat namespace — see below)
```

## 1. The snippet — `snippets/quote-card.liquid`

This snippet holds the reusable rendering logic (the actual code that builds the quote's markup). It takes clear, named parameters, and it's documented with LiquidDoc, a comment format that spells out exactly what a snippet expects. The block below calls this snippet, and so could anything else in the theme that needs to render a quote the same way.

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

**Why use a snippet instead of writing the markup directly in the block?** You might need this same rendering somewhere the data isn't coming from a theme block at all. For example, a reviews page might pull quotes from a metaobject. A snippet with clear parameters can be called from anywhere. Markup written straight into `blocks/quote.liquid` can't be reused that way.

## 2. The block — `blocks/quote.liquid`

Merchants can edit this block: text, author, and rating are all settings they can change in the theme editor. They can also add, remove, or reorder the block inside the section. That's what makes it a **block**, and not just a plain call to the snippet above.

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

**Notes that match real-world convention:**
- Setting `id`s use `snake_case` (`author`, `rating`), which is our general rule for writing IDs, like `my_setting_id` instead of `mySettingId`. None of these IDs happen to match a CSS custom property directly, so none of them need the kebab-case exception (you'll see one that does need it further down).
- `"name": "t:names.quote"` and the preset's `"name"` use the **same** locale key. That's normal. A block's display name and its preset's picker name are usually identical.
- **A `presets` array is required.** Without at least one entry, this block never shows up in the theme editor's "Add block" picker. The file itself still works fine, it's just invisible to merchants.

## 3. The section — `sections/testimonials.liquid`

This section only accepts `quote` blocks by their specific type, not the generic `@theme` type, because this section only has one job to do. It also accepts `@app` blocks, so apps can add their own content here too. On top of that, it has its own heading setting, and its stylesheet shows the single-property-vs-multi-property CSS rule from the [CSS Style Guide](/style-guides/css/) in the same file.

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

**Why `{ "type": "quote" }` instead of `{ "type": "@theme" }`?** This section only does one thing: show quotes. So it makes sense to restrict it to the one block type it's built for (see [Theme Blocks & Nesting](/codebase-structure/theme-blocks/) for more on this). `@theme`, which accepts any theme block, is meant for containers that are genuinely general-purpose, like a flexible layout area. This section isn't one of those. We still include `@app`, though, because you should accept app blocks anywhere a merchant's app might reasonably want to add content.

**Why does the preset include three starter `quote` blocks?** So a merchant adding this section from the picker sees a filled-in example right away, instead of an empty shell they have to figure out how to fill in themselves.

## 4. The locale files — two different key conventions, on purpose

This is the part people get wrong most often. The two files look similar at first glance, but they actually follow different rules.

### `locales/en.default.json` — storefront strings, nested by feature

```json
{
  "content": {
    "rating_out_of_five": "Rated {{ rating }} out of 5"
  }
}
```

Liquid reads this file with `{{ 'key' | t }}` to show real text to shoppers on the storefront. Nesting keys by feature, like the example above, is fine for this file. See [Managing Locale Files](/internationalization-and-locales/managing-locale-files/) for the full guide on it.

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

**This matches what we found in Horizon's and Skeleton's real, shipped `en.default.schema.json` files.** They use flat, top-level groups organized by purpose (`names`, `settings`, `options`, `categories`), not keys nested by component, like `sections.testimonials.settings.heading`.

Here's why this matters. A label like "Heading" or "Gap" gets reused by dozens of unrelated sections and blocks in a real theme. If you nested it inside each component, you'd end up writing the translated word "Heading" dozens of separate times instead of just once. With the flat structure, `t:settings.heading` in this section's schema and `t:settings.heading` in a completely different section's schema both point to the exact same entry.

| ❌ Don't (nested per-component) | ✅ Do (flat, shared, purpose-based) |
|---|---|
| `"sections": { "testimonials": { "settings": { "heading": "Heading" } } }` | `"settings": { "heading": "Heading" }` |
| A new section needing a "Heading" setting adds its own duplicate translated string | A new section needing a "Heading" setting reuses `t:settings.heading`. Nothing new to translate. |

## 5. Theme-wide settings — when something belongs in `config/settings_schema.json` instead

Sometimes a setting shouldn't just belong to one section. If every section on the site should share one typography choice, that belongs in **theme settings**, not in a section's own settings:

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

You reference it from any section or block through the global `settings` object, not `section.settings`:

```liquid
<h2 class="testimonials__heading" style="font-family: {{ settings.type_heading_font.family }};">
```

See [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/) for the full difference between where a setting is *defined* (`settings_schema.json`) and where a merchant's actual *chosen values* live (`settings_data.json`, which you should never edit by hand).

## Putting it together: the decision points, recapped

| Decision | What we chose here | Why |
|---|---|---|
| Snippet vs. inline markup in the block | Snippet (`quote-card`) | Reusable outside this one block |
| Block vs. hardcoded section content | Block (`quote`) | Merchant needs to add/remove/reorder |
| `{ "type": "quote" }` vs. `{ "type": "@theme" }` | Specific type | Section has one clear purpose |
| `gap` as a custom property vs. `layout` as a class | Both, per-setting | One CSS property varies (gap) vs. several vary together (layout) |
| Section-level setting vs. theme setting | Section (`heading`, `layout`, `gap`); theme (`type_heading_font`) | Scoped to this section vs. shared sitewide |
| Locale key structure | Nested (`en.default.json`) vs. flat (`en.default.schema.json`) | Storefront content vs. editor labels (verified against real Horizon/Skeleton source) |

## Best practices

- Build a snippet first, if the rendering logic might get reused outside the block or section that first needed it. Turning inline markup into a snippet later takes more work than just starting with one.
- Use a specific block type, like `{ "type": "quote" }`, by default. Save `@theme` for containers that are genuinely meant to hold anything.
- Keep your schema locale keys in the shared, flat groups (`settings.*`, `options.*`, `names.*`, `categories.*`). Before you add a new label, check whether a close match already exists.
- Always add at least one preset to a block. Without one, it just never shows up in the editor's picker, and nothing tells you it's missing.

## Common mistakes

- **Writing rendering logic straight into a block file** instead of a snippet, then later discovering it's needed elsewhere and copying it instead of reusing it.
- **Nesting schema locale keys per component** (like `sections.testimonials.settings.heading`) instead of using the shared, flat structure. This creates near-duplicate strings scattered across a real theme's dozens of schemas.
- **Forgetting the block's `presets` array.** The block still works fine if it's manually added through `@theme`, but it never appears in the picker on its own.
- **Putting a sitewide choice in one section's own schema** instead of `config/settings_schema.json`. That forces a merchant to set the same value on every section, one by one.

## Quick Reference

- Snippet: reusable rendering with clear, named parameters. Block: editable by merchants, and can be added, removed, and reordered. A block wraps a snippet when the rendering itself is shared.
- `{% schema %}` blocks array: use a specific type by default, `@theme` only for general-purpose containers, and always include `@app`.
- One CSS property that varies becomes a custom property. Several properties that vary together become a class.
- `en.default.json` (storefront text): nest by feature. `en.default.schema.json` (editor labels): flat, shared namespaces grouped by purpose, verified against Horizon/Skeleton.
- A theme-wide choice belongs in `config/settings_schema.json`, referenced through the global `settings` object, not duplicated in every section.

## Further Reading

- [AGENTS.md "Horizon-verified conventions"](/getting-started/setting-up-ai-rules/): where each convention on this page was checked against real shipped source
- [Theme Blocks & Nesting](/codebase-structure/theme-blocks/): the full `@theme`/`@app` targeting decision
- [CSS Style Guide](/style-guides/css/): the single/multi-property rule used in the section's stylesheet above
- [Managing Locale Files](/internationalization-and-locales/managing-locale-files/): the storefront locale file in full
- [`settings_schema.json` & `settings_data.json`](/design-system/settings-schema-and-data/): theme-wide settings in full
- [Web Components Guideline](/style-guides/web-components/): how to add interactive behavior to a block like this one
