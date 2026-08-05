---
title: Tools Directory
description: Which tool to use for which job, a short list we picked, not a complete one.
---

This list is short on purpose. It only covers tools we actually use, or have tried ourselves, and we've organized it by the job each tool solves. It's not a full survey of everything on the market.

## Local development & preview

| Tool | Use it for |
|---|---|
| **Shopify CLI** | Local dev server (`theme dev`), linting (`theme check`), pushing/pulling, packaging |
| **Google Chrome** | Required for `theme dev`'s hot-reload (other browsers can preview, but they won't hot-reload) |
| **Shopify Theme Inspector** (Chrome extension) | Debugging Liquid render performance directly in the browser |

## AI coding assistants

| Tool | Use it for |
|---|---|
| **Claude Code** | Terminal-based AI coding, custom slash commands, `CLAUDE.md`/`AGENTS.md`-aware |
| **Cursor** | IDE-integrated AI coding, `.cursor/rules/*.mdc` scoped rule auto-attach |
| **GitHub Copilot** | Inline completions, `.github/copilot-instructions.md`-aware |

See [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) to learn how to keep all three tools in sync from one `AGENTS.md` file.

## Design-to-code

| Tool | Use it for |
|---|---|
| **Figma** | Source of truth for design (frames, components, variables) |
| **Figma Dev Mode** | Human-readable inspector: exact spacing/tokens/exportable code |
| **Figma MCP server** | Structured design data for AI tools (Cursor/Claude Code), instead of screenshot-guessing |
| **Figma Code Connect** | Linking Figma components to real code, so tooling can detect reuse instead of duplicating |

See [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) for more.

## Linting & quality

| Tool | Use it for |
|---|---|
| **Theme Check** (`shopify theme check`, and the VS Code / editor extension) | Liquid and schema checks, both on your computer and in CI |
| **`Shopify/theme-check-action`** | Running Theme Check automatically on every PR (see [CI Automation](/github-workflow/ci-automation/)) |
| **Lighthouse** (Chrome DevTools, or `lighthouse-ci`) | Performance and accessibility scores, checked against the Theme Store's required thresholds |
| **axe DevTools** (browser extension) | A deeper accessibility check than Lighthouse's automated scan |

## Version control & collaboration

| Tool | Use it for |
|---|---|
| **Git / GitHub** | Version control, pull requests, and code review (see [GitHub Workflow](/github-workflow/)) |
| **GitHub CLI (`gh`)** | Creating/reviewing PRs from the terminal |
| **Shopify's GitHub theme integration** | Keeps a Git branch and a theme in sync in both directions, for a connected development store |

## Optional build tooling (if using Tailwind/Alpine)

| Tool | Use it for |
|---|---|
| **Vite** + `vite-plugin-shopify` | Bundling a Tailwind/Alpine-based frontend into a theme's `assets/` folder |
| **Tailwind CSS** | Utility-first CSS, as an alternative to this handbook's default native CSS |
| **Alpine.js** | Lightweight reactive JS, as an alternative to this handbook's default Web Components |

This isn't the project's default setup. Before you add it to a project, read [Tailwind CSS & Alpine.js Build Setup](/tooling-config/tailwind-and-alpine-build-setup/) to see the full trade-offs first.

## Partner & submission

| Tool | Use it for |
|---|---|
| **Shopify Partner Dashboard** | Theme submissions, dev/client stores, review status |
| **Shopify Partners program** | Free account required for Theme Store submission |

## Best practices

- Pick the tool made for the job in front of you, not one tool that tries to do everything. Use `theme check` for lint issues, and use Lighthouse for performance and accessibility scores.
- Check back on this list from time to time. Tooling in this space, especially AI and MCP tools, changes fast. A tool that didn't exist at your last review might be the better choice now.

## Common mistakes

- **Using a browser other than Chrome for `theme dev`, then wondering why hot-reload doesn't work.** This is a known Chrome-only limitation, not a bug.
- **Skipping axe or manual accessibility checks just because Lighthouse passed.** Lighthouse's accessibility score is automated, so it misses things a real audit would catch (see [Accessibility](/theme-store-requirements/accessibility/)).

## Quick Reference

- Local dev: Shopify CLI + Chrome. AI: Claude Code, Cursor, or Copilot, kept in sync with AGENTS.md. Design: Figma + Dev Mode + MCP. Quality checks: Theme Check + Lighthouse + axe. Optional build tools: Vite + Tailwind + Alpine.

## Further Reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) (shopify.dev)
