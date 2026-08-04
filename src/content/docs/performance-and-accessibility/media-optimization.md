---
title: "Media Optimization: Images, Video & 3D"
description: How to load images, video, and 3D product media without hurting your performance score.
---

Every media type on a Shopify store, images, video, and 3D models, is a `product.media` item with a `media_type`. But each type needs its own handling so it doesn't slow your site down. This article walks through all three, plus one shared rule about layout shift (when content jumps around on the page as it loads) that applies to every one of them.

## The one rule that applies to every media type: reserve its space

Every media element needs its space reserved on the page *before* it actually loads. Picture a waiting room with reserved seats: everyone knows exactly where to sit even before they arrive, so nobody has to shuffle around later. You do this with explicit `width` and `height` attributes, which tell the browser the image's aspect ratio (the ratio between its width and height) right away, or with an explicit `aspect-ratio` value in your CSS. Skipping this step is the most common cause of layout shift, and both Lighthouse and Core Web Vitals (Google's tools for measuring how a page feels to use) penalize your score for it. The rule applies no matter whether the media is an image, a video, or a 3D viewer.

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

### The baseline pattern: responsive images with explicit dimensions

```liquid
{{ product.featured_image | image_url: width: 800 | image_tag:
  loading: 'lazy',
  widths: '400, 800, 1200',
  sizes: '(min-width: 990px) 50vw, 100vw',
  alt: product.featured_image.alt
}}
```

`image_tag` is a Liquid filter that writes the full `srcset`, `sizes`, `width`, and `height` markup for you, all from one simple call. (`srcset` is a list of different image sizes the browser can choose from, so it picks the right one for each screen.) Use `image_tag` instead of writing `<img>` attributes by hand. It's easy to get small details wrong when you write them yourself, like forgetting a `width` value or writing a `srcset` that doesn't match the size you actually show the image at.

### Above the fold vs. below the fold

```liquid
{% comment %} Hero image — likely the LCP candidate: eager, high priority, no lazy loading {% endcomment %}
{{ section.settings.hero_image | image_url: width: 1600 | image_tag: loading: 'eager', fetchpriority: 'high' }}

{% comment %} A product card image far down a collection grid: lazy {% endcomment %}
{{ product.featured_image | image_url: width: 400 | image_tag: loading: 'lazy' }}
```

See [Performance Strategy](/performance-and-accessibility/performance-strategy/) for the full explanation of lazy loading and preloading. The same idea, above the fold versus below the fold, applies to every media type on this page, not just images. ("Above the fold" means the part of the page a visitor sees right away, without scrolling. "Below the fold" is everything they only see once they scroll down.)

### Format and quality

Shopify serves images through its CDN, short for content delivery network. This is a network of servers around the world that stores and delivers your images quickly, wherever your visitor happens to be. The CDN automatically picks the best image format for the visitor's browser, using WebP or AVIF (two modern, smaller image formats) whenever the browser supports them. That means you don't need to generate multiple formats yourself. What you *do* need to control is requesting an image sized to match how big it actually appears on the page:

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

`video_tag` automatically includes the HLS (`.m3u8`) source that Shopify generates for every MP4 you upload, alongside a plain MP4 fallback for browsers that need it. HLS stands for HTTP Live Streaming. Think of it as a video player that adjusts quality on the fly: browsers that support HLS can start playing sooner and adjust quality to match the viewer's internet connection, instead of waiting to download the whole file first. If you write a `<video>` tag by hand using the media object's raw URL, you lose this adaptive streaming, and your visitors get a slower experience.

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

A video with no poster image, the still picture a browser shows before you press play, leaves the browser with two bad choices. It can show a blank space until the video loads, or, worse, it has to download the whole video just to grab a first frame to display. Always set an explicit poster image, so your visitor sees something useful right away.

### Never autoplay video above the fold without accounting for its LCP cost

An autoplaying hero video (a large video at the top of a page) looks great, but be careful with it. It can become the page's LCP element itself, or delay it, if you're not careful. LCP stands for Largest Contentful Paint. It's a Core Web Vitals metric that measures how long it takes the biggest visible thing on the page to finish loading. To keep this fast, set a poster image that's sized and optimized just like any other hero image (see the Images section above). And remember that the video file itself still costs real download time, even if it isn't blocking the page's very first paint.

## 3D models

```liquid
{% for media in product.media %}
  {% if media.media_type == 'model' %}
    {{ media | model_viewer_tag: image_size: '800x', reveal: 'interaction', toggleable: true }}
  {% endif %}
{% endfor %}
```

`model_viewer_tag` renders a `<model-viewer>` element. This is Google's model-viewer web component (a reusable, ready-made piece of a webpage), and it comes with the model's `src`, `poster`, `alt`, and camera controls already set up for you.

### 3D models are the heaviest media type — gate them deliberately

A 3D model file is usually much bigger than an equivalent product image, and the `<model-viewer>` component itself takes real time to load and parse (parsing means the browser reads the file and turns it into something it can display). Two settings matter most for performance:

- **`reveal: 'interaction'`**: this setting waits to load the actual 3D model until the customer clicks or interacts with it, instead of `reveal: 'auto'`, which loads the model right away. Use `interaction` as your default choice. Only switch to `auto` when the 3D model really is the main point of that page, like a dedicated 3D-first product template.
- **`poster`**: always provide one, using a real product image. That way something meaningful shows up before the model loads, or instead of it, if the customer never interacts with it at all.

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

- Reserve space for every media element, using explicit dimensions or `aspect-ratio`, before it loads. This applies no matter the media type.
- Use Shopify's own `image_tag`, `video_tag`, and `model_viewer_tag` filters instead of writing markup by hand. They handle formats, adaptive streaming, and dimensions correctly by default.
- Default 3D models to `reveal: 'interaction'`. Treat `reveal: 'auto'` as an exception that needs a specific reason.
- Request images sized close to their actual rendered dimensions, not the largest available.

## Common mistakes

- **Requesting a much larger image than what's actually rendered**, wasting bandwidth for no visual gain.
- **Hand-writing a `<video>` tag from a raw media URL** instead of `video_tag`, losing the adaptive HLS source Shopify generates automatically.
- **Loading 3D models eagerly (`reveal: 'auto'`) by default**, paying their heavy cost even for customers who never interact with them.
- **Omitting a poster image on video or 3D media**, leaving blank space or forcing an unnecessary early download just to show something.

## Quick Reference

- Reserve space for every media type before it loads: explicit dimensions or `aspect-ratio`.
- Images: `image_tag` with `srcset`/`sizes`, sized close to actual render size, lazy below the fold.
- Video: `video_tag` (gets adaptive HLS automatically), always a sized poster, autoplay only muted and deliberate.
- 3D: `model_viewer_tag`, default `reveal: 'interaction'`, always a poster.

## Further Reading

- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/): the lazy-loading and preload discussion this builds on
- [Supporting product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media) (shopify.dev)
- [`video_tag`](https://shopify.dev/docs/api/liquid/filters/video_tag) (shopify.dev)
- [`model_viewer_tag`](https://shopify.dev/docs/api/liquid/filters/model_viewer_tag) (shopify.dev)
