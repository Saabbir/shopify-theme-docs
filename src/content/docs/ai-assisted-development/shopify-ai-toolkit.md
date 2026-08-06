---
title: "Shopify's Official AI Toolkit"
description: Should we use it? Yes. Here's a step-by-step install, what it does, and how it backs up this handbook's "no guessing" rule.
---

**TL;DR:** Should we use it? Yes. Here's a step-by-step install, what it does, and how it backs up this handbook's "no guessing" rule.

Shopify publishes its own official plugin for AI coding tools, called the **Shopify AI Toolkit** (`github.com/Shopify/Shopify-AI-Toolkit`). It's genuinely worth installing alongside everything else in this section. It gives an AI tool direct, live access to Shopify's own documentation, plus a way to check its own code. That's exactly the "base claims on official sources, don't guess" rule that [AGENTS.md's "Source of truth & certainty requirements"](/getting-started/setting-up-ai-rules/) already asks for. This toolkit is how an AI tool actually *does* that, instead of just being told to.

## It's already referenced at the top of our AGENTS.md — with one thing worth knowing

The very first line of the `AGENTS.md` file that `shopify theme init` generates (see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/)) is:

```
🚨 MANDATORY: YOU MUST CALL "learn_shopify_api" ONCE WHEN WORKING WITH LIQUID THEMES.
```

`learn_shopify_api` is a real tool, but it doesn't come from the plugin or skills install this page mostly covers below. It's provided by a separate package called the **Dev MCP server** (`@shopify/dev-mcp`), which you install differently (see "Installing it" below). Its job is to generate a `conversationId`, a kind of ID that scopes an AI session to one specific Shopify API area. Right now it has to be called with one of: `polaris`, `polaris-app-home`, `polaris-admin-extensions`, `polaris-checkout-extensions`, `polaris-customer-account-extensions`, `admin`, `functions`, `hydrogen`, or `storefront-web-components`.

**Notice what's missing from that list: there's no `liquid` or `theme` option.** As of this writing, `learn_shopify_api` covers app and extension development, not theme development specifically. So the mandatory line at the top of a theme's `AGENTS.md` currently doesn't have a matching API area to call it with. This looks like boilerplate the CLI includes in every `AGENTS.md`, no matter the project type, rather than a theme-specific instruction that fully works today. Don't just take our word for it if this matters to your workflow. The supported API list is the kind of thing that changes, so check the current tool description in whichever MCP client you're using.

The good news: for actual theme and Liquid work, there's a mechanism that *does* apply and *does* work. It's the `shopify-liquid` **skill** (through the plugin or agent-skills install, not the Dev MCP server). More on that below.

## Should we use it? Yes — here's why specifically

- **It searches Shopify's real documentation before generating code**, instead of relying only on the model's training data, which can be outdated or simply wrong about a specific Liquid filter, schema field, or API detail.
- **It checks generated Liquid and schema against Shopify's actual validators** before returning code. This catches a broken schema or invalid Liquid before it ever reaches your editor, not after `theme check` flags it.
- **It's maintained by Shopify itself**, and updates itself as Shopify's platform changes (plugin install only, see below). Unlike a community-written Cursor rule file, it won't quietly go stale as Shopify's APIs change.

## Installing it — three official methods

Per [shopify.dev's AI Toolkit page](https://shopify.dev/docs/apps/build/ai-toolkit), there are three ways to install this, not one. You'll need Node.js 18 or newer, and one of Claude Code, Codex, Antigravity CLI, Cursor, Hermes (plugin only), or VS Code.

**1. The plugin (recommended): updates itself, bundles everything**

```bash
# Claude Code
claude plugin install shopify-ai-toolkit@claude-plugins-official

# Codex
codex plugin add shopify@openai-curated

# Cursor (in Cursor Chat)
/add-plugin shopify

# Antigravity CLI
agy plugin install https://github.com/Shopify/shopify-ai-toolkit

# VS Code — enable the "Agent plugins" preview setting first, then:
# Command Palette → "Chat: Install Plugin From Source" → paste the repo URL
```

**2. Agent skills: pick specific skills by hand, no auto-update**

```bash
npx skills add Shopify/shopify-ai-toolkit                        # all skills
npx skills add Shopify/shopify-ai-toolkit --skill shopify-liquid # just one
```

This method is useful if your tool doesn't support plugins yet, or if you specifically want only `shopify-liquid` instead of the full app and extension skill set. The trade-off: skills installed this way don't update themselves. You have to re-run the command yourself to pull in changes.

**3. The Dev MCP server: a separate package, provides `learn_shopify_api`**

```bash
claude mcp add --scope project --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

`--scope project` writes this to a committed `.mcp.json` at the repo root instead of registering it only for you. Since it's project-scoped this way, a teammate who clones the repo gets the same server automatically (Claude Code still prompts them to approve it once, the standard first-use check for any project-scoped server). This is the same file used for the project-level Figma MCP setup in [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/) — [download the combined template](/templates/mcp.json) instead of running the command by hand if you want both servers at once.

This is the mechanism behind the mandatory `learn_shopify_api` line discussed above. But as covered there, it currently covers app and extension development, not Liquid themes specifically. Installing this alone doesn't give you the `shopify-liquid` skill's search-and-check process. For theme work, install the plugin or the `shopify-liquid` skill (method 1 or 2) — and note that the plugin/skill install is still a per-person step today, since it bundles Agent Skills rather than just an MCP server, and isn't something a committed `.mcp.json` can register on someone else's behalf.

:::caution
Command syntax for developer tools changes often. Confirm against [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) before running any of the commands above. This page reflects what was current as of this handbook's last update, and the toolkit's own `README.md` on GitHub has, at times, lagged behind the live docs page with older command syntax.
:::

## What's actually in it

The toolkit ships as a set of **skills**, one per Shopify API area. Browse the [full current list on GitHub](https://github.com/Shopify/Shopify-AI-Toolkit/tree/main/skills), since it changes over time. Here are the ones most relevant to theme development:

| Skill | Covers |
|---|---|
| `shopify-liquid` | Liquid templating, sections, blocks, snippets, schema. The core one for theme work. |
| `shopify-dev` | General-purpose search across all of Shopify's developer docs, for anything that doesn't fit a more specific skill |
| `shopify-use-shopify-cli` | Shopify CLI usage |
| `shopify-custom-data` | Metafields and metaobjects |
| `shopify-storefront-graphql` | Storefront API (relevant if a section calls the Storefront API directly) |
| `shopify-hydrogen`, `shopify-admin`, `shopify-functions`, `shopify-partner`, `shopify-customer`, `shopify-payments-apps`, `shopify-polaris-*`, `shopify-pos-ui`, `shopify-app-store-review`, and others | App, extension, and platform areas not relevant to pure theme work, but installed as part of the same toolkit if you install everything |

Each skill turns on automatically when it's relevant to what you're asking. You don't pick one manually while working, though you can choose which ones get *installed* through the agent-skills method above.

## How the `shopify-liquid` skill actually works (and why it matters here)

This is the part worth understanding, not just installing. Reading the skill's actual source code shows it does **not** call `learn_shopify_api`. Instead, it runs its own bundled scripts in a mandatory **search, generate, validate** loop:

1. **Search first, every time.** Before writing any Liquid code, the skill runs `scripts/search_docs.mjs "<query>"` against Shopify's documentation. It's explicitly told not to trust what it already "knows."
2. **Generate**, using what the search actually returned.
3. **Validate before returning anything.** The skill runs `scripts/validate.mjs` against the generated Liquid or schema, either against files on disk (`--theme-path`) or a raw code block (`--filename`, `--filetype`, `--code`). If validation fails, it searches for the specific error, fixes it, and validates again, up to 3 tries, before ever handing code back to you.

This is exactly the discipline [AGENTS.md's "Source of truth & certainty requirements"](/ai-assisted-development/managing-ai-rules/) asks for in general. Shopify has built it directly into their own tooling for Liquid specifically, which is one more reason to actually install and use this alongside our own rules, rather than relying only on `AGENTS.md` asking nicely for the same behavior.

## Skills, not agents or commands — what that means for us

Looking at the toolkit's actual repository structure, it contains a `skills/` folder and platform-specific plugin manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`, `.hermes-plugin`). **There's no `agents/` folder and no `commands/` folder.** Shopify's toolkit is skills-only. It doesn't ship Claude Code subagents (separate, focused AI helpers) or custom slash commands, and there's nothing extra to set up for skills beyond installing the toolkit. Once it's installed, `shopify-liquid` turns on automatically whenever a request looks like theme or Liquid work.

That means the three ideas below map to three different things in this handbook, and it's worth being precise about which is which.

| Idea | Who provides it | Turns on | Covered here |
|---|---|---|---|
| **Skills** (`shopify-liquid`, etc.) | Shopify, through the AI Toolkit | Automatically, based on what you ask | This page |
| **Custom commands** (`/figma-to-liquid`, `/theme-check-fix`, `/pr-prep`) | Us, Solis-specific, built on top | Manually, when you type the command | [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) |
| **Subagents** (`.claude/agents/*.md`) | Neither. Not something Shopify ships; ours, where it's genuinely useful | Automatically, or handed off and named by the main agent | [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) |

We have one Claude Code subagent so far, called `theme-check-fixer`. It runs `shopify theme check`, fixes every issue based on `AGENTS.md`'s rules, and reports back, all in its own separate conversation with tool access limited to `Read`, `Edit`, and `Bash(shopify theme check:*)`. See [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) for why it exists alongside the `/theme-check-fix` command instead of replacing it, and how to write more subagents of your own.

## Using it alongside `AGENTS.md`'s `## Custom rules`

`AGENTS.md` itself is already mostly Shopify's content. The toolkit and the file come from the same place and reinforce each other, rather than covering separate ground. The one part of `AGENTS.md` that's genuinely ours is `## Custom rules` (see [Setting Up AI Rules](/getting-started/setting-up-ai-rules/)).

| | `AGENTS.md` above `## Custom rules` (Shopify's) | `AGENTS.md`'s `## Custom rules` (ours) | Shopify's AI Toolkit |
|---|---|---|---|
| Covers | Generic Liquid, schema, and theme reference, true of any theme | Solis-specific decisions: Skeleton Theme base, no Sass, our workflow | Live, current Shopify platform facts (exact filter, object, and tag behavior right now) |
| Kept correct by | Being read as static project context | Being read as static project context | An actual search-and-validate loop before code is returned |
| Kept current by | Re-scaffolding with a newer Shopify CLI | Us, per [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) | Shopify, automatically |

None of the three replaces another. `AGENTS.md`'s Liquid reference is thorough but static. It won't reflect a filter behavior change shipped after your last scaffold. The AI Toolkit's live search will. And nothing in Shopify's content (generated or toolkit) knows we've decided to scaffold from Skeleton Theme specifically. Only `## Custom rules` states that.

## A note on telemetry

The toolkit's search and validation scripts send usage data to Shopify (`shopify.dev/mcp/usage`) by default. This includes the search query, the validation result, and some client or session identifiers. This is disclosed directly in the toolkit's own documentation. If this matters for a given project or client engagement, you can turn it off by setting the environment variable `OPT_OUT_INSTRUMENTATION=true`. Check your team's or client's data-handling policy before installing on a project where this matters.

## Best practices

- Install the AI Toolkit (plugin method) on every theme project. It's what actually runs the `shopify-liquid` skill's search-and-validate loop for Liquid work, whether or not the `learn_shopify_api` line is fully applicable yet.
- Let the toolkit's search-and-validate loop actually finish rather than interrupting it. The whole point is that it catches wrong Liquid before you see it, not after.
- Check `OPT_OUT_INSTRUMENTATION` against your project's or client's data-handling requirements before installing, not after.
- Don't treat this page's install commands as permanently correct. Confirm against [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) before running them. That's the same "check against the live source" habit this whole handbook asks for elsewhere.

## Common mistakes

- **Assuming `learn_shopify_api` covers Liquid and theme work today.** Its documented API list (`polaris*`, `admin`, `functions`, `hydrogen`, `storefront-web-components`) doesn't currently include `liquid` or `theme`. The `shopify-liquid` skill's own search and validate scripts are what actually applies to theme code.
- **Installing only the Dev MCP server and assuming that's "the toolkit."** It's one of three install methods, and by itself it doesn't give you the `shopify-liquid` skill. Install the plugin (or the skill directly) for theme work.
- **Not realizing the toolkit sends telemetry by default.** Check this before installing on a client project with strict data-handling requirements.
- **Assuming the toolkit knows Solis-specific rules** (Skeleton Theme base, our naming rules). It only knows Shopify's platform facts; those project decisions live in `## Custom rules`.
- **Mixing up skills, our custom commands, and Claude Code subagents.** They're three different things with three different owners (see the table above).

## Key Takeaways
- Three install methods: plugin (recommended, updates itself, per-person), agent skills (`npx skills add Shopify/shopify-ai-toolkit`, manual updates, per-person), Dev MCP server (`claude mcp add --scope project ...`, provides `learn_shopify_api`, committable via [`.mcp.json`](/templates/mcp.json)). Full current commands: [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit).
- `learn_shopify_api`'s current API list doesn't include Liquid or themes. For theme work, the `shopify-liquid` skill's `search_docs.mjs` and `validate.mjs` loop is what actually applies.
- Shopify ships skills only, no bundled subagents or slash commands. Our `/figma-to-liquid` and similar commands are a separate, Solis-specific layer on top.
- Solis-specific rules still live only in `## Custom rules`. The toolkit only knows Shopify's platform facts.
- Telemetry is on by default; set `OPT_OUT_INSTRUMENTATION=true` to turn it off.

## Further Reading

- [Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) - GitHub
- [AI Toolkit documentation](https://shopify.dev/docs/apps/build/ai-toolkit) - shopify.dev, the authoritative install instructions
- [Full skills list](https://github.com/Shopify/Shopify-AI-Toolkit/tree/main/skills) - GitHub
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) - our own commands layer, distinct from Shopify's skills
- [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) - our own subagents layer, and how it fits with skills and commands day to day
- [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) - the sourcing discipline this toolkit helps enforce
