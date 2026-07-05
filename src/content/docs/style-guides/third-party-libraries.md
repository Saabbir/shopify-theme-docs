---
title: Third-Party Libraries
description: A decision framework for whether to integrate any third-party JS/CSS library — and how to do it if the answer is yes.
---

Every dependency is a standing liability, not a one-time convenience: it needs updating, it can introduce a vulnerability, it can break with a browser update, and it adds to the performance budget on every page it loads. This page is the decision framework for when that trade-off is actually worth it, and how to integrate a library correctly when it is.

## The default answer is no

This handbook's baseline (see [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/)) is native Web Components and native CSS — no framework, minimal dependencies. Before evaluating *which* library to use, always first ask whether the platform already solves the problem:

| Need | Check first | Before reaching for |
|---|---|---|
| A carousel | CSS `scroll-snap` | A carousel library |
| A modal | `<dialog>` | A modal library |
| Form validation | Native HTML validation (`required`, `pattern`, `:user-invalid`) | A validation library |
| Smooth animations on DOM changes | The View Transitions API | An animation library |
| Date formatting | Liquid's `date` filter, or the native `Intl.DateTimeFormat` | A date-formatting library |
| Reactive state | DOM attributes as source of truth (see [JS Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/)) | A state-management library |

## The decision framework, when the platform genuinely doesn't cover it

If native HTML/CSS/JS genuinely can't do it reasonably (a rich text editor, a complex date-range picker, a payment SDK a payment provider requires), work through these questions **in order** — stop as soon as one disqualifies the library:

1. **Is it actually required, or does it just save some development time?** A library that saves a day of work but costs every future page load is rarely the right trade — see [Performance Strategy](/performance-and-accessibility/performance-strategy/) for why every added script has a real, ongoing cost, not a one-time cost.
2. **What's its actual bundle size, and does it tree-shake?** A library advertised as "lightweight" that pulls in 200KB of unused functionality is not lightweight in practice — check the real transferred size, not the marketing claim.
3. **Is it actively maintained?** Check the last commit/release date and open issue count. A library with no updates in 2+ years is a liability whether or not it currently "works" — a future browser change or security issue may have no one to fix it.
4. **Does it have a license compatible with a commercial Theme Store product?** Confirm the license (MIT, Apache 2.0, and similar permissive licenses are generally fine; anything with attribution requirements, copyleft clauses, or unclear commercial terms needs a real check before shipping in a paid theme).
5. **Does it conflict with anything Shopify's platform already provides or restricts?** Some libraries assume control over the page in ways that conflict with Shopify's own scripts (checkout, cart, analytics) or the theme editor's live-preview DOM patching (see [Theme Editor & Storefront Events](/style-guides/theme-editor-events/)).
6. **Can it be scoped, not global?** Load it only on the templates/sections that actually need it — see the loading pattern below.

If a library passes all six, it's a reasonable candidate. If it fails any one, that's usually a hard stop, not a "we'll deal with it later."

## Loading a library correctly, once approved

```liquid
{% comment %} ✅ RIGHT — loaded only in the specific section that
   needs it, not globally in layout/theme.liquid {% endcomment %}
{% comment %} sections/size-guide.liquid {% endcomment %}
<script src="{{ 'some-library.min.js' | asset_url }}" defer></script>
```

```liquid
{% comment %} ❌ WRONG — added to the global layout, so every page
   pays its cost even on templates that never use it {% endcomment %}
{% comment %} layout/theme.liquid {% endcomment %}
<script src="{{ 'some-library.min.js' | asset_url }}"></script>
```

| ✅ Do | ❌ Don't |
|---|---|
| Vendor the library file into `assets/` and load it via `asset_url`, scoped to the section that needs it | Load it from a third-party CDN in production (an extra DNS lookup/connection, and a dependency on that CDN's uptime) |
| Pin an exact version and note it (e.g. in a comment or `README.md`) so upgrades are deliberate | Load an unpinned "latest" version that can change behavior under you without warning |
| Load with `defer` (or as a module) so it never blocks parsing | A blocking synchronous `<script>` in `<head>` |

## A worked example: evaluating a hypothetical rich text editor library

Say a merchant-requested feature needs a WYSIWYG editor for a custom app-adjacent admin page (rare in themes, but illustrative):

1. Required, or time-saver? Genuinely required — building a rich text editor from scratch is not a reasonable use of project time.
2. Bundle size? Check the actual minified+gzipped size; if there are two comparable options, this is often the deciding factor.
3. Actively maintained? Confirm recent commits/releases, not just an old GitHub star count.
4. License? MIT/Apache 2.0 — fine. A "free for non-commercial use" license — a hard stop for a Theme Store product.
5. Conflicts with the platform? Confirm it doesn't assume it owns the whole page, and doesn't fight with the theme editor's DOM patching if used inside the editor context.
6. Scoped? Loaded only on the specific admin-adjacent page, not globally.

If it clears all six, proceed — vendored into `assets/`, pinned version, loaded scoped and deferred.

## Best practices

- Always check for a native HTML/CSS/JS solution before evaluating any library at all — most "do we need a library for this" questions in theme development resolve to "no" once the native option is actually considered.
- Vendor approved libraries into `assets/` with a pinned version, rather than loading an unpinned copy from a third-party CDN.
- Scope every library's script tag to the specific section/template that needs it — never add it to the global layout "just in case."
- Revisit the six-question framework for an *existing* dependency periodically, not just at the moment it's first added — a library that was justified two years ago may no longer be maintained, or may now have a native alternative.

## Common mistakes

- **Adding a library for something native CSS/HTML/JS already solves**, paying an ongoing performance and maintenance cost for no real benefit.
- **Loading a library globally in `layout/theme.liquid`** when only one section actually uses it.
- **Loading from an unpinned third-party CDN** instead of vendoring a specific, pinned version into `assets/`.
- **Never revisiting an existing dependency** to check whether it's still maintained or whether a native alternative has since made it unnecessary.

## Quick Reference

- Default answer: no — check for a native solution first (`<dialog>`, `scroll-snap`, native form validation, View Transitions).
- If genuinely needed: check necessity, real bundle size, maintenance status, license, platform conflicts, and whether it can be scoped — in that order.
- Vendor into `assets/` with a pinned version, loaded `defer`/as a module, scoped to only the section/template that needs it.
- Revisit existing dependencies periodically — "justified once" isn't "justified forever."

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) — the native-first baseline this framework supports
- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/) — the ongoing cost every added script carries
