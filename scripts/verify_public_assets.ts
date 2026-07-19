import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const publicRoot = path.resolve("public")
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"])

function listImages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listImages(filePath)
    return entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())
      ? [filePath]
      : []
  })
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

console.log(JSON.stringify({ images: images.length, failures }, null, 2))
if (failures.length > 0) process.exitCode = 1
