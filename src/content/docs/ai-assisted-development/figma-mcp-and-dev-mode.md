---
title: Figma MCP & Dev Mode
description: Giving Cursor and Claude Code direct, structured access to Figma, instead of just a screenshot.
---

A screenshot tells your AI tool what a design *looks like*. But it doesn't tell the tool what components were used, what the exact spacing or color values are, or which parts are meant to be reused elsewhere.

Figma's **Dev Mode** and **MCP server** close that gap. They give Cursor and Claude Code real design data directly, including components, variables, layout, and (through Code Connect) links back to your actual code.

## The two things people mean by "Figma MCP"

| Term | What it is | What it gives your AI tool |
|---|---|---|
| **Dev Mode** | A mode inside the Figma app or browser, for anyone inspecting a design, not just AI tools | An inspector panel: exact spacing, color hex codes/variable names, exported CSS, component names. Meant for a person to read, or copy into a prompt |
| **Figma MCP server** | An MCP server (a connection that follows the Model Context Protocol, an open standard) that Figma runs, which Cursor/Claude Code/other MCP-aware tools connect to directly | Structured, machine-readable design data, including components, variables, layout, and generated code, pulled in automatically with no copy-pasting |

Dev Mode is useful even without MCP. A designer or developer can read the inspector panel with their own eyes. The MCP server is what lets an AI *tool* pull that same information on its own, without a person relaying it by hand.

## Setting up the Figma MCP server

Figma runs a **remote MCP server** at `https://mcp.figma.com/mcp`. This is the setup we recommend for almost everyone. It works on all Figma plans, and you don't need to install anything locally.

### Claude Code

The recommended path is Figma's official plugin, which bundles the MCP connection along with Agent Skills for common Figma workflows:

```bash
claude plugin install figma@claude-plugins-official
```

### Cursor

Cursor supports the same remote server through its MCP settings. To set it up by hand (this also works for Cursor and any other MCP-capable tool):

1. Open the command palette and search for **MCP: Add Server**.
2. Choose **HTTP**.
3. Paste `https://mcp.figma.com/mcp` as the server URL.
4. When asked for a server ID, enter `figma`.
5. Sign in with your Figma account when prompted.

### What the connection gives you once it's set up

- It can read design data from a selected frame or a pasted Figma link. This includes components, variables (your design tokens, meaning reusable values like colors and spacing), layout data, and even FigJam content.
- It can generate code from a selected frame, based on that real structured data instead of guessing from an image.
- **Code Connect**: if your team keeps it up to date, this links Figma components to their real code counterparts. That way, the AI tool can reuse an existing snippet or section instead of generating a new one that duplicates it.
- There's also a `use_figma` tool for going the other direction (code to Figma). We don't typically need this for theme development, but it's worth knowing it exists.

## Giving it a frame: link vs. screenshot vs. selection

| Method | When to use it | What the AI tool actually sees |
|---|---|---|
| **Figma link** (`figma.com/design/...?node-id=...`) pasted in the prompt | The best default. It works whether or not you're inside Figma right now | The MCP server reads the link and pulls real data: components, variables, layout |
| **Selected frame in Figma, then ask in Cursor/Claude Code** | You're already in Figma and want to work with the current selection | The same real data, limited to whatever's selected |
| **A plain screenshot, no link** | Fallback only, for when you have no Figma access or just want a quick visual reference | Pixels only. No component names, no variables, no layout data. The AI tool has to guess spacing and colors from an image |

| ✅ Do | ❌ Don't |
|---|---|
| Paste the actual Figma frame link (or have the frame selected) so the MCP connection can pull real data | Rely on a screenshot alone when you have Figma access. You're throwing away exact values and component identity for a guess |
| Pair the Figma link/selection with a clear prompt describing what should be merchant-editable vs. fixed content (see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/)) | Assume the MCP connection alone tells the tool what should be a setting. It gives you accurate design data, not your team's rules for what merchants can edit |
| Check whether Code Connect already has a match for a component before letting the tool generate a new one | Let the tool regenerate a section or snippet that already exists just because you didn't ask it to check |

## Why this still isn't "hand it the link and walk away"

The MCP connection solves the *accuracy* problem. You get exact values instead of eyeballed pixels. But it doesn't solve the *what should merchants be able to edit* problem, because that depends on your team's rules, not on the Figma file itself.

You still need the breakdown step from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/). Figma MCP makes step 2, pulling out design values, far more accurate. But it doesn't replace step 1, which is deciding what's a setting and what's fixed structure.

## Best practices

- Default to a Figma link or live selection over a screenshot whenever you have Figma access. The accuracy difference is real, not minor.
- Check for a Code Connect match before generating new code for something that might already exist as a component.
- Still write the structured prompt (settings, blocks, and unusual-content behavior). Figma MCP gives you accurate design data, not your team's judgment about what merchants should control.

## Common mistakes

- **Pasting a screenshot when a Figma link was available.** You lose exact values and component identity for no reason.
- **Assuming the MCP connection alone tells the AI tool what should be a setting.** It doesn't. That's still on you, in the prompt.
- **Not keeping Code Connect up to date**, so the AI tool has no way to know a component already exists, and ends up regenerating near-duplicates.

## Quick Reference

- Dev Mode = design inspector for people. MCP server = design data for AI tools. Related, but not the same thing.
- Remote server: `https://mcp.figma.com/mcp`. Claude Code: `claude plugin install figma@claude-plugins-official`. Cursor: **MCP: Add Server** → HTTP → same URL.
- Prefer a Figma link or selection over a screenshot whenever possible.
- MCP gives you accurate design data, but it doesn't replace the breakdown step in the Figma-to-code workflow.

## Further Reading

- [Figma MCP server guide](https://github.com/figma/mcp-server-guide) (Figma)
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) (Figma Help Center)
- [Claude Code and Figma: Set up the MCP server](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server) (Figma Help Center)
- [Set up the remote server](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) (Figma Developer Docs)
