---
title: 8e. Figma MCP & Dev Mode
description: Giving Cursor and Claude Code direct, structured access to Figma — instead of a screenshot alone.
---

A screenshot tells your AI tool what a design *looks like*. It doesn't tell it what components were used, what the actual spacing/color tokens are, or which parts are meant to be reused elsewhere. Figma's **Dev Mode** and **MCP server** close that gap by giving Cursor and Claude Code structured design data directly — components, variables, layout, and (via Code Connect) links back to your real codebase.

## The two things people mean by "Figma MCP"

| Term | What it is | What it gives your AI tool |
|---|---|---|
| **Dev Mode** | A mode inside the Figma app/browser, for anyone inspecting a design (not just AI tools) | The inspector panel: exact spacing, color hex/variable names, exported CSS, component names — for a human to read, or to copy-paste into a prompt |
| **Figma MCP server** | An MCP (Model Context Protocol) server Figma runs, that Cursor/Claude Code/other MCP-aware tools connect to directly | Structured, machine-readable design context — components, variables, layout data, and generated code — pulled automatically, no copy-pasting |

Dev Mode is useful even without MCP (a designer or developer reading the inspector panel by eye). The MCP server is what makes an AI *tool* able to pull that same context automatically, without a human relaying it by hand.

## Setting up the Figma MCP server

Figma runs a **remote MCP server** at `https://mcp.figma.com/mcp` — this is the recommended setup for almost everyone, works on all Figma plans and seats, and needs no local install.

### Claude Code

The recommended path is Figma's official plugin, which bundles the MCP server connection plus Agent Skills for common Figma workflows:

```bash
claude plugin install figma@claude-plugins-official
```

### Cursor

Cursor supports the same remote server via its MCP settings. Manual setup (works for Cursor and any other MCP-capable client):

1. Open the command palette → search **MCP: Add Server**.
2. Choose **HTTP**.
3. Paste `https://mcp.figma.com/mcp` as the server URL.
4. When prompted for a server ID, enter `figma`.
5. Authenticate with your Figma account when prompted.

### What the connection gives you once it's set up

- Reading design context from a selected frame or a pasted Figma link/node — components, variables (your design tokens), layout data, even FigJam content.
- Generating code from a selected frame, informed by that structured context rather than pixel-guessing from an image.
- **Code Connect** — if your team maintains it, this links Figma components to their real code counterparts, so the AI tool can match an existing snippet/section instead of generating a new one that duplicates it.
- A `use_figma` write-to-canvas tool exists for going the other direction (code → Figma) — not typically what we need for theme development, but useful to know it exists.

## Giving it a frame: link vs. screenshot vs. selection

| Method | When to use it | What the AI tool actually sees |
|---|---|---|
| **Figma link** (`figma.com/design/...?node-id=...`) pasted in the prompt | Best default — works whether or not you're inside Figma right now | The MCP server resolves the link and pulls structured data: components, variables, layout |
| **Selected frame in Figma, then ask in Cursor/Claude Code** | You're actively in Figma and want the "current selection" | Same structured data, scoped to whatever's selected |
| **A plain screenshot, no link** | Fallback only — no Figma access, or a quick visual reference | Pixels only. No component names, no variables, no layout data — the AI tool is guessing spacing/colors from an image |

| ✅ Do | ❌ Don't |
|---|---|
| Paste the actual Figma frame link (or have the frame selected) so the MCP connection can pull structured data | Rely on a screenshot alone when Figma access is available — you're throwing away the exact tokens/components for a guess |
| Pair the Figma link/selection with a structured prompt describing merchant-editable vs. fixed content (see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/)) | Assume the MCP connection alone tells the tool what should be a setting — it gives you accurate design data, not your team's schema conventions |
| Check whether Code Connect has a match for a component before letting the tool generate a new one | Let the tool regenerate a section/snippet that already exists just because it wasn't told to check |

## Why this still isn't "hand it the link and walk away"

The MCP connection solves the *design-data-accuracy* problem — exact tokens instead of eyeballed pixels. It does not solve the *what should be merchant-editable* problem, which depends on your team's schema conventions, not the Figma file. You still need the decomposition step from [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/) — Figma MCP makes step 2 (extracting design tokens) far more accurate, but it doesn't replace step 1 (deciding what's a setting vs. what's fixed chrome).

## Best practices

- Default to a Figma link or live selection over a screenshot whenever you have Figma access — the accuracy difference is real, not marginal.
- Check for a Code Connect match before generating new code for something that might already exist as a component.
- Still write the structured prompt (settings/blocks/unusual-content behavior) — Figma MCP gives accurate design data, not your team's editorial judgment about what merchants should control.

## Common mistakes

- **Pasting a screenshot when a Figma link was available** — losing exact tokens and component identity for no reason.
- **Assuming the MCP connection alone tells the AI tool what should be a setting** — it doesn't; that's still on you, in the prompt.
- **Not maintaining Code Connect**, so the AI tool has no way to know a component already exists and regenerates near-duplicates.

## Quick Reference

- Dev Mode = human-readable design inspector. MCP server = machine-readable design data for AI tools. Related, not the same thing.
- Remote server: `https://mcp.figma.com/mcp`. Claude Code: `claude plugin install figma@claude-plugins-official`. Cursor: **MCP: Add Server** → HTTP → same URL.
- Prefer a Figma link/selection over a screenshot whenever possible.
- MCP gives accurate design data — it doesn't replace the decomposition step in the Figma-to-code workflow.

## Further Reading

- [Figma MCP server guide](https://github.com/figma/mcp-server-guide) — Figma
- [Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) — Figma Help Center
- [Claude Code and Figma: Set up the MCP server](https://help.figma.com/hc/en-us/articles/39888612464151-Claude-Code-and-Figma-Set-up-the-MCP-server) — Figma Help Center
- [Set up the remote server](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) — Figma Developer Docs
