---
title: Writing Prompts That Work
description: Prompt patterns that consistently produce code that meets Theme Store requirements.
---

**TL;DR:** Prompt patterns that consistently produce code that meets Theme Store requirements.

The rule files covered in [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) set standing context. That's information the AI tool always has, in every conversation. The patterns on this page are different: they're for the prompt, the instructions you type in the moment you ask for something.

## The four things every theme-code prompt should state

1. **What Shopify object it's a section, block, or snippet for** (product, collection, generic content).
2. **What's merchant-editable versus fixed.** Which parts are settings or blocks, and which parts are hardcoded layout?
3. **How it should behave with unusual content.** Think empty state, very long text, many blocks versus zero blocks.
4. **Which existing pattern to match**, if one exists. Point at a real file. Don't describe it from memory.

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

The first prompt forces the AI tool to guess at the settings, at what counts as content, and at how edge cases should behave. You'll get something that looks right in a screenshot and breaks the moment a merchant actually uses it. The second prompt gives the tool everything it needs to get those three things right without guessing.

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

Don't just paste an error and ask "fix this." State what you expected versus what actually happened, like this:

```text
Expected: the "quote" block accepts @app blocks alongside quote blocks.
Actual: the schema only lists { "type": "quote" } — @app support is missing.
Add { "type": "@app" } to the section's blocks array.
```

This gets fixed correctly faster than "this section is broken, fix it" would. That kind of vague phrasing invites the tool to go change something unrelated.

## A prompting habit worth avoiding: "just make it work"

When a prompt is vague and the output doesn't work, the tempting quick fix is to say "just make it work" or "try again." But this tends to produce increasingly hacky patches instead of a real fix, because the tool still doesn't know what "correct" means for this specific case. Stopping to write the specific expected-versus-actual prompt, as shown above, is almost always faster overall than several rounds of "no, still broken, try again."

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Write out the four required pieces (object type, editable versus fixed, unusual-content behavior, pattern to match) as an actual checklist before sending a prompt for anything non-trivial. It takes under a minute and consistently produces better first drafts. | **Describing what you want without stating constraints** ("make a nice testimonials section") and being surprised when the result doesn't match how we build things. |
| Point at real file paths when asking the tool to match an existing pattern. "Like the header" is much weaker than "match the section-group pattern in sections/header-group.json." | **Repeating "try again" or "just fix it" several times** instead of stopping to write a specific expected-versus-actual correction. |
| When correcting output, always state expected versus actual clearly, even when it feels obvious in the moment. | **Referencing a pattern from memory instead of a real file** ("like we did for the other carousel") when the AI tool has no actual access to what "the other carousel" looked like, unless you point it there directly. |

## Key takeaways
- State: object type, editable versus fixed, unusual-content behavior, and which existing file to match.
- Point at real files, not vague descriptions ("like the other one").
- When correcting output, state expected versus actual, not just "this is wrong."
- Resist "just make it work" loops. Stop and write a specific correction instead.

## Further reading

- [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) - this handbook
