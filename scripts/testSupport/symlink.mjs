import { symlink } from "node:fs/promises"

/** Linux CI exercises symlink semantics; native unsupported filesystems report a skip. */
export async function createTestSymlink(t, target, destination, type) {
  try {
    await symlink(target, destination, type)
    return true
  } catch (error) {
    if (process.platform !== "win32" || !["EISDIR", "EPERM", "ENOTSUP", "EINVAL"].includes(error.code)) throw error
    t.skip(`Filesystem cannot create ${type ?? "file"} symlinks (${error.code}); exercised by Linux CI`)
    return false
  }
}
