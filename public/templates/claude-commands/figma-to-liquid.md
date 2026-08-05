---
description: Build a theme section, block, or snippet from a Figma frame — plan, build, theme check, fix, document, report
argument-hint: [figma-link-or-node-id] [artifact-name]
allowed-tools: Read, Write, Edit, Bash(shopify theme check:*), Bash(mkdir:*), Grep, Glob, Task
---

You're building a Shopify theme artifact (a section, a standalone block, or a snippet — whichever the frame actually calls for) from a Figma design for the Solis project. Follow this loop in order — do not skip or reorder stages. The actual coding rules live in `AGENTS.md`, not in this command — this command is the repeatable *process*, `AGENTS.md` is the source of truth for *what correct code looks like*. Don't restate or fork conventions here; reference the file.

Input: $ARGUMENTS (a Figma link/node-id, and the name of what you're building)

## Stage 1: Plan

1. Pull design context for the given Figma frame (via the Figma MCP connection if available — see AGENTS.md and the handbook's Figma MCP & Dev Mode page).
2. Decompose the frame: list every distinct visual pattern, separate merchant-editable content from fixed chrome, note responsive variants. Decide what this actually needs: a full section (with its own blocks or `@theme` blocks), a standalone block meant to be reused inside an existing section, or just a snippet. Not every Figma frame needs a section — a small reusable piece (a badge, a price display) is usually a block or snippet instead.
3. Check whether an equivalent section/block/snippet already exists in this repo (search `sections/`, `blocks/`, `snippets/`) before planning to build something new.
4. State the plan back before writing any code: which artifact type you've decided on and why, proposed settings, block types and their settings if applicable, what's fixed, and how it handles empty/very-long/many-block content. Wait for confirmation only if something in the frame is genuinely ambiguous — otherwise proceed.

## Stage 2: Build

5. Generate the section/block/snippet files per the stated plan, following this repo's conventions in `AGENTS.md` — do not skip reading it if it hasn't already loaded as project context. Key rules it defines (non-exhaustive — `AGENTS.md` is authoritative, this is a reminder, not a substitute):
   - A section either defines blocks locally OR accepts `@theme` blocks — never both.
   - Main product / featured product sections must also accept `@app` blocks.
   - Every block needs at least one `presets` entry.
   - Route every label through a `t:` locale key — never hardcoded English.
   - Scope CSS/JS with `{% stylesheet %}` / `{% javascript %}` tags in the same file.
   - Use CSS logical properties, not physical ones.

## Stage 3: Check

6. Run `shopify theme check` against the new/changed files.

## Stage 4: Fix (delegate — don't fix inline)

7. If `theme check` reported any offense, **delegate to the `theme-check-fixer` subagent** rather than resolving offenses in this conversation — it runs isolated, with tool access scoped to `Read, Edit, Bash(shopify theme check:*)`, and returns a fix log instead of flooding this session with every offense's file content. Wait for it to report a clean run (zero errors, and every warning either resolved or explicitly justified) before continuing to Stage 5.

## Stage 5: Document

8. Create `docs/sections/<name>.md`, `docs/blocks/<name>.md`, or `docs/snippets/<name>.md` (match whichever type you actually built in Stage 2, using kebab-case matching the artifact's file name; create the directory if it doesn't exist yet) recording, for future maintainers and reviewers:
   - The Figma source (link/node-id) and the date built.
   - Which artifact type you built (section, block, or snippet) and why.
   - The final settings and block-type list, with a one-line purpose for each.
   - Any assumption made where the Figma frame was ambiguous, and why that call was made.
   - Confirmation that `shopify theme check` is clean, and the fix log from Stage 4 if any offenses were found and resolved.
   - Any stress-test results (empty state, very long content, many blocks) if you ran them.

   This file is dev documentation, not theme code — it must be excluded from any Theme Store submission zip via `.shopifyignore` (see the handbook's Packaging: Theme Store-Only Directories page). Don't skip this stage because the artifact feels self-explanatory; the point is a record for someone without this conversation's context, not a restatement of the diff.

## Stage 6: Report

9. Give a short summary in this conversation: what was built, the settings/blocks list, any assumption made where the Figma frame was ambiguous, confirmation that `shopify theme check` is clean, and the path to the doc file written in Stage 5. Do not paste full file contents in the summary — the reviewer can read the diff and the doc file.
