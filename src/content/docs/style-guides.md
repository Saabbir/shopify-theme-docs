---
title: Style Guides
description: Standalone, comprehensive conventions for CSS, JavaScript & Web Components, and Liquid.
---

The rest of this handbook teaches Shopify-specific architecture — folders, blocks, schema, Theme Store rules. This section is different: it's a **standalone style guide** for the three languages we actually write every day, independent of any one section or feature. Read it once end to end when you're new, then use it as a reference afterward.

## What's on this page group

- [CSS Style Guide](/style-guides/css/) — global CSS, `{% stylesheet %}`, custom properties, logical properties, naming.
- [JavaScript & Web Components](/style-guides/javascript-and-web-components/) — `{% javascript %}`, native Web Components, state, events.
- [Web Components Guideline](/style-guides/web-components/) — the simple pattern vs. Horizon's advanced `refs`/declarative-event pattern, and how to choose.
- [Liquid Style Guide](/style-guides/liquid/) — objects, filters, whitespace control, performance, formatting.
- [Clean Code Principles](/style-guides/clean-code-principles/) — a complete worked example, messy vs. clean.
- [Third-Party Libraries](/style-guides/third-party-libraries/) — the decision framework for whether (and how) to add a dependency.
- [Theme Editor & Storefront Events](/style-guides/theme-editor-events/) — `shopify:section:load` and the rest of the theme editor's JS events.

## Why a separate style guide from the architecture sections

[Codebase Structure](/codebase-structure/) tells you *where* code goes (which folder, what a theme block is). This section tells you *how to write the code once it's there* — indentation, naming, when to reach for a CSS custom property vs. a class, when a Web Component is the right tool vs. overkill. Both matter; conflating them makes both harder to reference quickly.

## Best practices

- Read all three style guide pages once, in full, when you're new to the project — most of it becomes muscle memory quickly, but the exceptions (RTL logical properties, `{% stylesheet %}` scoping) are easy to miss if you only skim.
- Treat this section as a living reference — link to a specific rule in a PR comment ("see CSS Style Guide: logical properties") instead of re-explaining it every time it comes up in review.
- When a rule here and a rule in `AGENTS.md` seem to disagree, `AGENTS.md` wins for AI-generated code (it's what steers the tool), but the discrepancy itself is worth fixing in whichever file is stale.

## Common mistakes

- **Skimming this section once and never returning to it** — several rules here (logical properties, `{% stylesheet %}` scoping) are exactly the kind of thing that's easy to forget under deadline pressure and worth a periodic re-read.
- **Treating style guide rules as suggestions** rather than the same level of requirement as the architecture rules — inconsistent CSS/JS conventions compound into real maintenance cost over a multi-year theme's life.

## Quick Reference

- [CSS Style Guide](/style-guides/css/) · [JavaScript & Web Components](/style-guides/javascript-and-web-components/) · [Web Components Guideline](/style-guides/web-components/) · [Liquid Style Guide](/style-guides/liquid/) · [Clean Code Principles](/style-guides/clean-code-principles/) · [Third-Party Libraries](/style-guides/third-party-libraries/) · [Theme Editor & Storefront Events](/style-guides/theme-editor-events/)
- This section covers *how* to write code; [Codebase Structure](/codebase-structure/) covers *where* it goes.

## Further Reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
