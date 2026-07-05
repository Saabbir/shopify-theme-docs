---
title: Pull Requests & Review
description: Our PR template, and how to review AI-assisted code without rubber-stamping it.
---

## PR template

[Download `PULL_REQUEST_TEMPLATE.md`](/templates/github/PULL_REQUEST_TEMPLATE.md) and save it to `.github/PULL_REQUEST_TEMPLATE.md` in the repo — GitHub will apply it to every new PR automatically.

It asks for: what the PR does, a preview link or screenshots, and a checklist covering Theme Check, empty/long-content testing, keyboard navigation, locale strings, new dependencies, and AI-review sign-off.

## Reviewing AI-assisted code

AI tools produce plausible-looking code fast — which means the usual "does it look reasonable" skim is not enough. Review AI output for these specifically:

- **Does it match our rules, or just generic Shopify patterns?** AI tools default to whatever's most common in their training data, which is often Dawn-era patterns (`{% include %}`, blocks defined locally instead of theme blocks). Check against [Codebase Structure](/codebase-structure/).
- **Did it invent scope?** AI assistants sometimes add "helpful" extras nobody asked for (an animation, an extra setting). Flag anything the prompt didn't ask for.
- **Does it handle empty/unusual content?** This is the single most common thing AI-generated sections get wrong — see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/).
- **Are schema strings localized?** AI tools frequently hardcode English directly instead of routing through `t:` locale keys.
- **Would this pass Theme Check?** Run it, don't guess.

## Review checklist (for the reviewer)

- [ ] Ran `shopify theme check` locally — zero new offenses
- [ ] Opened the preview link and tested empty/long/many-block states
- [ ] Confirmed no hardcoded schema strings
- [ ] Confirmed no scope creep beyond what the PR describes
- [ ] Confirmed no new dependency without justification
- [ ] Tab-tested keyboard navigation on anything new

## Quick Reference

- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md`.
- AI-assisted code gets the same review rigor as human code — arguably more, since it's more likely to default to Dawn-era patterns or invent scope.

## Further Reading

- [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) — this handbook
