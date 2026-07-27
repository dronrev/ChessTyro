import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Chess Tyro',
  tagline: 'Learn to play chess - rules, tactics, and strategy',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://dronrev.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/ChessDocuments/',

  organizationName: 'dronrev', // GitHub org/user name
  projectName: 'ChessDocuments', // GitHub repo name

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ms'],
    localeConfigs: {
      en: {label: 'English'},
      ms: {label: 'Bahasa Melayu'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    // Default meta description used for pages that don't set their own
    // (shown in search results and link previews).
    metadata: [
      {
        name: 'description',
        content:
          'Learn chess from scratch with Chess Tyro - rules, tactics, openings and endgames explained with interactive boards. Free, in English and Bahasa Melayu.',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Chess Tyro',
      logo: {
        alt: 'Chess Tyro Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guide',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Chess Rules',
              to: '/docs/chess-rules/overview',
            },
          ],
        },
        {
          title: 'Learn',
          items: [
            {
              label: 'How the Pieces Move',
              to: '/docs/chess-rules/how-the-pieces-move',
            },
            {
              label: 'Basic Tactics',
              to: '/docs/chess-rules/tactics',
            },
            {
              label: 'Basic Checkmates',
              to: '/docs/chess-rules/basic-checkmates',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Chess Tyro. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
