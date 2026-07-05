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
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com' },
      ],
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/your-org/shopify-theme-handbook/edit/main/',
      },
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
          label: '5. AI-Assisted Development',
          items: [
            { label: 'Overview', slug: 'ai-assisted-development' },
            { label: '5a. Setting Up AI Rules', slug: 'ai-assisted-development/setting-up-ai-rules' },
            { label: '5b. Figma to Code Workflow', slug: 'ai-assisted-development/figma-to-code-workflow' },
            { label: '5c. Writing Prompts That Work', slug: 'ai-assisted-development/writing-prompts-that-work' },
          ],
        },
        {
          label: '6. GitHub Workflow',
          items: [
            { label: 'Overview', slug: 'github-workflow' },
            { label: 'Branching & Commits', slug: 'github-workflow/branching-and-commits' },
            { label: 'Pull Requests & Review', slug: 'github-workflow/pull-requests-and-review' },
            { label: 'CI Automation', slug: 'github-workflow/ci-automation' },
          ],
        },
        {
          label: '7. Quality & Validation',
          items: [
            { label: 'Overview', slug: 'quality-validation' },
            { label: 'Theme Check & Linting', slug: 'quality-validation/theme-check-and-linting' },
            { label: 'Manual QA Checklist', slug: 'quality-validation/manual-qa-checklist' },
            { label: 'Pre-Submission Checklist', slug: 'quality-validation/pre-submission-checklist' },
          ],
        },
        {
          label: '8. Publishing to Theme Store',
          items: [
            { label: 'Overview', slug: 'publishing' },
            { label: 'Partner Dashboard Setup', slug: 'publishing/partner-dashboard-setup' },
            { label: 'Packaging & Submitting', slug: 'publishing/packaging-and-submitting' },
            { label: 'Review Process & Rejections', slug: 'publishing/review-process-and-rejections' },
            { label: 'After Approval', slug: 'publishing/after-approval' },
          ],
        },
      ],
    }),
  ],
});
