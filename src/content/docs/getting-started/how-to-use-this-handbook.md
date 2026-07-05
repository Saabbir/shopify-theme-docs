---
title: What This Handbook Covers
description: Who this is for and how to get the most out of it.
---

## Who this is for

A developer who's comfortable with HTML, CSS, and JavaScript, joining a Shopify theme project for the first time. You don't need to have shipped a Shopify theme before. If you've built a static site or a component-based frontend, most of the concepts here will feel familiar with new names attached to them.

This handbook assumes:

- You can read and write HTML, CSS, and JavaScript comfortably.
- You've used Git and GitHub before, even if only for smaller projects.
- You have **not** necessarily used Liquid, worked with a CMS-driven templating system, or built for a platform where a non-technical merchant customizes your code through a visual editor. That's the genuinely new part, and this handbook spends the most time there.

## What "Solis" is

Solis is the Shopify theme this team is building for submission to the Shopify Theme Store. This handbook is not Solis's codebase — it's the separate reference site that teaches you how to build it (and any future theme) the right way. Solis's actual code lives in its own repository; this handbook links out to real examples but doesn't contain the theme's source.

Every code example in this handbook that needs a concrete theme name uses "Solis" — for example, a `theme_name` in `settings_schema.json`, or a section comment like `{% comment %} solis/sections/testimonials.liquid {% endcomment %}`. If we start a second theme project later, swap the name; the patterns don't change.

## How to read this

- **Sections 1–4** are onboarding. Read them once, in order, in your first few days.
- **Sections 5–8** are references you'll come back to throughout the project — AI tooling setup, Git workflow, QA, and the Theme Store submission process.
- Every major page ends with a **Quick Reference** (the key takeaways in one glance) and **Further Reading** (official Shopify docs to go deeper).
- Code examples always show the Horizon-era pattern. Where an older ("legacy") pattern is worth knowing because you'll see it in existing code or tutorials, it's explicitly labeled **Old pattern** next to the current one — never presented as something to write today.
- Wherever a rule has a right way and a wrong way, we show both side by side, labeled **✅ Right** and **❌ Wrong** (or **Do** / **Avoid**), rather than just describing the right way in prose. If you only remember one convention from this handbook, remember to look for these pairs — they're the fastest way to absorb a rule.

## How the do/don't formatting works

Throughout this handbook you'll see three recurring patterns for flagging what to do and what to avoid:

- A **checklist** (☑ / ☒) for a flat list of independent requirements — used heavily in [Theme Store Requirements](/theme-store-requirements/).
- A **✅ Right / ❌ Wrong code pair** for showing the same problem solved two ways — used throughout [Codebase Structure](/codebase-structure/) and [Scaffold Setup](/scaffold-setup/).
- A colored **aside** (`:::tip`, `:::caution`, `:::danger`) for a single important callout that doesn't need a full list or code sample.

None of these are decorative — if something is marked ❌ Wrong or flagged in a `:::danger`, treat it as a real constraint, not a style suggestion.

## Best practices for getting value out of this handbook

- Bookmark [Theme Store Requirements](/theme-store-requirements/) specifically — you'll reference it more than any other section, often mid-PR when double-checking a rule.
- Use search (**⌘K**) instead of scrolling — this handbook is built to be searched, not read top to bottom after your first week.
- When an AI tool generates code for you, mentally check it against the relevant handbook page before accepting it — see [AI-Assisted Development](/ai-assisted-development/) for why this matters more than it might seem.
- If you find a gap — a case this handbook doesn't cover — raise it with the team instead of guessing and moving on. Gaps get fixed by being reported, not by being silently worked around.

## Common mistakes

- **Treating this as a one-time read.** The handbook is written to be revisited constantly. Reading it once in week one and never again means missing updates and forgetting details you didn't need yet.
- **Skimming past the ✅/❌ code pairs.** They're not filler — they usually encode the single most common mistake on that topic.
- **Ignoring a `:::danger` or `:::caution` box because the surrounding text seems optional.** These are reserved for things that cause real failures (a rejected Theme Store submission, a broken merchant install) — they're flagged that strongly on purpose.

## Quick Reference

- New here? Read Getting Started → Theme Store Requirements → Codebase Structure → Scaffold Setup Guide, in that order.
- Everything after that is a reference — use search, not linear reading.
- Look for ✅/❌ pairs and colored asides — they carry the highest-signal information on each page.

## Further Reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) — shopify.dev
