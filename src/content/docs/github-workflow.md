---
title: GitHub Workflow
description: Branching, connecting a theme to a branch, PR review, and CI.
---

Shopify has its own GitHub integration built specifically for themes — it's not just "we happen to use Git." Understanding how it actually works will save you from a confusing first week.

## What's on this page group

- [Branching & Commits](/github-workflow/branching-and-commits/) — how branches map to Shopify themes, branch naming (`namespace/branch-name/collaborator-id`), and commit conventions.
- [Pull Requests & Review](/github-workflow/pull-requests-and-review/) — our PR template and the AI code review checklist.
- [CI Automation](/github-workflow/ci-automation/) — what runs automatically on every push.

## The full loop, end to end

Here's how a single Solis change moves from your machine to the live store:

1. You branch off `main`, build locally with `shopify theme dev`.
2. You open a PR — the PR template (see [Pull Requests & Review](/github-workflow/pull-requests-and-review/)) prompts you for a preview link and a checklist.
3. CI runs Theme Check automatically (see [CI Automation](/github-workflow/ci-automation/)).
4. A teammate reviews — both the code and, live, the preview link.
5. Once merged, if that branch is connected to a theme in Shopify, the merge updates that theme automatically.
6. Separately, any admin edits (theme editor, code editor) on that connected theme commit back to the same branch — the sync runs both directions continuously, not just at merge time.

## Best practices

- Treat the branch-to-theme connection as live infrastructure, not an implementation detail — know which branch is connected to which theme before you push anything.
- Keep your feature branches short-lived; a branch connected to a development theme that lingers for weeks accumulates drift that's harder to review at merge time.
- Communicate in your PR description when a change might trigger admin-side commits (e.g. a new setting a designer will immediately configure) so reviewers aren't surprised by follow-up `shopify`-authored commits.

## Common mistakes

- **Not knowing which branch is connected to which theme**, leading to a push that unexpectedly updates a theme someone else is actively testing against.
- **Letting feature branches go stale** for weeks, making the eventual PR much harder to review than several smaller ones would have been.
- **Being surprised by automatic commits from Shopify admin edits** and mistaking them for unauthorized changes — see [Branching & Commits](/github-workflow/branching-and-commits/) for why this is expected behavior.

## Quick Reference

- Shopify's GitHub app connects a **branch** to a **theme** in your store — pushing to that branch updates the theme automatically.
- Editing the theme in Shopify admin (theme editor or code editor) commits back to that same branch automatically, too. It's a two-way sync.
- Know which branch is connected to which theme before pushing.

## Further Reading

- [Shopify GitHub integration for themes](https://shopify.dev/docs/storefronts/themes/tools/github) — shopify.dev
- [Version control best practices](https://shopify.dev/docs/storefronts/themes/best-practices/version-control) — shopify.dev
