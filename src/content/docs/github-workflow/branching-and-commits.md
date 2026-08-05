---
title: Branching & Commits
description: How Git branches map to Shopify themes, and what happens when someone edits in the admin.
---

## The two-way sync — this is the part that surprises people

Shopify's GitHub integration works in both directions. It's not a one-way street. Once a branch is connected to a theme, two things happen:

- **Pushing to the branch** updates that theme in Shopify automatically.
- **Editing the theme in Shopify admin** (using the theme editor, the code editor, or even a merchant's own customizations) automatically commits those changes back to the branch. A commit is just a saved snapshot of a change in Git. Git shows these particular commits as authored by the `shopify` bot.

So imagine a designer changes a color setting in the theme editor. Without realizing it, they just added a commit to your Git history. Don't panic when you see commits made by `shopify` show up in your log. This is expected behavior, not a security problem.

:::caution
Every file change made in Shopify admin gets committed to GitHub. You can't turn this off. If you need to keep some code private from people who have admin access, use a separate repository, or a subtree (a way to split part of a repository off on its own). Don't expect Shopify's integration to filter what it syncs for you. See [version control best practices](https://shopify.dev/docs/storefronts/themes/best-practices/version-control).
:::

## Branch strategy

| Branch | Connected to | Purpose |
|---|---|---|
| `main` | Published (live) theme | Only merges that have passed review and QA |
| `develop` (or per-feature branches) | An unpublished development theme | Work in progress, safe to preview without affecting the live store |

Once you disconnect a branch from a theme, you can never reconnect it to that same theme again. Reconnecting always creates a brand new theme instead. Keep this in mind before you rename or clean up branches.

| ✅ Do | ❌ Don't |
|---|---|
| Connect `main` to the live/published theme only after it's been reviewed | Connect a feature branch directly to the live theme "just to test something quickly" |
| Disconnect a branch deliberately, knowing it creates a new theme on reconnect | Disconnect and reconnect a branch casually, assuming it picks up where it left off |
| Keep feature branches short-lived | Let a development-theme-connected branch sit for weeks, drifting further from `main` |

## Branch naming convention

Every branch off `main` (or `develop`) follows one format:

```
namespace/branch-name/collaborator-id
```

| Segment | What it is | Example |
|---|---|---|
| `namespace` | The same prefix you use in a [commit message](#commit-conventions): `feat`, `fix`, `chore`, `docs`, `refactor`, or `test` | `feat`, `fix` |
| `branch-name` | A short, lowercase description of the work, written with hyphens between words (a style called kebab-case). It's similar to a commit's scope, just a bit more detailed | `testimonials-section`, `cart-total-refresh` |
| `collaborator-id` | Your GitHub username, lowercase. This is different from the Shopify store "collaborator" access covered in [Prerequisites & Setup](/getting-started/prerequisites-and-setup/). Here, it just shows who's working on the branch | `jsmith`, `agarcia` |

Full examples:

```
feat/testimonials-section/jsmith
fix/cart-total-refresh/agarcia
chore/bump-theme-check/jsmith
docs/prerequisites-update/agarcia
```

The namespace matches the commit type on purpose. A `feat/` branch should only produce `feat(...)` commits, and it should turn into a PR for one feature, not a mix of different things. Sometimes a branch's real work stops matching its namespace. For example, a `fix/` branch might grow into a full feature. When that happens, split it into two branches instead of just renaming it.

The collaborator ID goes last, not first. This way, branches sort and group by `namespace` in most Git tools and in the `git branch` output. Every `feat/` branch sits together, then every `fix/` branch, and so on. That's more useful than grouping by person when you're scanning a list of open branches.

| ✅ Do | ❌ Don't |
|---|---|
| `feat/quote-block/jsmith` | `jsmith-quote-block` (no namespace, no structure) |
| `fix/newsletter-a11y/agarcia` | `fix/Newsletter_A11y/AGarcia` (mixed case, underscores instead of hyphens) |
| One focused change per branch | `feat/several-unrelated-fixes/jsmith` (split into separate branches instead) |
| Your actual GitHub username as the collaborator ID | Initials (`js`, `ag`), since these collide as the team grows. Usernames don't |

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(sections): add testimonials section with quote blocks
fix(accessibility): add missing label to newsletter signup input
chore(deps): bump theme-check to latest
```

Prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`. The scope, written in parentheses, is the part of the code you touched. It could be a section name, `accessibility`, `deps`, or something similar.

### More examples, right and wrong

| ✅ Good commit message | ❌ Weak commit message | Why |
|---|---|---|
| `fix(cart): refresh total_price on quantity change` | `fix bug` | Specific about what and where |
| `feat(blocks): add nestable "quote" theme block` | `updates` | Says what was actually added |
| `refactor(product-card): extract snippet shared by grid and search` | `cleanup` | Explains the actual change, not just the category |

### Handling `shopify`-authored commits in your history

Admin edits create real commits. That means the Git history on a connected branch will have `shopify`-authored commits mixed in with your own. This is normal, but it does change how you should work with the branch day to day.

- Don't casually run `git rebase -i` to "clean up" a connected branch's history. Doing this risks rewriting commits that Shopify's sync depends on, which can break the connection between your branch and the theme.
- When you look at the recent history to understand what changed, expect to see both human commits and `shopify`-bot commits. Check both, not just your own.
- Sometimes a merchant or designer's theme editor changes will conflict with the work on your branch. When that happens, fix it like you would fix any other Git conflict. Shopify's own docs point out that the code editor doesn't warn you about conflicts, so it's up to you to notice them and fix them.

## Best practices

- Name every branch `namespace/branch-name/collaborator-id` right from the start. Renaming a branch later to fit this pattern takes much more work than starting with it.
- Use your real GitHub username as the collaborator ID, not initials. Initials can clash as the team grows, but usernames don't.
- Write commit messages that would make sense to someone with no context, six months from now. A message like "fix bug" tells a future reader nothing.
- Treat `shopify`-authored commits as real history, not noise to ignore. They reflect actual changes made to the live theme.
- Avoid rewriting history (using interactive rebase or force-push) on branches connected to a theme. Shopify's sync needs a steady, unchanged commit history to line up admin-side changes correctly.

## Common mistakes

- **Creating a branch with no namespace or collaborator id** (just "quote-block", for example). It's hard to tell at a glance who owns the branch or what kind of change it is, especially once several branches are open at once.
- **Using mixed case or underscores in the `branch-name` part** instead of lowercase with hyphens. This doesn't match the naming style used everywhere else in this handbook (see [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/)).
- **Writing vague commit messages** like "fix," "updates," or "wip." These make `git log` (the command that lists your commit history) useless when you're trying to understand the history later.
- **Force-pushing or rebasing a connected branch** without thinking about whether Shopify's sync depends on the existing commit history.
- **Assuming a branch picks up the same theme after you disconnect and reconnect it.** It doesn't. It creates a new theme instead, which can be a confusing surprise in the middle of a project.

## Quick Reference

- Branch names follow `namespace/branch-name/collaborator-id`, for example `feat/testimonials-section/jsmith`. Use the same `namespace` values as commit types, lowercase kebab-case for `branch-name`, and your GitHub username as the id.
- A branch and a theme stay in a two-way sync. Admin edits create commits automatically.
- Only a repo with the standard [theme folder structure](/codebase-structure/folder-structure/) can be connected. Other folders are ignored.
- Once disconnected, a branch can't reconnect to the same theme.
- Commits follow Conventional Commits: `type(scope): summary`.
- Avoid rewriting history on a theme-connected branch.

## Further Reading

- [Shopify GitHub integration](https://shopify.dev/docs/storefronts/themes/tools/github) (shopify.dev)
- [Conventional Commits](https://www.conventionalcommits.org/) (conventionalcommits.org)
- [Version control best practices](https://shopify.dev/docs/storefronts/themes/best-practices/version-control) (shopify.dev)
