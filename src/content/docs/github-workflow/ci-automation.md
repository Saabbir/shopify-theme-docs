---
title: CI Automation
description: What runs automatically on every push and PR.
---

**TL;DR:** What runs automatically on every push and PR.

## The full CI workflow

Everything this project runs automatically on a PR lives in one file, [`ci.yml`](/templates/github/workflows/ci.yml). A GitHub Action is a small automated task that runs on GitHub's servers whenever something happens, like a push or a pull request, and this file defines one job made of five steps: check out the code, install Node, install dependencies, check formatting, then run Theme Check.

[Download the workflow file](/templates/github/workflows/ci.yml) and save it to `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run format:check
      - uses: Shopify/theme-check-action@v2
        with:
          token: ${{ github.token }}
          base: main
```

This is the one file to keep updated as the project's automated checks grow. The rest of this page walks through what each step does and links to where its config actually lives, so this stays the single place to look when you're wondering "what does CI actually check, and where's the config for that."

### Step 1–2: `actions/checkout` and `actions/setup-node`

These two just prepare the environment: `actions/checkout@v4` clones your repo into the runner, and `actions/setup-node@v4` installs Node.js (pinned here to version 22, matching what the project expects locally). Neither checks anything on their own, they're setup for the steps that follow.

### Step 3–4: `npm ci` and `npm run format:check`

`npm ci` (not `npm install`) is what belongs in CI specifically. It deletes `node_modules/` and reinstalls from scratch, strictly from `package-lock.json`, with no version resolution and no updating the lockfile. If `package.json` and `package-lock.json` are out of sync, `npm ci` fails loudly instead of quietly patching things up the way `npm install` would. That's exactly the behavior you want here: a CI run should install the exact versions everyone's using locally, not whatever the resolver decides is fine today.

`npm run format:check` runs Prettier against every file and fails if anything isn't formatted, without changing it. It reads its rules from [`.prettierrc.json`](/templates/prettierrc.json), the same config file your editor uses locally, so a CI failure here means the exact same thing a red squiggly in your editor would mean. Full setup for both the config file and the `format`/`format:check` npm scripts it depends on is in [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/); this step is only doing anything if that setup is in place.

### Step 5: `Shopify/theme-check-action`

Shopify maintains this action specifically for running [Theme Check](/quality-validation/theme-check-and-linting/) in CI: [`Shopify/theme-check-action`](https://github.com/Shopify/theme-check-action). It checks the same things you should already be checking on your own computer, using the same rules from your `.theme-check.yml` (see [Project Files Explained](/tooling-config/project-files/)). The difference is that it runs automatically, so nobody has to remember to run it by hand.

`token: ${{ github.token }}` is what turns violations into inline GitHub Check annotations directly on the PR diff, instead of only showing up buried in the Action's log. `base: main` scopes those annotations to just the files the PR actually changed. Both are technically optional, but skip them and you lose most of the point of running this in CI instead of just locally.

**`github.token`: nothing to set up.** It isn't a secret you create. GitHub Actions generates one automatically for every single workflow run and hands it to that run only, scoped to this one repository, expiring the moment the job finishes. It's the same underlying value as `${{ secrets.GITHUB_TOKEN }}`, `github.token` is just a shorter way to reference it, and by default it can read the repo and write things like check annotations and PR comments, which is exactly what `theme-check-action` needs to post its results. You don't add it to your repo's secrets, you don't generate it in your GitHub account settings, you just reference `${{ github.token }}` in the YAML and GitHub fills it in at run time. If you ever see a different action asking for a *personal access token* instead, that's a different thing entirely, one you'd generate yourself and add as a repo secret, most workflows in this handbook don't need one.

This setup stops a PR from merging if Theme Check finds a problem. Shopify calls these problems "offenses."

## Reading a failed CI run

When a step in `ci.yml` fails on a PR, GitHub shows you exactly which step failed and its full output. Which fix you need depends on which step:

- **`npm run format:check` failed** — some file isn't formatted to `.prettierrc.json`. Run `npm run format` locally, commit the result, and push again. This one's mechanical: you're not diagnosing anything, just letting Prettier rewrite the file.
- **`Shopify/theme-check-action` failed** — Theme Check found a problem, an "offense" in Shopify's terminology, in the Action's log, which is just a record of everything the automated check did. Each one includes a file, a line number, and a rule name. Fix it the same way you'd fix a Theme Check failure on your own computer.

Either way, a CI failure isn't scarier or different from the same failure locally, it's the same problem, just caught automatically instead of by hand.

| ✅ Do | ❌ Don't |
|---|---|
| Read the specific rule name in the failure and look it up if unfamiliar | Push an unrelated "fix" hoping it resolves a CI failure you didn't actually diagnose |
| Fix the offense locally, confirm with `shopify theme check` (or `npm run format:check`), then push | Disable or skip the failing check to unblock the merge |
| Ask a teammate if a Theme Check rule seems wrong for a specific case | Silently add a Theme Check ignore comment without understanding why the rule exists |

## Extending CI later

`ci.yml` already covers the two checks every PR needs on day one: formatting and Theme Check. As the project grows, this is still the one file to add more steps to, rather than spinning up a second workflow file. Some candidates:

- **A Lighthouse CI step.** Lighthouse is a tool that measures page speed and other performance scores, and Shopify provides tooling for this (see [Performance & Lighthouse](/theme-store-requirements/performance/)).
- **A commit-message check.** A step that verifies commits follow our [Conventional Commits](/getting-started/branching-and-commits/) style.
- **Anything else this handbook adds a config file for in the future.** If a future page introduces a new dev-tooling config (a new linter, a bundler check, and so on), the pattern is the same one this page and [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) already follow: the config file gets its own download link and explanation on the page that owns it, and `ci.yml` gets one more `- run:` or `- uses:` step added to enforce it, documented here.

You don't need any of this on day one. `ci.yml` as downloaded above is a solid starting point, and you build on the same file later instead of starting over or maintaining a second one.

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

## Key takeaways
- One file, [`ci.yml`](/templates/github/workflows/ci.yml), runs both checks: `npm run format:check` (Prettier) and `Shopify/theme-check-action` (Theme Check).
- `github.token` is generated automatically by GitHub Actions for every run — you never create or store it yourself.
- `npm ci` installs exact locked versions from `package-lock.json` and fails if it's out of sync, instead of quietly resolving new ones like `npm install` would.
- CI catches lint errors. It doesn't catch design differences, content edge cases, or performance issues.
- Read and fix CI failures the same way you would fix a local one. Don't guess-fix or suppress them.
- When a future config file gets added to the project, it gets its own `ci.yml` step added here, not a second workflow file.

## Further reading

- [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check) (shopify.dev)
- [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action) (GitHub)
- [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) — the `.prettierrc.json` config and `format`/`format:check` scripts this workflow depends on
- [`.prettierrc.json`](/templates/prettierrc.json) — the Prettier config `format:check` reads
