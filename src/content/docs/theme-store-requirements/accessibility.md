---
title: Accessibility (WCAG 2.1 AA)
description: Shopify's concrete, checkable accessibility requirements.
---

Shopify's accessibility bar is concrete and testable — not a vague "be inclusive" statement. Here's every checkable item.

## The checklist

- **Full keyboard access** — every interactive element, including dropdown navigation, must work without a mouse.
- **Visible focus states** — a keyboard user must be able to see which element is focused.
- **Alt text on all images** — use `image.alt` or the `image_tag` filter's `alt:` parameter. Decorative images get `alt=""`.
- **Connected form labels** — every input needs a unique `id`, and its `<label>` needs a matching `for`.
- **Valid HTML** throughout.
- **Color contrast**: body text 4.5:1 minimum; large text (18pt+) and non-text elements (borders, icons) 3:1 minimum.
- **Logical focus order** — tab order must match the DOM order: top-to-bottom, left-to-right.
- **Touch targets ≥ 24×24 CSS pixels** (inline body text links are exempt).
- **Distinct heading styles** — h1 through h6 must each look visually different from one another.

## Code example

```html
<!-- WRONG: no label association, no alt text -->
<img src="{{ product.featured_image | image_url }}">
<input type="email" placeholder="Email">

<!-- RIGHT -->
<img
  src="{{ product.featured_image | image_url: width: 800 }}"
  alt="{{ product.featured_image.alt | escape }}"
  width="800"
  height="{{ 800 | divided_by: product.featured_image.aspect_ratio }}"
  loading="lazy"
>

<label for="customer-email">Email</label>
<input type="email" id="customer-email" name="email">
```

## Test before you submit

Run an automated pass (axe DevTools or Lighthouse) plus a manual keyboard-only pass on your product, collection, and home pages. Automated tools catch missing alt text and contrast failures; they don't catch a broken tab order — you have to try that yourself.

## Quick Reference

- 9 concrete, testable rules — see the checklist above.
- Contrast: 4.5:1 body text, 3:1 large text/icons/borders.
- Touch targets: 24×24px minimum.
- Test both automated (axe/Lighthouse) and manual (keyboard-only navigation).

## Further Reading

- [Accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#12-accessibility) — shopify.dev
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — shopify.dev
