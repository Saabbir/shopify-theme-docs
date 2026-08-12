---
title: Theme Check & Linting
description: Automated tools that catch mistakes before a human has to.
---

**TL;DR:** Automated tools that catch mistakes before a human has to.

## Theme Check

Theme Check is Shopify's official linter for Liquid, JSON schema, and theme structure. A linter is a tool that scans your code and flags mistakes automatically, before a real person ever has to spot them by eye. Skeleton Theme already ships with a `.theme-check.yml` config file (a settings file that tells Theme Check which rules to apply), so start from that instead of writing your own rules from scratch.

```bash
# Run it locally
shopify theme check

# Or, in VS Code, install the Shopify Liquid extension —
# it runs Theme Check inline as you type.
```

Theme Check catches things like missing `alt` attributes (text that describes an image for screen readers), unused variables, deprecated tags like `{% include %}` (tags that still work but are considered outdated), missing translation keys, and schema errors. Many of these are the exact same rules covered in [Codebase Structure](/codebase-structure/) and [Theme Store Requirements](/theme-store-requirements/), just checked automatically instead of by hand.

### A few specific offenses worth knowing by name

An "offense" is just Theme Check's name for one specific rule violation it finds in your code. Here are a few worth recognizing by name, since you'll run into them often:

| Offense | What it means | Where it's covered in this handbook |
|---|---|---|
| `DeprecatedTag` (on `{% include %}`) | You used the old, unscoped include tag instead of `{% render %}` | [Snippets & Naming Conventions](/codebase-structure/snippets-and-naming/) |
| `MissingTemplate` | A required template is missing from your theme | [Required Templates & Features](/theme-store-requirements/required-templates-and-features/) |
| `TranslationKeyExists` / `MissingTranslation` | A locale key referenced in your code doesn't exist in your locale file, or the other way around | [Internationalization & RTL](/internationalization-and-locales/internationalization-and-rtl/) |
| `RequiredLayoutThemeObject` | `theme.liquid` is missing something Shopify expects every layout to render, like `content_for_header` | [Folder Structure](/codebase-structure/folder-structure/) |
| `ImgLazyLoading` | An `<img>` tag is missing `loading="lazy"`, an attribute that tells the browser to delay loading an image until it's needed | [Performance & Lighthouse](/theme-store-requirements/performance/) |

You don't need to memorize this table. The point is simple: a Theme Check offense usually points back to a rule that's already explained somewhere else in this handbook. When you hit one you don't recognize, go look up the relevant page instead of just dismissing the warning.

## Prettier (Liquid plugin)

Shopify publishes an official [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin). Prettier is a code formatter: a tool that automatically arranges your code in one consistent style, like spacing and line breaks. Use it instead of manually trying to match everyone else's formatting by hand. For the actual project config, VS Code/Cursor setup, and where formatting is enforced (not just encouraged), see [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/).

## Where this runs

| When | What runs |
|---|---|
| While coding (VS Code/Cursor) | Shopify Liquid extension for inline Theme Check; Prettier extension for formatting. See [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) |
| Before committing | `shopify theme check` run manually, or a pre-commit hook (a script that runs automatically right before a commit is saved) |
| On every PR (CI) | `Shopify/theme-check-action`. See [CI Automation](/github-workflow/ci-automation/) for more on this |

## When to actually ignore a Theme Check offense

Sometimes a rule genuinely doesn't fit a specific, deliberate choice you made. Theme Check lets you turn off a rule inline (meaning just for one specific spot in your code), but treat this as a last resort, not a first instinct:

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

If you find yourself turning off the same rule again and again across your codebase, treat that as a signal. Bring it up with your team instead of just quietly suppressing it file by file.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Install the Shopify Liquid VS Code extension on day one. Getting Theme Check feedback while you type catches issues far earlier than waiting for a CI run. | **Silencing a Theme Check offense without understanding it.** You might be hiding something that maps directly to a real Theme Store requirement. |
| When you hit a Theme Check offense you don't recognize, look up what it actually checks for before you fix or dismiss it. The name alone doesn't always make the problem obvious. | **Only running Theme Check right before opening a PR**, instead of running it continuously during development. This turns a five-second fix into a much bigger cleanup job later. |
| Use the Prettier Liquid plugin across the whole project, so formatting differences never show up as noise in a pull request diff (the list of changes shown when you propose a code update). | **Letting formatting stay inconsistent across contributors** because Prettier isn't set up project-wide. This creates noisy diffs that hide the actual code change during review. |

## Key takeaways
- `shopify theme check`: run it locally, and it runs again automatically in CI.
- Start from Skeleton Theme's `.theme-check.yml` instead of a blank config.
- Prettier's official Liquid plugin keeps formatting consistent across contributors (and AI tools too).
- Look up offenses you don't recognize instead of silencing them without thinking it through.

## Further reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check): shopify.dev
- [Prettier plugin for Liquid](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin): shopify.dev
- [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/): the project's `.prettierrc`, VS Code/Cursor settings, and enforcement (pre-commit/CI)
