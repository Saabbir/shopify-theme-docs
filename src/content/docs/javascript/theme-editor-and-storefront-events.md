---
title: Theme Editor & Storefront Events
description: Shopify's built-in JavaScript events for the theme editor, and how to listen for them correctly.
---

**TL;DR:** Shopify's built-in JavaScript events for the theme editor, and how to listen for them correctly.

When a merchant customizes a section or block in the theme editor, Shopify swaps the changed HTML straight into the existing page. It does not reload the page. That means any JavaScript that ran when the page first loaded **does not run again** for that new markup, unless you explicitly listen for the events described on this page and rerun your code yourself.

## The event table

The theme editor fires these events on the section or block element they relate to. Every event **bubbles**, which means it also passes up through the parent elements above it. Every event is also **not cancellable**, meaning you can't stop it from happening once it starts.

| Event | Target | Detail | Fires when | What you should do |
|---|---|---|---|---|
| `shopify:section:load` | section | `{ sectionId }` | A section is added or re-rendered | Re-run any JS the section needs, as if the page had just loaded |
| `shopify:section:unload` | section | `{ sectionId }` | A section is deleted, or about to be re-rendered | Clean up listeners/observers/timers so nothing leaks or breaks |
| `shopify:section:select` | section | `{ sectionId, load }` | The merchant selects the section in the sidebar | Make sure the section scrolls into view and stays visible while selected |
| `shopify:section:deselect` | section | `{ sectionId }` | The merchant deselects the section | (none) |
| `shopify:section:reorder` | section | `{ sectionId }` | A section is reordered | (none) |
| `shopify:block:select` | block | `{ blockId, sectionId, load }` | The merchant selects the block in the sidebar | Scroll the block into view; e.g. advance a carousel to the selected slide and pause it there |
| `shopify:block:deselect` | block | `{ blockId, sectionId }` | The merchant deselects the block | (none) |
| `shopify:inspector:activate` | (none) | (none) | The theme editor's preview inspector is activated | (none) |
| `shopify:inspector:deactivate` | (none) | (none) | The preview inspector is deactivated | (none) |

One detail worth knowing: the `load` value on `select` events is `true` when a section re-render triggered the event, and `false` when the merchant actually clicked something. This lets your code tell the difference between "this just re-rendered and got auto-selected" and "the merchant deliberately clicked this."

## Why `shopify:section:load`/`unload` matter more than they look

```javascript
// ❌ WRONG — this runs once, when the page first loads. If a merchant
// edits this section's settings in the theme editor, Shopify re-renders
// the section's HTML, but this script never runs again for the new
// markup — the carousel silently stops working until a full page reload
document.querySelectorAll('.carousel').forEach(initCarousel);
```

```javascript
// ✅ RIGHT — re-initializes whenever a section (re-)renders, whether
// that's the initial page load or an edit in the theme editor
document.addEventListener('shopify:section:load', (event) => {
  const carousel = event.target.querySelector('.carousel');
  if (carousel) initCarousel(carousel);
});
```

This is exactly why a [Web Component's lifecycle](/javascript/custom-element-lifecycle-and-progressive-enhancement/) (its `connectedCallback`/`disconnectedCallback` methods, which run automatically when the component is added to or removed from the page) fits theme sections so well. A Web Component reruns its own setup automatically every time it's reconnected to the page, and that's exactly what happens during a `shopify:section:load` re-render.

So when do you need to listen for the event yourself, like in the example above? Mostly for global or non-component JavaScript. A well-built Web Component often needs no special theme-editor handling at all.

## Keeping a selected section/block in view

```javascript
document.addEventListener('shopify:section:select', (event) => {
  const carousel = event.target.querySelector('.carousel');
  if (carousel) carousel.scrollIntoView({ block: 'center', behavior: 'smooth' });
});

document.addEventListener('shopify:block:select', (event) => {
  // e.g. advance a carousel to the block's slide and pause autoplay
  // while that specific block is selected in the sidebar
  const slide = event.target;
  slide.closest('.carousel')?.pauseAutoplay?.();
  slide.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
});

document.addEventListener('shopify:block:deselect', (event) => {
  event.target.closest('.carousel')?.resumeAutoplay?.();
});
```

Think about it from the merchant's point of view. If they click a section in the sidebar and can't see it change anywhere on their screen, that's confusing. So Shopify expects specific behavior here: a slideshow section should scroll into view when selected, jump to the selected slide or block, and pause there while it's selected.

## Cleaning up on `shopify:section:unload`

```javascript
document.addEventListener('shopify:section:unload', (event) => {
  // Remove anything the section's shopify:section:load handler set up —
  // observers, intervals, global listeners scoped to this section
  const section = event.target;
  section._resizeObserver?.disconnect();
  clearInterval(section._autoplayInterval);
});
```

Skipping this cleanup step causes a real, if subtle, kind of bug. Picture a merchant editing the same section five times in one sitting. If every edit sets up a new timer or observer without removing the old one, you end up with five timers running at once instead of one. The page gets slower and buggier the longer that editing session runs.

## Detecting the theme editor itself

Sometimes you need your code to behave differently specifically inside the editor. Two common examples: always expanding an accordion so a merchant can see what they're editing, or turning off an autoplay carousel that would otherwise be distracting while someone edits it.

```liquid
{% if request.design_mode %}
  {% comment %} Only rendered inside the theme editor {% endcomment %}
{% endif %}
```

```javascript
if (Shopify.designMode) {
  // Only runs inside the theme editor
}
```

```liquid
{% if request.visual_preview_mode %}
  {% comment %} Specifically the visual preview shown when a merchant
     is browsing presets to add — e.g. force-expand an accordion so
     the preset preview shows real content instead of a collapsed
     empty state {% endcomment %}
{% endif %}
```

```javascript
if (Shopify.inspectMode) {
  // The theme editor's preview inspector overlay is currently active
}
```

| Global/attribute | True when |
|---|---|
| `request.design_mode` (Liquid) / `Shopify.designMode` (JS) | Inside the theme editor at all |
| `request.visual_preview_mode` (Liquid) / `Shopify.visualPreviewMode` (JS) | Specifically previewing a preset before adding it |
| `Shopify.inspectMode` (JS) | The preview inspector overlay is active |

## Common tasks this enables

| Task | Event(s) to use |
|---|---|
| Re-initialize a carousel/slider after an edit | `shopify:section:load` |
| Pause a carousel's autoplay while a merchant is actively editing one of its slides | `shopify:block:select` / `shopify:block:deselect` |
| Scroll a long page to the section a merchant just clicked in the sidebar | `shopify:section:select` |
| Clean up a `ResizeObserver`/interval before a section re-renders | `shopify:section:unload` |
| Force-expand a collapsed element so a merchant sees real content while browsing presets | `request.visual_preview_mode` |
| Skip an animation/autoplay that would be distracting while editing | `request.design_mode` / `Shopify.designMode` |

## Best practices

- Prefer a Web Component's own lifecycle (`connectedCallback`/`disconnectedCallback`) over a manual `shopify:section:load`/`unload` listener where you can. It handles the same re-render case automatically, with less code for you to keep in sync.
- Always pair a `shopify:section:load` listener that sets something up with a `shopify:section:unload` listener that tears it down again, even if things "seem fine" without it during casual testing.
- Test every interactive section by actually editing it repeatedly in the theme editor, not just by loading the page once. That's the only way to catch a missing re-initialization or a slow leak building up over time.

## Common mistakes

- **Initializing interactive JS only on page load,** so it quietly stops working the moment a merchant edits that section in the theme editor without a full page reload.
- **Setting up a listener, observer, or interval on `shopify:section:load` with no matching `shopify:section:unload` cleanup.** This causes duplicates to pile up across repeated edits in one editor session.
- **Forgetting to keep a selected section or block scrolled into view,** leaving merchants editing something they can't actually see on screen.

## Key Takeaways
- `shopify:section:load`/`unload`: set up/clean up JS when a section re-renders.
- `shopify:section:select`/`deselect`, `shopify:block:select`/`deselect`: keep the selected section or block visible, and pause/resume things like autoplay accordingly.
- `request.design_mode` / `Shopify.designMode`: true anywhere in the theme editor.
- `request.visual_preview_mode` / `Shopify.visualPreviewMode`: true specifically when previewing a preset before adding it.
- All events bubble and can't be cancelled.

## Further Reading

- [JavaScript in Shopify](/javascript/javascript-in-shopify/): the `{% javascript %}` tag mechanics these events complement
- [Custom Element Lifecycle & Progressive Enhancement](/javascript/custom-element-lifecycle-and-progressive-enhancement/): the component lifecycle these events complement
- [Integrate sections and blocks with the theme editor](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks) (shopify.dev)
