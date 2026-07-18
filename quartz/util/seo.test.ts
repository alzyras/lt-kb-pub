import assert from "node:assert/strict"
import test from "node:test"
import { isPoorSeoPage, pageStructuredData, seoDescription, seoTitle } from "./seo"

test("normalizes long metadata into search-sized title and description", () => {
  const input = { title: "Labai ilgas Lietuvos istorijos objekto pavadinimas su pertekliniu paaiškinimu", description: "Tai ilgas, bet naudingas aprašymas. Antras sakinys neturi patekti į meta description, jei nebetelpa." }
  assert.ok(seoTitle(input, "Lietuvos istorija", " – Lietuvos istorija").length <= 60)
  assert.ok(seoDescription(input).length <= 158)
})

test("marks placeholders and broken OCR text as noindex", () => {
  assert.equal(isPoorSeoPage({ title: "Objektas", description: "Santrauka Nenurodyta" }), true)
  assert.equal(isPoorSeoPage({ title: "Objektas", text: "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d" }), true)
  assert.equal(isPoorSeoPage({ title: "Vytautas Didysis", description: "Lietuvos didysis kunigaikštis." }), false)
})

test("emits entity, image and breadcrumbs JSON-LD", () => {
  const data = pageStructuredData({ slug: "objektai/asmenys/Vytautas-Didysis", title: "Vytautas Didysis", description: "Lietuvos didysis kunigaikštis ir valdovas.", itemType: "asmuo", baseUrl: "example.com", canonicalUrl: "https://example.com/objektai/asmenys/Vytautas-Didysis", mediaUrl: "https://images.example/vytautas.jpg" }) as any
  assert.equal(data["@graph"][1]["@type"], "BreadcrumbList")
  assert.equal(data["@graph"][2]["@type"], "Person")
  assert.equal(data["@graph"][3]["@type"], "ImageObject")
})
