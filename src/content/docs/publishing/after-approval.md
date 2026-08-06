---
title: After Approval
description: How to version your theme, write release notes, and follow the update schedule you're committing to.
---

**TL;DR:** How to version your theme, write release notes, and follow the update schedule you're committing to.

Getting approved is not the end of the work. It's the start of an ongoing commitment. Shopify requires Theme Partners (that's you, as the theme's developer) to keep updating and supporting their theme after it's live.

## Versioning (semantic versioning, `X.Y.Z`)

Every version has three parts, written as `X.Y.Z`. Here's what each part means:

| Segment | Bump when | Example |
|---|---|---|
| `X` (major) | A breaking change: a setting's value or meaning changes, a setting, section, or block is removed, or a new global setting is added | `1.4.8` → `2.0.0` |
| `Y` (minor) | A backwards-compatible addition: a new section or block, a changed default value or label, or a visual or behavior change that doesn't touch the schema | `1.4.8` → `1.5.0` |
| `Z` (patch) | Bug fixes, security fixes, or code cleanup that doesn't change how anything looks or works | `1.4.8` → `1.4.9` |

### A worked example: classifying a real Solis change

Say you're shipping three changes together: a new "Testimonials" section, a renamed setting ID in the header, and a typo fix in a locale string.

| Change | Classification | Why |
|---|---|---|
| New Testimonials section | Minor (`Y`) | It's additive and backwards-compatible |
| Renamed header setting ID | Major (`X`) | It breaks any merchant's existing configuration for that setting |
| Locale string typo fix | Patch (`Z`) | It's non-visual and doesn't touch the schema |

The release version always matches the **highest-impact** change inside it. In this example, the whole release becomes a major bump (`X`), because the renamed setting ID forces that classification, even though the other two changes are much smaller on their own. This is why it pays to think carefully before you bundle a breaking change together with smaller, unrelated changes. See "Manual vs. automated updates" below for more on why that matters.

## Release notes (`release-notes.md`)

You need this file starting with your **first post-launch update**. Leave it out of your first submission entirely. Write it for merchants, not developers: keep it short, and focus on what changed for them, not a raw list of every code change.

```markdown
We've added Shop Pay Installments, removed the Instagram section, and
changed how the social media section works.

### Added
- Important: Added search faceted filtering

### Changed
- Important: Changed default social sharing image

### Removed
- Removed the Instagram section (API deprecated, no replacement — switch
  to an app for an Instagram feed)

### Security
- Fixed security issues

### Fixes and other improvements
- Fixed a layout issue on the collection page sidebar
```

Start a bullet with `Important:` to make it stand out visually for merchants.

| ✅ Good release note | ❌ Weak release note |
|---|---|
| "Removed the Instagram section (the API it relied on is gone, and there's no replacement, so switch to an app for an Instagram feed)" | "Removed unused code" |
| "Important: Changed default social sharing image" | "Updated stuff" |
| "Fixed a layout issue on the collection page sidebar" | "Bug fixes" |

Release notes are for merchants. Avoid developer language like "refactored" or "deprecated internal API." Describe what actually changed for the merchant instead.

## Manual vs. automated updates

- **Automated**: the update applies quietly to a merchant's live theme, with no action needed from them. This only happens if the merchant has only customized `settings_data.json` or template JSON files, and your update doesn't change any setting IDs, types, or limits.
- **Manual**: the update installs as a new, unpublished theme in the merchant's library, and they have to review it before publishing it. This happens whenever something could break their current setup, for example a changed or removed setting ID or type, a tightened `range` minimum or maximum, or a removed section or block.

Group your changes by type whenever you can. Automated updates are easier on merchants, so try to batch anything that would force a manual update, instead of spreading it across several releases.

```text
❌ WRONG — three separate releases, each forcing a manual update on
merchants, when they could have been one:
  Release 1.1.0: rename a setting ID (forces manual update)
  Release 1.2.0: rename another setting ID (forces manual update, again)
  Release 1.3.0: rename a third setting ID (forces manual update, again)

✅ RIGHT — batch all three breaking renames into one release, so
merchants deal with one manual-update review instead of three:
  Release 2.0.0: rename all three setting IDs together
```

## What you can never do in an update

Shopify blocks submissions that do any of the following: reduce a section's instance `limit` (how many times a merchant can add that section to a page), reduce a block limit, add `disabled_on` or `enabled_on` restrictions to section groups, or add new template restrictions to existing sections. These changes would break merchants who already set up their store, since they built it assuming those limits wouldn't shrink.

## Update cadence

You must wait at least **4 weeks** between updates. The one exception is your first two months, when you can update every 2 weeks instead. This rule exists to prevent merchant "update fatigue." Don't plan a fast, rapid-fire release schedule after launch assuming you can ship whenever you want.

## Best practices

- Classify every change by its real impact (major, minor, or patch) as you build it, not after the fact at release time. It's easier to batch breaking changes on purpose when you've been tracking them as you go.
- Write release notes from the merchant's point of view as you make each change, instead of trying to piece together "what changed" from Git history right before a release.
- Plan your update schedule around the 4-week minimum (or 2-week, early on) from the start. Don't find out about this rule only when you want to ship an urgent fix on day 10.

## Common mistakes

- **Shipping several small breaking changes across several releases** instead of batching them together, forcing merchants through repeated manual-update reviews.
- **Writing release notes in developer language**, like "refactored the cart total calculation," instead of describing the impact for merchants, like "fixed an issue where the cart total didn't update immediately."
- **Reducing a section or block limit** in an update, without realizing this alone will get the update rejected.

## Key Takeaways
- Semantic versioning uses `X.Y.Z`: major (breaking change), minor (compatible addition), patch (fix). The highest-impact change in a release sets the version bump.
- `release-notes.md` is required starting with your first update, and it should be written for merchants.
- Automated updates are easier on merchants. Batch schema-breaking changes together instead of spreading them out.
- There's a 4-week minimum gap between updates (2 weeks for your first two months).

## Further Reading

- [Updating your theme](https://shopify.dev/docs/storefronts/themes/store/success/updates) (shopify.dev)
