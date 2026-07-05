---
title: "Learning Article: Writing Maintainable Code at Scale"
description: What actually keeps a theme codebase manageable in year three — not just week one.
---

Any theme is easy to keep clean on day one. The real test is a codebase with 60 sections, three years of merchant-driven feature requests, and five developers who've rotated through it — does it stay comprehensible, or does every change require archaeology first? This article is about the habits that determine which outcome you get.

## Step 1: consistency compounds — and so does inconsistency

A single inconsistent pattern (one section using `{% include %}` instead of `{% render %}`, one component with physical CSS properties instead of logical ones) seems harmless in isolation. The actual cost shows up later: every new developer has to learn "the codebase does X, except in these N places," and N only grows over time unless something actively reverses it.

```liquid
{% comment %} If 59 sections use {% render %} and one uses
   {% include %}, a new developer copying "an existing pattern"
   has a 1-in-60 chance of copying the wrong one — and now
   there might be two {% endcomment %}
```

This is the actual argument for [AI rules](/ai-assisted-development/setting-up-ai-rules/) and [style guides](/style-guides/) being specific and enforced, not aspirational: consistency is cheap to maintain from the start and expensive to restore later, and every inconsistency that ships becomes a template for the next one.

## Step 2: name things for what they mean, not what they currently look like

```liquid
{% comment %} ❌ WRONG — named after this week's visual design.
   The day design changes the layout, the name is actively
   misleading rather than just imprecise {% endcomment %}
<div class="three-column-grid">

{% comment %} ✅ RIGHT — named after its role, survives a
   visual redesign without becoming false {% endcomment %}
<div class="featured-products">
```

The same principle applies to settings: `settings.homepage_columns` describes what a setting *is for*; `settings.grid_3` describes what it currently renders as, and will be wrong the day someone changes it to 4 columns without renaming the setting (which would itself be a breaking change — see [After Approval](/publishing/after-approval/) on why renaming settings is costly once shipped).

## Step 3: duplication is fine until it isn't — know the difference

Premature abstraction (building a generic "flexible content section" that handles every case via a maze of conditionals) is its own maintainability problem, often worse than the duplication it was meant to prevent. The actual signal for "this should be extracted" is **the third occurrence**, not the second:

- First occurrence: just write it.
- Second occurrence: notice the similarity, but two data points aren't enough to know the right abstraction shape yet.
- Third occurrence: now you can see what's actually constant vs. what varies, and extract a snippet/theme block that reflects the real pattern rather than guessing at one from a single example.

```liquid
{% comment %} A snippet extracted from three real occurrences takes
   the actual varying parameters as arguments — not a snippet
   extracted from one occurrence with speculative options nobody
   has needed yet {% endcomment %}
{% render 'media-with-caption', media: block.settings.image, caption: block.settings.caption, aspect_ratio: '16/9' %}
```

## Step 4: the "explain it to the next developer" test

Before merging non-trivial logic, a useful check: could someone unfamiliar with this change understand *why* it exists from the code and its comments alone, without asking you? If not, that's what a code comment or a clearer variable name is for — not because the logic is wrong, but because the reasoning behind a non-obvious decision is exactly the thing that gets lost first.

```liquid
{% comment %} ❌ WRONG — no comment, and the reason for this
   specific check isn't obvious from the code alone {% endcomment %}
{%- if product.tags contains 'preorder' and product.available -%}

{% comment %} ✅ RIGHT — the comment captures the *why*, which
   the code itself can't express {% endcomment %}
{% comment %}
  Preorder products remain "available" in Shopify's data model even
  before their release date — this check additionally confirms the
  release date has passed, per the merchant's preorder app config.
{% endcomment %}
{%- if product.tags contains 'preorder' and product.available and release_date_passed -%}
```

## Step 5: tests and checks are cheaper than tribal knowledge

Anything you currently rely on "someone remembering to check" (a locale key existing for every setting label, a section handling zero blocks gracefully) eventually gets missed once enough time passes and enough people rotate through the project. Where possible, convert tribal knowledge into something mechanically checked:

| Tribal knowledge | Converted into |
|---|---|
| "Remember to add a locale key for every new setting" | A `theme-check` rule that flags hardcoded schema strings (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)) |
| "Remember AI rule files need regenerating after an AGENTS.md edit" | A CI check that fails if generated files are stale (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) |
| "Remember to test a section with zero blocks" | A documented, repeatable stress-test checklist (see [Manual QA Checklist](/quality-validation/manual-qa-checklist/)) |

This is the same principle behind why this handbook has a [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) instead of relying on someone remembering every Theme Store requirement from memory before every submission.

## Step 6: revisit decisions when their premise changes, not on a fixed schedule

A pattern that was correct when written can become wrong not because it was a bad decision, but because something it depended on changed — a Shopify API deprecation, a new theme block feature that replaces an older workaround, a merchant request that reveals an edge case the original design didn't anticipate. The discipline isn't "review everything periodically" (unrealistic at scale) — it's noticing when a *specific* change touches a pattern's original assumption, and treating that as a prompt to revisit it rather than patching around the now-outdated assumption.

## Best practices

- Treat every inconsistency as compounding, not isolated — fix the first instance of a wrong pattern rather than letting it become "how we sometimes do it here."
- Extract an abstraction from the third real occurrence, not the second guess at one.
- Comment the *why* behind non-obvious logic, not the *what* the code already says.
- Convert anything relying on memory into a mechanical check (a lint rule, a CI check, a checklist) as soon as more than one person needs to remember it.

## Common mistakes

- **Building a generic, flexible abstraction from a single use case**, guessing at options nobody has actually needed yet, producing something more complex than the duplication it replaced.
- **Naming things after their current appearance** instead of their role, so the name becomes misleading the first time the design changes.
- **Relying on memory for anything more than one person needs to remember** — this is precisely where a checklist, a lint rule, or a CI check earns its cost.
- **Letting a first wrong-pattern instance stand** "just this once," which becomes the template the next developer copies.

## Quick Reference

- Consistency compounds; so does inconsistency — fix the first wrong instance, don't let it become precedent.
- Extract abstractions from a third real occurrence, not a second guess.
- Name for role, not current appearance.
- Comment the *why*; the *what* is already in the code.
- Convert tribal knowledge into mechanical checks (lint rules, CI, checklists) as soon as it matters to more than one person.

## Further Reading

- [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) — an example of converting a manual sync process into a mechanical one
- [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/) — an example of converting "remember every requirement" into a checklist
