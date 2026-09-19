import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { INTENTIONAL_IGNORED_OBJECT_PAGES } from "./quartz/util/contentPaths"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Lietuvos istorija",
    pageTitleSuffix: " – Lietuvos istorija",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "google",
      tagId: "G-P32S0DY7SH",
    },
    locale: "lt-LT",
    baseUrl: "lietuvosistorija.eu",
    ignorePatterns: [
      ".git",
      ".git/**",
      ".github",
      ".github/**",
      ".obsidian",
      ".obsidian/**",
      ".quartz-cache",
      ".quartz-cache/**",
      ".cache",
      ".cache/**",
      ".valancius-state",
      ".valancius-state/**",
      "scripts",
      "scripts/**",
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
      "tyrimai/auditai",
      "tyrimai/auditai/**",
      ...INTENTIONAL_IGNORED_OBJECT_PAGES,
    ],
    defaultDateType: "created",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Georgia",
        body: "Helvetica Neue",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f3",
          lightgray: "#ded9cf",
          gray: "#706b62",
          darkgray: "#302e29",
          dark: "#25231f",
          secondary: "#b9251c",
          tertiary: "#c93023",
          highlight: "rgba(185, 37, 28, 0.07)",
          textHighlight: "#e3d39a80",
        },
        darkMode: {
          light: "#1c1b18",
          lightgray: "#403d36",
          gray: "#b9b3a7",
          darkgray: "#e4dfd4",
          dark: "#f7f2e8",
          secondary: "#ff6250",
          tertiary: "#ff6250",
          highlight: "rgba(255, 98, 80, 0.12)",
          textHighlight: "#bca14a88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CitationFilterMetadata(),
      Plugin.AdvancedEvidence(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
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
      Plugin.ObjectPrimaryMedia(),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.HomeCollectionData(),
      Plugin.ContentPage(),
      Plugin.ObjectDetailPages(),
      Plugin.ObjectEvidencePages(),
      Plugin.ObjectRelationsPages(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.GraphExplorerPage(),
      Plugin.ObjectGalleryPage(),
      Plugin.ExhibitionPages(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.CitationSourcesRegistry(),
      Plugin.RobotsTxt(),
      Plugin.CNAME(),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Keep CI builds offline-safe: per-page OG images fetch remote TTF fonts during build.
      // The site still publishes a shared social image through quartz/static/og-image-ldk-map.jpg.
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
