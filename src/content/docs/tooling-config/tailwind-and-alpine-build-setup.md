---
title: Tailwind CSS & Alpine.js Build Setup
description: An optional alternative build setup some agencies use — what it looks like, and the trade-offs against this handbook's default (native CSS/JS).
---

This handbook's default — and what every other page assumes — is native CSS and native Web Components, no build step. Some agencies instead build Shopify themes with **Tailwind CSS** (utility-first CSS) and **Alpine.js** (a small reactive JS layer), compiled through **Vite**. This page documents that setup for awareness — not as a recommendation to switch, but because it's a real, fairly common pattern worth understanding if you encounter it in a client handoff or a hire's prior experience.

:::note[This is optional and not this project's default]
Solis and the rest of this handbook use native CSS/JS with no build step. This page exists so the setup is documented if we ever inherit a theme built this way, evaluate it for a project, or a new teammate asks "why don't we just use Tailwind?"
:::

## What the setup looks like

| Piece | Role |
|---|---|
| **Vite** | Dev server + bundler, via the `vite-plugin-shopify` (or similar) plugin that teaches Vite to output into a Shopify theme's `assets/` folder correctly |
| **Tailwind CSS** | Utility classes instead of hand-written CSS — `class="flex items-center gap-4"` instead of a custom `.product-card` class |
| **Alpine.js** | Small reactive behaviors declared inline in markup (`x-data`, `x-show`, `@click`) instead of a separate JS file per component |
| **PostCSS** | Processes Tailwind's directives into final CSS during the build |

### A minimal folder layout

```
frontend/
  entrypoints/
    theme.css       ← Tailwind directives + any custom CSS
    theme.js        ← Alpine.js init + any custom JS
  vite.config.js
  tailwind.config.js
  postcss.config.js
package.json
```

The build step compiles `frontend/entrypoints/*` into the theme's `assets/` folder — Liquid templates reference the *compiled* output, not the source files directly.

### A representative snippet

```html
<!-- ✅ Tailwind + Alpine equivalent of a disclosure component -->
<div x-data="{ open: false }">
  <button @click="open = !open" :aria-expanded="open">
    {{ block.settings.heading }}
  </button>
  <div x-show="open" x-cloak class="mt-4 flex flex-col gap-2">
    {{ block.settings.content }}
  </div>
</div>
```

Compare to this handbook's default pattern — a native `<details>`/`<summary>` needs no JS at all for the same behavior, and a Web Component only when the interaction genuinely exceeds what `<details>` offers.

## Trade-offs vs. this handbook's default (native CSS/JS)

| Consideration | Native CSS/JS (this handbook's default) | Tailwind + Alpine + Vite |
|---|---|---|
| Build step | None — Shopify serves `assets/*` as-is | Required — a broken build blocks preview/deploy |
| Dependency surface | Zero runtime dependencies | Alpine.js (runtime) + a build toolchain (dev-time) |
| Onboarding | Any Shopify developer can contribute immediately | Requires familiarity with Tailwind's utility conventions and the specific Vite plugin setup |
| Markup readability | Semantic class names (`.product-card__price`) | Utility soup (`flex items-center gap-2 text-sm font-medium text-gray-600`) — faster to write, arguably harder to scan |
| RTL/logical properties | Explicit, as covered in [CSS Style Guide](/style-guides/css/) | Tailwind has logical-property utilities (`ms-4` instead of `ml-4`), but they must be used deliberately — nothing prevents reaching for the physical ones |
| Packaging for Theme Store | No extra exclusion work — there's no source tree to exclude | Requires the extra `.shopifyignore` discipline covered in [Packaging Exclusions](/tooling-config/packaging-exclusions/) |
| Theme Store submission risk | None specific to this setup | None inherent — Shopify reviews the compiled output, not your toolchain — but a broken/uncommitted build step is a self-inflicted risk this setup adds that native CSS/JS doesn't have |

## Why this handbook doesn't default to it

Not because it's wrong — several capable agencies ship production Theme Store themes this way — but because it adds a build step and a dependency surface for capability native CSS/Web Components already provide, and this handbook's other pages (accessibility, RTL, performance) are all written assuming there's no compilation step between the Liquid file and what ships. Adopting Tailwind/Alpine project-wide would mean revisiting most of the [Style Guides](/style-guides/) section, not just adding a page.

## If you do use it on a project

- Keep the entire frontend source tree (`frontend/`, `node_modules/`, config files) out of the Theme Store submission — see [Packaging Exclusions](/tooling-config/packaging-exclusions/).
- Verify the compiled output actually lands in `assets/` (via the Vite plugin's configuration) — don't assume a successful local build means the right files are in the right place for `shopify theme push`.
- Still apply this handbook's Theme Store requirements (accessibility, RTL, Lighthouse) to the compiled output — a utility-class approach doesn't exempt a component from needing a visible focus state or a logical-property equivalent.

## Best practices

- If a project already uses this setup (a client handoff, an acquired codebase), document that choice explicitly in its `README.md` rather than silently deviating from this handbook's assumed native-CSS baseline.
- Use Tailwind's logical-property utilities (`ms-*`/`me-*` over `ml-*`/`mr-*`) deliberately if adopting this setup — nothing enforces it automatically.
- Confirm the build output path before a first Theme Store submission from a project using this setup — this is the single most common integration mistake.

## Common mistakes

- **Assuming a working local dev build means submission packaging is fine** — the source tree still needs explicit exclusion, and the compiled output's destination still needs verifying.
- **Mixing this setup into an otherwise-native-CSS section "just this once"** — creates two different styling conventions in one theme, confusing for whoever maintains it next.
- **Reaching for Tailwind's physical-direction utilities out of habit** (`ml-4`) instead of the logical ones (`ms-4`), reintroducing the exact RTL problem [CSS Style Guide](/style-guides/css/) exists to prevent.

## Quick Reference

- Optional, not this project's default: Vite + Tailwind CSS + Alpine.js, compiling into `assets/`.
- Trade-off: faster utility-class authoring and a smaller custom-JS surface, against a build step, a dependency, and extra packaging discipline.
- If used: exclude the source tree via `.shopifyignore`, verify compiled output lands in `assets/`, and still meet every Theme Store requirement on the compiled result.

## Further Reading

- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) — not directly related, but see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for the design-tooling equivalent of "know the alternative even if we don't default to it"
- [Tailwind CSS documentation](https://tailwindcss.com/docs) — tailwindcss.com
- [Alpine.js documentation](https://alpinejs.dev/) — alpinejs.dev
