---
title: Performance Strategy & Critical Rendering Path
description: A performance plan and roadmap, critical CSS, lazy loading, and preload/prefetch/preconnect — applied to a Shopify theme.
---

[Performance & Lighthouse](/theme-store-requirements/performance/) sets the bar (60/90, averaged). This article is the plan for hitting it deliberately across a project, rather than discovering your score during a pre-submission scramble.

## A performance plan, phase by phase

Treat performance as a planned workstream with checkpoints, not a single pre-submission activity:

| Phase | When | What happens |
|---|---|---|
| **1. Budget-setting** | Project kickoff, before the first section is built | Agree on a JS/CSS budget per page type, and which fonts/third-party scripts (if any) are pre-approved — see [Third-Party Libraries](/style-guides/third-party-libraries/) |
| **2. Per-section discipline** | Every section, as it's built | Images shipped responsive with explicit dimensions; CSS/JS scoped via `{% stylesheet %}`/`{% javascript %}`; no new script added without checking its cost first |
| **3. Milestone audits** | After each major template is feature-complete (home, collection, product) | Run Lighthouse against real (not placeholder) content; fix regressions immediately, not in a batch later |
| **4. Pre-submission audit** | Before packaging | Full Lighthouse run against Shopify's benchmark dataset expectations, on every required page type, desktop + mobile |
| **5. Post-launch monitoring** | After the theme is live on merchant stores | Spot-check performance periodically — a merchant's real catalog (more products, heavier imagery) can reveal issues a demo store never surfaced |

Skipping straight to phase 4 is the single most common way a theme's performance work turns into a stressful last-minute scramble — the checks in phases 2–3 exist specifically to catch regressions while they're a one-section fix, not a whole-theme investigation.

## The critical rendering path, briefly

The browser can't paint anything until it's built the DOM and the CSSOM (parsed all render-blocking CSS/JS in `<head>`). Every millisecond spent on render-blocking resources before first paint is a millisecond the merchant's customer stares at a blank page. The whole performance strategy below is really one idea applied repeatedly: **get pixels on screen fast, then load everything else without blocking that.**

## Critical CSS: what actually matters and what doesn't

"Critical CSS" means the (small) set of styles needed to render whatever's visible without scrolling — everything else can load without blocking first paint.

```liquid
{% comment %} layout/theme.liquid — the pattern, not literal code %}
<head>
  ...
  {{ 'critical.css' | asset_url | stylesheet_tag }}   {# small, above-the-fold styles: layout shell, header, hero #}
</head>
```

In practice, for a Shopify theme, "critical CSS" mostly means: keep the global stylesheet lean, and rely on `{% stylesheet %}` scoping (see [CSS Style Guide](/style-guides/css/)) so a page only loads CSS for sections actually present on it — a product page doesn't pay for a "Testimonials" section's CSS if that section isn't used on that template. This colocation-based approach gets most of critical CSS's benefit without a separate build step to explicitly extract and inline a critical subset.

| ✅ Do | ❌ Avoid |
|---|---|
| Keep the global stylesheet to true cross-page basics (resets, tokens, header/footer) | Growing the global stylesheet to include every section's CSS "just in case" |
| Let `{% stylesheet %}` scoping naturally limit what loads per page | Manually maintaining a separate "critical.css" file that drifts out of sync with the real above-the-fold content |

## Preload, preconnect, and prefetch — used deliberately, not everywhere

These are promises to the browser — used correctly they save real time; used indiscriminately they compete with the resources that actually matter and can make performance *worse*.

| Hint | Use for | Liquid |
|---|---|---|
| `preconnect` | A third-party origin you'll definitely request from soon (e.g. a font host, a required analytics endpoint) | `<link rel="preconnect" href="https://fonts.shopifycdn.com">` |
| `preload` | A specific, critical resource for *this* page that would otherwise be discovered late (e.g. the hero image, a custom font file) | `{{ 'hero.woff2' \| asset_url \| preload_tag: as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }}` |
| `prefetch` | A resource likely needed on the *next* navigation, not this page (lower priority than preload) | Used sparingly in themes — most valuable for a highly predictable next step, like a product page's most-likely-clicked variant image |

```liquid
{% comment %} ✅ RIGHT — preload the actual LCP image (the largest
   above-the-fold image, usually the hero), since the browser would
   otherwise only discover it after parsing the HTML down to that point {% endcomment %}
{{ section.settings.hero_image | image_url: width: 1600 | preload_tag: as: 'image' }}
```

```liquid
{% comment %} ❌ WRONG — preloading every image on the page defeats
   the purpose; preload signals "this is urgent," and if everything
   is urgent, nothing is — the browser's bandwidth is still finite {% endcomment %}
{% for image in product.images %}
  {{ image | image_url: width: 800 | preload_tag: as: 'image' }}
{% endfor %}
```

A good rule of thumb: at most one, maybe two, `preload` hints per page — reserved for the actual Largest Contentful Paint (LCP) candidate, not every image that happens to be near the top.

## Lazy loading: below the fold, never above it

```html
<!-- ✅ RIGHT — the hero image (above the fold, likely the LCP
   candidate) loads eagerly; a testimonial image further down loads lazily -->
<img src="{{ section.settings.hero_image | image_url: width: 1600 }}" loading="eager" fetchpriority="high" width="1600" height="800" alt="...">
...
<img src="{{ block.settings.testimonial_image | image_url: width: 400 }}" loading="lazy" width="400" height="400" alt="...">
```

```html
<!-- ❌ WRONG — lazy-loading the hero image delays the LCP metric,
   directly hurting the Lighthouse performance score, since the
   browser now waits to even start fetching it until it's
   determined to be near the viewport -->
<img src="{{ section.settings.hero_image | image_url: width: 1600 }}" loading="lazy" ...>
```

`loading="lazy"` on above-the-fold content is one of the most common well-intentioned performance mistakes — lazy loading is for content the user hasn't scrolled to yet, not a blanket "make images faster" setting.

## Deferring and scoping JavaScript

```html
<!-- ❌ WRONG — blocks HTML parsing until the script downloads and executes -->
<script src="{{ 'global.js' | asset_url }}"></script>

<!-- ✅ RIGHT — module scripts are deferred by default, and don't
   block parsing -->
<script src="{{ 'global.js' | asset_url }}" type="module"></script>
```

Combine this with [`{% javascript %}` scoping](/style-guides/javascript-and-web-components/) so a page only ships JS for the components actually rendered on it.

## A performance roadmap for an existing, already-shipped theme

If you're improving an existing theme's performance rather than building fresh:

1. Run Lighthouse on the actual current templates, with real (or realistic) content, and record a baseline per page type.
2. Rank the findings by expected impact vs. effort — image optimization and removing/deferring unnecessary third-party scripts are almost always the highest-impact, lowest-effort fixes; a critical-CSS restructuring is usually higher effort for comparatively less gain if `{% stylesheet %}` scoping is already in reasonable shape.
3. Fix the highest-impact items first, and re-measure after each one — this confirms the fix actually worked and prevents wasted effort on something that turned out not to matter as much as predicted.
4. Once above threshold with comfortable margin (not just barely passing), fold ongoing performance checks into the per-section habit described in [Performance & Accessibility](/performance-and-accessibility/) rather than treating this as a one-time cleanup.

## Best practices

- Set a performance budget at project kickoff, not as a reactive measure after a failing Lighthouse score.
- Reserve `preload` for the actual LCP candidate — one or two hints per page, not a hint per resource.
- Never lazy-load above-the-fold content, especially the LCP candidate image.
- Run Lighthouse against realistic content at every major milestone, not just once before submission.

## Common mistakes

- **Lazy-loading the hero image**, directly delaying the LCP metric that Lighthouse's performance score depends on most.
- **Preloading everything**, which competes with the actual critical resource for bandwidth and defeats the purpose of preloading at all.
- **Discovering performance problems only at the pre-submission Lighthouse run**, when a per-milestone audit habit would have caught each regression while it was still a one-section fix.
- **Building a separate hand-maintained "critical.css" file** that drifts from the actual above-the-fold content, instead of relying on disciplined `{% stylesheet %}` scoping.

## Quick Reference

- Plan performance in phases: budget → per-section discipline → milestone audits → pre-submission audit → post-launch monitoring.
- Critical CSS in a Shopify theme mostly means disciplined `{% stylesheet %}` scoping plus a lean global stylesheet.
- `preload` the LCP candidate only (1–2 hints per page); `preconnect` for origins you'll definitely use; `prefetch` sparingly for predictable next-navigation resources.
- Never `loading="lazy"` above the fold; always lazy-load below it.
- Module scripts (`type="module"`) defer automatically — prefer them over blocking `<script>` tags.

## Further Reading

- [Performance & Lighthouse](/theme-store-requirements/performance/) — the compliance bar this strategy targets
- [Media Optimization](/performance-and-accessibility/media-optimization/) — the media-specific half of this same strategy
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) — shopify.dev
