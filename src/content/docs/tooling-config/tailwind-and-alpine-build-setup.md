---
title: Tailwind CSS & Alpine.js Build Setup
description: An optional alternative build setup some agencies use, what it looks like, and the trade-offs against this handbook's default (native CSS/JS).
---

**TL;DR:** An optional alternative build setup some agencies use, what it looks like, and the trade-offs against this handbook's default (native CSS/JS).

This handbook's default, and what every other page in it assumes, is native CSS and native Web Components, with no build step. Some agencies instead build Shopify themes with **Tailwind CSS** (a CSS approach built around small utility classes like `flex` or `gap-4`, instead of custom class names) and **Alpine.js** (a small, reactive JavaScript layer for adding interactivity), compiled through **Vite**.

This page documents that setup so you know about it. It's not a recommendation to switch, but it's a real, fairly common pattern, worth understanding in case you run into it during a client handoff, or hear about it from a new hire's past experience.

:::note[This is optional and not this project's default]
Solis and the rest of this handbook use native CSS/JS with no build step. This page exists so the setup is documented, in case we ever inherit a theme built this way, need to evaluate it for a project, or a new teammate asks "why don't we just use Tailwind?"
:::

## What the setup looks like

| Piece | Role |
|---|---|
| **Vite** | Dev server and bundler, via the `vite-plugin-shopify` (or similar) plugin that teaches Vite to output into a Shopify theme's `assets/` folder correctly |
| **Tailwind CSS** | Utility classes instead of hand-written CSS. For example, `class="flex items-center gap-4"` instead of a custom `.product-card` class |
| **Alpine.js** | Small reactive behaviors declared directly in markup (`x-data`, `x-show`, `@click`) instead of a separate JS file per component |
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

The build step compiles `frontend/entrypoints/*` into the theme's `assets/` folder. Your Liquid templates reference the *compiled* output, not the source files directly.

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

Compare that to this handbook's default pattern. A native `<details>`/`<summary>` element needs no JavaScript at all for the same behavior. You'd only reach for a Web Component when the interaction genuinely needs more than `<details>` can offer.

## Trade-offs vs. this handbook's default (native CSS/JS)

| Consideration | Native CSS/JS (this handbook's default) | Tailwind + Alpine + Vite |
|---|---|---|
| Build step | None. Shopify serves `assets/*` as-is | Required. A broken build blocks preview/deploy |
| Dependency surface | Zero runtime dependencies | Alpine.js plus a build toolchain |
| Onboarding | Any Shopify developer can contribute immediately | Requires familiarity with Tailwind's utility conventions and the specific Vite plugin setup |
| Markup readability | Semantic class names (`.product-card__price`) | Utility classes stacked together (`flex items-center gap-2 text-sm font-medium text-gray-600`), faster to write but arguably harder to scan |
| RTL/logical properties | Explicit, as covered in [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/) | Tailwind has logical-property utilities (`ms-4` instead of `ml-4`), but they must be used deliberately, since nothing prevents reaching for the physical ones by mistake |
| Packaging for Theme Store | No extra exclusion work, since there's no source tree to exclude | Requires the extra `.shopifyignore` discipline covered in [Packaging Exclusions](/tooling-config/packaging-exclusions/) |
| Theme Store submission risk | None specific to this setup | Nothing inherent, since Shopify reviews the compiled output, not your toolchain, but a broken or uncommitted build step is a self-inflicted risk this setup adds that native CSS/JS doesn't have |

## Why this handbook doesn't default to it

It's not because this setup is wrong. Several capable agencies ship production Theme Store themes this way. It's because this setup adds a build step and extra dependencies for something native CSS and Web Components already do on their own.

On top of that, this handbook's other pages (accessibility, RTL, performance) are all written assuming there's no compilation step between the Liquid file and what actually ships. Adopting Tailwind and Alpine project-wide would mean revisiting most of the [Style Guides](/style-guides/) section, not just adding one page.

## If you do use it on a project

- Keep the entire frontend source tree (`frontend/`, `node_modules/`, config files) out of the Theme Store submission. See [Packaging Exclusions](/tooling-config/packaging-exclusions/).
- Check that the compiled output actually lands in `assets/` (via the Vite plugin's configuration). Don't assume a successful local build means the right files are in the right place for `shopify theme push`.
- Still apply this handbook's Theme Store requirements (accessibility, RTL, and Lighthouse) to the compiled output. Using utility classes doesn't excuse a component from needing a visible focus state or a logical-property equivalent.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| If a project already uses this setup (a client handoff, an acquired codebase), write that choice down explicitly in its `README.md` instead of quietly drifting from this handbook's native-CSS default. | **Assuming a working local dev build means submission packaging is fine.** The source tree still needs explicit exclusion, and you still need to verify where the compiled output ends up. |
| Use Tailwind's logical-property utilities (`ms-*`/`me-*` instead of `ml-*`/`mr-*`) on purpose if you adopt this setup. Nothing forces you to use them automatically. | **Mixing this setup into an otherwise-native-CSS section "just this once."** This creates two different styling approaches in one theme, which confuses whoever maintains it next. |
| Confirm the build output path before your first Theme Store submission from a project using this setup. This is the single most common integration mistake. | **Reaching for Tailwind's physical-direction utilities out of habit** (`ml-4`) instead of the logical ones (`ms-4`). This brings back the exact RTL problem [CSS Architecture, Naming & Logical Properties](/css/css-architecture-naming-and-logical-properties/) exists to prevent. |

## Key takeaways
- Optional, not this project's default: Vite + Tailwind CSS + Alpine.js, compiling into `assets/`.
- The trade-off: faster utility-class writing and less custom JS, in exchange for a build step, a dependency, and extra packaging discipline.
- If you use it: exclude the source tree via `.shopifyignore`, check that the compiled output lands in `assets/`, and still meet every Theme Store requirement on the compiled result.

## Further reading

- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server): not directly related, but see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for the design-tooling equivalent of knowing about an alternative even when it's not our default
- [Tailwind CSS documentation](https://tailwindcss.com/docs) (tailwindcss.com)
- [Alpine.js documentation](https://alpinejs.dev/) (alpinejs.dev)
