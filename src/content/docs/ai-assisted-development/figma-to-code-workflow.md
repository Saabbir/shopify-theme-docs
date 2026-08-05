---
title: Figma to Code Workflow
description: A repeatable process for turning a Figma frame into a working section, with Cursor or Claude Code.
---

A Figma frame is a design file made in the tool Figma. It shows one possible version of your content, filled in with example text and images. It isn't a strict spec (a fixed set of rules the code must follow).

That difference matters a lot. A real merchant might type a 200-character product title, leave a collection empty, or delete every block but one. If your code only works for the neat example in the Figma frame, it will break the moment real data touches it. This page gives you a repeatable process so that doesn't happen.

## The end-to-end loop: plan → build → check → fix → document → report

When you hand Cursor or Claude Code (two AI coding tools) a Figma frame, plus a clear prompt (the instructions you type), the tool should work through six steps, in order, every time. You can share the frame as a link, a selection, or a screenshot. See [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for how to connect Figma to your AI tool.

Here's what each step does and why it exists on its own:

| Step | What happens | Why it's a separate step |
|---|---|---|
| **1. Plan** | Break down the frame (Step 1 below): separate content from structure, work out the block breakdown, and pull out the values you'll need. State the plan back before writing any code, listing the settings, block types, and how it should behave on different screen sizes. | This catches a wrong guess (for example, "this should be one setting, not three") while it's still a one-line fix, not a full rewrite. |
| **2. Build** | Generate the section, block, and snippet files to match the plan you stated, following the rules in `AGENTS.md` (the command points to that file instead of keeping its own copy of the rules). | N/A |
| **3. Check** | Run `shopify theme check` against the new or changed files. | This catches schema mistakes, outdated patterns, and accessibility issues automatically, before a human reviewer has to spot them by eye. |
| **4. Fix** | Hand this off to the `theme-check-fixer` [subagent](/ai-assisted-development/claude-code-subagents/) (a separate, focused AI helper) instead of fixing issues one by one yourself. Don't stop once the errors are gone. Every warning needs to be fixed or clearly explained. | This keeps issue-by-issue noise out of your main conversation, and the subagent only has access to the tools it needs for this one job. |
| **5. Document** | Write a short build record to `docs/sections/<name>.md`, `docs/blocks/<name>.md`, or `docs/snippets/<name>.md` (whichever you actually built). Include the Figma source, the final settings and blocks, any assumptions you made, and the result of `theme check`. | This is a record for a future developer who wasn't part of this conversation. They can't just reconstruct it from the code changes alone. |
| **6. Report** | Give a short summary in the conversation: what you built, what became a setting versus what stayed fixed structure, any assumption you made where the frame was unclear, confirmation that `theme check` is clean, and the path to the doc file from Step 5. | This gives the human reviewer exactly what they need to check your work quickly. It's not a full recap of every file, just the decisions that need a second opinion. |

This six-step loop is exactly what [`/figma-to-liquid`](/ai-assisted-development/claude-code-custom-commands/) automates as a single Claude Code command. Despite Step 1's "block breakdown" language, not every frame needs a full section. A small reusable piece is often just a block or a snippet, and Step 1 is where that call gets made. See that page for the actual command file and how to adapt it for other jobs you do often. Note that `docs/sections/`, `docs/blocks/`, and `docs/snippets/` are dev documentation, not theme code. See [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/) for how to leave them out of a submission zip.

:::tip[Why "plan first" isn't optional]
Skipping straight to "build" on an unclear frame is the single most common way this workflow goes wrong. The tool will make a plausible-looking guess (often hardcoding a value where a setting should go), and you won't notice until a reviewer finds out it isn't editable in the theme editor. If you state the plan back first, that guess turns into a one-line correction instead of a full rewrite.
:::

## Step 1: Break down the frame (before opening your editor)

- List every distinct visual pattern you see: heading style, card, button, media treatment. Check whether it already exists in the theme first. Reuse it before you rebuild it.
- Separate **merchant content** (things that should become a setting or block) from **fixed structure** (things that should stay as fixed markup and CSS).
- Check Figma for mobile, tablet, and desktop versions. If they're missing, ask your designer for them. Don't guess at how the section should behave on different screens.
- Decide the block breakdown: which pieces should be independent blocks a merchant can reorder, and which are fixed parts of the section that never move.

### A worked example

Say your designer hands you a "Featured Collection" frame. It has a heading, a short intro paragraph, and a row of 4 product cards.

| Element | Merchant content or structure? | Becomes |
|---|---|---|
| Heading text | Content, changes per use | Section setting (`text`) |
| Intro paragraph | Content, optional | Section setting (`richtext`), with a check for blank content |
| Number of products shown | Content, merchant's choice | Section setting (`range`, 2 to 8) |
| Which collection to pull from | Content | Section setting (`collection`) |
| Product card layout (image, title, price) | Structure, same every time | Fixed markup, reused through a `product-card` snippet |
| Grid gap and columns | Structure, but changes by screen size | Fixed CSS with a container query, not a setting |

Not everything becomes a setting. The product card's internal layout is fixed structure. It's reused through a snippet, not something a merchant sets up each time.

## Step 2: Pull out design values

Before you write any CSS, pull the exact values out of Figma. If your team uses Figma variables (a way to store reusable design values inside Figma), use those instead of eyeballing the numbers.

| Value | Where it goes |
|---|---|
| Colors | `config/settings_schema.json` color settings, or CSS custom properties if merchants shouldn't edit them |
| Spacing scale | CSS custom properties (`--space-sm`, `--space-md`, and so on) |
| Type scale | CSS custom properties, or a `font_picker` plus a `range` size setting |
| Corner radius and shadows | CSS custom properties |

Don't hardcode a hex color or a pixel spacing number straight into a section's CSS if that same value is used somewhere else. Pull it out as a reusable value first.

```css
/* ❌ WRONG — a hardcoded value copied from Figma's inspector panel,
   repeated in every section that happens to need similar spacing */
.featured-collection { padding: 64px 24px; }
.testimonials { padding: 64px 24px; }

/* ✅ RIGHT — one value, referenced everywhere, easy to adjust globally later */
:root { --space-section-y: 4rem; --space-section-x: 1.5rem; }
.featured-collection { padding: var(--space-section-y) var(--space-section-x); }
.testimonials { padding: var(--space-section-y) var(--space-section-x); }
```

## Step 3: Prompt your AI tool with the breakdown, not just the screenshot

If you hand an AI tool a raw screenshot and just say "build this," you'll get a section locked to those exact pixels. A merchant won't be able to edit it. Instead, give it the breakdown you made in Step 1, like this:

```text
Build a Shopify theme section called "testimonials" for solis (Skeleton Theme
base, Horizon-era block architecture — see .cursor/rules).

Content breakdown:
- Section-level: heading (text setting), color scheme (color_scheme setting)
- Block (repeatable, type "quote"): quote text (richtext), author (text)
- Blocks should nest inside the section using @theme block targeting so
  merchants can add/reorder/remove testimonials freely.

Responsive behavior: grid of cards, auto-fit down to 1 column below 480px
(see attached mobile frame).

Follow the schema and naming conventions in /codebase-structure/ and the
Theme Store requirement that content must degrade gracefully (empty state,
very long text) — see /theme-store-requirements/store-and-design/.
```

This gives the AI tool the same three things a human developer would need: what's editable by the merchant, what's fixed, and how it should behave when the content changes.

### The screenshot-only prompt, and what typically comes back

```text
❌ "Build this section" [attaches a Figma screenshot]
```

If you give the AI tool only this, it will typically produce hardcoded text instead of settings, and a layout that doesn't account for a different number of blocks. It often falls back to an old-style inline-block pattern too, since that pattern shows up more often in its training data than the current nested theme blocks approach. None of this is a made-up worst case. It's the predictable result of a vague prompt, and it's exactly why the breakdown in Step 1 matters more than how you word the prompt.

## Step 4: Build it, then stress-test with unlikely content

Once the AI tool produces the section, test it with:

- A 200-character heading
- Zero blocks added
- 10 or more blocks added
- The longest realistic quote text you can imagine

If any of these break the layout, that's a bug to fix before you move on, not an edge case you can skip. The [uniqueness and design requirements](/theme-store-requirements/store-and-design/) specifically call out "layouts that look intentional... even when content length... varies" as something reviewers check for.

## Step 5: Review it like any other AI output

Treat AI-generated Liquid, CSS, or JS exactly like a human's first draft. See [AI Code Review Checklist](/github-workflow/pull-requests-and-review/) in GitHub Workflow. Don't skip review just because "the AI probably got it right." Check specifically for:

- Old-style patterns (inline section blocks, `{% include %}`) instead of our current approach
- Hardcoded English text instead of `t:` locale keys
- Missing checks for blank optional content
- Code that looks suspiciously close to a public Horizon or Dawn section (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/))

## Best practices

- Do the breakdown from Step 1 on paper or in a doc before you open your AI tool at all. Jumping straight to a prompt almost always produces a worse first draft than five minutes of upfront thinking would.
- Pull out design values once per design system update, not once per section. A section that hardcodes a value "just this once" is how values drift apart over time.
- Keep a short list of your team's 3 to 4 most common stress tests (empty state, long text, many blocks, zero blocks) somewhere visible, and run all of them on every new AI-generated section, no exceptions.

## Common mistakes

- **Prompting from a screenshot alone**, skipping the breakdown step, then spending more time fixing the result than the breakdown would have taken.
- **Accepting a section that looks pixel-perfect without testing how it handles different content.** It often looks done because the demo data happens to fit well, not because the section actually handles variation.
- **Not pulling out design values**, which leads to the same spacing or color value hardcoded in several places. Over time, one gets tweaked and the others don't, and they drift apart.

## Quick Reference

- The loop, every time: **plan, build, check, fix (handed off), document, report.** See the table at the top of this page.
- Break it down before prompting: content versus structure, block breakdown, responsive versions.
- Pull out design values (color, spacing, type) before writing CSS. A Figma MCP connection gives you exact values instead of eyeballing them.
- Prompt with the breakdown, not just a screenshot.
- Stress-test with empty, very-long, and very-many-blocks content before calling it done.
- Use [`/figma-to-liquid`](/ai-assisted-development/claude-code-custom-commands/) to run this whole loop as one command instead of typing it out each time.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) (shopify.dev)
