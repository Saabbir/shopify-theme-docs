---
title: Getting Started
description: What this handbook is, who it's for, and how to use it.
---

This handbook is the one place our team goes to learn how to build a Shopify theme from scratch. It also covers how to get that theme approved on the [Shopify Theme Store](https://themes.shopify.com/). It walks you through everything, from your first day on the project to the day you submit the finished theme for review.

This handbook is written for developers who've already worked on a Shopify theme: you know Liquid, you've built sections, snippets, and blocks, and you're comfortable in the Shopify admin. It's not a Shopify or Liquid tutorial. It's the specific conventions, stricter Theme Store bar, and AI-assisted workflow this team uses. See [What This Handbook Covers](/getting-started/how-to-use-this-handbook/) for the full picture of who this is (and isn't) for. The examples use **Solis**, our current Theme Store project, but everything here applies to any Shopify theme we build in the future. This handbook won't get retired once Solis ships.

## What you'll build

We build things the way **Horizon** does. Horizon is Shopify's modern, block-based way of building themes, introduced in 2025. "Block-based" means the page is built from small, reusable pieces called blocks (think of a button, an image, or a text section) that a merchant can add, remove, or rearrange in the theme editor.

Horizon uses nested theme blocks (blocks placed inside other blocks), `@theme`/`@app` block targeting, and `{% stylesheet %}`/`{% javascript %}` tags. This is the current best-practice way to build a Shopify theme. Every code example in this handbook uses it instead of the older Dawn-era model, which only worked with sections and didn't support this kind of nesting.

:::caution[Horizon itself is not our scaffold]
Horizon is Shopify's own flagship theme (their main showcase theme). According to [Shopify's own README](https://github.com/Shopify/horizon), **themes based on, derived from, or built on top of Horizon can't be submitted to the Theme Store.** So we never clone Horizon.

Instead, we start from **[Skeleton Theme](https://github.com/Shopify/skeleton-theme)**, Shopify's official starter theme, which is allowed on the Theme Store. It's built the same modern way as Horizon: same folder layout, same `blocks/` directory, same schema patterns. So we get Horizon's way of building things, and a theme we're actually allowed to submit.

See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/) for the full explanation and setup steps.
:::

:::note[Why this matters]
Be careful with older Shopify tutorials or blog posts you find online. Many of them still teach Dawn's older, section-only model, and that approach is outdated for building a new theme today. If you're ever unsure which pattern to follow, trust this handbook and the official [shopify.dev](https://shopify.dev/docs/storefronts/themes) docs over older third-party guides.
:::

## How this handbook is organized

| # | Section | What it answers |
|---|---|---|
| 1 | Getting Started | You're here. Everything you need to set up before you write any code: editor, Prettier, AI rules, Git. |
| 2 | [Theme Store Requirements](/theme-store-requirements/) | What Shopify requires before they'll list your theme. |
| 3 | [Codebase Structure](/codebase-structure/) | How a theme's files and folders fit together. |
| 4 | [Scaffold Setup Guide](/scaffold-setup/) | Step-by-step: build your first section and block. |
| 5 | [Design System & Configuration](/design-system/) | Figma tokens, color/type system, presets, icons. |
| 6 | [Style Guides](/style-guides/) | CSS, JavaScript & Web Components, Liquid conventions. |
| 7 | [Performance & Accessibility](/performance-and-accessibility/) | Accessibility, performance strategy, media optimization. |
| 8 | [AI-Assisted Development](/ai-assisted-development/) | How we use Cursor / Claude Code, and how we go from Figma to code. |
| 9 | [GitHub Workflow](/github-workflow/) | Pull requests, review, and CI on this project. |
| 10 | [Quality & Validation](/quality-validation/) | Linting, testing, and the checklist before you open a PR. |
| 11 | [Publishing to Theme Store](/publishing/) | Packaging, submitting, and what happens after. |
| 12 | [Tooling & Config](/tooling-config/) | Project files, packaging exclusions, optional build setups. |
| 13 | [Learning Articles](/learning-articles/) | Deeper dives on CSS, JS, Liquid, locales, maintainable code. |
| 14 | [Reference](/reference/) | Cheatsheet, glossary, tools directory. |

Read section 1 in full before you touch any code, it's the setup you need in place first. Then read sections 2 to 4 in order, once, at the start of the project. After that, use this handbook as a reference instead of reading it front to back. Jump to whatever section answers your current question, or use the search bar (top left) to find a topic fast.

## A realistic first week

If you're joining the Solis project without any background on it, here's roughly how your first week should go. This isn't a strict schedule. It's here so you know what "on track" looks like.

| Day | What you should be doing |
|---|---|
| 1 | Read section 1 in full and complete its setup: Partner account, dev store, Shopify CLI, editor & Prettier, AI rule files, Git basics (see [Prerequisites & Setup](/getting-started/prerequisites-and-setup/) onward). |
| 2 | Read section 2. Clone the scaffold, get `shopify theme dev` running, poke around the existing codebase (if Solis already has code) or Skeleton Theme (if starting fresh). |
| 3 | Read section 3, then section 4. Build one small, low-risk section end to end (see [Your First Section & Block](/scaffold-setup/first-section-and-block/)) to try out the whole loop: code, then preview, then PR. |
| 4 | Pair on a real ticket with a more senior teammate if one's available. Skim [AI-Assisted Development](/ai-assisted-development/) for how we use AI tools day to day. |
| 5 | Open your first real PR against a real ticket. Expect review comments. That's the process working, not a sign that you did something wrong. |

## Best practices

- Finish section 1's setup before you write any code, even if you're eager to jump in. Working without your editor, Prettier, AI rules, and Git set up correctly costs you more time later than it saves now.
- Set up your AI tool's rule files on day one, as part of section 1 (see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/)). Don't wait until you've already written a dozen files the "wrong" way that now need fixing.
- Ask in the team channel before you guess on anything Shopify-specific. A five-minute question beats a half-day detour built on a wrong assumption.
- Keep this handbook open in a tab while you work. It's meant to be checked often, not read once and forgotten.

## Common mistakes

- **Skipping straight to coding.** The way we build things here (theme blocks, section groups) is different enough from a typical web project that skipping the reading leads to code you'll have to rework later.
- **Learning Shopify themes from random blog posts instead of this handbook or shopify.dev.** Many public tutorials, even ones that look recent, still teach Dawn's older, section-only patterns. Follow them, and you'll pick up patterns we don't use.
- **Assuming "it works on my dev store" means "it's done."** A change that works with your test data can still fail Theme Store review the moment it hits an empty collection or a 200-character title. Check [Theme Store Requirements](/theme-store-requirements/) before you call anything finished.
- **Not asking when you're uncertain.** If a requirement or pattern in this handbook seems to conflict with what you're being asked to build, flag it. Don't quietly guess and hope it's fine.

## Quick Reference

- This handbook follows **Horizon's way of building things**, but we scaffold from **Skeleton Theme**, never Dawn, and never Horizon directly.
- Written for developers who already know Liquid, sections/snippets/blocks, and the Shopify admin. This handbook covers our project-specific conventions and stricter Theme Store bar, not Shopify or Liquid fundamentals.
- Section 1 is setup, do it first. Sections 2–4 are read-once onboarding after that. Everything from section 5 onward is a reference you come back to as needed.
- Examples use "Solis" as the working theme name, but this handbook applies to any theme project.

## Further Reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) (shopify.dev)
- [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
- [Shopify Theme Store](https://themes.shopify.com/) — the storefront your finished theme gets submitted to
- [Horizon theme source](https://github.com/Shopify/horizon) (GitHub, reference only, not our scaffold)
- [Skeleton Theme source](https://github.com/Shopify/skeleton-theme) (GitHub, our actual scaffold)
