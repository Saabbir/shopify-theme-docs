# Solis Engineering Portal — Phase 1 Audit

Status: **Draft for approval. No portal content has been rewritten.** This is the audit only.

## 1. Confirmed facts about the current repo

**Tech stack for the portal itself:** plain static HTML + CSS + vanilla JS. No framework, no build step, no bundler. Three pages (`index.html`, `checklist.html`, `engineering-portal.html`) share `assets/css/site.css` and `assets/js/site.js`, plus one page-specific CSS/JS pair each. Deployed as a static site via Netlify (`.netlify/netlify.toml`, publish-only, no functions). There is no `.github` folder, no `.cursorrules`, no `CLAUDE.md`, no `README.md`, and no PR template anywhere in the repo — these need to be created from scratch in Phase 2.

**Total content size:** ~3,500 lines across the three HTML files, 72 total sections/subsections (22 + 10 + 40), plus ~700 lines of shared CSS/JS.

**Naming:** nothing in the repo currently says "Solis." All content is written for a generic, unnamed Shopify theme. Every page will need the product name threaded through (title tags, headers, footer, meta descriptions) once approved.

## 2. Inventory of everything that exists today

### `index.html` — "Submission Requirements" (22 sections)
Exclusivity, Uniqueness, Design & UX, Features, Templates & Blocks, Lighthouse Scores, Page Requirements, Consistency & Code, Browser Compatibility, Assets, SEO, Accessibility, Social Media, Settings, Font Picker, Color System, Responsive Images, Naming & Presets, Versions & Notes, Demo Stores, Documentation, Support.

Style: terse, factual checklist items pulled directly from Shopify's official Theme Store requirements docs. No "why it matters" narrative, no code examples, no beginner explanation — written to be scanned by someone who already knows the domain.

### `checklist.html` — "Development Checklist" (10 sections)
Home page, Header, Footer, Sections, Pages, Link sharing, Local pickup, Unit pricing, Rich media, Selling plans.

Style: an interactive, click-to-check QA list for manually testing storefront states (empty cart, long titles, out-of-stock, etc.). Generic to any Shopify theme — not Solis-specific, not tied to the Theme Store submission process explicitly.

### `engineering-portal.html` — "Engineering Portal" (40 sections, 8 groups)
- **Foundations:** Project Vision, Project Goals, Theme Architecture, Folder Structure, Technology Stack
- **Process:** Development Workflow, Figma to Shopify Process, AI Development Strategy
- **AI Tooling:** Shared AI Rules, Cursor Rules, Claude Code Rules, Copilot Rules, Universal Prompt Templates
- **Coding Standards:** Coding Standards, Liquid Standards, HTML Standards, CSS Standards, JavaScript Standards, JSON Standards, Naming Conventions
- **Architecture:** Component Architecture, Section Development Guidelines, Snippet Guidelines
- **Quality:** Accessibility, Performance, Responsive Images, Theme Editor UX, Merchant Experience, Theme Store Requirements
- **Tooling:** Theme Check Rules, ESLint Rules, Stylelint Rules, Prettier Rules
- **Delivery:** Git Workflow, GitHub Automation, Pull Request Checklist, AI Code Review Checklist, Testing Strategy, Release Process, Roadmap

Style: dense, expert-to-expert prose ("engineering constitution," "falsifiable," "collapse that variance to zero"). Written for a principal/staff engineer audience, not week-one juniors. Each section follows a rich template (Overview, Why It Matters, Best Practices, Common Mistakes, Example, Team Rules, AI Instructions, Validation Checklist) — structurally sound, but every section needs a tone and length pass.

## 3. Duplicate content across pages

| Topic | Appears in | Verdict |
|---|---|---|
| Accessibility | `index.html` §12 (concrete checklist), `engineering-portal.html` #24 (philosophy/rules) | Real duplication. Keep the concrete checklist as the source of truth in the new "Theme Store Requirements" section; fold the portal's version down into a short "why it matters" intro, don't repeat the checklist. |
| Responsive images | `index.html` §17, `engineering-portal.html` #26 | Same requirement explained twice, different depth. Merge into one section. |
| Lighthouse / performance | `index.html` §6, `engineering-portal.html` #25 | Same numbers (Performance ≥ 60, Accessibility ≥ 90) stated in two places. Merge. |
| Theme Store Requirements | `engineering-portal.html` #29 explicitly cross-references `index.html` instead of repeating it | **Good existing pattern** — this is the one place duplication was already avoided deliberately. Worth preserving this "one canonical source, everything else links to it" approach in the rebuild. |
| Settings / schema | `index.html` §14, `engineering-portal.html` JSON Standards + Section Guidelines | Partial overlap — settings *rules* live in one place, schema *code patterns* in another. Needs one clear home. |

## 4. Overly complex / verbose content (tone mismatch)

Every section of `engineering-portal.html` is written in a voice built for senior engineers, not the "simple English, junior-friendly, no unnecessary verbosity" standard the brief requires. Concrete example, from the current "Project Vision" section:

> "We are building a new Shopify Theme Store product from a blank canvas. The theme itself is not the deliverable of this document — this portal is. It is the engineering constitution that every human and every AI coding assistant reads before writing a single line of Liquid, CSS, or JavaScript for this repository."

This is well-written for its original audience, but it's the wrong register for someone in their first week. All 40 sections have this problem — it's not a few outliers, it's the entire page's voice. This means Phase 2 is not a light edit of the Engineering Portal; it's a rewrite, even where the underlying facts are correct and reusable.

`index.html` and `checklist.html` are already close to the right register (short, checklist-style, factual) — these two need far less tonal rework, mainly restructuring and added "why" context.

## 5. Content unrelated to Solis / Theme Store requirements

- **Roadmap** (#40): generic placeholder milestones ("Sprint 1–2… Post-launch…") not tied to any real Solis timeline. Recommend dropping from the engineering docs entirely — a roadmap belongs in a project-management tool, not a technical reference a junior dev uses to build the theme.
- **Merchant Experience** (#28) and **Theme Editor UX** (#27): general Shopify UX philosophy, not a Theme Store *requirement*. Useful, but they don't map to any of the 8 required sections as standalone topics — recommend folding the actionable parts into "Shopify Theme Store Requirements" (OS 2.0 theme editor behavior) and cutting the rest.
- **Stat grid / "8 AI tools unified" marketing-style header cards**: cosmetic, not informational. Fine to keep as decoration or drop — no content risk either way, flagging only because it's not "content" the audit needs to account for.

## 6. Gaps against the required 8-section structure

| # | Required section | Current coverage |
|---|---|---|
| 1 | **Getting Started** | **Missing entirely.** No onboarding page exists — nothing explains what Solis is, prerequisites, cloning the repo, or running a first preview. |
| 2 | **Shopify Theme Store Requirements** | Strong raw material in `index.html` (22 sections), but organized as a flat Shopify-doc mirror, not around the brief's specific sub-topics. Explicitly thin or missing: **i18n / RTL support** (no locale files, no translation workflow, no RTL section anywhere), **app-block compatibility** (not covered), **metafields usage** (not covered as its own topic), **schema.json best practices** (scattered across JSON Standards / Section Guidelines, not framed as a submission requirement). Accessibility, performance, mobile, and required templates are covered reasonably well already. |
| 3 | **Codebase Structure** | Good coverage: Theme Architecture, Folder Structure, Component Architecture, Section Guidelines, Snippet Guidelines all exist and map cleanly. Needs simplification and de-duplication, not new research. |
| 4 | **Scaffold Setup Guide** | **Missing.** Current content explains architecture *conceptually* but never walks through the actual step-by-step of scaffolding a section from Dawn / a blank theme, wiring up `settings_schema.json`, or building your first block. |
| 5a | **Setting Up AI Rules** | Partial. Cursor/Claude/Copilot rule *excerpts* exist, but there is no complete, ready-to-drop-in `.cursorrules` or `CLAUDE.md` file anywhere in the repo — Phase 2 needs to produce actual files, not just prose about them. |
| 5b | **Figma to Code Workflow** | Partial. "Figma to Shopify Process" exists conceptually (decompose → separate content from chrome → map to schema) but isn't tool-specific (no Cursor/Claude-Code prompt-by-prompt walkthrough, no design-token extraction guidance). Needs expansion, not a full rewrite. |
| 5c | **Writing Prompts That Work** | Good raw material in "Universal Prompt Templates" — mostly needs simplification for tone. |
| 6 | **GitHub Workflow** | Good conceptual coverage (Git Workflow, GitHub Automation, PR Checklist, AI Code Review Checklist), but **no actual `.github/PULL_REQUEST_TEMPLATE.md` or workflow YAML exists in the repo** — these are Definition-of-Done items that must be created, not just documented. |
| 7 | **Quality & Validation** | Decent coverage spread across Theme Check Rules, ESLint/Stylelint/Prettier, Testing Strategy, and `checklist.html`. `checklist.html`'s manual QA list is useful but generic (not framed as pre-submission validation) — needs re-scoping into this section rather than staying a standalone page. |
| 8 | **Publishing to Shopify Theme Store** | **Missing entirely.** No content on Partner Dashboard setup, packaging/zipping a theme, the submission form, the review process, common rejection reasons, or post-approval versioning. "Release Process" (#39) covers generic versioning but not Theme Store submission mechanics specifically. |

## 7. What stays (and why)

- **`index.html`'s 22 requirement items** — factually accurate, sourced from Shopify's official docs, already in the right terse register. Reuse as the backbone of the new "Shopify Theme Store Requirements" section; add "why it matters" + code example + reference link per item rather than rewriting the requirements themselves.
- **`engineering-portal.html`'s architecture content** (Folder Structure, Component Architecture, Section/Snippet Guidelines) — structurally correct and maps directly to "Codebase Structure." Needs a tone/length pass, not new research.
- **AI Tooling rule content** (Cursor/Claude/Copilot/Prompt Templates) — the underlying rules are sound; they need to be consolidated into one shared rules file plus tool-specific shims, and simplified in tone.
- **Shared design system** (`assets/css/site.css`, `assets/js/site.js`, dark mode, search, mobile nav) — all of this is presentation-layer, unrelated to content quality, and already works well. Keep as-is; the rebuild is a content/IA project, not a redesign.
- **Coding Standards content** (Liquid/HTML/CSS/JS/JSON standards, naming conventions) — accurate and useful; fold into Codebase Structure or Quality & Validation depending on final page map, with simplified language.

## 8. What gets removed (and why)

- **Roadmap** (#40) — speculative, not tied to real milestones, doesn't belong in a technical reference. Remove from the portal (can live in a project tracker instead).
- **Merchant Experience** (#27/#28 non-actionable parts) — general philosophy, not a checkable requirement; the useful bits get folded into Theme Store Requirements, the rest is cut.
- **`checklist.html` as a standalone page** — its content is useful but currently disconnected from the Theme Store submission narrative. Recommend absorbing it into "Quality & Validation" rather than keeping it as a separate top-level page, so a junior dev has one fewer place to look.
- **Duplicate accessibility / performance / responsive-image explanations** — collapse each to a single canonical location (see §3).
- **Generic "principal engineer" framing language** throughout `engineering-portal.html` (e.g. "engineering constitution," philosophy-strip callouts) — cut in favor of direct, plain-English statements of what to do and why.

## 9. What needs to be written from scratch

1. **Getting Started** — full new section (what Solis is, prerequisites, environment setup, first run).
2. **i18n / RTL support guidance** (part of section 2).
3. **App-block / app compatibility guidance** (part of section 2).
4. **Metafields usage guide** (part of section 2).
5. **Scaffold Setup Guide** — full new section, step-by-step from a blank/Dawn-based theme.
6. **Figma-to-code workflow, tool-specific** (Cursor/Claude Code prompt-by-prompt walkthrough + design-token extraction) — expansion of existing content.
7. **Actual `.cursorrules` and `CLAUDE.md` files** — not documentation about them, the files themselves.
8. **`.github/PULL_REQUEST_TEMPLATE.md`** and any CI workflow files referenced in the GitHub Workflow section.
9. **Publishing to Shopify Theme Store** — full new section (Partner Dashboard, packaging, submission, review process, rejection reasons, post-approval versioning).
10. **Quick Reference + Further Reading boxes** — none of the existing content has these; every major section needs them added per the brief's writing rules.

## 10. Proposed new site structure (page map)

Single portal, one page per required section (8 pages) instead of the current 3-page split, so the IA matches the brief exactly:

1. `getting-started.html`
2. `theme-store-requirements.html` *(absorbs all of current `index.html`, plus new i18n/RTL, app-compatibility, metafields, schema-best-practices content)*
3. `codebase-structure.html` *(from Architecture + Folder Structure + Component/Section/Snippet Guidelines)*
4. `scaffold-setup.html` *(new)*
5. `ai-assisted-development.html` *(with in-page sub-sections 5a/5b/5c; absorbs AI Tooling group + Figma-to-Shopify content)*
6. `github-workflow.html` *(from Git Workflow, GitHub Automation, PR Checklist, AI Code Review Checklist)*
7. `quality-validation.html` *(from Theme Check/ESLint/Stylelint/Prettier/Testing Strategy + re-scoped `checklist.html` content)*
8. `publishing.html` *(new)*

Shared shell (`assets/css/site.css`, `assets/js/site.js`, topnav, dark mode, search) carries over unchanged — only the page count and content per page change. Search index gets rebuilt against the new 8 pages.

## 11. Open questions — flagging rather than guessing

- **Repo/GitHub setup:** the repo currently has no `.github` folder and I see no evidence of an actual GitHub remote (only Netlify config). Section 6 (GitHub Workflow) and the PR template/CI files can't be written accurately without knowing your actual branch protection rules, CI provider (GitHub Actions vs. something else), and whether Theme Check runs in CI today.
- **Partner Dashboard / store details:** Section 8 (Publishing) needs to know whether you already have a Shopify Partner account and development store set up for Solis, or whether that setup should be documented as part of Getting Started too.
- **Design source:** Section 5b (Figma to Code) assumes Figma is the design tool in use — confirming that's still accurate before I build tool-specific guidance around it.
- **Scaffold starting point:** confirming whether Solis scaffolds from Dawn (Shopify's reference theme) or a fully blank Online Store 2.0 skeleton — this changes the entire Scaffold Setup Guide.
- **Metafields:** no current content defines *which* metafields Solis actually uses (product/variant/page metafields for custom data) — this needs real answers from you, not invented examples, when we write that section.

---

**Waiting for approval before writing any Phase 2 content.** Once approved, I'll proceed section by section in the order above, starting with Getting Started, announcing each section as I begin it.
