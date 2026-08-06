---
title: Editor & Formatting Setup
description: The one Prettier config and editor settings everyone on the project uses, so formatting never shows up as noise in a PR diff.
---

**TL;DR:** The one Prettier config and editor settings everyone on the project uses, so formatting never shows up as noise in a PR diff.

[Theme Check & Linting](/quality-validation/theme-check-and-linting/) covers *what* Prettier is and that we use Shopify's official Liquid plugin. This page covers the part that actually makes it a team-wide convention instead of a suggestion: one committed config, one settings.json, and where formatting is actually enforced versus just encouraged.

## Why this project uses npm instead of just an editor extension

Neither Dawn nor Skeleton Theme ship a `package.json`. Both just commit a `.prettierrc.json` and lean on editor extensions (format-on-save, or the Shopify Liquid extension's bundled formatter) to apply it, and neither runs a Prettier check in CI at all. That's a reasonable baseline for a solo developer or a small, disciplined team.

It doesn't hold up here, for one specific reason: `.vscode/extensions.json` only *recommends* an extension to a human who opens the folder in VS Code. It doesn't install anything, doesn't cover teammates on a different editor, and, most importantly, can't apply to code an AI agent writes. Claude Code and Cursor's agent mode write files through file-edit tools directly, not by typing into an open editor buffer and triggering a save, so format-on-save structurally never fires for that code, no matter how correctly everyone's editor is configured. Since a real share of this project's Liquid/CSS/JS comes from an agent, we need something a CI job can actually invoke and gate a PR on, not just an editor convenience. That requires an installable, pinned `prettier` binary, which is what the `package.json` below is for.

(If you want CI enforcement without a committed `package.json` at all, `npx --yes prettier@<version> @shopify/prettier-plugin-liquid@<version> --check .` in a CI step gets you there too, at the cost of no lockfile-pinned versions and no local `npm run format` script. We're not using that here, but it's a legitimate alternative if your project's constraints differ from this one.)

## The project's `.prettierrc`

A plain Shopify theme repo (scaffolded from Skeleton Theme) has no `package.json` by default, since a theme is just Liquid, JSON, CSS, and JS files, no Node build step required. You still need one to install Prettier as a dev dependency. If your repo doesn't have one yet, create it first:

```bash
npm init -y
```

This `package.json` (and the `node_modules/` it creates) lives in your git repo for tooling only. It never reaches your Theme Store submission, [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/) already lists it in `.shopifyignore` alongside `node_modules/`, the same way a [Tailwind/Alpine build setup](/tooling-config/tailwind-and-alpine-build-setup/) excludes its own tooling. Adding it doesn't change what you submit.

Then install Prettier and Shopify's official Liquid plugin as dev dependencies:

```bash
npm install --save-dev prettier @shopify/prettier-plugin-liquid
```

Then add a `.prettierrc.json` at the repo root. [Download this file](/templates/prettierrc.json) and save it as `.prettierrc.json`:

```json
{
  "plugins": ["@shopify/prettier-plugin-liquid"],
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": false,
  "liquidSingleQuote": true,
  "embeddedSingleQuote": true,
  "htmlWhitespaceSensitivity": "css",
  "singleLineLinkTags": false,
  "indentSchema": false
}
```

The `plugins` line isn't optional. Prettier 3 and above requires the Liquid plugin to be declared explicitly in config, unlike some editor extensions that bundle it automatically. Without this line, running `prettier` from the command line or in CI silently falls back to formatting `.liquid` files as plain HTML, ignoring Liquid syntax.

Every other value above is the Liquid plugin's own documented default. We write them out explicitly, instead of leaving them implicit, so the config states our actual convention on purpose and won't silently change if a future plugin version changes its defaults. Skeleton Theme doesn't ship a `.prettierrc` of its own, so this is a file you add yourself, not one you're editing.

## Format-on-save is a convenience, not the enforcement mechanism

Turning on format-on-save in your editor is worth doing, but don't treat it as what actually keeps formatting consistent across the team. Two reasons:

- **It's a per-person setting.** Nothing stops a teammate from having it off, or a new hire from not knowing to turn it on.
- **AI tools don't trigger it at all.** Claude Code, Cursor's agent mode, and Copilot's agent mode write files directly through file-edit tools, not by simulating a keystroke and a save in an open editor tab. "Format-on-save" never fires for AI-generated code, no matter whose editor settings are correct.

So: format-on-save is a nice local habit. The actual enforcement is the CLI command everyone (human or AI) can run, and the CI check that runs whether or not anyone remembered to. Both are covered below.

## VS Code setup

Two different extensions can format a `.liquid` file: the **Shopify Liquid** extension (`Shopify.theme-check-vscode`) bundles the plugin and can format on its own, and the separate **Prettier** extension (`esbenp.prettier-vscode`) can too, once the plugin is installed locally per the section above.

We standardize on the **Prettier extension** as the one default formatter for every file type, Liquid included, not just CSS/JS/JSON. The reason isn't preference, it's mechanics: only a real, installed `prettier` binary can also run from the command line, from a pre-commit hook, and in CI. The Shopify Liquid extension's bundled formatter only exists inside VS Code, so there's no way to make it the thing CI actually checks against. One config, one binary, used identically everywhere, is what makes this an enforceable convention instead of an editor-specific nicety. Keep the Shopify Liquid extension installed regardless, since it's still what gives you inline Theme Check linting (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)) — it's just not the formatter.

[Download `settings.json`](/templates/vscode/settings.json) and save it at `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[liquid]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

The `[liquid]` override matters specifically because both extensions register as candidate formatters for `.liquid` files. Without it, VS Code either guesses or prompts you to pick one, and different teammates can end up with different answers to that prompt.

[Download `extensions.json`](/templates/vscode/extensions.json) and save it at `.vscode/extensions.json`. VS Code reads this automatically and prompts anyone who opens the project to install what's missing:

```json
{
  "recommendations": [
    "Shopify.theme-check-vscode",
    "esbenp.prettier-vscode",
    "anthropic.claude-code"
  ]
}
```

## Cursor setup

Cursor is a VS Code fork, and generally picks up `.vscode/settings.json` the same way VS Code does, including `editor.formatOnSave` and `editor.defaultFormatter`. Don't just assume it's working, though — Cursor's own community has reported it not respecting every VS Code setting consistently, and formatting is worth confirming directly rather than taking on faith:

1. Deliberately misformat a `.liquid` file (add extra spaces, wrong quote style).
2. Save it.
3. Confirm Prettier reformats it automatically, the same way it would in VS Code.

If it doesn't, format manually via the command line (see below) until this is sorted out, rather than assuming the committed settings are silently doing their job.

## Sharing this with the whole team via `.vscode/`

Elsewhere in this handbook, [Project Files Explained](/tooling-config/project-files/) treats `.vscode/` as personal editor noise and gitignores the whole folder. That's the right default for most of what lives there, but it means nobody's format-on-save setting was ever actually shared — everyone was configuring this by hand, or not at all.

Fix this by un-ignoring the two files that make the convention automatic, while still ignoring everything else in `.vscode/` (like a personal `launch.json`):

```gitignore
# OS/editor noise
.DS_Store
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

With `settings.json` and `extensions.json` committed, a new teammate gets the right formatter, format-on-save, and an install prompt for the right extensions the moment they clone the repo and open VS Code or Cursor. Nobody has to remember to set this up by hand, which is the actual point of calling this a project convention rather than a suggestion.

## Enforcing it outside the editor

Add scripts so the same formatting anyone (or any AI tool) can run manually, without opening an editor:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

`npm run format` reformats everything in place. `npm run format:check` reports whether anything is *not* formatted, without changing it, exits non-zero if something fails, which is what makes it usable as a gate rather than a fix.

Use `format:check` in two places:

- **A pre-commit hook**, so a badly formatted file never gets committed in the first place. See [Prettier's own pre-commit documentation](https://prettier.io/docs/en/precommit.html) for setting one up.
- **CI**, as a step in the project's one workflow file, [`ci.yml`](/templates/github/workflows/ci.yml), alongside the existing Theme Check action. Full walkthrough of every step, including `npm ci` and `github.token`, is on [CI Automation](/github-workflow/ci-automation/) — that's the page to check whenever you're wondering exactly what runs automatically and why.

CI is the one check here that's actually unconditional. It doesn't depend on anyone's local editor settings, whether format-on-save is on, or whether a human or an AI tool wrote the code.

## Best practices

- Commit `.prettierrc.json`, `.vscode/settings.json`, and `.vscode/extensions.json` on day one of a new project, not after formatting drift is already a problem in PR diffs.
- Treat `format:check` in CI as the actual source of truth. Format-on-save and editor settings are conveniences that reduce how often CI catches something, not a replacement for CI catching it.
- When an AI tool generates or edits Liquid, CSS, or JS, run `npm run format` (or trust the pre-commit hook) before opening a PR. Agent-written file edits never go through "save in an open editor tab," so they need this step explicitly.

## Common mistakes

- **Installing the Prettier extension without installing `@shopify/prettier-plugin-liquid` locally.** The extension will format everything except `.liquid` files correctly, and `.liquid` files will silently get formatted as plain HTML instead.
- **Relying only on format-on-save, with no `format:check` step in CI.** This works fine until someone has it off, a new teammate never sets it up, or an AI tool writes a file directly — all of which bypass format-on-save entirely.
- **Leaving both the Shopify Liquid extension and the Prettier extension registered as formatters for `.liquid` without the `[liquid]` override.** Different teammates get prompted to pick a formatter and don't all pick the same one.
- **Gitignoring all of `.vscode/` instead of allow-listing the two files that should be shared.** This is the single change that turns "we have a formatting convention" into "everyone actually has the same settings."

## Key Takeaways
- `.prettierrc.json`: [download it](/templates/prettierrc.json). Must declare `"plugins": ["@shopify/prettier-plugin-liquid"]` — Prettier 3+ won't infer it.
- Standardize on the **Prettier extension** (`esbenp.prettier-vscode`) as the default formatter for every file type, including `.liquid` — not the Shopify Liquid extension's bundled formatter, since only a real `prettier` binary also works from the CLI, pre-commit, and CI.
- `.vscode/settings.json` and `.vscode/extensions.json`: [download](/templates/vscode/settings.json) [both](/templates/vscode/extensions.json), commit them, and un-ignore just those two files in `.gitignore`.
- Cursor generally honors these settings since it's a VS Code fork, but confirm it's actually reformatting on save rather than assuming.
- Format-on-save is a convenience. `npm run format:check` in a pre-commit hook and in CI is the real enforcement — it's the only one of the three that AI-written code can't bypass.

## Further Reading

- [Shopify Liquid Prettier Plugin](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) (shopify.dev), the full configuration option reference this page's defaults come from
- [Prettier pre-commit documentation](https://prettier.io/docs/en/precommit.html) (prettier.io)
- [Theme Check & Linting](/quality-validation/theme-check-and-linting/) — what Prettier and Theme Check each catch, and where they run
- [Project Files Explained](/tooling-config/project-files/) — the full `.gitignore`/`.shopifyignore` picture this page's `.vscode/` change fits into
