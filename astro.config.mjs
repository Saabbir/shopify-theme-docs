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
            { label: '1.3. Editor & Formatting Setup', slug: 'getting-started/editor-and-formatting-setup' },
            { label: '1.4. Setting Up AI Rules (AGENTS.md)', slug: 'getting-started/setting-up-ai-rules' },
            { label: '1.5. Branching & Commits', slug: 'getting-started/branching-and-commits' },
            { label: '1.6. Your First Preview', slug: 'getting-started/first-preview' },
          ],
        },
        {
          label: '2. Theme Store Requirements',
          items: [
            { label: 'Overview', slug: 'theme-store-requirements' },
            { label: '2.1. Store & Design Requirements', slug: 'theme-store-requirements/store-and-design' },
            { label: '2.2. Performance & Lighthouse', slug: 'theme-store-requirements/performance' },
            { label: '2.3. Accessibility (WCAG 2.1 AA)', slug: 'theme-store-requirements/accessibility' },
            { label: '2.4. App Compatibility (App Blocks)', slug: 'theme-store-requirements/app-compatibility' },
            { label: '2.5. Metafields & Metaobjects', slug: 'theme-store-requirements/metafields' },
            { label: '2.6. Required Templates & Features', slug: 'theme-store-requirements/required-templates-and-features' },
            { label: '2.7. Schema.json Best Practices', slug: 'theme-store-requirements/schema-best-practices' },
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
            { label: '5.2. Design Tokens: The Three-Tier Model', slug: 'design-system/design-tokens-color-type-system' },
          ],
        },
        {
          label: '6. Config & Global Settings',
          items: [
            { label: 'Overview', slug: 'config-and-settings' },
            { label: '6.1. settings_schema.json: Rules & Conventions', slug: 'config-and-settings/settings-schema-json' },
            { label: '6.2. settings_data.json: Storage & Presets', slug: 'config-and-settings/settings-data-json' },
            { label: '6.3. Settings Conventions & Best Practices', slug: 'config-and-settings/settings-conventions-and-best-practices' },
          ],
        },
        {
          label: '7. Presets',
          items: [
            { label: 'Overview', slug: 'presets' },
            { label: '7.1. Theme Presets', slug: 'presets/theme-presets' },
            { label: '7.2. Section Presets', slug: 'presets/section-presets' },
            { label: '7.3. Block Presets', slug: 'presets/block-presets' },
            { label: '7.4. Preset Rules & Theme Store Requirements', slug: 'presets/preset-rules-and-theme-store-requirements' },
            { label: '7.5. Real-World Preset Examples', slug: 'presets/real-world-preset-examples' },
          ],
        },
        {
          label: '8. Colors',
          items: [
            { label: 'Overview', slug: 'colors' },
            { label: '8.1. Color Palettes', slug: 'colors/color-palettes' },
            { label: '8.2. Color Schemes', slug: 'colors/color-schemes' },
            { label: '8.3. Color Design Tokens', slug: 'colors/color-design-tokens' },
            { label: '8.4. Color in Liquid & CSS', slug: 'colors/color-in-liquid-and-css' },
            { label: '8.5. Color Accessibility & Contrast', slug: 'colors/color-accessibility-and-contrast' },
          ],
        },
        {
          label: '9. Fonts',
          items: [
            { label: 'Overview', slug: 'fonts' },
            { label: '9.1. Font Settings (font_picker)', slug: 'fonts/font-settings' },
            { label: '9.2. Type Scale & Typography Tokens', slug: 'fonts/type-scale-and-typography-tokens' },
            { label: '9.3. Typography in Liquid & CSS', slug: 'fonts/typography-in-liquid-and-css' },
            { label: '9.4. Font Accessibility & Performance', slug: 'fonts/font-accessibility-and-performance' },
          ],
        },
        {
          label: '10. Spacing',
          items: [
            { label: 'Overview', slug: 'spacing' },
            { label: '10.1. Spacing Scale & Tokens', slug: 'spacing/spacing-scale-and-tokens' },
            { label: '10.2. Spacing in Settings', slug: 'spacing/spacing-in-settings' },
            { label: '10.3. Spacing in Liquid & CSS', slug: 'spacing/spacing-in-liquid-and-css' },
          ],
        },
        {
          label: '11. CSS',
          items: [
            { label: 'Overview', slug: 'css' },
            { label: '11.1. CSS Units: rem, em & the 62.5% Technique', slug: 'css/css-units-rem-em' },
            { label: '11.2. Cascade, Specificity & the Box Model', slug: 'css/cascade-specificity-and-box-model' },
            { label: '11.3. CSS Custom Properties (Variables)', slug: 'css/css-custom-properties' },
            { label: '11.4. CSS Architecture, Naming & Logical Properties', slug: 'css/css-architecture-naming-and-logical-properties' },
            { label: '11.5. CSS in Shopify: stylesheet, style & Subsetting', slug: 'css/css-in-shopify' },
            { label: '11.6. Modern CSS Features', slug: 'css/modern-css-features' },
            { label: '11.7. CSS Performance', slug: 'css/css-performance' },
          ],
        },
        {
          label: '12. JavaScript',
          items: [
            { label: 'Overview', slug: 'javascript' },
            { label: '12.1. JavaScript Architecture: State & Events', slug: 'javascript/javascript-architecture-state-and-events' },
            { label: '12.2. Custom Element Lifecycle & Progressive Enhancement', slug: 'javascript/custom-element-lifecycle-and-progressive-enhancement' },
            { label: '12.3. Web Components: Two Patterns', slug: 'javascript/web-components-patterns' },
            { label: '12.4. JavaScript in Shopify: the {% javascript %} Tag', slug: 'javascript/javascript-in-shopify' },
            { label: '12.5. Theme Editor & Storefront Events', slug: 'javascript/theme-editor-and-storefront-events' },
            { label: '12.6. Modern JavaScript Features', slug: 'javascript/modern-javascript-features' },
            { label: '12.7. JavaScript Performance', slug: 'javascript/javascript-performance' },
          ],
        },
        {
          label: '13. Assets Management',
          items: [
            { label: 'Overview', slug: 'assets' },
            { label: '13.1. Icon Management', slug: 'assets/icon-management' },
            { label: '13.2. Responsive Images', slug: 'assets/responsive-images' },
            { label: '13.3. Video Management', slug: 'assets/video-management' },
            { label: '13.4. 3D & AR Media', slug: 'assets/3d-and-ar-media' },
            { label: '13.5. Asset Organization & Performance', slug: 'assets/asset-organization-and-performance' },
          ],
        },
        {
          label: '14. Internationalization & Locales',
          items: [
            { label: 'Overview', slug: 'internationalization-and-locales' },
            { label: '14.1. Internationalization & RTL', slug: 'internationalization-and-locales/internationalization-and-rtl' },
            { label: '14.2. Managing Locale Files', slug: 'internationalization-and-locales/managing-locale-files' },
          ],
        },
        {
          label: '15. Style Guides',
          items: [
            { label: 'Overview', slug: 'style-guides' },
            { label: '15.1. Liquid Style Guide', slug: 'style-guides/liquid' },
            { label: '15.2. Clean Code Principles', slug: 'style-guides/clean-code-principles' },
            { label: '15.3. Third-Party Libraries', slug: 'style-guides/third-party-libraries' },
          ],
        },
        {
          label: '16. Performance',
          items: [
            { label: 'Overview', slug: 'performance' },
            { label: '16.1. Performance Strategy & Critical Rendering Path', slug: 'performance/performance-strategy' },
          ],
        },
        {
          label: '17. Accessibility',
          items: [
            { label: 'Overview', slug: 'accessibility' },
            { label: '17.1. Accessibility Deep Dive', slug: 'accessibility/accessibility-deep-dive' },
          ],
        },
        {
          label: '18. AI-Assisted Development',
          items: [
            { label: 'Overview', slug: 'ai-assisted-development' },
            { label: '18.1. AI Coding Concepts (Agents, MCP, Skills, Commands, Plugins)', slug: 'ai-assisted-development/ai-coding-concepts' },
            { label: '18.2. Managing & Amending AI Rules', slug: 'ai-assisted-development/managing-ai-rules' },
            { label: "18.3. Shopify's Official AI Toolkit", slug: 'ai-assisted-development/shopify-ai-toolkit' },
            { label: '18.4. Figma MCP & Dev Mode', slug: 'ai-assisted-development/figma-mcp-and-dev-mode' },
            { label: '18.5. Figma to Code Workflow', slug: 'ai-assisted-development/figma-to-code-workflow' },
            { label: '18.6. Claude Code Custom Commands', slug: 'ai-assisted-development/claude-code-custom-commands' },
            { label: '18.7. Claude Code Subagents', slug: 'ai-assisted-development/claude-code-subagents' },
            { label: '18.8. Writing Prompts That Work', slug: 'ai-assisted-development/writing-prompts-that-work' },
          ],
        },
        {
          label: '19. GitHub Workflow',
          items: [
            { label: 'Overview', slug: 'github-workflow' },
            { label: '19.1. Pull Requests & Review', slug: 'github-workflow/pull-requests-and-review' },
            { label: '19.2. CI Automation', slug: 'github-workflow/ci-automation' },
          ],
        },
        {
          label: '20. Quality & Validation',
          items: [
            { label: 'Overview', slug: 'quality-validation' },
            { label: '20.1. Theme Check & Linting', slug: 'quality-validation/theme-check-and-linting' },
            { label: '20.2. Manual QA Checklist', slug: 'quality-validation/manual-qa-checklist' },
            { label: '20.3. Pre-Submission Checklist', slug: 'quality-validation/pre-submission-checklist' },
          ],
        },
        {
          label: '21. Publishing to Theme Store',
          items: [
            { label: 'Overview', slug: 'publishing' },
            { label: '21.1. Partner Dashboard Setup', slug: 'publishing/partner-dashboard-setup' },
            { label: '21.2. Store Setup for Submission', slug: 'publishing/store-setup-for-submission' },
            { label: '21.3. Packaging & Submitting', slug: 'publishing/packaging-and-submitting' },
            { label: '21.4. Review Process & Rejections', slug: 'publishing/review-process-and-rejections' },
            { label: '21.5. After Approval', slug: 'publishing/after-approval' },
          ],
        },
        {
          label: '22. Tooling & Config',
          items: [
            { label: 'Overview', slug: 'tooling-config' },
            { label: '22.1. Project Files Explained', slug: 'tooling-config/project-files' },
            { label: '22.2. Packaging: Theme Store-Only Directories', slug: 'tooling-config/packaging-exclusions' },
            { label: '22.3. Tailwind CSS & Alpine.js Build Setup', slug: 'tooling-config/tailwind-and-alpine-build-setup' },
          ],
        },
        {
          label: '23. Learning Articles',
          items: [
            { label: 'Overview', slug: 'learning-articles' },
            { label: '23.1. Liquid Global Objects Reference', slug: 'learning-articles/liquid-global-objects' },
            { label: '23.2. Writing Maintainable Code at Scale', slug: 'learning-articles/writing-maintainable-code-at-scale' },
          ],
        },
        {
          label: '24. Reference',
          items: [
            { label: 'Overview', slug: 'reference' },
            { label: '24.1. Cheatsheet', slug: 'reference/cheatsheet' },
            { label: '24.2. Glossary', slug: 'reference/glossary' },
            { label: '24.3. Tools Directory', slug: 'reference/tools-directory' },
          ],
        },
      ],
    }),
  ],
});
