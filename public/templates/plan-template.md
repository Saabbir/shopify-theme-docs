# {Feature name} — build plan

Handle: `{section-handle}`
Figma: {figma-url}
Store: {store}.myshopify.com
Status: draft
Created: {YYYY-MM-DD}

> `Status:` is the gate the `require-plan.sh` hook reads. It stays `draft`
> until the user approves this plan out loud. Nothing may be written to
> `sections/`, `blocks/`, `snippets/` or `assets/` while it says `draft`.

---

## 1. What we're building

{2–4 sentences. What the merchant sees, what it's for, how it behaves.}

## 2. Custom instructions (verbatim from the user)

{Paste the user's answers exactly. Do not summarise — the builder agent reads
this and gets no other access to the conversation.}

## 3. Component breakdown

| File | Kind | Purpose |
|---|---|---|
| `sections/{handle}.liquid` | section | {…} |
| `blocks/{name}.liquid` | block | {repeatable item — why it's a block, not a setting} |
| `snippets/{name}.liquid` | snippet | {reused fragment — why it's a snippet, not inline} |
| `assets/{name}.js` | web component | {interactive behaviour — omit if the section is static} |

**Why these boundaries:** {one paragraph. Repeatable + merchant-reorderable →
block. Reused markup with no editor surface → snippet. One-off → inline.}

## 4. Section settings

| id | type | label key | default | notes |
|---|---|---|---|---|
| `heading` | text | `t:labels.heading` | … | |
| … | | | | |
| `padding_top` | range 0–120 step 4 | `t:labels.padding_top` | 40 | four-setting padding rule — see AGENTS.md |
| `padding_bottom` | range 0–120 step 4 | `t:labels.padding_bottom` | 40 | |
| `padding_top_mobile` | range 0–120 step 4 | `t:labels.padding_top_mobile` | 24 | |
| `padding_bottom_mobile` | range 0–120 step 4 | `t:labels.padding_bottom_mobile` | 24 | |

**Blocks:** `max_blocks: {n}`, types: {…}
**Preset:** {what the preset ships with, so the section looks right the moment
it's added in the customizer — never empty. See Presets in this handbook.}

## 5. New translation keys

Every key below must be added to the locale files before any schema references
it. Mark which file each belongs in.

| key | file | English value |
|---|---|---|
| `t:labels.padding_top` | `en.default.schema.json` | Padding top |
| … | | |

## 6. CSS custom properties

Declared on the section root, consumed in `{% stylesheet %}`.

| property | source | fallback |
|---|---|---|
| `--padding-top` | `padding_top` setting | — |
| … | | |

## 7. Phases

Each phase is one hand-off to the `sol-builder` agent, then a stop for review.
Keep phases small enough to review in one sitting.

### Phase 1 — Foundations
- [ ] Add the new translation keys from §5
- [ ] `validate_theme` on every file touched
- **Review checkpoint:** keys present, both locale files still parse

### Phase 2 — {Snippets / blocks}
- [ ] `snippets/{name}.liquid` with `{% doc %}` header
- [ ] `blocks/{name}.liquid` with schema + preset
- [ ] `validate_theme` after **each** file
- **Review checkpoint:** {what the user should look at}

### Phase 3 — Section
- [ ] `sections/{handle}.liquid`, following this theme's actual conventions
      for comment headers vs. `{% doc %}` (check `AGENTS.md`, don't assume)
- [ ] Settings assigned to locals at the top
- [ ] Custom properties on the root element
- [ ] `{% stylesheet %}` with this theme's naming convention + mobile override
- **Review checkpoint:** renders in the theme editor, settings move things

### Phase 4 — Behaviour (omit if static)
- [ ] `assets/{name}.js` Web Component, namespaced tag
- [ ] Progressive enhancement — markup usable before upgrade
- [ ] ARIA state managed in JS
- **Review checkpoint:** works with JS blocked, keyboard reachable

### Phase 5 — QA
- [ ] `shopify theme check` → zero errors
- [ ] Storefront at 375 / 768 / 1280 / 1920 (Playwright)
- [ ] Theme editor: add / reorder / delete blocks, no console errors (browser automation)
- [ ] Zero blocks, max blocks, long strings, missing image
- [ ] Keyboard tab order + visible `:focus-visible`
- **Review checkpoint:** `qa-report.md`

## 8. Suggested improvements

{Claude's own additions beyond what the design and instructions asked for —
accessibility, extra settings worth exposing, edge cases the design ignores,
reuse opportunities. The user accepts or rejects these as part of approval.}

## 9. Known repo gaps this plan must work around

{Copied from the command's ground-truth list, filtered to what this build
actually touches. Do not generate references to infrastructure that isn't
there.}

---

## Progress log

Append one line per completed phase: date, phase, what landed, what deferred.
