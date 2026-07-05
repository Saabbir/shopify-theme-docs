---
description: Prepare the current branch for a pull request — check, checklist, and a drafted PR description
allowed-tools: Read, Bash(shopify theme check:*), Bash(git diff:*), Bash(git log:*), Bash(git status:*)
---

Prepare this branch for a pull request:

1. Run `shopify theme check` and confirm it's clean (or list any pre-existing offenses that aren't part of this change, with a one-line reason they're out of scope here).
2. Run `git diff main...HEAD` (or the relevant base branch) and summarize what actually changed — files touched, and the functional change each represents. Don't just restate file names.
3. Check the diff against the repo's relevant conventions in `AGENTS.md`: locale keys used instead of hardcoded strings, `@app` block support if a product/featured-product section was touched, presets on any new theme block, CSS logical properties.
4. Draft a PR description with: a one-paragraph summary, a bullet list of changes, and a "Testing" section describing what was manually checked (empty state, long content, keyboard nav — whatever applies to this change).
5. Flag anything in the diff that looks like it should have been caught by `theme check` but wasn't (a hardcoded string missed, a Dawn-era pattern) — an explicit human double-check on this specific category is worth calling out, not just relying on the lint pass.

Report the drafted PR description and the checklist results — don't open or submit the PR itself unless asked to.
