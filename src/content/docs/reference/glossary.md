---
title: Glossary
description: Every term this handbook uses, defined once, grouped by topic.
---

## Shopify theme architecture

**Skeleton Theme** — Shopify's official, minimal starting codebase, the only Shopify-provided base eligible for Theme Store submission. See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/).

**Horizon** — Shopify's newest reference theme, showcasing current architecture (nested theme blocks, `@theme`/`@app` targeting). Not eligible as a Theme Store submission base — used here as an architectural reference only.

**Dawn** — Shopify's previous-generation reference theme (OS 2.0, but pre-nested-blocks architecture). Also not eligible as a submission base.

**Theme block** — A merchant-addable, reorderable, removable unit of content living in `/blocks`, targeted into a section via `@theme`/`@app`. See [Theme Blocks & Nesting](/codebase-structure/theme-blocks/).

**Section** — A configurable region of a template, with its own settings and (optionally) blocks. See [Sections & Section Groups](/codebase-structure/sections-and-section-groups/).

**Section group** — A JSON file defining a reusable arrangement of sections (e.g. the header or footer), shared across templates.

**Snippet** — A reusable piece of Liquid, invoked via `{% render %}` with explicit parameters — no merchant-editable settings of its own.

**`@theme` / `@app` block targeting** — Schema syntax letting a section accept theme blocks (`@theme`) and/or app blocks (`@app`) generically, instead of a fixed list of specific block types.

**Presets** — A schema array (on a section or block) defining default configurations that appear in the theme editor's "Add section/block" picker. Without at least one preset, a block never appears in the picker.

## Liquid

**`{% render %}`** — The current, correct way to invoke a snippet with explicit parameters. Replaces the deprecated `{% include %}`.

**`{% include %}`** — Deprecated. Leaks the calling scope's variables into the included file; never use it.

**LiquidDoc** — The `{%- doc -%}` comment convention documenting a snippet's parameters.

**Whitespace control** — The `{%-`/`-%}` hyphen syntax that strips surrounding whitespace from a tag's output.

**Global object** — A Liquid object available across many templates (`product`, `collection`, `cart`, `shop`, `routes`, `settings`, `request`, `localization`). See [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/).

## CSS & JavaScript

**Custom property** — A CSS variable (`--name: value`), resolved at render time, the mechanism for exposing a single merchant setting as one CSS value.

**Logical property** — A direction-aware CSS property (`margin-inline-start` vs. `margin-left`) that flips correctly under RTL layout.

**`{% stylesheet %}` / `{% javascript %}`** — Liquid tags scoping CSS/JS to the component file they're written in; deduplicated and only loaded on pages where that component renders.

**Web Component** — A native browser API (Custom Elements) for building encapsulated, reusable interactive components without a framework.

**Custom Element lifecycle** — The sequence of methods (`constructor`, `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`) the browser calls automatically on a Web Component.

**Progressive enhancement** — Building a component so its underlying markup works without JS, with JS adding enhanced behavior on top rather than being required for basic function.

## AI-assisted development

**AGENTS.md** — The open, cross-tool convention for a single-source-of-truth AI rules file, read natively by Cursor, Copilot, Claude Code, and many other tools.

**`.cursor/rules/*.mdc`** — Cursor's rule file format; supports `globs`-based auto-attach (a rule only loads when editing matching files).

**`CLAUDE.md`** — Claude Code's native rules file, read automatically at repo root; supports `@file` imports.

**Custom slash command** — A Markdown file at `.claude/commands/<name>.md` invokable as `/<name>` in Claude Code.

**Figma MCP server** — Figma's remote MCP (Model Context Protocol) server, giving MCP-aware AI tools structured design data (components, variables, layout) instead of just a screenshot.

**Figma Dev Mode** — A mode in the Figma app exposing an inspector panel (exact spacing, tokens, exportable code) for anyone reading a design, human or (via MCP) AI tool.

**Code Connect** — A Figma feature linking design components to their real code counterparts, so tooling can detect an existing implementation instead of generating a duplicate.

## Theme Store & publishing

**Theme Check** — Shopify's official linter for Liquid/theme code, configured via `.theme-check.yml`.

**Lighthouse** — Google's page-quality auditing tool; Theme Store requires Performance ≥ 60 and Accessibility ≥ 90.

**`.shopifyignore`** — Excludes files from Shopify CLI push/pull/package operations, distinct from `.gitignore`.

**Semantic versioning (`X.Y.Z`)** — The major/minor/patch versioning scheme required for theme updates. See [After Approval](/publishing/after-approval/).

**Metaobject / metafield** — Shopify's custom-data structures; Theme Store themes may only reference standard (non-custom, non-app-owned) metaobject definitions in settings.

**App block** — A block type an app can inject into a section that accepts `@app` targeting — required in main product/featured product sections for Theme Store review.

## Build tooling (optional/alternative)

**Vite** — A frontend build tool/dev server; used with `vite-plugin-shopify` (or similar) by teams using the [Tailwind/Alpine build setup](/tooling-config/tailwind-and-alpine-build-setup/).

**Tailwind CSS** — A utility-first CSS framework; an alternative to this handbook's default native-CSS approach.

**Alpine.js** — A small, framework-like reactive JS library used inline in markup; an alternative to this handbook's default Web Component approach.

## Further Reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
