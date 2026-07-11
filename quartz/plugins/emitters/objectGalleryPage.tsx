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

  return {
    name: "ObjectGalleryPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)
      const objectEntries = new Map<string, MediaEntry[]>()
      const allEntries: MediaEntry[] = []

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
      yield write({
        ctx,
        content: JSON.stringify(catalog.map(lightEntry)),
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
        frontmatter: Record<string, unknown>,
      ) {
        const [tree, vfile] = defaultProcessedContent({
          slug,
          text: title,
          description: `${title} – patikrintų Lietuvos istorijos vaizdų katalogas.`,
          frontmatter: { title, media_gallery_page: true, ...frontmatter },
        })
        const externalResources = pageResources(pathToRoot(slug), resources)
        const componentData: QuartzComponentProps = {
          ctx, fileData: vfile.data, externalResources, cfg, children: [], tree, allFiles,
        }
        yield write({
          ctx,
          content: renderPage(cfg, slug, componentData, opts, externalResources),
          slug,
          ext: ".html",
        })
      }

      yield* emitPage("galerija" as FullSlug, "Galerija", {})

      for (const [_tree, file] of content) {
        const rawObjectSlug = file.data.slug
        if (!rawObjectSlug || !isObjectPage(rawObjectSlug) || rawObjectSlug.endsWith("/galerija")) continue
        const objectSlug = rawObjectSlug as FullSlug
        const notePath = `${objectSlug}.md`
        if (!objectEntries.has(notePath)) continue
        const objectTitle = cleanText(file.data.frontmatter?.title) || objectSlug.split("/").at(-1) || "Objektas"
        yield* emitPage(objectGallerySlug(objectSlug), objectTitle, {
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
