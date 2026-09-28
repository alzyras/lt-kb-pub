"""Stage source-attributed corrections and quarantine invalid extracted statements."""
import argparse,json,re,sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
p=argparse.ArgumentParser();p.add_argument('--apply',action='store_true');p.add_argument('--receipt',type=Path,required=True);a=p.parse_args();plan=json.loads(Path(__file__).with_name('semantic-corrections.json').read_text())
c=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON');c.execute('BEGIN IMMEDIATE');now=ws.now_iso();marker='editorial_semantic_review_20260927';results=[];paths=set()
for e in plan['entries']:
 r=c.execute('SELECT * FROM claims WHERE global_claim_code=? AND note_path=?',(e['code'],e['notePath'])).fetchone();assert r;m=json.loads(r['metadata_json'] or '{}')
 if marker in m:continue
 assert r['claim_text']==e['expectedText'],e['code']
 m[marker]={'previous_text':r['claim_text'],'reason':e['reason'],'decision':e['decision'],'reviewed_at':now}
 for k in ['public_acceptance_authorization','public_acceptance_override','legacy_publication_restore']:m.pop(k,None)
 c.execute("UPDATE claims SET claim_status='quarantined',public_status='quarantined',claim_text=?,content_hash=?,metadata_json=?,updated_at=? WHERE claim_pk=?",(e['replacementText'],ws.sha_json({'claim_id':r['claim_id'],'claim_text':e['replacementText']}),json.dumps(m,ensure_ascii=False),now,r['claim_pk']))
 c.execute("UPDATE claim_evidence_links SET status='quarantined',updated_at=? WHERE claim_pk=? AND status='accepted'",(now,r['claim_pk']))
 c.execute("UPDATE note_claims SET claim_status='quarantined',claim_text=?,updated_at=? WHERE note_path=? AND source_rel=? AND claim_id=?",(e['replacementText'],now,r['note_path'],r['source_rel'],r['claim_id']))
 c.execute('UPDATE claim_search_fts SET claim_text=? WHERE note_path=? AND source_rel=? AND claim_id=?',(e['replacementText'],r['note_path'],r['source_rel'],r['claim_id']))
 paths.add(r['note_path']);results.append(e['code'])
for path in paths:
 r=c.execute('SELECT * FROM items WHERE note_path=?',(path,)).fetchone();fm,body=ws.split_note_frontmatter(r['content_final'])
 for key in ['object_page_view_json','description','socialDescription']:
  fm=re.sub(r'^'+key+r':.*\n?','',fm,flags=re.M)
 if path=='objektai/asmenys/Vaišelga.md':
  summary='Vaišelga – Mindaugo sūnus, 1264 m. tapęs Lietuvos valdovu. Jis priėmė stačiatikybę ir buvo vienuolis. Vėlesni šaltiniai skirtingai pasakoja apie jo kelionę į Šventąjį kalną; jų versijos čia pateikiamos nurodant autorius.'
  fm=re.sub(r'^canonical_biography:.*\n?','',fm,flags=re.M)+'\ncanonical_biography: '+json.dumps(summary,ensure_ascii=False)+'\n'
  body=re.sub(r'(?ms)(^## Santrauka\s*\n).*?(?=^## |\Z)',lambda m:m[1]+'\n'+summary+'\n\n',body,count=1)
 text='---\n'+fm.strip()+'\n---\n\n'+body.strip()+'\n'
 c.execute('UPDATE items SET content_raw=?,content_sanitized=?,content_final=?,content_hash=?,updated_at=? WHERE note_path=?',(text,text,text,ws.sha_text(text),now,path))
 c.execute("UPDATE object_page_modules SET status='revoked',updated_at=? WHERE note_path=?",(now,path));c.execute("UPDATE object_page_dossiers SET status='draft',updated_at=? WHERE note_path=?",(now,path))
 ws.upsert_entity_note(c,note_path=path,note_text=text)
if a.apply:c.commit()
else:c.rollback()
a.receipt.write_text(json.dumps({'applied':a.apply,'claims':results,'paths':sorted(paths)},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'applied':a.apply,'claims':len(results)}));c.close()
