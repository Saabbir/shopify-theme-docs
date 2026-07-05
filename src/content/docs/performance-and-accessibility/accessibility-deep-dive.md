---
title: Accessibility Deep Dive
description: Building a11y into a section from the start, and rolling that discipline out across a whole theme project.
---

[Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/) is the checklist — nine concrete, testable rules. This article is the process behind consistently meeting them: how to build a section with accessibility in mind from its first line of markup, and how to apply that discipline across an entire theme project with multiple developers and dozens of sections.

## Part 1: building a single section with a11y in mind

### Start from semantic HTML, not a div and some ARIA

The single highest-leverage decision in any section is reaching for the right native element before reaching for a generic `<div>` plus ARIA attributes to compensate:

| Need | Reach for | Not |
|---|---|---|
| A collapsible FAQ answer | `<details>`/`<summary>` | A `<div>` toggled by JS with `aria-expanded` bolted on |
| A modal (cart drawer, quick view) | `<dialog>` | A `<div>` with `role="dialog"` and hand-rolled focus trapping |
| A button that does something | `<button>` | A `<div onclick>` or `<a href="#">` |
| A group of related form fields | `<fieldset>`/`<legend>` | Unlabeled `<div>` groupings |
| Page landmarks (nav, main content, footer) | `<nav>`, `<main>`, `<footer>` | Generic `<div>`s with no landmark role |

A native element gets you correct keyboard behavior, correct screen reader announcement, and correct default styling hooks for free — every one of these has to be manually rebuilt (and gets forgotten more often than not) when you start from a `<div>` instead.

### Build keyboard operability in, don't bolt it on after

Write the keyboard interaction alongside the mouse interaction, in the same pass — not as a follow-up pass after the section "looks done":

```javascript
// ✅ A custom disclosure component handling both mouse and keyboard
// from the start, because it was designed in from the beginning
class Disclosure extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.panel = this.querySelector('[data-panel]');
    this.button.addEventListener('click', () => this.toggle());
    // Escape closes it and returns focus — written now, not "later"
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.toggle();
        this.button.focus();
      }
    });
  }
  toggle() {
    const isOpen = this.panel.hasAttribute('hidden');
    this.panel.toggleAttribute('hidden', !isOpen);
    this.button.setAttribute('aria-expanded', String(isOpen));
  }
  isOpen() { return !this.panel.hasAttribute('hidden'); }
}
```

A component built this way needs no later "accessibility pass" — the keyboard path was never missing in the first place. See [JavaScript & Web Components Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/) for the underlying component patterns this relies on.

### Design for content variability, not just the demo content

An accessibility bug frequently hides behind content that "just happens" to be a convenient length in your demo data:

```liquid
{% comment %} ❌ A heading with no overflow handling passes every
   test with short demo text, then a merchant's actual 90-character
   product title overlaps the image next to it, and the resulting
   overlapping text is unreadable for everyone, not just users
   relying on assistive tech {% endcomment %}
<h2 class="product-title">{{ product.title }}</h2>
```

```css
.product-title {
  overflow-wrap: break-word;
  /* no fixed height/line-clamp truncation for a heading that
     conveys meaning — truncating a heading hides information */
}
```

Stress-testing with unusually long/short content (see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/)) is an accessibility practice as much as a layout one — overlapping or clipped text is a barrier for everyone, and disproportionately for users who rely on browser zoom or larger text settings.

### Color and contrast, checked against every scheme

If the theme supports multiple `color_scheme_group` options (see [Design Tokens, Color & Type System](/design-system/design-tokens-color-type-system/)), a contrast check against only the default scheme misses failures in every other scheme a merchant might select:

```liquid
{% comment %} Check contrast for EVERY scheme a merchant can pick,
   not just "Scheme 1" — a text/background pairing that passes in
   one scheme can easily fail in another if schemes aren't designed
   with contrast in mind as a hard constraint, not a suggestion {% endcomment %}
```

## Part 2: rolling this out across a whole theme project

Building one accessible section is a code-review problem. Keeping 40+ sections, built by several developers over months, consistently accessible is a process problem — here's what actually works at that scale.

### Bake it into the definition of "done," not a separate pass

A section isn't complete when it looks right — it's complete when it looks right *and* passes a keyboard-only run-through and a contrast check. Making this part of the actual definition of done (in a PR template, a Definition of Done doc, or the [Pull Requests & Review](/github-workflow/pull-requests-and-review/) checklist) is what prevents "we'll do an accessibility pass before launch" from becoming a multi-week retrofit.

### Automate what's automatable; keep what isn't as a manual step

| Check | Automatable? | Where it runs |
|---|---|---|
| Missing `alt` text, basic contrast failures, missing form labels | Yes | `theme check` + axe/Lighthouse in CI — see [CI Automation](/github-workflow/ci-automation/) |
| Keyboard operability, focus order, focus trapping in modals | No — requires an actual human tabbing through | Manual QA checklist, per section, before merge |
| Screen reader announcement quality (does this actually make sense read aloud?) | Partially — automated tools flag missing labels, not whether the *experience* makes sense | Periodic manual screen reader spot-checks, not necessarily every PR |

Don't rely on automated tooling alone — it catches missing attributes, not broken interaction patterns. See [Manual QA Checklist](/quality-validation/manual-qa-checklist/) for where the manual keyboard-only pass fits into the existing QA routine.

### Encode the specific, checkable rules in `AGENTS.md`

Since a meaningful share of this theme's code is AI-generated (see [AI-Assisted Development](/ai-assisted-development/)), the project's shared AI rules file is a real lever for consistency at scale — a specific rule ("every interactive element must be keyboard operable with a visible focus state") steers generated code toward the right pattern by default, rather than relying on every reviewer to catch every regression by hand. See [Setting Up AI Rules](/ai-assisted-development/setting-up-ai-rules/).

### Assign explicit ownership for spot-checks

On a team of any size, "everyone is responsible for accessibility" in practice often means no one runs the periodic, harder-to-automate checks (screen reader spot-checks, testing with actual browser zoom/larger text settings). Naming an owner for a recurring (e.g. monthly, or per-milestone) manual accessibility pass — even if it rotates — is what keeps this from silently lapsing as a team's attention moves to new features.

### Treat a regression the same as a broken build

If a change removes a focus style, breaks a modal's focus trap, or removes an `alt` attribute, treat that with the same seriousness as a change that breaks `theme check` or a failing test — not a "nice to fix eventually" note. This is a cultural point as much as a technical one: a codebase stays accessible only as long as regressions here are treated as real defects, not minor cosmetic notes.

## Best practices

- Reach for semantic HTML before ARIA, every time — it's not just cleaner code, it's correct behavior you don't have to hand-build and can't as easily forget.
- Write keyboard interaction in the same pass as mouse interaction — never as a follow-up "accessibility pass."
- Check contrast against every color scheme a merchant can select, not just the default.
- Automate what's automatable (missing labels, contrast) in CI; keep keyboard/focus-trap testing as a manual, per-section step.
- Treat an accessibility regression with the same seriousness as a broken build.

## Common mistakes

- **Building the mouse interaction first and planning a "keyboard pass" for later** — the later pass often doesn't happen, or happens as a rushed retrofit.
- **Testing contrast only against the default color scheme** when the theme offers others.
- **Relying entirely on automated tools**, which don't catch broken tab order, keyboard traps, or content that reads confusingly aloud.
- **Treating accessibility as "everyone's responsibility" with no explicit owner** for the manual checks that don't happen automatically — in practice, this means nobody runs them.

## Quick Reference

- Semantic HTML first, ARIA only when no native element fits.
- Keyboard interaction written alongside mouse interaction, not after.
- Contrast checked against every color scheme, not just the default.
- Automate missing-label/contrast checks in CI; keep keyboard/focus-trap testing manual and explicitly owned.
- A regression here is a broken build, not a cosmetic note.

## Further Reading

- [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/) — the compliance checklist this process supports
- [Manual QA Checklist](/quality-validation/manual-qa-checklist/) — where the keyboard-only pass fits in day-to-day QA
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) — shopify.dev
