"""Import reviewed family-exhibition media into the canonical database.

Only catalogue entries carrying ``externalId`` are handled here.  Existing
catalogue entries created by the ordinary media pipeline remain untouched.
The command is read-only unless ``--apply`` is given.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

from lt_kb_app.core import workflow_state as ws
from lt_kb_app.media.writer import attach_media_ref, ensure_media_tables, upsert_media_item
from lt_kb_app.tools.db_backup import create_snapshot


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--apply", action="store_true")
parser.add_argument("--skip-backup", action="store_true", help="Reuse an already verified snapshot for this apply run.")
parser.add_argument(
    "--catalog",
    type=Path,
    default=Path(__file__).resolve().parents[2] / "quartz/static/nobleFamilyMediaCatalog.json",
)
args = parser.parse_args()

entries = [row for row in json.loads(args.catalog.read_text())["entries"] if row.get("externalId")]
if args.apply and not args.skip_backup:
    create_snapshot(label="before_family_exhibition_media", command=["importuoti_medijas.py", "--apply"])

con = sqlite3.connect(f"file:{ws.DB_PATH}?mode={'rw' if args.apply else 'ro'}", uri=True, timeout=30)
con.row_factory = sqlite3.Row
if args.apply:
    ensure_media_tables(con)

planned: list[dict[str, object]] = []
for entry in entries:
    candidate = {
        "provider": entry["provider"],
        "external_id": entry["externalId"],
        "canonical_url": entry["canonicalUrl"],
        "source_url": entry["sourceUrl"],
        "thumb_url": entry["displayUrl"],
        "preview_url": entry["displayUrl"],
        "title": entry["title"],
        "description": entry.get("catalogDescriptionLt") or entry.get("caption") or "",
        "creator": entry.get("creator") or "",
        "provider_label": entry.get("providerLabel") or "",
        "license": entry.get("license") or "",
        "rights_note": entry.get("rightsNote") or entry.get("license") or "",
        "date_display": entry.get("dateDisplay") or "",
        "date_start": entry.get("dateStart"),
        "date_end": entry.get("dateEnd"),
        "media_type": "image",
        "width": entry.get("width"),
        "height": entry.get("height"),
        "metadata": {
            "license_url": entry.get("licenseUrl") or "",
            "attribution": entry.get("attribution") or "",
            "preview_asset": entry["displayUrl"],
            "institution": entry.get("institution") or "",
            "collection": entry.get("collection") or "",
            "visual_evidence": entry.get("visualEvidence") or "",
            "metadata_evidence": entry.get("metadataEvidence") or "",
        },
    }
    related = entry.get("relatedObjects") or []
    if not related:
        raise ValueError(f"{entry['mediaId']}: relatedObjects is required")
    targets = []
    for relation in related:
        row = con.execute(
            "SELECT item_id,note_path,title,status FROM items WHERE note_path=?",
            (relation["notePath"],),
        ).fetchone()
        if not row or row["status"] != "active":
            raise ValueError(f"{entry['mediaId']}: inactive or missing target {relation['notePath']}")
        targets.append((row, relation))
    if args.apply:
        media_id = upsert_media_item(con, candidate)
        if media_id != entry["mediaId"]:
            raise ValueError(f"media id mismatch: {media_id} != {entry['mediaId']}")
        for row, relation in targets:
            attach_media_ref(
                con,
                dict(row),
                candidate,
                {
                    "relation_type": relation.get("relationType") or "associated_with",
                    "directness": relation.get("directness") or "contextual",
                    "confidence": entry.get("confidence") or 0.9,
                    "judge": {
                        "caption_lt": entry.get("caption") or entry["title"],
                        "judge_model": "editorial-human-review",
                        "reason": entry.get("judgeReason") or entry.get("visualEvidence") or "",
                        "visual_review_version": entry.get("visualReviewVersion") or "family-editorial-v1",
                    },
                },
                "accepted",
            )
    planned.append({"mediaId": entry["mediaId"], "targets": [row["note_path"] for row, _ in targets]})

if args.apply:
    con.commit()
con.close()
print(json.dumps({"applied": args.apply, "media": len(entries), "refs": sum(len(row["targets"]) for row in planned), "items": planned}, ensure_ascii=False, indent=2))
