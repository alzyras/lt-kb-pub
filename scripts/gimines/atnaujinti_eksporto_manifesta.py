"""Refresh only this collection's already-rendered DB manifest entries.

Other collections may be at a different export revision. Preserve their existing
manifest entries; never bless filesystem hashes that disagree with render_state.
Run from lt-kb via uv after the native scoped projection has completed.
"""
import hashlib
import json
import sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws

root = Path(__file__).resolve().parents[2]
target = root / 'public-projection-manifest.json'
manifest = json.loads(target.read_text())
assert manifest['source'] == 'workflow.sqlite3' and manifest['version'] == 1
assert all(value == 0 for value in manifest['contract'].values())
paths = {person['notePath'] for family in ['radvilos', 'sapiegos']
         for person in json.loads((root / f'scripts/gimines/{family}-asmenys.json').read_text())['people']}
con = sqlite3.connect(f'file:{ws.DB_PATH}?mode=ro', uri=True)
con.row_factory = sqlite3.Row
updates = {}
for path in sorted(paths):
    row = con.execute('''SELECT r.content_hash, r.rendered_hash, i.content_hash AS item_hash
        FROM render_state r JOIN items i ON i.note_path=r.note_path
        WHERE r.note_path=? AND r.status='rendered' AND i.status='active' ''', (path,)).fetchone()
    assert row and row['content_hash'] == row['item_hash'], f'Stale DB projection: {path}'
    assert hashlib.sha256((root / path).read_bytes()).hexdigest() == row['rendered_hash'], f'Export drift: {path}'
    updates[path] = {'content_hash': row['content_hash'], 'rendered_hash': row['rendered_hash']}
con.close()
state = root / '.cache/gimines'
state.mkdir(parents=True, exist_ok=True)
backup = state / 'projection-manifest-before-family-refresh.json'
if not backup.exists():
    backup.write_text(target.read_text())
# Merge hashes into existing entries so unrelated export metadata (for example
# projection mode and enrichment provenance) stays intact on edited pages.
for path, hashes in updates.items():
    entry = dict(manifest['files'].get(path, {}))
    entry.update(hashes)
    manifest['files'][path] = entry
# Keep the existing manifest's insertion order so a scoped family refresh does
# not create a repository-wide diff for unrelated collections.
target.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'verified_native_DB_exports': len(updates), 'preserved_other_entries': len(manifest['files'])-len(updates)}))
