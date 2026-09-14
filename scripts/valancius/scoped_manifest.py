"""Bind a bounded DB export on top of an unchanged, committed public release.

Run in the public worktree with the backend on PYTHONPATH and explicit DB_PATH,
ROOT_DIR and PUBLIC_REPO_DIR. Unchanged pages must still match the base release;
changed pages must match DB render_state. Neither side is accepted on trust.
"""
import json
import subprocess
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.tools.write_public_projection_manifest import _is_canonical_export_path

def main():
    root = Path.cwd()
    baseline = json.loads(subprocess.check_output(["git","show","HEAD:public-projection-manifest.json"]))
    audit = json.loads((root/".cache/valancius/evidence-audit.json").read_text())
    with ws.connect() as con:
        contract = ws._assert_db_export_contract(con)
        scope = set()
        for item in audit:
            row = con.execute("SELECT note_path FROM claims WHERE claim_pk=? AND public_status='accepted'", (item["claim"]["claim_pk"],)).fetchone()
            if row:
                scope.add(row["note_path"])
        for note in scope:
            row = con.execute("SELECT r.content_hash,r.rendered_hash FROM render_state r JOIN items i ON i.note_path=r.note_path WHERE r.note_path=? AND r.status='rendered' AND i.status='active'",(note,)).fetchone()
            if row is None or not (root/note).is_file() or ws.file_hash(root/note) != row["rendered_hash"]:
                raise RuntimeError(f"Scoped export is not DB-bound: {note}")
            baseline["files"][note] = dict(row)
    actual = {str(p.relative_to(root)) for directory in ["objektai","tyrimai","paveikslėliai","paveiksleliai","temos","laikotarpiai"] for p in (root/directory).rglob("*.md")}
    actual.add("index.md")
    if actual != set(baseline["files"]):
        raise RuntimeError(f"Unexpected public paths: {sorted(actual.symmetric_difference(baseline['files']))[:10]}")
    for note, hashes in baseline["files"].items():
        if not _is_canonical_export_path(note) or ws.file_hash(root/note) != hashes["rendered_hash"]:
            raise RuntimeError(f"Unrelated public export drift: {note}")
    baseline["contract"] = contract
    (root/"public-projection-manifest.json").write_text(json.dumps(baseline,ensure_ascii=False,indent=2)+"\n")
    receipt = {"baseCommit":subprocess.check_output(["git","rev-parse","HEAD"],text=True).strip(),
               "scope":sorted(scope),"unchangedFilesVerified":len(actual)-len(scope),"contract":contract}
    (root/".cache/valancius/scoped-export-receipt.json").write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps(receipt,ensure_ascii=False,indent=2))

if __name__ == "__main__":
    main()
