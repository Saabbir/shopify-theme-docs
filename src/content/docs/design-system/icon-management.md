---
title: Icon Management
description: Inline SVG snippets vs. sprites, how to theme icons with currentColor, accessibility basics, and settings-driven icon pickers.
---

Icons show up everywhere in a theme. You'll find them in the navigation menu, the cart, social links, payment badges, star ratings, and the small arrows that open and close menus.

Because icons appear in so many places, it's easy for them to look inconsistent if you don't follow one clear pattern. This article shows you the one pattern to use for icons across your whole theme, so they always look and work the same way.

## The recommended pattern: inline SVG snippets

The best way to add an icon in this theme is with an inline SVG snippet.

Here's what an icon snippet looks like. This one renders a cart icon:

```liquid
{%- doc -%}
  Renders the "cart" icon.
  @param {string} [class] - Additional classes to add to the SVG.
{%- enddoc -%}

{%- assign class = class | default: '' -%}
<svg class="icon icon-cart {{ class }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 0 0 .9 1.4H17M17 13l3-8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

You then use it anywhere in your theme with a simple render tag, like this:

```liquid
{% render 'icon-cart', class: 'icon--large' %}
```

Why pick this pattern over the alternatives? The table below compares it to two other common approaches.

| Why this over the alternatives | |
|---|---|
| **vs. an icon font** | You don't load an extra font file. There's no risk of FOUT or FOIT (a flash where icons are briefly missing or invisible while the font loads). Icons stay as real, readable markup that browsers and search engines can inspect, instead of being hidden inside font characters. |
| **vs. a single SVG `<symbol>` sprite loaded once and referenced via `<use>`** | It's easier to reason about one icon at a time this way (this follows the same colocation idea behind `{% stylesheet %}` and `{% javascript %}`, explained on that page). A sprite (one file that bundles many icons together) avoids repeating code, but it costs an extra network request and an extra build step. That trade-off pays off once a page uses 100 or more icon instances, but for a typical theme it usually adds more complexity than it saves. |
| **vs. an external icon library dependency** | You skip taking on an outside dependency that you'd need to check, update, and license correctly (see [Third-Party Libraries](/style-guides/third-party-libraries/)). Icons are small and stable enough that a theme should just own them directly, instead of depending on a library for them. |

## Theming icons with `currentColor`

`currentColor` tells an SVG to use whatever text color is already set on its parent element, instead of a fixed color baked into the SVG itself.

For outline-style icons (icons drawn with lines instead of solid shapes), you do the same thing with `stroke="currentColor"` instead of `fill="currentColor"`. Here's the difference between the wrong way and the right way:

```liquid
<!-- ❌ WRONG — a hardcoded fill color means the icon can't inherit
   context (a different color scheme, a hover state, a disabled state)
   without a separate icon variant or override CSS -->
<svg fill="#1a1a1a" viewBox="0 0 24 24">...</svg>

<!-- ✅ RIGHT — inherits whatever color the surrounding CSS sets,
   automatically correct in every color scheme and interactive state -->
<svg fill="currentColor" viewBox="0 0 24 24">...</svg>
```

Once your icon is set up this way, plain CSS controls its color:

```css
.icon { color: var(--color-text); }
.button:hover .icon { color: var(--color-primary); }
.button[disabled] .icon { color: var(--color-disabled); }
```

Using `currentColor` means the icon's color changes automatically whenever the color around it changes, whether that's a different color scheme, a hover state, or a disabled button. You don't need a separate icon color setting, and you don't need a separate copy of an icon for every color it might appear in.

## Sizing icons

If you set an icon's width and height in `em` units, the icon's size is tied directly to the text size around it.

```css
.icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
```

Here's why that's useful. Imagine a button with text next to an icon. If that button's text gets bigger, on a larger screen for example, the icon grows right along with it. You don't need a separate size setting for every icon on every screen size.

There's one exception. If an icon needs to stand on its own, not tied to any nearby text, use a fixed size instead. For example, a large icon shown by itself in an empty-state message (like "your cart is empty") works better with a fixed `width` and `height` in `px` or `rem` rather than `em`.

## Accessibility: decorative vs. meaningful icons

Icons fall into two groups when it comes to accessibility. Most icons are decorative: they sit next to text that already says what's needed, so the icon adds nothing new on its own. A smaller number of icons are meaningful: they're the only label for something, like a button that has an icon but no visible text next to it.

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

Notice that every icon snippet above sets `aria-hidden="true"` and `focusable="false"` on its `<svg>` tag. `aria-hidden="true"` tells a screen reader to skip that element entirely. `focusable="false"` stops the icon from being reachable by pressing the Tab key on a keyboard. Add both of these to every icon snippet you write, with no exceptions.

So how does a screen reader know what a meaningful icon does, if the icon itself is hidden from it? The accessible name belongs on the button or link that wraps the icon, not on the icon itself. You give it that name with visible text, or with an `aria-label` attribute.

This is why the same icon snippet can work for both decorative and meaningful icons. You never need two versions of the same icon.

## Settings-driven icon choices

Sometimes you want to let a merchant pick an icon from a small list, instead of you hardcoding one icon in the code. A good example is a "Features" section, where each block has its own icon picker.

To build this, use a `select` setting and map each option to one icon snippet name. Then use a `{% case %}` block in Liquid to check which option was picked and render the matching snippet. Don't create a whole separate setting type for every single icon. Here's what that looks like in code:

```liquid
{% comment %} sections/features.liquid — dispatching a select setting to an icon snippet {% endcomment %}
{%- case block.settings.icon -%}
  {%- when 'shipping' -%}{% render 'icon-shipping' %}
  {%- when 'returns' -%}{% render 'icon-returns' %}
  {%- when 'support' -%}{% render 'icon-support' %}
{%- endcase -%}
```

```json
{ "type": "select", "id": "icon", "label": "t:settings.icon", "options": [
  { "value": "shipping", "label": "t:options.shipping" },
  { "value": "returns", "label": "t:options.returns" },
  { "value": "support", "label": "t:options.support" }
] }
```

Notice the `t:settings.icon` and `t:options.shipping` labels. Keep these translation keys flat and shared, like `t:settings.*` and `t:options.*`, instead of nesting a separate copy for every block. You can see the full pattern, checked against Shopify's own Horizon and Skeleton themes, in the [Complete Worked Example](/codebase-structure/complete-worked-example/).

Keep your list of icon options small on purpose. A picker with 40 icon choices is overwhelming and hard to use well. A picker with 6 well-chosen icons that match your theme's style is much easier for a merchant to use, and it looks more polished too.

## Organizing icon snippets in the codebase

```
snippets/
  icon-cart.liquid
  icon-search.liquid
  icon-account.liquid
  icon-shipping.liquid
```

Notice that every icon snippet file starts with `icon-`, like `icon-cart.liquid` or `icon-search.liquid`. This small naming trick makes a real difference.

When every icon file shares the same prefix, anyone browsing your `snippets/` folder can spot the icons right away, without opening a single file. See [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) for the full naming rules used across the theme.

## Best practices

- Use inline SVG snippets with `currentColor` (or `stroke="currentColor"`) by default. This one pattern handles theming, sizing, and reuse without any extra tooling.
- Set `aria-hidden="true"` and `focusable="false"` on every icon snippet's `<svg>` tag. Put the accessible name on the button or link wrapping the icon when the icon is the only label.
- Size icons in `em` units by default, so they scale naturally with the surrounding text.
- Keep any merchant-facing icon picker small and focused, instead of trying to cover every possible option.

## Common mistakes

- **Hardcoding an icon's fill or stroke color** instead of using `currentColor`. This forces you to make a separate copy of the icon for every color context it needs to appear in.
- **Shipping an icon-only button with no accessible name.** A screen reader user just hears an unlabeled "button," with no idea what it does.
- **Adding an icon font or an external icon library** when a handful of your own inline SVGs would cover the same need more simply. See [Third-Party Libraries](/style-guides/third-party-libraries/) for more on this.
- **Sizing every icon with a fixed pixel value** instead of `em`. This makes icons look mismatched next to text at different sizes.

## Quick Reference

- Inline SVG snippets, named `icon-*`, live in `snippets/`. This is the default pattern for this theme.
- Use `fill="currentColor"` or `stroke="currentColor"` for automatic theming, and size icons in `em` units so they scale with text.
- Add `aria-hidden="true"` and `focusable="false"` on the icon itself. Put the accessible name on the wrapping button or link when it's needed.
- Keep any settings-driven icon picker small and focused.

## Further Reading

- [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/): the file naming conventions this pattern follows
- [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/): the broader accessible naming principles this page uses
