---
title: Theme Check & Linting
description: Automated tools that catch mistakes before a human has to.
---

## Theme Check

Shopify's official linter for Liquid, JSON schema, and theme structure. Skeleton Theme ships with a `.theme-check.yml` config already, so start from that rather than writing rules from scratch.

```bash
# Run it locally
shopify theme check

# Or, in VS Code, install the Shopify Liquid extension —
# it runs Theme Check inline as you type.
```

Theme Check catches things like: missing `alt` attributes, unused variables, deprecated tags (`{% include %}`), missing translation keys, and schema errors — many of the exact rules covered in [Codebase Structure](/codebase-structure/) and [Theme Store Requirements](/theme-store-requirements/).

## Prettier (Liquid plugin)

Shopify publishes an official [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) — use it for consistent formatting instead of manually matching styles across contributors.

## Where this runs

| When | What runs |
|---|---|
| While coding (VS Code) | Shopify Liquid extension — inline Theme Check + Prettier |
| Before committing | `shopify theme check` manually, or a pre-commit hook |
| On every PR (CI) | `Shopify/theme-check-action` — see [CI Automation](/github-workflow/ci-automation/) |

## Quick Reference

- `shopify theme check` — run locally, and it runs again in CI.
- Start from Skeleton Theme's `.theme-check.yml` rather than a blank config.
- Prettier's official Liquid plugin keeps formatting consistent across contributors (and AI tools).

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
- [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) — shopify.dev
