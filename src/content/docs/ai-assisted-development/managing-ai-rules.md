---
title: Managing & Amending AI Rules
description: How to change AGENTS.md's Custom rules section over time, including order, format, sourcing, and how to check a change actually works.
---

`AGENTS.md` (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) isn't a file you write once and forget. It changes as the codebase changes, as Shopify's platform changes, and as your team's own rules change. This page explains how to update it properly, so a change actually works (it really changes what the AI tool does) and stays safe (it doesn't contradict Shopify's own generated content or drift from what a fresh scaffold produces).

## The one boundary that matters: two authors, one file

`AGENTS.md` has two different authors, and the line between them matters more than anything else on this page.

| | Everything above `## Custom rules` | The `## Custom rules` section |
|---|---|---|
| Written by | Shopify (`shopify theme init` with AI agent support) | Us |
| Covers | General Shopify theme structure, Liquid reference, schema practices, translation standards. True of *any* Shopify theme. | Solis-specific decisions: our base theme, our constraints, our workflow |
| Do we edit it? | **No.** If it ever needs to change, get a fresh scaffold and compare. Don't hand-edit it. | **Yes. This is the only section we change.** |

Every change described on this page means a change to `## Custom rules`. If you find yourself wanting to edit something above that heading, stop. That's Shopify's content. Either accept it as-is, or check whether a newer `shopify theme init` produces something different. If it does, re-scaffold and re-apply your `## Custom rules` section, rather than hand-editing the old generated content.

## Section order within `## Custom rules`

Within our section, the order is deliberate:

1. **Source of truth & certainty requirements.** This comes first because it governs how every other rule in the section (and arguably in Shopify's content above it) gets applied: don't guess, cite official sources, plan before acting.
2. **Project overview.** Our specific scaffolding choice (Skeleton Theme, using Horizon as a reference), plus anything Shopify's general content doesn't already cover because it's specific to this project.
3. **Commands.** Practical, reference-like.
4. **Solis-specific constraints.** The concrete rules Shopify's content doesn't cover because they're our own choices, not platform facts (no Sass, no framework, RTL logical properties, Web Components by default, when to add a dependency).
5. **Process sections** (like the Figma-to-code workflow). How to carry out a specific recurring task.
6. **Before finishing any task** and **When uncertain.** These come last because they're final checks applied after everything else has already been read and used.

The rule for adding new content is simple: general or governing rules go near the top of the section, specific project rules go in the middle, and process checklists go near the bottom. It's the same shape as the section as a whole, just scoped to what's actually ours to edit.

## Format requirements

- **Plain Markdown, using `##` and `###` headings.** Match the heading level Shopify's own content uses for top-level topics (`##`), so `## Custom rules` reads as an equal section, not a nested afterthought.
- **No literal `*/` sequence inside any comment or fenced code block.** This includes inside a glob pattern (a file-matching pattern like `**/*.liquid`) written in prose. For example, write "loads on `.liquid` files" instead of the literal glob, in case this file ever ends up read as code by some tool downstream. This isn't a Markdown rule. It matters specifically if anything treats this file as source code.
- **Specific, checkable rules, not vague ones.** See the comparison table in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#what-good-rules-actually-look-like). A rule that doesn't change what gets generated isn't worth keeping in the file.
- **Don't repeat what Shopify's content already says.** Before you add a rule, check whether it's already covered above `## Custom rules`. Shopify's file already covers schema good practices, the full Liquid reference, and translation standards in detail. A duplicate rule, even worded slightly differently, risks quietly contradicting the original the next time either section gets updated.

## The update process, step by step

1. **Decide where in `## Custom rules` it belongs.** Is it a general rule, a project constraint, or a process? Follow the section order above.
2. **Check it's not already covered by Shopify's content above `## Custom rules`.** If it is, there's nothing to add. Link to the relevant handbook page instead, if the reader needs more context than Shopify's file already gives.
3. **Base the rule on an official source.** Confirm the underlying claim against `shopify.dev`, `help.shopify.com`, or Shopify's own repos. Never write a rule based on a third-party blog, a forum answer, or "this is probably how it works." This is the exact standard the "Source of truth & certainty requirements" rule sets. Hold yourself to it while writing rules, not just while following them.
4. **Write the rule so it's specific and checkable**, matching the style already used in `## Custom rules`: a plain statement, a code comparison (✅/❌) if it helps clarify the rule, and a link to the relevant handbook page for more detail.
5. **Test it against real generated output** (see below).
6. **Commit `AGENTS.md`.** There's nothing else to regenerate or commit alongside it. `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks (files that just point to another file). They reflect the change automatically. Git tracks the symlink itself, which never changes, separately from what it points to.
7. **Write a specific PR description.** Note *which rule changed and why*, not just "updated AI rules."

## Testing whether a change actually works

A rule that reads correctly to a human isn't necessarily one that changes what the model does. Before you consider a change finished, do this:

1. Ask your AI tool to do something the *old* rule (or the lack of any rule) would have gotten wrong.
2. Check whether the new rule actually changes the output the way you intended.
3. If it doesn't, the rule probably needs to be more specific or placed more prominently in `## Custom rules`, not just longer.

This is the same test described in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#testing-whether-your-rules-are-actually-working), applied to one new or changed rule instead of the whole section.

## Keeping a record of why a rule exists

`## Custom rules` should stay focused on the rules themselves, not a history of every change. But the reasoning behind a rule that isn't obvious is worth writing down somewhere a future developer can find it.

- A one-line explanation inline, when the reason isn't obvious from the rule itself. The section already does this, for example noting *why* we picked Skeleton Theme rather than Horizon or Dawn.
- The PR description, for anything that needs more context than fits in one line. You can find it later with `git log` or `git blame` on `AGENTS.md`, which is exactly why step 7 above asks for a specific, non-generic PR description.

## What NOT to do when making changes

| ❌ Don't | Why |
|---|---|
| Edit anything above `## Custom rules` | That's Shopify's generated content, not ours. It isn't specific to this project, and hand-editing it means drifting from what a fresh `shopify theme init` produces. |
| Add a rule based on something you read in a blog post or forum answer without confirming it against `shopify.dev` or `help.shopify.com` | Breaks the sourcing rule this file is built on |
| Repeat a rule Shopify's content already states | Risks a future contradiction if either section is updated separately |
| Add a vague rule ("write good code," "be performant") | Doesn't change what the model produces. See [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)'s vague-versus-specific comparison. |
| Look for a build or regeneration step | There isn't one. `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks, always up to date. |

## Best practices

- Treat the line at `## Custom rules` as absolute. It's what keeps this file comparable against future Shopify scaffolds.
- Hold yourself to the "Source of truth & certainty requirements" rule while *writing* rules, not just while following them.
- Test every change against real generated output before calling it done.
- Write a specific PR description for every `AGENTS.md` change.

## Common mistakes

- **Editing Shopify's generated content directly** because it was convenient, instead of keeping changes inside `## Custom rules`.
- **Writing a rule from memory or a third-party source** without confirming it against official Shopify documentation first.
- **Repeating content Shopify's file already covers** instead of checking first and linking out if more context is needed.
- **Assuming a clearly-written rule works** without testing it against an actual generation task.

## Quick Reference

- Two authors, one file: Shopify owns everything above `## Custom rules`; we own that section and nothing else.
- Section order within `## Custom rules`: general or governing rules first, then project constraints, then process, then final checks last.
- Format: `##` and `###` headings, specific and checkable rules, no repeating what Shopify's content already says.
- Process: check it's not already covered, base it on an official source, write it specifically, test against real output, commit `AGENTS.md` (nothing to regenerate), write a specific PR description.

## Further Reading

- [Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) - the base mechanism this page assumes
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) - a doc-search tool that helps you base changes on current, official sources
