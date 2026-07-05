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
/locales
/layout
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

| ✅ Do | ❌ Don't |
|---|---|
| Include only files a preset actually overrides in its `/listings` folder | Copy every template file into every preset folder, even unchanged ones |
| Use kebab-case preset folder names | Use spaces or special characters in preset folder names |
| Keep a complete "base" set in the root `/templates`/`/sections` | Assume presets don't need a working fallback if a preset-specific override is missing |

:::caution
Exclude `release-notes.md` from your **first** submission — Shopify only requires it starting with your first post-launch update, and including it early can confuse the review team about what's new.
:::

## A pre-zip sanity pass

Before you zip anything, it's worth a final look for a few specific mistakes that are easy to make in the rush of finishing a submission:

- [ ] No `config/markets.json` file included (explicitly disallowed in the zip)
- [ ] No `.git`, `node_modules`, or other development-only folders accidentally included in the zip
- [ ] No resources specific to your demo store's admin (custom metafield references, `shopify://` URLs) baked into `.json` files — see [Metafields & Metaobjects](/theme-store-requirements/metafields/)
- [ ] `link_list` settings in header/footer default to `main-menu`/`footer`, not blank or a demo-specific menu handle
- [ ] Every resource-based setting default (a product, a metaobject) actually exists on a fresh store, not just your demo store

## Submitting

1. Log in to your [Partner Dashboard](https://app.shopify.com/services/partners/auth/login).
2. Sidebar → **Themes** → **Submit a theme**.
3. Upload your theme ZIP.
4. Check the box agreeing to the Shopify Partner Agreement.
5. Fill out the **Theme submission form** — listing info for your theme and every preset.
6. Submit.

You can still upload a revised ZIP (**Upload new zip**) any time before Shopify's review team actually starts reviewing — once they've started, you're locked out of changes until they respond.

## Best practices

- Run the pre-zip sanity pass above as a genuine checklist, not a mental skim — several of these items (like a `markets.json` file or a demo-specific resource default) are easy to miss and cause an entirely avoidable rejection.
- Test your ZIP on a completely fresh dev store before submitting, to catch any demo-store-specific assumption baked into the code.
- Keep the submission ZIP itself as a build artifact (not committed to your main Git history) so you have an exact record of what was actually submitted, separate from ongoing development.

## Common mistakes

- **Including a `config/markets.json` file**, which Shopify explicitly asks you not to submit.
- **Baking in a resource default (a product ID, a metaobject reference) that only exists on the demo store**, causing a broken setting on every fresh install.
- **Duplicating every template file across every preset folder** instead of only including overrides, bloating the ZIP and making it harder for reviewers (and future you) to see what's actually preset-specific.

## Quick Reference

- One preset → plain structure. Multiple presets → `/listings/<preset-name>/` overrides.
- No `release-notes.md` on your first submission.
- No `config/markets.json` in the zip, ever.
- You can replace your ZIP right up until review actually begins — not after.

## Further Reading

- [Submitting a theme](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) — shopify.dev
- [Structuring your theme zip](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip) — shopify.dev
