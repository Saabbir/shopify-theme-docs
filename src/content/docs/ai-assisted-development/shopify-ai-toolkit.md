---
title: "8d. Shopify's Official AI Toolkit"
description: Should we use it? Yes — step-by-step install, what it does, and how it already enforces this handbook's "no guessing" rule.
---

Shopify publishes its own official plugin for AI coding tools — the **Shopify AI Toolkit** (`github.com/Shopify/Shopify-AI-Toolkit`). It's genuinely worth installing alongside everything else in this section: it gives an AI tool direct, live access to Shopify's own documentation and a code-validation step, which is exactly the "ground claims in official sources, don't guess" discipline [AGENTS.md's "Source of truth & certainty requirements"](/ai-assisted-development/setting-up-ai-rules/) already asks for — this toolkit is how an AI tool actually *does* that, instead of just being told to.

## It's already referenced at the top of our AGENTS.md — with one caveat worth knowing

The very first line of the `AGENTS.md` that `shopify theme init` generates (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)) is:

```
🚨 MANDATORY: YOU MUST CALL "learn_shopify_api" ONCE WHEN WORKING WITH LIQUID THEMES.
```

`learn_shopify_api` is a real tool, but it doesn't come from the plugin/skills installation this page mostly covers below — it's exposed by a separate package, the **Dev MCP server** (`@shopify/dev-mcp`, installed differently — see "Installing it" below). Its job is to generate a `conversationId` that scopes an AI session to one specific Shopify API surface, and it must currently be called with one of: `polaris`, `polaris-app-home`, `polaris-admin-extensions`, `polaris-checkout-extensions`, `polaris-customer-account-extensions`, `admin`, `functions`, `hydrogen`, or `storefront-web-components`.

**Notice what's missing from that list: there's no `liquid` or `theme` option.** As of this writing, `learn_shopify_api` is scoped to app/extension development, not theme development specifically — so the mandatory line at the top of a theme's `AGENTS.md` currently doesn't have a matching API context to call it with. This looks like boilerplate the CLI includes in every `AGENTS.md` regardless of project type, not a theme-specific instruction that's fully actionable today. Don't take our word for it if this matters to your workflow — the supported API list is the kind of thing that changes; check the current tool description in whichever MCP client you're using.

The good news: for actual theme/Liquid work, the mechanism that *does* apply and *does* work is the `shopify-liquid` **skill** (via the plugin or agent-skills install, not the Dev MCP server) — see below.

## Should we use it? Yes — here's why specifically

- **It searches Shopify's real documentation before generating code**, rather than relying on the model's training data (which can be outdated or simply wrong about a specific Liquid filter, schema field, or API detail).
- **It validates generated Liquid/schema against Shopify's actual validators** before returning code — catching a broken schema or invalid Liquid before it ever reaches your editor, not after `theme check` flags it.
- **It's maintained by Shopify itself**, auto-updating as Shopify's platform evolves (plugin install only — see below) — unlike a community-written Cursor rule file, it won't silently go stale as Shopify's APIs change.

## Installing it — three official methods

Per [shopify.dev's AI Toolkit page](https://shopify.dev/docs/apps/build/ai-toolkit), there are three ways to install this, not one. Requirements: Node.js 18+, and one of Claude Code, Codex, Antigravity CLI, Cursor, Hermes (plugin only), or VS Code.

**1. The plugin (recommended) — auto-updates, bundles everything:**

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

**2. Agent skills — pick specific skills by hand, no auto-update:**

```bash
npx skills add Shopify/shopify-ai-toolkit                        # all skills
npx skills add Shopify/shopify-ai-toolkit --skill shopify-liquid # just one
```

Useful if your tool doesn't support plugins yet, or you deliberately want only `shopify-liquid` rather than the full app/extension skill set. The trade-off: skills installed this way don't auto-update — you re-run the command yourself to pull changes.

**3. The Dev MCP server — a separate package, exposes `learn_shopify_api`:**

```bash
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

This is the mechanism behind the mandatory `learn_shopify_api` line discussed above — but as covered there, its current API scope is app/extension development, not Liquid themes specifically. Installing this alone doesn't give you the `shopify-liquid` skill's search-and-validate loop; for theme work, install the plugin or the `shopify-liquid` skill (method 1 or 2).

:::caution
Command syntax for developer tools changes often. Confirm against [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) before running any of the above — this page reflects what was current as of this handbook's last update, and the toolkit's own `README.md` on GitHub has, at times, lagged behind the live docs page with older command syntax.
:::

## What's actually in it

The toolkit ships as a set of **skills** — one per Shopify API surface (browse the [full current list on GitHub](https://github.com/Shopify/Shopify-AI-Toolkit/tree/main/skills), it changes over time). The ones most relevant to theme development:

| Skill | Covers |
|---|---|
| `shopify-liquid` | Liquid templating, sections, blocks, snippets, schema — the core one for theme work |
| `shopify-dev` | General-purpose search across all of Shopify's developer docs, for anything that doesn't fit a more specific skill |
| `shopify-use-shopify-cli` | Shopify CLI usage |
| `shopify-custom-data` | Metafields and metaobjects |
| `shopify-storefront-graphql` | Storefront API (relevant if a section calls out to the Storefront API directly) |
| `shopify-hydrogen`, `shopify-admin`, `shopify-functions`, `shopify-partner`, `shopify-customer`, `shopify-payments-apps`, `shopify-polaris-*`, `shopify-pos-ui`, `shopify-app-store-review`, and others | App/extension/platform surfaces not relevant to pure theme work, but installed as part of the same toolkit if you install everything |

Each skill activates automatically when relevant to what you're asking — you don't manually pick one at runtime (though you can choose which ones get *installed* via the agent-skills method above).

## How the `shopify-liquid` skill actually works (and why it matters here)

This is the part worth understanding, not just installing. Reading the skill's actual source confirms it does **not** call `learn_shopify_api` — it runs its own bundled scripts in a mandatory **search → generate → validate** loop:

1. **Search first, every time.** Before writing any Liquid code, the skill runs `scripts/search_docs.mjs "<query>"` against Shopify's documentation — explicitly instructed not to trust its own trained knowledge.
2. **Generate**, using what the search actually returned.
3. **Validate before returning anything.** The skill runs `scripts/validate.mjs` against the generated Liquid/schema — either against files on disk (`--theme-path`) or a raw code block (`--filename`/`--filetype`/`--code`). If validation fails, it searches for the specific error, fixes it, and re-validates — up to 3 retries — before ever handing code back to you.

This is precisely the discipline [AGENTS.md's "Source of truth & certainty requirements"](/ai-assisted-development/managing-ai-rules/) asks for generally — Shopify has built it directly into their own tooling for Liquid specifically, which is one more reason to actually install and use this alongside our own rules rather than only relying on `AGENTS.md` to ask nicely for the same behavior.

## Skills, not agents or commands — what that means for us

Looking at the toolkit's actual repository structure: it contains a `skills/` folder and platform-specific plugin manifests (`.claude-plugin`, `.codex-plugin`, `.cursor-plugin`, `.hermes-plugin`). **There's no `agents/` folder and no `commands/` folder.** Shopify's toolkit is skills-only — it doesn't ship Claude Code subagents or custom slash commands, and there's nothing to additionally "set up" for skills beyond installing the toolkit: once installed, `shopify-liquid` activates automatically whenever a request looks like theme/Liquid work.

That means the three concepts map to three different things in this handbook, and it's worth being precise about which is which:

| Concept | Who provides it | Activates | Covered here |
|---|---|---|---|
| **Skills** (`shopify-liquid`, etc.) | Shopify, via the AI Toolkit | Automatically, based on what you ask | This page |
| **Custom commands** (`/figma-to-section`, `/theme-check-fix`, `/pr-prep`) | Us — Solis-specific, built on top | Manually, when you type the command | [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) |
| **Subagents** (`.claude/agents/*.md`) | Neither — not something Shopify ships; ours where it earns its keep | Automatically, or delegated/named by the main agent | [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) |

We have one Claude Code subagent so far: `theme-check-fixer`, which runs `shopify theme check`, fixes every offense per `AGENTS.md`'s conventions, and reports back — in its own isolated context window with tool access restricted to `Read`, `Edit`, and `Bash(shopify theme check:*)`. See [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) for why it exists alongside the `/theme-check-fix` command rather than replacing it, and how to write more.

## Using it alongside `AGENTS.md`'s `## Custom rules`

`AGENTS.md` itself is already mostly Shopify's content — the toolkit and the file come from the same place and reinforce each other rather than dividing up separate territory. The one part of `AGENTS.md` genuinely ours is `## Custom rules` (see [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/)):

| | `AGENTS.md` above `## Custom rules` (Shopify's) | `AGENTS.md`'s `## Custom rules` (ours) | Shopify's AI Toolkit |
|---|---|---|---|
| Covers | Generic Liquid/schema/theme reference, true of any theme | Solis-specific decisions: Skeleton Theme base, no Sass, our workflow | Live, current Shopify platform facts (exact filter/object/tag behavior right now) |
| Enforced by | Being read as static project context | Being read as static project context | An actual search-and-validate loop before code is returned |
| Kept current by | Re-scaffolding with a newer Shopify CLI | Us, per [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) | Shopify, auto-updating |

None of the three replaces another. `AGENTS.md`'s Liquid reference is thorough but static — it won't reflect a filter behavior change shipped after your last scaffold. The AI Toolkit's live search will. And nothing in Shopify's content (generated or toolkit) knows we've decided to scaffold from Skeleton Theme specifically — only `## Custom rules` states that.

## A note on telemetry

The toolkit's search and validation scripts report usage data to Shopify (`shopify.dev/mcp/usage`) by default — the search query, validation result, and some client/session identifiers. This is disclosed directly in the toolkit's own documentation. If this is a concern for a given project or client engagement, it can be disabled by setting the environment variable `OPT_OUT_INSTRUMENTATION=true`. Confirm your team's/client's data-handling policy before installing on a project where this matters.

## Best practices

- Install the AI Toolkit (plugin method) on every theme project — it's what actually makes the `shopify-liquid` skill's search-and-validate loop run for Liquid work, regardless of whether the `learn_shopify_api` line is fully applicable yet.
- Let the toolkit's search-and-validate loop actually run rather than interrupting it — the whole point is that it catches wrong Liquid before you see it, not after.
- Check `OPT_OUT_INSTRUMENTATION` against your project's/client's data-handling requirements before installing, rather than after.
- Don't take this page's install commands as permanently correct — confirm against [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) before running them, the same "verify against the live source" discipline this whole handbook asks for elsewhere.

## Common mistakes

- **Assuming `learn_shopify_api` covers Liquid/theme work today** — its documented API scope (`polaris*`, `admin`, `functions`, `hydrogen`, `storefront-web-components`) doesn't currently list `liquid` or `theme`. The `shopify-liquid` skill's own search/validate scripts are the mechanism that actually applies to theme code.
- **Installing only the Dev MCP server and assuming that's "the toolkit"** — it's one of three install methods, and by itself it doesn't give you the `shopify-liquid` skill. Install the plugin (or the skill directly) for theme work.
- **Not realizing the toolkit sends telemetry by default** — check this before installing on a client project with strict data-handling requirements.
- **Assuming the toolkit knows Solis-specific conventions** (Skeleton Theme base, our naming rules) — it only knows Shopify's platform facts; those project decisions live in `## Custom rules`.
- **Conflating skills, our custom commands, and Claude Code subagents** — they're three different mechanisms with three different owners (see the table above).

## Quick Reference

- Three install methods: plugin (recommended, auto-updates), agent skills (`npx skills add Shopify/shopify-ai-toolkit`, manual updates), Dev MCP server (`claude mcp add ...`, exposes `learn_shopify_api`). Full current commands: [shopify.dev/docs/apps/build/ai-toolkit](https://shopify.dev/docs/apps/build/ai-toolkit).
- `learn_shopify_api`'s current API scope doesn't include Liquid/themes — for theme work, the `shopify-liquid` skill's `search_docs.mjs`/`validate.mjs` loop is what actually applies.
- Shopify ships skills only — no bundled subagents or slash commands. Our `/figma-to-section` etc. are a separate, Solis-specific layer on top.
- Solis-specific conventions still live only in `## Custom rules` — the toolkit only knows Shopify's platform facts.
- Telemetry is on by default; set `OPT_OUT_INSTRUMENTATION=true` to disable.

## Further Reading

- [Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) — GitHub
- [AI Toolkit documentation](https://shopify.dev/docs/apps/build/ai-toolkit) — shopify.dev, the authoritative install instructions
- [Full skills list](https://github.com/Shopify/Shopify-AI-Toolkit/tree/main/skills) — GitHub
- [Claude Code Custom Commands](/ai-assisted-development/claude-code-custom-commands/) — our own commands layer, distinct from Shopify's skills
- [Claude Code Subagents](/ai-assisted-development/claude-code-subagents/) — our own subagents layer, and how it fits with skills and commands day to day
- [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) — the sourcing discipline this toolkit helps enforce
