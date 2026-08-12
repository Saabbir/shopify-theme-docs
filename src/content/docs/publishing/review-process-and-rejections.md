---
title: Review Process & Rejections
description: Shopify's 5-stage review, and how to handle a rejection without getting suspended.
---

**TL;DR:** Shopify's 5-stage review, and how to handle a rejection without getting suspended.

## The 5 stages

Shopify's review team checks these stages in order, one after another, and if you fail one stage, the review stops right there. You don't move on to the next one until you fix it and resubmit.

That's why it pays to fix the cheap, easy-to-catch problems in stages 1 to 3 yourself, before you spend a review cycle getting feedback on the more time-consuming one in stage 4 (design).

| Stage | Checks |
|---|---|
| 1. Features & OS 2.0 | Feature checklist, section/block OS 2.0 compatibility. See [Required Templates & Features](/theme-store-requirements/required-templates-and-features/). |
| 2. Lighthouse | Performance ≥ 60, Accessibility ≥ 90. See [Performance & Lighthouse](/theme-store-requirements/performance/). |
| 3. Technical | Page requirements, consistency/functionality, browser compatibility, assets, SEO, accessibility, social media |
| 4. Design & UX | Design/UX criteria, settings organization, font picker, color system, responsive images. This is the only stage with in-depth design feedback. |
| 5. Pre-launch | Exclusivity, naming, demo stores, documentation/contact form, support readiness |

Stages 1 to 3 might mention design issues too, but that's not a full design review. Don't assume that silence on design in the early stages means your design is approved.

### Why the stage order matters strategically

A failure at stage 1 stops the review before you ever see stage 4 feedback. That's why it's worth thoroughly checking your own equivalent of stages 1 to 3 (using the [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/)) before you submit. This isn't because stage 4 matters less. It's because you want your first real design feedback to come from Shopify's actual reviewers, not wasted on review cycles for structural issues you could have caught yourself.

## If you're rejected

You'll get an email listing exactly what needs to change. If you want to discuss the feedback, reply to that email. The review team responds there.

:::caution[The one mistake that gets you suspended]
If you resubmit without actually fixing the reasons you were rejected, you can get **temporarily suspended** from submitting themes at all. Don't resubmit hoping a reviewer misses something the second time. Fix the specific items listed instead.
:::

### Handling a rejection well, step by step

| ✅ Do | ❌ Don't |
|---|---|
| Read every item in the rejection email fully before starting fixes | Fix only the first item and assume the rest were minor |
| Cross-reference each item against the relevant handbook page for the full requirement, not just the summary in the email | Guess at what the reviewer meant without checking the actual requirement |
| Fix every listed item, then re-run the relevant parts of your [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) before resubmitting | Resubmit as soon as the first fix is in, without a fresh full pass |
| Ask a clarifying question by replying to the review email if something is ambiguous | Guess and resubmit hoping it's close enough |

### A realistic rejection scenario

Say your rejection email lists two problems: the main product section doesn't accept `@app` blocks, and three settings use question-style labels instead of declarative ones. Here's a good response:

1. Fix both problems. Check [App Compatibility](/theme-store-requirements/app-compatibility/) and [Schema.json Best Practices](/theme-store-requirements/schema-best-practices/) to make sure you're fixing the underlying pattern everywhere it shows up in the theme, not just patching the specific examples mentioned.
2. Search the rest of the codebase for the same pattern: other sections missing `@app`, other question-style labels. A rejection often gives you examples, not a complete list. If a reviewer finds the same issue somewhere else on resubmission, it looks like you didn't actually understand the feedback.
3. Re-run the full pre-submission checklist before resubmitting, not just a check of the two items mentioned.

## Timing

The review team mainly works EST business hours, Monday through Friday. If a change is time-sensitive, submit early in the week and early in the day.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Treat rejection feedback as pointing at a pattern, not just the specific example given. Search for the same issue elsewhere in the codebase before resubmitting. | **Fixing only the exact examples listed in a rejection email** and missing the same underlying issue elsewhere in the theme. |
| Re-run your full pre-submission checklist before every resubmission, not just a check of the items mentioned. | **Resubmitting right after the first fix**, without doing a fresh full QA pass, risking a second rejection for something unrelated that never actually got re-checked. |
| If feedback is genuinely unclear, ask by replying to the review email instead of guessing. That's exactly what that channel is for. | **Guessing at unclear feedback instead of asking.** The reply channel exists specifically for clarifying questions. |

## Key takeaways
- 5 sequential stages: Features/OS 2.0 → Lighthouse → Technical → Design/UX → Pre-launch.
- A rejection email lists the exact changes required. Fix those specifically, and check for the same pattern elsewhere before resubmitting.
- Resubmitting without addressing rejection reasons risks a submission suspension.

## Further reading

- [Submitting a theme, review process](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) (shopify.dev)
