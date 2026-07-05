---
title: Accessibility (WCAG 2.1 AA)
description: Shopify's concrete, checkable accessibility requirements.
---

Shopify's accessibility bar is concrete and testable — not a vague "be inclusive" statement. Here's every checkable item, with the right and wrong way to implement each one. For the process behind consistently meeting this bar — not just the checklist — see [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/).

## The checklist

| Requirement | ✅ Do | ❌ Don't |
|---|---|---|
| Full keyboard access | Every interactive element (menus, modals, carousels) operable via Tab/Enter/Space/arrow keys | Rely on hover/click-only interactions with no keyboard equivalent |
| Visible focus states | A clear visual outline or highlight on `:focus-visible` | `outline: none` with nothing replacing it |
| Alt text on all images | `image.alt` or `image_tag`'s `alt:` param; `alt=""` for decorative images | A missing `alt`, or `alt="image"` / `alt="photo"` placeholder text |
| Connected form labels | Unique `id` on every input, matching `<label for="...">` | A `placeholder` used as the only label |
| Valid HTML | Semantic, well-nested markup throughout | `<div>`-only markup with no semantic elements, or invalid nesting |
| Color contrast | 4.5:1 body text, 3:1 large text (18pt+) / icons / borders | Light gray text on a white background that fails contrast ratios |
| Logical focus order | Tab order matches DOM order, top-to-bottom, left-to-right | `tabindex` values that jump around visually |
| Touch targets | ≥ 24×24 CSS pixels (inline body text links exempt) | Tiny icon buttons with no padding, especially on mobile |
| Distinct headings | h1–h6 each visually different from one another | Every heading level styled identically |

## Code examples

### Images and form labels

```html
<!-- ❌ WRONG: no label association, no alt text -->
<img src="{{ product.featured_image | image_url }}">
<input type="email" placeholder="Email">

<!-- ✅ RIGHT -->
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

### Focus states

```css
/* ❌ WRONG — removes focus indication entirely */
button:focus { outline: none; }

/* ✅ RIGHT — removes the default only when providing a clear replacement,
   and only for mouse users (keyboard focus still gets the outline) */
button:focus:not(:focus-visible) { outline: none; }
button:focus-visible {
  outline: 2px solid var(--color-focus, #1a73e8);
  outline-offset: 2px;
}
```

### Keyboard-operable custom components

```html
<!-- ❌ WRONG: a div styled as a button has no keyboard semantics at all -->
<div class="btn" onclick="addToCart()">Add to cart</div>

<!-- ✅ RIGHT: a real button, keyboard-operable by default -->
<button type="submit" class="btn">Add to cart</button>
```

If you must build a custom interactive widget that isn't a native element (a custom dropdown, a carousel), give it the correct ARIA role, `tabindex="0"`, and explicit key handlers for Enter/Space/arrow keys — don't assume styling alone makes it accessible.

## Test before you submit

Run an automated pass (axe DevTools or Lighthouse) plus a manual keyboard-only pass on your product, collection, and home pages. Automated tools catch missing alt text and contrast failures; they don't catch a broken tab order or a keyboard trap — you have to try that yourself.

### A quick manual test script

1. Unplug your mouse (or just don't touch it).
2. Tab through the entire page, home to footer.
3. At every interactive element, confirm: can you see where focus is? Does Enter/Space activate it the way a click would?
4. Open any modal (cart drawer, search) — can you Tab out of it accidentally, or does focus stay trapped inside until you close it?
5. Close the modal with Escape — does focus return to the element that opened it?

If any answer is "no," that's a real accessibility bug, not an edge case.

## Best practices

- Default to semantic HTML elements (`<button>`, `<nav>`, `<label>`) before reaching for ARIA — a native element gets you correct keyboard behavior and screen reader support for free.
- Build keyboard-only testing into your normal QA loop (see [Manual QA Checklist](/quality-validation/manual-qa-checklist/)), not as a separate accessibility-only pass done once at the end.
- When customizing focus styles, always test with `:focus-visible` so mouse users don't see focus rings on click, while keyboard users still get them.

## Common mistakes

- **Removing `outline: none` without providing a visible replacement.** This is the single most common accessibility regression, and it's usually introduced by someone trying to "clean up" a default browser style.
- **Using `<div>`/`<span>` with a click handler instead of a real `<button>`.** It looks identical visually and fails completely for keyboard and screen reader users.
- **Alt text that describes nothing useful** (`alt="image1.jpg"`, `alt="photo"`) — this technically satisfies "has an alt attribute" but fails the actual intent of the requirement.
- **Testing contrast only in light mode**, if the theme supports a dark color scheme — check contrast ratios in every color scheme a merchant can select, not just the default.

## Quick Reference

- 9 concrete, testable rules — see the checklist above.
- Contrast: 4.5:1 body text, 3:1 large text/icons/borders.
- Touch targets: 24×24px minimum.
- Test both automated (axe/Lighthouse) and manual (keyboard-only navigation, including modal focus trapping).

## Further Reading

- [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/) — the process behind this checklist
- [Accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#12-accessibility) — shopify.dev
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — shopify.dev
