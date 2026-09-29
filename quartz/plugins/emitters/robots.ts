import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug, joinSegments } from "../../util/path"

export function generateRobotsTxt(baseUrl?: string): string {
  const lines = ["User-agent: *", "Allow: /", "", "User-agent: OAI-SearchBot", "Allow: /"]
  if (baseUrl) {
    lines.push(`Sitemap: https://${joinSegments(baseUrl, "sitemap.xml")}`)
  }
  return `${lines.join("\n")}\n`
}

export const RobotsTxt: QuartzEmitterPlugin = () => ({
  name: "RobotsTxt",
  incrementalPolicy: "static",
  async emit(ctx) {
    const content = generateRobotsTxt(ctx.cfg.configuration.baseUrl)
    const path = await write({
      ctx,
      content,
      slug: "robots" as FullSlug,
      ext: ".txt",
    })
    return [path]
  },
  async *partialEmit() {},
})
