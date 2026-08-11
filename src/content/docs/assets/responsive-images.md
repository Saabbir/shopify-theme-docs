---
title: Responsive Images
description: image_url and image_tag in full — sizing, cropping, format selection, srcset/sizes, focal points, and above/below-the-fold handling.
---

**TL;DR:** image_url and image_tag in full — sizing, cropping, format selection, srcset/sizes, focal points, and above/below-the-fold handling.

Every image in this theme should go through Shopify's own `image_url` and `image_tag` filters, not a hand-written `<img>` tag. These two filters handle resizing, format selection, and responsive markup correctly by default, in ways that are easy to get subtly wrong if you write them yourself. Facts on this page are verified directly against [shopify.dev's `image_url`](https://shopify.dev/docs/api/liquid/filters/image_url) and [`image_tag`](https://shopify.dev/docs/api/liquid/filters/image_tag) filter references.

## The baseline pattern

```liquid
{{ product.featured_image | image_url: width: 800 | image_tag:
  widths: '400, 800, 1200',
  sizes: '(min-width: 990px) 50vw, 100vw',
  alt: product.featured_image.alt
}}
```

`image_tag` writes the full `srcset`, `sizes`, `width`, and `height` markup for you, all from one call. `width`/`height` on the `<img>` tag come from the image's real dimensions and aspect ratio automatically, so the browser can reserve the right amount of space before the image loads, without you calculating anything by hand.

## `image_url`: requesting the right image from the CDN

```liquid
{{ product.featured_image | image_url: width: 800 }}
```

You must specify a `width` or `height` (or both) — omitting both is an error. A few rules worth knowing:

- **Max dimension is 5760px**, and Shopify **never upscales** an image past its original size, no matter what you request.
- **`crop`**: `top`, `center` (default), `bottom`, `left`, `right`, or `region` (a precise rectangle via `crop_left`/`crop_top`/`crop_width`/`crop_height`). Used when your requested aspect ratio doesn't match the source image's.
- **`pad_color`**: fills the space instead of cropping, if you'd rather pad than cut. Takes a hex color.
- **`format`**: only accepts `pjpg` or `jpg`, for an explicit lossy conversion (`png`→`jpg`, `png`→`pjpg`, `jpg`→`pjpg`). You do **not** need to (and can't) request `format: 'auto'` — Shopify's CDN already auto-detects the visitor's browser and serves WebP or AVIF automatically, with no filter parameter needed.

```liquid
{% comment %} ❌ WRONG — requesting a 2400px-wide image for a 300px-wide
   product card thumbnail. The CDN serves exactly what you ask for {% endcomment %}
{{ product.featured_image | image_url: width: 2400 }}

{% comment %} ✅ RIGHT — request close to the actual largest rendered size {% endcomment %}
{{ product.featured_image | image_url: width: 800 }}
```

## `image_tag`: the responsive `<img>` markup

| Parameter | What it does |
|---|---|
| `widths` | Your own list of `srcset` breakpoints (e.g. `'400, 800, 1200'`). Without it, Shopify generates a smart default set up to your requested width. |
| `sizes` | The HTML `sizes` attribute — tells the browser how much viewport width the image actually occupies at each breakpoint, so it picks the right `srcset` candidate. |
| `srcset` | Rarely needed directly — takes precedence over `widths` if set. Mainly useful for setting it to `nil` to remove the attribute entirely. |
| `width` / `height` | Override the auto-calculated values, or set to `nil` to omit the attribute. |
| `alt` | Overrides the default (the media's own alt text, or the resource's title). |
| Any other HTML attribute | Pass through directly — `class: 'hero-image'`, `loading: 'lazy'`, etc. |

```liquid
{{ product.featured_image | image_url: width: 600 | image_tag: widths: '200, 300, 400' }}
{% comment %} → srcset="...width=200 200w, ...width=300 300w, ...width=400 400w" {% endcomment %}
```

**Without a `sizes` value, the browser has to guess how big the image will actually render**, and often guesses wrong on a responsive layout. Always pair a custom `widths` list with a matching `sizes` value that describes your actual layout at each breakpoint.

## Lazy loading: the smart default, and when to override it

**If you don't set `loading` yourself, `image_tag` already defaults to `lazy` for images in sections further down the page**, based on `section.index`/`section.location`. You don't need to set `loading: 'lazy'` by hand for most below-the-fold images — the filter already does this correctly in most themes.

Where you *do* need to be explicit is above-the-fold content, especially your Largest Contentful Paint (LCP) candidate — usually a hero image:

```liquid
{% comment %} Hero image — the likely LCP candidate: eager, high priority {% endcomment %}
{{ section.settings.hero_image | image_url: width: 1600 | image_tag: loading: 'eager', fetchpriority: 'high' }}
```

If the automatic default doesn't match your theme's actual layout (for example, a below-the-fold image that's still visible on load on a short page), override `loading` explicitly rather than relying on the default. See [Performance Strategy](/performance/performance-strategy/) for the fuller lazy-loading and preload discussion — the same above-the-fold/below-the-fold logic applies to every media type, not just images.

## Focal points

```liquid
{{ images['banner.png'] | image_url: width: 300 | image_tag }}
{% comment %} → adds style="object-position: 1.9% 9.8%;" automatically,
   if a merchant set a focal point on this image {% endcomment %}
```

`image_tag` automatically applies a focal point via the `object-position` CSS property, if a merchant has set one on that image. You don't need to write any focal-point handling yourself — just make sure your image's container uses `object-fit: cover` so `object-position` has something to act on.

## Thumbnails and preview images

Every media object (not just images) exposes a `preview_image` attribute, useful for thumbnails and social previews:

```liquid
{% if product.media.size > 1 %}
  <div class="thumbnails-wrapper">
    {% for media in product.media %}
      <a data-thumbnail-id="{{ media.id }}">
        {{ media.preview_image | image_url: width: 110, height: 110 | image_tag: alt: media.alt }}
      </a>
    {% endfor %}
  </div>
{% endif %}
```

This works identically whether the underlying media is an image, a video, or a 3D model — `preview_image` always resolves to a plain image you can run through the same `image_url`/`image_tag` pattern.

## Alt text: never skip it, never fake it

```liquid
{% comment %} ✅ RIGHT — uses the real alt text if set, falls back to
   an explicit empty string for a genuinely decorative image {% endcomment %}
{{ image | image_url: width: 800 | image_tag: alt: image.alt }}

{% comment %} ❌ WRONG — a placeholder that tells a screen reader
   nothing more than "there is an image here" {% endcomment %}
{{ image | image_url: width: 800 | image_tag: alt: 'image' }}
```

`image_tag` already defaults `alt` to the media's own alt text, or the resource's title (a product's title, for example) when no alt text is set. Only override it when you have a genuinely better, more specific description for that context, or when the image is purely decorative — in which case use `alt: ''`, not an empty default. See [Theme Store Requirements: Accessibility](/theme-store-requirements/accessibility/) for the compliance bar this supports.

## Best practices

- Always request `width` close to the image's actual largest rendered size — never the largest size the CDN allows "just in case."
- Provide a `sizes` value whenever you provide a custom `widths` list, so the browser's `srcset` selection matches your real layout.
- Don't set `format` unless you specifically need a lossy conversion — Shopify already serves WebP/AVIF automatically based on the visitor's browser.
- Trust `image_tag`'s automatic lazy-loading default for below-the-fold images; only override `loading` explicitly for your LCP candidate or when the default doesn't fit your layout.
- Always supply real, specific alt text, or an explicit `alt: ''` for decorative images — never a generic placeholder.

## Common mistakes

- **Requesting a much larger image than what's actually rendered**, wasting bandwidth for no visual gain.
- **Setting `loading: 'lazy'` on an above-the-fold hero image** (or forgetting to override the default for one), directly delaying your LCP metric.
- **Hand-writing `format: 'auto'`**, which isn't a real parameter — automatic format selection already happens without any `format` value at all.
- **Providing a custom `widths` list with no matching `sizes` value**, leaving the browser to guess how large the image actually renders.
- **A generic `alt="image"` or `alt="photo"` placeholder**, which tells a screen reader nothing useful.

## Key takeaways
- `image_url`: needs `width` and/or `height`; max 5760px; never upscales; `crop` (`top`/`center`/`bottom`/`left`/`right`/`region`); `pad_color` for padding instead of cropping; `format` only for explicit `jpg`/`pjpg` conversion (auto WebP/AVIF needs no parameter).
- `image_tag`: auto-generates `srcset`/`width`/`height`; `widths` for custom breakpoints (pair with `sizes`); defaults `loading` to `lazy` below the fold automatically; any HTML attribute passes through.
- Focal points apply automatically via `object-position` — just use `object-fit: cover` on the container.
- `preview_image` works the same way across images, video, and 3D media for thumbnails.
- Always real, specific alt text, or an explicit `alt: ''` for decorative images.

## Further reading

- [Video Management](/assets/video-management/): the same responsive/lazy-loading principles applied to video
- [3D & AR Media](/assets/3d-and-ar-media/): the same principles applied to 3D product media
- [Performance Strategy & Critical Rendering Path](/performance/performance-strategy/): the broader lazy-loading and preload strategy this page's image-specific rules fit into
- [`image_url`](https://shopify.dev/docs/api/liquid/filters/image_url) (shopify.dev)
- [`image_tag`](https://shopify.dev/docs/api/liquid/filters/image_tag) (shopify.dev)
