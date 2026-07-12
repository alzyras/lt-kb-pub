import { Element, ElementContent, Root as HTMLRoot, RootContent } from "hast"
import { toString } from "hast-util-to-string"
import { QuartzTransformerPlugin } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import {
  cleanText,
  directnessLabel,
  displayCaption,
  displayMeta,
  isObjectPage,
  objectGallerySlug,
  objectMediaSet,
  relationLabel,
} from "../../util/objectMedia"

function text(value: string): ElementContent {
  return { type: "text", value }
}

function element(tagName: string, properties: Element["properties"], children: ElementContent[] = []): Element {
  return { type: "element", tagName, properties, children }
}

function chip(label: string, className: string): Element {
  return element("span", { className: ["object-primary-media-chip", className] }, [text(label)])
}

function hasClass(node: RootContent, className: string): boolean {
  if (node.type !== "element") return false
  const classes = node.properties?.className
  return Array.isArray(classes) ? classes.includes(className) : classes === className
}

function isSummaryHeading(node: RootContent): boolean {
  if (node.type !== "element" || node.tagName !== "h2") return false
  return toString(node).replace(/\s+/g, " ").trim().toLowerCase() === "santrauka"
}

export const ObjectPrimaryMedia: QuartzTransformerPlugin = () => ({
  name: "ObjectPrimaryMedia",
  htmlPlugins() {
    return [
      () => {
        return (tree: HTMLRoot, file) => {
          const rawSlug = file.data.slug
          if (!rawSlug || !isObjectPage(rawSlug) || rawSlug.endsWith("/galerija")) return
          const slug = rawSlug as FullSlug
          if (tree.children.some((child) => hasClass(child, "object-primary-media"))) return

          const { direct, contextual, all, fallbackPrimary, totalCount } = objectMediaSet(file.data.frontmatter)
          if (!fallbackPrimary || all.length === 0) return

          const imageSrc = fallbackPrimary.thumbUrl || fallbackPrimary.canonicalUrl || ""
          if (!imageSrc) return

          const objectTitle = cleanText(file.data.frontmatter?.title)
          const galleryHref = resolveRelative(slug, objectGallerySlug(slug))
          const sourceHref = fallbackPrimary.canonicalUrl || fallbackPrimary.thumbUrl || "#"
          const meta = displayMeta(fallbackPrimary)
          const license = cleanText(fallbackPrimary.license)

          const provider = cleanText(fallbackPrimary.provider).toLowerCase() || "other"
          const section = element("section", {
            className: ["object-primary-media"],
            "data-media-source-id": `media-${provider}`,
          }, [
            element("a", {
              className: ["object-primary-media-figure"],
              href: sourceHref,
              target: "_blank",
              rel: "noreferrer noopener",
            }, [
              element("img", {
                src: imageSrc,
                alt: displayCaption(fallbackPrimary),
                loading: "eager",
                decoding: "async",
              }),
            ]),
            element("div", { className: ["object-primary-media-copy"] }, [
              element("p", { className: ["object-primary-media-eyebrow"] }, [
                text(fallbackPrimary.directness === "direct" ? "Pagrindinis atvaizdas" : "Pagrindinis susijęs vaizdas"),
              ]),
              element("h3", {}, [text(displayCaption(fallbackPrimary))]),
              element("div", { className: ["object-primary-media-chips"] }, [
                chip(directnessLabel(fallbackPrimary.directness), "object-primary-media-chip-directness"),
                chip(relationLabel(fallbackPrimary.relationType), "object-primary-media-chip-relation"),
                ...(Number(fallbackPrimary.isPrimary ?? 0) === 1
                  ? [chip("Pirminis", "object-primary-media-chip-primary")]
                  : []),
              ]),
              ...(meta ? [element("p", { className: ["object-primary-media-meta"] }, [text(meta)])] : []),
              ...(license ? [element("p", { className: ["object-primary-media-license"] }, [text(`Licencija: ${license}`)])] : []),
              ...(fallbackPrimary.directness !== "direct" && direct.length === 0
                ? [
                    element("p", { className: ["object-primary-media-note"] }, [
                      text("Tiesioginio portretinio ar analogiško atvaizdo dar neturime, todėl rodomas geriausias susijęs vaizdas."),
                    ]),
                  ]
                : []),
              element("p", { className: ["object-primary-media-actions"] }, [
                element("a", { href: galleryHref }, [text(`Eiti į galeriją (${objectTitle || "objektas"})`)]),
                text(" "),
                element("a", { href: sourceHref, target: "_blank", rel: "noreferrer noopener" }, [text("Atidaryti šaltinį")]),
              ]),
              element("p", { className: ["object-primary-media-count"] }, [
                text(`${totalCount} vaizd. / ${direct.length} tiesiog. / ${contextual.length} susij.`),
              ]),
            ]),
          ])

          const summaryIndex = tree.children.findIndex(isSummaryHeading)
          if (summaryIndex === -1) return

          let insertIndex = summaryIndex + 1
          while (insertIndex < tree.children.length) {
            const node = tree.children[insertIndex]
            if (node.type === "element" && node.tagName === "h2") break
            insertIndex += 1
          }

          tree.children.splice(insertIndex, 0, section)
        }
      },
    ]
  },
})
