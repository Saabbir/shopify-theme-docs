---
title: Review Process & Rejections
description: Shopify's 5-stage review, and how to handle a rejection without getting suspended.
---

## The 5 stages

Shopify's review team checks these in order — failing one stops the review there, so fix cheap problems (stage 1–3) before you ever get feedback on the expensive ones (stage 4 design).

| Stage | Checks |
|---|---|
| 1. Features & OS 2.0 | Feature checklist, section/block OS 2.0 compatibility — see [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) |
| 2. Lighthouse | Performance ≥ 60, Accessibility ≥ 90 — see [Performance & Lighthouse](/theme-store-requirements/performance/) |
| 3. Technical | Page requirements, consistency/functionality, browser compatibility, assets, SEO, accessibility, social media |
| 4. Design & UX | Design/UX criteria, settings organization, font picker, color system, responsive images — this is the only stage with in-depth design feedback |
| 5. Pre-launch | Exclusivity, naming, demo stores, documentation/contact form, support readiness |

Stages 1–3 might surface design comments too, but that's not a full design review — don't treat early-stage silence on design as approval of your design.

### Why the stage order matters strategically

Because a failure at stage 1 stops review before you ever see stage 4 feedback, it's worth running your own equivalent of stages 1–3 thoroughly (via [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/)) before submitting — not because stage 4 is less important, but because you want your first real design feedback to come from Shopify's actual reviewers, not wasted review cycles on structural issues you could have caught yourself.

## If you're rejected

You'll get an email listing exactly what needs to change. Reply to that email if you want to discuss the feedback — the review team responds there.

:::caution[The one mistake that gets you suspended]
Resubmitting without actually fixing the reasons you were rejected can get you **temporarily suspended** from submitting themes at all. Don't resubmit hoping a reviewer misses something the second time — fix the specific items listed.
:::

### Handling a rejection well, step by step

| ✅ Do | ❌ Don't |
|---|---|
| Read every item in the rejection email fully before starting fixes | Fix only the first item and assume the rest were minor |
| Cross-reference each item against the relevant handbook page for the full requirement, not just the summary in the email | Guess at what the reviewer meant without checking the actual requirement |
| Fix every listed item, then re-run the relevant parts of your [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) before resubmitting | Resubmit as soon as the first fix is in, without a fresh full pass |
| Ask a clarifying question by replying to the review email if something is ambiguous | Guess and resubmit hoping it's close enough |

### A realistic rejection scenario

Say your rejection email lists: (1) the main product section doesn't accept `@app` blocks, and (2) three settings use question-style labels instead of declarative ones. A good response:

1. Fix both, referencing [App Compatibility](/theme-store-requirements/app-compatibility/) and [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) to confirm you're not just patching the specific examples cited but the underlying pattern everywhere it appears in the theme.
2. Search the rest of the codebase for the same pattern (other sections missing `@app`, other question-style labels) — a rejection often cites examples, not an exhaustive list, and a reviewer finding the same issue elsewhere on resubmission reads as not having actually understood the feedback.
3. Re-run the pre-submission checklist in full before resubmitting, not just a check of the two cited items.

## Timing

The review team primarily works EST business hours, Monday–Friday. If a change is time-sensitive, submit early in the week and early in the day.

## Best practices

- Treat rejection feedback as pointing at a pattern, not just the specific example cited — search for the same issue elsewhere in the codebase before resubmitting.
- Re-run your full pre-submission checklist before every resubmission, not just a check of the specifically cited items.
- If feedback is genuinely ambiguous, ask via a reply to the review email rather than guessing — this is explicitly what that channel is for.

## Common mistakes

- **Fixing only the literal examples cited in a rejection email** and missing the same underlying issue elsewhere in the theme.
- **Resubmitting immediately after the first fix**, without a fresh full QA pass, risking a second rejection for something unrelated that was never actually re-checked.
- **Guessing at ambiguous feedback instead of asking** — this Response channel exists specifically for clarifying questions.

## Quick Reference

- 5 sequential stages: Features/OS 2.0 → Lighthouse → Technical → Design/UX → Pre-launch.
- A rejection email lists exact required changes — fix those specifically, and check for the same pattern elsewhere before resubmitting.
- Resubmitting without addressing rejection reasons risks a submission suspension.

## Further Reading

- [Submitting a theme — review process](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) — shopify.dev
