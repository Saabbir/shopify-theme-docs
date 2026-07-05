---
title: 5a. Setting Up AI Rules
description: Ready-to-use rule files for Cursor, Claude Code, and GitHub Copilot.
---

Different AI tools read rules from different files, but they should all enforce the *same* standard. We maintain one shared understanding, mirrored into each tool's expected format, so it doesn't matter which tool a teammate prefers — the output is consistent.

## Cursor: `.cursor/rules/*.mdc`

Cursor's current recommended format is a directory of `.mdc` files (the older single `.cursorrules` file still works, but is being phased out). Each file targets a specific concern and only loads when relevant:

- [`00-project-context.mdc`](/templates/cursor-rules/00-project-context.mdc) — always loaded, project-wide constraints.
- [`01-liquid-and-schema.mdc`](/templates/cursor-rules/01-liquid-and-schema.mdc) — loads when editing `.liquid` files.
- [`02-css-and-js.mdc`](/templates/cursor-rules/02-css-and-js.mdc) — loads when editing CSS/JS.

Copy all three into `.cursor/rules/` at your theme repo's root and commit them — that's how the whole team gets the same behavior.

If you're on an older Cursor version without `.mdc` support, use the [legacy single-file version](/templates/legacy-cursorrules.txt) as `.cursorrules` instead.

## Claude Code: `CLAUDE.md`

Claude Code reads a `CLAUDE.md` file at your repo root automatically. [Download the template](/templates/CLAUDE.md) and drop it in.

## GitHub Copilot: `.github/copilot-instructions.md`

Copilot reads repository-level custom instructions from this path. [Download the template](/templates/github/copilot-instructions.md).

## What good rules actually look like

The rule files linked above aren't generic advice — they encode specific, checkable constraints. Compare:

| ❌ A vague, low-value rule | ✅ A specific, checkable rule |
|---|---|
| "Write good, clean Liquid code" | "A section either defines blocks locally OR accepts theme blocks via `@theme` — never both" |
| "Follow accessibility best practices" | "Every interactive element must be keyboard operable with a visible `:focus-visible` state" |
| "Use good naming" | "File names: kebab-case. Schema `id`s: snake_case" |

Vague rules don't actually change AI output much — the model already "knows" to write clean code in the abstract. Specific, checkable rules (the kind in our actual `.mdc`/`CLAUDE.md` files) are what steer output toward our real conventions instead of generic Shopify patterns from training data.

## Keeping all three in sync

These three files say the same things in three formats. When a rule changes:

1. Update it in whichever file you're editing.
2. Copy the same change into the other two.
3. Note the change in your PR description so reviewers know rules changed, not just code.

:::tip
If your team grows past a handful of people, consider generating all three from one source file (a small script that reads one YAML/Markdown source and writes the three tool-specific formats) instead of manually keeping them in sync. Not necessary at our current size, but worth knowing as an option.
:::

## Testing whether your rules are actually working

A rule file that's never been checked against real output is just aspirational documentation. Periodically:

1. Ask your AI tool to build something you know the "wrong" (Dawn-era) pattern for — e.g. a section with inline blocks.
2. Check whether it produces the current pattern (blocks in `/blocks`, `@theme` targeting) or falls back to the old one.
3. If it falls back, the relevant rule file needs to be more specific, not just longer.

## Best practices

- Prefer specific, checkable rules ("blocks live in `/blocks`, not inline in section schema") over vague ones ("write good code") — see the comparison table above.
- Re-test your rule files periodically against a known "wrong pattern" case, rather than assuming they still work as the tool and codebase evolve.
- Keep all three tool-specific files in sync deliberately — a rule that exists in `CLAUDE.md` but not `.cursor/rules/` means Cursor users silently miss it.

## Common mistakes

- **Writing rules that are true but not actionable** ("be accessible," "write clean code") — these rarely change actual model output.
- **Updating one tool's rule file and forgetting the other two**, so different teammates using different tools get inconsistent guidance over time.
- **Never actually testing whether the rules work** — a rule file is a hypothesis about what steers the model, and it's worth periodically verifying, not just writing once and trusting forever.

## Quick Reference

- Cursor → `.cursor/rules/*.mdc` (three files, linked above).
- Claude Code → `CLAUDE.md` at repo root.
- Copilot → `.github/copilot-instructions.md`.
- All three encode the same rules — update together, not independently.
- Specific, checkable rules steer output; vague ones mostly don't.

## Further Reading

- [Cursor rules documentation](https://cursor.com/docs/rules) — cursor.com
