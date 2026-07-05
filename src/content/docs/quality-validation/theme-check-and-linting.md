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

### A few specific offenses worth knowing by name

| Offense | What it means | Where it's covered in this handbook |
|---|---|---|
| `DeprecatedTag` (on `{% include %}`) | You used the old, unscoped include tag instead of `{% render %}` | [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) |
| `MissingTemplate` | A required template is absent | [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) |
| `TranslationKeyExists` / `MissingTranslation` | A locale key referenced in code doesn't exist in your locale file, or vice versa | [Internationalization & RTL](/theme-store-requirements/internationalization-and-rtl/) |
| `RequiredLayoutThemeObject` | `theme.liquid` is missing something Shopify expects every layout to render (e.g. `content_for_header`) | [Folder Structure](/codebase-structure/folder-structure/) |
| `ImgLazyLoading` | An `<img>` is missing `loading="lazy"` where it should have it | [Performance & Lighthouse](/theme-store-requirements/performance/) |

You don't need to memorize these — the point is that Theme Check offenses usually map directly to a rule already covered elsewhere in this handbook. When you hit an unfamiliar one, that's a good moment to go find the relevant page rather than just silencing the warning.

## Prettier (Liquid plugin)

Shopify publishes an official [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) — use it for consistent formatting instead of manually matching styles across contributors.

## Where this runs

| When | What runs |
|---|---|
| While coding (VS Code) | Shopify Liquid extension — inline Theme Check + Prettier |
| Before committing | `shopify theme check` manually, or a pre-commit hook |
| On every PR (CI) | `Shopify/theme-check-action` — see [CI Automation](/github-workflow/ci-automation/) |

## When to actually ignore a Theme Check offense

Occasionally a rule genuinely doesn't apply to a specific, deliberate choice. Theme Check supports inline ignores, but treat this as a last resort:

```liquid
{% comment %} ❌ AVOID — silencing a warning without understanding
   or documenting why {% endcomment %}
{% # theme-check-disable %}
{% include 'legacy-snippet' %}
{% # theme-check-enable %}

{% comment %} ✅ BETTER — if you must ignore something, say why,
   and prefer fixing the actual issue whenever possible {% endcomment %}
{% # theme-check-disable UnknownFilter -- third-party filter registered by
   an app block, not something Theme Check can resolve statically %}
```

If you find yourself disabling the same rule repeatedly across the codebase, that's a signal to discuss it with the team rather than normalize suppressing it file by file.

## Best practices

- Install the Shopify Liquid VS Code extension on day one — inline Theme Check feedback while typing catches issues far earlier than waiting for a CI run.
- When you hit an unfamiliar Theme Check offense, look up what it actually checks for before either fixing or dismissing it — the name alone is sometimes ambiguous.
- Use the Prettier Liquid plugin project-wide so formatting differences never show up as noise in a PR diff.

## Common mistakes

- **Silencing a Theme Check offense without understanding it**, which risks suppressing something that maps directly to a real Theme Store requirement.
- **Only running Theme Check right before opening a PR** instead of continuously during development, turning a five-second fix into a larger cleanup pass.
- **Inconsistent formatting across contributors** because Prettier isn't configured project-wide, creating noisy diffs that obscure the actual code change in review.

## Quick Reference

- `shopify theme check` — run locally, and it runs again in CI.
- Start from Skeleton Theme's `.theme-check.yml` rather than a blank config.
- Prettier's official Liquid plugin keeps formatting consistent across contributors (and AI tools).
- Look up unfamiliar offenses rather than silencing them reflexively.

## Further Reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) — shopify.dev
- [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) — shopify.dev
