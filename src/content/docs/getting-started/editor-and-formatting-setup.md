---
title: Editor & Formatting Setup
description: The one Prettier config and editor settings everyone on the project uses, so formatting never shows up as noise in a PR diff.
---

**TL;DR:** The one Prettier config and editor settings everyone on the project uses, so formatting never shows up as noise in a PR diff.

[Theme Check & Linting](/quality-validation/theme-check-and-linting/) covers *what* Prettier is and that we use Shopify's official Liquid plugin. This page covers the part that actually makes it a team-wide convention instead of a suggestion: one committed config, one settings.json, and where formatting is actually enforced versus just encouraged.

Everything below is already committed to the Solis repo: `package.json`, `.prettierrc.json`, `.vscode/settings.json`, `.vscode/extensions.json`, and the `format`/`format:check` npm scripts. You're not building any of this from scratch. This page exists so you understand *why* each piece is there, what it does, and how to confirm it's actually working on your machine, not so you can recreate it.

## Why this project uses npm instead of just an editor extension

Neither Dawn nor Skeleton Theme ship a `package.json`. Both just commit a `.prettierrc.json` and lean on editor extensions (format-on-save, or the Shopify Liquid extension's bundled formatter) to apply it, and neither runs a Prettier check in CI at all. That's a reasonable baseline for a solo developer or a small, disciplined team.

It doesn't hold up here, for one specific reason: `.vscode/extensions.json` only *recommends* an extension to a human who opens the folder in VS Code. It doesn't install anything, doesn't cover teammates on a different editor, and, most importantly, can't apply to code an AI agent writes. Claude Code and Cursor's agent mode write files through file-edit tools directly, not by typing into an open editor buffer and triggering a save, so format-on-save structurally never fires for that code, no matter how correctly everyone's editor is configured. Since a real share of this project's Liquid/CSS/JS comes from an agent, we need something a CI job can actually invoke and gate a PR on, not just an editor convenience. That requires an installable, pinned `prettier` binary, which is what the `package.json` below is for.

(If you want CI enforcement without a committed `package.json` at all, `npx --yes prettier@<version> @shopify/prettier-plugin-liquid@<version> --check .` in a CI step gets you there too, at the cost of no lockfile-pinned versions and no local `npm run format` script. We're not using that here, but it's a legitimate alternative if your project's constraints differ from this one.)

## The project's `.prettierrc`

A plain Shopify theme (scaffolded from Skeleton Theme) has no `package.json` by default, since a theme is just Liquid, JSON, CSS, and JS files, no Node build step required. Solis isn't plain, though — it already has a `package.json`, with Prettier and Shopify's official Liquid plugin as dev dependencies. The moment you clone the repo and run `npm install`, you have everything below without installing or configuring any of it yourself.

This `package.json` (and the `node_modules/` it creates) lives in the repo for tooling only. It never reaches the Theme Store submission, [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/) already lists it in `.shopifyignore` alongside `node_modules/`, the same way a [Tailwind/Alpine build setup](/tooling-config/tailwind-and-alpine-build-setup/) excludes its own tooling.

`.prettierrc.json` is already committed at the repo root:

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

Don't edit this file casually or maintain your own local copy. It's shared, team-wide config; if a value genuinely needs to change, that's a decision for **the project maintainer**, made deliberately and communicated to the team, not a one-off local tweak.

The `plugins` line isn't optional. Prettier 3 and above requires the Liquid plugin to be declared explicitly in config, unlike some editor extensions that bundle it automatically. Without this line, running `prettier` from the command line or in CI silently falls back to formatting `.liquid` files as plain HTML, ignoring Liquid syntax.

Every other value above is the Liquid plugin's own documented default. They're written out explicitly, instead of left implicit, so the config states our actual convention on purpose and won't silently change if a future plugin version changes its defaults.

## Format-on-save is a convenience, not the enforcement mechanism

Turning on format-on-save in your editor is worth doing, but don't treat it as what actually keeps formatting consistent across the team. Two reasons:

- **It's a per-person setting.** Nothing stops a teammate from having it off, or a new hire from not knowing to turn it on.
- **AI tools don't trigger it at all.** Claude Code, Cursor's agent mode, and Copilot's agent mode write files directly through file-edit tools, not by simulating a keystroke and a save in an open editor tab. "Format-on-save" never fires for AI-generated code, no matter whose editor settings are correct.

So: format-on-save is a nice local habit. The actual enforcement is the CLI command everyone (human or AI) can run, and the CI check that runs whether or not anyone remembered to. Both are covered below.

## VS Code setup

Two different extensions can format a `.liquid` file: the **Shopify Liquid** extension (`Shopify.theme-check-vscode`) bundles the plugin and can format on its own, and the separate **Prettier** extension (`esbenp.prettier-vscode`) can too, once the plugin is installed locally per the section above.

We standardize on the **Prettier extension** as the one default formatter for every file type, Liquid included, not just CSS/JS/JSON. The reason isn't preference, it's mechanics: only a real, installed `prettier` binary can also run from the command line, from a pre-commit hook, and in CI. The Shopify Liquid extension's bundled formatter only exists inside VS Code, so there's no way to make it the thing CI actually checks against. One config, one binary, used identically everywhere, is what makes this an enforceable convention instead of an editor-specific nicety. Keep the Shopify Liquid extension installed regardless, since it's still what gives you inline Theme Check linting (see [Theme Check & Linting](/quality-validation/theme-check-and-linting/)) — it's just not the formatter.

`.vscode/settings.json` is already committed at the repo root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[liquid]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  }
}
```

The `[liquid]` override matters specifically because both extensions register as candidate formatters for `.liquid` files. Without it, VS Code either guesses or prompts you to pick one, and different teammates can end up with different answers to that prompt. `[jsonc]` (JSON with comments, used for a few config files that need inline comments) is deliberately left to VS Code's own built-in formatter instead of Prettier.

`.vscode/extensions.json` is also already committed. VS Code reads this automatically and prompts anyone who opens the project to install what's missing, so as a new teammate, opening the folder is the only step you need:

```json
{
  "recommendations": [
    "Shopify.theme-check-vscode",
    "esbenp.prettier-vscode",
    "anthropic.claude-code",
    "sissel.shopify-liquid"
  ]
}
```

Accept VS Code's install prompt when it appears. If it doesn't appear (some editors suppress it after the first dismissal), open the Extensions view and install each of the four manually.

## Cursor setup

Cursor is a VS Code fork, and generally picks up `.vscode/settings.json` the same way VS Code does, including `editor.formatOnSave` and `editor.defaultFormatter`. Don't just assume it's working, though — Cursor's own community has reported it not respecting every VS Code setting consistently, and formatting is worth confirming directly rather than taking on faith:

1. Deliberately misformat a `.liquid` file (add extra spaces, wrong quote style).
2. Save it.
3. Confirm Prettier reformats it automatically, the same way it would in VS Code.

If it doesn't, format manually via the command line (see below) until this is sorted out, rather than assuming the committed settings are silently doing their job.

## Why `.vscode/` isn't fully gitignored

Elsewhere in this handbook, [Project Files Explained](/tooling-config/project-files/) treats `.vscode/` as personal editor noise, and most of it is gitignored. `settings.json` and `extensions.json` are the deliberate exceptions, allow-listed in `.gitignore` so they're the two files that DO get committed and shared, while everything else in `.vscode/` (like a personal `launch.json`) stays ignored:

```gitignore
# OS/editor noise
.DS_Store
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

Because of this, a new teammate gets the right formatter, format-on-save, and an install prompt for the right extensions the moment they clone the repo and open VS Code or Cursor. Nobody has to set this up by hand, which is the actual point of calling this a project convention rather than a suggestion. If you ever find yourself wanting to gitignore `settings.json` or `extensions.json` to silence a personal tweak, don't, add your override somewhere personal instead and leave the shared files alone.

## Enforcing it outside the editor

`package.json` already has the scripts that let anyone, or any AI tool, run the same formatting manually, without opening an editor:

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
- **CI**, as a step in the project's one workflow file (`.github/workflows/theme-check.yml`, built from the [`ci.yml`](/templates/github/workflows/ci.yml) template), alongside the existing Theme Check action. Already committed, already running on every PR. Full walkthrough of every step, including `npm ci` and `github.token`, is on [CI Automation](/github-workflow/ci-automation/) — that's the page to check whenever you're wondering exactly what runs automatically and why.

CI is the one check here that's actually unconditional. It doesn't depend on anyone's local editor settings, whether format-on-save is on, or whether a human or an AI tool wrote the code.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
On a new project, commit `.prettierrc.json`, `.vscode/settings.json`, and `.vscode/extensions.json` on day one, not after formatting drift is already a problem in PR diffs (Solis already has all three — this is why). | **Installing the Prettier extension without also getting `@shopify/prettier-plugin-liquid` (already a dev dependency here, via `npm install`).** Without it, `.liquid` files silently get formatted as plain HTML instead. |
| Treat `format:check` in CI as the actual source of truth. Format-on-save and editor settings are conveniences that reduce how often CI catches something, not a replacement for CI catching it. | **Relying only on format-on-save, with no `format:check` step in CI.** This works fine until someone has it off, a new teammate never sets it up, or an AI tool writes a file directly — all of which bypass format-on-save entirely. |
| When an AI tool generates or edits Liquid, CSS, or JS, run `npm run format` (or trust the pre-commit hook) before opening a PR. Agent-written file edits never go through "save in an open editor tab," so they need this step explicitly. | **Leaving both the Shopify Liquid extension and the Prettier extension registered as formatters for `.liquid` without the `[liquid]` override.** Different teammates get prompted to pick a formatter and don't all pick the same one. |
| — | **Gitignoring all of `.vscode/` instead of allow-listing the two files that should be shared.** This is the single change that turns "we have a formatting convention" into "everyone actually has the same settings." |

## Key takeaways
- `.prettierrc.json` is already committed at the repo root ([reference template](/templates/prettierrc.json) if you're setting up a different project). Declares `"plugins": ["@shopify/prettier-plugin-liquid"]` — Prettier 3+ won't infer it.
- Standardize on the **Prettier extension** (`esbenp.prettier-vscode`) as the default formatter for every file type, including `.liquid` — not the Shopify Liquid extension's bundled formatter, since only a real `prettier` binary also works from the CLI, pre-commit, and CI.
- `.vscode/settings.json` and `.vscode/extensions.json` are already committed and un-ignored in `.gitignore`. Open the folder in VS Code or Cursor and accept the install prompt, nothing to create yourself.
- Cursor generally honors these settings since it's a VS Code fork, but confirm it's actually reformatting on save rather than assuming.
- Format-on-save is a convenience. `npm run format:check` in a pre-commit hook and in CI is the real enforcement — it's the only one of the three that AI-written code can't bypass.

## Further reading

- [Shopify Liquid Prettier Plugin](https://shopify.dev/docs/storefronts/themes/tools/liquid-prettier-plugin) (shopify.dev), the full configuration option reference this page's defaults come from
- [Prettier pre-commit documentation](https://prettier.io/docs/en/precommit.html) (prettier.io)
- [Theme Check & Linting](/quality-validation/theme-check-and-linting/) — what Prettier and Theme Check each catch, and where they run
- [Project Files Explained](/tooling-config/project-files/) — the full `.gitignore`/`.shopifyignore` picture this page's `.vscode/` change fits into
