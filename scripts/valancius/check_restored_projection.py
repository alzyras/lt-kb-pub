"""Compare restored DB export; optionally apply proven format-only normalization."""
import hashlib
import json
import os
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
backend = root.parent / "lt-kb"
state = root / ".valancius-state"
destination = state / "projection-check"
database = state / "workflow.sqlite3"
assert root.name == "lt-kb-pub-valancius" and database.is_file()
records = json.loads((root / "scripts/valancius/evidence-register.json").read_text())
notes = sorted({row["notePath"] for row in records if row["publicStatus"] == "accepted"})
apply_format = "--apply-format-only" in sys.argv
if apply_format:
    def normalized(text):
        return "\n".join(line.replace("  pagrindžia:", "  pagrindzia:") for line in text.splitlines() if line.strip())
    for note in notes:
        assert normalized((root/note).read_text()) == normalized((destination/note).read_text()), f"Not just formatting: {note}"
    destination = root
else:
    for note in notes:
        target = destination / note
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / note, target)
os.environ.update(ROOT_DIR=str(backend), PUBLIC_REPO_DIR=str(destination), DB_PATH=str(database))
sys.path.insert(0, str(backend))
from lt_kb_app.core import workflow_state as ws

result = ws.render_public_projection(note_paths=notes, changed_only=False, preserve_existing_object_pages=True, hub_notes=False)
different = [note for note in notes if (root/note).read_bytes() != (destination/note).read_bytes()]
receipt = {"database":str(database),"comparisonDirectory":str(destination),"formatOnlyNormalizationApplied":apply_format,"notes":notes,"export":result,"different":different}
(root / "scripts/valancius/review/restored-projection.json").write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+"\n")
print(json.dumps(receipt,ensure_ascii=False,indent=2),flush=True)
if different:
    raise SystemExit("Restored source differs from the preview; inspect the comparison, do not overwrite content")
with ws.connect() as con:
    manifest = json.loads((root / "public-projection-manifest.json").read_text())
    for note in notes:
        row = con.execute("SELECT content_hash,rendered_hash FROM render_state WHERE note_path=? AND status='rendered'",(note,)).fetchone()
        assert row and hashlib.sha256((root/note).read_bytes()).hexdigest() == row["rendered_hash"]
        manifest["files"][note] = dict(row)
    manifest["contract"] = ws._assert_db_export_contract(con)
    (root / "public-projection-manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
