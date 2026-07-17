---
title: 8c. Managing & Amending AI Rules
description: The guideline for changing AGENTS.md's Custom rules section over time — order, format, sourcing, and how to test a change actually works.
---

`AGENTS.md` (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) isn't a file you write once. It changes as the codebase, the platform, and the team's conventions evolve. This page is the guideline for amending it properly — so a change is effective (it actually steers the AI tool) and safe (it doesn't contradict Shopify's own generated content or drift from what a fresh scaffold produces).

## The governing boundary: two authors, one file

`AGENTS.md` has two distinct authors, and the boundary between them matters more than anything else on this page:

| | Everything above `## Custom rules` | The `## Custom rules` section |
|---|---|---|
| Written by | Shopify (`shopify theme init` with AI agent support) | Us |
| Covers | Generic Shopify theme architecture, Liquid reference, schema practices, translation standards — true of *any* Shopify theme | Solis-specific decisions — our base theme, our constraints, our workflow |
| Do we edit it? | **No.** Reconcile against a fresh scaffold if it ever needs to change, don't hand-edit it | **Yes — this is the only section we amend** |

Every amendment in this guideline means an amendment to `## Custom rules`. If you find yourself wanting to edit something above that heading, stop — that's Shopify's content, and the right move is either accepting it as-is or checking whether a newer `shopify theme init` produces something different (in which case, re-scaffold and re-apply your `## Custom rules` section, rather than hand-patching the old generated content).

## Section order within `## Custom rules`

Within our section, order is still deliberate:

1. **Source of truth & certainty requirements** — first, because it governs how every other rule in the section (and arguably in Shopify's content above it) gets applied: don't guess, cite official sources, plan before acting.
2. **Project overview** — our specific scaffolding choice (Skeleton Theme, Horizon as architecture reference) and anything Shopify's generic content doesn't already state because it's project-specific.
3. **Commands** — practical, reference-like.
4. **Solis-specific constraints** — the concrete rules Shopify's content doesn't cover because they're our choices, not platform facts (no Sass, no framework, RTL logical properties, Web Components default, dependency threshold).
5. **Process sections** (Figma-to-code workflow) — how to execute a specific recurring task.
6. **Before finishing any task** / **When uncertain** — last, because these are final checks applied after everything else has been read and acted on.

**The rule for new content: governing/meta rules go near the top of the section; specific project rules go in the middle; process checklists go near the bottom** — the same shape as the section as a whole, just scoped to what's actually ours to edit.

## Format requirements

- **Plain Markdown, `##`/`###` headings.** Match the heading level Shopify's own content uses for top-level topics (`##`) so `## Custom rules` reads as a peer section, not a nested afterthought.
- **No literal `*/` sequence inside any comment or fenced code block**, including inside a glob pattern written in prose (e.g. write "loads on `.liquid` files," not a literal `**/*.liquid` glob, if it's ever inside an HTML/JS comment anywhere in tooling that treats this file as source). This isn't a Markdown rule — it matters specifically if anything downstream ever parses the file as code.
- **Specific, checkable rules, not vague ones** — see the comparison table in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#what-good-rules-actually-look-like). A rule that doesn't change what gets generated isn't earning its place in the file.
- **Don't duplicate what Shopify's content already states.** Before adding a rule, check whether it's already covered above `## Custom rules` — Shopify's file already covers schema good practices, the full Liquid reference, and translation standards in detail. A duplicate rule (even if phrased slightly differently) risks becoming a subtle contradiction the next time either section is updated.

## The amendment workflow, step by step

1. **Decide where in `## Custom rules` it belongs** — governing rule, project constraint, or process, per the section order above.
2. **Check it's not already covered by Shopify's content above `## Custom rules`.** If it is, there's nothing to add — link to the relevant handbook page instead if it needs more context than Shopify's file already gives.
3. **Ground the rule in an official source.** Confirm the underlying claim against `shopify.dev`, `help.shopify.com`, or Shopify's own repos — never write a rule based on a third-party blog, a forum answer, or "this is probably how it works." This is exactly the standard the "Source of truth & certainty requirements" rule states — hold yourself to it while writing rules, not just when following them.
4. **Write the rule as specific and checkable**, matching the style already in `## Custom rules`: a plain statement, a code comparison (✅/❌) if it clarifies the rule, a link to the relevant handbook page for full detail.
5. **Test it against real generation** (see below).
6. **Commit `AGENTS.md`** — there's nothing else to regenerate or commit alongside it. `CLAUDE.md` and `.github/copilot-instructions.md` are symlinks; they reflect the change automatically, and Git tracks the symlink itself (which never changes) separately from its target.
7. **Write a specific PR description** — note *which rule changed and why*, not just "updated AI rules."

## Testing whether an amendment actually works

A rule that reads correctly to a human isn't necessarily one that changes model behavior. Before considering an amendment done:

1. Ask your AI tool to do something the *old* rule (or the absence of any rule) would have gotten wrong.
2. Check whether the new rule actually changes the output in the intended direction.
3. If it doesn't, the rule likely needs to be more specific or more prominently placed within `## Custom rules` — not simply longer.

This is the same test described in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#testing-whether-your-rules-are-actually-working), applied specifically to a new or changed rule rather than the section as a whole.

## Keeping a record of why a rule exists

`## Custom rules` should stay focused on the rules, not a history of every change — but the reasoning behind a non-obvious rule is worth preserving somewhere a future developer can find it:

- A one-line justification inline, when the reason isn't obvious from the rule itself (the existing section does this already — e.g. noting *why* Skeleton Theme rather than Horizon/Dawn).
- The PR description, for anything with more context than fits in one line — retrievable via `git log`/`git blame` on `AGENTS.md` later, which is exactly why step 7 above asks for a specific, non-generic PR description.

## What NOT to do when amending

| ❌ Don't | Why |
|---|---|
| Edit anything above `## Custom rules` | That's Shopify's generated content, not ours — it's not project-specific, and hand-editing it means drifting from what a fresh `shopify theme init` produces |
| Add a rule based on something read in a blog post or forum answer without confirming it against `shopify.dev`/`help.shopify.com` | Violates the sourcing requirement this file is built on |
| Duplicate a rule Shopify's content already states | Risks a future contradiction if either section is updated independently |
| Add a vague rule ("write good code," "be performant") | Doesn't change model output — see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)'s vague-vs-specific comparison |
| Look for a build/regeneration step | There isn't one — `CLAUDE.md`/`.github/copilot-instructions.md` are symlinks, always current |

## Best practices

- Treat the boundary at `## Custom rules` as absolute — it's what keeps this file reconcilable against future Shopify scaffolds.
- Hold yourself to the "Source of truth & certainty requirements" rule while *writing* rules, not just while following them.
- Test every amendment against real generated output before considering it done.
- Write a specific PR description for every `AGENTS.md` change.

## Common mistakes

- **Editing Shopify's generated content directly** because it was convenient, rather than confining changes to `## Custom rules`.
- **Writing a rule from memory or a third-party source** without confirming it against official Shopify documentation first.
- **Duplicating content Shopify's file already covers** instead of checking first and linking out if more context is needed.
- **Assuming a clearly-written rule works** without testing it against an actual generation task.

## Quick Reference

- Two authors, one file: Shopify owns everything above `## Custom rules`; we own that section and nothing else.
- Section order within `## Custom rules`: governing/meta rules first, then project constraints, then process, then final checks last.
- Format: `##`/`###` headings, specific and checkable rules, no duplication of what Shopify's content already states.
- Workflow: check it's not already covered → ground in an official source → write specifically → test against real output → commit `AGENTS.md` (nothing to regenerate) → specific PR description.

## Further Reading

- [Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) — the base mechanism this page assumes
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — a doc-search tool that helps ground amendments in current, official sources
