---
title: Cheatsheet
description: Day-to-day commands, objects, filters, and syntax — the quick-lookup version.
---

## Shopify CLI commands

| Command | Does |
|---|---|
| `shopify theme init` | Scaffolds a new theme from Skeleton Theme |
| `shopify theme dev --store <store>.myshopify.com` | Local preview with hot reload (Chrome only) |
| `shopify theme check` | Lints Liquid/JSON against Theme Check rules |
| `shopify theme push` | Pushes local files to a theme on the store |
| `shopify theme push --unpublished` | Pushes to a new, unpublished theme |
| `shopify theme pull` | Pulls a store's theme files locally |
| `shopify theme package` | Builds a submission-ready zip, respecting `.shopifyignore` |
| `shopify theme publish` | Publishes a theme live |
| `shopify theme list` | Lists themes on the connected store |
| `shopify theme open` | Opens the theme in the browser editor |
| `shopify theme share` | Uploads and returns a preview link (unpublished theme) |

## AI rules setup

| Command | Does |
|---|---|
| `shopify theme init` (select AI agent support) | Scaffolds `AGENTS.md` + `CLAUDE.md`/`.github/copilot-instructions.md` as symlinks to it |
| `node scripts/generate-ai-rules.mjs` | Creates those same symlinks by hand, for a repo not scaffolded with AI agent support |

## Common Liquid objects (quick syntax)

```liquid
{{ product.title }}
{{ product.price | money }}
{{ product.selected_or_first_available_variant }}
{{ collection.products.size }}
{{ cart.item_count }}
{{ cart.total_price | money }}
{{ section.settings.heading }}
{{ block.settings.text }}
{{ settings.color_primary }}
{{ routes.root_url }}
{{ 'general.search.placeholder' | t }}
{{ request.locale.iso_code }}
{{ localization.country.name }}
```

Full detail: [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/).

## Common filters

| Filter | Example |
|---|---|
| `money` | `{{ product.price \| money }}` |
| `image_url` | `{{ image \| image_url: width: 800 }}` |
| `t` (translate) | `{{ 'cart.empty' \| t }}` |
| `default` | `{{ value \| default: 'fallback' }}` |
| `escape` | `{{ user_input \| escape }}` |
| `handleize` | `{{ 'My Title' \| handleize }}` → `my-title` |
| `where` | `{{ products \| where: 'available', true }}` |
| `first` / `last` | `{{ collection.products \| first }}` |

## Whitespace control

```liquid
{%- if condition -%} ... {%- endif -%}   {# strips surrounding whitespace #}
{{- value -}}                             {# strips whitespace around output #}
```

## Section/block schema skeleton

```json
{
  "name": "t:names.testimonials",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:settings.heading" }
  ],
  "blocks": [
    {
      "type": "quote",
      "name": "t:names.quote",
      "settings": [
        { "type": "richtext", "id": "quote", "label": "t:settings.quote_text" }
      ]
    }
  ],
  "presets": [
    { "name": "t:names.testimonials" }
  ]
}
```

Locale keys are flat, shared, purpose-based namespaces (`names.*`, `settings.*`, `options.*`, `categories.*`) — not nested per-section like `t:sections.testimonials.settings.heading.label`. See the [Complete Worked Example](/codebase-structure/complete-worked-example/) for the full convention.

## Theme block targeting

```json
{ "blocks": [{ "type": "@theme" }, { "type": "@app" }] }
```

## `{% stylesheet %}` / `{% javascript %}` skeleton

```liquid
{% stylesheet %}
.my-component { display: grid; gap: var(--space-md); }
{% endstylesheet %}

{% javascript %}
class MyComponent extends HTMLElement {
  connectedCallback() { /* ... */ }
}
customElements.define('my-component', MyComponent);
{% endjavascript %}
```

## LiquidDoc snippet header

```liquid
{%- doc -%}
  @param {object} product - The product to render.
  @param {boolean} [show_vendor] - Defaults to false.
{%- enddoc -%}
```

## Locale file pluralization

```json
{ "cart": { "item_count": { "one": "{{ count }} item", "other": "{{ count }} items" } } }
```

```liquid
{{ 'cart.item_count' | t: count: cart.item_count }}
```

## Git/GitHub

| Command | Does |
|---|---|
| `git checkout -b feature/section-name` | New branch, per [Branching & Commits](/github-workflow/branching-and-commits/) convention |
| `gh pr create` | Opens a PR (if using GitHub CLI) |

## Claude Code custom commands (this repo)

| Command | Runs |
|---|---|
| `/figma-to-section <link> <name>` | Full plan → build → check → fix → report loop |
| `/theme-check-fix` | Runs `theme check`, fixes every offense |
| `/pr-prep` | Checks the diff, drafts a PR description |

See [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/).

## Further Reading

- [Liquid reference](https://shopify.dev/docs/api/liquid) — shopify.dev
- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) — shopify.dev
