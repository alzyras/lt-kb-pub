"""Validate, persist and round-trip the family collection in the canonical DB.

Run from lt-kb via uv. No object biographies, claims or primary portraits are changed.
By default only validation runs. --apply persists reviewed editorial content.
"""
import argparse
import hashlib
import json
import sqlite3
import tempfile
from pathlib import Path

from lt_kb_app.core import workflow_state as ws
from lt_kb_app.media.exhibitions import apply_exhibition_seed, validate_exhibition_seed
from lt_kb_app.tools.editorial_documents import ensure_schema, export_documents, safe_document_path, store_document

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--apply", action="store_true")
parser.add_argument("--database", type=Path, default=ws.DB_PATH)
args = parser.parse_args()
if not args.database.is_file():
    raise FileNotFoundError(args.database)
collection = "bajoru-gimines"
manifest_path = "quartz/static/exhibitionNobleFamilies.json"
catalog_path = "quartz/static/nobleFamilyMediaCatalog.json"
manifest = json.loads((root / manifest_path).read_text())
exhibitions = manifest["exhibitions"]
assert len({e["exhibitionId"] for e in exhibitions}) == len(exhibitions)
articles = [root / (e["slug"].replace("parodos/", "straipsniai/") + ".md") for e in exhibitions]
documents = [*articles, root / catalog_path]
documents += sorted((root / "scripts/gimines").glob("*.md"))
documents.append(root / "scripts/gimines" / "nariu-nuorodos.json")
registry_documents = []
for path in sorted((root / "scripts/gimines").glob("*-asmenys.json")):
    relative = path.relative_to(root).as_posix()
    try:
        safe_document_path(relative)
        documents.append(path)
    except ValueError:
        registry_documents.append(path)
expected = {p.relative_to(root).as_posix(): p.read_text() for p in [*documents, *registry_documents]}
con = sqlite3.connect(f"file:{args.database}?mode={'rw' if args.apply else 'ro'}", uri=True, timeout=30)
con.row_factory = sqlite3.Row
errors = [f"{e['exhibitionId']}: {error}" for e in exhibitions for error in validate_exhibition_seed(con, e)]
if errors:
    raise ValueError(json.dumps(errors, ensure_ascii=False))
media_ids = {i["mediaId"] for e in exhibitions for s in e["sections"] for i in s["items"]}
catalog_ids = {e["mediaId"] for e in json.loads(expected[catalog_path])["entries"]}
assert media_ids == catalog_ids, "All exhibits must be in the reviewed catalogue"
report = {"database": str(args.database), "collection": collection, "documents": len(expected),
          "exhibitions": len(exhibitions), "sections": sum(len(e["sections"]) for e in exhibitions), "items": len(media_ids),
          "family_registries": len(registry_documents), "applied": False}
if args.apply:
    # Preserve the previous narrowly scoped state as a reviewable rollback record.
    ids = [e["exhibitionId"] for e in exhibitions]
    placeholders = ",".join("?" for _ in ids)
    previous = {}
    for table in ["exhibitions", "exhibition_sections", "exhibition_items", "exhibition_claim_links"]:
        where = (f"exhibition_item_id IN (SELECT exhibition_item_id FROM exhibition_items WHERE exhibition_id IN ({placeholders}))"
                 if table == "exhibition_claim_links" else f"exhibition_id IN ({placeholders})")
        previous[table] = [dict(r) for r in con.execute(f"SELECT * FROM {table} WHERE {where}", ids)]
    ensure_schema(con)
    con.execute("""CREATE TABLE IF NOT EXISTS editorial_family_registry_documents (
        document_path TEXT PRIMARY KEY, family_name TEXT NOT NULL, content TEXT NOT NULL,
        content_hash TEXT NOT NULL, updated_at TEXT NOT NULL)""")
    previous["documents"] = [dict(r) for r in con.execute("SELECT * FROM editorial_documents WHERE collection_id=?", (collection,))]
    previous["family_registries"] = [dict(r) for r in con.execute("SELECT * FROM editorial_family_registry_documents")]
    previous["exports"] = [dict(r) for r in con.execute("SELECT * FROM editorial_exhibition_exports WHERE collection_id=?", (collection,))]
    state = root / ".cache/gimines"
    state.mkdir(parents=True, exist_ok=True)
    backup = state / ("before-" + ws.now_iso().replace(":", "-") + ".json")
    backup.write_text(json.dumps(previous, ensure_ascii=False, indent=2) + "\n")
    try:
        # Importer validates again and preserves the native exhibition identities.
        for exhibition in exhibitions:
            apply_exhibition_seed(con, exhibition)
        for path, content in expected.items():
            try:
                safe_document_path(path)
            except ValueError:
                payload = json.loads(content)
                assert path.startswith("scripts/gimines/") and path.endswith("-asmenys.json") and payload.get("family")
                con.execute("""INSERT INTO editorial_family_registry_documents VALUES (?,?,?,?,?)
                    ON CONFLICT(document_path) DO UPDATE SET family_name=excluded.family_name,
                    content=excluded.content,content_hash=excluded.content_hash,updated_at=excluded.updated_at""",
                    (path, payload["family"], content, hashlib.sha256(content.encode()).hexdigest(), ws.now_iso()))
            else:
                store_document(con, path=path, content=content, collection_id=collection,
                    metadata={"authored_at": "2026-09-22", "state": "research-plan" if path.startswith("scripts/") else "first-edition",
                              "provenance": "scripts/gimines/README.md"})
        for exhibition in exhibitions:
            con.execute("""INSERT INTO editorial_exhibition_exports VALUES (?,?,?,?)
                ON CONFLICT(exhibition_id) DO UPDATE SET collection_id=excluded.collection_id,
                output_path=excluded.output_path, catalog_path=excluded.catalog_path""",
                (collection, exhibition["exhibitionId"], manifest_path, catalog_path))
        con.commit()
    except Exception:
        con.rollback()
        raise
    # Prove recovery to a clean directory rather than just reading the input files.
    with tempfile.TemporaryDirectory(prefix="gimines-db-export-") as temp:
        exported = export_documents(con, Path(temp), collection_id=collection)
        for row in con.execute("SELECT * FROM editorial_family_registry_documents ORDER BY document_path"):
            target = Path(temp) / row["document_path"]
            target.parent.mkdir(parents=True, exist_ok=True)
            assert hashlib.sha256(row["content"].encode()).hexdigest() == row["content_hash"]
            target.write_text(row["content"])
        for path, content in expected.items():
            assert (Path(temp) / path).read_text() == content, path
        actual_list = json.loads((Path(temp) / manifest_path).read_text())["exhibitions"]
        actual_by_id = {e["exhibitionId"]: e for e in actual_list}
        assert set(actual_by_id) == set(ids)
        for exhibition in exhibitions:
            actual = actual_by_id[exhibition["exhibitionId"]]
            for key in ["title", "description", "heroMediaId", "relatedContent", "editorialProfile", "status", "familyMembers", "familyMembersScope"]:
                assert actual[key] == exhibition[key], key
            for a, b in zip(actual["sections"], exhibition["sections"], strict=True):
                for key in ["title", "lead", "navMediaId"]:
                    assert a[key] == b[key], key
                for i, j in zip(a["items"], b["items"], strict=True):
                    for key in ["mediaId", "descriptionLt", "externalSources", "evidenceNoteLt", "objectSlug", "objectLinks", "claimCodes"]:
                        assert i.get(key) == j.get(key), key
    export_documents(con, root, collection_id=collection)
    for row in con.execute("SELECT * FROM editorial_family_registry_documents ORDER BY document_path"):
        target = root / row["document_path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(row["content"])
    report.update(applied=True, roundtrip_verified=True, rollback_record=str(backup),
                  article_sha256={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in articles})
    (state / "receipt.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
con.close()
print(json.dumps(report, ensure_ascii=False, indent=2))
