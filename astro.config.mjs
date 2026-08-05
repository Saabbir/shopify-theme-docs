// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://shopify-theme-handbook.netlify.app',
  markdown: {
    // Every external link (http/https) in the docs opens in a new tab.
    // rel: noopener/noreferrer prevents the new tab from getting a handle
    // back to this page via window.opener (a known security/perf risk of
    // target="_blank"). Internal links (/like/this/) are untouched.
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'Shopify Theme Handbook',
      description:
        'The internal handbook for scaffolding, developing, and publishing Shopify Theme Store themes — built for Horizon.',
      favicon: '/favicon.svg',
      head: [
        // ICO fallback for browsers that don't support SVG favicons (e.g. Safari).
        {
          tag: 'link',
          attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        },
        // Explicit PNG fallbacks.
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        },
        // iOS/iPadOS home screen bookmark icon.
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        },
        // Makes GFM task-list checkboxes clickable, adds strikethrough + a
        // per-list progress bar. See public/scripts/checklist.js.
        {
          tag: 'script',
          attrs: { src: '/scripts/checklist.js', defer: true },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        // Adds the current section name to the document <title> (browser
        // tab / bookmark name) without touching the on-page H1. See
        // src/components/Head.astro for why.
        Head: './src/components/Head.astro',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: '1. Getting Started',
          items: [
            { label: 'Overview', slug: 'getting-started' },
            { label: '1.1. What This Handbook Covers', slug: 'getting-started/how-to-use-this-handbook' },
            { label: '1.2. Prerequisites & Setup', slug: 'getting-started/prerequisites-and-setup' },
            { label: '1.3. Your First Preview', slug: 'getting-started/first-preview' },
          ],
        },
        {
          label: '2. Theme Store Requirements',
          items: [
            { label: 'Overview', slug: 'theme-store-requirements' },
            { label: '2.1. Store & Design Requirements', slug: 'theme-store-requirements/store-and-design' },
            { label: '2.2. Performance & Lighthouse', slug: 'theme-store-requirements/performance' },
            { label: '2.3. Accessibility (WCAG 2.1 AA)', slug: 'theme-store-requirements/accessibility' },
            { label: '2.4. Internationalization & RTL', slug: 'theme-store-requirements/internationalization-and-rtl' },
            { label: '2.5. App Compatibility (App Blocks)', slug: 'theme-store-requirements/app-compatibility' },
            { label: '2.6. Metafields & Metaobjects', slug: 'theme-store-requirements/metafields' },
            { label: '2.7. Required Templates & Features', slug: 'theme-store-requirements/required-templates-and-features' },
            { label: '2.8. Schema.json Best Practices', slug: 'theme-store-requirements/schema-best-practices' },
          ],
        },
        {
          label: '3. Codebase Structure',
          items: [
            { label: 'Overview', slug: 'codebase-structure' },
            { label: '3.1. Folder Structure', slug: 'codebase-structure/folder-structure' },
            { label: '3.2. Theme Blocks & Nesting', slug: 'codebase-structure/theme-blocks' },
            { label: '3.3. Sections & Section Groups', slug: 'codebase-structure/sections-and-section-groups' },
            { label: '3.4. Snippets & Naming Conventions', slug: 'codebase-structure/snippets-and-naming' },
            { label: '3.5. Modern Shopify Features to Utilize', slug: 'codebase-structure/modern-shopify-features' },
            { label: '3.6. Complete Worked Example', slug: 'codebase-structure/complete-worked-example' },
          ],
        },
        {
          label: '4. Scaffold Setup Guide',
          items: [
            { label: 'Overview', slug: 'scaffold-setup' },
            { label: '4.1. Scaffolding From Horizon', slug: 'scaffold-setup/scaffolding-from-horizon' },
            { label: '4.2. Your First Section & Block', slug: 'scaffold-setup/first-section-and-block' },
            { label: '4.3. Settings Schema Walkthrough', slug: 'scaffold-setup/settings-schema-walkthrough' },
          ],
        },
        {
          label: '5. Design System & Configuration',
          items: [
            { label: 'Overview', slug: 'design-system' },
            { label: '5.1. Figma Tokens → Theme Settings', slug: 'design-system/figma-tokens-to-theme' },
            { label: '5.2. Design Tokens, Color & Type System', slug: 'design-system/design-tokens-color-type-system' },
            { label: '5.3. Color Palettes', slug: 'design-system/color-palettes' },
            { label: '5.4. settings_schema.json & settings_data.json', slug: 'design-system/settings-schema-and-data' },
            { label: '5.5. Managing Presets (Sections & Themes)', slug: 'design-system/managing-presets' },
            { label: '5.6. Icon Management', slug: 'design-system/icon-management' },
          ],
        },
        {
          label: '6. Style Guides',
          items: [
            { label: 'Overview', slug: 'style-guides' },
            { label: '6.1. CSS Style Guide', slug: 'style-guides/css' },
            { label: '6.2. JavaScript & Web Components', slug: 'style-guides/javascript-and-web-components' },
            { label: '6.3. Web Components Guideline', slug: 'style-guides/web-components' },
            { label: '6.4. Liquid Style Guide', slug: 'style-guides/liquid' },
            { label: '6.5. Clean Code Principles', slug: 'style-guides/clean-code-principles' },
            { label: '6.6. Third-Party Libraries', slug: 'style-guides/third-party-libraries' },
            { label: '6.7. Theme Editor & Storefront Events', slug: 'style-guides/theme-editor-events' },
          ],
        },
        {
          label: '7. Performance & Accessibility',
          items: [
            { label: 'Overview', slug: 'performance-and-accessibility' },
            { label: '7.1. Accessibility Deep Dive', slug: 'performance-and-accessibility/accessibility-deep-dive' },
            { label: '7.2. Performance Strategy & Critical Rendering Path', slug: 'performance-and-accessibility/performance-strategy' },
            { label: '7.3. Media Optimization: Images, Video & 3D', slug: 'performance-and-accessibility/media-optimization' },
          ],
        },
        {
          label: '8. AI-Assisted Development',
          items: [
            { label: 'Overview', slug: 'ai-assisted-development' },
            { label: '8.1. AI Coding Concepts (Agents, MCP, Skills, Commands, Plugins)', slug: 'ai-assisted-development/ai-coding-concepts' },
            { label: '8.2. Setting Up AI Rules (AGENTS.md)', slug: 'ai-assisted-development/setting-up-ai-rules' },
            { label: '8.3. Managing & Amending AI Rules', slug: 'ai-assisted-development/managing-ai-rules' },
            { label: "8.4. Shopify's Official AI Toolkit", slug: 'ai-assisted-development/shopify-ai-toolkit' },
            { label: '8.5. Figma MCP & Dev Mode', slug: 'ai-assisted-development/figma-mcp-and-dev-mode' },
            { label: '8.6. Figma to Code Workflow', slug: 'ai-assisted-development/figma-to-code-workflow' },
            { label: '8.7. Claude Code Custom Commands', slug: 'ai-assisted-development/claude-code-custom-commands' },
            { label: '8.8. Claude Code Subagents', slug: 'ai-assisted-development/claude-code-subagents' },
            { label: '8.9. Writing Prompts That Work', slug: 'ai-assisted-development/writing-prompts-that-work' },
          ],
        },
        {
          label: '9. GitHub Workflow',
          items: [
            { label: 'Overview', slug: 'github-workflow' },
            { label: '9.1. Branching & Commits', slug: 'github-workflow/branching-and-commits' },
            { label: '9.2. Pull Requests & Review', slug: 'github-workflow/pull-requests-and-review' },
            { label: '9.3. CI Automation', slug: 'github-workflow/ci-automation' },
          ],
        },
        {
          label: '10. Quality & Validation',
          items: [
            { label: 'Overview', slug: 'quality-validation' },
            { label: '10.1. Theme Check & Linting', slug: 'quality-validation/theme-check-and-linting' },
            { label: '10.2. Manual QA Checklist', slug: 'quality-validation/manual-qa-checklist' },
            { label: '10.3. Pre-Submission Checklist', slug: 'quality-validation/pre-submission-checklist' },
          ],
        },
        {
          label: '11. Publishing to Theme Store',
          items: [
            { label: 'Overview', slug: 'publishing' },
            { label: '11.1. Partner Dashboard Setup', slug: 'publishing/partner-dashboard-setup' },
            { label: '11.2. Store Setup for Submission', slug: 'publishing/store-setup-for-submission' },
            { label: '11.3. Packaging & Submitting', slug: 'publishing/packaging-and-submitting' },
            { label: '11.4. Review Process & Rejections', slug: 'publishing/review-process-and-rejections' },
            { label: '11.5. After Approval', slug: 'publishing/after-approval' },
          ],
        },
        {
          label: '12. Tooling & Config',
          items: [
            { label: 'Overview', slug: 'tooling-config' },
            { label: '12.1. Project Files Explained', slug: 'tooling-config/project-files' },
            { label: '12.2. Packaging: Theme Store-Only Directories', slug: 'tooling-config/packaging-exclusions' },
            { label: '12.3. Tailwind CSS & Alpine.js Build Setup', slug: 'tooling-config/tailwind-and-alpine-build-setup' },
          ],
        },
        {
          label: '13. Learning Articles',
          items: [
            { label: 'Overview', slug: 'learning-articles' },
            { label: '13.1. CSS Deep Dive', slug: 'learning-articles/css-deep-dive' },
            { label: '13.2. JavaScript & Web Components Deep Dive', slug: 'learning-articles/javascript-and-web-components-deep-dive' },
            { label: '13.3. Liquid Global Objects Reference', slug: 'learning-articles/liquid-global-objects' },
            { label: '13.4. Managing Locale Files', slug: 'learning-articles/managing-locale-files' },
            { label: '13.5. Writing Maintainable Code at Scale', slug: 'learning-articles/writing-maintainable-code-at-scale' },
          ],
        },
        {
          label: '14. Reference',
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: '14.1. Cheatsheet', slug: 'reference/cheatsheet' },
            { label: '14.2. Glossary', slug: 'reference/glossary' },
            { label: '14.3. Tools Directory', slug: 'reference/tools-directory' },
          ],
        },
      ],
    }),
  ],
});
