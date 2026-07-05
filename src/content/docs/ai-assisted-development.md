---
title: AI-Assisted Development
description: How we use Cursor / Claude Code, and how we go from Figma to shipped code.
---

Most of this team's day-to-day theme code is written with an AI coding assistant (Cursor, Claude Code, or GitHub Copilot) in the loop. This section covers three things: keeping every tool's rules consistent, turning a Figma design into working sections, and writing prompts that get useful output on the first try.

## What's on this page group

- [5a. Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/) — the actual rule files, ready to copy in.
- [5b. Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) — a repeatable, tool-specific process.
- [5c. Writing Prompts That Work](/ai-assisted-development/writing-prompts-that-work/) — prompt patterns that consistently produce Theme-Store-compliant code.

## Why AI-assisted development needs its own section

AI tools are genuinely useful for Shopify theme work, but they carry two specific risks worth naming directly:

1. **They default to whatever's most common in their training data**, which is often older Dawn-era patterns (`{% include %}`, inline section blocks) rather than the current architecture this handbook teaches. Left unguided, an AI tool will happily generate code that looks correct but uses patterns we don't want.
2. **They can reproduce recognizable patterns from public theme source code** — including Horizon and Dawn, which we specifically can't derive from (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/)). This is a real risk, not a theoretical one, and it's why AI output needs review with this specific concern in mind.

The three pages in this section exist to manage both risks: rules that steer the tool toward our actual conventions, and a review habit that catches it when steering isn't enough.

## Best practices

- Set up your AI tool's rule files (section 5a) before writing your first line of Solis code with it — retrofitting rules after a tool has already established bad habits in a session is much less effective than starting with them in place.
- Treat every AI suggestion as a first draft from a fast, inexperienced-with-our-conventions teammate — useful, but never merged without review.
- When an AI tool's output looks unusually close to a known reference theme's pattern, treat that as a specific, real risk to check, not paranoia.

## Common mistakes

- **Assuming rule files alone are sufficient** and skipping code review on AI-generated PRs — rules bias the tool's output, they don't guarantee compliance.
- **Not noticing when AI output defaults to Dawn-era patterns** because it "still works" — it works, but it's not the architecture we're building on, and it accumulates as inconsistency across the codebase.
- **Treating "the AI wrote it" as a reason to skip stress-testing edge cases** — AI-generated sections fail empty/long-content states just as often as human-written first drafts, arguably more often, since the AI can't see your actual merchant data.

## Quick Reference

- Every AI tool reads the same underlying rules, just in a tool-specific file format.
- AI output still gets reviewed like any other PR — see [GitHub Workflow](/github-workflow/).
- Two specific risks to actively guard against: defaulting to Dawn-era patterns, and reproducing recognizable Horizon/Dawn code.

## Further Reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) — shopify.dev
