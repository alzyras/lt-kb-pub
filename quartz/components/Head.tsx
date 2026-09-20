import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
import {
  isPoorSeoPage,
  pageStructuredData,
  seoDescription,
  seoTitle,
  seoImageUrl,
} from "../util/seo"
import { displayCaption, isObjectPage, parseMediaEntry } from "../util/objectMedia"
import {
  isObjectDetailSlug,
  objectDetailEvidenceFromFile,
  objectPageIndexable,
} from "../util/objectDetail"

function publishedExternalUrls(value: unknown): string[] {
  const raw = typeof value === "string" ? (() => {
    try { return JSON.parse(value) } catch { return null }
  })() : value
  if (!Array.isArray(raw)) return []
  return [...new Set(raw
    .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object"))
    .filter((row) => !row.status || row.status === "published")
    .map((row) => String(row.canonical_url ?? row.url ?? "").trim())
    .filter((url) => /^https:\/\//i.test(url)))]
}

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleBase = String(
      (isObjectPage(fileData.slug) ? fileData.frontmatter?.pavadinimas : undefined) ??
        fileData.frontmatter?.title ??
        i18n(cfg.locale).propertyDefaults.title,
    ).trim()
    const siteTitle = String(cfg.pageTitle ?? "").trim()
    const titleSuffix = titleBase === siteTitle ? "" : (cfg.pageTitleSuffix ?? "")
    const descriptionSource =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      fileData.frontmatter?.object_page_seo_description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)
    const objectClaimCount = Number(fileData.frontmatter?.object_page_claim_count ?? 0)
    const sameAs = publishedExternalUrls(fileData.frontmatter?.external_sources_json)
    const seoInput = {
      slug: fileData.slug,
      title: titleBase,
      seoTitle: fileData.frontmatter?.seo_title,
      author: fileData.frontmatter?.autorius,
      datePublished: fileData.frontmatter?.date,
      collectionPage: fileData.frontmatter?.exhibition_page === true,
      description: descriptionSource,
      text: fileData.text,
      itemType: fileData.frontmatter?.tipas,
      noindex: fileData.frontmatter?.noindex,
      objectContentState: fileData.frontmatter?.object_page_content_state,
      claimCount: objectClaimCount,
      claimSummary: fileData.frontmatter?.object_page_seo_description,
      sameAs,
      dateModified: fileData.frontmatter?.atnaujinta ?? fileData.frontmatter?.modified,
    }
    const title = seoTitle(seoInput, siteTitle, titleSuffix)
    const description = seoDescription(seoInput)
    const utilityPage = new Set(["nustatymai", "duomenu-istrynimas"])
    const objectDetail = isObjectDetailSlug(fileData.slug)
    const objectEvidence = objectDetail
      ? objectDetailEvidenceFromFile(fileData.filePath)
      : undefined
    const noindex =
      utilityPage.has(String(fileData.slug ?? "").replace(/\/index$/, "")) ||
      (objectDetail ? !objectPageIndexable(objectEvidence!) : isPoorSeoPage(seoInput))
    const mediaPrimaryThumb =
      String(fileData.frontmatter?.media_primary_thumb_url ?? "").trim() ||
      String(fileData.frontmatter?.media_primary_canonical_url ?? "").trim()
    const mediaPrimaryWidth = Number(fileData.frontmatter?.media_primary_width ?? 0)
    const mediaPrimaryHeight = Number(fileData.frontmatter?.media_primary_height ?? 0)
    const mediaEntry =
      parseMediaEntry(fileData.frontmatter?.media_detail_json) ??
      parseMediaEntry(fileData.frontmatter?.media_primary_json)
    const mediaSocialAlt =
      String(fileData.frontmatter?.media_social_alt ?? "").trim() ||
      (mediaEntry ? displayCaption(mediaEntry) : "") ||
      titleBase ||
      description
    const customImageSchemaId = String(fileData.frontmatter?.media_schema_image_id ?? "").trim()
    const structuredDataValue = fileData.frontmatter?.structured_data_json
    const structuredData =
      typeof structuredDataValue === "string"
        ? structuredDataValue.trim()
        : structuredDataValue && typeof structuredDataValue === "object"
          ? JSON.stringify(structuredDataValue)
          : ""

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const publicPageUrl = (slug: string) => {
      const cleanSlug = slug.replace(/\/(?:index|index\.html)$/i, "").replace(/\.html$/i, "")
      if (!cleanSlug || cleanSlug === "index") return url.toString()
      return new URL(`/${cleanSlug.replace(/^\/+/, "")}/`, url).toString()
    }
    const socialUrl = fileData.slug === "404" ? url.toString() : publicPageUrl(fileData.slug!)
    const canonicalUrl = fileData.slug === "404" ? undefined : socialUrl
    const automaticStructuredData =
      canonicalUrl && cfg.baseUrl
        ? JSON.stringify(
            pageStructuredData({
              ...seoInput,
              baseUrl: cfg.baseUrl,
              canonicalUrl,
              mediaUrl: mediaPrimaryThumb || undefined,
              mediaWidth: mediaPrimaryWidth || undefined,
              mediaHeight: mediaPrimaryHeight || undefined,
              primaryImageId: customImageSchemaId || undefined,
              includePrimaryImageObject: !customImageSchemaId,
              sameAs: Array.isArray(fileData.frontmatter?.sameAs)
                ? fileData.frontmatter.sameAs.map((value) => String(value))
                : [],
            }),
          )
        : ""

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image-ldk-map.jpg`
    const ogImagePath = seoImageUrl(
      mediaPrimaryThumb || ogImageDefaultPath,
      cfg.baseUrl ?? "example.com",
    )

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="msvalidate.01" content="AE02E81D7A17D88CE5D3EB45689C0071" />

        <meta property="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta
          property="og:type"
          content={
            fileData.slug?.startsWith("straipsniai/") || objectDetail ? "article" : "website"
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={mediaSocialAlt} />
        <meta name="twitter:image:alt" content={mediaSocialAlt} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImagePath} />
            <meta property="og:image:url" content={ogImagePath} />
            <meta name="twitter:image" content={ogImagePath} />
            {(mediaPrimaryWidth > 0 || !mediaPrimaryThumb) && (
              <meta
                property="og:image:width"
                content={String(mediaPrimaryWidth > 0 ? mediaPrimaryWidth : 1200)}
              />
            )}
            {(mediaPrimaryHeight > 0 || !mediaPrimaryThumb) && (
              <meta
                property="og:image:height"
                content={String(mediaPrimaryHeight > 0 ? mediaPrimaryHeight : 675)}
              />
            )}
            {!mediaPrimaryThumb && <meta property="og:image:type" content="image/jpeg" />}
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex,follow" />}
        <meta name="generator" content="Quartz" />
        {automaticStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: automaticStructuredData.replace(/</g, "\\u003c") }}
          />
        )}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: structuredData.replace(/</g, "\\u003c") }}
          />
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
