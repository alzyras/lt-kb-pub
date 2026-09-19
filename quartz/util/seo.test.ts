import assert from "node:assert/strict"
import test from "node:test"
import { isPoorSeoPage, pageStructuredData, seoDescription, seoTitle, seoImageUrl } from "./seo"

test("explicit B SEO titles remain complete when the site suffix would truncate them", () => {
  for (const title of ["Valančius ir blaivybė: kaip keitėsi kaimas", "Valančiaus blaivybės sąjūdis: skaitmeninė paroda"]) {
    assert.equal(seoTitle({seoTitle: title, title: "Ilgoji redakcinė antraštė"}, "Lietuvos istorija", " – Lietuvos istorija"), title)
  }
  assert.match(seoTitle({title: "Labai ilga ankstesnio puslapio antraštė, kuriai paliekamas senas elgesys"}, "Lietuvos istorija", " – Lietuvos istorija"), /… – Lietuvos istorija$/)
})

test("social and structured-data image URLs are absolute for local media", () => {
  assert.equal(
    seoImageUrl("/static/valancius.jpg", "example.com"),
    "https://example.com/static/valancius.jpg",
  )
  assert.equal(
    seoImageUrl("https://cdn.example.com/a.jpg", "example.com"),
    "https://cdn.example.com/a.jpg",
  )
  const data = pageStructuredData({
    title: "Straipsnis",
    itemType: "straipsnis",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/a/",
    mediaUrl: "/static/a.jpg",
  }) as any
  assert.equal(
    data["@graph"].find((e: any) => e["@type"] === "Article").image,
    "https://example.com/static/a.jpg",
  )
  assert.equal(
    data["@graph"].find((e: any) => e["@type"] === "ImageObject").contentUrl,
    "https://example.com/static/a.jpg",
  )
})

test("editorial articles have one Article with organization author and real dates", () => {
  const data = pageStructuredData({
    title: "Ilgoji antraštė",
    itemType: "straipsnis",
    author: "Lietuvos istorijos žinių lobynas",
    datePublished: "2026-09-13",
    dateModified: "2026-09-13",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/straipsniai/a/",
    mediaUrl: "https://example.com/a.jpg",
  }) as any
  const articles = data["@graph"].filter((e: any) => e["@type"] === "Article")
  assert.equal(articles.length, 1)
  assert.equal(articles[0].author["@type"], "Organization")
  assert.equal(articles[0].datePublished, "2026-09-13")
  assert.equal(articles[0].image, "https://example.com/a.jpg")
})

test("a curated CollectionPage does not acquire a contradictory generic entity", () => {
  const data = pageStructuredData({
    title: "Paroda",
    collectionPage: true,
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/parodos/a/",
  }) as any
  assert.equal(data["@graph"].filter((e: any) => e["@type"] === "Thing").length, 0)
  assert.equal(data["@graph"][0].mainEntity, undefined)
})

test("a curated SEO title leaves the editorial heading intact and falls back when empty", () => {
  const input = {
    title: "Motiejus Valančius ir Rusijos imperija: tarp lojalumo ir pasipriešinimo",
    seoTitle: "Motiejus Valančius ir Rusijos imperija",
  }
  assert.equal(
    seoTitle(input, "Lietuvos istorija", " – Lietuvos istorija"),
    "Motiejus Valančius ir Rusijos imperija – Lietuvos istorija",
  )
  assert.ok(input.title.endsWith("tarp lojalumo ir pasipriešinimo"))
  assert.equal(
    seoTitle({ title: "Ankstesnis puslapis", seoTitle: " " }, "Lietuvos istorija", ""),
    "Ankstesnis puslapis",
  )
})

test("normalizes long metadata into search-sized title and description", () => {
  const input = {
    title: "Labai ilgas Lietuvos istorijos objekto pavadinimas su pertekliniu paaiškinimu",
    description:
      "Tai ilgas, bet naudingas aprašymas. Antras sakinys neturi patekti į meta description, jei nebetelpa.",
  }
  assert.ok(seoTitle(input, "Lietuvos istorija", " – Lietuvos istorija").length <= 60)
  assert.ok(seoDescription(input).length <= 158)
})

test("marks placeholders and broken OCR text as noindex", () => {
  assert.equal(isPoorSeoPage({ title: "Objektas", description: "Santrauka Nenurodyta" }), true)
  assert.equal(
    isPoorSeoPage({
      title: "Objektas",
      text: "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d",
    }),
    true,
  )
  assert.equal(
    isPoorSeoPage({
      title: "Steponas Girdžiūnas-Gegužis",
      description:
        "Santrauka GirdžiūnuiGegužiui ir kitiems LLA organizatoriams pavyko sukurti Žaliosios girios Panevėžio apylinkių partizanai 5 a 4 jokias j oe — > ž + 4 © my",
    }),
    true,
  )
  assert.equal(
    isPoorSeoPage({ title: "Vytautas Didysis", description: "Lietuvos didysis kunigaikštis." }),
    false,
  )
  assert.equal(
    isPoorSeoPage({
      title: "Vytautas Didysis",
      description:
        "Vytautas valdė 1392–1430 m.; jo valdymo laikotarpis svarbus Lietuvos Didžiosios Kunigaikštystės istorijai.",
    }),
    false,
  )
})

test("emits entity, image and breadcrumbs JSON-LD", () => {
  const data = pageStructuredData({
    slug: "objektai/asmenys/Vytautas-Didysis",
    title: "Vytautas Didysis",
    description: "Lietuvos didysis kunigaikštis ir valdovas.",
    itemType: "asmuo",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/objektai/asmenys/Vytautas-Didysis",
    mediaUrl: "https://images.example/vytautas.jpg",
  }) as any
  assert.equal(data["@graph"][1]["@type"], "BreadcrumbList")
  assert.equal(data["@graph"][2]["@type"], "Person")
  assert.equal(data["@graph"][3]["@type"], "ImageObject")
  assert.deepEqual(data["@graph"][0].mainEntity, {
    "@id": "https://example.com/objektai/asmenys/Vytautas-Didysis#entity",
  })
})

test("uses conservative but distinct object entity types", () => {
  const base = {
    title: "Pavyzdys",
    description: "Patikrintas Lietuvos istorijos žinyno įrašas su šaltiniais.",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/objektai/pavyzdys",
  }
  assert.equal(
    (pageStructuredData({ ...base, itemType: "posakis" }) as any)["@graph"][2]["@type"],
    "Quotation",
  )
  assert.equal(
    (pageStructuredData({ ...base, itemType: "zodyno_irasas" }) as any)["@graph"][2]["@type"],
    "DefinedTerm",
  )
  assert.equal(
    (pageStructuredData({ ...base, itemType: "grupe" }) as any)["@graph"][2]["@type"],
    "Organization",
  )
})

test("keeps the page graph while letting a media detail page own its ImageObject", () => {
  const data = pageStructuredData({
    slug: "galerija/vaizdas--m-1",
    title: "Istorinis vaizdas",
    description: "Patikrintas istorinis vaizdas su šaltiniu.",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/galerija/vaizdas--m-1",
    mediaUrl: "https://images.example/vaizdas.jpg",
    primaryImageId: "https://example.com/galerija/vaizdas--m-1#image",
    includePrimaryImageObject: false,
  }) as any
  assert.equal(data["@graph"].filter((node: any) => node["@type"] === "ImageObject").length, 0)
  assert.deepEqual(data["@graph"][0].primaryImageOfPage, {
    "@id": "https://example.com/galerija/vaizdas--m-1#image",
  })
})

test("includes only verified HTTPS identity URLs on the structured entity", () => {
  const data = pageStructuredData({
    slug: "objektai/asmenys/Vytautas",
    title: "Vytautas",
    description: "Lietuvos istorijos valdovas, aprašytas remiantis patikrintais šaltiniais.",
    itemType: "asmuo",
    baseUrl: "example.com",
    canonicalUrl: "https://example.com/objektai/asmenys/Vytautas/",
    sameAs: ["https://www.wikidata.org/entity/Q218186", "javascript:alert(1)"],
  }) as any
  assert.deepEqual(data["@graph"][2].sameAs, ["https://www.wikidata.org/entity/Q218186"])
})
