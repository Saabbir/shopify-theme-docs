---
title: Quality & Validation
description: Linting, manual QA, and the final pre-submission pass.
---

Three layers of quality checking, roughly in order of when you run them:

1. **Linting** — runs constantly as you code, and again in CI on every PR.
2. **Manual QA** — runs per-feature, whenever a section/page changes meaningfully.
3. **Pre-submission checklist** — runs once, right before you submit to the Theme Store.

## What's on this page group

- [Theme Check & Linting](/quality-validation/theme-check-and-linting/) — automated, objective rule enforcement.
- [Manual QA Checklist](/quality-validation/manual-qa-checklist/) — testing real pages with real (and unusual) content.
- [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) — the final gate before you submit.

## Why three layers, not one

Each layer catches a different class of problem, and none of them substitutes for the others:

| Layer | Catches | Misses |
|---|---|---|
| Linting (Theme Check) | Syntax errors, deprecated tags, missing translation keys, structural schema errors | Whether a layout actually looks right with real content |
| Manual QA | Broken layouts, missing empty states, keyboard-navigation gaps | Whether the whole submission meets every Theme Store requirement |
| Pre-submission checklist | Full-requirement coverage right before shipping | Bugs introduced *after* the last time you ran it |

A theme that passes linting can still fail manual QA. A theme that passes manual QA on the sections you tested can still fail the pre-submission checklist because of a requirement (like documentation, or a `theme_info` block) that neither of the other two layers touches. Run all three, not just whichever feels most convenient.

## Best practices

- Run linting continuously (it's nearly free), manual QA per feature (it's proportional to what changed), and the pre-submission checklist exactly once, comprehensively, right before you submit.
- Don't treat a passing CI run as equivalent to "QA is done" — see the table above for what CI specifically doesn't catch.
- Re-run the pre-submission checklist after any late change, even a "small" one — a last-minute tweak is a common way a previously-passing item quietly breaks.

## Common mistakes

- **Treating linting as sufficient QA** because it runs automatically and manual QA takes deliberate effort.
- **Running manual QA once early in a section's development and never again**, missing regressions introduced by later, unrelated changes.
- **Skipping the pre-submission checklist because "we already checked all this along the way."** Requirements interact, and a change late in the project can silently break something checked off weeks earlier.

## Quick Reference

- Linting catches syntax/style issues automatically. It can't tell you if a layout looks broken with a 200-character title — that's manual QA's job.
- Manual QA catches layout and content-handling bugs. It doesn't guarantee full Theme Store requirement coverage — that's the pre-submission checklist's job.
- Run all three layers; each catches something the others don't.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
