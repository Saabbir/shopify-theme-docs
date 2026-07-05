---
title: Tools Directory
description: What to reach for, for which job — a curated list, not an exhaustive one.
---

This is deliberately a short, curated list — tools we actually use or have evaluated, organized by the job they solve. Not a comprehensive market survey.

## Local development & preview

| Tool | Use it for |
|---|---|
| **Shopify CLI** | Local dev server (`theme dev`), linting (`theme check`), pushing/pulling, packaging |
| **Google Chrome** | Required for `theme dev`'s hot-reload — other browsers can preview but won't hot-reload |
| **Shopify Theme Inspector** (Chrome extension) | Debugging Liquid render performance directly in the browser |

## AI coding assistants

| Tool | Use it for |
|---|---|
| **Claude Code** | Terminal-based AI coding, custom slash commands, `CLAUDE.md`/`AGENTS.md`-aware |
| **Cursor** | IDE-integrated AI coding, `.cursor/rules/*.mdc` scoped rule auto-attach |
| **GitHub Copilot** | Inline completions, `.github/copilot-instructions.md`-aware |

See [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) for how to keep all three consistent from one `AGENTS.md` source.

## Design-to-code

| Tool | Use it for |
|---|---|
| **Figma** | Source of truth for design — frames, components, variables |
| **Figma Dev Mode** | Human-readable inspector: exact spacing/tokens/exportable code |
| **Figma MCP server** | Structured design data for AI tools (Cursor/Claude Code), instead of screenshot-guessing |
| **Figma Code Connect** | Linking Figma components to real code, so tooling can detect reuse instead of duplicating |

See [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/).

## Linting & quality

| Tool | Use it for |
|---|---|
| **Theme Check** (`shopify theme check`, and the VS Code / editor extension) | Liquid/schema linting, locally and in CI |
| **`Shopify/theme-check-action`** | Running Theme Check automatically on every PR — see [CI Automation](/github-workflow/ci-automation/) |
| **Lighthouse** (Chrome DevTools, or `lighthouse-ci`) | Performance/accessibility scoring against Theme Store thresholds |
| **axe DevTools** (browser extension) | Deeper accessibility auditing beyond Lighthouse's automated checks |

## Version control & collaboration

| Tool | Use it for |
|---|---|
| **Git / GitHub** | Version control, PRs, code review — see [GitHub Workflow](/github-workflow/) |
| **GitHub CLI (`gh`)** | Creating/reviewing PRs from the terminal |
| **Shopify's GitHub theme integration** | Two-way branch↔theme sync for a connected development store |

## Optional build tooling (if using Tailwind/Alpine)

| Tool | Use it for |
|---|---|
| **Vite** + `vite-plugin-shopify` | Bundling a Tailwind/Alpine-based frontend into a theme's `assets/` folder |
| **Tailwind CSS** | Utility-first CSS, as an alternative to this handbook's default native CSS |
| **Alpine.js** | Lightweight reactive JS, as an alternative to this handbook's default Web Components |

Not this project's default — see [Tailwind CSS & Alpine.js Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) for the full trade-off discussion before adopting this on a project.

## Partner & submission

| Tool | Use it for |
|---|---|
| **Shopify Partner Dashboard** | Theme submissions, dev/client stores, review status |
| **Shopify Partners program** | Free account required for Theme Store submission |

## Best practices

- Reach for the narrowest tool that solves the actual job — e.g. `theme check` for lint issues, Lighthouse specifically for performance/accessibility scoring, rather than one tool for everything.
- Re-evaluate this list periodically — tooling in this space (especially AI/MCP tooling) moves quickly, and a tool that didn't exist at last review might now be the better default.

## Common mistakes

- **Using a non-Chrome browser for `theme dev`** and being confused when hot-reload doesn't work — it's a known Chrome-only limitation, not a bug.
- **Skipping axe/manual accessibility checks because Lighthouse passed** — Lighthouse's accessibility score is automated and doesn't catch everything a real audit would (see [Accessibility](/theme-store-requirements/accessibility/)).

## Quick Reference

- Local dev: Shopify CLI + Chrome. AI: Claude Code / Cursor / Copilot, kept in sync via AGENTS.md. Design: Figma + Dev Mode + MCP. Quality: Theme Check + Lighthouse + axe. Optional build: Vite + Tailwind + Alpine.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) — shopify.dev
