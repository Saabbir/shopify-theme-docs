---
title: Assets Management
description: Everything media in one place — icons, responsive images, video, and 3D/AR product media, with maintainability and performance as the throughline.
---

**TL;DR:** Everything media in one place — icons, responsive images, video, and 3D/AR product media, with maintainability and performance as the throughline.

This section covers every kind of media asset in this theme: icons, product and static images, video, and 3D/AR models. Each media type gets its own dedicated page, and one shared page ties together the rules that apply no matter which type you're working with. Facts throughout this section are verified directly against Shopify's own Liquid filter references and best-practices documentation, not just general web knowledge.

## Quick answers

**"How do I add an icon?"** See [Icon Management](/assets/icon-management/). An inline SVG snippet, named `icon-*`, using `currentColor` for theming.

**"My image looks blurry / loads a huge file for a small thumbnail."** See [Responsive Images](/assets/responsive-images/#image_url-requesting-the-right-image-from-the-cdn). You're probably requesting a `width` far larger than the image actually renders at.

**"Do I need to write `loading: 'lazy'` on every image and video?"** No — see [Responsive Images: lazy loading](/assets/responsive-images/#lazy-loading-the-smart-default-and-when-to-override-it). `image_tag` and `video_tag` already default to lazy for below-the-fold media. You only need to be explicit for your above-the-fold LCP candidate.

**"Why does my uploaded video look choppy on slow connections?"** See [Video Management](/assets/video-management/#video_tag-for-shopify-hosted-video). Make sure you're using `video_tag`, not a hand-written `<video>` tag — `video_tag` includes the adaptive HLS source Shopify generates automatically.

**"Should a 3D model load right away on the product page?"** No, by default — see [3D & AR Media](/assets/3d-and-ar-media/#gate-the-models-load-dont-load-it-eagerly-by-default). Use `reveal: 'interaction'` so the heavy model file only loads once a customer engages with it.

**"What's the one thing that applies to every media type?"** See [Asset Organization & Performance: reserve its space](/assets/asset-organization-and-performance/#the-one-rule-that-applies-to-every-media-type-reserve-its-space). Reserve every media element's space with explicit dimensions or `aspect-ratio` before it loads, or you'll pay a layout-shift penalty.

## What's in this section

| Page | Covers |
|---|---|
| [Icon Management](/assets/icon-management/) | Inline SVG snippets, `currentColor` theming, sizing, accessibility, settings-driven icon pickers, keeping the icon set maintainable |
| [Responsive Images](/assets/responsive-images/) | `image_url`/`image_tag` in full: sizing, cropping, format selection, `srcset`/`sizes`, focal points, lazy loading, alt text |
| [Video Management](/assets/video-management/) | `video_tag`/`external_video_tag`, adaptive HLS, autoplay rules, poster images, responsive containers |
| [3D & AR Media](/assets/3d-and-ar-media/) | `model_viewer_tag`, gating a model's load cost, AR Quick Look/Scene Viewer via the `shopify-xr` library |
| [Asset Organization & Performance](/assets/asset-organization-and-performance/) | The shared rules: reserving space, CDN hosting, preloading deliberately, naming conventions, and auditing for bloat over time |

## The throughline: maintainability and performance, not just "how do I render this"

Every page in this section could stop at "here's the Liquid filter that renders this media type." Instead, each one goes one step further: how to keep the *cost* of that media type under control (request sizes, lazy loading, gating heavy 3D loads), and how to keep the *codebase* around it maintainable as the theme grows (consistent naming, pruning unused icons and orphaned assets, re-checking loading defaults after a redesign). A theme that renders media correctly on day one but never revisits it tends to accumulate real bloat by year two.

## Best practices

- Start with [Asset Organization & Performance](/assets/asset-organization-and-performance/) if you want the shared rules before diving into one specific media type.
- Always reach for Shopify's own filters (`image_tag`, `video_tag`, `model_viewer_tag`) instead of hand-writing markup. They handle responsive sizing, format selection, and adaptive streaming correctly by default.
- Treat "reserve the media's space before it loads" as a non-negotiable rule, not a nice-to-have, for every single media element you ship.

## Further reading

- [Performance](/performance/) and [Accessibility](/accessibility/): the theme-wide performance and accessibility strategy this section's media-specific pages plug into
- [Design System & Configuration](/design-system/): the tokens and settings architecture icons and other assets are configured through
- [Performance best practices for Shopify themes](https://shopify.dev/docs/storefronts/themes/best-practices/performance) (shopify.dev)
