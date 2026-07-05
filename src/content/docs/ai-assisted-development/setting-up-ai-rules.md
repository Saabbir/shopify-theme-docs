---
title: 8a. Setting Up AI Rules (AGENTS.md)
description: One source of truth for Cursor, Claude Code, and GitHub Copilot — generated, not hand-duplicated.
---

Different AI tools historically read rules from different files — `.cursor/rules/*.mdc`, `CLAUDE.md`, `.github/copilot-instructions.md` — which meant hand-copying every rule change into three places and hoping nobody forgot one. This page covers the current, better approach: **one file, `AGENTS.md`, as the single source of truth**, with the tool-specific files either reading it directly or generated from it automatically.

## Why this changed

[AGENTS.md](https://agents.md) is an open, cross-tool convention — plain Markdown, no required schema — for giving AI coding agents project instructions. As of this writing it's read natively by Cursor, GitHub Copilot, Claude Code, and dozens of other tools, straight from the repo root, with no setup. That makes the old "maintain three files" problem mostly obsolete: write the rules once, in `AGENTS.md`, and most tools just pick it up.

The catch: a couple of tool-specific features are genuinely useful and AGENTS.md alone doesn't give you them —

- **Cursor's per-file-type auto-attach** — a rule that only loads when you're editing a `.liquid` file, so it doesn't take up context when you're editing CSS. This needs `.cursor/rules/*.mdc` files with `globs` frontmatter; a single flat AGENTS.md can't express "only when editing this file type."
- **Claude Code's `CLAUDE.md`** is its richer native format and supports `@file` imports, so it's worth keeping — but as a thin pointer, not a duplicate.

So the actual setup is: **`AGENTS.md` is what you edit. Everything else is either a one-line import of it, or generated from it by a script.**

## The file layout

| File | What it is | Do you edit it? |
|---|---|---|
| `AGENTS.md` | The single source of truth. Plain Markdown, sections tagged with `<!-- scope: ... -->` comments. | **Yes — this is the only file you edit.** |
| `CLAUDE.md` | Two lines: `@AGENTS.md` (Claude Code's native import syntax) plus optional Claude-only notes. | Only to add Claude-specific notes, never to duplicate rules. |
| `.cursor/rules/00-project-context.mdc` | Generated. Always-loaded core rules. | No — regenerate instead. |
| `.cursor/rules/01-liquid-and-schema.mdc` | Generated. Loads on `.liquid` files. | No — regenerate instead. |
| `.cursor/rules/02-css-and-js.mdc` | Generated. Loads on CSS/JS files. | No — regenerate instead. |
| `.cursorrules` | Generated. Legacy single-file fallback for older Cursor versions. | No — regenerate instead. |
| `.github/copilot-instructions.md` | Generated. Copilot has no scoped auto-attach, so this gets everything, flattened. | No — regenerate instead. |

## Setting it up

1. [Download `AGENTS.md`](/templates/AGENTS.md) and put it at your theme repo's root.
2. [Download `CLAUDE.md`](/templates/CLAUDE.md) and put it alongside it — it's just an `@AGENTS.md` import, nothing to customize unless you want Claude-only notes.
3. [Download `scripts/generate-ai-rules.mjs`](/templates/scripts/generate-ai-rules.mjs) into a `scripts/` folder in your repo.
4. Run it once to produce the initial generated files:

```bash
node scripts/generate-ai-rules.mjs
```

5. Commit everything — `AGENTS.md`, `CLAUDE.md`, `scripts/generate-ai-rules.mjs`, and the generated `.cursor/rules/*.mdc`, `.cursorrules`, `.github/copilot-instructions.md` files. Commit the generated files too (not just the script) so a teammate who hasn't run Node yet still gets working Cursor/Copilot rules the moment they clone the repo.

## How the generation script works

`AGENTS.md` sections are tagged with an HTML comment right after the heading:

```markdown
<!-- scope: core -->
## Hard constraints
...always-relevant rules...

<!-- scope: liquid -->
## Liquid & schema conventions
...only relevant when editing .liquid files...

<!-- scope: css-js -->
## CSS & JavaScript conventions
...only relevant when editing CSS/JS...
```

The script parses these tags and routes each section to the right generated file — `core` sections go into `00-project-context.mdc` (`alwaysApply: true`), `liquid` sections go into `01-liquid-and-schema.mdc` (`globs: ["**/*.liquid"]`), and so on. `.cursorrules` and `copilot-instructions.md` get everything flattened, since neither tool does scoped auto-attach the way Cursor's `.mdc` files do.

Every generated file gets a banner: `GENERATED FILE — DO NOT EDIT DIRECTLY. Source of truth: AGENTS.md.` If you're tempted to quick-fix a typo directly in `.cursor/rules/00-project-context.mdc`, the next regeneration will silently overwrite it — fix it in `AGENTS.md` instead.

## Updating a rule (the whole workflow)

1. Edit `AGENTS.md` — add, change, or re-scope a section.
2. Run `node scripts/generate-ai-rules.mjs`.
3. Commit `AGENTS.md` together with the regenerated files in the same commit — never commit an `AGENTS.md` change without also committing its regeneration, or the generated files silently go stale.
4. Mention the rule change in your PR description, same as any other behavior change.

| ✅ Do | ❌ Don't |
|---|---|
| Edit `AGENTS.md`, then regenerate, then commit both together | Hand-edit `.cursor/rules/00-project-context.mdc` directly because it's "just a quick fix" |
| Add a `pre-commit` hook or CI check that fails if generated files are stale relative to `AGENTS.md` | Rely on remembering to run the script every time |
| Keep `AGENTS.md` sections scoped correctly (`core` vs. `liquid` vs. `css-js`) so Cursor's auto-attach stays meaningful | Tag everything `core` "to be safe" — that defeats the point of scoped loading in Cursor |

### A CI guard worth adding

Since a stale generated file is a silent failure (nothing breaks, teammates using Cursor just quietly get outdated rules), it's worth adding a CI check that re-runs the generator and fails the build if anything changed:

```yaml
# .github/workflows/ai-rules-sync.yml
- name: Check AI rule files are in sync with AGENTS.md
  run: |
    node scripts/generate-ai-rules.mjs
    git diff --exit-code -- .cursor/rules .cursorrules .github/copilot-instructions.md
```

This turns "forgot to regenerate" from a silent drift into a failed CI check, the same way `theme check` turns a lint issue into a visible one.

## What good rules actually look like

The rules in `AGENTS.md` aren't generic advice — they encode specific, checkable constraints. Compare:

| ❌ A vague, low-value rule | ✅ A specific, checkable rule |
|---|---|
| "Write good, clean Liquid code" | "A section either defines blocks locally OR accepts theme blocks via `@theme` — never both" |
| "Follow accessibility best practices" | "Every interactive element must be keyboard operable with a visible `:focus-visible` state" |
| "Use good naming" | "File names: kebab-case. Schema `id`s: snake_case" |

Vague rules don't actually change AI output much — the model already "knows" to write clean code in the abstract. Specific, checkable rules are what steer output toward our real conventions instead of generic Shopify patterns from training data.

## Testing whether your rules are actually working

A rule file that's never been checked against real output is just aspirational documentation. Periodically:

1. Ask your AI tool to build something you know the "wrong" (Dawn-era) pattern for — e.g. a section with inline blocks.
2. Check whether it produces the current pattern (blocks in `/blocks`, `@theme` targeting) or falls back to the old one.
3. If it falls back, the relevant `AGENTS.md` section needs to be more specific, not just longer.

## Best practices

- Treat `AGENTS.md` as the only file you hand-edit — every other rule file is either an import or a build artifact.
- Add the CI sync-check above as soon as more than one person is regenerating rules, so drift becomes a visible failure instead of a silent one.
- Prefer specific, checkable rules over vague ones — see the comparison table above.
- Re-test your rules periodically against a known "wrong pattern" case, rather than assuming they still work as the tool and codebase evolve.

## Common mistakes

- **Hand-editing a generated file** (`.cursor/rules/*.mdc`, `.cursorrules`, `copilot-instructions.md`) instead of `AGENTS.md` — the next regeneration silently overwrites the fix.
- **Editing `AGENTS.md` but forgetting to run the generator**, so Cursor/Copilot users work off stale rules while Claude Code (which imports `AGENTS.md` directly) already sees the update.
- **Tagging every section `core`** to avoid thinking about scope, which defeats Cursor's per-file-type auto-attach and bloats every context window unnecessarily.
- **Writing rules that are true but not actionable** ("be accessible," "write clean code") — these rarely change actual model output.

## Quick Reference

- Edit `AGENTS.md` only. Everything else is an import (`CLAUDE.md`) or a generated artifact.
- Regenerate with `node scripts/generate-ai-rules.mjs` after every `AGENTS.md` change, and commit both together.
- Section scopes: `core` (always), `liquid` (`.liquid` files), `css-js` (CSS/JS files).
- Add a CI check that fails if generated files drift from `AGENTS.md`.

## Further Reading

- [AGENTS.md](https://agents.md) — the open specification
- [Cursor rules documentation](https://cursor.com/docs/rules) — cursor.com
