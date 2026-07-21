import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { ExhibitionPage } from "../../components"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"
import { sharedPageComponents } from "../../../quartz.layout"
import {
  exhibitionFeaturedCount,
  exhibitionItemCount,
  loadExhibitions,
  type ExhibitionManifest,
} from "../../util/exhibitions"
import { cleanText } from "../../util/objectMedia"

function absolutePageUrl(baseUrl: string | undefined, slug: string): string {
  return new URL(`/${encodeURI(slug)}`, `https://${baseUrl ?? "example.com"}`).toString()
}

function redirectPage(destination: string, canonicalUrl: string): string {
  const path = `/${encodeURI(destination)}/`
  const safeCanonicalUrl = canonicalUrl.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
  const safePath = path.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
  return `<!doctype html><html lang="lt"><head><meta charset="utf-8"><title>Paroda perkelta</title><link rel="canonical" href="${safeCanonicalUrl}"><meta http-equiv="refresh" content="0; url=${safePath}"><script>location.replace(${JSON.stringify(path)}+location.search+location.hash)</script></head><body><a href="${safePath}">Atidaryti parodą</a></body></html>`
}

function structuredData(exhibition: ExhibitionManifest, pageUrl: string): string {
  const items = exhibition.sections.flatMap((section) =>
    section.items.filter((item) => item.featured),
  )
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: exhibition.title,
    description: exhibition.description,
    primaryImageOfPage:
      cleanText(exhibition.hero.sourceUrl || exhibition.hero.thumbUrl) || undefined,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.titleLt,
        url: new URL(item.media.detailUrl || `/galerija?media=${item.mediaId}`, pageUrl).toString(),
        image: cleanText(item.media.sourceUrl || item.media.thumbUrl) || undefined,
      })),
    },
  })
}

export const ExhibitionPages: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    pageBody: ExhibitionPage(),
    beforeBody: [],
    left: [],
    right: [],
    afterBody: [],
  }
  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()
  return {
    name: "ExhibitionPages",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const exhibitions = loadExhibitions()
      const cfg = ctx.cfg.configuration
      const allFiles = content.map((item) => item[1].data)
      const galleryContexts = Object.fromEntries(
        exhibitions.map((exhibition) => [
          exhibition.exhibitionId,
          {
            exhibitionId: exhibition.exhibitionId,
            slug: exhibition.slug,
            title: exhibition.title,
            items: exhibition.sections.flatMap((section) =>
              section.items.map((item) => ({
                exhibitionItemId: item.exhibitionItemId,
                mediaId: item.mediaId,
                titleLt: item.titleLt,
                descriptionLt: item.descriptionLt || item.catalogDescriptionLt,
                creatorDisplay: item.creatorDisplay || "",
                dateDisplay: item.dateDisplay || item.media.dateDisplay || "",
                sectionTitle: section.title,
                sectionSlug: section.slug,
                featured: item.featured,
                relation: item.relation,
              })),
            ),
          },
        ]),
      )
      yield write({
        ctx,
        content: JSON.stringify(galleryContexts),
        slug: "static/exhibitionMediaContext" as FullSlug,
        ext: ".json",
      })
      const emit = async function* (
        slug: FullSlug,
        title: string,
        description: string,
        frontmatter: Record<string, unknown>,
      ) {
        const [tree, vfile] = defaultProcessedContent({
          slug,
          text: title,
          description,
          frontmatter: { title, description, ...frontmatter },
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

      yield* emit(
        "parodos" as FullSlug,
        "Skaitmeninės parodos",
        "Kuruotos Lietuvos istorijos parodos, jungiančios vaizdus, teiginius ir pirminius šaltinius.",
        {
          exhibitions_index_json: JSON.stringify(exhibitions),
          media_primary_thumb_url:
            exhibitions[0]?.hero.thumbUrl || exhibitions[0]?.hero.sourceUrl || "",
        },
      )

      for (const exhibition of exhibitions) {
        const slug = exhibition.slug as FullSlug
        const pageUrl = absolutePageUrl(cfg.baseUrl, exhibition.slug)
        yield* emit(slug, exhibition.title, exhibition.description, {
          exhibition_page: true,
          exhibition_manifest_json: JSON.stringify(exhibition),
          media_primary_thumb_url: exhibition.hero.thumbUrl || exhibition.hero.sourceUrl || "",
          media_primary_width: exhibition.hero.width,
          media_primary_height: exhibition.hero.height,
          structured_data_json: structuredData(exhibition, pageUrl),
          exhibition_item_count: exhibitionItemCount(exhibition),
          exhibition_featured_count: exhibitionFeaturedCount(exhibition),
          updated: exhibition.updatedAt,
        })
        for (const legacySlug of exhibition.legacySlugs ?? []) {
          yield write({
            ctx,
            content: redirectPage(exhibition.slug, pageUrl),
            slug: legacySlug as FullSlug,
            ext: ".html",
          })
        }
      }
    },
    async *partialEmit() {},
  }
}
