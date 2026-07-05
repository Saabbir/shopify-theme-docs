---
title: Pull Requests & Review
description: Our PR template, and how to review AI-assisted code without rubber-stamping it.
---

## PR template

[Download `PULL_REQUEST_TEMPLATE.md`](/templates/github/PULL_REQUEST_TEMPLATE.md) and save it to `.github/PULL_REQUEST_TEMPLATE.md` in the repo — GitHub will apply it to every new PR automatically.

It asks for: what the PR does, a preview link or screenshots, and a checklist covering Theme Check, empty/long-content testing, keyboard navigation, locale strings, new dependencies, and AI-review sign-off.

## Writing a PR description that's actually reviewable

| ✅ Good PR description | ❌ Weak PR description |
|---|---|
| "Adds a testimonials section (heading + repeatable quote blocks). Tested with 0/1/10 blocks and a 300-char quote. Preview: [link]" | "Added testimonials" |
| "Fixes cart total not refreshing on quantity change — was missing a form re-submit trigger. Before/after video attached." | "Fixed cart bug" |
| "Bumps color contrast on the footer newsletter form to meet 4.5:1 — was 3.2:1 against the dark scheme. Screenshot attached." | "Accessibility fix" |

A reviewer without full context on your task should be able to understand what changed and why from the description alone, without opening every file in the diff first.

## Reviewing AI-assisted code

AI tools produce plausible-looking code fast — which means the usual "does it look reasonable" skim is not enough. Review AI output for these specifically:

- **Does it match our rules, or just generic Shopify patterns?** AI tools default to whatever's most common in their training data, which is often Dawn-era patterns (`{% include %}`, blocks defined locally instead of theme blocks). Check against [Codebase Structure](/codebase-structure/).
- **Did it invent scope?** AI assistants sometimes add "helpful" extras nobody asked for (an animation, an extra setting). Flag anything the prompt didn't ask for.
- **Does it handle empty/unusual content?** This is the single most common thing AI-generated sections get wrong — see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/).
- **Are schema strings localized?** AI tools frequently hardcode English directly instead of routing through `t:` locale keys.
- **Would this pass Theme Check?** Run it, don't guess.

### A realistic AI-assisted PR review, walked through

Say a PR adds a "Featured collection" section, built with Cursor. A thorough review checks, roughly in this order:

1. **Read the PR description** — does it state what was tested, or just "added the section"?
2. **Run `shopify theme check` locally**, even if CI already ran it — catch issues before reading code line by line.
3. **Open the preview link** and actually interact with it: change the collection, remove all blocks, add many blocks.
4. **Skim the schema** for hardcoded English strings and missing `presets`.
5. **Skim the Liquid** for `{% include %}` (should be `{% render %}`) and inline block definitions (should be `/blocks` files with `@theme` targeting).
6. **Check for scope creep** — did it also "helpfully" restyle an unrelated section?

This is a five-minute habit once it's routine, not a heavyweight process — but skipping any one of these six steps is exactly how a Dawn-era pattern or a missing edge-case handler slips through.

## Review checklist (for the reviewer)

- [ ] Ran `shopify theme check` locally — zero new offenses
- [ ] Opened the preview link and tested empty/long/many-block states
- [ ] Confirmed no hardcoded schema strings
- [ ] Confirmed no scope creep beyond what the PR describes
- [ ] Confirmed no new dependency without justification
- [ ] Tab-tested keyboard navigation on anything new

## Best practices

- Write your own PR description as if the reviewer has zero context beyond the ticket title — it consistently produces faster, better reviews.
- Actually click through the preview link during review, don't just read the diff — most content-variability bugs are invisible in a code read and obvious in thirty seconds of interaction.
- Call out in the PR description if a section was AI-assisted and what you already checked, so the reviewer knows where to focus additional scrutiny.

## Common mistakes

- **Writing a one-line PR description** ("added testimonials") that forces the reviewer to reverse-engineer intent from the diff alone.
- **Reviewing only the diff, never opening the live preview** — this is how empty-state and long-content bugs consistently slip through.
- **Approving AI-generated code faster than human-written code** on the assumption it's "probably fine" — in practice it needs the same or more scrutiny, specifically for Dawn-era pattern regressions and invented scope.

## Quick Reference

- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md`.
- AI-assisted code gets the same review rigor as human code — arguably more, since it's more likely to default to Dawn-era patterns or invent scope.
- Always click through the preview link, not just the diff.

## Further Reading

- [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) — this handbook
