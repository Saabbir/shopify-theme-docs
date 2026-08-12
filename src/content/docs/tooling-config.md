---
title: Tooling & Config
description: The dev tooling files that sit alongside your theme, and how to keep them out of your Theme Store submission.
---

**TL;DR:** The dev tooling files that sit alongside your theme, and how to keep them out of your Theme Store submission.

A real theme repo holds more than the 8 folders Shopify actually reads: `assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, and `templates`. Your repo also holds other files, like Git settings, AI rule files, CI workflows, and maybe a full frontend build setup.

None of those extra files should end up in your Theme Store submission. This section covers two things: how to manage these dev tooling files day to day, and how to correctly leave them out when you package your theme.

## What's on this page group

- [Project Files Explained](/tooling-config/project-files/): what `.gitignore`, `.shopifyignore`, `.theme-check.yml`, `.github/`, `AGENTS.md`/`CLAUDE.md`, and `README.md` each do. (For Prettier and editor setup, see [Editor & Formatting Setup](/getting-started/editor-and-formatting-setup/) in Getting Started.)
- [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/): how to submit only the 8 required folders, and nothing else.
- [Tailwind CSS & Alpine.js Build Setup](/tooling-config/tailwind-and-alpine-build-setup/): an optional build setup some agencies use, and what it trades off.

## The core distinction this section is built around

**Development-time files** are things like Git config, AI rules, CI workflows, and a build setup. These files make your repo easier to work in day to day. **Theme Store submissions** only ever want the 8 standard theme folders, nothing more.

It's easy to mix the two up. For example, you might accidentally commit a `node_modules` folder into your submission zip, or you might not even know that `.shopifyignore` exists. This section exists to help you avoid mistakes like these.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Whenever you add a new dev tooling file, like a new GitHub Action or a new AI rule file, check it against your `.shopifyignore` and your packaging process too. Don't just assume "it's not in the 8 folders" is enough on its own. Check it on purpose. See [Packaging: Theme Store-Only Directories](/tooling-config/packaging-exclusions/). | **Assuming `.gitignore` also protects a Theme Store submission.** It doesn't. A build setup folder that's committed to Git could still end up in a theme zip if you don't handle packaging separately. |
| Keep `.gitignore` and `.shopifyignore` separate in your head, even though they look similar. One keeps files out of your Git history. The other keeps files out of a theme package or deploy. A file might need one of them, both, or neither. | **Adding a new dev tooling file and forgetting to add it to `.shopifyignore`** on the same day. Even a short delay leaves a window where it could ship inside a submission zip. |

## Further reading

- [Shopify CLI for themes](https://shopify.dev/docs/storefronts/themes/tools/cli) (shopify.dev)
