import assert from "node:assert/strict"
import test from "node:test"
import { stripInlineCssSourceMaps } from "./stylesheets"

test("removes inline CSS source maps without touching stylesheet rules", () => {
  const stylesheet =
    ".card{color:red}/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozfQ== */\n.card:hover{color:blue}"

  assert.equal(stripInlineCssSourceMaps(stylesheet), ".card{color:red}\n.card:hover{color:blue}")
})
