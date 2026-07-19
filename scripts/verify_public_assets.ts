import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const publicRoot = path.resolve("public")
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"])
const minimumGalleryImages = Number(process.env.MIN_REQUIRED_GALLERY_IMAGES ?? "1000")

function listImages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listImages(filePath)
    return entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())
      ? [filePath]
      : []
  })
}

function listHtmlFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listHtmlFiles(filePath)
    return entry.isFile() && path.extname(entry.name).toLowerCase() === ".html"
      ? [filePath]
      : []
  })
}

function imageSources(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']*)["']/gi)].map((match) => match[1])
}

function readJsonFile<T>(filePath: string): T | undefined {
  if (!fs.existsSync(filePath)) return undefined
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
  } catch {
    return undefined
  }
}

type CatalogEntry = {
  mediaId?: unknown
  sourceUrl?: unknown
  thumbUrl?: unknown
}

function validImageUrl(value: unknown): boolean {
  try {
    const url = new URL(String(value ?? ""))
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

if (!fs.existsSync(publicRoot)) {
  throw new Error("public/ does not exist; run npm run build first")
}

const failures: string[] = []
const images = listImages(publicRoot)
for (const imagePath of images) {
  const relativePath = path.relative(process.cwd(), imagePath)
  if (fs.statSync(imagePath).size === 0) {
    failures.push(`${relativePath}: empty file`)
    continue
  }
  try {
    const metadata = await sharp(imagePath).metadata()
    if (!metadata.width || !metadata.height) {
      failures.push(`${relativePath}: missing dimensions`)
    }
  } catch (error) {
    failures.push(`${relativePath}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const htmlFiles = listHtmlFiles(publicRoot)
let imageTagCount = 0
for (const htmlPath of htmlFiles) {
  const html = fs.readFileSync(htmlPath, "utf8")
  for (const source of imageSources(html)) {
    imageTagCount += 1
    if (!source) {
      failures.push(`${path.relative(process.cwd(), htmlPath)}: image has an empty src`)
      continue
    }
    if (source.startsWith("http://") || source.startsWith("https://")) {
      try {
        const url = new URL(source)
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          failures.push(`${path.relative(process.cwd(), htmlPath)}: unsupported image URL ${source}`)
        }
      } catch {
        failures.push(`${path.relative(process.cwd(), htmlPath)}: invalid image URL ${source}`)
      }
      continue
    }
    if (source.startsWith("data:")) continue
    const cleanSource = decodeURIComponent(source.split("#")[0].split("?")[0])
    const localPath = cleanSource.startsWith("/")
      ? path.join(publicRoot, cleanSource.slice(1))
      : path.resolve(path.dirname(htmlPath), cleanSource)
    if (!localPath.startsWith(`${publicRoot}${path.sep}`) || !fs.existsSync(localPath)) {
      failures.push(`${path.relative(process.cwd(), htmlPath)}: missing local image ${source}`)
    }
  }
}

const catalog = readJsonFile<CatalogEntry[]>(path.join(publicRoot, "static/mediaCatalog.json"))
if (!Array.isArray(catalog)) {
  failures.push("static/mediaCatalog.json: missing or invalid generated catalog")
} else {
  const mediaIds = new Set<string>()
  catalog.forEach((entry, index) => {
    const mediaId = String(entry.mediaId ?? "").trim()
    if (!mediaId) failures.push(`static/mediaCatalog.json[${index}]: missing mediaId`)
    else if (mediaIds.has(mediaId)) failures.push(`static/mediaCatalog.json[${index}]: duplicate mediaId ${mediaId}`)
    else mediaIds.add(mediaId)
    if (!validImageUrl(entry.thumbUrl) && !validImageUrl(entry.sourceUrl)) {
      failures.push(`static/mediaCatalog.json[${index}]: missing valid image URL for ${mediaId || "entry"}`)
    }
  })

  if (catalog.length < minimumGalleryImages) {
    failures.push(
      `static/mediaCatalog.json: ${catalog.length} images, expected at least ${minimumGalleryImages}`,
    )
  }

  const galleryPath = path.join(publicRoot, "galerija", "index.html")
  const galleryHtml = fs.existsSync(galleryPath) ? fs.readFileSync(galleryPath, "utf8") : ""
  const bootstrapMatch = galleryHtml.match(
    /<script[^>]*data-media-bootstrap[^>]*>([\s\S]*?)<\/script>/i,
  )
  if (!bootstrapMatch) {
    failures.push("galerija/index.html: missing media gallery bootstrap")
  } else {
    try {
      const bootstrap = JSON.parse(bootstrapMatch[1]) as {
        totalCount?: unknown
        initialEntries?: unknown[]
      }
      if (Number(bootstrap.totalCount) !== catalog.length) {
        failures.push(
          `galerija/index.html: bootstrap total ${bootstrap.totalCount} does not match catalog ${catalog.length}`,
        )
      }
      if (!Array.isArray(bootstrap.initialEntries) || bootstrap.initialEntries.length === 0) {
        failures.push("galerija/index.html: gallery has no initial entries")
      }
    } catch {
      failures.push("galerija/index.html: invalid media gallery bootstrap JSON")
    }
  }
}

console.log(
  JSON.stringify(
    {
      localImages: images.length,
      htmlFiles: htmlFiles.length,
      imageTags: imageTagCount,
      catalogEntries: Array.isArray(catalog) ? catalog.length : 0,
      minimumGalleryImages,
      failures,
    },
    null,
    2,
  ),
)
if (failures.length > 0) process.exitCode = 1
