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
  applyObjectPagePrimary,
  displayCaption,
  displayCreator,
  displayDate,
  isObjectPage,
  MediaEntry,
  mediaDetailSlug,
  mediaImageUrl,
  mediaThumbnailUrl,
  mergeMediaEntries,
  objectGallerySlug,
} from "../../util/objectMedia"
import {
  assertObjectMediaIndexEquality,
  buildMediaCatalog,
  buildObjectMediaIndex,
  canonicalMediaFrontmatter,
  mediaSetForObject,
  objectMediaIndexSnapshot,
} from "../../util/mediaCatalog"
import { loadExhibitions } from "../../util/exhibitions"
import {
  computeFacetSummary,
  emptyGalleryState,
  MEDIA_GALLERY_PAGE_SIZE,
  rankMediaEntries,
  type MediaGalleryBootstrap,
} from "../../util/mediaGallery"
import { objectDetailEvidenceFromFile } from "../../util/objectDetail"
import { objectPageViewModel } from "../../util/objectPageView"

function lightEntry(entry: MediaEntry): MediaEntry {
  const {
    rightsNote: _rightsNote,
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
  const route = encodeURI(String(slug)).replace(/^\/+|\/+$/g, "")
  return new URL(`/${route}/`, `https://${baseUrl ?? "example.com"}`).toString()
}

function mediaStructuredData(entry: MediaEntry, pageUrl: string, description: string): string {
  const imageId = `${pageUrl}#image`
  const creator = displayCreator(entry.creator)
  const rawContentUrl = mediaImageUrl(entry)
  const rawThumbnailUrl = mediaThumbnailUrl(entry)
  const absoluteImage = (value: string) =>
    !value || /^https?:\/\//i.test(value) ? value : new URL(value, pageUrl).toString()
  const contentUrl = absoluteImage(rawContentUrl)
  const thumbnailUrl = absoluteImage(rawThumbnailUrl)
  const creditText = cleanText(
    entry.attribution || entry.institution || entry.providerLabel || entry.provider,
  )
  const license = cleanText(entry.licenseUrl)
  const object = {
    "@context": "https://schema.org",
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
      const exhibitionReturns = new Map(
        loadExhibitions()
          .filter((exhibition) => exhibition.exhibitionId.startsWith("valancius-"))
          .flatMap((exhibition) =>
            exhibition.sections.flatMap((section) =>
              section.items.map(
                (item) =>
                  [
                    item.mediaId,
                    {
                      title: exhibition.title,
                      href: `/${exhibition.slug}/#${item.exhibitionItemId}`,
                    },
                  ] as const,
              ),
            ),
          ),
      )
      const objectIndex = buildObjectMediaIndex(catalog)
      assertObjectMediaIndexEquality(allFiles, objectIndex)
      const lightCatalog = catalog.map(lightEntry)
      const catalogContent = JSON.stringify(lightCatalog)
      const catalogVersion = createHash("sha256").update(catalogContent).digest("hex").slice(0, 12)
      yield write({
        ctx,
        content: catalogContent,
        slug: joinSegments("static", "mediaCatalog") as FullSlug,
        ext: ".json",
      })
      yield write({
        ctx,
        content: JSON.stringify(objectMediaIndexSnapshot(objectIndex)),
        slug: joinSegments("static", "objectMediaIndex") as FullSlug,
        ext: ".json",
      })
      for (const entry of catalog) {
        if (!entry.mediaId) continue
        yield write({
          ctx,
          content: JSON.stringify(lightEntry(entry)),
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
        const lockedObject = cleanText(frontmatter.object_note_path)
        const rankedEntries = rankMediaEntries(entries, emptyGalleryState(), { lockedObject })
        const bootstrap: MediaGalleryBootstrap = {
          initialEntries: rankedEntries.slice(0, MEDIA_GALLERY_PAGE_SIZE),
          totalCount: rankedEntries.length,
          facetSummary: computeFacetSummary(rankedEntries),
          catalogUrl: `/static/mediaCatalog.json?v=${catalogVersion}`,
          catalogVersion,
          lockedObject: lockedObject || undefined,
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
            media_primary_thumb_url: rankedEntries[0] ? mediaThumbnailUrl(rankedEntries[0]) : "",
            media_primary_width: rankedEntries[0]?.width,
            media_primary_height: rankedEntries[0]?.height,
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
        const objectMedia = applyObjectPagePrimary(
          mediaSetForObject(objectIndex, notePath),
          file.data.frontmatter,
        )
        if (!objectMedia.totalCount) continue
        const objectTitle =
          cleanText(file.data.frontmatter?.title) || objectSlug.split("/").at(-1) || "Objektas"
        const entries = mergeMediaEntries(objectMedia.all).map(lightEntry)
        const evidence = objectDetailEvidenceFromFile(String(file.data.filePath ?? ""))
        const view = objectPageViewModel(
          (file.data.frontmatter ?? {}) as Record<string, unknown>,
          evidence,
          { gallery: entries.length },
        )
        const galleryTitle = `${objectTitle} – vaizdų galerija`
        yield* emitPage(
          objectGallerySlug(objectSlug),
          galleryTitle,
          `${objectTitle}: patikrinti atvaizdai, kūriniai ir istorinis kontekstas.`,
          entries,
          {
            ...canonicalMediaFrontmatter(objectMedia),
            object_title: objectTitle,
            object_slug: objectSlug,
            object_note_path: notePath,
            object_source_path: String(file.data.filePath ?? ""),
            object_gallery_page: true,
            object_page_counts_json: JSON.stringify({ counts: view.counts }),
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
            media_primary_thumb_url: mediaThumbnailUrl(entry),
            media_exhibition_return: exhibitionReturns.get(entry.mediaId),
            media_primary_width: entry.width,
            media_primary_height: entry.height,
            media_social_alt: title,
            media_schema_image_id: `${pageUrl}#image`,
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
