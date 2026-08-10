---
description: Build a theme feature from a Figma frame — gated plan first, then phase-by-phase execution with review checkpoints.
argument-hint: [figma-url]
---

Build a Solis theme feature from a Figma design: `$ARGUMENTS`

You are the **coordinator**. You do the judgement work — reading the design,
writing the plan, reviewing each phase. You do **not** write theme files
yourself; each phase is dispatched to the `sol-builder` subagent (Sonnet).

Run the phases below in order. **Stop and wait for the user at every line
marked GATE.** Never continue past a gate on your own initiative.

---

## Phase 0 — Preflight

Do all three steps before anything else. If any fails, stop and say so — do
not proceed on a guess.

Store access is **not** checked here. It's only needed for QA, so it's asked
for at the top of Phase 4.

**0.1 Resume check.** If `.sol-workflow/ACTIVE` exists, read the handle in it
and open `.sol-workflow/{handle}/plan.md`. Report which phases are already
checked off and ask whether to resume there or start fresh. Skip the rest of
Phase 0 if resuming.

**0.2 Figma access.** Call your Figma MCP connection's metadata tool on the
URL (see [Figma MCP & Dev Mode](/ai-assisted-development/figma-mcp-and-dev-mode/)
for which tool names apply to your install method).
- Works → say what frame you found, move on.
- Fails → tell the user Figma isn't connected and offer to authenticate.
  Stop until it works.
- No URL in `$ARGUMENTS` → ask for one.

You only ever **read** from Figma. Do not check for or request edit access.

**0.3 Open the run.** Derive a kebab-case handle from the design (e.g.
`feature-grid`). Create `.sol-workflow/{handle}/` and write the handle into
`.sol-workflow/ACTIVE`. This arms the `require-plan.sh` hook.

---

## Phase 1 — Read the design, then ask for instructions

**1.1** Pull the design at desktop, and mobile too if a mobile frame exists.
Capture: layout structure and nesting (never flatten wrappers — say which one
owns alignment), container padding / gap / overflow, exact `border-radius`,
type scale, colors, and which elements repeat. Download any real image or icon
assets — never substitute an icon-library name for actual bytes.

Summarise what you found in 10 lines or fewer.

**1.2** Then ask, verbatim:

> Before I plan this, a few instructions. Answer what's relevant, skip the rest:
>
> 1. **How should this feature work?** Anything the design can't show —
>    behaviour, interaction, responsive intent, content source.
> 2. **Snippets / blocks** — anything you want split out or reused? Any
>    existing component I should model this on?
> 3. **Section settings** — what must the merchant be able to change? What
>    should stay hardcoded?
> 4. **Anything to leave out**, or naming you want me to use?
>
> I'll also suggest my own improvements on top of your answers.

GATE — wait for the answer. Do not plan from the design alone.

---

## Phase 2 — Write the plan

Read `.claude/templates/plan-template.md` and fill it in at
`.sol-workflow/{handle}/plan.md`.

Rules:
- **Leave `Status: draft`.** Only the user's approval changes it.
- Paste their instructions into §2 **verbatim**. The builder agent starts cold
  and reads nothing but this file — anything you summarise away is lost.
- §3 is the decision that matters most: what is a **setting**, what is a
  repeatable **block**, what is a **snippet**, what is hardcoded. Justify the
  boundaries. This is what's expensive to change later.
- §7 phases: 3–5 of them, each reviewable in one sitting, each ending in a
  concrete checkpoint. Always foundations (locale keys) first, section last
  before QA.
- §8: your own suggested improvements — accessibility, settings worth
  exposing, edge cases the design ignores. Be specific, not generic.
- §9: copy in only the ground-truth gaps this build actually touches (the
  full list is in `.claude/agents/sol-builder.md`).

Present the plan **in full in chat** — the user should not have to open the
file. Then ask:

> Approve this plan, or tell me what to change?

GATE. Revisions loop here. On approval, edit the front matter to
`Status: approved` and say which phase you're starting.

**Nothing may be written to `sections/`, `blocks/`, `snippets/` or `assets/`
before this.** The `require-plan.sh` hook enforces it — if you hit it, you
skipped a step.

---

## Phase 3 — Execute, one phase at a time

For each numbered phase in the plan's §7:

**3.1** Dispatch the `sol-builder` subagent with `run_in_background: false`.
Its prompt must contain, and nothing more:
- the absolute path to `plan.md`
- which numbered phase to execute
- anything the previous phase reported that changes this one

Don't restate conventions in the prompt — the agent reads `AGENTS.md` itself.

**3.2** When it returns, **verify its claims yourself** before showing the
user. Agent self-review has blind spots. Read each file it touched and check
it against your theme's actual `AGENTS.md` conventions — schema `t:` keys,
locals-at-the-top, mobile handled as a media query not a Liquid check, naming
convention, non-empty `presets`, `:focus-visible` present.

Report what you checked and anything you fixed.

**3.3** Tell the user what landed, what to look at, and ask:

> Phase {n} done. Review it — ready for Phase {n+1}?

GATE. Tick the phase's checkboxes and append to the plan's Progress log only
after they confirm.

---

## Phase 4 — QA

**4.1 Static.** `shopify theme check`. Zero errors before continuing. This
needs no store access — run it first.

**4.2 Store access.** Only now do you need a store. Read
`.sol-workflow/config.json` for the domain. If missing, ask for the
`*.myshopify.com` domain and write it there — you're only asked once per repo.
Then verify with `shopify theme list --store {store}` (allow ~60s; it can be
slow on a cold auth).

If it fails, the user needs `shopify auth login`, which they must run
themselves (`! shopify auth login`). Stop and tell them — do not attempt the
rest of Phase 4 without a reachable store, and do not report unrun checks as
passed.

**4.3 Storefront (Playwright).** To render the section:
1. Copy `templates/index.json` → `.sol-workflow/.index-backup.json`
2. Write an `index.json` containing only the new section, with realistic settings and blocks
3. Start `shopify theme dev --store {store}` with `run_in_background: true`;
   poll its output until `http://127.0.0.1:9292` appears. **Never kill it.**
4. Load the preview, check at **375 / 768 / 1280 / 1920**
5. Also render: **zero blocks**, **max blocks at 375px**, **very long strings**,
   **missing image**
6. Capture console errors; tab through and confirm visible focus
7. **Restore `templates/index.json` from the backup and delete it**

If the store is password-protected, Playwright will land on the password page
— ask the user for the storefront password rather than reporting a broken page.

The `restore-index.sh` hook puts `index.json` back if the session is
interrupted, but restoring it yourself is still your job.

**4.4 Theme editor (browser automation).** Playwright cannot log into
`admin.shopify.com`; a browser-automation MCP that drives the user's existing
logged-in browser session can. Open the editor, add the section, then verify:
add / reorder / delete blocks with no console error; the preset renders
populated, not empty; dragging `padding_top_mobile` updates the preview
**without a manual refresh** (this is the check that catches a Liquid device
check pretending to be a media query).

If the browser session isn't logged in, say so and emit these as a manual
checklist. Do not report them as passed.

**4.5** Write `.sol-workflow/{handle}/qa-report.md`: what passed, what failed,
what could only be checked manually. Screen-reader behaviour is never asserted
automatically — list it as manual.

GATE — present the report.

---

## Phase 5 — Close out

On the user's go-ahead: delete `.sol-workflow/ACTIVE` (this disarms the hook
and returns the repo to normal editing), confirm `templates/index.json` is
back to its original content, and summarise every file added or changed.

Leave `.sol-workflow/{handle}/` in place as the record of the run.

---

## Standing rules

- Gates are hard stops. "The user will probably say yes" is not approval.
- Never write `sections/`, `blocks/`, `snippets/`, `assets/` yourself — that's
  the builder's job, and doing it yourself skips the per-file validation.
- Never kill the `theme dev` server; leave it running for the next phase.
- If the user asks for something that contradicts the approved plan, update
  the plan file first, then build. The plan stays the source of truth.
