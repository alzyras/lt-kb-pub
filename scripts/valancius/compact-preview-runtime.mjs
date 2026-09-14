/** Local macOS/APFS build aid, not a website or publishing feature.
 * Preload with node --import. Transparently compresses ONLY generated files
 * under this isolated worktree's public/. Every copy is byte-verified.
 * The normal filesystem API, preview server and all audits remain unchanged.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { syncBuiltinESMExports } from "node:module"

const root = fileURLToPath(new URL("../../", import.meta.url))
if (
  process.platform !== "darwin" ||
  path.basename(root.replace(/\/$/, "")) !== "lt-kb-pub-valancius"
) {
  throw new Error("This compression aid is restricted to the isolated macOS Valančius preview")
}
const outputs = ["public", "public-review-final"].map(name => path.resolve(root, name) + path.sep)
const originalWrite = fs.promises.writeFile.bind(fs.promises)
const run = promisify(execFile)
for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.once(signal, () => {
    process.stderr.write(`[build-signal] ${new Date().toISOString()} ${signal} pid=${process.pid} ppid=${process.ppid}\n`)
    process.removeAllListeners(signal)
    process.kill(process.pid, signal)
  })
}
fs.promises.writeFile = async function (file, data, options) {
  const filename = typeof file === "string" ? path.resolve(file) : ""
  if (!outputs.some(output => filename.startsWith(output)) || !/\.(html|json|xml|css|js|txt|svg)$/.test(filename)) {
    return originalWrite(file, data, options)
  }
  // Avoid extending an already near-limit historical alias filename (APFS: 255 bytes).
  // Small redirect files don't benefit enough from spawning a compression process.
  if ((typeof data === "string" ? Buffer.byteLength(data) : data?.byteLength) < 8192)
    return originalWrite(file, data, options)
  const temporary = path.join(path.dirname(filename), `.valancius-${randomUUID()}.tmp`)
  await originalWrite(temporary, data, options)
  await run("/usr/bin/ditto", ["--hfsCompression", temporary, filename])
  const [before, after] = await Promise.all([
    fs.promises.readFile(temporary),
    fs.promises.readFile(filename),
  ])
  if (!before.equals(after))
    throw new Error(`Compression byte mismatch: ${filename}; original preserved at ${temporary}`)
  await fs.promises.unlink(temporary)
}
syncBuiltinESMExports()
