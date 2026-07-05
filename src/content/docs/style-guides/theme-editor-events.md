---
title: Theme Editor & Storefront Events
description: Shopify's built-in JavaScript events for the theme editor, and how to listen for them correctly.
---

When a merchant customizes a section or block in the theme editor, Shopify swaps the changed HTML directly into the existing page — it does not reload the page. That means any JavaScript that ran on initial page load **does not run again** for that new markup, unless you explicitly listen for the events covered here and re-run it.

## The event table

The theme editor emits these events on the relevant section/block element. Every event **bubbles** and is **not cancellable**:

| Event | Target | Detail | Fires when | What you should do |
|---|---|---|---|---|
| `shopify:section:load` | section | `{ sectionId }` | A section is added or re-rendered | Re-run any JS the section needs, as if the page had just loaded |
| `shopify:section:unload` | section | `{ sectionId }` | A section is deleted, or about to be re-rendered | Clean up listeners/observers/timers so nothing leaks or breaks |
| `shopify:section:select` | section | `{ sectionId, load }` | The merchant selects the section in the sidebar | Make sure the section scrolls into view and stays visible while selected |
| `shopify:section:deselect` | section | `{ sectionId }` | The merchant deselects the section | — |
| `shopify:section:reorder` | section | `{ sectionId }` | A section is reordered | — |
| `shopify:block:select` | block | `{ blockId, sectionId, load }` | The merchant selects the block in the sidebar | Scroll the block into view; e.g. advance a carousel to the selected slide and pause it there |
| `shopify:block:deselect` | block | `{ blockId, sectionId }` | The merchant deselects the block | — |
| `shopify:inspector:activate` | — | — | The theme editor's preview inspector is activated | — |
| `shopify:inspector:deactivate` | — | — | The preview inspector is deactivated | — |

`load` (on `select` events) is `true` if triggered by a section re-render, `false` if triggered by an actual merchant click — useful for distinguishing "just re-rendered and auto-selected" from "the merchant deliberately clicked this."

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

This is precisely why a [Web Component's lifecycle](/learning-articles/javascript-and-web-components-deep-dive/) (`connectedCallback`/`disconnectedCallback`) is such a good fit for theme sections — a Web Component re-runs its own setup automatically every time it's reconnected to the DOM, which is exactly what happens on a `shopify:section:load` re-render. Listening for the event explicitly (as above) is mainly needed for global/non-component JS; a well-built Web Component often needs no special theme-editor handling at all.

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

Shopify explicitly expects this: a slideshow section should scroll into view when selected, advance to a selected slide/block, and pause there while it's selected — merchants editing a section they can't see is a genuinely confusing editing experience.

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

Skipping this is a real, if subtle, source of bugs: a merchant who edits a section repeatedly in one editor session can accumulate duplicate intervals/observers if old ones are never torn down, degrading the editing experience the longer that session runs.

## Detecting the theme editor itself

Sometimes you need different behavior specifically inside the editor (e.g. always expanding an accordion so a merchant can see what they're editing, or disabling an autoplay carousel that would otherwise be annoying to edit against):

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

- Prefer a Web Component's own lifecycle (`connectedCallback`/`disconnectedCallback`) over a manual `shopify:section:load`/`unload` listener where possible — it handles the same re-render case automatically, with less code to keep in sync.
- Always pair a `shopify:section:load` listener that sets something up with a `shopify:section:unload` listener that tears it down, even if it "seems fine" without it in casual testing.
- Test every interactive section by actually editing it repeatedly in the theme editor, not just by loading the page once — this is the only way to catch a missing re-initialization or an accumulating leak.

## Common mistakes

- **Initializing interactive JS only on page load**, so it silently stops working the moment a merchant edits that section in the theme editor without a full page reload.
- **Setting up a listener/observer/interval on `shopify:section:load` with no matching `shopify:section:unload` cleanup**, causing duplicates to accumulate across repeated edits in one editor session.
- **Forgetting to keep a selected section/block scrolled into view**, leaving merchants editing something they can't see on screen.

## Quick Reference

- `shopify:section:load`/`unload` — re-initialize/clean up JS on section re-render.
- `shopify:section:select`/`deselect`, `shopify:block:select`/`deselect` — keep the selected section/block visible; pause/resume things like autoplay accordingly.
- `request.design_mode` / `Shopify.designMode` — true anywhere in the theme editor.
- `request.visual_preview_mode` / `Shopify.visualPreviewMode` — true specifically when previewing a preset before adding it.
- All events bubble and are not cancellable.

## Further Reading

- [Integrate sections and blocks with the theme editor](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks) — shopify.dev
- [JavaScript & Web Components Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/) — the component lifecycle these events complement
