import fs from "node:fs"
import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"
import { JSResourceToScriptElement, StaticResources } from "../util/resources"
import { FullSlug, RelativeURL, joinSegments, normalizeHastElement } from "../util/path"
import { clone } from "../util/clone"
import { visit } from "unist-util-visit"
import { Root, Element, ElementContent } from "hast"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { collectCitationMetadata, collectClaimCount, isObjectPage } from "../util/citationFilter"
import { styleText } from "util"
import { buildAssetVersion } from "../util/buildVersion"
import { graphVisualRegistry } from "../util/graphVisualRegistry"
import { classifyAnalyticsPage } from "../util/analytics"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent
}

const headerRegex = new RegExp(/h[1-6]/)
export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
): StaticResources {
  const assetVersion = buildAssetVersion
  const versionedAsset = (path: string) => `${path}?v=${assetVersion}`
  const staticJsonPath = (path: string) => versionedAsset(joinSegments("/", "static", path))
  const contentMetaPath = staticJsonPath("contentMeta.json")
  const searchIndexPath = staticJsonPath("searchIndex.json")
  const graphIndexPath = staticJsonPath("graphIndex.json")
  const graphTopologyPath = staticJsonPath("graph-data/topology.json")
  const graphSlugMapPath = staticJsonPath("graphSlugMap.json")
  const randomClaimsPath = staticJsonPath("randomClaims.json")
  const citationSourcesPath = staticJsonPath("citationSources.json")
  const sourceCatalogPath = staticJsonPath("sourceCatalog.json")
  const staticIndexScript = `
globalThis.__ltkbStaticJsonCache ??= new Map()
globalThis.__ltkbAssetVersion = "${assetVersion}"
globalThis.__ltkbGraphVisualRegistry = ${JSON.stringify(graphVisualRegistry)}
globalThis.loadStaticJson ??= (path) => {
  const cache = globalThis.__ltkbStaticJsonCache
  if (!cache.has(path)) {
    const request = fetch(path, { cache: "force-cache" })
      .then((data) => {
        if (!data.ok) throw new Error("Failed to fetch " + path + ": " + data.status)
        return data.json()
      })
      .catch((error) => {
        cache.delete(path)
        throw error
      })
    cache.set(path, request)
  }
  return cache.get(path)
}
globalThis.loadContentMeta = () => globalThis.loadStaticJson("${contentMetaPath}")
globalThis.loadSearchIndex = () => globalThis.loadStaticJson("${searchIndexPath}")
globalThis.loadGraphIndex = () => globalThis.loadStaticJson("${graphIndexPath}")
globalThis.loadGraphTopology = () => globalThis.loadStaticJson("${graphTopologyPath}")
globalThis.loadGraphSlugMap = () => globalThis.loadStaticJson("${graphSlugMapPath}")
globalThis.loadRandomClaims = () => globalThis.loadStaticJson("${randomClaimsPath}")
globalThis.fetchSourceCatalog = globalThis.loadStaticJson("${sourceCatalogPath}").catch(() => [])
// Compatibility only: callers should prefer purpose-specific loaders.
globalThis.fetchData = {
  then: (resolve, reject) => globalThis.loadContentMeta().then(resolve, reject),
}
`
  const citationSourcesScript = `globalThis.fetchCitationSources = globalThis.loadStaticJson("${citationSourcesPath}").catch(() => [])`

  const resources: StaticResources = {
    css: [
      {
        content: versionedAsset(joinSegments(baseDir, "index.css")),
      },
      ...staticResources.css,
    ],
    js: [
      {
        src: versionedAsset(joinSegments(baseDir, "prescript.js")),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: staticIndexScript,
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: citationSourcesScript,
      },
      ...staticResources.js,
    ],
    additionalHead: staticResources.additionalHead,
  }

  resources.js.push({
    src: versionedAsset(joinSegments(baseDir, "postscript.js")),
    loadTime: "afterDOMReady",
    moduleType: "module",
    contentType: "external",
  })

  return resources
}

function renderTranscludes(
  root: Root,
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  visited: Set<FullSlug>,
) {
  // process transcludes in componentData
  visit(root, "element", (node, _index, _parent) => {
    if (node.tagName === "blockquote") {
      const classNames = (node.properties?.className ?? []) as string[]
      if (classNames.includes("transclude")) {
        const inner = node.children[0] as Element
        const transcludeTarget = (inner.properties["data-slug"] ?? slug) as FullSlug
        if (visited.has(transcludeTarget)) {
          console.warn(
            styleText(
              "yellow",
              `Warning: Skipping circular transclusion: ${slug} -> ${transcludeTarget}`,
            ),
          )
          node.children = [
            {
              type: "element",
              tagName: "p",
              properties: { style: "color: var(--secondary);" },
              children: [
                {
                  type: "text",
                  value: `Circular transclusion detected: ${transcludeTarget}`,
                },
              ],
            },
          ]
          return
        }
        visited.add(transcludeTarget)

        const page = componentData.allFiles.find((f) => f.slug === transcludeTarget)
        if (!page) {
          return
        }

        let blockRef = node.properties.dataBlock as string | undefined
        if (blockRef?.startsWith("#^")) {
          // block transclude
          blockRef = blockRef.slice("#^".length)
          let blockNode = page.blocks?.[blockRef]
          if (blockNode) {
            if (blockNode.tagName === "li") {
              blockNode = {
                type: "element",
                tagName: "ul",
                properties: {},
                children: [blockNode],
              }
            }

            node.children = [
              normalizeHastElement(blockNode, slug, transcludeTarget),
              {
                type: "element",
                tagName: "a",
                properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                children: [
                  { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                ],
              },
            ]
          }
        } else if (blockRef?.startsWith("#") && page.htmlAst) {
          // header transclude
          blockRef = blockRef.slice(1)
          let startIdx = undefined
          let startDepth = undefined
          let endIdx = undefined
          for (const [i, el] of page.htmlAst.children.entries()) {
            // skip non-headers
            if (!(el.type === "element" && el.tagName.match(headerRegex))) continue
            const depth = Number(el.tagName.substring(1))

            // lookin for our blockref
            if (startIdx === undefined || startDepth === undefined) {
              // skip until we find the blockref that matches
              if (el.properties?.id === blockRef) {
                startIdx = i
                startDepth = depth
              }
            } else if (depth <= startDepth) {
              // looking for new header that is same level or higher
              endIdx = i
              break
            }
          }

          if (startIdx === undefined) {
            return
          }

          node.children = [
            ...(page.htmlAst.children.slice(startIdx, endIdx) as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        } else if (page.htmlAst) {
          // page transclude
          node.children = [
            {
              type: "element",
              tagName: "h1",
              properties: {},
              children: [
                {
                  type: "text",
                  value:
                    page.frontmatter?.title ??
                    i18n(cfg.locale).components.transcludes.transcludeOf({
                      targetSlug: page.slug!,
                    }),
                },
              ],
            },
            ...(page.htmlAst.children as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        }
      }
    }
  })
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // make a deep copy of the tree so we don't remove the transclusion references
  // for the file cached in contentMap in build.ts
  const root = clone(componentData.tree) as Root
  const visited = new Set<FullSlug>([slug])
  renderTranscludes(root, cfg, slug, componentData, visited)

  // set componentData.tree to the edited html that has transclusions rendered
  componentData.tree = root

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  } = components
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en"
  const direction = i18n(cfg.locale).direction ?? "ltr"
  const frontmatter = componentData.fileData.frontmatter as
    | {
        citatu_skaicius?: number
        citatu_saltiniu_id?: string[]
      }
    | undefined
  const citationFilter = componentData.fileData.citationFilter as
    | {
        quoteCount?: number
        sourceIds?: string[]
      }
    | undefined
  const filePath = String(componentData.fileData.filePath ?? "")
  const relativePath = String(componentData.fileData.relativePath ?? "")
  const fileCitationFilter =
    filePath && isObjectPage(relativePath)
      ? collectCitationMetadata(fs.readFileSync(filePath, "utf8"))
      : citationFilter
  const currentQuoteCount = Number(
    fileCitationFilter?.quoteCount ?? frontmatter?.citatu_skaicius ?? 0,
  )
  const currentClaimCount =
    filePath && isObjectPage(relativePath)
      ? collectClaimCount(fs.readFileSync(filePath, "utf8"))
      : 0
  const rawSourceIds = Array.isArray(fileCitationFilter?.sourceIds)
    ? fileCitationFilter.sourceIds
    : frontmatter?.citatu_saltiniu_id
  const currentSourceIds = Array.isArray(rawSourceIds)
    ? rawSourceIds.filter((value): value is string => typeof value === "string")
    : []
  const currentCitationFilterable = Boolean(
    String(slug).startsWith("objektai/") &&
    (fileCitationFilter || currentQuoteCount > 0 || currentSourceIds.length > 0),
  )
  const analyticsPage = classifyAnalyticsPage(
    String(slug),
    componentData.fileData.frontmatter?.tipas,
    String(slug) === "404",
  )
  const doc = (
    <html lang={lang} dir={direction}>
      <Head {...componentData} />
      <body
        data-slug={slug}
        data-content-id={analyticsPage.contentId}
        data-content-type={analyticsPage.contentType}
        data-page-type={analyticsPage.pageType}
        data-citation-filterable={currentCitationFilterable ? "true" : "false"}
        data-quote-count={`${currentQuoteCount}`}
        data-claim-count={`${currentClaimCount}`}
        data-citation-sources={currentSourceIds.join("|")}
      >
        <div id="quartz-root" class="page">
          <Body {...componentData}>
            {LeftComponent}
            <div class="center">
              <div class="page-header">
                <Header {...componentData}>
                  {header.map((HeaderComponent) => (
                    <HeaderComponent {...componentData} />
                  ))}
                </Header>
                <div class="popover-hint">
                  {beforeBody.map((BodyComponent) => (
                    <BodyComponent {...componentData} />
                  ))}
                </div>
              </div>
              <Content {...componentData} />
              <hr />
              <div class="page-footer">
                {afterBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </div>
            {RightComponent}
            <Footer {...componentData} />
          </Body>
        </div>
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res, true))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}
