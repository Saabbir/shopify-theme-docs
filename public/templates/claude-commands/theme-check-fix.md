---
description: Run theme check and fix every offense it reports, explaining each fix
allowed-tools: Read, Edit, Bash(shopify theme check:*)
---

Run `shopify theme check` in this repository.

For every offense reported:

1. Open the file and line it points to.
2. Fix it in a way consistent with this repo's conventions (see `AGENTS.md`) — not just whatever silences the specific rule.
3. Note the fix in a running list: file, offense, one-line description of the fix.

After all offenses are resolved, run `shopify theme check` again to confirm a clean pass, then report the final list of fixes made. If any offense can't be safely auto-fixed (for example, it depends on a product decision — should this be a setting or stay hardcoded?), stop and ask instead of guessing.
