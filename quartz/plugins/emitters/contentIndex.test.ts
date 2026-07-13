import test, { describe } from "node:test"
import assert from "node:assert"
import {
  generateSiteMap,
  filterPublicNavigationLinks,
  ContentDetails,
  ContentIndexMap,
} from "./contentIndex"
import { FilePath, FullSlug, SimpleSlug } from "../../util/path"
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

  test("adds generated gallery pages and image locations to the sitemap", () => {
    const idx: ContentIndexMap = new Map([["index" as FullSlug, page()]])

    const xml = generateSiteMap(cfg, idx, [
      {
        slug: "galerija" as FullSlug,
        modifiedDate: new Date("2026-07-13T10:00:00.000Z"),
        imageUrls: ["https://upload.wikimedia.org/example/Vytautas portrait.jpg"],
      },
      {
        slug: "galerija/vytauto-portretas--m-one" as FullSlug,
        imageUrls: ["https://upload.wikimedia.org/example/Vytautas portrait.jpg"],
      },
    ])

    assert.match(xml, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/)
    assert.match(xml, /<loc>https:\/\/example\.com\/base\/galerija<\/loc>/)
    assert.match(
      xml,
      /<loc>https:\/\/example\.com\/base\/galerija\/vytauto-portretas--m-one<\/loc>/,
    )
    assert.match(
      xml,
      /<image:loc>https:\/\/upload\.wikimedia\.org\/example\/Vytautas portrait\.jpg<\/image:loc>/,
    )
    assert.match(xml, /<lastmod>2026-07-13T10:00:00\.000Z<\/lastmod>/)
  })
})

describe("ContentIndex links", () => {
  test("filters broad navigation-only targets from the public link index", () => {
    const links = filterPublicNavigationLinks([
      "objektai/asmenys/Vytautas",
      "objektai/vietos/Trakai",
      "objektai/saltiniai/A",
      "laikotarpiai/XV amžius",
      "temos/valdovas",
    ] as SimpleSlug[])

    assert.deepStrictEqual(links, ["objektai/asmenys/Vytautas", "temos/valdovas"])
  })

  test("drops outgoing links from broad navigation-only pages", () => {
    const links = filterPublicNavigationLinks(
      ["objektai/asmenys/Vytautas", "temos/valdovas"] as SimpleSlug[],
      "laikotarpiai/XX-amzius",
    )

    assert.deepStrictEqual(links, [])
  })

  test("keeps theme browse lists out of graph edges", () => {
    assert.deepStrictEqual(
      filterPublicNavigationLinks(
        ["objektai/asmenys/Vytautas" as SimpleSlug],
        "temos/valdovas" as SimpleSlug,
      ),
      [],
    )
  })
})
