---
title: Performance Strategy & Critical Rendering Path
description: A performance plan for a Shopify theme, covering critical CSS, lazy loading, and preload, prefetch, and preconnect.
---

**TL;DR:** A performance plan for a Shopify theme, covering critical CSS, lazy loading, and preload, prefetch, and preconnect.

The [Performance & Lighthouse](/theme-store-requirements/performance/) page sets the bar: a score of 60 out of 90, averaged across your pages. This article gives you a plan for hitting that score on purpose, all through the project, instead of finding out your score during a stressful, last-minute scramble right before you submit.

## A performance plan, phase by phase

Treat performance as an ongoing part of the project, with checkpoints along the way. Don't treat it as something you only think about once, right before submission:

| Phase | When | What happens |
|---|---|---|
| **1. Budget-setting** | Project kickoff, before the first section is built | Agree on a JS/CSS budget per page type, and which fonts/third-party scripts (if any) are pre-approved, see [Third-Party Libraries](/style-guides/third-party-libraries/) |
| **2. Per-section discipline** | Every section, as it's built | Images shipped responsive with explicit dimensions; CSS/JS scoped via `{% stylesheet %}`/`{% javascript %}`; no new script added without checking its cost first |
| **3. Milestone audits** | After each major template is feature-complete (home, collection, product) | Run Lighthouse against real (not placeholder) content; fix regressions immediately, not in a batch later |
| **4. Pre-submission audit** | Before packaging | Full Lighthouse run against Shopify's benchmark dataset expectations, on every required page type, desktop + mobile |
| **5. Post-launch monitoring** | After the theme is live on merchant stores | Spot-check performance periodically. A merchant's real catalog (more products, heavier imagery) can reveal issues a demo store never surfaced |

Skipping straight to phase 4 is the most common way performance work turns into a stressful, last-minute scramble. Phases 2 and 3 exist to catch problems early, while they're still a quick fix for one section, not a full investigation across your whole theme.

## The critical rendering path, briefly

The browser can't draw anything on screen until it builds the DOM and the CSSOM. Building both means the browser has to first parse all the render-blocking CSS and JavaScript sitting in your `<head>`. Every extra millisecond spent on these render-blocking resources before the first paint is a millisecond your customer spends staring at a blank page. Everything in this article really comes down to one idea, applied over and over: **get something on screen fast, then load everything else without blocking that.**

## Critical CSS: what actually matters and what doesn't

"Critical CSS" means the small set of styles needed to show whatever's visible on screen without scrolling. Everything else can load later, without blocking that first paint.

```liquid
{% comment %} layout/theme.liquid — the pattern, not literal code %}
<head>
  ...
  {{ 'critical.css' | asset_url | stylesheet_tag }}   {# small, above-the-fold styles: layout shell, header, hero #}
</head>
```

In practice, for a Shopify theme, "critical CSS" mostly comes down to two simple things. First, keep your global stylesheet small. Second, use `{% stylesheet %}` scoping (see [CSS in Shopify](/css/css-in-shopify/) and [CSS Performance](/css/css-performance/)) so each page only loads CSS for the sections actually on it. For example, a product page shouldn't load CSS for a "Testimonials" section if that section never appears on that template. This approach, keeping each section's CSS together with the section itself, gets you most of the benefit of critical CSS without needing a separate build step to pull out and inline a critical subset.

| ✅ Do | ❌ Avoid |
|---|---|
| Keep the global stylesheet to true cross-page basics (resets, tokens, header/footer) | Growing the global stylesheet to include every section's CSS "just in case" |
| Let `{% stylesheet %}` scoping naturally limit what loads per page | Manually maintaining a separate "critical.css" file that drifts out of sync with the real above-the-fold content |

## Preload, preconnect, and prefetch — used deliberately, not everywhere

These three are hints you give the browser about what to fetch soon. Used correctly, they save real time. Used too often, they compete with the resources that actually matter, and they can end up making performance *worse* instead of better.

| Hint | Use for | Liquid |
|---|---|---|
| `preconnect` | A third-party origin you'll definitely request from soon (e.g. a font host, a required analytics endpoint) | `<link rel="preconnect" href="https://fonts.shopifycdn.com">` |
| `preload` | A specific, critical resource for *this* page that would otherwise be discovered late (e.g. the hero image, a custom font file) | `{{ 'hero.woff2' \| asset_url \| preload_tag: as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }}` |
| `prefetch` | A resource likely needed on the *next* navigation, not this page (lower priority than preload) | Used sparingly in themes. Most valuable for a highly predictable next step, like a product page's most-likely-clicked variant image |

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

A good rule of thumb: use at most one or two `preload` hints per page. Save them for the actual Largest Contentful Paint (LCP) candidate, meaning the single biggest visible element on the page, not just any image that happens to sit near the top.

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

Using `loading="lazy"` on above-the-fold content is one of the most common well-meaning performance mistakes. Lazy loading is meant for content the user hasn't scrolled to yet. It's not a blanket "make every image faster" switch, and using it on the wrong content actually slows your page down.

## Deferring and scoping JavaScript

This now has its own dedicated page: see [JavaScript Performance](/javascript/javascript-performance/) for module-script deferring, `{% javascript %}` scoping, layout thrashing, and memory-leak prevention across theme editor sessions.

## A performance roadmap for an existing, already-shipped theme

If you're improving the performance of a theme that already exists, instead of building one from scratch, follow these steps:

1. Run Lighthouse on your current templates, using real (or realistic) content, and write down a baseline score for each page type.
2. Rank what you find by expected impact versus effort. Optimizing images and removing or deferring unnecessary third-party scripts are almost always your highest-impact, lowest-effort fixes. Restructuring your critical CSS is usually more effort for less gain, especially if your `{% stylesheet %}` scoping is already in reasonable shape.
3. Fix the highest-impact items first, and re-measure your score after each one. This confirms the fix actually worked, and it stops you from wasting effort on something that mattered less than you thought.
4. Once you're comfortably above the threshold, not just barely passing, make ongoing performance checks part of your per-section habit, as described in [Performance](/performance/). Don't treat this as a one-time cleanup.

## Best practices

- Set a performance budget at project kickoff, not as a reaction after a failing Lighthouse score.
- Reserve `preload` for the actual LCP candidate: one or two hints per page, not a hint per resource.
- Never lazy-load above-the-fold content, especially the LCP candidate image.
- Run Lighthouse against realistic content at every major milestone, not just once before submission.

## Common mistakes

- **Lazy-loading the hero image**, directly delaying the LCP metric that Lighthouse's performance score depends on most.
- **Preloading everything**, which competes with the resource that actually matters for bandwidth and defeats the whole purpose of preloading.
- **Discovering performance problems only at the pre-submission Lighthouse run**, when a per-milestone audit habit would have caught each regression while it was still a one-section fix.
- **Building a separate hand-maintained "critical.css" file** that drifts from the actual above-the-fold content, instead of relying on disciplined `{% stylesheet %}` scoping.

## Key Takeaways
- Plan performance in phases: budget → per-section discipline → milestone audits → pre-submission audit → post-launch monitoring.
- Critical CSS in a Shopify theme mostly means disciplined `{% stylesheet %}` scoping plus a lean global stylesheet.
- `preload` the LCP candidate only (1–2 hints per page); `preconnect` for origins you'll definitely use; `prefetch` sparingly for predictable next-navigation resources.
- Never `loading="lazy"` above the fold; always lazy-load below it.
- Module scripts (`type="module"`) defer automatically. Prefer them over blocking `<script>` tags.

## Further Reading

- [Performance & Lighthouse](/theme-store-requirements/performance/): the compliance bar this strategy targets
- [Assets Management](/assets/): the media-specific half of this same strategy — images, video, and 3D/AR
- [JavaScript Performance](/javascript/javascript-performance/): the JS-specific half of this same strategy
- [CSS Performance](/css/css-performance/): the CSS-specific half of this same strategy
- [Performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
