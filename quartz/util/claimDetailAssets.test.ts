import assert from "node:assert/strict"
import test from "node:test"
import { extractClaimDetailAssets } from "./claimDetailAssets"

test("moves lazy claim details into deterministic static assets", () => {
  const page =
    '<tr><script type="application/json" data-claim-detail-payload="true">"&lt;p&gt;Citata&lt;/p&gt;"</script></tr>'
  const first = extractClaimDetailAssets(page, "objektai/asmenys/Vytautas" as any)
  const second = extractClaimDetailAssets(page, "objektai/asmenys/Vytautas" as any)
  const changed = extractClaimDetailAssets(
    '<tr><script type="application/json" data-claim-detail-payload="true">"&lt;p&gt;Kita citata&lt;/p&gt;"</script></tr>',
    "objektai/asmenys/Vytautas" as any,
  )

  assert.equal(first.assets.length, 1)
  assert.equal(first.assets[0].payload, '"&lt;p&gt;Citata&lt;/p&gt;"')
  assert.equal(first.assets[0].slug, second.assets[0].slug)
  assert.notEqual(first.assets[0].slug, changed.assets[0].slug)
  assert.match(first.html, /data-claim-detail-url="\/static\/claim-details\/[a-f0-9]{24}\.json"/)
  assert.doesNotMatch(first.html, /data-claim-detail-payload/)
})
