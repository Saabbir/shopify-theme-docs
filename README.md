# Shopify Theme Handbook

The internal knowledge base for scaffolding, developing, and publishing Shopify themes to the Theme Store — currently written for the Solis project, reusable for any future theme.

This repo is the **documentation site only**. It does not contain a Shopify theme's code — see [Getting Started](https://your-deployed-url/getting-started/) for where the actual theme repository lives.

## Stack

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) — a static docs site. Content lives as Markdown in `src/content/docs/`.

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:4321`.

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deploying

Netlify is already configured (`netlify.toml`): build command `npm run build`, publish directory `dist`. Push to your connected branch and Netlify builds automatically.

## Before this goes live — a few placeholders to fill in

- `astro.config.mjs`: `social.github` and `editLink.baseUrl` currently point at placeholder URLs — update both once this repo has a real GitHub remote.
- Any `CLAUDE.md`/Cursor rule/Copilot template under `public/templates/` that says "your-handbook-url" should be updated to this site's real deployed URL once you have one.
- `src/styles/custom.css` sets a placeholder brand accent color — swap the hex values for Solis's actual brand color.

## Structure

```
src/content/docs/    → all handbook content (Markdown)
public/templates/    → downloadable files (Cursor rules, CLAUDE.md, PR template, CI workflow)
src/styles/          → brand/theme overrides for the Starlight UI
astro.config.mjs     → site config + sidebar navigation structure
```

## A note on how this was built

This project's `npm install`/`npm run build` has not been executed in an automated environment — the environment used to write this content had no package registry access. The Astro/Starlight config follows current, standard conventions, but **run `npm install && npm run build` yourself before your first deploy** to confirm everything resolves cleanly, and fix anything version-specific that's drifted since this was written.
