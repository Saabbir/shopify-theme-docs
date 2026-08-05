---
title: Pull Requests & Review
description: Our PR template, and how to review AI-assisted code carefully instead of approving it without checking.
---

## PR template

[Download `PULL_REQUEST_TEMPLATE.md`](/templates/github/PULL_REQUEST_TEMPLATE.md) and save it to `.github/PULL_REQUEST_TEMPLATE.md` in your repo. Once it's there, GitHub applies it to every new PR automatically.

The template asks you for a few things: what the PR does, a preview link or screenshots, and a checklist. That checklist covers Theme Check, testing with empty or long content, keyboard navigation, locale strings, new dependencies, and sign-off on AI review.

## Writing a PR description that's actually reviewable

| ✅ Good PR description | ❌ Weak PR description |
|---|---|
| "Adds a testimonials section (heading + repeatable quote blocks). Tested with 0/1/10 blocks and a 300-char quote. Preview: [link]" | "Added testimonials" |
| "Fixes cart total not refreshing on quantity change (it was missing a form re-submit trigger). Before/after video attached." | "Fixed cart bug" |
| "Bumps color contrast on the footer newsletter form to meet 4.5:1 (it was 3.2:1 against the dark scheme). Screenshot attached." | "Accessibility fix" |

A reviewer who doesn't have full context on your task should be able to understand what changed, and why, just from reading the description. They shouldn't have to open every file in the diff just to figure out what you did.

## Reviewing AI-assisted code

AI tools write code fast, and that code often looks reasonable at a glance. That means a quick "does this look okay" skim isn't enough. When you review AI-generated code, check these things specifically:

- **Does it match our rules, or just generic Shopify patterns?** AI tools tend to default to whatever's most common in their training data. That's often older Dawn-era patterns, like using `{% include %}` or defining blocks locally instead of as theme blocks. Check it against [Codebase Structure](/codebase-structure/).
- **Did it add things nobody asked for?** AI assistants sometimes add "helpful" extras, like an animation or an extra setting, that nobody actually asked for. Flag anything the prompt didn't request.
- **Does it handle empty or unusual content?** This is the single most common mistake in AI-generated sections. See [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) for more on this.
- **Are the schema strings translatable?** AI tools often hardcode English text directly into schema, instead of using `t:` locale keys.
- **Would this pass Theme Check?** Run it, don't guess.

### A realistic AI-assisted PR review, walked through

Say a PR adds a "Featured collection" section, built with Cursor (an AI coding tool). A thorough review checks these things, roughly in this order:

1. **Read the PR description.** Does it state what was tested, or does it just say "added the section"?
2. **Run `shopify theme check` locally**, even though CI already ran it. This catches issues before you start reading code line by line.
3. **Open the preview link** and actually interact with it: change the collection, remove all blocks, add many blocks.
4. **Skim the schema** for hardcoded English strings and missing `presets`.
5. **Skim the Liquid code** for `{% include %}` (should be `{% render %}`) and inline block definitions (should be `/blocks` files with `@theme` targeting).
6. **Check for scope creep.** Scope creep means the PR does more than it was supposed to. Did it also "helpfully" restyle an unrelated section?

Once this becomes routine, it only takes about five minutes. It's not a heavy process. But skip any one of these six steps, and that's exactly how an old Dawn-era pattern or a missing edge case slips through unnoticed.

## Review checklist (for the reviewer)

- [ ] Ran `shopify theme check` locally, zero new offenses
- [ ] Opened the preview link and tested empty/long/many-block states
- [ ] Confirmed no hardcoded schema strings
- [ ] Confirmed no scope creep beyond what the PR describes
- [ ] Confirmed no new dependency without justification
- [ ] Tab-tested keyboard navigation on anything new

## Best practices

- Write your PR description as if the reviewer only knows the ticket title and nothing else. This consistently leads to faster, better reviews.
- Actually click through the preview link when you review. Don't just read the diff. Most bugs caused by different content stay invisible when you only read code, but become obvious after thirty seconds of clicking around.
- Mention in your PR description if a section was built with AI help, and what you already checked. That tells the reviewer where to look more closely.

## Common mistakes

- **Writing a one-line PR description** (like "added testimonials") that forces the reviewer to guess your intent just from the diff.
- **Reviewing only the diff and never opening the live preview.** This is exactly how empty-state bugs (what a section looks like with no content) and long-content bugs slip through.
- **Approving AI-generated code faster than human-written code**, assuming it's "probably fine." In practice, it needs the same amount of scrutiny, or more, especially for old Dawn-era patterns and extra scope nobody asked for.

## Quick Reference

- PR template lives at `.github/PULL_REQUEST_TEMPLATE.md`.
- AI-assisted code gets reviewed just as carefully as human code, maybe more, since it's more likely to fall back on Dawn-era patterns or add scope nobody asked for.
- Always click through the preview link, not just the diff.

## Further Reading

- [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) (this handbook)
