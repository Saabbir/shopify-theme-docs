---
title: Packaging & Submitting
description: Building the theme ZIP correctly, and the actual submission steps.
---

## Building the ZIP

Your submission is a ZIP of the theme's root directory — the same [folder structure](/codebase-structure/folder-structure/) you've been working in.

If you have **only one preset**, zip the standard structure directly — no `/listings` folder needed. If you have **multiple presets**, each preset needs its own folder under `/listings`, containing just the files that differ from the base theme:

```
/assets
/blocks
/config
/layout
/locales
/listings
  /embiggen              ← one folder per preset, kebab-case
    /templates
      index.json
      product.json
  /canine-gourmand
    /templates
      index.json
    /sections
      header-group.json  ← only include if this preset overrides it
/sections
/snippets
/templates               ← the "base" set every preset falls back to
```

Don't duplicate identical files across every preset folder — only include what that specific preset overrides. Preset folder names are kebab-case (they become part of a URL).

:::caution
Exclude `release-notes.md` from your **first** submission — Shopify only requires it starting with your first post-launch update, and including it early can confuse the review team about what's new.
:::

## Submitting

1. Log in to your [Partner Dashboard](https://app.shopify.com/services/partners/auth/login).
2. Sidebar → **Themes** → **Submit a theme**.
3. Upload your theme ZIP.
4. Check the box agreeing to the Shopify Partner Agreement.
5. Fill out the **Theme submission form** — listing info for your theme and every preset.
6. Submit.

You can still upload a revised ZIP (**Upload new zip**) any time before Shopify's review team actually starts reviewing — once they've started, you're locked out of changes until they respond.

## Quick Reference

- One preset → plain structure. Multiple presets → `/listings/<preset-name>/` overrides.
- No `release-notes.md` on your first submission.
- You can replace your ZIP right up until review actually begins — not after.

## Further Reading

- [Submitting a theme](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) — shopify.dev
- [Structuring your theme zip](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip) — shopify.dev
