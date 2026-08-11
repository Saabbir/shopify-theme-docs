---
title: Packaging & Submitting
description: How to build the theme ZIP correctly, and the actual steps for submitting it.
---

**TL;DR:** How to build the theme ZIP correctly, and the actual steps for submitting it.

## Building the ZIP

Your submission is a ZIP file of the theme's root directory. This is the same [folder structure](/codebase-structure/folder-structure/) you've been working in all along.

If you have **only one preset**, zip the standard structure directly. You don't need a `/listings` folder. If you have **multiple presets**, each preset needs its own folder under `/listings`, containing just the files that differ from the base theme:

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

Don't copy identical files into every preset folder. Only include what that specific preset overrides. Preset folder names use kebab-case (lowercase words separated by hyphens), because they become part of a URL.

| ✅ Do | ❌ Don't |
|---|---|
| Include only files a preset actually overrides in its `/listings` folder | Copy every template file into every preset folder, even unchanged ones |
| Use kebab-case preset folder names | Use spaces or special characters in preset folder names |
| Keep a complete "base" set in the root `/templates`/`/sections` | Assume presets don't need a working fallback if a preset-specific override is missing |

:::caution
Leave `release-notes.md` out of your **first** submission. Shopify only requires it starting with your first post-launch update, and including it too early can confuse the review team about what's actually new.
:::

## A pre-zip sanity pass

Before you zip anything, take one more look for a few mistakes that are easy to make when you're rushing to finish a submission:

- [ ] No `config/markets.json` file included (explicitly disallowed in the zip)
- [ ] No `.git`, `node_modules`, or other development-only folders accidentally included in the zip
- [ ] No resources specific to your demo store's admin (custom metafield references, `shopify://` URLs) baked into `.json` files. See [Metafields & Metaobjects](/theme-store-requirements/metafields/) for more on this.
- [ ] `link_list` settings in header/footer default to `main-menu`/`footer`, not blank or a demo-specific menu handle
- [ ] Every resource-based setting default (a product, a metaobject) actually exists on a fresh store, not just your demo store

## Submitting

1. Log in to your [Partner Dashboard](https://app.shopify.com/services/partners/auth/login).
2. Sidebar → **Themes** → **Submit a theme**.
3. Upload your theme ZIP.
4. Check the box agreeing to the Shopify Partner Agreement.
5. Fill out the **Theme submission form**, adding listing info for your theme and every preset.
6. Submit.

You can upload a revised ZIP (using **Upload new zip**) any time before Shopify's review team actually starts reviewing it. Once they start, you can't make changes until they respond.

## Best practices

- Run through the pre-zip sanity pass above as an actual checklist, not just a quick mental scan. Items like a leftover `markets.json` file or a demo-specific resource default are easy to miss, and they cause rejections that are completely avoidable.
- Test your ZIP on a completely fresh dev store before submitting. This catches any assumption your code makes that only holds true on your demo store.
- Keep the submission ZIP as a build artifact, not something you commit to your main Git history. That way you have an exact record of what you actually submitted, separate from your ongoing development.

## Common mistakes

- **Including a `config/markets.json` file**, which Shopify explicitly asks you not to submit.
- **Setting a resource default (a product ID, a metaobject reference) that only exists on the demo store.** This breaks that setting on every fresh install.
- **Copying every template file into every preset folder** instead of only including overrides. This bloats the ZIP and makes it harder for reviewers, and future you, to see what's actually preset-specific.

## Key takeaways
- One preset → plain structure. Multiple presets → `/listings/<preset-name>/` overrides.
- No `release-notes.md` on your first submission.
- No `config/markets.json` in the zip, ever.
- You can replace your ZIP right up until review actually begins, but not after.

## Further reading

- [Submitting a theme](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme) (shopify.dev)
- [Structuring your theme zip](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip) (shopify.dev)
- [Partner Dashboard](https://app.shopify.com/services/partners/auth/login) — where you submit the theme
