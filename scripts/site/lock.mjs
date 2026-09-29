import { hostname } from "node:os"
import { mkdir, readFile, rm, rmdir, writeFile } from "node:fs/promises"
import path from "node:path"

function ownerIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error?.code === "EPERM"
  }
}

async function readOwner(lockDirectory) {
  try {
    const parsed = JSON.parse(await readFile(path.join(lockDirectory, "owner.json"), "utf8"))
    if (!Number.isSafeInteger(parsed.pid) || typeof parsed.host !== "string") return undefined
    return parsed
  } catch {
    return undefined
  }
}

async function claimLock(lockDirectory, root) {
  try {
    await mkdir(lockDirectory)
  } catch (error) {
    if (error?.code !== "EEXIST") throw error
    const owner = await readOwner(lockDirectory)
    if (!owner) throw new Error(`Site regeneration lock has no valid owner: ${lockDirectory}`)
    if (owner.host !== hostname()) {
      throw new Error(
        `Site regeneration lock belongs to another host (${owner.host}); inspect ${lockDirectory}`,
      )
    }
    if (ownerIsAlive(owner.pid)) {
      throw new Error(`Site regeneration is already running (pid ${owner.pid}) for ${root}`)
    }
    await rm(lockDirectory, { recursive: true, force: true })
    try {
      await mkdir(lockDirectory)
    } catch (retryError) {
      if (retryError?.code === "EEXIST")
        throw new Error(`Site regeneration lock was claimed concurrently for ${root}`)
      throw retryError
    }
  }

  try {
    await writeFile(
      path.join(lockDirectory, "owner.json"),
      `${JSON.stringify({ pid: process.pid, host: hostname(), root, startedAt: new Date().toISOString() })}\n`,
      { flag: "wx", encoding: "utf8" },
    )
  } catch (error) {
    await rm(lockDirectory, { recursive: true, force: true })
    throw error
  }
}

export async function withSiteLock(root, operation) {
  const lockDirectory = path.join(root, ".cache", "site-regenerate", "runner.lock")
  await mkdir(path.dirname(lockDirectory), { recursive: true })
  await claimLock(lockDirectory, root)
  try {
    return await operation()
  } finally {
    await rm(path.join(lockDirectory, "owner.json"), { force: true })
    await rmdir(lockDirectory).catch(() => {})
  }
}
