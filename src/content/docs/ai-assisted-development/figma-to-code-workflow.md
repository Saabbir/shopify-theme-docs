---
title: 8f. Figma to Code Workflow
description: A repeatable process for turning a Figma frame into a working section, with Cursor or Claude Code.
---

A Figma frame shows one possible content state — not a spec. This process exists so a 200-character product title, an empty collection, or a merchant who deletes every block but one doesn't break the section the moment real data touches it.

## The end-to-end loop: plan → build → check → fix → report

When you hand Cursor or Claude Code a Figma frame (link, selection, or screenshot — see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/)) plus a structured prompt, the tool should work through five stages, in order, every time:

| Stage | What happens | Why it's a separate stage |
|---|---|---|
| **1. Plan** | Decompose the frame (Step 1 below): content vs. chrome, block breakdown, tokens to extract. State the plan back before writing code — settings list, block types, responsive behavior. | Catches a wrong assumption (e.g. "this should be one setting, not three") while it's a one-line fix, not a rewrite. |
| **2. Build** | Generate the section/block/snippet files against the stated plan. | — |
| **3. Check** | Run `shopify theme check` against the new/changed files. | Catches schema mistakes, deprecated patterns, and accessibility offenses mechanically, before a human reviewer has to catch them by eye. |
| **4. Fix** | Resolve every offense `theme check` reported. Don't stop at "no more errors" — re-read the offenses that were warnings, not just errors. | An unresolved warning today is a known issue merged into the codebase; fix it now while context is loaded, not in a future cleanup pass that may never happen. |
| **5. Report** | A short summary: what was built, what became a setting vs. fixed chrome, any assumption made where the frame was ambiguous, and confirmation `theme check` is clean. | Gives the human reviewer exactly what they need to review quickly — not a full recap of every file, just the decisions that need a second opinion. |

This is exactly the loop [`/figma-to-section`](/ai-assisted-development/claude-code-custom-commands/) automates as a single Claude Code command — see that page for the actual command file and how to adapt it for other repetitive jobs.

:::tip[Why "plan first" isn't optional]
Skipping straight to "build" on an ambiguous frame is the single most common way this workflow goes wrong — the tool makes a plausible-looking guess (often a hardcoded value where a setting belongs), and that guess isn't visible until a reviewer notices it's not editable in the theme editor. Stating the plan back first turns that guess into a one-line correction instead of a rewrite.
:::

## Step 1: Decompose the frame (before opening your editor)

- List every distinct visual pattern (heading style, card, button, media treatment). Check whether it already exists in the theme — reuse before rebuilding.
- Separate **merchant content** (should become a setting or block) from **structural chrome** (should stay fixed markup/CSS).
- Check Figma for mobile/tablet/desktop variants. If they're missing, ask design for them — don't guess a responsive behavior.
- Decide the block breakdown: which pieces should be independent, reorderable blocks vs. fixed parts of the section.

### A worked decomposition example

Say design hands you a "Featured Collection" frame: a heading, a short intro paragraph, and a row of 4 product cards.

| Element | Merchant content or chrome? | Becomes |
|---|---|---|
| Heading text | Content, varies per use | Section setting (`text`) |
| Intro paragraph | Content, optional | Section setting (`richtext`), with a blank check around it |
| Number of products shown | Content, merchant choice | Section setting (`range`, 2–8) |
| Which collection to pull from | Content | Section setting (`collection`) |
| Product card layout (image, title, price) | Chrome — same every time | Fixed markup, reused via a `product-card` snippet |
| Grid gap/columns | Chrome, but responsive | Fixed CSS with a container query, not a setting |

Notice not everything becomes a setting — the product card's internal layout is chrome, reused via a snippet, not something merchants configure per use.

## Step 2: Extract design tokens

Pull exact values out of Figma (or the design system's Figma variables, if your team uses them) before writing any CSS:

| Token | Where it goes |
|---|---|
| Colors | `config/settings_schema.json` color settings, or CSS custom properties if not merchant-editable |
| Spacing scale | CSS custom properties (`--space-sm`, `--space-md`...) |
| Type scale | CSS custom properties or a `font_picker` + `range` size setting |
| Radii/shadows | CSS custom properties |

Don't hardcode a hex value or a pixel spacing number directly in a section's CSS if the same value is reused elsewhere — extract it as a token first.

```css
/* ❌ WRONG — a hardcoded value copied from Figma's inspector panel,
   repeated in every section that happens to need similar spacing */
.featured-collection { padding: 64px 24px; }
.testimonials { padding: 64px 24px; }

/* ✅ RIGHT — one token, referenced everywhere, easy to adjust globally later */
:root { --space-section-y: 4rem; --space-section-x: 1.5rem; }
.featured-collection { padding: var(--space-section-y) var(--space-section-x); }
.testimonials { padding: var(--space-section-y) var(--space-section-x); }
```

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

### The screenshot-only prompt, and what typically comes back

```text
❌ "Build this section" [attaches a Figma screenshot]
```

An AI tool given only this will typically produce: hardcoded text instead of settings, a layout with no consideration for a different number of blocks, and often the Dawn-era inline-block pattern (since that's more common in training data than nested theme blocks). None of this is a fabricated worst case — it's the predictable result of an underspecified prompt, which is exactly why Step 1's decomposition matters more than the prompt wording itself.

## Step 4: Implement, then stress-test with unlikely content

Once the AI tool produces the section, test it with:

- A 200-character heading
- Zero blocks added
- 10+ blocks added
- The longest realistic quote text you can imagine

If any of these break the layout, that's a bug to fix before moving on — not an edge case to ignore. The [uniqueness and design requirements](/theme-store-requirements/store-and-design/) explicitly call out "layouts that look intentional... even when content length... varies" as a review criterion.

## Step 5: Review like any other AI output

Treat AI-generated Liquid/CSS/JS exactly like a human's first draft — see [AI Code Review Checklist](/github-workflow/pull-requests-and-review/) in GitHub Workflow. Don't skip review because "the AI probably got it right." Specifically check for:

- Dawn-era patterns (inline section blocks, `{% include %}`) instead of our current conventions
- Hardcoded English strings instead of `t:` locale keys
- Missing blank-value guards around optional content
- Code that looks suspiciously close to a public Horizon/Dawn section (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/))

## Best practices

- Do the decomposition (Step 1) on paper or in a doc before opening your AI tool at all — rushing straight to a prompt almost always produces a worse first draft than five minutes of upfront thinking.
- Extract design tokens once per design system update, not per section — a section that hardcodes a value "just this once" is how token drift starts.
- Keep a short list of your team's 3–4 most common stress tests (empty state, long text, many blocks, zero blocks) somewhere visible, and run all of them on every new AI-generated section without exception.

## Common mistakes

- **Prompting from a screenshot alone**, skipping the decomposition step, then spending more time fixing the result than the decomposition would have taken.
- **Accepting a pixel-perfect-looking section without testing content variability** — it often looks done because the demo data happens to fit well, not because the section actually handles variation.
- **Not extracting design tokens**, leading to the same spacing/color value hardcoded independently in several places, which then drift apart over time as one gets tweaked and the others don't.

## Quick Reference

- The loop, every time: **plan → build → check → fix → report** — see the table at the top of this page.
- Decompose before prompting: content vs. chrome, block breakdown, responsive variants.
- Extract design tokens (color, spacing, type) before writing CSS — a Figma MCP connection gives you exact values instead of eyeballing them.
- Prompt with the decomposition, not just a screenshot.
- Stress-test with empty/very-long/very-many-blocks content before calling it done.
- Use [`/figma-to-section`](/ai-assisted-development/claude-code-custom-commands/) to run this whole loop as one command instead of typing it out each time.

## Further Reading

- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start) — shopify.dev
