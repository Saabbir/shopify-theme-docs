---
title: AI-Assisted Development
description: How we use Cursor and Claude Code, and how we go from Figma to shipped code.
---

Most of our theme code is written with help from an AI coding tool, like Cursor, Claude Code, or GitHub Copilot. This section shows you how to use these tools well.

We'll start with the basic words you need to know, like agent, MCP, skill, command, subagent, and plugin. Don't worry if these sound strange right now, we'll explain each one in plain English.

After that, you'll learn how to keep every tool's rules the same, and how to make sure the AI writes real Liquid code instead of guessing. Liquid is the templating language Shopify themes use to display data on a page. You'll also see how to work with Figma designs directly, turn a Figma design into working code, and automate that process so the messy parts stay out of your way. Last, you'll learn how to write prompts that get good results on the first try.

## What's on this page group

- [AI Coding Concepts (Agents, MCP, Skills, Commands, Plugins)](/ai-assisted-development/ai-coding-concepts/): the basic words used through the rest of this section. Start here if any of them are new to you.
- [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/): how to change AGENTS.md safely over time. (For the initial setup, see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) in Getting Started.)
- [Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/): Shopify's own tool that helps the AI write real, working Liquid instead of guessing.
- [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/): how to give Cursor or Claude Code real design data, not just a screenshot.
- [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/): our repeatable steps, plan, build, check, fix, report.
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/): how we turn those steps into one command, `/figma-to-liquid`.
- [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/): meet our `theme-check-fixer` helper, which handles the messy cleanup step on its own.
- [Writing Prompts That Work](/ai-assisted-development/writing-prompts-that-work/): how to ask for code in a way that gets good results.

## Why this section exists

AI tools are a big help when you build Shopify themes. But they also bring two real risks, and you should know about both before you start relying on them.

1. **They tend to copy what's most common online.** A lot of that code is old, from the Dawn era of Shopify themes (things like `{% include %}` or blocks written inline). If you don't guide the AI, it will happily write code that looks fine on the surface but uses patterns we don't want.
2. **They can copy patterns straight from public theme code**, including Horizon and Dawn. These are themes we're specifically not allowed to copy from (see [Scaffolding From Horizon](/scaffold-setup/scaffolding-from-horizon/)). This isn't some rare edge case. It's a real risk, and it's the reason we always review AI-written code with this in mind.

The pages in this section help you handle both risks. We use rule files to point the AI toward our own rules and style. This includes Shopify's own AI Toolkit, a tool that makes sure the AI's code is based on real platform docs, not guesses. Even with all that in place, we still review the code by hand, in case the rules aren't enough on their own.

## Best practices

- Set up your AI tool's rule files (see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) in Getting Started) *before* you write your first line of Solis code with it. If you add the rules after the tool has already picked up bad habits in a session, they work much less well than if you'd set them up first.
- Treat every AI suggestion like a first draft from a fast but new teammate. It's useful, but never merge it without reading it first.
- If AI-written code looks a lot like a pattern from a well-known theme, treat that as something worth checking. Don't just brush it off.

## Common mistakes

- **Thinking rule files are enough on their own**, and skipping code review on AI-written pull requests. Rules guide the AI, but they don't guarantee it followed them.
- **Not noticing when AI code falls back to old, Dawn-era patterns**, just because it still works. It runs fine, but it's not how we build things here, and it makes the codebase less consistent over time.
- **Skipping edge-case testing just because "the AI wrote it."** AI-written sections break on empty or very long content just as often as a person's first draft. Sometimes they break even more, since the AI can't see your real merchant data.

## Quick Reference

- Every AI tool reads the same rules. Each tool just gets them written in its own file format.
- AI-written code gets reviewed the same as any other pull request. See [GitHub Workflow](/github-workflow/) for details.
- Watch for two things: old Dawn-era patterns, and code copied from Horizon or Dawn.

## Further Reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture) (shopify.dev)
