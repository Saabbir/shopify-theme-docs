# CLAUDE.md

This file gives Claude Code (and Claude in general) context before it writes any code in this repository. Keep it in sync with `.cursor/rules/` — see [Setting Up AI Rules](https://your-handbook-url/ai-assisted-development/setting-up-ai-rules/) for why we maintain both.

## What this repo is

A Shopify theme built for submission to the Shopify Theme Store. Scaffolded from Shopify's **Skeleton Theme** — not Dawn, not Horizon, since neither is Theme-Store-eligible. We follow **Horizon's architecture** (nested theme blocks, `@theme`/`@app` targeting, `{% stylesheet %}`/`{% javascript %}` tags) as our technical reference, but the actual codebase starts from Skeleton Theme.

## Commands

```bash
shopify theme dev --store <dev-store>.myshopify.com   # local preview, hot reload (Chrome only)
shopify theme check                                     # lint Liquid against Theme Check rules
shopify theme push --unpublished                        # push to a new unpublished theme
```

## Hard constraints

- No UI framework (React/Vue/Svelte) renders storefront markup. Liquid is the templating layer.
- No Sass/SCSS, no pre-minified committed CSS/JS.
- Every schema string goes through `locales/*.schema.json` (`t:` prefix) — never hardcoded English.
- A section defines blocks locally OR accepts theme blocks (`@theme`) — never both.
- The main product section and featured product section must accept `@app` blocks.
- `metaobject`/`metaobject_list` settings: standard definitions only.

## Code conventions

- File names: `kebab-case`. Schema `id`s: `snake_case`. See [Snippets & Naming Conventions](https://your-handbook-url/codebase-structure/snippets-and-naming/) for the full table.
- Snippets receive explicit variables (`{% render 'x', y: y %}`); blocks only see `block`/`section` — pick the right one, don't force data through a block that should be a snippet.
- Write a `{%- doc -%}` LiquidDoc comment on every snippet describing its parameters.
- One CSS property changing → CSS custom property. Several properties together → a CSS class via a `select` setting.
- CSS logical properties (`margin-inline-start`) over physical ones (`margin-left`), for RTL support.

## Before finishing any task

1. Run `shopify theme check` and resolve any new offenses.
2. Confirm the change doesn't regress a [Theme Store requirement](https://your-handbook-url/theme-store-requirements/) — accessibility and Lighthouse scores especially.
3. If the task touched a section/block schema, confirm every setting has a `label` and goes through `t:` locale keys.

## When uncertain

Flag a conflict with a Theme Store requirement instead of silently working around it. Ask a clarifying question instead of guessing when a request is ambiguous — this codebase would rather wait five minutes for an answer than ship a guess that fails Theme Store review.
