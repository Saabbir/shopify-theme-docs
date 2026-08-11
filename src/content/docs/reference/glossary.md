---
title: Glossary
description: Every term this handbook uses, explained once, grouped by topic.
---

**TL;DR:** Every term this handbook uses, explained once, grouped by topic.

## How a Shopify theme is put together

**Skeleton Theme**: Shopify's official starter theme. It's simple and bare-bones, and it's the only Shopify-made theme you're allowed to start from for a Theme Store submission. See [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/).

**Horizon**: Shopify's newest reference theme. It shows the current way Shopify wants themes built, using nested theme blocks and `@theme`/`@app` targeting. You can't use it as a base for a Theme Store submission. It's for reference only.

**Dawn**: Shopify's previous reference theme. It uses OS 2.0 (Shopify's Online Store 2.0 theme framework), but it was built before nested blocks existed. Like Horizon, you can't use it as a submission base.

**Theme block**: A piece of content that lives in the `/blocks` folder. Merchants can add it, move it, or remove it inside a section. A section pulls it in using `@theme`/`@app` targeting. See [Theme Blocks & Nesting](/codebase-structure/theme-blocks/).

**Section**: A part of a template that merchants can configure. It has its own settings, and it can hold blocks if you want it to. See [Sections & Section Groups](/codebase-structure/sections-and-section-groups/).

**Section group**: A JSON file that defines a reusable layout of sections, like a header or footer, that many templates share.

**Snippet**: A reusable piece of Liquid code. You call it with `{% render %}` and pass it the values it needs. Unlike a section or block, it has no settings a merchant can edit.

**`@theme` / `@app` block targeting**: Schema syntax that lets a section accept any theme block (`@theme`) or app block (`@app`), instead of listing each allowed block type by name.

**Presets**: A list in a section's or block's schema that sets its default settings. These presets are what show up in the theme editor's "Add section/block" picker. If a block has no preset, it never appears in that picker.

## Liquid

**`{% render %}`**: The correct, modern way to call a snippet and pass it the values it needs. It replaces the older `{% include %}` tag.

**`{% include %}`**: An older tag that Shopify no longer recommends. Don't use it. It leaks variables from the calling code into the included file, and that causes bugs.

**LiquidDoc**: The `{%- doc -%}` comment style you use to document what a snippet expects.

**Whitespace control**: The `{%-`/`-%}` hyphen syntax. It removes the extra blank space a tag would otherwise leave in the final output.

**Global object**: A Liquid object you can use in many templates, like `product`, `collection`, `cart`, `shop`, `routes`, `settings`, `request`, and `localization`. See [Liquid Global Objects Reference](/learning-articles/liquid-global-objects/).

## CSS & JavaScript

**`{% stylesheet %}` / `{% javascript %}`**: Liquid tags that keep CSS and JS tied to the component file they're written in. Shopify removes duplicate output automatically, and the code only loads on pages where that component actually shows up.

## AI-assisted development

**AGENTS.md**: An open file format for one shared set of AI rules that every AI tool can read. Running `shopify theme init` creates it for you if you turn on AI agent support. Cursor reads it directly. Claude Code and Copilot read it through symlinked `CLAUDE.md` and `.github/copilot-instructions.md` files.

**`.cursor/rules/*.mdc`**: Cursor's own rule file format. It supports `globs`, so a rule only loads when you're editing a matching file. It's now optional and mostly legacy, since Cursor can read `AGENTS.md` directly.

**`CLAUDE.md`**: Claude Code's rules file. Claude Code reads it automatically from the root of the repo. In this project it's a symlink to `AGENTS.md`, not separate content of its own. See [Setting Up AI Rules](/getting-started/setting-up-ai-rules/).

**Custom slash command**: A Markdown file at `.claude/commands/<name>.md` that you can run as `/<name>` inside Claude Code.

**Figma MCP server**: Figma's remote MCP server. MCP stands for Model Context Protocol, a way for AI tools to talk to outside data sources. This server gives MCP-aware AI tools structured design data, like components, variables, and layout, instead of just a screenshot to guess from.

**Figma Dev Mode**: A mode in the Figma app that shows an inspector panel with exact spacing, tokens, and exportable code. It's useful for anyone reading a design, whether that's a person or an AI tool through MCP.

**Code Connect**: A Figma feature that links design components to the real code that builds them. It lets tooling detect that code already exists for a component, instead of generating a duplicate.

## Theme Store & publishing

**Theme Check**: Shopify's official tool for checking Liquid and theme code for mistakes (this kind of tool is called a linter). You configure it in `.theme-check.yml`.

**Lighthouse**: Google's tool for checking a page's quality. The Theme Store requires a Performance score of 60 or higher, and an Accessibility score of 90 or higher.

**`.shopifyignore`**: Tells the Shopify CLI which files to skip during push, pull, and package. It's separate from `.gitignore`, which is for Git.

**Semantic versioning (`X.Y.Z`)**: The version numbering pattern (major.minor.patch) that theme updates must follow. See [After Approval](/publishing/after-approval/).

**Metaobject / metafield**: Shopify's structures for storing custom data. A Theme Store theme can only reference standard metaobject definitions in its settings. It can't reference custom ones, or ones an app owns.

**App block**: A block type that an app can add into a section that accepts `@app` targeting. Theme Store review requires that your main product section and featured product section both accept app blocks.

## Further reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
