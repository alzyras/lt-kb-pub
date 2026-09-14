"""Restore only the reviewed cycle in an isolated APFS clone. Never writes live DB.

Uses the durable editorial registers and the existing verifier/import/seed APIs.
Does not rewrite site content, deploy, or bypass changed-source verifier gates.
"""
import json
import os
import sqlite3
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
assert root.name == "lt-kb-pub-valancius"
backend = root.parent / "lt-kb"
state = root / ".valancius-state"
state.mkdir(exist_ok=True)
database = state / "workflow.sqlite3"
source = backend / "darbas/state/workflow.sqlite3"
if not database.exists():
    wal = Path(str(source) + "-wal")
    if wal.exists() and wal.stat().st_size:
        raise RuntimeError("Source has an active WAL; obtain a consistent snapshot before cloning")
    before = source.stat()
    subprocess.run(["cp", "-c", str(source), str(database)], check=True)
    after = source.stat()
    if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns) or (wal.exists() and wal.stat().st_size):
        raise RuntimeError("Source changed during clone; do not use this snapshot")

os.environ.update(ROOT_DIR=str(backend), PUBLIC_REPO_DIR=str(root), DB_PATH=str(database))
sys.path.insert(0, str(backend))
from lt_kb_app.tools.independent_claim_verifier import promote_verified_claims
from lt_kb_app.media.models import MediaCandidate
from lt_kb_app.media.writer import upsert_media_item, attach_media_ref
from lt_kb_app.media.importer import ensure_import_tables, _upsert_publication
from lt_kb_app.media.exhibitions import apply_exhibition_seed

con = sqlite3.connect(database)
con.row_factory = sqlite3.Row
register = json.loads((root / "scripts/valancius/evidence-register.json").read_text())
codes = [row["claimId"] for row in register if row["publicStatus"] == "accepted"]
assert len(codes) == 35
claims = [con.execute("SELECT claim_pk FROM claims WHERE global_claim_code=?", (code,)).fetchone()[0] for code in codes]
promotion = promote_verified_claims(con, claim_pks=claims)
for code in codes:
    assert con.execute("SELECT public_status FROM claims WHERE global_claim_code=?", (code,)).fetchone()[0] == "accepted", code
ensure_import_tables(con)
target = dict(con.execute("SELECT item_id,note_path,title FROM items WHERE note_path=?", ("objektai/asmenys/Motiejus Valančius.md",)).fetchone())
for item in json.loads((root / "scripts/valancius/exhibit-register.json").read_text()):
    provider = "vu" if "vu" in item else "commons"
    candidate = MediaCandidate(provider=provider, external_id=str(item.get("vu") or item["commons"]),
        canonical_url=item["canonicalUrl"], source_url=item["sourceUrl"], title=item["title"],
        description=item["description"], creator=item["creator"], provider_label=item["institution"],
        license=item["license"], rights_note=item["rightsNote"], date_display=item["date"], date_start=item["year"],
        width=item["width"], height=item["height"], thumb_url=item["asset"], preview_url=item["asset"],
        iiif_manifest_url=item["canonicalUrl"]+"/manifest.json?format=rich" if provider=="vu" else "",
        metadata={"institution":item["institution"],"license_url":item["licenseUrl"],"attribution":item["attribution"],
            "original_catalog_url":item["originalCatalogUrl"],"editorial_hold":item.get("hold", ""),
            "preview_asset":item["asset"],"canvas_number":item.get("page"),"review_method":"editorial-visual-2026-09-13"}).to_dict()
    media_id = upsert_media_item(con, candidate)
    assert media_id == item["mediaId"]
    attach_media_ref(con, target, candidate, {"relation_type":"portrait_of" if item["key"].startswith(("portretas","foto","albumas")) else "contextual",
        "directness":"contextual","confidence":0.95,"judge":{"caption_lt":item["title"],"reason":"Vizualiai patikrintas dokumentas; platesnis ryšys su asmeniu teminis."}}, "accepted")
    _upsert_publication(con, media_id, {"caption_lt":item["title"],"historical_relevance":"contextual","confidence":0.95,
        "judge_model":"Codex editorial review","media_kind":"historical-document","canonical_tags":[],"proposed_tags":[],
        "tag_rationale":"Valančiaus ciklo dokumentinis kontekstas","visual_evidence":item["description"],"metadata_evidence":item["originalCatalogUrl"],
        "reason":item.get("hold") or "Vaizdas ir katalogo aprašas patikrinti; datos sluoksniai atskirti.",
        "object_links":[],"rejected_object_links":[],"visual_inspected":True},source_method="valancius_editorial_preview")
exhibitions = json.loads((root / "quartz/static/exhibitionValancius.json").read_text())["exhibitions"]
for exhibition in exhibitions:
    assert exhibition["status"] == "draft" and exhibition["noindex"] is True
    apply_exhibition_seed(con, exhibition)
con.commit()
con.close()
receipt = {"database":str(database),"source":str(source),"sourceUnchanged":True,"promotion":promotion,"claims":codes,"exhibits":16,"exhibitions":2,"status":"draft"}
(root / "scripts/valancius/review/restored-state.json").write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+"\n")
print(json.dumps(receipt,ensure_ascii=False,indent=2),flush=True)
