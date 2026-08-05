---
title: CI Automation
description: What runs automatically on every push and PR.
---

## Theme Check on every PR

Shopify maintains an official GitHub Action for this job. A GitHub Action is a small automated task that runs on GitHub's servers whenever something happens, like a push or a pull request. This one is called [`Shopify/theme-check-action`](https://github.com/Shopify/theme-check-action). If you started your project from Skeleton Theme, you probably already have it set up, since it comes included.

If you don't have it yet, [download the workflow file](/templates/github/workflows/theme-check.yml) and save it to `.github/workflows/theme-check.yml`:

```yaml
name: Theme Check

on:
  pull_request:
  push:
    branches: [main]

jobs:
  theme-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Shopify/theme-check-action@v3
```

This setup stops a PR from merging if Theme Check finds a problem. Shopify calls these problems "offenses." It checks the same things you should already be checking on your own computer (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)). The difference is that it runs automatically, so nobody has to remember to run it by hand.

## Reading a failed CI run

When the Theme Check Action fails on a PR, GitHub shows you the exact problems in the Action's log, which is just a record of everything the automated check did. Each problem listed includes a file, a line number, and a rule name. Fix these the same way you would fix a Theme Check failure on your own computer. A CI failure isn't scarier or different, it's the same kind of problem, just caught automatically instead of by hand.

| ✅ Do | ❌ Don't |
|---|---|
| Read the specific rule name in the failure and look it up if unfamiliar | Push an unrelated "fix" hoping it resolves a CI failure you didn't actually diagnose |
| Fix the offense locally, confirm with `shopify theme check`, then push | Disable or skip the failing check to unblock the merge |
| Ask a teammate if a Theme Check rule seems wrong for a specific case | Silently add a Theme Check ignore comment without understanding why the rule exists |

## Extending CI later

As your project grows, this same workflow file is a good place to add more automated checks. A `prettier --check` step is a good first addition, since it's what actually makes formatting an enforced convention instead of something that depends on everyone's editor settings being right — see [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) for the full step. You could also add a Lighthouse CI step. Lighthouse is a tool that measures page speed and other performance scores, and Shopify provides tooling for this (see [Performance & Lighthouse](/theme-store-requirements/performance/)). Or you could add a step that checks whether commit messages follow our [Conventional Commits](/getting-started/branching-and-commits/) style. You don't need to add any of this on day one. A single, reliable Theme Check step is a solid starting point, and you can build on this same file later instead of starting over.

## What CI does not replace

CI catches syntax errors and lint-level problems. A linter is a tool that checks your code style automatically, and "lint-level" just means the kind of problem a linter can catch on its own. It does **not** catch:

- Whether a section handles empty/long content gracefully
- Whether the design matches Figma
- Whether Lighthouse thresholds are met (run that check by hand before you submit, see [Performance & Lighthouse](/theme-store-requirements/performance/))
- Whether the code follows our own style (theme blocks vs. older Dawn-era patterns)

A human reviewer still needs to check all of these. Think of CI as the minimum bar, not a replacement for review.

## Best practices

- Treat a CI failure just as seriously as a Theme Check failure on your own machine. Don't get into the habit of pushing code and "seeing what CI says" instead of checking it locally first.
- If you disagree with a specific Theme Check rule, talk to the team about it instead of silently turning it off. The rule might exist because of a Theme Store requirement you don't know about.
- Add new automated checks to this same workflow file bit by bit as the project grows. Don't try to build a big, complicated CI setup all at once.

## Common mistakes

- **Treating a CI failure as less important than a comment from a reviewer.** It's automated, but it's still catching real, specific problems.
- **Turning off a Theme Check rule with an ignore comment without understanding why it exists.** Several rules exist because they map directly to a Theme Store requirement (see [Theme Store Requirements](/theme-store-requirements/)).
- **Relying on CI instead of doing manual QA (quality assurance testing).** CI is deliberately narrow. It only checks lint-level issues. Treating a green CI run (meaning all checks passed) as "fully tested" misses everything listed above in "What CI does not replace."

## Quick Reference

- `Shopify/theme-check-action` runs Theme Check on every PR and push to `main`.
- CI catches lint errors. It doesn't catch design differences, content edge cases, or performance issues.
- Read and fix CI failures the same way you would fix a local one. Don't guess-fix or suppress them.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
- [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action) (GitHub)
