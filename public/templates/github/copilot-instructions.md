---
applyTo: "**/*.liquid,**/*.css,**/*.js,**/*.json"
---

# GitHub Copilot instructions for this repository

Save this file as `.github/copilot-instructions.md` in the theme repository.

- This is a Shopify theme scaffolded from **Skeleton Theme** for Theme Store submission. Never suggest Dawn- or Horizon-derived code as a starting point — both are ineligible as a submission base.
- Follow Horizon's architecture: nested theme blocks (`/blocks`), `@theme`/`@app` block targeting, `{% stylesheet %}`/`{% javascript %}` tags scoped to the component.
- Never suggest React, Vue, or Svelte syntax for storefront markup.
- Never suggest Sass/SCSS syntax or `.scss` files.
- Always suggest `{{ routes.root_url }}`-style dynamic links, never hardcoded paths.
- Always include `width`, `height`, and `loading="lazy"` on `<img>` suggestions (except when the image is clearly above the fold).
- When suggesting a section or block schema, always include a `"presets"` array and route every label string through a `t:` locale key.
- When suggesting `metaobject`/`metaobject_list` settings, use only standard Shopify metaobject definitions.

This file mirrors `.cursor/rules/` and `CLAUDE.md` in this repo — see [Setting Up AI Rules](https://your-handbook-url/ai-assisted-development/setting-up-ai-rules/) for why we keep all three in sync.
