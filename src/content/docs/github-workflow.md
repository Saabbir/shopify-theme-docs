---
title: GitHub Workflow
description: How branches connect to a theme, how pull requests get reviewed, and what CI checks automatically.
---

Shopify has its own GitHub integration built just for themes. It is not just "we happen to use Git." Shopify adds extra behavior on top of normal Git, and that behavior can catch you off guard if nobody warns you about it first. Learn how it works now, and you will save yourself a confusing first week.

Branch naming and commit conventions are covered earlier, in [Branching & Commits](/getting-started/branching-and-commits/) under Getting Started, since you need them before you make your first commit. This section picks up from there: pull requests, review, and CI.

## What's on this page group

- [Pull Requests & Review](/github-workflow/pull-requests-and-review/): our pull request (PR) template and the checklist for reviewing AI-generated code.
- [CI Automation](/github-workflow/ci-automation/): what checks run automatically every time you push code. This automatic checking is called CI, short for continuous integration.

## The full loop, end to end

Here's how a single Solis change moves from your machine to the live store. Think of it as a loop, because it repeats every time you make a change.

1. You branch off `main` and build locally with `shopify theme dev`.
2. You open a pull request (PR). Our PR template (see [Pull Requests & Review](/github-workflow/pull-requests-and-review/)) asks you for a preview link and a checklist.
3. CI runs Theme Check automatically (see [CI Automation](/github-workflow/ci-automation/)).
4. A teammate reviews your code. They also open the live preview link and try it out for themselves.
5. Once your PR is merged, Shopify checks whether that branch is connected to a theme. If it is, the theme updates automatically.
6. This also works in reverse. If someone edits that connected theme in the Shopify admin (using the theme editor or code editor), those changes get committed back to the same branch automatically. This sync runs both ways, all the time, not just when you merge.

## Best practices

- Know which branch is connected to which theme before you push anything. This connection is real and live, not just a technical detail you can ignore.
- Keep your feature branches short-lived. If a branch stays connected to a development theme for weeks, it drifts further from `main`. That makes it harder to review when you finally merge.
- If your change might cause admin-side commits (for example, a new setting a designer will configure right away), say so in your PR description. That way reviewers won't be surprised by extra commits from the `shopify` bot afterward.

## Common mistakes

- **Not knowing which branch is connected to which theme.** You push code and accidentally update a theme someone else is actively testing.
- **Letting feature branches go stale for weeks.** The eventual PR becomes one big, hard-to-review change instead of several small, easy ones.
- **Being surprised by automatic commits from Shopify admin edits** and mistaking them for unauthorized changes. See [Branching & Commits](/getting-started/branching-and-commits/) for why this is expected behavior.

## Quick Reference

- Shopify's GitHub app connects a **branch** to a **theme** in your store. Pushing to that branch updates the theme automatically.
- Editing the theme in Shopify admin (theme editor or code editor) commits back to that same branch automatically, too. It's a two-way sync.
- Know which branch is connected to which theme before pushing.

## Further Reading

- [Shopify GitHub integration for themes](https://shopify.dev/docs/storefronts/themes/tools/github) (shopify.dev)
- [Version control best practices](https://shopify.dev/docs/storefronts/themes/best-practices/version-control) (shopify.dev)
