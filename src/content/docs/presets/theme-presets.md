---
title: Theme Presets
description: How a theme preset works end to end, why shipping more than one is worth it, extending a theme to support a new preset, and how presets map to a Theme Store listing.
---

**TL;DR:** How a theme preset works end to end, why shipping more than one is worth it, extending a theme to support a new preset, and how presets map to a Theme Store listing.

A theme preset is a complete, named configuration for the entire theme. It lives in `config/settings_data.json`, inside the `"presets"` object (see [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/) for that file's full structure). This is what lets a single theme codebase offer several different "styles" when a merchant installs it, for example "Studio," "Warehouse," and "Boutique," each a different mix of colors, fonts, and layout, all built on the same underlying code.

Don't confuse this with a section or block preset, a different concept living in a different file — see [Section Presets](/presets/section-presets/) and [Block Presets](/presets/block-presets/) for those.

## Why ship more than one theme preset

A theme preset isn't just a color swap. It's a business decision, and it's worth understanding the actual payoff before you commit engineering time to building a second one:

- **The Shopify Theme Store rewards it directly.** Each preset gets its own theme card and its own dedicated listing page, aligned to a primary industry and catalog size. A single codebase can appear in a merchant's search results under multiple industry categories instead of just one, without maintaining separate codebases.
- **It lowers the barrier for a merchant to say yes.** A furniture retailer browsing the Theme Store is more likely to click a preset literally named and photographed for furniture than to imagine themselves customizing a generic "modern" theme from scratch.
- **It amortizes your design and engineering cost across more customers.** Building "Warehouse" as a second preset of an existing, well-tested theme is far cheaper than building and separately maintaining a second theme from zero, while still letting you target a meaningfully different merchant segment.
- **It reduces post-purchase customization work for merchants**, which reduces support tickets for you. A merchant who starts from a preset already close to what they want customizes less, and customizes with more confidence, than one starting from a blank slate.

The tradeoff is real too: every additional preset is something you test, maintain, and keep in sync every time you change a shared setting (see [Settings Conventions & Best Practices](/config-and-settings/settings-conventions-and-best-practices/)). Don't build a second preset until the first one is finished and the market case for a second is concrete, not hypothetical.

## How the current/default preset actually works

```json
// config/settings_data.json
{
  "current": "Studio",
  "presets": {
    "Studio": {
      "color_primary": "#1a5f4f",
      "type_heading_font": "playfair_display_n4",
      "sections": {
        "main-product": { "type": "main-product", "blocks": { /* ... */ } }
      }
    },
    "Warehouse": {
      "color_primary": "#2b2b2b",
      "type_heading_font": "assistant_n4",
      "sections": {
        "main-product": { "type": "main-product", "blocks": { /* ... */ } }
      }
    }
  }
}
```

`"current"` either names the active preset, or, once a merchant edits anything, holds their own fully custom configuration copied forward from whichever preset they started from. Selecting a preset in the editor updates `"current"` to match that preset's values — but **only for presentational settings** (color, font, and similar style-level types). See [settings_data.json: presentational settings](/config-and-settings/settings-data-json/#what-switching-a-preset-actually-changes-presentational-settings-only) for the full list of which setting types do and don't switch. A preset can also change which sections and blocks appear on the default templates, via its own `"sections"` data, which is what makes two presets feel like genuinely different themes instead of a simple reskin.

## The hard limit: five presets, no more

A theme can't contain more than **five** theme presets total, and `settings_data.json` can't exceed **1.5MB**. Plan a multi-preset strategy around this ceiling from the start — see [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/) for the complete mandatory-vs-optional breakdown, and [settings_data.json: hard limits](/config-and-settings/settings-data-json/#hard-limits-not-just-guidelines) for the file itself.

## Extending a theme to support a new preset, step by step

1. Finish and fully test the "Default" (or your first) preset before building any variation of it. An unfinished base multiplies your work on every preset built from it.
2. Duplicate that preset object in `settings_data.json` under a new name.
3. Change the presentational settings that give this preset its own distinct look: colors, fonts, spacing tokens.
4. If the preset should feel meaningfully different in content or layout, not just style, edit that preset's `"sections"` data too — remember, switching presets alone never touches non-presentational settings like text or images.
5. Build a dedicated demo store for the new preset (see [Store & Design Requirements: demo stores](/theme-store-requirements/store-and-design/#demo-stores)) — every preset needs its own, with realistic content matching that preset's industry.
6. Test the new preset on a completely fresh store install. See the caution below on why this matters.

:::caution[Test every preset on a genuinely fresh install]
It's easy to develop and test only against whichever preset is currently active in your dev store. Before shipping, apply *each* preset on a clean store and click through the main templates. A preset that references a resource that only exists in your dev environment, like a metaobject or a specific product, will break silently on a fresh install. This is exactly the kind of issue [Packaging & Submitting](/publishing/packaging-and-submitting/)'s pre-zip sanity check exists to catch.
:::

## Consistency across templates: not just the homepage

Shopify's own reviewers specifically check that a preset has a cohesive look and feel across *every* template, not just the homepage a merchant sees first in the picker: index, product, collection, blog, search, and cart all need to feel like the same preset. It's easy to polish the index template for a new preset's screenshots and forget that the cart page still shows the old preset's spacing tokens or an unstyled empty state. Walk every template for a new preset before calling it done, the same way you'd walk them for the base theme.

## How theme presets map to a Theme Store submission

Multiple theme presets map directly onto the `/listings` folder structure in your submission zip:

```
/listings
  /studio            ← kebab-case, matches (roughly) the preset name
    /templates
      index.json
  /warehouse
    /templates
      index.json
/templates             ← the base/"Default" preset's templates
```

Only include the files a given preset actually *overrides* in its `/listings/<preset>/` folder, not a full copy of every template. See [Packaging & Submitting](/publishing/packaging-and-submitting/) for the complete packaging workflow — this page covers building the presets correctly before that packaging step, not the zip structure itself.

On the Theme submission form, you enter listing information for the theme *and* for every preset you're publishing. If you add a new preset after your theme is already live, it isn't automatically visible on the Theme Store — you have to edit your theme's listing in the Partner Dashboard and submit the new preset's marketing information (photography, description, industry, catalog size) before it appears to merchants.

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Finish and thoroughly test the first preset before building additional presets as variations of it. | **Assuming switching a preset changes everything**, including content like text and images — it only changes presentational settings unless you also edit `"sections"` data directly. |
| Plan around the hard 5-preset ceiling from the start, not as a late discovery. | **Building a sixth preset** and discovering the 5-preset platform limit only when a submission fails. |
| Only make a preset's section/block arrangement genuinely different when it meaningfully differs — a preset that's identical except for one color isn't worth the extra upkeep. | **Building and testing a second theme preset only in a dev environment** that already has the first preset's resources. A fresh install immediately reveals demo-store assumptions you didn't notice. |
| Walk every template (not just the homepage) for consistency before calling a new preset done. | **Copying every template file into every preset's `/listings` folder** instead of only what that preset actually overrides. |
| Test every theme preset on a genuinely fresh store install before submission, not just whichever preset happens to be active in your dev environment. | **Polishing only the index template** for a new preset's screenshots, and shipping an inconsistent cart or search page underneath it. |
| — | **Forgetting to submit a new preset's listing information** after adding it post-launch, so it never actually appears on the Theme Store despite being in the code. |

## Key takeaways
- Theme presets live in `settings_data.json`'s `"presets"` object; `"current"` tracks which is active (or a merchant's custom edits).
- Hard limit: 5 presets max, 1.5MB file size max.
- A preset switch changes presentational settings only — content settings (text, images, links) need explicit `"sections"` data edits.
- Every preset needs its own demo store, a cohesive look across every template, and its own Theme Store listing information.
- Multiple presets map to `/listings/<preset-name>/` in a Theme Store submission zip, each with its own dedicated listing page.
- Always test every preset on a genuinely fresh store install before shipping.

## Further reading

- [Section Presets](/presets/section-presets/) and [Block Presets](/presets/block-presets/): the other two kinds of preset, at a smaller scope
- [Preset Rules & Theme Store Requirements](/presets/preset-rules-and-theme-store-requirements/): every preset rule, mandatory vs. optional, in one place
- [Real-World Preset Examples](/presets/real-world-preset-examples/): a full worked multi-preset strategy for Solis
- [settings_data.json: Storage & Presets](/config-and-settings/settings-data-json/): the file theme presets live in, and the presentational-settings distinction in full
- [Store & Design Requirements](/theme-store-requirements/store-and-design/): the demo store and design-consistency requirements referenced above
- [Packaging & Submitting](/publishing/packaging-and-submitting/): the `/listings` zip structure for multi-preset submissions
- [Theme store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) (shopify.dev)
