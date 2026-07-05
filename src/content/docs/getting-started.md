---
title: Getting Started
description: What this handbook is, who it's for, and how to use it.
---

This handbook is our team's single source of truth for building a Shopify theme from scratch and getting it approved on the [Shopify Theme Store](https://themes.shopify.com/). It covers everything from your first day on the project to submitting the finished theme for review.

It is written for developers who know HTML, CSS, and JavaScript, but who may be new to Shopify themes. You don't need prior Shopify experience to follow along. Examples throughout this handbook use **Solis**, our current Theme Store project, but everything here applies to any Shopify theme we build in the future — this handbook isn't retired when Solis ships.

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

## A realistic first week

If you're joining the Solis project cold, here's roughly how the first week should go. This isn't a rigid schedule — it's here so you know what "on track" looks like.

| Day | What you should be doing |
|---|---|
| 1 | Read sections 1–2 in full. Get your Partner account, dev store, and Shopify CLI set up (see [Prerequisites & Setup](/getting-started/prerequisites-and-setup/)). |
| 2 | Read section 3. Clone the scaffold, get `shopify theme dev` running, poke around the existing codebase (if Solis already has code) or Skeleton Theme (if starting fresh). |
| 3 | Read section 4. Build one small, low-risk section end to end (see [Your First Section & Block](/scaffold-setup/first-section-and-block/)) to exercise the whole loop: code → preview → PR. |
| 4 | Read section 5. Set up your AI tool's rule files. Pair on a real ticket with a more senior teammate if one's available. |
| 5 | Open your first real PR against a real ticket. Expect review comments — that's the process working, not a sign you did something wrong. |

## Best practices

- Read sections 1–4 before writing any code, even if you're eager to jump in. An hour of reading saves days of rework caused by a wrong assumption about the architecture.
- Set up your AI tool's rule files (section 5) on day one, not after you've already written a dozen files the "wrong" way that now need fixing.
- Ask in the team channel before guessing on anything Shopify-specific — a five-minute question beats a half-day detour built on a wrong assumption.
- Keep this handbook open in a tab while you work. It's meant to be referenced constantly, not read once and forgotten.

## Common mistakes

- **Skipping straight to coding.** The architecture (theme blocks, section groups) is different enough from a typical web project that skipping the reading leads to code that has to be substantially reworked later.
- **Learning Shopify themes from random blog posts instead of this handbook or shopify.dev.** Many public tutorials — even recent-looking ones — still teach Dawn's older, section-only patterns. Following them will teach you patterns we don't use.
- **Assuming "it works on my dev store" means "it's done."** A change that works with your test data can still fail Theme Store review the moment it hits an empty collection or a 200-character title. See [Theme Store Requirements](/theme-store-requirements/) before you call anything finished.
- **Not asking when uncertain.** If a requirement or pattern in this handbook seems to conflict with what you're being asked to build, flag it — don't quietly guess and hope it's fine.

## Quick Reference

- This handbook targets **Horizon's architecture**, scaffolded from **Skeleton Theme** — never Dawn, never Horizon directly.
- No prior Shopify experience required — every section explains Shopify-specific terms the first time they appear.
- Sections 1–4 are read-once onboarding. Sections 5–8 are ongoing references.
- Examples use "Solis" as the working theme name, but this handbook applies to any theme project.

## Further Reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) — shopify.dev
- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
- [Horizon theme source](https://github.com/Shopify/horizon) — GitHub (reference only, not our scaffold)
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme) — GitHub (our actual scaffold)
