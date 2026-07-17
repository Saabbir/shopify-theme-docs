#!/usr/bin/env node
/**
 * generate-ai-rules.mjs
 *
 * Links CLAUDE.md and .github/copilot-instructions.md to AGENTS.md, so all
 * three are always byte-identical with zero regeneration step needed after
 * an AGENTS.md edit. This mirrors exactly what `shopify theme init` does
 * when AI agent support is selected during scaffolding — if your repo was
 * scaffolded that way, these links may already exist and this script is
 * only needed if you're setting them up by hand (e.g. on a repo created
 * before choosing AI agent support, or restoring a link that got broken).
 *
 * Run once:
 *
 *   node scripts/generate-ai-rules.mjs
 *
 * Safe to re-run any time — it only touches CLAUDE.md and
 * .github/copilot-instructions.md, never AGENTS.md itself.
 *
 * Symlinks are preferred (matches Shopify's own scaffold exactly). On a
 * system/filesystem where symlink creation fails (some Windows setups
 * without Developer Mode or admin rights), this falls back to a plain
 * file copy and prints a warning — a copy still works, but you'd need to
 * re-run this script after every AGENTS.md edit to keep it in sync,
 * unlike a symlink which never goes stale.
 *
 * Cursor needs nothing generated here — current Cursor versions read
 * AGENTS.md natively from the repo root. See the handbook's
 * "Setting Up AI Rules" page for the optional, legacy .cursor/rules/*.mdc
 * approach if you specifically want Cursor's per-file-type auto-attach.
 *
 * Zero dependencies — plain Node.js (v18+).
 */

import { existsSync, lstatSync, unlinkSync, symlinkSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, relative } from 'node:path';

const SOURCE = 'AGENTS.md';
const LINKS = ['CLAUDE.md', '.github/copilot-instructions.md'];

if (!existsSync(SOURCE)) {
  console.error(`✗ ${SOURCE} not found in the current directory. Run this from your theme's repo root.`);
  process.exit(1);
}

for (const target of LINKS) {
  mkdirSync(dirname(target), { recursive: true });

  if (existsSync(target) || lstatSync_safe(target)) {
    unlinkSync(target);
  }

  const relativeSource = relative(dirname(target), SOURCE);

  try {
    symlinkSync(relativeSource, target);
    console.log(`  linked ${target} -> ${SOURCE}`);
  } catch (err) {
    // Fallback: a plain copy. Works everywhere, but goes stale on the
    // next AGENTS.md edit unless this script is re-run.
    copyFileSync(SOURCE, target);
    console.warn(`  ! could not create a symlink for ${target} (${err.code || err.message}) — copied instead.`);
    console.warn(`    Re-run this script after every AGENTS.md edit to keep ${target} in sync.`);
  }
}

console.log('\nDone. CLAUDE.md and .github/copilot-instructions.md now mirror AGENTS.md.');

function lstatSync_safe(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}
