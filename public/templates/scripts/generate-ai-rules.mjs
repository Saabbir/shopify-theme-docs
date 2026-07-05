#!/usr/bin/env node
/**
 * generate-ai-rules.mjs
 *
 * Regenerates the tool-specific AI rule files from the single source of
 * truth, AGENTS.md. Run this after every edit to AGENTS.md:
 *
 *   node scripts/generate-ai-rules.mjs
 *
 * Generated (do not hand-edit these — edit AGENTS.md instead):
 *   .cursor/rules/00-project-context.mdc   (scope: core, always applies)
 *   .cursor/rules/01-liquid-and-schema.mdc (scope: liquid, loads on .liquid files)
 *   .cursor/rules/02-css-and-js.mdc        (scope: css-js, loads on .css/.js/.liquid files)
 *   .cursorrules                           (legacy, flattened, all scopes)
 *   .github/copilot-instructions.md        (flattened, all scopes)
 *
 * NOT generated:
 *   CLAUDE.md — Claude Code supports @-imports natively, so CLAUDE.md is a
 *   short static file that imports AGENTS.md directly (`@AGENTS.md`). There
 *   is nothing to regenerate there. See the CLAUDE.md template.
 *
 * Zero dependencies — plain Node.js (v18+), works with `node` directly.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SOURCE = 'AGENTS.md';
const BANNER = (target) => `<!--
  GENERATED FILE — DO NOT EDIT DIRECTLY.
  Source of truth: ${SOURCE}
  Regenerate with: node scripts/generate-ai-rules.mjs
-->

`;

/**
 * Parse AGENTS.md into { scope, heading, body }[] sections, split on H2 (##).
 *
 * Scope markers (`<!-- scope: core|liquid|css-js -->`) are expected on their
 * own line immediately BEFORE the heading they apply to — not after it — so
 * we track a "pending" scope and attach it to whichever heading comes next.
 */
function parseSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;
  let pendingScope = null;

  for (const line of lines) {
    const scopeMatch = line.match(/^<!--\s*scope:\s*([\w-]+)\s*-->/);
    if (scopeMatch) {
      pendingScope = scopeMatch[1];
      continue; // marker line itself is never included in output
    }

    const headingMatch = line.match(/^##\s+(.*)/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[1].trim(), scope: pendingScope || 'core', body: [] };
      pendingScope = null;
      continue;
    }

    if (current) current.body.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

function renderSections(sections, { includeHeadings = true } = {}) {
  return sections
    .map((s) => {
      const body = s.body.join('\n').trim();
      return includeHeadings ? `## ${s.heading}\n\n${body}` : body;
    })
    .join('\n\n')
    .trim();
}

function writeFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log(`  wrote ${path}`);
}

const source = readFileSync(SOURCE, 'utf8');
const sections = parseSections(source);

const core = sections.filter((s) => s.scope === 'core');
const liquid = sections.filter((s) => s.scope === 'liquid');
const cssJs = sections.filter((s) => s.scope === 'css-js');

// .cursor/rules/00-project-context.mdc — always-applies core rules
writeFile(
  '.cursor/rules/00-project-context.mdc',
  `---
description: Project context and non-negotiable constraints (generated from AGENTS.md)
alwaysApply: true
---

${BANNER('.cursor/rules/00-project-context.mdc')}${renderSections(core)}\n`
);

// .cursor/rules/01-liquid-and-schema.mdc — loads on .liquid files
writeFile(
  '.cursor/rules/01-liquid-and-schema.mdc',
  `---
description: Liquid, section, and block schema conventions (generated from AGENTS.md)
globs: ["**/*.liquid"]
alwaysApply: false
---

${BANNER('.cursor/rules/01-liquid-and-schema.mdc')}${renderSections(liquid)}\n`
);

// .cursor/rules/02-css-and-js.mdc — loads on CSS/JS/Liquid files
writeFile(
  '.cursor/rules/02-css-and-js.mdc',
  `---
description: CSS and JavaScript conventions (generated from AGENTS.md)
globs: ["**/*.css", "**/*.js", "**/*.liquid"]
alwaysApply: false
---

${BANNER('.cursor/rules/02-css-and-js.mdc')}${renderSections(cssJs)}\n`
);

// .cursorrules — legacy single-file fallback, everything flattened
writeFile(
  '.cursorrules',
  BANNER('.cursorrules') + renderSections([...core, ...liquid, ...cssJs])
);

// .github/copilot-instructions.md — Copilot has no scoped auto-attach, so
// it gets everything, flattened, with the applyTo front matter covering
// every file type any scope cares about.
writeFile(
  '.github/copilot-instructions.md',
  `---
applyTo: "**/*.liquid,**/*.css,**/*.js,**/*.json"
---

${BANNER('.github/copilot-instructions.md')}${renderSections([...core, ...liquid, ...cssJs])}\n`
);

console.log(`\nDone. Regenerated 5 files from ${SOURCE}.`);
console.log('CLAUDE.md was not touched — it imports AGENTS.md directly via `@AGENTS.md`.');
