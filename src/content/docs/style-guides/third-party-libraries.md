---
title: Third-Party Libraries
description: How to decide whether to add any third-party JS/CSS library, and how to do it correctly if the answer is yes.
---

Adding a third-party library sounds free, but it isn't. Every library you add is an ongoing cost, not a one-time convenience.

It needs updating. It can introduce a security hole. It can break when a browser updates. And it adds to the load time of every single page it appears on. This page walks you through how to decide when that trade-off is actually worth it, and how to add a library the right way once you've decided it is.

## The default answer is no

Our baseline approach (see [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/)) is to use native Web Components and native CSS wherever we can. That means no framework, and as few dependencies as possible. Before you even start comparing libraries, ask yourself first: does the browser already solve this problem on its own?

| Need | Check first | Before reaching for |
|---|---|---|
| A carousel | CSS `scroll-snap` | A carousel library |
| A modal | `<dialog>` | A modal library |
| Form validation | Native HTML validation (`required`, `pattern`, `:user-invalid`) | A validation library |
| Smooth animations on DOM changes | The View Transitions API | An animation library |
| Date formatting | Liquid's `date` filter, or the native `Intl.DateTimeFormat` | A date-formatting library |
| Reactive state | DOM attributes as source of truth (see [JS Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/)) | A state-management library |

## The decision framework, when the platform genuinely doesn't cover it

Sometimes native HTML, CSS, and JavaScript really can't do the job. Think of a rich text editor, a complex date-range picker, or a payment SDK that a payment provider requires you to use. In cases like that, work through the questions below **in order**. Stop as soon as one question rules the library out.

1. **Is it actually required, or does it just save some development time?** A library that saves you a day of work but costs every future page load isn't usually a good trade. See [Performance Strategy](/performance-and-accessibility/performance-strategy/) for why every added script has a real, ongoing cost, not a one-time cost.
2. **What's its actual bundle size, and does it tree-shake?** A library advertised as "lightweight" that still pulls in 200KB of code you never use isn't actually lightweight. Check the real transferred size, not the marketing claim.
3. **Is it actively maintained?** Look at the last commit or release date, and the number of open issues. A library with no updates in two or more years is a risk, whether or not it currently seems to work, because no one may be around to fix a future browser change or security issue.
4. **Does it have a license compatible with a commercial Theme Store product?** Confirm the license type. MIT, Apache 2.0, and similar permissive licenses are generally fine. Anything with attribution requirements, copyleft clauses, or unclear commercial terms needs a real check before you ship it in a paid theme.
5. **Does it conflict with anything Shopify's platform already provides or restricts?** Some libraries assume they have full control over the page. That can conflict with Shopify's own scripts (checkout, cart, analytics) or with the theme editor's live-preview DOM patching (see [Theme Editor & Storefront Events](/style-guides/theme-editor-events/)).
6. **Can it be scoped, not global?** "Scoped" means loading it only on the templates or sections that actually need it, instead of on every page. See the loading pattern below for how to do this.

If a library passes all six questions, it's a reasonable candidate. If it fails even one, that's usually a hard stop, not something you deal with later.

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

| Do | Don't |
|---|---|
| Vendor the library file into `assets/` and load it via `asset_url`, scoped to the section that needs it | Load it from a third-party CDN in production (this adds an extra DNS lookup and a dependency on that CDN's uptime) |
| Pin an exact version and note it (for example, in a comment or `README.md`) so upgrades are deliberate | Load an unpinned "latest" version that can change behavior under you without warning |
| Load with `defer` (or as a module) so it never blocks parsing | Use a blocking, synchronous `<script>` in `<head>` |

## A worked example: evaluating a hypothetical rich text editor library

Say a merchant-requested feature needs a WYSIWYG editor for a custom app-adjacent admin page. This is rare in themes, but it's a useful example to walk through.

1. Required, or time-saver? Genuinely required. Building a rich text editor from scratch isn't a reasonable use of project time.
2. Bundle size? Check the actual minified and gzipped size. If there are two comparable options, this is often the deciding factor.
3. Actively maintained? Confirm recent commits and releases, not just an old GitHub star count.
4. License? MIT or Apache 2.0 is fine. A "free for non-commercial use" license is a hard stop for a Theme Store product.
5. Conflicts with the platform? Confirm it doesn't assume it owns the whole page, and doesn't fight with the theme editor's DOM patching if it's used inside the editor context.
6. Scoped? Load it only on the specific admin-adjacent page, not globally.

If it clears all six questions, go ahead: vendor it into `assets/`, pin the version, and load it scoped and deferred.

## Best practices

- Always check for a native HTML/CSS/JS solution before you evaluate any library at all. Most "do we need a library for this" questions in theme development turn out to be "no" once you actually check the native option.
- Vendor approved libraries into `assets/` with a pinned version, rather than loading an unpinned copy from a third-party CDN.
- Scope every library's script tag to the specific section or template that needs it. Never add it to the global layout "just in case."
- Revisit the six-question framework for an *existing* dependency now and then, not just when it's first added. A library that was justified two years ago may no longer be maintained, or a native alternative may now exist.

## Common mistakes

- **Adding a library for something native CSS, HTML, or JS already solves,** paying an ongoing performance and maintenance cost for no real benefit.
- **Loading a library globally in `layout/theme.liquid`** when only one section actually uses it.
- **Loading from an unpinned third-party CDN** instead of vendoring a specific, pinned version into `assets/`.
- **Never revisiting an existing dependency** to check whether it's still maintained or whether a native alternative has since made it unnecessary.

## Quick Reference

- Default answer: no. Check for a native solution first (`<dialog>`, `scroll-snap`, native form validation, View Transitions).
- If genuinely needed: check necessity, real bundle size, maintenance status, license, platform conflicts, and whether it can be scoped, in that order.
- Vendor into `assets/` with a pinned version, loaded `defer` or as a module, scoped to only the section or template that needs it.
- Revisit existing dependencies now and then. "Justified once" isn't the same as "justified forever."

## Further Reading

- [JavaScript & Web Components Style Guide](/style-guides/javascript-and-web-components/) - the native-first baseline this framework supports
- [Performance Strategy & Critical Rendering Path](/performance-and-accessibility/performance-strategy/) - the ongoing cost every added script carries
