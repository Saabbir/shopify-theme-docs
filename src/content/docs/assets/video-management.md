---
title: Video Management
description: video_tag and external_video_tag, adaptive HLS streaming, autoplay rules, poster images, and responsive video containers.
---

Shopify handles two different kinds of product video: video files a merchant uploads directly (`media_type == 'video'`), and externally-hosted YouTube or Vimeo videos a merchant links (`media_type == 'external_video'`). Each has its own Liquid filter, and treating them the same way loses real functionality. Facts on this page are verified directly against [shopify.dev's `video_tag` filter reference](https://shopify.dev/docs/api/liquid/filters/video_tag) and [Support product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media).

## `video_tag` for Shopify-hosted video

```liquid
{% for media in product.media %}
  {% if media.media_type == 'video' %}
    {{ media | video_tag: image_size: '800x', controls: true }}
  {% endif %}
{% endfor %}
```

**Always use `video_tag`, never a hand-written `<video>` tag from the media object's raw URL.** When a merchant uploads an MP4, Shopify automatically generates an `.m3u8` file alongside it. That file enables HTTP Live Streaming (HLS): the video player adapts quality to the visitor's connection speed and can start playing sooner, instead of waiting for the whole file to download. `video_tag` includes this HLS source automatically, with the MP4 as a fallback for players that don't support it. Writing your own `<video>` tag from `media.sources` loses this adaptive behavior entirely.

One exception: **if `loop` is enabled, the HLS source is dropped** and the player falls back to progressive MP4 download instead, so the video can be cached and looped smoothly.

## `external_video_tag` for YouTube and Vimeo

```liquid
{% for media in product.media %}
  {% if media.media_type == 'external_video' %}
    {{ media | external_video_tag }}
  {% endif %}
{% endfor %}
```

An externally-hosted video renders as an `<iframe>`, which is **not responsive by default**. Unlike a Shopify-hosted `<video>` element, an `<iframe>` needs an aspect-ratio container wrapped around it explicitly (see the shared pattern below) — it won't size itself to its content the way an HTML5 video player does once loaded.

## Lazy loading: the same smart default as images

**If you don't pass a `loading` attribute yourself, `video_tag` already defaults to `lazy` for videos in sections further down the page**, based on `section.index`/`section.location` — the same mechanism `image_tag` uses. You generally don't need to set this by hand for below-the-fold video. Override it explicitly only when the default doesn't match your layout, or for an above-the-fold video you specifically want to load eagerly.

## Autoplay: only muted, and only with a real reason

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

```liquid
{{ media | video_tag: autoplay: true, loop: true, muted: true, controls: true }}
```

Every HTML5 video attribute (`autoplay`, `loop`, `muted`, `controls`, `loading`) is `false` by default and available as a `video_tag` parameter. Set only what a specific video actually needs — a decorative background loop and a product demo the customer chooses to start have different correct defaults.

## Poster images — always set one

```liquid
{{ media | video_tag: image_size: '800x' }}
{% comment %} the image_size param controls the poster frame's
   resolution — treat this the same as any other image (see
   Responsive Images): request close to actual rendered size,
   not the largest available {% endcomment %}
```

A video with no poster image, the still picture a browser shows before you press play, leaves the browser with two bad choices. It can show a blank space until the video loads, or, worse, it has to download the whole video just to grab a first frame to display. Always set an explicit poster image, sized like any other image (see [Responsive Images](/assets/responsive-images/)), so your visitor sees something useful right away.

## Responsive containers: the aspect-ratio box

Shopify-hosted `<video>` elements are responsive by default, but only once they've actually rendered. Externally-hosted `<iframe>` embeds aren't responsive at all. In both cases, wrap the media in an aspect-ratio container so its space is reserved before it loads:

```css
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
  {{ media | video_tag: image_size: '800x' }}
</div>
```

This reserves the video's space on the page before it loads, preventing the layout shift that both Lighthouse and Core Web Vitals penalize.

## Never autoplay a hero video without accounting for its LCP cost

An autoplaying hero video looks great, but it can become the page's Largest Contentful Paint element itself, or delay it, if you're not careful. Set a poster image that's sized and optimized just like any other hero image, and remember that the video file itself still costs real download time, even once it isn't blocking the page's very first paint.

## Multiple videos on one page: only one plays at a time

A product can have multiple videos. If your theme shows a thumbnail view for each media element, or displays several at once (a carousel, for example), make sure only the currently active video is actually playing. A background video that keeps playing in a hidden carousel slide wastes bandwidth and CPU for no visible benefit.

## Best practices

- Use `video_tag` for Shopify-hosted video and `external_video_tag` for YouTube/Vimeo — never a hand-written `<video>`/`<iframe>` from the raw media URL.
- Always set a sized poster image, following the same sizing discipline as [Responsive Images](/assets/responsive-images/).
- Autoplay only muted, and only when there's a deliberate reason (a decorative loop, not a default).
- Wrap every video, Shopify-hosted or external, in an aspect-ratio container to prevent layout shift.
- Pause every video except the one actually visible/active when multiple videos exist on one page.

## Common mistakes

- **Hand-writing a `<video>` tag from a raw media URL** instead of `video_tag`, losing the adaptive HLS source Shopify generates automatically.
- **Autoplaying an unmuted video** — browsers block this outright, so it silently fails to autoplay at all.
- **Omitting a poster image**, leaving blank space or forcing an unnecessary early download just to show something.
- **Not wrapping an external (`iframe`-based) video in an aspect-ratio container**, since it isn't responsive by default the way a Shopify-hosted video is.
- **Letting a background video keep playing in an inactive carousel slide.**

## Quick Reference

- `video_tag` for Shopify-hosted video (gets adaptive HLS automatically, unless `loop` is set); `external_video_tag` for YouTube/Vimeo.
- Lazy-loading defaults to `lazy` below the fold automatically — override only when needed.
- Autoplay only muted, only deliberately; every HTML5 video attribute is available as a parameter.
- Always a sized poster image; always an aspect-ratio container.
- Only the active video plays when multiple are present on a page.

## Further Reading

- [Responsive Images](/assets/responsive-images/): the same sizing discipline applied to poster images
- [3D & AR Media](/assets/3d-and-ar-media/): the same aspect-ratio-container pattern applied to 3D product media
- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/): the lazy-loading and preload discussion this builds on
- [`video_tag`](https://shopify.dev/docs/api/liquid/filters/video_tag) (shopify.dev)
- [Support product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media) (shopify.dev)
