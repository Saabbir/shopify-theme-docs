---
title: Accessibility (WCAG 2.1 AA)
description: Shopify's concrete, checkable accessibility requirements.
---

Shopify's accessibility bar is concrete and easy to check. It's not a vague "be inclusive" statement. For each item below, you can test whether you pass or fail.

Here's every checkable item, with the right way and the wrong way to build it. This page covers the checklist. For the process behind meeting this bar consistently, see [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/).

## The checklist

| Requirement | ✅ Do | ❌ Don't |
|---|---|---|
| Full keyboard access | Every interactive element (menus, modals, carousels) operable via Tab/Enter/Space/arrow keys | Rely on hover/click-only interactions with no keyboard equivalent |
| Visible focus states | A clear visual outline or highlight on `:focus-visible` | `outline: none` with nothing replacing it |
| Alt text on all images | `image.alt` or `image_tag`'s `alt:` param; `alt=""` for decorative images | A missing `alt`, or `alt="image"` / `alt="photo"` placeholder text |
| Connected form labels | Unique `id` on every input, matching `<label for="...">` | A `placeholder` used as the only label |
| Valid HTML | Semantic, well-nested markup throughout | `<div>`-only markup with no semantic elements, or invalid nesting |
| Color contrast (see [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/)) | 4.5:1 body text, 3:1 large text (18pt+) / icons / borders | Light gray text on a white background that fails contrast ratios |
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

Sometimes you need to build a custom interactive widget that isn't a native HTML element, like a custom dropdown or a carousel. When you do, give it the right ARIA role, add `tabindex="0"` so keyboard users can reach it, and write key handlers for Enter, Space, and the arrow keys. Styling alone doesn't make something accessible, you have to add the keyboard behavior too.

## Test before you submit

Run an automated check (axe DevTools or Lighthouse) and a manual keyboard-only check on your product, collection, and home pages. Automated tools catch things like missing alt text and contrast failures. They can't catch a broken tab order or a keyboard trap, a spot where you get stuck and can't Tab your way back out. You have to test those yourself.

### A quick manual test script

1. Unplug your mouse (or just don't touch it).
2. Tab through the entire page, home to footer.
3. At every interactive element, ask yourself: can you see where focus is? Does Enter or Space activate it the way a click would?
4. Open any modal (cart drawer, search). Can you Tab out of it by accident, or does focus stay trapped inside until you close it?
5. Close the modal with Escape. Does focus return to the element that opened it?

If any answer is "no," that's a real accessibility bug, not an edge case.

## Best practices

- Use real semantic HTML elements (`<button>`, `<nav>`, `<label>`) before reaching for ARIA. A native element gives you correct keyboard behavior and screen reader support automatically, so you don't have to build it yourself.
- Test with your keyboard as part of your normal QA process (see [Manual QA Checklist](/quality-validation/manual-qa-checklist/)). Don't save it for one separate accessibility-only pass at the end.
- When you customize focus styles, test with `:focus-visible`. That way mouse users don't see a focus ring when they click, but keyboard users still see one.

## Common mistakes

- **Removing `outline: none` without adding a visible replacement.** This is the most common accessibility bug, and it usually happens when someone tries to "clean up" a default browser style.
- **Using a `<div>` or `<span>` with a click handler instead of a real `<button>`.** It looks the same visually, but it fails completely for keyboard and screen reader users.
- **Writing alt text that describes nothing useful** (`alt="image1.jpg"`, `alt="photo"`). This technically has an alt attribute, but it misses the point of the requirement.
- **Testing contrast only in light mode.** If your theme supports a dark color scheme, check contrast in every color scheme a merchant can pick, not just the default one. See [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/).

## Quick Reference

- 9 concrete, testable rules, see the checklist above.
- Contrast: 4.5:1 body text, 3:1 large text/icons/borders.
- Touch targets: 24×24px minimum.
- Test both automated (axe/Lighthouse) and manual (keyboard-only navigation, including modal focus trapping).

## Further Reading

- [Accessibility Deep Dive](/performance-and-accessibility/accessibility-deep-dive/), the process behind this checklist
- [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/), the full color-specific contrast rules and testing approach
- [Accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#12-accessibility) (shopify.dev)
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) (shopify.dev)
