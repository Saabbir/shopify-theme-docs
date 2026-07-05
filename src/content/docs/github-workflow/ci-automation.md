---
title: CI Automation
description: What runs automatically on every push and PR.
---

## Theme Check on every PR

Shopify maintains an official GitHub Action for this — [`Shopify/theme-check-action`](https://github.com/Shopify/theme-check-action). Skeleton Theme itself ships with this wired up, so if you scaffolded from it, you likely already have it.

[Download the workflow file](/templates/github/workflows/theme-check.yml) and save it to `.github/workflows/theme-check.yml`:

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

This blocks a PR from merging if Theme Check finds an offense — the same checks you should already be running locally (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)), enforced automatically so review doesn't depend on everyone remembering to run it themselves.

## Reading a failed CI run

When the Theme Check Action fails a PR, GitHub shows the specific offenses in the Action's log, each with a file, line, and rule name. Fix these the same way you'd fix a local Theme Check failure — don't treat CI failures as a different, scarier category of problem.

| ✅ Do | ❌ Don't |
|---|---|
| Read the specific rule name in the failure and look it up if unfamiliar | Push an unrelated "fix" hoping it resolves a CI failure you didn't actually diagnose |
| Fix the offense locally, confirm with `shopify theme check`, then push | Disable or skip the failing check to unblock the merge |
| Ask a teammate if a Theme Check rule seems wrong for a specific case | Silently add a Theme Check ignore comment without understanding why the rule exists |

## Extending CI later

As the project matures, this workflow file is a natural place to add more automated checks — for example, a Lighthouse CI step (Shopify provides tooling for this — see [Performance & Lighthouse](/theme-store-requirements/performance/)) or a step that lints commit messages against our [Conventional Commits](/github-workflow/branching-and-commits/) convention. Don't feel obligated to add these on day one; a single reliable Theme Check gate is a solid starting point, and it's easy to extend the same workflow file later rather than needing to redesign it.

## What CI does not replace

CI catches syntax and lint-level issues. It does **not** catch:

- Whether a section handles empty/long content gracefully
- Whether the design matches Figma
- Whether Lighthouse thresholds are met (run that manually before submission — see [Performance & Lighthouse](/theme-store-requirements/performance/))
- Whether the code matches our actual architecture conventions (theme blocks vs. Dawn-era patterns)

Those all still need a human reviewer. Treat CI as the floor, not the review.

## Best practices

- Treat a CI failure as equally important as a local Theme Check failure — don't develop a habit of pushing and "seeing what CI says" instead of running the check locally first.
- When you disagree with a specific Theme Check rule, discuss it with the team rather than silently suppressing it — the rule may exist for a Theme Store requirement you're not aware of.
- Add new automated checks to this same workflow file incrementally as the project grows, rather than designing an elaborate CI pipeline upfront.

## Common mistakes

- **Treating a CI failure as lower-priority than a code review comment** — it's automated, but it's catching real, specific problems.
- **Suppressing a Theme Check rule with an ignore comment without understanding why it exists** — several rules exist specifically because they map to a Theme Store requirement (see [Theme Store Requirements](/theme-store-requirements/)).
- **Relying on CI as a substitute for manual QA** — CI's scope is intentionally narrow (lint-level), and treating a green CI run as "fully tested" misses everything in the "what CI does not replace" list above.

## Quick Reference

- `Shopify/theme-check-action` runs Theme Check on every PR and push to `main`.
- CI catches lint errors, not design fidelity, content-edge-case handling, or performance.
- Read and fix specific CI failures the same way you would a local one — don't guess-fix or suppress them.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
- [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action) — GitHub
