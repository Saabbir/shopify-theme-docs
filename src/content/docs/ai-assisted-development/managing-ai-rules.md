---
title: 8b. Managing & Amending AI Rules
description: The guideline for changing AGENTS.md over time — section order, format, sourcing, and how to test a change actually works.
---

`AGENTS.md` (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) isn't a file you write once. It changes as the codebase, the platform, and the team's conventions evolve. This page is the guideline for amending it properly — so a change is effective (it actually steers the AI tool) and safe (it doesn't silently break the generation pipeline or contradict something else in the file).

## The governing principle: this file is load-bearing

Every rule in `AGENTS.md` shapes what an AI tool writes into this codebase. A vague or wrong rule doesn't just fail to help — it actively steers generated code in the wrong direction, confidently. Treat every amendment with the same care as a change to the codebase's actual conventions, because that's exactly what it is.

## Section order: what comes first, and why

`AGENTS.md`'s current section order is deliberate, not arbitrary — read it top to bottom once to understand why, before adding a new section anywhere else:

1. **Project overview** — first, because everything after it assumes this context.
2. **Source of truth & certainty requirements** — second, deliberately near the top, because it governs *how* every rule after it should be applied (don't guess, cite official sources, plan before acting). A rule about sourcing and certainty that came after the specific technical rules would be too late — by the time a reader/tool reaches it, they've already applied the specific rules without that governing discipline in mind.
3. **Commands** — third, practical and reference-like, low-risk to skim past if already known.
4. **Hard constraints** — the non-negotiable, project-wide rules (no framework, no Sass, etc.).
5. **Domain-specific conventions** (Liquid & schema, CSS & JavaScript) — scoped rules, tagged so they only load where relevant (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) on scope tags).
6. **Process sections** (Figma-to-code workflow) — how to execute a specific recurring task.
7. **Before finishing any task** / **When uncertain** — last, because these are the final checks applied *after* everything else has been read and acted on.

**The rule for new sections: governing/meta rules (things that change how other rules get applied) go near the top; specific/domain rules go in the middle; process checklists go near the bottom.** If you're not sure where a new section belongs, ask: "does this change how a reader should interpret everything else, or is it a specific rule/process of its own?" The former goes high, the latter goes where its domain's other rules already live.

## Format requirements — non-negotiable, or generation breaks

- **Plain Markdown, `##` headings for each section.** The generation script (`scripts/generate-ai-rules.mjs`) splits the file on `##` headings — a section without one won't be recognized as a distinct, scopeable unit.
- **A `<!-- scope: core|liquid|css-js -->` comment immediately before each `##` heading**, on its own line. This determines which generated file(s) the section routes into — see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) for the full mechanism. A section with no scope marker defaults to `core` (always-loaded) — usually not what you want for something narrowly scoped, so add the marker deliberately rather than relying on the default.
- **No literal `*/` sequence inside any comment**, including inside a code fence's language hint or a glob pattern written in prose. This isn't a Markdown rule — it's specifically because the file is also read as source by tooling that can misinterpret it; when in doubt, describe a glob in words ("loads on `.liquid` files") rather than literal glob syntax inside a comment block.
- **Specific, checkable rules, not vague ones** — see the comparison table in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#what-good-rules-actually-look-like). A rule that doesn't change what gets generated isn't earning its place in the file.

## The amendment workflow, step by step

1. **Decide the section and scope.** Is this a governing rule (near the top, `core` scope), a domain-specific rule (Liquid/CSS-JS section, matching scope), or a new process (its own section, usually `core`)?
2. **Ground the rule in an official source.** Before writing the rule, confirm the underlying claim against `shopify.dev`, `help.shopify.com`, or Shopify's own repos — never write a rule based on a third-party blog, a forum answer, or "this is probably how it works." See the "Source of truth & certainty requirements" section in `AGENTS.md` itself — the same standard applies to writing the rules as to following them.
3. **Write the rule as specific and checkable**, following the existing style: a plain statement, a code comparison (✅/❌) if it clarifies the rule, a link to the relevant handbook page for full detail.
4. **Regenerate:** `node scripts/generate-ai-rules.mjs`.
5. **Test it against real generation** (see below) — don't assume a rule works just because it reads clearly to a human.
6. **Commit `AGENTS.md` and the regenerated files together**, in the same commit, with a PR description noting *which rule changed and why* — not just "updated AI rules."

## Testing whether an amendment actually works

A rule that reads correctly to a human isn't necessarily one that changes model behavior. Before considering an amendment done:

1. Ask your AI tool to do something the *old* rule (or the absence of any rule) would have gotten wrong.
2. Check whether the new rule actually changes the output in the intended direction.
3. If it doesn't, the rule likely needs to be more specific or more prominently placed (see the section-order guidance above) — not simply longer.

This is the same test described in [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/#testing-whether-your-rules-are-actually-working), applied specifically to a new or changed rule rather than the file as a whole.

## Keeping a record of why a rule exists

`AGENTS.md` itself should stay focused on the rules, not a history of every change — but the reasoning behind a non-obvious rule is worth preserving somewhere a future developer can find it:

- A one-line justification inline, when the reason isn't obvious from the rule itself (the existing file does this already — e.g. "never `{% include %}` (deprecated)" states the *why* briefly, in the rule itself).
- The PR description, for anything with more context than fits in one line — this is retrievable via `git log`/`git blame` on `AGENTS.md` later, which is exactly why step 6 above asks for a specific, non-generic PR description.

## What NOT to do when amending

| ❌ Don't | Why |
|---|---|
| Add a rule based on something you read in a blog post or forum answer without confirming it against `shopify.dev`/`help.shopify.com` | Violates the sourcing requirement this whole file is built on — see "Source of truth & certainty requirements" |
| Add a vague rule ("write good code," "be performant") | Doesn't change model output — see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)'s vague-vs-specific comparison |
| Skip the scope marker, letting a narrow rule default to `core` | Bloats every generated file with something only relevant to one file type |
| Edit a generated file (`.cursor/rules/*.mdc`, `.cursorrules`, `copilot-instructions.md`) directly instead of `AGENTS.md` | Gets silently overwritten the next time someone runs the generator |
| Commit an `AGENTS.md` change without regenerating and committing the derived files in the same commit | Leaves Cursor/Copilot users on stale rules while Claude Code (which imports `AGENTS.md` directly) already sees the update |

## Best practices

- Treat the "Source of truth & certainty requirements" section as the standard you hold *yourself* to while amending this file, not just a rule for the AI tool to follow.
- Test every amendment against real generated output before considering it done — a rule that reads well isn't necessarily a rule that works.
- Write a specific PR description for every `AGENTS.md` change — "updated AI rules" tells a future developer nothing about what changed or why.

## Common mistakes

- **Writing a rule from memory or a third-party source** without confirming it against official Shopify documentation first.
- **Adding a section without a scope marker**, defaulting it to `core` and bloating every generated file unnecessarily.
- **Assuming a clearly-written rule works** without testing it against an actual generation task.
- **Treating this file as append-only** — a section belongs where the section-order guidance above places it, not wherever is convenient to paste it.

## Quick Reference

- Section order: governing/meta rules first (Source of truth & certainty), then commands, then hard constraints, then domain-specific conventions, then process, then final checks last.
- Format: `##` headings, a `<!-- scope: ... -->` marker before each, specific and checkable rules, no literal `*/` inside comments.
- Workflow: ground in an official source → write specifically → regenerate → test against real output → commit `AGENTS.md` + generated files together with a specific PR description.
- Never add a rule sourced from anything other than official Shopify documentation.

## Further Reading

- [Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/) — the base mechanism this page assumes
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) — a doc-search tool that helps ground amendments in current, official sources
