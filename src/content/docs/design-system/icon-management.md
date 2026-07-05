---
title: Icon Management
description: Inline SVG snippets vs. sprites, theming icons with currentColor, accessibility, and settings-driven icon pickers.
---

Icons show up in more places than almost any other visual element — nav, cart, social links, payment badges, ratings, disclosure arrows — which makes an inconsistent icon strategy compound quickly. This article is the pattern to use consistently across the whole theme.

## The recommended pattern: inline SVG snippets

```liquid
{% doc %}
  Renders the "cart" icon.
  @param {string} [class] - Additional classes to add to the SVG.
{% enddoc %}

{%- assign class = class | default: '' -%}
<svg class="icon icon-cart {{ class }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 0 0 .9 1.4H17M17 13l3-8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

```liquid
{% render 'icon-cart', class: 'icon--large' %}
```

| Why this over the alternatives | |
|---|---|
| **vs. an icon font** | No extra font file to load, no FOUT/FOIT (flash of missing icon) risk, icons remain crawlable/inspectable as real markup instead of a font-glyph mapping |
| **vs. a single SVG `<symbol>` sprite loaded once and referenced via `<use>`** | Simpler to reason about per-component (see `{% stylesheet %}`/`{% javascript %}`'s colocation principle); a sprite avoids some duplication at the cost of an extra HTTP request/build step — worth it at real scale (100+ icon instances per page), often not worth the complexity for a typical theme |
| **vs. an external icon library dependency** | No dependency to vet/update/keep licensed correctly — see [Third-Party Libraries](/style-guides/third-party-libraries/); icons are exactly the kind of small, stable asset a theme should own outright |

## Theming icons with `currentColor`

```liquid
<!-- ❌ WRONG — a hardcoded fill color means the icon can't inherit
   context (a different color scheme, a hover state, a disabled state)
   without a separate icon variant or override CSS -->
<svg fill="#1a1a1a" viewBox="0 0 24 24">...</svg>

<!-- ✅ RIGHT — inherits whatever color the surrounding CSS sets,
   automatically correct in every color scheme and interactive state -->
<svg fill="currentColor" viewBox="0 0 24 24">...</svg>
```

```css
.icon { color: var(--color-text); }
.button:hover .icon { color: var(--color-primary); }
.button[disabled] .icon { color: var(--color-disabled); }
```

Using `currentColor` (or `stroke="currentColor"` for outline-style icons) means an icon automatically matches its context through normal CSS color inheritance — no separate icon color setting, no duplicated icon markup per color variant.

## Sizing icons

```css
.icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
```

Sizing an icon in `em` units ties it to the surrounding text's `font-size` — an icon next to a button label automatically scales with that button's text size, without a separate size setting per icon instance. Use a fixed size (`width`/`height` in `px`/`rem`) only for icons that are deliberately independent of surrounding text (e.g. a large standalone icon in an empty-state illustration).

## Accessibility: decorative vs. meaningful icons

Most icons in a theme are decorative — paired with visible text that already conveys the meaning. A minority genuinely carry meaning on their own (an icon-only button with no visible label).

```liquid
<!-- ✅ Decorative icon (paired with visible text) — hide from
   assistive tech so it isn't announced redundantly -->
<button>
  {% render 'icon-cart', class: 'icon' %}
  Cart ({{ cart.item_count }})
</button>
```

```liquid
<!-- ✅ Meaningful icon (no visible text) — the icon IS the label,
   so it needs an accessible name via aria-label or visually-hidden text -->
<button aria-label="{{ 'general.cart.title' | t }}">
  {% render 'icon-cart', class: 'icon' %}
</button>
```

```liquid
<!-- ❌ WRONG — an icon-only button with no accessible name at all.
   A screen reader announces this as "button," with no indication
   of what it does -->
<button>
  {% render 'icon-cart', class: 'icon' %}
</button>
```

Every icon snippet should set `aria-hidden="true"` and `focusable="false"` on its own `<svg>` (as in the pattern above) — the *button/link wrapping it* is what carries the accessible name (via visible text or `aria-label`), not the icon itself. This keeps the icon snippet reusable in both decorative and meaningful contexts without needing two versions.

## Settings-driven icon choices

Some sections legitimately let a merchant pick from a small set of icons (e.g. a "Features" section where each block has an icon selector). Use a `select` setting mapping to snippet names, resolved via a single `{% case %}`/`{% render %}` dispatch — not a separate setting type per icon:

```liquid
{% comment %} sections/features.liquid — dispatching a select setting to an icon snippet {% endcomment %}
{%- case block.settings.icon -%}
  {%- when 'shipping' -%}{% render 'icon-shipping' %}
  {%- when 'returns' -%}{% render 'icon-returns' %}
  {%- when 'support' -%}{% render 'icon-support' %}
{%- endcase -%}
```

```json
{ "type": "select", "id": "icon", "label": "t:sections.features.blocks.feature.settings.icon.label", "options": [
  { "value": "shipping", "label": "t:sections.features.blocks.feature.settings.icon.options.shipping" },
  { "value": "returns", "label": "t:sections.features.blocks.feature.settings.icon.options.returns" },
  { "value": "support", "label": "t:sections.features.blocks.feature.settings.icon.options.support" }
] }
```

Keep this list intentionally small and curated — a merchant-facing icon picker with 40 options is harder to use well than one with 6 well-chosen, on-brand icons.

## Organizing icon snippets in the codebase

```
snippets/
  icon-cart.liquid
  icon-search.liquid
  icon-account.liquid
  icon-shipping.liquid
```

A consistent `icon-*` naming prefix (see [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/)) makes every icon easy to find and makes it immediately obvious from a file listing which snippets are icons vs. other reusable fragments.

## Best practices

- Default to inline SVG snippets with `currentColor`/`stroke="currentColor"` — this single pattern covers theming, sizing, and reuse without extra machinery.
- Set `aria-hidden="true"` and `focusable="false"` on every icon snippet's `<svg>` itself, and put the accessible name on the wrapping interactive element when the icon is the only label.
- Size icons in `em` units by default so they scale naturally with surrounding text.
- Keep any merchant-facing icon picker small and curated rather than exhaustive.

## Common mistakes

- **Hardcoding an icon's fill/stroke color** instead of `currentColor`, forcing a separate icon variant for every color context it needs to appear in.
- **Shipping an icon-only button with no accessible name** — screen reader users get an unlabeled "button" with no indication of its purpose.
- **Adding an icon font or external icon library dependency** for a need a handful of owned inline SVGs would cover more simply — see [Third-Party Libraries](/style-guides/third-party-libraries/).
- **Sizing every icon with a fixed pixel value** instead of `em`, causing icons to look mismatched against text at different scale settings.

## Quick Reference

- Inline SVG snippets, named `icon-*`, in `snippets/` — the default pattern for this theme.
- `fill`/`stroke="currentColor"` for automatic theming; `em`-based sizing for automatic scaling with text.
- `aria-hidden="true"` + `focusable="false"` on the icon itself; accessible name goes on the wrapping interactive element when needed.
- Keep any settings-driven icon picker small and curated.

## Further Reading

- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) — file naming conventions this pattern follows
- [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/) — the broader accessible-naming principles this applies
