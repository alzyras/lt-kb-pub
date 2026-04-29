import test, { describe } from "node:test"
import assert from "node:assert"
import { parseFrontmatterPeriodRange, visiblePeriodDisplay } from "./periodRange"

describe("periodRange", () => {
  test("renders canonical periodas as a human label", () => {
    const display = visiblePeriodDisplay({ periodas: "viduramziai" })
    assert.equal(display?.label, "Viduramžiai")
    assert.deepEqual(
      display?.chips.map((chip) => chip.label),
      ["Viduramžiai"],
    )
  })

  test("renders centuries as short roman chips", () => {
    const display = visiblePeriodDisplay({ amziai: ["XIV a.", "XV"] })
    assert.equal(display?.label, "XIV–XV")
    assert.deepEqual(
      display?.chips.map((chip) => chip.label),
      ["XIV", "XV"],
    )
    assert.deepEqual(
      display?.chips.map((chip) => chip.slug),
      ["laikotarpiai/XIV amžius", "laikotarpiai/XV amžius"],
    )
  })

  test("renders date interval and derives century chips", () => {
    const display = visiblePeriodDisplay({ date_start: "1392", date_end: "1430" })
    assert.equal(display?.label, "XIV–XV · 1392–1430")
    assert.deepEqual(
      display?.chips.map((chip) => chip.label),
      ["XIV", "XV", "1392–1430"],
    )
  })

  test("specific dates and centuries take precedence over broad periodas for filtering", () => {
    assert.deepEqual(
      parseFrontmatterPeriodRange({
        periodas: "viduramziai",
        date_start: "1392",
        date_end: "1430",
      }),
      { start: 1392, end: 1430 },
    )
  })

  test("empty period fields render nothing", () => {
    assert.equal(
      visiblePeriodDisplay({ periodas: "", amziai: [], date_start: "", date_end: "" }),
      undefined,
    )
  })
})
