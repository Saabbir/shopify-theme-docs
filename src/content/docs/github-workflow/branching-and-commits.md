---
title: Branching & Commits
description: How Git branches map to Shopify themes, and what happens when someone edits in the admin.
---

## The two-way sync — this is the part that surprises people

Shopify's GitHub integration isn't one-directional. Once a branch is connected to a theme:

- **Pushing to the branch** updates that theme in Shopify automatically.
- **Editing the theme in Shopify admin** — through the theme editor *or* the code editor, including a merchant's own customizations — automatically commits those changes back to the branch, authored by the `shopify` bot.

This means a designer or merchant tweaking settings in the theme editor is, whether they realize it or not, writing commits to your Git history. Don't be surprised by `shopify`-authored commits showing up — that's expected, not a security issue.

:::caution
Every file change made through Shopify admin gets committed to GitHub — this can't be turned off. If you need to keep some code private from whoever has admin access, use a separate repository or subtree rather than expecting Shopify's integration to filter what it syncs. See [version control best practices](https://shopify.dev/docs/storefronts/themes/best-practices/version-control).
:::

## Branch strategy

| Branch | Connected to | Purpose |
|---|---|---|
| `main` | Published (live) theme | Only merges that have passed review and QA |
| `develop` (or per-feature branches) | An unpublished development theme | Work in progress, safe to preview without affecting the live store |

A branch, once disconnected from a theme, can't be reconnected to that same theme again — reconnecting creates a new theme. Plan branch renames/cleanup with that in mind.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(sections): add testimonials section with quote blocks
fix(accessibility): add missing label to newsletter signup input
chore(deps): bump theme-check to latest
```

Prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`. Scope (in parentheses) is the area touched — a section name, `accessibility`, `deps`, etc.

## Quick Reference

- Branch ↔ theme is a two-way sync — admin edits create commits automatically.
- Only a repo with the standard [theme folder structure](/codebase-structure/folder-structure/) can be connected — other folders are ignored.
- Once disconnected, a branch can't reconnect to the same theme.
- Commits follow Conventional Commits: `type(scope): summary`.

## Further Reading

- [Shopify GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github) — shopify.dev
- [Conventional Commits](https://www.conventionalcommits.org/) — conventionalcommits.org
