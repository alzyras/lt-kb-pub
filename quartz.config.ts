import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Lietuvos istorijos žinių bazė",
    pageTitleSuffix: " – LT KB",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "google",
      tagId: "G-P32S0DY7SH",
    },
    locale: "lt-LT",
    baseUrl: "alzyras.github.io/lt-kb-pub",
    ignorePatterns: [
      ".git",
      ".git/**",
      ".github",
      ".github/**",
      ".obsidian",
      ".obsidian/**",
      ".quartz-cache",
      ".quartz-cache/**",
      "node_modules",
      "node_modules/**",
      "public",
      "public/**",
      "quartz",
      "quartz/**",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "globals.d.ts",
      "index.d.ts",
      "README.md",
      "private",
      "templates",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: {
          name: "Noto Serif",
          weights: [400, 600, 700],
        },
        body: {
          name: "Noto Serif",
          weights: [400, 600],
          includeItalic: true,
        },
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fbf5e9",
          lightgray: "#eadcc8",
          gray: "#a99577",
          darkgray: "#4d3c2a",
          dark: "#24190f",
          secondary: "#7b2d1f",
          tertiary: "#2d5c4d",
          highlight: "rgba(123, 45, 31, 0.12)",
          textHighlight: "#f1d86a88",
        },
        darkMode: {
          light: "#15120e",
          lightgray: "#35291f",
          gray: "#8b765d",
          darkgray: "#e6d5bc",
          dark: "#fff3df",
          secondary: "#d98a6a",
          tertiary: "#9cc7a9",
          highlight: "rgba(217, 138, 106, 0.16)",
          textHighlight: "#9f7d2388",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.AdvancedEvidence(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
