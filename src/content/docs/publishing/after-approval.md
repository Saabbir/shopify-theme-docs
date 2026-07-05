---
title: After Approval
description: Versioning, release notes, and the update cadence you're committing to.
---

Getting approved starts an ongoing obligation, not a one-time achievement — Theme Partners are required to keep updating and supporting the theme.

## Versioning (semantic versioning, `X.Y.Z`)

| Segment | Bump when | Example |
|---|---|---|
| `X` (major) | Breaking change — a setting's value/meaning changes, a setting/section/block is removed, a new global setting is added | `1.4.8` → `2.0.0` |
| `Y` (minor) | Backwards-compatible addition — a new section/block, a changed default value or label, a visual/behavior change with no schema change | `1.4.8` → `1.5.0` |
| `Z` (patch) | Bug fixes, security fixes, non-visual code cleanup | `1.4.8` → `1.4.9` |

## Release notes (`release-notes.md`)

Required starting with your **first post-launch update** (exclude it from your initial submission). Written for merchants, not developers — a curated summary, not a raw changelog.

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

Prefix a bullet with `Important:` to have it visually highlighted for merchants.

## Manual vs. automated updates

- **Automated**: applies silently to a merchant's live theme. Only happens if nothing but `settings_data.json`/template JSON was customized, and your update doesn't touch settings IDs/types/limits.
- **Manual**: installed as a new unpublished theme in the merchant's library for them to review before publishing. Triggered by anything that could invalidate their current configuration — a changed/removed setting ID or type, a tightened `range` min/max, or a removed section/block.

Group your changes by type where possible — automated updates are friendlier to merchants, so batch anything that would force a manual update rather than scattering it across releases.

## What you can never do in an update

Shopify blocks submissions that: reduce a section's instance `limit`, reduce a block limit, add `disabled_on`/`enabled_on` restrictions to section groups, or add new template restrictions to existing sections. These break merchants who already customized their store on the assumption those limits wouldn't shrink.

## Update cadence

Minimum **4 weeks** between updates — except your first two months, when you can update every 2 weeks. This exists to avoid "update fatigue" for merchants; don't plan a rapid post-launch iteration cadence assuming you can ship whenever you want.

## Quick Reference

- Semver: `X.Y.Z` — major (breaking), minor (compatible addition), patch (fix).
- `release-notes.md` required from your first update onward, written for merchants.
- Automated updates are friendlier — batch schema-breaking changes together instead of scattering them.
- 4-week minimum gap between updates (2 weeks for your first two months).

## Further Reading

- [Updating your theme](https://shopify.dev/docs/storefronts/themes/store/success/updates) — shopify.dev
