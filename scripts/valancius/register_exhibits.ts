/** Rebuild the durable editorial register from curated source and DB export. */
import { readFileSync, writeFileSync } from "node:fs"

const curation = JSON.parse(readFileSync("scripts/valancius/curation.json", "utf8"))
const catalogue = JSON.parse(readFileSync("quartz/static/mediaCatalogSource.json", "utf8")).entries
const register = Object.values(curation).flatMap((exhibition: any) =>
  exhibition.sections.flatMap((section: any) =>
    section.items.map((item: any) => {
      const asset = `/static/media/valancius/${item.file}`
      const media = catalogue.find((entry: any) => entry.displayUrl === asset)
      if (!media) throw new Error(`Missing exported exhibit ${item.key}`)
      return {
        ...item,
        exhibition: exhibition.slug,
        section: section.title,
        mediaId: media.mediaId,
        institution: media.institution,
        canonicalUrl: media.canonicalUrl,
        originalCatalogUrl: media.metadataEvidence,
        license: media.license,
        licenseUrl: media.licenseUrl,
        rightsNote: media.rightsNote,
        attribution: media.attribution,
        sourceUrl: media.sourceUrl,
        asset,
        width: media.width,
        height: media.height,
        reviewStatus: item.hold ? "publication-hold" : exhibition.status === "published" ? "approved-for-publication" : "reviewed-for-preview",
      }
    }),
  ),
)
if (register.length !== 16 || new Set(register.map((item: any) => item.mediaId)).size !== 16) {
  throw new Error("Unexpected cycle selection or duplicated exhibit")
}
writeFileSync("scripts/valancius/exhibit-register.json", JSON.stringify(register, null, 2) + "\n")
console.log(
  `${register.length} exhibits; ${register.filter((item: any) => item.hold).length} publication hold`,
)
