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

### A worked example: classifying a real Solis change

Say you're shipping three changes together: (1) a new "Testimonials" section, (2) a renamed setting ID in the header, and (3) a typo fix in a locale string.

| Change | Classification | Why |
|---|---|---|
| New Testimonials section | Minor (`Y`) | Additive, backwards-compatible |
| Renamed header setting ID | Major (`X`) | Invalidates existing merchant configuration for that setting |
| Locale string typo fix | Patch (`Z`) | Non-visual, no schema impact |

The overall release version is determined by the **highest-impact** change in it — this release would be a major bump (`X`), because the renamed setting ID forces that classification regardless of the other two changes being smaller. This is exactly why batching a breaking change together with unrelated smaller changes is worth thinking about — see "manual vs. automated updates" below.

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

| ✅ Good release note | ❌ Weak release note |
|---|---|
| "Removed the Instagram section (API deprecated, no replacement — switch to an app for an Instagram feed)" | "Removed unused code" |
| "Important: Changed default social sharing image" | "Updated stuff" |
| "Fixed a layout issue on the collection page sidebar" | "Bug fixes" |

Release notes are for merchants, so avoid developer-facing language ("refactored," "deprecated internal API") — describe the user-facing impact instead.

## Manual vs. automated updates

- **Automated**: applies silently to a merchant's live theme. Only happens if nothing but `settings_data.json`/template JSON was customized, and your update doesn't touch settings IDs/types/limits.
- **Manual**: installed as a new unpublished theme in the merchant's library for them to review before publishing. Triggered by anything that could invalidate their current configuration — a changed/removed setting ID or type, a tightened `range` min/max, or a removed section/block.

Group your changes by type where possible — automated updates are friendlier to merchants, so batch anything that would force a manual update rather than scattering it across releases.

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

Shopify blocks submissions that: reduce a section's instance `limit`, reduce a block limit, add `disabled_on`/`enabled_on` restrictions to section groups, or add new template restrictions to existing sections. These break merchants who already customized their store on the assumption those limits wouldn't shrink.

## Update cadence

Minimum **4 weeks** between updates — except your first two months, when you can update every 2 weeks. This exists to avoid "update fatigue" for merchants; don't plan a rapid post-launch iteration cadence assuming you can ship whenever you want.

## Best practices

- Classify every change by its actual impact (major/minor/patch) as you build it, not retroactively at release time — it's easier to batch breaking changes deliberately when you've been tracking them as you go.
- Write release notes from the merchant's point of view as you make each change, rather than reconstructing "what changed" from Git history right before a release.
- Plan your update cadence around the 4-week (or 2-week, early on) minimum from the start — don't discover it only after wanting to ship an urgent fix on day 10.

## Common mistakes

- **Shipping several small breaking changes across several releases** instead of batching them, forcing merchants through repeated manual-update reviews.
- **Writing release notes in developer language** ("refactored the cart total calculation") instead of merchant-facing impact ("fixed an issue where the cart total didn't update immediately").
- **Reducing a section/block limit** in an update, not realizing this specifically blocks the update from being accepted.

## Quick Reference

- Semver: `X.Y.Z` — major (breaking), minor (compatible addition), patch (fix). The highest-impact change in a release determines its version bump.
- `release-notes.md` required from your first update onward, written for merchants.
- Automated updates are friendlier — batch schema-breaking changes together instead of scattering them.
- 4-week minimum gap between updates (2 weeks for your first two months).

## Further Reading

- [Updating your theme](https://shopify.dev/docs/storefronts/themes/store/success/updates) — shopify.dev
