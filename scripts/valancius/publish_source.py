"""Persist approved exhibition metadata using the normal importer/exporter.

Only an explicitly cloned release database is writable. This is not a database
deployment: never replace the live workflow database with this older snapshot.
"""
import json
import os
import sqlite3
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
backend = root.parent / "lt-kb"
database = root / ".valancius-state/publication.sqlite3"
assert root.name == "lt-kb-pub-valancius-release" and database.is_file()
os.environ.update(ROOT_DIR=str(backend), PUBLIC_REPO_DIR=str(root), DB_PATH=str(database))
sys.path.insert(0, str(backend))
from lt_kb_app.media.exhibitions import apply_exhibition_seed, export_public_exhibitions

path = root / "quartz/static/exhibitionValancius.json"
before = json.loads(path.read_text())
source = json.loads((root / "scripts/valancius/curation.json").read_text())
reviewed = json.loads((root / "scripts/valancius/evidence-register.json").read_text())
con = sqlite3.connect(database)
con.row_factory = sqlite3.Row
for record in reviewed:
    if not record["usedBy"]:
        continue
    row = con.execute("SELECT claim_pk,claim_text,public_status FROM claims WHERE global_claim_code=?", (record["claimId"],)).fetchone()
    assert row and row["public_status"] == "accepted" and row["claim_text"] == record["claim"], record["claimId"]
    for quote in record["evidence"]:
        original = (backend / quote["source"]).read_text()
        pages = quote["pages"]
        assert original[pages["quote_start"]:pages["quote_end"]] == quote["exactOriginal"], quote["citationId"]
for exhibition in before["exhibitions"]:
    authored = next(e for e in source.values() if e["slug"] == exhibition["exhibitionId"])
    assert authored["status"] == "published" and authored["noindex"] is False
    print(apply_exhibition_seed(con, {**exhibition, "schemaVersion":"ltkb-exhibition/v1"}))
con.commit()
output = root / ".valancius-state/published-exhibitions.json"
print(export_public_exhibitions(con, exhibition_ids=[e["exhibitionId"] for e in before["exhibitions"]],
      catalog_path=root / "quartz/static/mediaCatalogSource.json", output_path=output))
after = json.loads(output.read_text())
for expected in before["exhibitions"]:
    actual = next(e for e in after["exhibitions"] if e["exhibitionId"] == expected["exhibitionId"])
    for key in ["title", "seo_title", "subtitle", "description", "status", "noindex", "relatedContent", "heroMediaId"]:
        assert actual[key] == expected[key], (expected["exhibitionId"], key)
    for a, b in zip(actual["sections"], expected["sections"], strict=True):
        for key in ["sectionId", "slug", "title", "lead"]:
            assert a[key] == b[key], key
        for i, j in zip(a["items"], b["items"], strict=True):
            for key in ["exhibitionItemId", "mediaId", "titleLt", "descriptionLt", "catalogDescriptionLt", "creatorDisplay", "dateDisplay", "claimRefs"]:
                assert i[key] == j[key], key
con.close()
print("Approved metadata round-trip and original source excerpts verified; live DB unchanged.")
