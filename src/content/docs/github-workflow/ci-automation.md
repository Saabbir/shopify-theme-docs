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

## What CI does not replace

CI catches syntax and lint-level issues. It does **not** catch:

- Whether a section handles empty/long content gracefully
- Whether the design matches Figma
- Whether Lighthouse thresholds are met (run that manually before submission — see [Performance & Lighthouse](/theme-store-requirements/performance/))
- Whether the code matches our actual architecture conventions (theme blocks vs. Dawn-era patterns)

Those all still need a human reviewer. Treat CI as the floor, not the review.

## Quick Reference

- `Shopify/theme-check-action` runs Theme Check on every PR and push to `main`.
- CI catches lint errors, not design fidelity, content-edge-case handling, or performance.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
- [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action) — GitHub
