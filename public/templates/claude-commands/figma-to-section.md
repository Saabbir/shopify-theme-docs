---
description: Build a theme section/block from a Figma frame — plan, build, theme check, fix, report
argument-hint: [figma-link-or-node-id] [section-name]
allowed-tools: Read, Write, Edit, Bash(shopify theme check:*), Grep, Glob
---

You're building a Shopify theme section or block from a Figma design for the Solis project. Follow this loop in order — do not skip or reorder stages.

Input: $ARGUMENTS (a Figma link/node-id, and the section name to build)

## Stage 1: Plan

1. Pull design context for the given Figma frame (via the Figma MCP connection if available — see AGENTS.md and the handbook's Figma MCP & Dev Mode page).
2. Decompose the frame: list every distinct visual pattern, separate merchant-editable content from fixed chrome, note responsive variants, decide the block breakdown.
3. Check whether an equivalent section/block/snippet already exists in this repo (search `sections/`, `blocks/`, `snippets/`) before planning to build something new.
4. State the plan back before writing any code: proposed settings, block types and their settings, what's fixed, and how it handles empty/very-long/many-block content. Wait for confirmation only if something in the frame is genuinely ambiguous — otherwise proceed.

## Stage 2: Build

5. Generate the section/block/snippet files per the stated plan, following this repo's conventions in `AGENTS.md`:
   - A section either defines blocks locally OR accepts `@theme` blocks — never both.
   - Main product / featured product sections must also accept `@app` blocks.
   - Every block needs at least one `presets` entry.
   - Route every label through a `t:` locale key — never hardcoded English.
   - Scope CSS/JS with `{% stylesheet %}` / `{% javascript %}` tags in the same file.
   - Use CSS logical properties, not physical ones.

## Stage 3: Check

6. Run `shopify theme check` against the new/changed files.

## Stage 4: Fix

7. Resolve every offense — errors and warnings both. Don't stop at "zero errors" if warnings remain unaddressed; note explicitly if a warning is being deliberately left (and why).

## Stage 5: Report

8. Give a short summary: what was built, the settings/blocks list, any assumption made where the Figma frame was ambiguous, and confirmation that `shopify theme check` is clean. Do not paste full file contents in the summary — the reviewer can read the diff.
