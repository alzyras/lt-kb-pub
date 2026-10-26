import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { hasPublishedObjectHref, publicObjectHref } from "./publicObjectRoutes"
import { loadRulers, rulerExhibitionSlug } from "./rulers"

test("object navigation uses only certified PostgreSQL notes or existing cited sources", () => {
  const projection = JSON.parse(fs.readFileSync("public-projection-manifest.json", "utf8"))
  assert.equal(projection.source, "postgresql:lithuanianhistory.workflow")
  assert.ok(hasPublishedObjectHref("/objektai/asmenys/Vytautas"))
  assert.equal(publicObjectHref("/objektai/asmenys/Vytautas", [], "/"), "/objektai/asmenys/Vytautas")
  assert.equal(publicObjectHref("/objektai/asmenys/missing-person", [{url: "https://example.org/exact-person"}], "/parodos/example"), "https://example.org/exact-person")
  assert.equal(publicObjectHref("/objektai/asmenys/missing-person", [], "/parodos/example#person"), "/parodos/example#person")
})

test("ambiguous Daumantas is never silently redirected to another person's note", () => {
  const ruler = loadRulers().find(ruler => ruler.id === "daumantas")!
  assert.match(ruler.notice, /Negalima automatiškai tapatinti/)
  if (!ruler.biographyAvailable) assert.equal(ruler.href, `/${rulerExhibitionSlug}#daumantas`)
})
