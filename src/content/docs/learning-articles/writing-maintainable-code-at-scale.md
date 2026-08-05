---
title: "Learning Article: Writing Maintainable Code at Scale"
description: What actually keeps a theme codebase manageable in year three, not just week one.
---

Any theme is easy to keep clean on day one. The real test comes later. Picture a codebase with 60 sections, three years of merchant feature requests, and five developers who've rotated through it over time. Does it stay easy to understand, or does every change require digging through old history first? This article covers the habits that decide which outcome you get.

## Step 1: consistency compounds — and so does inconsistency

Picture one inconsistent pattern in your codebase. Maybe one section uses `{% include %}` instead of `{% render %}`, or one component uses physical CSS properties instead of logical ones. On its own, this looks harmless. The real cost shows up later: every new developer has to learn "the codebase does X, except in these few places." And that list of exceptions only grows over time, unless someone actively fixes it.

```liquid
{% comment %} If 59 sections use {% render %} and one uses
   {% include %}, a new developer copying "an existing pattern"
   has a 1-in-60 chance of copying the wrong one — and now
   there might be two {% endcomment %}
```

This is the real argument for making [AI rules](/getting-started/setting-up-ai-rules/) and [style guides](/style-guides/) specific and enforced, not just nice ideas on paper. Consistency is cheap to maintain from the start, but expensive to restore later once it's slipped. Every inconsistency that ships becomes a pattern the next developer copies, simply because it's there to copy.

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

The same idea applies to settings. `settings.homepage_columns` describes what the setting is *for*. `settings.grid_3` describes what it currently renders as, and that name will be wrong the day someone changes it to 4 columns, unless they also remember to rename the setting. Renaming a setting after it's shipped is itself a breaking change (see [After Approval](/publishing/after-approval/) for why that's costly).

## Step 3: duplication is fine until it isn't — know the difference

Abstracting too early means building a generic "flexible content section" that tries to handle every case through a maze of conditionals. This creates its own maintenance problem, often worse than the duplication it was meant to avoid. The real signal that something should be extracted into its own snippet is **the third time you write it**, not the second:

- First occurrence: just write it.
- Second occurrence: notice the similarity, but don't act on it yet. Two examples aren't enough to know the right shape for a shared version.
- Third occurrence: now you can see what's actually constant and what varies. Extract a snippet or theme block that reflects the real pattern, instead of guessing at one from a single example.

```liquid
{% comment %} A snippet extracted from three real occurrences takes
   the actual varying parameters as arguments — not a snippet
   extracted from one occurrence with speculative options nobody
   has needed yet {% endcomment %}
{% render 'media-with-caption', media: block.settings.image, caption: block.settings.caption, aspect_ratio: '16/9' %}
```

## Step 4: the "explain it to the next developer" test

Before you merge any non-trivial logic, ask yourself a simple question. Could someone unfamiliar with this change understand *why* it exists, just from the code and its comments, without having to ask you? If the answer is no, that's a sign you need a code comment or a clearer variable name. The logic itself isn't wrong. It's that the reasoning behind a non-obvious decision is exactly the thing everyone forgets first.

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

Think about anything you currently rely on "someone remembering to check." Maybe it's a locale key that needs to exist for every setting label, or a section that needs to handle zero blocks gracefully. Given enough time and enough people rotating through a project, that kind of thing eventually gets missed. Where you can, turn that kind of tribal knowledge into something checked automatically:

| Tribal knowledge | Converted into |
|---|---|
| "Remember to add a locale key for every new setting" | A `theme-check` rule that flags hardcoded schema strings (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)) |
| "Remember not to hand-edit Shopify's generated AGENTS.md content" | `CLAUDE.md`/`.github/copilot-instructions.md` as symlinks, so there's no separate copy to accidentally drift out of sync. A clear `## Custom rules` boundary marks the only section anyone should touch (see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/)) |
| "Remember to test a section with zero blocks" | A documented, repeatable stress-test checklist (see [Manual QA Checklist](/quality-validation/manual-qa-checklist/)) |

This is the same reason this handbook has a [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/). It's much safer than relying on someone remembering every Theme Store requirement from memory before each submission.

## Step 6: revisit decisions when their premise changes, not on a fixed schedule

A pattern that was correct when it was written can become wrong later. This doesn't mean it was a bad decision. It usually means something it depended on changed. Maybe a Shopify API got deprecated, or a new theme block feature replaces an older workaround, or a merchant request reveals an edge case the original design never anticipated.

The discipline here isn't "review everything on a schedule." That's unrealistic once a codebase gets big. It's about noticing when a *specific* change touches a pattern's original assumption, and treating that as your cue to revisit the pattern, instead of just patching around the now-outdated assumption.

## Best practices

- Treat every inconsistency as compounding, not isolated. Fix the first instance of a wrong pattern rather than letting it become "how we sometimes do it here."
- Extract an abstraction from the third real occurrence, not from a second guess at one.
- Comment the *why* behind non-obvious logic, not the *what* the code already says.
- Convert anything relying on memory into a mechanical check, like a lint rule, a CI check, or a checklist, as soon as more than one person needs to remember it.

## Common mistakes

- **Building a generic, flexible abstraction from a single use case**, guessing at options nobody has actually needed yet, which produces something more complex than the duplication it replaced.
- **Naming things after their current appearance** instead of their role, so the name becomes misleading the first time the design changes.
- **Relying on memory for anything more than one person needs to remember.** This is exactly where a checklist, a lint rule, or a CI check pays for itself.
- **Letting a first wrong-pattern instance stand** "just this once," which becomes the template the next developer copies.

## Quick Reference

- Consistency compounds, and so does inconsistency. Fix the first wrong instance, don't let it become precedent.
- Extract abstractions from a third real occurrence, not a second guess.
- Name for role, not current appearance.
- Comment the *why*. The *what* is already in the code.
- Convert tribal knowledge into mechanical checks (lint rules, CI, checklists) as soon as it matters to more than one person.

## Further Reading

- [Setting Up AI Rules](/getting-started/setting-up-ai-rules/): an example of converting a manual sync process into a mechanical one
- [Pre-Submission Checklist](/quality-validation/pre-submission-checklist/): an example of converting "remember every requirement" into a checklist
