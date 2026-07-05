---
title: "8f. Shopify's Official AI Toolkit"
description: Should we use it? Yes — step-by-step install, what it does, and how it already enforces this handbook's "no guessing" rule.
---

Shopify publishes its own official plugin for AI coding tools — the **Shopify AI Toolkit** (`github.com/Shopify/Shopify-AI-Toolkit`). It's genuinely worth installing alongside everything else in this section: it gives an AI tool direct, live access to Shopify's own documentation and a code-validation step, which is exactly the "ground claims in official sources, don't guess" discipline this handbook's [AGENTS.md](/ai-assisted-development/setting-up-ai-rules/) already requires — this toolkit is how an AI tool actually *does* that, instead of just being told to.

## Should we use it? Yes — here's why specifically

- **It searches Shopify's real documentation before generating code**, rather than relying on the model's training data (which can be outdated or simply wrong about a specific Liquid filter, schema field, or API detail).
- **It validates generated Liquid/schema against Shopify's actual validators** before returning code — catching a broken schema or invalid Liquid before it ever reaches your editor, not after `theme check` flags it.
- **It's maintained by Shopify itself**, auto-updating as Shopify's platform evolves — unlike a community-written Cursor rule file, it won't silently go stale as Shopify's APIs change.
- **It complements, rather than duplicates, this handbook's `AGENTS.md`.** `AGENTS.md` encodes *our* project's conventions (Skeleton Theme, no Sass, our naming rules). The AI Toolkit encodes *Shopify's platform facts* (what a filter actually does, what a schema field actually accepts). Use both together.

## Installing it

### Claude Code

```
/plugin marketplace add Shopify/shopify-ai-toolkit
/plugin install shopify-plugin@shopify-ai-toolkit
```

### Cursor

Install from the [Cursor Marketplace](https://cursor.com/marketplace/shopify).

### Other tools

- **Gemini CLI:** `gemini extensions install https://github.com/Shopify/shopify-ai-toolkit`
- **OpenAI Codex:** in the Codex CLI, run `/plugins`, search "Shopify," select **Add to Codex**.
- **VS Code:** Command Palette → **Chat: Install Plugin From Source** → paste `https://github.com/Shopify/shopify-ai-toolkit`.

The plugin auto-updates as Shopify releases new capabilities — you don't need to manually re-install it to get improvements.

## What's actually in it

The toolkit ships as a set of **skills** — one per Shopify API surface. The ones most relevant to theme development:

| Skill | Covers |
|---|---|
| `shopify-liquid` | Liquid templating, sections, blocks, snippets, schema — the core one for theme work |
| `shopify-dev` | General-purpose search across all of Shopify's developer docs, for anything that doesn't fit a more specific skill |
| `shopify-use-shopify-cli` | Shopify CLI usage |
| `shopify-custom-data` | Metafields and metaobjects |
| `shopify-storefront-graphql` | Storefront API (relevant if a section calls out to the Storefront API directly) |
| `shopify-hydrogen`, `shopify-admin`, `shopify-functions`, `shopify-partner`, and others | Broader Shopify app/platform surfaces — not typically needed for pure theme work, but installed as part of the same toolkit |

Each skill activates automatically when relevant to what you're asking — you don't manually pick one.

## How the `shopify-liquid` skill actually works (and why it matters here)

This is the part worth understanding, not just installing: Shopify's own `shopify-liquid` skill is built around a mandatory **search → generate → validate** loop, enforced by the skill itself:

1. **Search first.** Before writing any Liquid code, the skill searches Shopify's documentation for the relevant tag/filter/object — explicitly instructed *not* to trust its own trained knowledge.
2. **Generate**, using what the search actually returned.
3. **Validate before returning anything.** The generated Liquid/schema is checked against Shopify's real validators. If validation fails, it searches for the specific error, fixes it, and re-validates — up to a few retries — before ever handing code back to you.

This is precisely the discipline [AGENTS.md's "Source of truth & certainty requirements"](/ai-assisted-development/managing-ai-rules/) asks for generally — Shopify has built it directly into their own tooling for Liquid specifically, which is one more reason to actually install and use this alongside our own rules rather than only relying on `AGENTS.md` to ask nicely for the same behavior.

## Using it alongside `AGENTS.md` and Cursor/Claude rules

| This handbook's `AGENTS.md` | Shopify's AI Toolkit |
|---|---|
| Our project's conventions: Skeleton Theme base, no Sass, our naming rules, our schema patterns | Shopify's platform facts: what a filter/object/tag actually does and accepts |
| Enforced by being read as project context | Enforced by an actual search-and-validate loop before returning code |
| You maintain it | Shopify maintains it, auto-updating |

Neither replaces the other. `AGENTS.md` won't tell an AI tool the exact valid options for a `video_tag` parameter — the AI Toolkit's live doc search will. The AI Toolkit won't know we've decided to scaffold from Skeleton Theme, not Horizon — `AGENTS.md` tells it that.

## A note on telemetry

The toolkit's search and validation scripts report usage data to Shopify (`shopify.dev/mcp/usage`) by default — the search query, validation result, and some client/session identifiers. This is disclosed directly in the toolkit's own documentation. If this is a concern for a given project or client engagement, it can be disabled by setting the environment variable `OPT_OUT_INSTRUMENTATION=true`. Confirm your team's/client's data-handling policy before installing on a project where this matters.

## Best practices

- Install the AI Toolkit on every theme project alongside `AGENTS.md` and the [Claude Code custom commands](/ai-assisted-development/claude-code-custom-commands/) — they solve different problems and are meant to be used together.
- Let the toolkit's search-and-validate loop actually run rather than interrupting it — the whole point is that it catches wrong Liquid before you see it, not after.
- Check `OPT_OUT_INSTRUMENTATION` against your project's/client's data-handling requirements before installing, rather than after.

## Common mistakes

- **Assuming `AGENTS.md` alone covers "don't guess about Shopify's platform"** — it states the rule, but the AI Toolkit is what actually implements a real search-and-validate mechanism for Liquid specifically.
- **Not realizing the toolkit sends telemetry by default** — check this before installing on a client project with strict data-handling requirements.
- **Treating the AI Toolkit as a replacement for `AGENTS.md`** rather than a complement — it doesn't know this project's specific conventions (Skeleton Theme, our naming rules), only Shopify's platform facts.

## Quick Reference

- Install: Claude Code (`/plugin marketplace add Shopify/shopify-ai-toolkit` then `/plugin install shopify-plugin@shopify-ai-toolkit`), Cursor (Cursor Marketplace), or see the toolkit's README for Gemini CLI/Codex/VS Code.
- The `shopify-liquid` skill enforces search-before-code and validate-before-return automatically — this is the official version of the discipline `AGENTS.md` asks for.
- Use alongside, not instead of, `AGENTS.md` — platform facts vs. project conventions.
- Telemetry is on by default; set `OPT_OUT_INSTRUMENTATION=true` to disable.

## Further Reading

- [Shopify AI Toolkit](https://github.com/Shopify/Shopify-AI-Toolkit) — GitHub
- [AI Toolkit documentation](https://shopify.dev/docs/apps/build/ai-toolkit) — shopify.dev
- [Managing & Amending AI Rules](/ai-assisted-development/managing-ai-rules/) — the sourcing discipline this toolkit helps enforce
