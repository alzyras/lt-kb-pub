import test, { describe } from "node:test"
import assert from "node:assert"
import { generateSiteMap, ContentDetails, ContentIndexMap } from "./contentIndex"
import { FilePath, FullSlug } from "../../util/path"
import { GlobalConfiguration } from "../../cfg"

const cfg = {
  baseUrl: "example.com/base",
} as GlobalConfiguration

function page(date?: Date, modifiedDate?: Date): ContentDetails {
  return {
    slug: "index" as FullSlug,
    filePath: "index.md" as FilePath,
    title: "Test",
    links: [],
    tags: [],
    content: "",
    date,
    modifiedDate,
  } as ContentDetails
}

describe("ContentIndex sitemap", () => {
  test("generates Google-compatible sitemap XML", () => {
    const idx: ContentIndexMap = new Map([
      [
        "index" as FullSlug,
        page(new Date("2026-05-01T12:00:00.000Z"), new Date("2026-05-06T12:00:00.000Z")),
      ],
      ["folder/page" as FullSlug, page()],
    ])

    const xml = generateSiteMap(cfg, idx)

    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
    assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
    assert.match(xml, /<loc>https:\/\/example\.com\/base\/<\/loc>/)
    assert.match(xml, /<loc>https:\/\/example\.com\/base\/folder\/page<\/loc>/)
    assert.match(xml, /<lastmod>2026-05-06T12:00:00\.000Z<\/lastmod>/)
    assert.doesNotMatch(xml, /<lastmod>2026-05-01T12:00:00\.000Z<\/lastmod>/)
    assert.doesNotMatch(xml, /undefined|false|xmlns:xhtml/)
  })
})
