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

| ✅ Do | ❌ Don't |
|---|---|
| Connect `main` to the live/published theme only after it's been reviewed | Connect a feature branch directly to the live theme "just to test something quickly" |
| Disconnect a branch deliberately, knowing it creates a new theme on reconnect | Disconnect and reconnect a branch casually, assuming it picks up where it left off |
| Keep feature branches short-lived | Let a development-theme-connected branch sit for weeks, accumulating drift from `main` |

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(sections): add testimonials section with quote blocks
fix(accessibility): add missing label to newsletter signup input
chore(deps): bump theme-check to latest
```

Prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`. Scope (in parentheses) is the area touched — a section name, `accessibility`, `deps`, etc.

### More examples, right and wrong

| ✅ Good commit message | ❌ Weak commit message | Why |
|---|---|---|
| `fix(cart): refresh total_price on quantity change` | `fix bug` | Specific about what and where |
| `feat(blocks): add nestable "quote" theme block` | `updates` | Says what was actually added |
| `refactor(product-card): extract snippet shared by grid and search` | `cleanup` | Explains the actual change, not just the category |

### Handling `shopify`-authored commits in your history

Because admin edits create real commits, your Git history on a connected branch will include `shopify`-authored commits interleaved with your own. This is normal, but a few practical implications:

- Don't `git rebase -i` to "clean up" a connected branch's history casually — you risk rewriting commits that Shopify's sync depends on to reconcile state.
- When reviewing recent history to understand "what changed," expect to see both human and `shopify`-bot commits, and check both.
- If a merchant/designer's theme editor changes conflict with your in-progress branch work, resolve it like any other Git conflict — Shopify's docs note there's no special conflict alerting in the code editor, so the burden is on you to notice and reconcile it.

## Best practices

- Write commit messages that would make sense to someone with zero context six months from now — "fix bug" tells a future reader nothing.
- Treat `shopify`-authored commits as real history, not noise to filter out — they reflect actual changes to the live theme.
- Avoid history-rewriting operations (interactive rebase, force-push) on branches connected to a theme, since Shopify's sync relies on a consistent commit history to reconcile admin-side changes.

## Common mistakes

- **Writing vague commit messages** ("fix," "updates," "wip") that make `git log` useless for understanding history later.
- **Force-pushing or rebasing a connected branch** without considering that Shopify's sync may be relying on the existing commit history.
- **Assuming a disconnected-then-reconnected branch resumes the same theme** — it creates a new one, which can be a confusing surprise mid-project.

## Quick Reference

- Branch ↔ theme is a two-way sync — admin edits create commits automatically.
- Only a repo with the standard [theme folder structure](/codebase-structure/folder-structure/) can be connected — other folders are ignored.
- Once disconnected, a branch can't reconnect to the same theme.
- Commits follow Conventional Commits: `type(scope): summary`.
- Avoid rewriting history on a theme-connected branch.

## Further Reading

- [Shopify GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github) — shopify.dev
- [Conventional Commits](https://www.conventionalcommits.org/) — conventionalcommits.org
