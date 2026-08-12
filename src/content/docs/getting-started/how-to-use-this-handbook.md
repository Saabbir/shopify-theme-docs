---
title: What This Handbook Covers
description: Who this is for and how to get the most out of it.
---

**TL;DR:** Who this is for and how to get the most out of it.

## Who this is for

This handbook is for developers who've already shipped work on a Shopify theme: you've built or edited sections, snippets, and blocks, you know your way around Liquid, and you're comfortable in the Shopify admin. It's not an introduction to Shopify theming, and it's not written for a frontend developer who hasn't touched Liquid before.

This handbook assumes:

- You can read and write Liquid, JSON schema, and standard HTML/CSS/JS without it being explained from scratch.
- You've worked with sections, snippets, blocks, and the theme editor before, on this project or another Shopify theme.
- You're comfortable with Git and GitHub, and with the Shopify admin's theme and settings pages.

What it doesn't assume is any of that experience with *this specific project*. Solis has its own conventions, stricter Theme Store requirements than a typical client theme, and an AI-assisted workflow with its own rules. That's what this handbook actually teaches: our conventions, our stricter Theme Store bar, and the reasoning behind both, not general Shopify or Liquid fundamentals.

## What "Solis" is

Solis is the Shopify theme this team is building to submit to the Shopify Theme Store. This handbook is not Solis's codebase (the actual files that make up the theme). It's a separate reference site that teaches you how to build Solis, and any future theme, the right way. Solis's actual code lives in its own repository. This handbook links out to real examples, but it doesn't contain the theme's source code.

Whenever a code example needs a real theme name, we use "Solis." For example, you'll see it as a `theme_name` in `settings_schema.json`, or in a section comment like `{% comment %} solis/sections/testimonials.liquid {% endcomment %}`. If we start a second theme project later, just swap the name. The patterns stay the same.

## How to read this

See the [Overview](/getting-started/) page for the full section-by-section breakdown and reading order. Beyond that map, a few conventions apply throughout:

- Every major page ends with **Do / Don't** (the do's and don'ts side by side) and **Further reading** (official Shopify docs to go deeper). Longer or denser pages also get a **Key takeaways** section, a one-glance summary.
- Code examples always show the current, Horizon-era pattern. Sometimes an older ("legacy") pattern is worth knowing about, because you'll run into it in existing code or old tutorials. When that happens, it's labeled **Old pattern** right next to the current one. It's shown so you can recognize it, never so you write it today.
- Wherever a rule has a right way and a wrong way, we show both side by side, labeled **✅ Right** and **❌ Wrong**, instead of just describing the right way in words. If you only remember one thing from this handbook, remember to look for these pairs. They're the fastest way to learn a rule.

## How the do/don't formatting works

Throughout this handbook you'll see four recurring patterns for flagging what to do and what to avoid:

- A **✅ Do / ❌ Don't table** at the end of most pages, pairing each recommended practice with the mistake it prevents.
- A **checklist** (☑ / ☒) for a flat list of independent requirements, used heavily in [Theme Store Requirements](/theme-store-requirements/).
- A **✅ Right / ❌ Wrong code pair** for showing the same problem solved two ways, used throughout [Codebase Structure](/codebase-structure/) and [Scaffold Setup](/scaffold-setup/).
- A colored **aside** (`:::tip`, `:::caution`, `:::danger`) for a single important callout that doesn't need a full list or code sample.

None of these are just decoration. If something is marked ❌ Wrong or flagged in a `:::danger` box, treat it as a real rule, not a suggestion.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Bookmark [Theme Store Requirements](/theme-store-requirements/). You'll come back to it more than any other section, often in the middle of a PR when you're double-checking a rule. | **Treating this as a one-time read.** This handbook is meant to be revisited often. If you read it once in week one and never again, you'll miss updates and forget details you didn't need at the time. |
| Use search (**⌘K**) instead of scrolling. This handbook is built to be searched, not read top to bottom, after your first week. | **Skimming past the ✅/❌ code pairs.** They're not filler. They usually show the single most common mistake on that topic. |
| When an AI tool generates code for you, check it against the relevant handbook page before you accept it. See [AI-Assisted Development](/ai-assisted-development/) for why this matters more than you'd think. | **Ignoring a `:::danger` or `:::caution` box because the text around it seems optional.** These boxes are reserved for things that cause real failures, like a rejected Theme Store submission or a broken merchant install. They're flagged that strongly on purpose. |
| If you find a gap, something this handbook doesn't cover, tell the team instead of guessing and moving on. Gaps only get fixed when someone reports them, not when someone quietly works around them. | — |

## Further reading

- [Shopify themes overview](https://shopify.dev/docs/storefronts/themes) (shopify.dev)
