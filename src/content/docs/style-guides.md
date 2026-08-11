---
title: Style Guides
description: Our rules for writing Liquid and clean code, plus when (and how) to add a third-party dependency.
---

**TL;DR:** Our rules for writing Liquid and clean code, plus when (and how) to add a third-party dependency.

The rest of this handbook explains how we build things in Shopify. It covers folders, blocks, schema (the settings a merchant can edit), and Theme Store rules. This section is different. It's a **standalone style guide** for the languages we write every day, and it doesn't belong to any one section or feature.

Read it once, start to finish, when you're new. After that, use it as a reference whenever you need it.

:::note[Looking for CSS or JavaScript?]
Both have their own dedicated sections: see [CSS](/css/) for units, cascade & specificity, custom properties, architecture & naming, `{% stylesheet %}`/`{% style %}`, modern features, and performance. See [JavaScript](/javascript/) for architecture, Web Components, the `{% javascript %}` tag, theme editor events, modern features, and performance — everything JS in one place.
:::

## What's on this page group

- [Liquid Style Guide](/style-guides/liquid/): objects, filters, whitespace control, performance, and formatting.
- [Clean Code Principles](/style-guides/clean-code-principles/): a complete worked example, showing a messy version and a clean version side by side.
- [Third-Party Libraries](/style-guides/third-party-libraries/): how to decide whether (and how) to add a dependency.

## Why a separate style guide from the architecture sections

[Codebase Structure](/codebase-structure/) tells you *where* code goes. It explains which folder to use and what a theme block is.

This section tells you something different: *how to write the code once it's there*. That covers things like indentation, naming, when to use a CSS custom property instead of a class, and when a Web Component is the right tool (and when it's too much for the job).

Both matter, but we keep them on separate pages. That way, each one is faster to look up when you actually need it.

## Best practices

- Read all style guide pages once, start to finish, when you're new to the project. Most of it becomes second nature fast, but a few things are easy to miss if you only skim, like RTL logical properties (see [CSS](/css/)).
- Treat this section as a reference you keep coming back to. In a PR (a pull request, which is a proposed code change waiting for review) comment, link to the specific rule instead of explaining it again from scratch every time it comes up.
- If a rule here seems to disagree with a rule in `AGENTS.md`, follow `AGENTS.md` for AI-generated code. That's the file the AI tool actually reads. Still flag the mismatch, though, so someone can fix whichever file is out of date.

## Common mistakes

- **Skimming this section once and never coming back to it.** Rules like logical properties and `{% stylesheet %}` scoping are easy to forget once you're under deadline pressure, so it's worth rereading them now and then.
- **Treating style guide rules as optional suggestions** instead of requirements, the same way you'd treat the architecture rules. Small inconsistencies in CSS and JS habits add up into real maintenance work over the years a theme stays in use.

## Key takeaways
- [Liquid Style Guide](/style-guides/liquid/) · [Clean Code Principles](/style-guides/clean-code-principles/) · [Third-Party Libraries](/style-guides/third-party-libraries/)
- For CSS specifically: see [CSS](/css/). For JavaScript specifically: see [JavaScript](/javascript/).
- This section covers *how* to write code. [Codebase Structure](/codebase-structure/) covers *where* it goes.

## Further reading

- [CSS](/css/), the dedicated section for everything CSS-related
- [JavaScript](/javascript/), the dedicated section for everything JS-related
- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
