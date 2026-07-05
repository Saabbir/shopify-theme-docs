---
title: Getting Started
description: What this handbook is, who it's for, and how to use it.
---

This handbook is our team's single source of truth for building a Shopify theme from scratch and getting it approved on the [Shopify Theme Store](https://themes.shopify.com/). It covers everything from your first day on the project to submitting the finished theme for review.

It is written for developers who know HTML, CSS, and JavaScript, but who may be new to Shopify themes. You don't need prior Shopify experience to follow along.

## What you'll build

We follow **Horizon's architecture** — the modern block-based patterns Shopify introduced in 2025 (nested theme blocks, `@theme`/`@app` block targeting, `{% stylesheet %}`/`{% javascript %}` tags). This is the current best-practice way to build a Shopify theme, and every code example in this handbook uses it instead of the older Dawn-era section-only model.

:::caution[Horizon itself is not our scaffold]
Horizon is Shopify's own first-party flagship theme. Per [Shopify's own README](https://github.com/Shopify/horizon), **themes based on, derived from, or incorporating Horizon are not eligible for Theme Store submission.** So we don't clone Horizon.

Instead, we scaffold from **[Skeleton Theme](https://github.com/Shopify/skeleton-theme)** — Shopify's official, Theme-Store-eligible starter, which is built with the exact same modern block architecture as Horizon (same folder layout, same `blocks/` directory, same schema patterns). We get Horizon's architecture and a submittable theme.

See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) for the full explanation and setup steps.
:::

:::note[Why this matters]
If you find older Shopify tutorials or blog posts online, many of them still teach Dawn's section-only model. That's outdated for new theme development. When in doubt, trust this handbook and the official [shopify.dev](https://shopify.dev/docs/storefronts/themes) docs over older third-party guides.
:::

## How this handbook is organized

| # | Section | What it answers |
|---|---|---|
| 1 | Getting Started | You're here. |
| 2 | [Theme Store Requirements](/theme-store-requirements/) | What Shopify requires before they'll list your theme. |
| 3 | [Codebase Structure](/codebase-structure/) | How a theme's files and folders fit together. |
| 4 | [Scaffold Setup Guide](/scaffold-setup/) | Step-by-step: build your first section and block. |
| 5 | [AI-Assisted Development](/ai-assisted-development/) | How we use Cursor / Claude Code, and how we go from Figma to code. |
| 6 | [GitHub Workflow](/github-workflow/) | Branching, PRs, and CI on this project. |
| 7 | [Quality & Validation](/quality-validation/) | Linting, testing, and the checklist before you open a PR. |
| 8 | [Publishing to Theme Store](/publishing/) | Packaging, submitting, and what happens after. |

Read sections 1–4 in order once, at the start of the project. After that, treat this handbook as a reference — jump to whatever section answers your current question, and use the search bar (top left) to jump straight to a topic.

## Quick Reference

- This handbook targets **Horizon**, not Dawn. If content ever needs to diverge for a specific theme, note it at the top of the page.
- No prior Shopify experience required — every section explains Shopify-specific terms the first time they appear.
- Sections 1–4 are read-once onboarding. Sections 5–8 are ongoing references.

## Further Reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) — shopify.dev
- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
- [Horizon theme source](https://github.com/Shopify/horizon) — GitHub (reference only, not our scaffold)
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme) — GitHub (our actual scaffold)
