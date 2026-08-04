---
title: "8a. AI Coding Concepts: Agents, MCP, Skills, Commands & Plugins"
description: A plain-language guide to the words used in this section. Read this one first if any of them are new to you.
---

The rest of this section uses words like MCP, skill, subagent, and plugin. We won't explain them again each time, so it helps to learn them here first. If you're new to AI-assisted coding (people also call this "agentic coding"), this is the right place to start. Everything else in section 8 builds on the five ideas below.

## What makes a tool "agentic" — Claude Code, Cursor, Copilot

Claude Code, Cursor, and GitHub Copilot are all **AI coding assistants**. For this handbook, what matters most is what they can do beyond simple autocomplete, which just guesses the next word or line as you type.

When you turn on "agent mode," these tools can do much more. They can read your actual files, write and edit code across your whole project, and run terminal commands like `shopify theme check`, `git`, or your tests. You give them a goal, and they carry out several steps on their own to reach it.

| Tool | Where it runs | Notes |
|---|---|---|
| **Claude Code** | Terminal | Anthropic's own agent; also works inside VS Code/JetBrains |
| **Cursor** | Desktop IDE (a VS Code fork) | Has agent mode alongside familiar IDE autocomplete |
| **GitHub Copilot** | VS Code / IDE extension | Started as pure autocomplete; agent mode was added later |

All three tools, when they're in agent mode, can read a file called `AGENTS.md` (see [8b](/ai-assisted-development/setting-up-ai-rules/)) and call MCP servers, which we'll explain next. Depending on the tool, they can also load skills, run commands, and hand work off to subagents. The rest of this page walks through each of these four things, one at a time.

## MCP — the connection that links a tool to outside data

**MCP** stands for **Model Context Protocol**. It's an open standard that lets an AI tool connect to an outside data source or service through one shared connector, instead of every tool needing its own custom connection to every service. Think of MCP like a USB port. Instead of every device needing its own special cable, they all plug into the same kind of port.

An **MCP server** offers a set of tools (and sometimes data) that any MCP-aware app, like Claude Code, Cursor, or VS Code, can connect to and use the same way.

This handbook already uses two MCP servers:

- **Figma's MCP server**: gives your AI tool structured design data, like components, variables, and layout. See [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/).
- **Shopify's Dev MCP server** (`@shopify/dev-mcp`): gives it tools like `learn_shopify_api` for app and platform context. See [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) to learn what it does and doesn't cover for theme work yet.

Think of MCP as the wiring that connects everything together. Skills, commands, and subagents, which we'll cover next, are built on top of that wiring. For example, a skill might call an MCP tool as part of its own process.

## Skills — packaged knowledge that turns on automatically

A **skill** is a set of instructions, sometimes with extra scripts or reference files attached, that an AI tool loads **automatically** when it's relevant to what you're asking. You don't type its name to call it. It just switches on by itself, in the background.

Shopify's `shopify-liquid` skill (from [the AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/)) is the example already in this handbook. It turns on whenever a request looks like theme or Liquid work (Liquid is Shopify's templating language). Once it's on, it searches Shopify's docs before it writes any code, then checks its own work before handing it back to you.

If you write your own skill, it lives at `.claude/skills/<name>/SKILL.md`. Skills can also come bundled inside an installed plugin, which we'll cover further down.

## Commands — a saved prompt you run by name

A **command** is a saved prompt, sometimes several steps long, that you run **manually** by typing `/<name>`. If you notice you keep typing the same instructions over and over, like "build this from Figma, then check it, then fix it, then summarize," that's a good sign you need a command instead.

We use a few of our own: `/figma-to-section`, `/theme-check-fix`, and `/pr-prep`. See [8g. Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) for details.

Commands live at `.claude/commands/<name>.md`. In current versions of Claude Code, commands and skills are actually built on the same underlying feature. A command is just the simpler, single-file version that you trigger by hand instead of it turning on automatically.

## Subagents — a separate worker with limited tools

A **subagent** is a specialized helper that runs in its **own separate conversation**. It has its own instructions and its own limited set of tools, instead of working inline in your main chat. Think of it like handing a task to a coworker in another room, instead of doing it all yourself at your own desk.

Claude hands work off to a subagent in two ways. It can do this automatically, when a task matches what the subagent is described to handle, or you can ask for it by name. The subagent does the work and sends back only a summary, so messy details like file contents, command output, and retries stay out of your main conversation.

We have one of our own, called `theme-check-fixer`. See [8h. Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) for how it works.

Subagents live at `.claude/agents/<name>.md`.

## Plugins — a bundle of the above, installed as one unit

A **plugin** packages some or all of the pieces above (skills, commands, subagents, and MCP connections) into one installable unit. It usually updates itself too, so you don't have to manage each piece by hand.

The [Shopify AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/) is a good example. One install command gives you its skills (`shopify-liquid` and others) and its MCP connection together, instead of you setting up each piece one at a time. Figma's official Claude Code plugin works the same way, but for design data.

We haven't packaged our own Solis-specific pieces into a plugin yet. That includes `AGENTS.md`, our commands, and `theme-check-fixer`. Right now they're loose files you download from this handbook's `/templates/` pages, and each teammate copies them into their own `.claude/` folder by hand.

That's worth fixing eventually. A plugin would let the whole team install and update everything Solis-specific with a single command. This handbook doesn't set that up yet, though.

## All five, side by side

| Mechanism | What it is | Turns on | Lives at | Example here |
|---|---|---|---|---|
| **MCP server** | A connection to an outside data source or service | Always available once connected; offers tools an agent can call | Set up per tool (`claude mcp add`, Cursor's MCP settings, etc.) | Figma MCP server, Shopify's Dev MCP server |
| **Skill** | Packaged instructions (plus optional scripts) | Automatically, when relevant | `.claude/skills/<name>/SKILL.md`, or via a plugin | `shopify-liquid` |
| **Command** | A saved prompt | Manually, by typing `/<name>` | `.claude/commands/<name>.md` | `/figma-to-section`, `/theme-check-fix` |
| **Subagent** | A separate worker with limited tools | Automatically (handed off) or by name | `.claude/agents/<name>.md` | `theme-check-fixer` |
| **Plugin** | A bundle of any/all of the above | Installed once; each piece then behaves as its own type | `claude plugin install ...` (or the tool's equivalent) | Shopify AI Toolkit, Figma's official plugin |

## Where `AGENTS.md` fits — none of the above

`AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` (see [8b](/ai-assisted-development/setting-up-ai-rules/)) aren't a skill, command, subagent, or plugin. They're **static context that's always loaded**. That means the AI reads them at the start of every session, no matter what you're doing.

Compare that to the other four things on this page. A skill only turns on when it's relevant. A command needs to be typed. A subagent gets handed a task. `AGENTS.md` is different: it's just always there in the background from the moment a session starts.

This is on purpose. Project-wide rules, like "no Sass" and "a section either defines blocks locally or uses `@theme`, never both," need to apply to *everything*. They can't wait around for a task that happens to match a skill's trigger.

## Where to go next in this section

1. [8b. Setting Up AI Rules (AGENTS.md)](/ai-assisted-development/setting-up-ai-rules/): the always-loaded project context every tool reads.
2. [8c. Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/): keeping that file correct over time.
3. [8d. Shopify's Official AI Toolkit](/ai-assisted-development/shopify-ai-toolkit/): the skill (and MCP server) that makes sure Liquid code is based on real platform facts, not guesses.
4. [8e. Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/): a real MCP connection, for design data.
5. [8f. Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/): the repeatable process built on top of it.
6. [8g. Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/): automating that process.
7. [8h. Claude Code Subagents](/ai-assisted-development/claude-code-subagents/): keeping the noisy parts of it out of your way.
8. [8i. Writing Prompts That Work](/ai-assisted-development/writing-prompts-that-work/): getting good results out of all of the above.

## Best practices

- Read this page once, all the way through, before you move on to the rest of section 8. If MCP, skill, command, subagent, or plugin is new to you, the other pages assume you already know which is which.
- When you're deciding how to automate something you keep doing, ask yourself a few questions. Does it need to apply to *everything*? Use `AGENTS.md`. Does it need to trigger *automatically* on relevant tasks? Use a skill. Do you want to trigger it *by name*? Use a command. Is it noisy, or does it need a limited set of tools? Use a subagent.
- Don't confuse "installed a plugin" with "wrote a skill." A plugin is just how you install things. The skill, command, subagent, or MCP connection inside it is what actually does the work.

## Common mistakes

- **Using "MCP," "skill," and "plugin" as if they mean the same thing.** They don't. MCP is a connection, a skill is packaged instructions, and a plugin is a bundle that can hold skills, commands, subagents, and MCP connections together.
- **Expecting a skill to need manual triggering.** That's a command's job. A skill turns on by itself.
- **Assuming a subagent is just "a slower command."** The point isn't speed. It's keeping your main conversation clean and limiting which tools the subagent can use.
- **Treating `AGENTS.md` as one of these four mechanisms.** It's static, always-loaded context. It doesn't turn on conditionally, and nothing needs to trigger it.

## Quick Reference

- **MCP server** = a connection to outside data or services. **Skill** = instructions that turn on automatically. **Command** = a saved prompt you trigger by hand. **Subagent** = a separate worker with limited tools. **Plugin** = a bundle of any or all of the above, installed as one unit.
- `AGENTS.md` is none of these. It's always-loaded, static context.
- This handbook's examples: Figma MCP server and Shopify Dev MCP server (MCP), `shopify-liquid` (skill), `/figma-to-section` and others (commands), `theme-check-fixer` (subagent), Shopify AI Toolkit and Figma's plugin (plugins).

## Further Reading

- [Claude Code overview](https://code.claude.com/docs/en/overview) (code.claude.com)
- [Model Context Protocol](https://modelcontextprotocol.io) (the open spec)
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents) (code.claude.com)
- [Plugins reference](https://code.claude.com/docs/en/plugins-reference) (code.claude.com)
