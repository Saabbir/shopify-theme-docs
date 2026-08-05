---
title: Quality & Validation
description: Linting, manual QA, and the final pre-submission pass.
---

When you build a Shopify theme, you check its quality in three stages. Each stage runs at a different point in your workflow, and each one catches a different kind of problem. Here's the order you usually run them in:

1. **Linting**: this runs constantly while you code, and it runs again automatically every time you open a pull request, via CI.
2. **Manual QA**: this runs whenever a section or page changes in a meaningful way.
3. **Pre-submission checklist**: this runs once, right before you submit your theme to the Shopify Theme Store.

## What's on this page group

- [Theme Check & Linting](/quality-validation/theme-check-and-linting/): automatic checks that catch clear, obvious mistakes for you.
- [Manual QA Checklist](/quality-validation/manual-qa-checklist/): testing real pages with real content, including some unusual cases.
- [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/): the final check before you submit.

## Why three layers, not one

Each layer catches a different kind of problem. None of them can replace the others, as this table shows:

| Layer | Catches | Misses |
|---|---|---|
| Linting (Theme Check) | Coding mistakes, old tags Shopify no longer recommends, missing translation text, and structural errors in your schema (the settings file for a section) | Whether a layout actually looks right with real content |
| Manual QA | Broken layouts, missing empty states, and gaps in keyboard navigation | Whether the whole submission meets every Theme Store requirement |
| Pre-submission checklist | Full coverage of every requirement, checked right before you ship | Bugs introduced *after* the last time you ran it |

A theme can pass linting and still fail manual QA. It can also pass manual QA on the sections you tested, and still fail the pre-submission checklist. That happens because of requirements that only the checklist covers, like writing documentation or adding a `theme_info` block. Neither linting nor manual QA checks those things, so run all three layers. Don't just run whichever one feels easiest.

## Best practices

- Run linting all the time. It's fast and costs you almost nothing. Run manual QA every time a feature changes. Run the full pre-submission checklist just once, right before you submit.
- A passing CI run does not mean your QA is done. Look at the table above to see what CI misses.
- Re-run the pre-submission checklist after any late change, even a tiny one. A last-minute tweak is a common way something that used to pass quietly breaks.

## Common mistakes

- **Treating linting as enough QA.** It's easy to think this way, since linting runs automatically while manual QA takes real effort.
- **Running manual QA once, early in a section's development, and never again.** This misses bugs that show up later, even from changes that seem unrelated.
- **Skipping the pre-submission checklist because you think you already checked everything along the way.** Requirements depend on each other. A late change can quietly break something you checked off weeks earlier.

## Quick Reference

- Linting catches syntax and style mistakes automatically. It can't tell you if a layout breaks with a 200-character title (that's manual QA's job).
- Manual QA catches layout bugs and content-handling problems. It doesn't guarantee you meet every Theme Store requirement (that's the pre-submission checklist's job).
- Run all three layers. Each one catches something the others miss.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
