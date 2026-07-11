import { createHash } from "node:crypto"
import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { ObjectMediaGallery } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import {
  cleanText,
  isObjectPage,
  MediaEntry,
  mergeMediaEntries,
  objectGallerySlug,
  objectMediaSet,
} from "../../util/objectMedia"
import {
  computeFacetSummary,
  MEDIA_GALLERY_PAGE_SIZE,
  type MediaGalleryBootstrap,
} from "../../util/mediaGallery"
import { QuartzComponent } from "../../components/types"
import { transform as transpile } from "esbuild"
// @ts-ignore
import objectMediaGalleryScript from "../../components/scripts/object-media-gallery.inline"

function lightEntry(entry: MediaEntry): MediaEntry {
  const {
    rightsNote: _rightsNote,
    attribution: _attribution,
    visualEvidence: _visualEvidence,
    metadataEvidence: _metadataEvidence,
    judgeReason: _judgeReason,
    ...light
  } = entry
  return light
}

export const ObjectGalleryPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ObjectMediaGallery(),
    beforeBody: [],
    left: [],
    right: [],
    afterBody: [],
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()
  const StyleOnly: QuartzComponent = () => null
  StyleOnly.css = pageBody.css

  return {
    name: "ObjectGalleryPage",
    getQuartzComponents() {
      return [Head, Body, StyleOnly, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)
      const objectEntries = new Map<string, MediaEntry[]>()
      const allEntries: MediaEntry[] = []

      const compiledScript = await transpile(objectMediaGalleryScript, { minify: true })
      yield write({
        ctx,
        content: compiledScript.code,
        slug: "static/object-media-gallery" as FullSlug,
        ext: ".js",
      })

      for (const [_tree, file] of content) {
        const slug = file.data.slug
        if (!slug || !isObjectPage(slug) || slug.endsWith("/galerija")) continue
        const entries = objectMediaSet(file.data.frontmatter).all
        if (!entries.length) continue
        const notePath = `${slug}.md`
        objectEntries.set(notePath, entries)
        allEntries.push(...entries)
      }

      const catalog = mergeMediaEntries(allEntries)
      const lightCatalog = catalog.map(lightEntry)
      const catalogContent = JSON.stringify(lightCatalog)
      const catalogVersion = createHash("sha256").update(catalogContent).digest("hex").slice(0, 12)
      yield write({
        ctx,
        content: catalogContent,
        slug: joinSegments("static", "mediaCatalog") as FullSlug,
        ext: ".json",
      })
      for (const entry of catalog) {
        if (!entry.mediaId) continue
        yield write({
          ctx,
          content: JSON.stringify(entry),
          slug: joinSegments("static", "media", entry.mediaId) as FullSlug,
          ext: ".json",
        })
      }

      const emitPage = async function* (
        slug: FullSlug,
        title: string,
        entries: MediaEntry[],
        frontmatter: Record<string, unknown>,
      ) {
        const bootstrap: MediaGalleryBootstrap = {
          initialEntries: entries.slice(0, MEDIA_GALLERY_PAGE_SIZE),
          totalCount: entries.length,
          facetSummary: computeFacetSummary(entries),
          catalogUrl: `/static/mediaCatalog.json?v=${catalogVersion}`,
          catalogVersion,
          lockedObject: cleanText(frontmatter.object_note_path) || undefined,
        }
        const [tree, vfile] = defaultProcessedContent({
          slug,
          text: title,
          description: `${title} – patikrintų Lietuvos istorijos vaizdų katalogas.`,
          frontmatter: {
            title,
            media_gallery_page: true,
            media_gallery_bootstrap_json: JSON.stringify(bootstrap),
            ...frontmatter,
          },
        })
        const externalResources = pageResources(pathToRoot(slug), resources)
        externalResources.js.push({
          src: "/static/object-media-gallery.js",
          contentType: "external",
          loadTime: "afterDOMReady",
          moduleType: "module",
        })
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: vfile.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }
        yield write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        })
      }

      yield* emitPage("galerija" as FullSlug, "Galerija", lightCatalog, {})

      for (const [_tree, file] of content) {
        const rawObjectSlug = file.data.slug
        if (!rawObjectSlug || !isObjectPage(rawObjectSlug) || rawObjectSlug.endsWith("/galerija"))
          continue
        const objectSlug = rawObjectSlug as FullSlug
        const notePath = `${objectSlug}.md`
        if (!objectEntries.has(notePath)) continue
        const objectTitle =
          cleanText(file.data.frontmatter?.title) || objectSlug.split("/").at(-1) || "Objektas"
        const entries = mergeMediaEntries(objectEntries.get(notePath) ?? []).map(lightEntry)
        yield* emitPage(objectGallerySlug(objectSlug), objectTitle, entries, {
          object_title: objectTitle,
          object_slug: objectSlug,
          object_note_path: notePath,
          object_gallery_page: true,
        })
      }
    },
    async *partialEmit() {},
  }
}
