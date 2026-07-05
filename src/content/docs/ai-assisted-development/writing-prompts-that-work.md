---
title: 5c. Writing Prompts That Work
description: Prompt patterns that consistently produce Theme-Store-compliant code.
---

The rule files in [5a](/ai-assisted-development/setting-up-ai-rules/) set standing context. These patterns are for the prompt you type in the moment.

## The four things every theme-code prompt should state

1. **What Shopify object it's a section/block/snippet for** (product, collection, generic content).
2. **What's merchant-editable vs. fixed** — which parts are settings/blocks, which parts are hardcoded layout.
3. **How it should behave with unusual content** — empty state, very long text, many vs. zero blocks.
4. **Which existing pattern to match**, if one exists — point at a real file, don't describe it from memory.

## Template

```text
Build a Shopify [section/block/snippet] for [purpose].

Merchant-editable: [list settings/blocks]
Fixed: [list what's hardcoded]
Unusual content to handle gracefully: [empty state / long text / etc.]
Match existing patterns in: [file path, if applicable]
Constraints: [[Skeleton Theme base, Horizon block architecture, no Sass,
  accessibility requirements — usually already covered by your rule files,
  restate only if this request is unusual]]
```

## Before / after

```text
❌ "Add a testimonials section like the one in the screenshot"

✅ "Build a Shopify theme section called testimonials.liquid. Merchant-
editable: heading (text), color scheme, and a repeatable 'quote' block
(quote text as richtext, author as text) that merchants can add/remove/
reorder via @theme block targeting. Fixed: the grid layout (CSS grid,
auto-fit, min 240px columns). Handle zero blocks (show nothing, no empty
container) and very long quotes (no fixed height, let cards grow). Match
the schema conventions in sections/main-product.liquid for @app block
support."
```

The first prompt forces the AI tool to guess at settings, content boundaries, and edge-case behavior — you'll get something that looks right in a screenshot and breaks the moment a merchant actually uses it. The second gives it everything it needs to get those three things right without a guess.

## When the AI tool gets it wrong

Don't just paste an error and ask "fix this." State what you expected vs. what happened:

```text
Expected: the "quote" block accepts @app blocks alongside quote blocks.
Actual: the schema only lists { "type": "quote" } — @app support is missing.
Add { "type": "@app" } to the section's blocks array.
```

This is faster to fix correctly than "this section is broken, fix it" — which invites the tool to change something unrelated.

## Quick Reference

- State: object type, editable vs. fixed, unusual-content behavior, and which existing file to match.
- Point at real files, not vague descriptions ("like the other one").
- When correcting output, state expected vs. actual — not just "this is wrong."

## Further Reading

- [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) — this handbook
