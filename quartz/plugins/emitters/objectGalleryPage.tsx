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
  displayCaption,
  displayCreator,
  displayDate,
  isObjectPage,
  MediaEntry,
  mediaDetailSlug,
  mergeMediaEntries,
  objectGallerySlug,
} from "../../util/objectMedia"
import { buildMediaCatalog, mediaEntriesByObject } from "../../util/mediaCatalog"
import {
  computeFacetSummary,
  MEDIA_GALLERY_PAGE_SIZE,
  type MediaGalleryBootstrap,
} from "../../util/mediaGallery"

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

function mediaDescription(entry: MediaEntry): string {
  const details = [
    displayCreator(entry.creator),
    displayDate(entry.dateDisplay),
    cleanText(entry.institution),
  ]
    .filter(Boolean)
    .join(" · ")
  const base = displayCaption(entry)
  return details ? `${base} ${details}.` : base
}

function absolutePageUrl(baseUrl: string | undefined, slug: FullSlug): string {
  return new URL(`/${encodeURI(slug)}`, `https://${baseUrl ?? "example.com"}`).toString()
}

function mediaStructuredData(entry: MediaEntry, pageUrl: string, description: string): string {
  const imageId = `${pageUrl}#image`
  const creator = displayCreator(entry.creator)
  const contentUrl = cleanText(entry.sourceUrl || entry.thumbUrl)
  const thumbnailUrl = cleanText(entry.thumbUrl || entry.sourceUrl)
  const creditText = cleanText(
    entry.attribution || entry.institution || entry.providerLabel || entry.provider,
  )
  const license = cleanText(entry.licenseUrl)
  const object = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: displayCaption(entry),
        description,
        primaryImageOfPage: { "@id": imageId },
      },
      {
        "@type": "ImageObject",
        "@id": imageId,
        name: displayCaption(entry),
        caption: displayCaption(entry),
        description,
        contentUrl: contentUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        width: entry.width || undefined,
        height: entry.height || undefined,
        creator: creator ? { "@type": "Person", name: creator } : undefined,
        creditText: creditText || undefined,
        copyrightNotice: cleanText(entry.rightsNote) || undefined,
        license: license || undefined,
        acquireLicensePage: cleanText(entry.canonicalUrl) || undefined,
        representativeOfPage: true,
        mainEntityOfPage: { "@id": pageUrl },
      },
    ],
  }
  return JSON.stringify(object)
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
      // Register the gallery component globally so its lifecycle script is already
      // listening when Quartz navigates to a generated gallery page.
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((c) => c[1].data)
      const catalog = buildMediaCatalog(allFiles)
      const objectEntries = mediaEntriesByObject(catalog)
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
        description: string,
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
          description,
          frontmatter: {
            title,
            description,
            media_gallery_page: true,
            media_gallery_bootstrap_json: JSON.stringify(bootstrap),
            media_primary_thumb_url: entries[0]?.thumbUrl || entries[0]?.sourceUrl || "",
            media_primary_width: entries[0]?.width,
            media_primary_height: entries[0]?.height,
            ...frontmatter,
          },
        })
        const externalResources = pageResources(pathToRoot(slug), resources)
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

      yield* emitPage(
        "galerija" as FullSlug,
        "Lietuvos istorijos vaizdų galerija",
        "Patikrinti Lietuvos istorijos vaizdai iš atvirų kultūros paveldo rinkinių.",
        lightCatalog,
        {},
      )

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
        const galleryTitle = `${objectTitle} – vaizdų galerija`
        yield* emitPage(
          objectGallerySlug(objectSlug),
          galleryTitle,
          `${objectTitle}: patikrinti atvaizdai, kūriniai ir istorinis kontekstas.`,
          entries,
          {
            object_title: objectTitle,
            object_slug: objectSlug,
            object_note_path: notePath,
            object_gallery_page: true,
          },
        )
      }

      for (const entry of catalog) {
        if (!entry.mediaId) continue
        const slug = mediaDetailSlug(entry)
        const title = displayCaption(entry)
        const description = mediaDescription(entry)
        const pageUrl = absolutePageUrl(cfg.baseUrl, slug)
        const [tree, vfile] = defaultProcessedContent({
          slug,
          text: title,
          description,
          frontmatter: {
            title,
            description,
            media_detail_page: true,
            media_detail_json: JSON.stringify(entry),
            media_primary_thumb_url: entry.thumbUrl || entry.sourceUrl || "",
            media_primary_width: entry.width,
            media_primary_height: entry.height,
            structured_data_json: mediaStructuredData(entry, pageUrl, description),
          },
        })
        const externalResources = pageResources(pathToRoot(slug), resources)
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
    },
    async *partialEmit() {},
  }
}
