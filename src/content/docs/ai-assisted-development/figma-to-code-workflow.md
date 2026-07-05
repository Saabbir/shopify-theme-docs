---
title: 5b. Figma to Code Workflow
description: A repeatable process for turning a Figma frame into a working section, with Cursor or Claude Code.
---

A Figma frame shows one possible content state — not a spec. This process exists so a 200-character product title, an empty collection, or a merchant who deletes every block but one doesn't break the section the moment real data touches it.

## Step 1: Decompose the frame (before opening your editor)

- List every distinct visual pattern (heading style, card, button, media treatment). Check whether it already exists in the theme — reuse before rebuilding.
- Separate **merchant content** (should become a setting or block) from **structural chrome** (should stay fixed markup/CSS).
- Check Figma for mobile/tablet/desktop variants. If they're missing, ask design for them — don't guess a responsive behavior.
- Decide the block breakdown: which pieces should be independent, reorderable blocks vs. fixed parts of the section.

## Step 2: Extract design tokens

Pull exact values out of Figma (or the design system's Figma variables, if your team uses them) before writing any CSS:

| Token | Where it goes |
|---|---|
| Colors | `config/settings_schema.json` color settings, or CSS custom properties if not merchant-editable |
| Spacing scale | CSS custom properties (`--space-sm`, `--space-md`...) |
| Type scale | CSS custom properties or a `font_picker` + `range` size setting |
| Radii/shadows | CSS custom properties |

Don't hardcode a hex value or a pixel spacing number directly in a section's CSS if the same value is reused elsewhere — extract it as a token first.

## Step 3: Prompt your AI tool with the decomposition, not the screenshot alone

Handing an AI tool a raw screenshot and saying "build this" produces a pixel-locked, non-merchant-editable section. Instead:

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

This gives the AI tool the same three things a human developer needs: what's merchant-editable, what's fixed, and how it behaves when content varies.

## Step 4: Implement, then stress-test with unlikely content

Once the AI tool produces the section, test it with:

- A 200-character heading
- Zero blocks added
- 10+ blocks added
- The longest realistic quote text you can imagine

If any of these break the layout, that's a bug to fix before moving on — not an edge case to ignore. The [uniqueness and design requirements](/theme-store-requirements/store-and-design/) explicitly call out "layouts that look intentional... even when content length... varies" as a review criterion.

## Step 5: Review like any other AI output

Treat AI-generated Liquid/CSS/JS exactly like a human's first draft — see [AI Code Review Checklist](/github-workflow/pull-requests-and-review/) in GitHub Workflow. Don't skip review because "the AI probably got it right."

## Quick Reference

- Decompose before prompting: content vs. chrome, block breakdown, responsive variants.
- Extract design tokens (color, spacing, type) before writing CSS.
- Prompt with the decomposition, not just a screenshot.
- Stress-test with empty/very-long/very-many-blocks content before calling it done.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) — shopify.dev
