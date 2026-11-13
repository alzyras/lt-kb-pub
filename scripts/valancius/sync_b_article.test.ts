import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import matter from "gray-matter"
import { articlePath, sourcePath, renderBArticle } from "./sync_b_article.mjs"

const read = (file: string) => fs.readFileSync(file, "utf8")
const source = read(sourcePath)
const article = read(articlePath)

test("B article sync is exact and idempotent, including metadata and captions", () => {
  const rendered = renderBArticle(source, article)
  assert.equal(rendered, article)
  assert.equal(renderBArticle(source, rendered), rendered)
  assert.equal(matter(source).data.atnaujinta, matter(article).data.atnaujinta)
  assert.equal(matter(article).data.image, matter(article).data.media_primary_thumb_url)
})

test("B keeps its seven evidence cards and eight distinct marked illustrations", () => {
  assert.equal([...article.matchAll(/<details class="article-evidence">/g)].length, 7)
  assert.equal([...article.matchAll(/<figure class="valancius-figure">/g)].length, 8)
  assert.equal(new Set([...article.matchAll(/<!-- FIGURE ([\w-]+) -->/g)].map((m) => m[1])).size, 8)
  const changed = renderBArticle(source.replace("Apie 11 min.", "Apie 12 min."), article)
  const cards = (text: string) =>
    text.match(/<details class="article-evidence">[\s\S]*?<\/details>/g)
  assert.deepEqual(cards(changed), cards(article))
  assert.equal(matter(changed).data.image, matter(article).data.image)
})

test("B sync refuses missing, duplicate and unknown insertion markers", () => {
  assert.throws(
    () => renderBArticle(source.replace("<!-- EVIDENCE pradzia -->", ""), article),
    /Expected one marker/,
  )
  assert.throws(
    () => renderBArticle(source + "\n<!-- EVIDENCE pradzia -->", article),
    /Expected one marker/,
  )
  assert.throws(
    () => renderBArticle(source + "\n<!-- EVIDENCE unknown -->", article),
    /Unresolved evidence marker/,
  )
  assert.throws(
    () => renderBArticle(source, article.replace('class="article-evidence"', 'class="missing"')),
    /seven/,
  )
  assert.throws(
    () => renderBArticle(source, article.replace("<!-- FIGURE medalis -->", "")),
    /eight/,
  )
  assert.throws(
    () => renderBArticle(source + "\n<!-- FIGURE unknown -->", article),
    /Unknown illustration/,
  )
  assert.throws(
    () => renderBArticle(source + "\n<!-- CAPTION unknown: Text -->", article),
    /Unknown illustration/,
  )
  assert.throws(
    () =>
      renderBArticle(
        source,
        article.replace(
          /<figcaption>Motiejus Valančius,/,
          "<figcaption-missing>Motiejus Valančius,",
        ),
      ),
    /Missing replaceable caption/,
  )
})

test("B distinguishes institutional context, economic quantities and imprint from interpretation", () => {
  assert.ok(source.includes("leidinio rengėjų aprašyta raštų perdavimo bei viešo skaitymo tvarka"))
  assert.ok(!source.includes("Puzaro aprašytas jų skaitymas"))
  assert.ok(source.includes("Šios atramos nenustato tikslaus vykdymo masto ar žmonių reakcijų."))
  assert.ok(source.includes("metinį nuostolį"))
  assert.ok(source.includes("anksčiau davusius iki 100 000 rublių pajamų"))
  assert.ok(source.includes("pats Puzaras išnašoje nuostolio dydį vadina neaiškiu"))
  assert.ok(source.includes("gamybos ir pardavimo apimčių sutapatinti negalima"))
  assert.ok(source.includes("https://doi.org/10.15388/Knygotyra.44.4"))
  assert.match(
    article,
    /<figcaption>Motiejus Valančius, „Apej brostwą błaiwistes arba nusiturieima“, 1861 m\. Antraštiniame lape nurodyta Klaipėda/,
  )
  assert.ok(
    !article.includes("Pranciškus Smuglevičius (Franciszek Smuglewicz). Pranciškus Smuglevičius."),
  )
  assert.ok(!article.includes("1849. 1849."))
  assert.ok(!article.includes("1857. 1857."))
})
