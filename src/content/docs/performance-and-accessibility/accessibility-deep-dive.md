---
title: Accessibility Deep Dive
description: How to build accessibility into a section from the start, and keep that discipline across a whole theme project.
---

The [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/) page is the checklist. It lists nine clear, testable rules. This article explains the process behind meeting those rules every time, not just once. You'll see how to build a section with accessibility in mind from the very first line of code, and how to keep that same care going across a whole theme project with multiple developers and dozens of sections.

## Part 1: building a single section with a11y in mind

### Start from semantic HTML, not a div and some ARIA

The most important decision you make in any section is simple: pick the right native HTML element instead of reaching for a generic `<div>` and patching it up with ARIA attributes. Here's the useful part though: a native HTML element usually gives you all of that behavior for free, without any ARIA at all.

| Need | Reach for | Not |
|---|---|---|
| A collapsible FAQ answer | `<details>`/`<summary>` | A `<div>` toggled by JS with `aria-expanded` bolted on |
| A modal (cart drawer, quick view) | `<dialog>` | A `<div>` with `role="dialog"` and hand-rolled focus trapping |
| A button that does something | `<button>` | A `<div onclick>` or `<a href="#">` |
| A group of related form fields | `<fieldset>`/`<legend>` | Unlabeled `<div>` groupings |
| Page landmarks (nav, main content, footer) | `<nav>`, `<main>`, `<footer>` | Generic `<div>`s with no landmark role |

A native element gives you correct keyboard behavior, correct screen reader announcements, and correct default styling, all for free. If you start with a `<div>` instead, you have to build every one of those things by hand yourself. That takes more work, and it's easy to forget a piece.

### Build keyboard support in from the start, don't add it later

Write the keyboard interaction at the same time as the mouse interaction. Do it in the same coding session, not as a follow-up pass after the section "looks done."

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

A component built this way never needs a separate "accessibility pass" later. The keyboard support was never missing in the first place, so there's nothing left to add. See [JavaScript & Web Components Deep Dive](/learning-articles/javascript-and-web-components-deep-dive/) for more on the component patterns this example builds on.

### Design for real content, not just your demo content

Accessibility bugs love to hide behind demo content. Your test data is often a convenient, tidy length, so a bug only shows up once a real merchant adds their own content:

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

Testing with unusually long or short content (see [Figma to Code Workflow](/ai-assisted-development/figma-to-code-workflow/)) isn't just a layout check, it's an accessibility check too. Overlapping or cut-off text is annoying for everyone. But it's an even bigger problem for people who use browser zoom or larger text settings, because their text takes up more room than yours does in testing.

### Check color contrast against every color scheme

If your theme supports multiple `color_scheme_group` options (see [Color Schemes](/colors/color-schemes/)), checking contrast on only the default scheme isn't enough. A merchant might switch to a different scheme, and that scheme could fail the contrast test even though your default one passes fine. This is common enough, and specific enough, that it has its own dedicated page: see [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/) for the actual ratios, testing tools, and how to derive per-scheme focus outline colors.

## Part 2: rolling this out across a whole theme project

Making one section accessible is a problem a code review can catch pretty easily. But keeping 40 or more sections accessible, built by several developers over many months, is a bigger process problem. Here's what actually works at that scale.

### Make accessibility part of "done," not a separate pass

A section isn't finished just because it looks right on screen. It's finished when it looks right *and* passes a keyboard-only test and a contrast check. Add this rule to your real definition of "done," whether that's in a PR template, a Definition of Done document, or the [Pull Requests & Review](/github-workflow/pull-requests-and-review/) checklist. That one habit is what stops "we'll do an accessibility pass before launch" from turning into weeks of rework.

### Automate what you can, do the rest by hand

| Check | Automatable? | Where it runs |
|---|---|---|
| Missing `alt` text, basic contrast failures, missing form labels | Yes | `theme check` + axe/Lighthouse in CI, see [CI Automation](/github-workflow/ci-automation/) |
| Keyboard operability, focus order, focus trapping in modals | No (requires an actual human tabbing through) | Manual QA checklist, per section, before merge |
| Screen reader announcement quality (does this actually make sense read aloud?) | Partially (automated tools flag missing labels, not whether the *experience* makes sense) | Periodic manual screen reader spot-checks, not necessarily every PR |

Don't rely on automated tools alone. They're great at catching missing attributes, but they can't catch broken interactions, like a modal that traps keyboard focus the wrong way. See [Manual QA Checklist](/quality-validation/manual-qa-checklist/) to see where the manual keyboard-only test fits into your regular QA routine.

### Put clear, checkable rules in `AGENTS.md`

A lot of this theme's code gets written by AI tools (see [AI-Assisted Development](/ai-assisted-development/)). That makes the project's shared AI rules file a great place to keep accessibility consistent. Write a clear rule, something like "every interactive element must be keyboard operable with a visible focus state," and generated code will follow that pattern automatically. That's a lot more reliable than hoping every reviewer catches every mistake by hand. See [Setting Up AI Rules](/getting-started/setting-up-ai-rules/) for how to set this up.

### Assign explicit ownership for spot-checks

Here's a trap a lot of teams fall into. On any team, saying "everyone is responsible for accessibility" often means no one actually runs the harder-to-automate checks, things like screen reader spot-checks or testing with browser zoom and larger text settings. The fix is simple: name one person as the owner of a recurring accessibility pass, monthly or at each milestone, even if that role rotates between people. Otherwise these checks quietly stop happening once the team's attention moves on to new features.

### Treat a regression the same as a broken build

If a change removes a focus style, breaks a modal's focus trap, or removes an `alt` attribute, treat it as seriously as a change that breaks `theme check` or fails a test. Don't file it away as a "nice to fix eventually" note. This is as much about team culture as it is about code: a codebase only stays accessible if the whole team treats these regressions as real bugs, not small cosmetic issues.

## Best practices

- Use semantic HTML before ARIA, every time. It's not just cleaner code, it's correct behavior you get for free instead of building it by hand and risking a mistake.
- Write keyboard interaction at the same time as mouse interaction. Never save it for a follow-up "accessibility pass."
- Check color contrast against every color scheme a merchant can pick, not just the default one.
- Automate what you can in CI (missing labels, contrast checks). Keep keyboard and focus-trap testing as a manual, per-section step.
- Treat an accessibility regression as seriously as a broken build.

## Common mistakes

- **Building the mouse interaction first and planning to add keyboard support later.** That later pass often doesn't happen, or it happens as a rushed fix.
- **Testing contrast only against the default color scheme** when the theme offers others.
- **Relying entirely on automated tools,** which don't catch broken tab order, keyboard traps, or content that reads confusingly out loud.
- **Treating accessibility as "everyone's responsibility" without naming an owner** for the manual checks that don't happen automatically. In practice, this means nobody runs them.

## Quick Reference

- Semantic HTML first, ARIA only when no native element fits.
- Keyboard interaction written alongside mouse interaction, not after.
- Contrast checked against every color scheme, not just the default.
- Automate missing-label and contrast checks in CI; keep keyboard and focus-trap testing manual, with a named owner.
- A regression here is a broken build, not a cosmetic note.

## Further Reading

- [Accessibility (WCAG 2.1 AA)](/theme-store-requirements/accessibility/): the compliance checklist this process supports
- [Color Accessibility & Contrast](/colors/color-accessibility-and-contrast/): the full color-specific contrast rules and testing approach
- [Manual QA Checklist](/quality-validation/manual-qa-checklist/): where the keyboard-only pass fits into day-to-day QA
- [Accessibility best practices](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) (shopify.dev)
