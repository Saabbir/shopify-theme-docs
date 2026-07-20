// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://shopify-theme-handbook.netlify.app',
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
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      sidebar: [
        {
          label: '1. Getting Started',
          items: [
            { label: 'Overview', slug: 'getting-started' },
            { label: 'What This Handbook Covers', slug: 'getting-started/how-to-use-this-handbook' },
            { label: 'Prerequisites & Setup', slug: 'getting-started/prerequisites-and-setup' },
            { label: 'Your First Preview', slug: 'getting-started/first-preview' },
          ],
        },
        {
          label: '2. Theme Store Requirements',
          items: [
            { label: 'Overview', slug: 'theme-store-requirements' },
            { label: 'Store & Design Requirements', slug: 'theme-store-requirements/store-and-design' },
            { label: 'Performance & Lighthouse', slug: 'theme-store-requirements/performance' },
            { label: 'Accessibility (WCAG 2.1 AA)', slug: 'theme-store-requirements/accessibility' },
            { label: 'Internationalization & RTL', slug: 'theme-store-requirements/internationalization-and-rtl' },
            { label: 'App Compatibility (App Blocks)', slug: 'theme-store-requirements/app-compatibility' },
            { label: 'Metafields & Metaobjects', slug: 'theme-store-requirements/metafields' },
            { label: 'Required Templates & Features', slug: 'theme-store-requirements/required-templates-and-features' },
            { label: 'Schema.json Best Practices', slug: 'theme-store-requirements/schema-best-practices' },
          ],
        },
        {
          label: '3. Codebase Structure',
          items: [
            { label: 'Overview', slug: 'codebase-structure' },
            { label: 'Folder Structure', slug: 'codebase-structure/folder-structure' },
            { label: 'Theme Blocks & Nesting', slug: 'codebase-structure/theme-blocks' },
            { label: 'Sections & Section Groups', slug: 'codebase-structure/sections-and-section-groups' },
            { label: 'Snippets & Naming Conventions', slug: 'codebase-structure/snippets-and-naming' },
            { label: 'Modern Shopify Features to Utilize', slug: 'codebase-structure/modern-shopify-features' },
            { label: 'Complete Worked Example', slug: 'codebase-structure/complete-worked-example' },
          ],
        },
        {
          label: '4. Scaffold Setup Guide',
          items: [
            { label: 'Overview', slug: 'scaffold-setup' },
            { label: 'Scaffolding From Horizon', slug: 'scaffold-setup/scaffolding-from-horizon' },
            { label: 'Your First Section & Block', slug: 'scaffold-setup/first-section-and-block' },
            { label: 'Settings Schema Walkthrough', slug: 'scaffold-setup/settings-schema-walkthrough' },
          ],
        },
        {
          label: '5. Design System & Configuration',
          items: [
            { label: 'Overview', slug: 'design-system' },
            { label: 'Figma Tokens → Theme Settings', slug: 'design-system/figma-tokens-to-theme' },
            { label: 'Design Tokens, Color & Type System', slug: 'design-system/design-tokens-color-type-system' },
            { label: 'Color Palettes', slug: 'design-system/color-palettes' },
            { label: 'settings_schema.json & settings_data.json', slug: 'design-system/settings-schema-and-data' },
            { label: 'Managing Presets (Sections & Themes)', slug: 'design-system/managing-presets' },
            { label: 'Icon Management', slug: 'design-system/icon-management' },
          ],
        },
        {
          label: '6. Style Guides',
          items: [
            { label: 'Overview', slug: 'style-guides' },
            { label: 'CSS Style Guide', slug: 'style-guides/css' },
            { label: 'JavaScript & Web Components', slug: 'style-guides/javascript-and-web-components' },
            { label: 'Web Components Guideline', slug: 'style-guides/web-components' },
            { label: 'Liquid Style Guide', slug: 'style-guides/liquid' },
            { label: 'Clean Code Principles', slug: 'style-guides/clean-code-principles' },
            { label: 'Third-Party Libraries', slug: 'style-guides/third-party-libraries' },
            { label: 'Theme Editor & Storefront Events', slug: 'style-guides/theme-editor-events' },
          ],
        },
        {
          label: '7. Performance & Accessibility',
          items: [
            { label: 'Overview', slug: 'performance-and-accessibility' },
            { label: 'Accessibility Deep Dive', slug: 'performance-and-accessibility/accessibility-deep-dive' },
            { label: 'Performance Strategy & Critical Rendering Path', slug: 'performance-and-accessibility/performance-strategy' },
            { label: 'Media Optimization: Images, Video & 3D', slug: 'performance-and-accessibility/media-optimization' },
          ],
        },
        {
          label: '8. AI-Assisted Development',
          items: [
            { label: 'Overview', slug: 'ai-assisted-development' },
            { label: '8a. AI Coding Concepts (Agents, MCP, Skills, Commands, Plugins)', slug: 'ai-assisted-development/ai-coding-concepts' },
            { label: '8b. Setting Up AI Rules (AGENTS.md)', slug: 'ai-assisted-development/setting-up-ai-rules' },
            { label: '8c. Managing & Amending AI Rules', slug: 'ai-assisted-development/managing-ai-rules' },
            { label: "8d. Shopify's Official AI Toolkit", slug: 'ai-assisted-development/shopify-ai-toolkit' },
            { label: '8e. Figma MCP & Dev Mode', slug: 'ai-assisted-development/figma-mcp-and-dev-mode' },
            { label: '8f. Figma to Code Workflow', slug: 'ai-assisted-development/figma-to-code-workflow' },
            { label: '8g. Claude Code Custom Commands', slug: 'ai-assisted-development/claude-code-custom-commands' },
            { label: '8h. Claude Code Subagents', slug: 'ai-assisted-development/claude-code-subagents' },
            { label: '8i. Writing Prompts That Work', slug: 'ai-assisted-development/writing-prompts-that-work' },
          ],
        },
        {
          label: '9. GitHub Workflow',
          items: [
            { label: 'Overview', slug: 'github-workflow' },
            { label: 'Branching & Commits', slug: 'github-workflow/branching-and-commits' },
            { label: 'Pull Requests & Review', slug: 'github-workflow/pull-requests-and-review' },
            { label: 'CI Automation', slug: 'github-workflow/ci-automation' },
          ],
        },
        {
          label: '10. Quality & Validation',
          items: [
            { label: 'Overview', slug: 'quality-validation' },
            { label: 'Theme Check & Linting', slug: 'quality-validation/theme-check-and-linting' },
            { label: 'Manual QA Checklist', slug: 'quality-validation/manual-qa-checklist' },
            { label: 'Pre-Submission Checklist', slug: 'quality-validation/pre-submission-checklist' },
          ],
        },
        {
          label: '11. Publishing to Theme Store',
          items: [
            { label: 'Overview', slug: 'publishing' },
            { label: 'Partner Dashboard Setup', slug: 'publishing/partner-dashboard-setup' },
            { label: 'Store Setup for Submission', slug: 'publishing/store-setup-for-submission' },
            { label: 'Packaging & Submitting', slug: 'publishing/packaging-and-submitting' },
            { label: 'Review Process & Rejections', slug: 'publishing/review-process-and-rejections' },
            { label: 'After Approval', slug: 'publishing/after-approval' },
          ],
        },
        {
          label: '12. Tooling & Config',
          items: [
            { label: 'Overview', slug: 'tooling-config' },
            { label: 'Project Files Explained', slug: 'tooling-config/project-files' },
            { label: 'Packaging: Theme Store-Only Directories', slug: 'tooling-config/packaging-exclusions' },
            { label: 'Tailwind CSS & Alpine.js Build Setup', slug: 'tooling-config/tailwind-and-alpine-build-setup' },
          ],
        },
        {
          label: '13. Learning Articles',
          items: [
            { label: 'Overview', slug: 'learning-articles' },
            { label: 'CSS Deep Dive', slug: 'learning-articles/css-deep-dive' },
            { label: 'JavaScript & Web Components Deep Dive', slug: 'learning-articles/javascript-and-web-components-deep-dive' },
            { label: 'Liquid Global Objects Reference', slug: 'learning-articles/liquid-global-objects' },
            { label: 'Managing Locale Files', slug: 'learning-articles/managing-locale-files' },
            { label: 'Writing Maintainable Code at Scale', slug: 'learning-articles/writing-maintainable-code-at-scale' },
          ],
        },
        {
          label: '14. Reference',
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: 'Cheatsheet', slug: 'reference/cheatsheet' },
            { label: 'Glossary', slug: 'reference/glossary' },
            { label: 'Tools Directory', slug: 'reference/tools-directory' },
          ],
        },
      ],
    }),
  ],
});
