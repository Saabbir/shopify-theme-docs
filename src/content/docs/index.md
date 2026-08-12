---
title: Shopify Theme Handbook
description: The one place to learn how to build and publish a Shopify theme to the Theme Store.
template: splash
hero:
  tagline: How we build Shopify themes, from a blank folder to a Theme Store submission. Written for developers who already know Shopify and Liquid.
  actions:
    - text: Get Started
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: Theme Store Requirements
      link: /theme-store-requirements/
      icon: external
      variant: minimal
---

## What's in this handbook

| Section | Covers |
|---|---|
| [1. Getting Started](/getting-started/) | What this handbook covers, prerequisites, your first local preview |
| [2. Theme Store Requirements](/theme-store-requirements/) | Every Shopify requirement, in plain English, with code examples |
| [3. Codebase Structure](/codebase-structure/) | Folders, theme blocks, sections, naming conventions, modern platform features |
| [4. Scaffold Setup Guide](/scaffold-setup/) | Step by step: empty folder → working section and block |
| [5. AI-Assisted Development](/ai-assisted-development/) | How we build most things from here on: AGENTS.md, Figma MCP, Claude commands, Shopify's own AI Toolkit |
| [6. GitHub Workflow](/github-workflow/) | Branching, PR review, CI automation — the loop you'll use for everything from here on |
| [7. CSS](/css/) | Units (rem/em/62.5%), cascade & specificity, custom properties, architecture & naming, stylesheet/style tags, modern features, performance |
| [8. JavaScript](/javascript/) | Architecture & state/events, Web Components (both patterns), the `{% javascript %}` tag, theme editor events, modern features, performance |
| [9. Style Guides](/style-guides/) | Liquid, clean code, third-party libraries |
| [10. Design System & Configuration](/design-system/) | Figma tokens, the three-tier token model |
| [11. Config & Global Settings](/config-and-settings/) | settings_schema.json & settings_data.json rules/conventions, what's required vs. optional |
| [12. Presets](/presets/) | Theme, section, and block presets — real-world examples, benefits, and every rule marked mandatory or optional |
| [13. Colors](/colors/) | Color palettes, color schemes, color tokens, Liquid color filters, color accessibility — everything color, dev and merchant perspective |
| [14. Fonts](/fonts/) | font_picker settings, the type scale, the font object and font_face/font_modify, font accessibility & performance |
| [15. Spacing](/spacing/) | The spacing scale, range settings, logical properties — everything spacing, dev and merchant perspective |
| [16. Assets Management](/assets/) | Icons, responsive images, video, 3D/AR media — rendering, performance, and maintainability for every media type |
| [17. Internationalization & Locales](/internationalization-and-locales/) | i18n/RTL requirements, locale file management, and how settings_schema.json's t: keys resolve into them |
| [18. Performance](/performance/) | Performance strategy, the critical rendering path, budgets, built in from the start, not added later |
| [19. Accessibility](/accessibility/) | Accessibility built into a section from the start, and kept consistent theme-wide |
| [20. Quality & Validation](/quality-validation/) | Linting, manual QA, the pre-submission checklist |
| [21. Publishing](/publishing/) | Partner Dashboard, store setup, packaging, review, life after approval |
| [22. Tooling & Config](/tooling-config/) | Project files, Theme-Store-only packaging, optional Tailwind/Alpine setup |
| [23. Learning Articles](/learning-articles/) | Step-by-step deep dives: Liquid objects, maintainable code |
| [24. Reference](/reference/) | Cheatsheet, glossary, and a curated tools directory |

New here? Start with sections 1 to 4, in order. After that, use search (**⌘K**) to find whatever you need.

Examples throughout use **Solis**, our current Theme Store project. But this handbook applies to any Shopify theme we build.
