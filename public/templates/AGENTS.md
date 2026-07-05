# AGENTS.md — Solis

This is the **single source of truth** for every AI coding tool working in this repository — Cursor, Claude Code, GitHub Copilot, and any other [AGENTS.md](https://agents.md)-aware tool. Most current tools (Cursor, Copilot, Claude Code, and 25+ others) now read this file natively, straight from the repo root, with zero setup.

A few tool-specific files still exist alongside this one — `.cursor/rules/*.mdc` (for Cursor's per-file-type auto-attach) and `.github/copilot-instructions.md` (for Copilot's older lookup path). Both are **generated from this file** — see [`scripts/generate-ai-rules.mjs`](/templates/scripts/generate-ai-rules.mjs). Never hand-edit a generated file directly; edit this one and regenerate.

<!-- scope: core -->
## Project overview

A Shopify theme built for submission to the Shopify Theme Store. Scaffolded from Shopify's **Skeleton Theme** — not Dawn, not Horizon, since neither is Theme-Store-eligible (see the handbook's Scaffold Setup Guide). We follow **Horizon's architecture** as a conceptual reference: nested theme blocks, `@theme`/`@app` block targeting, `{% stylesheet %}`/`{% javascript %}` tags. The actual codebase starts from Skeleton Theme, not a Horizon fork.

<!-- scope: core -->
## Commands

```bash
shopify theme dev --store <dev-store>.myshopify.com   # local preview, hot reload (Chrome only)
shopify theme check                                     # lint Liquid against Theme Check rules
shopify theme push --unpublished                        # push to a new unpublished theme
shopify theme package                                    # build the submission-ready zip
node scripts/generate-ai-rules.mjs                       # regenerate .cursor/rules + copilot-instructions.md from this file
```

<!-- scope: core -->
## Hard constraints

- No UI framework (React/Vue/Svelte) renders storefront markup. Liquid is the templating layer, full stop.
- No Sass/SCSS, no pre-minified committed CSS/JS. Native CSS with custom properties only.
- Every schema string goes through `locales/*.schema.json` (`t:` prefix) — never hardcoded English.
- A section defines blocks locally OR accepts theme blocks (`@theme`) — never both.
- The main product section and featured product section must accept `@app` blocks.
- `metaobject`/`metaobject_list` settings: standard Shopify definitions only, never custom or app-owned.
- Before generating code, check whether an equivalent section/block/snippet already exists — reuse over duplication.
- If a request conflicts with a Shopify Theme Store requirement, flag the conflict instead of silently complying.
- If a request is ambiguous, ask a clarifying question rather than guessing an implementation.

<!-- scope: liquid -->
## Liquid & schema conventions

- A section either defines blocks locally in its own schema, OR accepts theme blocks via `"blocks": [{ "type": "@theme" }]` — never both.
- Every theme block needs at least one entry in `"presets"`, or it will never appear in the editor's block picker.
- Restrict a section's accepted blocks to specific types when the section has one clear purpose; use `"@theme"` only for genuinely general-purpose containers (e.g. a Group block).
- Always include `{ "type": "@app" }` alongside `{ "type": "@theme" }` in the main product section and featured product section — required for Theme Store review.
- Use `{% render %}` for snippets (they receive explicit variables); use a theme block when the content needs merchant-editable settings and reordering. Never use `{% include %}` (deprecated).
- Write a `{%- doc -%}` block on every snippet describing its parameters, in [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc) format.
- Use the `routes` object for all internal links (`{{ routes.root_url }}`), never hardcoded paths like `/` or `/products/`.
- Use `image_url` + explicit `width`/`height` + `loading="lazy"` (except above-the-fold) for every image — never a bare `<img src>`.
- Reference `metaobject`/`metaobject_list` settings only with standard Shopify definitions — never a custom or app-owned `metaobject_type`.
- `settings_data.json` defaults must reference resources that exist on every fresh store install — never a resource that only exists in the demo store.
- Full detail: [Liquid Style Guide](/style-guides/liquid/) in the handbook.

<!-- scope: css-js -->
## CSS & JavaScript conventions

- Scope CSS/JS to the component that needs it using `{% stylesheet %}` and `{% javascript %}` tags inside the section/block file — don't add everything to one global bundle.
- A setting that maps to one CSS property → expose it as a CSS custom property (`style="--gap: {{ block.settings.gap }}px"`). A setting that changes several properties together → expose it as a class (`select` setting mapping to `.variant--name`), not several separate variables.
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical ones (`margin-left`, `padding-right`) so layout works correctly in RTL languages.
- Ship JS as native ES modules, built as Web Components for anything stateful/interactive. No bundler magic at runtime — the browser resolves the module graph.
- Don't add a dependency for something under ~50 lines of vanilla JS or native CSS can do (a carousel via `scroll-snap`, a modal via `<dialog>`).
- Never introduce React/Vue/Svelte component syntax for storefront-facing markup.
- Every interactive element must be keyboard operable with a visible focus state — this is a Theme Store requirement, not optional polish.
- Full detail: [CSS Style Guide](/style-guides/css/) and [JavaScript & Web Components](/style-guides/javascript-and-web-components/) in the handbook.

<!-- scope: core -->
## Figma-to-code workflow

When given a Figma frame/screenshot and asked to build a section or block: **plan first** (decompose content vs. chrome, list settings/blocks), **then build**, **then run `shopify theme check`**, **then fix any offenses**, **then report a short summary** of what was built and any decisions made. Full process: [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/). For the repeatable version of this exact loop, use the `/figma-to-section` custom command — see [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/).

<!-- scope: core -->
## Before finishing any task

1. Run `shopify theme check` and resolve any new offenses.
2. Confirm the change doesn't regress a Theme Store requirement — accessibility and Lighthouse scores especially.
3. If the task touched a section/block schema, confirm every setting has a `label` and goes through `t:` locale keys.

<!-- scope: core -->
## When uncertain

Flag a conflict with a Theme Store requirement instead of silently working around it. Ask a clarifying question instead of guessing when a request is ambiguous — this codebase would rather wait five minutes for an answer than ship a guess that fails Theme Store review.
