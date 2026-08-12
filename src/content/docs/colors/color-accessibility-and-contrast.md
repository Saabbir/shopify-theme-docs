---
title: Color Accessibility & Contrast
description: WCAG 2.1 AA contrast ratios, testing every color scheme a merchant can pick, and the common ways color accessibility breaks.
---

**TL;DR:** WCAG 2.1 AA contrast ratios, testing every color scheme a merchant can pick, and the common ways color accessibility breaks.

Color choices are one of the few places in a theme where "it looks fine to me" isn't good enough evidence. Contrast is a hard number, not a judgment call, and it's one of the nine checkable items in Shopify's [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/) requirements. This page is the color-specific half of that broader accessibility bar. For the other eight items, keyboard access, alt text, focus order, and so on, see that page and [Accessibility Deep Dive](/accessibility/accessibility-deep-dive/).

## The actual contrast ratios required

| Content | Minimum ratio |
|---|---|
| Body text | 4.5:1 |
| Large text (18pt+, or 14pt+ bold) | 3:1 |
| Icons and meaningful graphics | 3:1 |
| UI component borders (input borders, button borders) | 3:1 |

These come from WCAG 2.1 AA, the same standard Shopify's Theme Store review checks against. A pairing either meets the ratio or it doesn't, there's no partial credit for "close enough" or "looks readable to me."

## Test contrast against every color scheme, not just the default

This is the single most common way color contrast fails in a real theme project. A text/background pairing that passes comfortably in your default `color_scheme_group` scheme (see [Color Schemes](/colors/color-schemes/)) can easily fail in a second or third scheme, especially a dark one, if that scheme wasn't designed with contrast as a hard constraint from the start.

```
❌ Checking contrast once, on "Scheme 1," and assuming every other
   scheme a merchant can create is fine too
✅ Checking contrast on every scheme shipped in settings_data.json,
   and re-checking whenever a scheme's colors change
```

Because a `color_scheme_group`'s `definition` pairs roles like `background`/`text` and `primary`/`primary_text` (see [Color Schemes](/colors/color-schemes/#defining-the-group)), every scheme built from that shape has an obvious pairing to test. Test each one.

## Tools for measuring contrast

| Tool | Good for |
|---|---|
| Browser DevTools color picker (Chrome, Firefox) | Quick one-off check while inspecting an element |
| axe DevTools / Lighthouse | Automated contrast checks across a whole page, catches most failures without manual work |
| WebAIM Contrast Checker | Manually testing a specific hex pairing before it even makes it into the theme |

Automated tools (axe, Lighthouse) catch contrast failures reliably and belong in CI, see [CI Automation](/github-workflow/ci-automation/). They check what's rendered on the page against its actual background, which also means they naturally catch a scheme you forgot to test manually, as long as that scheme actually gets rendered somewhere in your test pass.

## Using `color_brightness` for light/dark text decisions, not contrast verification

Liquid's `color_brightness` filter (see [Color in Liquid & CSS](/colors/color-in-liquid-and-css/#using-color_brightness-for-contrast-decisions)) returns a 0–255 value, useful for deciding at render time whether text on a merchant-chosen background should default to light or dark:

```liquid
{% assign brightness = settings.color_background | color_brightness %}
{% if brightness > 125 %}
  {% assign text_color = '#000000' %}
{% else %}
  {% assign text_color = '#ffffff' %}
{% endif %}
```

Treat this as a runtime fallback for picking between two known-good text colors, not as proof that a specific pairing meets 4.5:1. Verify the actual ratio with a contrast checker during development, especially for any pairing a merchant can't change (your own UI chrome, badges, borders).

## Focus states need contrast too

A visible focus outline (see [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/#focus-states)) is only useful if it's actually visible against whatever background it lands on. A focus ring color that's fine against a light scheme's background can disappear entirely against a dark scheme's background:

```css
/* ❌ WRONG — a fixed focus color that may vanish on a dark scheme */
button:focus-visible { outline: 2px solid #1a73e8; }

/* ✅ RIGHT — a focus color derived per-scheme, so it always has
   3:1 contrast against that scheme's own background */
button:focus-visible { outline: 2px solid var(--color-focus); }
```

```css
.color-scheme-1 { --color-focus: #1a73e8; }
.color-scheme-2 { --color-focus: #8ab4f8; } /* lighter, for the dark scheme */
```

## Where the Theme Store's paired-color rule fits in

[Color Schemes](/colors/color-schemes/#the-theme-stores-minimum-color-settings-rule) covers the Theme Store review rule that every background color setting needs a paired text/foreground color setting. That rule exists specifically to make contrast checking possible in the first place. Without a defined pairing, there's no way to know which two colors are even meant to sit on top of each other.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Test contrast against every color scheme a merchant can select, not just the default. Re-test whenever a scheme's colors change. | **Testing contrast once, on the default scheme, and assuming every other scheme is fine.** This is the most common color accessibility bug in themes that support multiple schemes. |
| Run automated contrast checks (axe/Lighthouse) in CI, and do a manual spot-check with a contrast tool for any pairing CI doesn't render. | **Hardcoding one focus outline color** that works on a light scheme but disappears against a dark one. |
| Derive focus outline colors per color scheme, so a focus ring stays visible against every background a merchant can choose. | **Treating `color_brightness`'s 0–255 output as a WCAG contrast ratio.** It's a different number, measuring a different thing. |
| Verify actual contrast ratios with a real contrast checker. Don't treat `color_brightness` as proof a pairing passes. | **Shipping a background color setting with no paired text color setting**, which makes contrast impossible to check or guarantee. See [Color Schemes](/colors/color-schemes/#the-theme-stores-minimum-color-settings-rule). |

## Key takeaways
- 4.5:1 for body text, 3:1 for large text (18pt+/14pt+ bold), icons, and UI borders.
- Test every color scheme a merchant can pick, not just the default.
- Automate what you can (axe/Lighthouse in CI), manually verify the rest with a contrast checker.
- Derive focus outline colors per scheme so they stay visible everywhere.
- `color_brightness` picks between light/dark text at render time. It doesn't verify a WCAG ratio.

## Further reading

- [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/): the full nine-item checklist this page's contrast rules belong to
- [Accessibility Deep Dive](/accessibility/accessibility-deep-dive/): the process for keeping accessibility (including contrast) correct across a whole theme project
- [Color Schemes](/colors/color-schemes/): the paired background/text roles this page's testing approach relies on
- [Color in Liquid & CSS](/colors/color-in-liquid-and-css/): `color_brightness` and other filters referenced above
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) (shopify.dev)
