---
title: Performance & Lighthouse
description: The exact Lighthouse thresholds Shopify enforces, and how to hit them.
---

## The numbers

Shopify runs Lighthouse against your product, collection, and home page, on both desktop and mobile, using a benchmark dataset (real content, not empty sections). You need:

| Metric | Minimum score |
|---|---|
| Performance | 60 (average across all pages/devices) |
| Accessibility | 90 (average across all pages/devices) |

These are averages, so one weak page can be pulled up by strong ones — but don't rely on that. Treat 60/90 as the floor, not the target.

## Practical ways to hit these numbers

| ✅ Do | ❌ Avoid |
|---|---|
| Serve responsive images via `srcset` with a real width/height and `loading="lazy"` for below-the-fold images | Shipping one large fixed-size image and letting the browser scale it down with CSS |
| Scope CSS/JS per section with `{% stylesheet %}`/`{% javascript %}` tags | One giant `theme.css`/`theme.js` bundle loaded on every page regardless of what's used |
| Use the theme's `font_picker` setting for typography | Loading an extra custom web font via `@import` or a third-party CDN link |
| Reach for a native browser API (`<dialog>`, `IntersectionObserver`, CSS `:has()`) | Installing a JS library for something the platform already does natively |
| Defer non-critical JavaScript | Blocking render with synchronous `<script>` tags in `<head>` |

## Where performance actually gets lost

- **Images** are the single biggest lever. A product page with 8 unoptimized hero images will fail Lighthouse before anything else matters.
- **Third-party scripts** compound quickly — each one adds parse/execution time and often a network round trip. Every extra script is a cost that has to be justified (see [Technology Stack rules](/codebase-structure/) conventions in `.cursor/rules`).
- **Render-blocking CSS** in the `<head>` delays first paint. Critical, above-the-fold styles should load first; everything else can be deferred or scoped to the section that needs it.
- **Unnecessary JavaScript frameworks.** A framework's hydration cost is a fixed performance tax paid on every page load, for functionality vanilla JS could deliver without it.

### A concrete example: a responsive image, done right vs. wrong

```html
<!-- ❌ WRONG: fixed size, no lazy loading, no responsive sizing -->
<img src="{{ product.featured_image | image_url: width: 1800 }}" alt="{{ product.title }}">

<!-- ✅ RIGHT: responsive, lazy where appropriate, explicit dimensions to avoid layout shift -->
<img
  src="{{ product.featured_image | image_url: width: 800 }}"
  srcset="
    {{ product.featured_image | image_url: width: 400 }} 400w,
    {{ product.featured_image | image_url: width: 800 }} 800w,
    {{ product.featured_image | image_url: width: 1200 }} 1200w
  "
  sizes="(min-width: 990px) 50vw, 100vw"
  width="800"
  height="{{ 800 | divided_by: product.featured_image.aspect_ratio }}"
  alt="{{ product.featured_image.alt | escape }}"
  loading="lazy"
>
```

The explicit `width`/`height` matters as much as the lazy loading — without them, the browser doesn't know how much space to reserve, causing layout shift (a Lighthouse penalty) as the image loads in.

## Test before you submit

Run a Lighthouse audit against Shopify's benchmark dataset before submitting — don't find out your score during review. See [Manual QA Checklist](/quality-validation/manual-qa-checklist/) for how this fits into your pre-submission routine.

## Best practices

- Run Lighthouse locally after every non-trivial section addition, not just once before submission — regressions are far cheaper to find one section at a time.
- Budget your JavaScript like a spending limit: before adding a script, ask what it costs in load time and whether ~50 lines of vanilla JS could do the same job.
- Treat 60/90 as a floor to clear comfortably, not a target to just barely hit — a theme that scores 62/90 on your dev store may drop below threshold on a merchant's real (larger) catalog.

## Common mistakes

- **Testing performance only against your own lightweight demo store data**, then discovering a real merchant's larger product catalog or heavier imagery drops the score below threshold.
- **Adding "just one more" third-party script repeatedly** until the cumulative cost quietly pushes performance below 60.
- **Forgetting `width`/`height` on images**, causing layout shift that Lighthouse penalizes even when the image itself loads quickly.
- **Not re-testing after a late design change.** A last-minute hero video or carousel addition is a common way a passing score becomes a failing one right before submission.

## Quick Reference

- Performance ≥ 60, Accessibility ≥ 90, averaged across product/collection/home, desktop + mobile.
- Sections must have real content when tested — empty sections don't count.
- Responsive images with explicit `width`/`height` are the single biggest performance lever.
- Test against the benchmark dataset before you submit, not after rejection.

## Further Reading

- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/) — a full plan and roadmap for hitting this bar deliberately
- [Media Optimization: Images, Video & 3D](/performance-and-accessibility/media-optimization/) — the media-specific half of that strategy
- [Lighthouse performance and accessibility requirements](https://shopify.dev/docs/storefronts/themes/store/requirements#6-lighthouse-performance-and-accessibility) — shopify.dev
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) — shopify.dev
