---
title: 8g. Writing Prompts That Work
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

## More before/after examples

### Fixing a bug

```text
❌ "The cart page is broken, fix it"

✅ "On the cart page, updating a line item's quantity doesn't refresh
cart.total_price — the line item total updates but the page-level total
stays stale until a full reload. Expected: the total updates immediately
after the quantity change, matching the pattern in sections/main-cart.liquid's
existing quantity handler."
```

### Adding a new setting

```text
❌ "Add a setting for the button color"

✅ "Add a color setting to blocks/button.liquid called button_background,
labeled 'Background color' (localized via t:), defaulting to
settings.color_primary. Follow the settings schema conventions in
/scaffold-setup/settings-schema-walkthrough/ — this is a block-level
setting, not a theme-level one, since each button block should be able
to differ."
```

### Refactoring for accessibility

```text
❌ "Make this accessible"

✅ "This custom dropdown in snippets/nav-dropdown.liquid uses <div>
elements with onclick handlers and no keyboard support. Convert it to
use a <button> to toggle, proper aria-expanded state, and Escape-to-close
with focus returning to the trigger button — matching the accessibility
checklist in /theme-store-requirements/accessibility/."
```

## When the AI tool gets it wrong

Don't just paste an error and ask "fix this." State what you expected vs. what happened:

```text
Expected: the "quote" block accepts @app blocks alongside quote blocks.
Actual: the schema only lists { "type": "quote" } — @app support is missing.
Add { "type": "@app" } to the section's blocks array.
```

This is faster to fix correctly than "this section is broken, fix it" — which invites the tool to change something unrelated.

## A prompting anti-pattern worth naming: "just make it work"

When a prompt is vague and the output doesn't work, the fastest-feeling fix is often "just make it work" or "try again" — but this tends to produce increasingly hacky patches rather than a correct fix, because the tool still doesn't know what "correct" means for this specific case. Stopping to write the specific expected-vs-actual prompt (as above) is almost always faster in total time than several rounds of "no, still broken, try again."

## Best practices

- Write the four required elements (object type, editable vs. fixed, unusual-content behavior, pattern to match) as an actual checklist before sending a prompt for anything non-trivial — it takes under a minute and consistently produces better first drafts.
- Point at real file paths when asking the tool to match an existing pattern — "like the header" is far weaker than "match the section-group pattern in sections/header-group.json."
- When correcting output, always state expected vs. actual explicitly, even for something that feels obvious in the moment.

## Common mistakes

- **Describing a desired outcome without stating constraints** ("make a nice testimonials section") and being surprised when the result doesn't match our architecture.
- **Repeating "try again" or "just fix it" several times** instead of stopping to write a specific expected-vs-actual correction.
- **Referencing a pattern from memory instead of a real file** ("like we did for the other carousel") when the AI tool has no actual access to what "the other carousel" looked like unless you point at it directly.

## Quick Reference

- State: object type, editable vs. fixed, unusual-content behavior, and which existing file to match.
- Point at real files, not vague descriptions ("like the other one").
- When correcting output, state expected vs. actual — not just "this is wrong."
- Resist "just make it work" loops — stop and write a specific correction instead.

## Further Reading

- [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) — this handbook
