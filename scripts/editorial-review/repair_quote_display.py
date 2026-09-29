"""Restore display excerpts from exact, unchanged source anchors in reviewed notes.
Preserves quote identity, original text, offsets and source hash. Saves old display text.
"""
import argparse,json,sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
p=argparse.ArgumentParser();p.add_argument('--paths',type=Path,required=True);p.add_argument('--receipt',type=Path,required=True);p.add_argument('--apply',action='store_true');a=p.parse_args()
con=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);con.row_factory=sqlite3.Row;con.execute('PRAGMA foreign_keys=ON');con.execute('BEGIN IMMEDIATE');rows=[];sources={};now=ws.now_iso()
for path in json.loads(a.paths.read_text()):
 for r in con.execute('SELECT * FROM evidence_links WHERE note_path=?',(path,)).fetchall():
  original=ws.normalize_quote(r['quote_text_original_md'] or r['quote_text']).casefold();returned=ws.normalize_quote(r['quote_text_returned'] or '').casefold()
  if not returned or returned in original:continue
  if r['source_rel'] not in sources:sources[r['source_rel']]=(ws.ROOT/r['source_rel']).read_text()
  source=sources[r['source_rel']];assert ws.sha_text(source)==r['source_hash'],r['global_quote_code'];assert source[r['quote_start']:r['quote_end']]==r['quote_text'],r['global_quote_code']
  metadata=json.loads(r['metadata_json'] or '{}');metadata['editorial_display_repair_20260927']={'previous_returned':r['quote_text_returned'],'basis':'unchanged_exact_source_anchor','reviewed_at':now}
  con.execute('UPDATE evidence_links SET quote_text_returned=?,metadata_json=?,updated_at=? WHERE evidence_pk=?',(r['quote_text'],json.dumps(metadata,ensure_ascii=False),now,r['evidence_pk']))
  rows.append({'quote':r['global_quote_code'],'path':path})
if a.apply:con.commit()
else:con.rollback()
a.receipt.write_text(json.dumps({'applied':a.apply,'quotes':rows},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'applied':a.apply,'repaired':len(rows)}));con.close()
