---
title: 3D & AR Media
description: model_viewer_tag, gating a 3D model's load cost, and adding AR Quick Look / Scene Viewer support via the Shopify-XR library.
---

**TL;DR:** model_viewer_tag, gating a 3D model's load cost, and adding AR Quick Look / Scene Viewer support via the Shopify-XR library.

A 3D model is the heaviest media type a Shopify theme can render. It's usually a much larger download than an equivalent product image, and the viewer component itself takes real time to load and parse. This page covers how to render 3D product media correctly, keep its cost under control, and add AR support on top of it. Facts on this page are verified directly against [shopify.dev's `model_viewer_tag` filter reference](https://shopify.dev/docs/api/liquid/filters/model_viewer_tag) and [Support product media](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media).

## `model_viewer_tag`

```liquid
{% for media in product.media %}
  {% if media.media_type == 'model' %}
    {{ media | model_viewer_tag: image_size: '800x' }}
  {% endif %}
{% endfor %}
```

`model_viewer_tag` renders a `<model-viewer>` element — [Google's model-viewer web component](https://modelviewer.dev/) — with the model's `src`, `alt`, `poster`, and `camera-controls` already set up for you. You can override any of these, or set any [supported `<model-viewer>` attribute](https://modelviewer.dev/docs/index.html#stagingandcameras-attributes), by passing a parameter with the same name:

```liquid
{{ media | model_viewer_tag: interaction-policy: 'allow-when-focused' }}
```

`image_size` controls the poster image's resolution, the same as `video_tag`'s `image_size` parameter — treat it with the same sizing discipline as any other image (see [Responsive Images](/assets/responsive-images/)): request close to the actual rendered size, not the largest available.

## Gate the model's load, don't load it eagerly by default

```liquid
{% comment %} ❌ WRONG — every product's 3D model eagerly loads on the
   product page, whether or not the customer ever looks at it {% endcomment %}
{{ media | model_viewer_tag: reveal: 'auto' }}

{% comment %} ✅ RIGHT — the model loads only once a customer actually
   engages with it; everyone else pays only the (optimized) poster
   image's cost {% endcomment %}
{{ media | model_viewer_tag: reveal: 'interaction' }}
```

`reveal: 'interaction'` waits to load the actual 3D model until the customer clicks or interacts with it. `reveal: 'auto'` loads it immediately. Default to `interaction`. Only switch to `auto` when the 3D model genuinely is the main point of that page, like a dedicated 3D-first product template.

## A responsive container: the square aspect-ratio box

Unlike an image or a video, **a 3D model doesn't have a predefined aspect ratio**. The common pattern is a square container, using `padding-top: 100%` (or the modern `aspect-ratio: 1 / 1` equivalent) rather than a fixed 16:9 box:

```css
.model-wrapper {
  aspect-ratio: 1 / 1;
  overflow: hidden;
}
.model-wrapper model-viewer {
  width: 100%;
  height: 100%;
}
```

```liquid
<div class="model-wrapper" data-media-id="{{ media.id }}">
  {{ media | model_viewer_tag: image_size: '800x', reveal: 'interaction' }}
</div>
```

This reserves the model's space before it (or its poster) loads, the same layout-shift prevention rule that applies to every media type on this site.

## Interactive elements inside a carousel

A `<model-viewer>` element is interactive on its own — a customer can rotate and zoom it. If a 3D model sits inside a carousel or swipeable gallery alongside other media, make sure the model's own rotate/zoom gestures don't fight with the carousel's swipe gestures. This is the same interference risk a video's progress bar or volume control has inside a swipeable display.

## Adding AR support: the Shopify-XR library

If a merchant has uploaded 3D models, you can let customers view them in their own physical space through AR, using Shopify's own `shopify-xr` library. It supports AR Quick Look in iOS Safari and Scene Viewer on Android, with no third-party app required.

**Format handling is automatic.** When a merchant uploads both a `.glb` and a `.usdz` file for the same model, Shopify serves the right one per device: iOS visitors get the AR-ready `.usdz` (via Apple's AR Quick Look), everyone else gets the `.glb` through the standard web `<model-viewer>`.

### Step 1: initialize the library on the product page

```html
<script>
function setupShopifyXr(){
  if (!window.ShopifyXR) {
    document.addEventListener('shopify_xr_initialized', function() {
      setupShopifyXr();
    });
  } else {
    {% assign models = product.media | where: 'media_type', 'model' | json -%}
    window.ShopifyXR.addModels({{ models }});
    window.ShopifyXR.setupXRElements();
  }
}
window.Shopify.loadFeatures([
  { name: 'shopify-xr', version: '1.0', onLoad: setupShopifyXr }
]);
</script>
```

### Step 2: add a launch button per model

```liquid
{% for media in product.media %}
  {% if media.media_type == 'model' %}
    <div class="model-wrapper" data-media-id="{{ media.id }}">
      {{ media | model_viewer_tag: reveal: 'interaction' }}
    </div>
    <button
      data-shopify-xr
      data-shopify-model3d-id="{{ media.id }}"
      data-shopify-title="{{ product.title | escape }}"
      data-shopify-xr-hidden
    >
      {{ 'product.view_in_space' | t }}
    </button>
  {% endif %}
{% endfor %}
```

The `shopify-xr` library scans the DOM for `[data-shopify-xr]` elements and attaches the click handler for you — you don't wire up the AR launch logic by hand. On a supported iOS device, this becomes Apple's "View in Your Space" AR Quick Look experience automatically.

## Best practices

- Default every 3D model to `reveal: 'interaction'`. Treat `reveal: 'auto'` as an exception that needs a specific reason.
- Always provide a sized, optimized poster image, the same as any other media type.
- Use a square aspect-ratio container (`aspect-ratio: 1 / 1` or `padding-top: 100%`) since 3D models have no inherent aspect ratio.
- If AR support matters for the theme's audience, use the `shopify-xr` library rather than a custom-built AR integration — it already handles per-device format selection for you.
- Prevent a 3D model's rotate/zoom gestures from conflicting with a surrounding carousel's swipe gestures.

## Common mistakes

- **Loading 3D models eagerly (`reveal: 'auto'`) by default**, paying their heavy cost even for customers who never interact with them.
- **Omitting a poster image**, leaving nothing meaningful to show before (or instead of) the model loading.
- **Using a fixed 16:9 container for a 3D model**, when a model has no predefined aspect ratio and a square container is the common, correct default.
- **Building a custom AR integration from scratch** instead of using the `shopify-xr` library, which already handles the iOS/`.usdz` vs. Android/`.glb` device split.

## Key Takeaways
- `model_viewer_tag`: renders a `<model-viewer>` web component with `src`/`alt`/`poster`/`camera-controls` set up automatically.
- Default `reveal: 'interaction'`, not `auto`. Always a sized `image_size` poster.
- Square aspect-ratio container (no predefined aspect ratio for 3D models).
- AR support: the `shopify-xr` library, `data-shopify-xr` button attributes — automatic `.usdz` (iOS)/`.glb` (Android/web) format selection, no custom code needed.

## Further Reading

- [Responsive Images](/assets/responsive-images/): the same poster-image sizing discipline applied here
- [Video Management](/assets/video-management/): the same aspect-ratio-container and interactive-media-in-a-carousel concerns
- [`model_viewer_tag`](https://shopify.dev/docs/api/liquid/filters/model_viewer_tag) (shopify.dev)
- [Support product media: AR functionality](https://shopify.dev/docs/storefronts/themes/product-merchandising/media/support-media#support-ar-functionality) (shopify.dev)
