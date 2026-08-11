---
title: Asset Organization & Performance
description: The rules shared across every media type — reserving space, hosting on Shopify's CDN, naming and pruning assets, and auditing for bloat over time.
---

**TL;DR:** The rules shared across every media type — reserving space, hosting on Shopify's CDN, naming and pruning assets, and auditing for bloat over time.

[Icon Management](/assets/icon-management/), [Responsive Images](/assets/responsive-images/), [Video Management](/assets/video-management/), and [3D & AR Media](/assets/3d-and-ar-media/) each cover one media type in depth. This page covers what's shared across all of them: the one performance rule that applies no matter the media type, how Shopify's CDN hosting actually works, and the organizational habits that keep a theme's asset footprint maintainable as it grows past its first few sections.

## The one rule that applies to every media type: reserve its space

Every media element needs its space reserved on the page *before* it actually loads. Do this with explicit `width`/`height` attributes (which `image_tag`, `video_tag`, and `model_viewer_tag` all provide by default) or an explicit `aspect-ratio` in your CSS. Skipping this step is the most common cause of layout shift, and both Lighthouse and Core Web Vitals penalize your score for it — no matter whether the media is an image, a video, or a 3D viewer.

```css
/* A reusable pattern for any media type */
.media-wrapper {
  aspect-ratio: var(--media-aspect-ratio, 16 / 9);
  overflow: hidden;
}
.media-wrapper > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

```liquid
<div class="media-wrapper" style="--media-aspect-ratio: {{ media.aspect_ratio }};">
  {{ media | image_url: width: 800 | image_tag }}
</div>
```

## A media-type decision table

| Media type | Liquid filter(s) | Biggest performance lever | Full guide |
|---|---|---|---|
| Icon | Inline SVG snippet | `currentColor` + `em` sizing, no extra asset request at all | [Icon Management](/assets/icon-management/) |
| Image | `image_url` + `image_tag` | Request close to actual rendered size; automatic lazy-loading below the fold | [Responsive Images](/assets/responsive-images/) |
| Video | `video_tag` / `external_video_tag` | Always a sized poster; adaptive HLS is automatic for Shopify-hosted video | [Video Management](/assets/video-management/) |
| 3D model | `model_viewer_tag` | `reveal: 'interaction'` by default, not `auto` | [3D & AR Media](/assets/3d-and-ar-media/) |

## Host assets on Shopify's own CDN, not a third party

Deliver as much as you can from the Shopify CDN rather than an external host. Using the same host for your theme's static assets avoids extra HTTP connections to a different domain and lets the browser prioritize resource delivery correctly. In a Shopify theme, this means putting static files (icons you ship as raster images, logos, background textures) in the theme's `assets/` folder, not linking out to an external image host or third-party CDN.

```liquid
{% comment %} A static, theme-shipped image (not a product/media image) {% endcomment %}
{{ 'brand-logo.svg' | asset_url | image_tag: alt: shop.name }}

{% comment %} asset_img_url is a shortcut for asset-folder IMAGES
   specifically, returning a pre-sized CDN version (default 'small',
   100x100) — useful for a static thumbnail you don't need full
   image_url/image_tag control over {% endcomment %}
{{ 'icon-placeholder.png' | asset_img_url: 'medium' }}
```

Product, variant, and collection images already live on Shopify's CDN automatically since they're uploaded through the Shopify admin — this rule mainly matters for the static files you commit directly into your theme's `assets/` folder.

## Preloading media deliberately, not by default

You can add up to two resource hints per template, using the [`preload_tag` filter](https://shopify.dev/docs/api/liquid/filters/preload_tag) or the `preload` keyword on `image_tag`. Reserve this for the one or two resources that are genuinely critical to the first paint, almost always your LCP candidate:

```liquid
{{ section.settings.hero_image | image_url: width: 1600 | image_tag: preload: true, loading: 'eager', fetchpriority: 'high' }}
```

See [Performance Strategy](/performance/performance-strategy/) for the fuller preload/prefetch/preconnect discussion — the same "use sparingly" rule that applies to CSS and JS resource hints applies here too.

## Naming and organizing assets so they scale

A theme's `assets/` folder and its icon `snippets/` grow continuously over a project's life. A few habits keep that growth navigable instead of turning into an unsorted pile:

| Asset type | Naming convention | Where it lives |
|---|---|---|
| Icon snippets | `icon-*.liquid` (kebab-case) | `snippets/` |
| Static images (logos, textures, placeholders) | Descriptive kebab-case, e.g. `brand-logo.svg`, `empty-cart-illustration.svg` | `assets/` |
| Product/variant/collection media | Managed by Shopify Admin, not committed to the theme | Shopify's own CDN |

See [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) for the theme-wide naming rules this table follows.

## Auditing for bloat as the theme matures

A theme's media footprint tends to grow in one direction, additively, unless someone deliberately prunes it. A few checks worth doing periodically, not just once at launch:

- **Grep for `render 'icon-`** across the codebase before deleting a section or feature, and remove any icon snippet nothing renders anymore in the same PR. See [Icon Management: keeping the icon set maintainable](/assets/icon-management/#keeping-the-icon-set-maintainable-as-it-grows) for the full habit.
- **Check `assets/` for orphaned static files** — an old hero background image or a logo variant from a since-reverted design change, still sitting in the folder and still shipping in every theme package even though nothing references it anymore.
- **Re-check `reveal: 'interaction'` and lazy-loading defaults after a redesign.** A section that moves from below the fold to above it (or vice versa) needs its loading behavior re-verified, not left on whatever default it happened to load with originally.
- **Run Lighthouse after adding any new media-heavy section**, not just at the pre-submission audit. A single unsized image or a missed `reveal: 'interaction'` default is a much smaller fix caught immediately than it is three sections later. See [Performance Strategy: phase by phase](/performance/performance-strategy/#a-performance-plan-phase-by-phase) for the full milestone-audit habit this applies to media specifically.

## Best practices

- Reserve space for every media element, using explicit dimensions or `aspect-ratio`, before it loads — no matter the media type.
- Host static theme assets on Shopify's own CDN via `assets/`, not an external host.
- Preload at most one or two resources per template, and only your genuine LCP candidate.
- Keep asset naming consistent (`icon-*` for icon snippets, descriptive kebab-case for static images) so the codebase stays navigable as it grows.
- Audit for unused icons, orphaned static assets, and stale loading defaults periodically, not only once at project launch.

## Common mistakes

- **Linking to an externally-hosted image, font, or texture** instead of committing it to `assets/` and serving it from Shopify's own CDN.
- **Preloading more than one or two resources per template**, which competes with the resource that actually matters for bandwidth.
- **Letting unused icon snippets and orphaned static assets accumulate** without ever being pruned.
- **Never re-checking a media element's loading defaults after a redesign moves it above or below the fold.**
- **Treating a media-heavy section's performance impact as something to check only at the pre-submission Lighthouse run**, instead of at the milestone it was actually added.

## Key takeaways
- Reserve space for every media type before it loads: explicit dimensions or `aspect-ratio`.
- Host static assets (`assets/` folder) on Shopify's own CDN; product/variant/collection media is already CDN-hosted via the Admin.
- `preload_tag` / `image_tag`'s `preload` param: at most one or two per template, reserved for the real LCP candidate.
- Consistent naming (`icon-*.liquid`, descriptive kebab-case for static files) keeps a growing asset footprint navigable.
- Audit for unused icons, orphaned assets, and stale loading defaults on a regular cadence, not just at launch.

## Further reading

- [Icon Management](/assets/icon-management/) · [Responsive Images](/assets/responsive-images/) · [Video Management](/assets/video-management/) · [3D & AR Media](/assets/3d-and-ar-media/)
- [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/): the theme-wide performance plan this page's media-specific rules plug into
- [Performance best practices for Shopify themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
- [`preload_tag`](https://shopify.dev/docs/api/liquid/filters/preload_tag) (shopify.dev)
