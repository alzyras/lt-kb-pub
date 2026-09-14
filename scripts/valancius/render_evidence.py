"""Scoped export with the fixed global-identity-aware append-only renderer."""
import json
import os
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[2]
backend = root.parent / "lt-kb"
assert root.name == "lt-kb-pub-valancius" and (root / ".cache/valancius/workflow.sqlite3").is_file(), "Restore an isolated preview DB first; never create an empty DB or point at the live database."
os.environ.update(ROOT_DIR=str(backend), PUBLIC_REPO_DIR=str(root), DB_PATH=str(root / ".cache/valancius/workflow.sqlite3"))
sys.path.insert(0, str(backend))
from lt_kb_app.core import workflow_state as ws
audit=json.loads((root/".cache/valancius/evidence-audit.json").read_text())
with ws.connect() as con:
    notes=set()
    repair_receipt=root/".cache/valancius/local-id-repairs.json"
    if repair_receipt.exists():
        for old in json.loads(repair_receipt.read_text()):
            con.execute("UPDATE claims SET claim_id=? WHERE claim_pk=?",(old["claim_id"],old["claim_pk"]))
    for item in audit:
        row=con.execute("SELECT claim_pk,claim_id,global_claim_code,note_path FROM claims WHERE claim_pk=? AND public_status='accepted'",(item["claim"]["claim_pk"],)).fetchone()
        if not row: continue
        notes.add(row["note_path"])
    con.commit()
    print("Scoped notes:", len(notes), flush=True)
print(ws.render_public_projection(note_paths=sorted(notes),changed_only=False,preserve_existing_object_pages=True,hub_notes=False),flush=True)
