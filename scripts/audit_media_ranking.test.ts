import assert from "node:assert/strict"
import test from "node:test"
import {
  openedMediaIdFromTelemetryRecord,
  parseMediaRankingTelemetryCsv,
} from "./audit_media_ranking"

test("reads media opens from flattened GA4 and BigQuery exports", () => {
  assert.equal(
    openedMediaIdFromTelemetryRecord({
      eventName: "gallery_open",
      "customEvent:media_id": "m-flat",
    }),
    "m-flat",
  )
  assert.equal(
    openedMediaIdFromTelemetryRecord({
      event_name: "feature_use",
      event_params: [
        { key: "feature_name", value: { string_value: "media_gallery" } },
        { key: "feature_action", value: { string_value: "open" } },
        { key: "media_id", value: { string_value: "m-bigquery" } },
      ],
    }),
    "m-bigquery",
  )
  assert.equal(
    openedMediaIdFromTelemetryRecord({
      event_name: "feature_use",
      feature_name: "media_gallery",
      feature_action: "close",
      media_id: "m-closed",
    }),
    "",
  )
})

test("parses quoted GA4 CSV rows", () => {
  const records = parseMediaRankingTelemetryCsv(
    "eventName,customEvent:media_id,description\n" + 'gallery_open,m-one,"Gallery, first page"\n',
  )
  assert.deepEqual(records, [
    {
      eventName: "gallery_open",
      "customEvent:media_id": "m-one",
      description: "Gallery, first page",
    },
  ])
  assert.equal(openedMediaIdFromTelemetryRecord(records[0]), "m-one")
})
