---
title: "Media Optimization: Images, Video & 3D"
description: Loading images, video, and 3D product media without any of them costing you the performance bar.
---

Every media type on a Shopify store — images, video, 3D models — is genuinely a `product.media` item with a `media_type`, but each needs different handling to load without hurting performance. This article covers all three, plus the general layout-shift discipline that applies across all of them.

## The one rule that applies to every media type: reserve its space

Every media element must have its rendered space reserved *before* it loads — via explicit `width`/`height` (which establishes an intrinsic aspect ratio the browser uses immediately) or an explicit `aspect-ratio` in CSS. Skipping this is the single most common cause of layout shift (a Lighthouse/Core Web Vitals penalty), regardless of whether the media is an image, video, or 3D viewer.

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

## Images

### Responsive, explicit-dimension images — the baseline pattern

```liquid
{{ product.featured_image | image_url: width: 800 | image_tag:
  loading: 'lazy',
  widths: '400, 800, 1200',
  sizes: '(min-width: 990px) 50vw, 100vw',
  alt: product.featured_image.alt
}}
```

`image_tag` generates the full `srcset`/`sizes`/`width`/`height` markup for you from a single call — prefer it over hand-assembling `<img>` attributes, which is easy to get subtly wrong (a missing `width`, a `srcset` that doesn't match the `sizes` you actually render at).

### Above the fold vs. below the fold

```liquid
{% comment %} Hero image — likely the LCP candidate: eager, high priority, no lazy loading {% endcomment %}
{{ section.settings.hero_image | image_url: width: 1600 | image_tag: loading: 'eager', fetchpriority: 'high' }}

{% comment %} A product card image far down a collection grid: lazy {% endcomment %}
{{ product.featured_image | image_url: width: 400 | image_tag: loading: 'lazy' }}
```

See [Performance Strategy](/performance-and-accessibility/performance-strategy/) for the fuller lazy-loading and preload discussion — the same above/below-the-fold split applies to every media type on this page, not just images.

### Format and quality

Shopify serves images through its CDN, which handles format negotiation (WebP/AVIF where supported) automatically when you request via `image_url` — you don't need to manually generate multiple formats. What you *do* control is requesting an appropriately sized image for its actual rendered size:

```liquid
{% comment %} ❌ WRONG — requesting a 2400px-wide image for a 300px-wide
   product card thumbnail. The CDN will serve exactly what you ask for {% endcomment %}
{{ product.featured_image | image_url: width: 2400 }}

{% comment %} ✅ RIGHT — request close to the actual largest rendered size,
   let srcset/sizes handle the range across viewports {% endcomment %}
{{ product.featured_image | image_url: width: 800 }}
```

## Video

### `video_tag` and why not to skip it

```liquid
{% for media in product.media %}
  {% if media.media_type == 'video' %}
    {{ media | video_tag: image_size: '800x', autoplay: false, controls: true, loop: false }}
  {% endif %}
{% endfor %}
```

`video_tag` automatically includes the HLS (`.m3u8`) source Shopify generates for uploaded MP4s alongside the MP4 fallback, which lets supporting browsers stream adaptively (starting playback faster, adjusting quality to the connection) instead of downloading the entire file before playing. Hand-writing a `<video>` tag from the media object's raw URL loses this adaptive source.

### Autoplay video: only muted, and only with a real reason

```html
<!-- ❌ WRONG — autoplaying video with sound is blocked by every major
   browser anyway, and even muted, autoplay should be a deliberate
   design decision, not a default -->
<video autoplay>

<!-- ✅ RIGHT — muted is required for autoplay to work in any browser;
   still ask whether autoplay is the right call for this specific
   video (a decorative background loop vs. a product demo a customer
   should choose to start) -->
<video autoplay muted loop playsinline>
```

### Poster images — always set one, and optimize it like any other image

```liquid
{{ media | video_tag: image_size: '800x' }}
{% comment %} the image_size param controls the poster frame's
   resolution — treat this the same as any other image (Step above):
   request close to actual rendered size, not the largest available {% endcomment %}
```

A video with no poster forces the browser to either show nothing until the video loads, or (worse) start downloading the video just to derive a first frame — set an explicit poster so something meaningful renders immediately.

### Never autoplay video above the fold without accounting for its LCP cost

An autoplaying hero video is visually appealing but can itself become (or delay) the LCP element if not handled carefully — set a poster image sized/optimized like a hero image (see Images section above), and be aware that the video file itself is a real download cost even if it isn't blocking paint.

## 3D models

```liquid
{% for media in product.media %}
  {% if media.media_type == 'model' %}
    {{ media | model_viewer_tag: image_size: '800x', reveal: 'interaction', toggleable: true }}
  {% endif %}
{% endfor %}
```

`model_viewer_tag` renders a `<model-viewer>` element (Google's model-viewer web component) with the model's `src`, `poster`, `alt`, and camera controls wired up automatically.

### 3D models are the heaviest media type — gate them deliberately

A 3D model file is typically far larger than an equivalent product image, and the `<model-viewer>` component itself has real JS/parsing cost. Two settings matter specifically for performance:

- **`reveal: 'interaction'`** — defers loading the actual model until the customer interacts with it (rather than `reveal: 'auto'`, which loads immediately). Use `interaction` as the default; only use `auto` when 3D is genuinely the primary content of that view (e.g. a dedicated 3D-first product template).
- **`poster`** — always provide one (an actual product image), so the space renders meaningfully before (or instead of, if the customer never interacts) the model loads.

```liquid
{% comment %} ❌ WRONG — every product's 3D model eagerly loads on the
   product page, whether or not the customer ever looks at it {% endcomment %}
{{ media | model_viewer_tag: image_size: '800x', reveal: 'auto' }}

{% comment %} ✅ RIGHT — the model loads only once a customer actually
   engages with it; everyone else pays only the (optimized) poster
   image's cost {% endcomment %}
{{ media | model_viewer_tag: image_size: '800x', reveal: 'interaction' }}
```

## A media-type decision table

| Media type | Liquid filter | Biggest performance lever |
|---|---|---|
| Image | `image_url` + `image_tag` | Request close to actual rendered size; lazy-load below the fold |
| Video | `video_tag` | Always set a sized poster; only autoplay muted, and only deliberately |
| 3D model | `model_viewer_tag` | `reveal: 'interaction'` by default, not `auto` |

## Best practices

- Reserve space for every media element (explicit dimensions or `aspect-ratio`) before it loads, regardless of type.
- Use Shopify's own `image_tag`/`video_tag`/`model_viewer_tag` filters rather than hand-assembling markup — they encode format/adaptive-streaming/dimension handling correctly by default.
- Default 3D models to `reveal: 'interaction'`; treat `reveal: 'auto'` as an exception that needs a specific reason.
- Request images sized close to their actual rendered dimensions, not the largest available.

## Common mistakes

- **Requesting a much larger image than what's actually rendered**, wasting bandwidth for no visual gain.
- **Hand-writing a `<video>` tag from a raw media URL** instead of `video_tag`, losing the adaptive HLS source Shopify generates automatically.
- **Loading 3D models eagerly (`reveal: 'auto'`) by default**, paying their heavy cost even for customers who never interact with them.
- **Omitting a poster image on video or 3D media**, leaving blank space or forcing an unnecessary early download just to show something.

## Quick Reference

- Reserve space for every media type before it loads — explicit dimensions or `aspect-ratio`.
- Images: `image_tag` with `srcset`/`sizes`, sized close to actual render size, lazy below the fold.
- Video: `video_tag` (gets adaptive HLS automatically), always a sized poster, autoplay only muted and deliberate.
- 3D: `model_viewer_tag`, default `reveal: 'interaction'`, always a poster.

## Further Reading

- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/) — the lazy-loading/preload discussion this builds on
- [Supporting product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media) — shopify.dev
- [`video_tag`](https://shopify.dev/docs/api/liquid/filters/video_tag) — shopify.dev
- [`model_viewer_tag`](https://shopify.dev/docs/api/liquid/filters/model_viewer_tag) — shopify.dev
