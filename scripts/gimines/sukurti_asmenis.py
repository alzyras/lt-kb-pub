"""Create sourced family biographies in the canonical DB, then export their notes.

Inputs are reviewed editorial JSON, not imported public Markdown. Existing active
objects are reused without replacing their claims or identity. --apply is explicit.
"""
import argparse
import hashlib
import json
import re
import sqlite3
from pathlib import Path
from urllib.parse import urlparse
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.tools.repair_merged_object_evidence import _copy_rows
from lt_kb_app.tools.db_backup import create_snapshot

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('seed',type=Path)
parser.add_argument('--apply',action='store_true')
parser.add_argument('--skip-backup',action='store_true',help='Reuse an already verified snapshot for this apply run.')
args=parser.parse_args()
root=Path(__file__).resolve().parents[2]
payload=json.loads(args.seed.read_text())
people=payload['people']
if args.apply and not args.skip_backup:
 create_snapshot(label=f"before_{args.seed.stem}",db_path=ws.DB_PATH,command=["sukurti_asmenis.py",str(args.seed),"--apply"])
con=sqlite3.connect(f"file:{ws.DB_PATH}?mode={'rw' if args.apply else 'ro'}",uri=True,timeout=30)
con.row_factory=sqlite3.Row
paths={p['notePath'] for p in people}
paths_by_name={p['name']:p['notePath'] for p in people}
assert len(paths)==len(people), 'Duplicate person identity'
assert len(paths_by_name)==len(people), 'Duplicate person name'
created=[];existing=[];enriched=[];reactivated=[];merged=[]

def migrate_semantic_relations(source_path, target_path):
 if not args.apply:
  return 0
 rows=con.execute(
  "SELECT rowid,* FROM object_semantic_relations WHERE from_note_path=? OR to_note_path=?",
  (source_path,source_path),
 ).fetchall()
 moved=0
 for relation in rows:
  anchor=con.execute(
   "SELECT claim_pk,claim_id,global_claim_code FROM claims WHERE claim_pk=? AND global_claim_code=?",
   (relation['claim_pk'],relation['global_claim_code']),
  ).fetchone()
  quote_id=relation['quote_id']
  if not anchor:
   anchor=con.execute(
    """SELECT c.claim_pk,c.claim_id,c.global_claim_code,e.quote_id
       FROM claims c
       JOIN claim_evidence_links cel ON cel.claim_pk=c.claim_pk
       JOIN evidence_links e ON e.evidence_pk=cel.evidence_pk
       WHERE c.note_path=? AND c.source_rel=? AND e.quote_hash=?
       ORDER BY CASE c.public_status WHEN 'accepted' THEN 0 ELSE 1 END,c.claim_id,c.claim_pk LIMIT 1""",
   (target_path,relation['source_rel'],relation['quote_hash']),
   ).fetchone()
   if not anchor:
    anchor=con.execute(
     """SELECT claim_pk,claim_id,global_claim_code,
               COALESCE(json_extract(metadata_json,'$.quote_id'),?) AS quote_id
        FROM claims
        WHERE note_path=? AND source_rel=?
          AND json_extract(metadata_json,'$.quote_hash')=?
        ORDER BY CASE public_status WHEN 'accepted' THEN 0 ELSE 1 END,claim_id,claim_pk LIMIT 1""",
     (relation['quote_id'],target_path,relation['source_rel'],relation['quote_hash']),
    ).fetchone()
   assert anchor,f'No canonical semantic anchor for {source_path}: {relation["relation_pk"]}'
   quote_id=anchor['quote_id']
  con.execute(
   """UPDATE object_semantic_relations SET
        from_note_path=?,to_note_path=?,claim_pk=?,claim_id=?,global_claim_code=?,quote_id=?,updated_at=?
      WHERE rowid=?""",
   (target_path if relation['from_note_path']==source_path else relation['from_note_path'],
    target_path if relation['to_note_path']==source_path else relation['to_note_path'],
    anchor['claim_pk'],anchor['claim_id'],anchor['global_claim_code'],quote_id,ws.now_iso(),relation['rowid']),
  )
  moved+=1
 return moved

for p in people:
 path=p['notePath']
 assert path.startswith('objektai/asmenys/') and path.endswith('.md') and '..' not in path and '\\' not in path
 assert p['name'] and p['bio'] and p['sources']
 for s in p['sources']:
  assert urlparse(s['url']).scheme=='https' and urlparse(s['url']).hostname
 for name in p.get('related',[]):
  target=paths_by_name.get(name,f'objektai/asmenys/{name}.md')
  assert target in paths or con.execute("SELECT 1 FROM items WHERE note_path=? AND status='active'",(target,)).fetchone(),target
 for source_path in p.get('mergeFrom',[]):
  assert source_path.startswith('objektai/asmenys/') and source_path.endswith('.md')
  assert source_path != path
  source=con.execute('SELECT item_id,status,metadata_json FROM items WHERE note_path=?',(source_path,)).fetchone()
  target=con.execute('SELECT item_id,status FROM items WHERE note_path=?',(path,)).fetchone()
  assert source and target and target['status']=='active',f'Cannot merge {source_path} into {path}'
  source_meta=json.loads(source['metadata_json'] or '{}')
  if source['status']=='inactive' and source_meta.get('merged_into')==path:
   semantic_moved=migrate_semantic_relations(source_path,path)
   if semantic_moved: merged.append({'source':source_path,'target':path,'plan':{'semantic_relations_moved':semantic_moved}})
   continue
  if args.apply:
   # A copied claim is a new record on the canonical identity. The DB gate
   # therefore requires independent verification before it can be public,
   # even when the legacy duplicate carried an accepted flag.
   con.execute(
    """UPDATE claims SET
         metadata_json=json_set(CASE WHEN json_valid(metadata_json) THEN metadata_json ELSE '{}' END,
           '$.pre_merge_claim_status',claim_status,'$.pre_merge_public_status',public_status,
           '$.merge_target',?),
         claim_status='quarantined',public_status='quarantined'
       WHERE item_id=? AND public_status='accepted'""",
    (path,source['item_id']),
   )
  plan=_copy_rows(con,old_path=source_path,new_path=path,old_item=source['item_id'],new_item=target['item_id'],dry_run=not args.apply)
  plan['semantic_relations_moved']=migrate_semantic_relations(source_path,path)
  merged.append({'source':source_path,'target':path,'plan':plan})
 old=con.execute('SELECT status,content_final,metadata_json FROM items WHERE note_path=?',(path,)).fetchone()
 if old:
  if old['status']!='active':
   assert p.get('reactivateStub'),f'Identity needs reconciliation before reuse: {path}'
   assert not re.search(r'\b[tc]-\d+\b',old['content_final']),f'Inactive identity has evidence: {path}'
   old_meta=json.loads(old['metadata_json'] or '{}')
   assert old_meta.get('noble_family')==payload['family'],f'Inactive identity belongs to another scope: {path}'
   reactivated.append(path)
  if not (p.get('enrichStub') or p.get('enrichExisting') or p.get('reactivateStub')):
   existing.append(path);continue
  previous_meta=json.loads(old['metadata_json'] or '{}')
  if ('Šis pradinis puslapis sukurtas pagal VLE' not in old['content_final']
      and previous_meta.get('seed_hash')==hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True).encode()).hexdigest()):
   existing.append(path);continue
  if not p.get('enrichExisting'):
   assert 'Šis pradinis puslapis sukurtas pagal VLE' in old['content_final'] or p.get('reactivateStub'),f'Not an empty biography: {path}'
  enriched.append(path)
 else:created.append(path)
 if not args.apply:continue
 sources='\n'.join(f"- [{s['title']}]({s['url']})" for s in p['sources'])
 related='\n'.join(f'- [[{paths_by_name.get(name,f"objektai/asmenys/{name}.md")[:-3]}|{name}]]' for name in p.get('related',[]))
 text=(f"---\ntipas: asmuo\npavadinimas: {json.dumps(p['name'],ensure_ascii=False)}\n"
       f"aliases: {json.dumps(p.get('aliases',[]),ensure_ascii=False)}\n"
       f"datos: {json.dumps([p['dates']],ensure_ascii=False)}\ntags:\n  - asmuo\n---\n\n"
       f"# {p['name']}\n\n## Santrauka\n\n{p['bio']}\n\n## Šaltiniai\n\n{sources}\n\n")
 if related:text+=f'## Šeima\n\n{related}\n\n'
 text+=f"[[objektai/grupes/{payload['family']}|{payload['family']}]] · [[straipsniai/{payload['articleSlug']}|Giminės narių registras ir istorija]]\n"
 if old:
  # Keep the complete DB evidence sections, including unpublished legacy claims.
  # Replacing them with the shorter public note would trigger append-only merge.
  previous_text=ws._rehydrate_projection_evidence_for_merge(con,note_path=path,markdown_text=old['content_final'])
  fm=previous_text.split('---',2)[1]
  fm=re.sub(r'^canonical_biography:.*\n?', '',fm,flags=re.M)
  fm+='canonical_biography: '+json.dumps(p['bio'],ensure_ascii=False)+'\n'
  body=previous_text.split('---',2)[2]
  body=re.sub(r'(^## Santrauka\s*\n)[\s\S]*?(?=^## |\Z)',lambda m:m[1]+'\n'+p['bio']+'\n\n',body,count=1,flags=re.M)
  body=re.sub(r'\n## Šaltiniai\s*\n[\s\S]*?(?=\n## |\Z)','',body,count=1)
  body=re.sub(r'\n## Šeima\s*\n[\s\S]*?(?=\n## |\Z)','',body,count=1)
  body=re.sub(
   rf'\n?\[\[objektai/grupes/{re.escape(payload["family"])}\|[^\]]+\]\]\s*·\s*'
   rf'\[\[straipsniai/{re.escape(payload["articleSlug"])}\|[^\]]+\]\]\s*',
   '\n',body,
  )
  body+='\n## Šaltiniai\n\n'+sources+'\n'
  if related:body+='\n## Šeima\n\n'+related+'\n'
  body+=f"\n[[objektai/grupes/{payload['family']}|{payload['family']}]] · [[straipsniai/{payload['articleSlug']}|Giminės narių registras ir istorija]]\n"
  text='---'+fm+'---'+body
 metadata={'external_summary':True,'family_editorial':payload['family'],'editorial_sources':p['sources'],
           'identity_scope':p['dates'],'seed_hash':hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True).encode()).hexdigest()}
 if old:
  # Only the explicitly checked empty VLE biography is replaced. Preserve every
  # existing claim/evidence block; the ordinary append-only importer otherwise
  # keeps the placeholder introduction as well as its evidence.
  assert set(re.findall(r'\b[tc]-\d+\b',old['content_final'])) <= set(re.findall(r'\b[tc]-\d+\b',text))
  metadata['allow_object_rewrite']=True
  metadata['allow_claim_quote_reduction']=True
 ws._upsert_item_projection(con,note_path=path,markdown_text=text,metadata=metadata)
 stored=con.execute('SELECT content_final FROM items WHERE note_path=?',(path,)).fetchone()[0]
 assert p['bio'] in stored and all(s['url'] in stored for s in p['sources']),path
 ws.upsert_entity_note(con,note_path=path,note_text=text)
 print(json.dumps({'prepared':path},ensure_ascii=False),flush=True)
if args.apply:
 con.commit()
 # Export DB content, not the seed, so the DB is the source of each public note.
 for path in paths:
  row=con.execute('SELECT content_final FROM items WHERE note_path=?',(path,)).fetchone()
  out=root/path;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(row['content_final'])
  assert out.read_text()==row['content_final']
 for merge in merged:
  out=root/merge['source']
  row=con.execute('SELECT status,metadata_json FROM items WHERE note_path=?',(merge['source'],)).fetchone()
  if row and row['status']=='inactive' and json.loads(row['metadata_json'] or '{}').get('merged_into')==merge['target'] and out.exists():
   out.unlink()
 report={'created':created,'enriched':enriched,'reactivated':reactivated,'merged':merged,'reused':existing,'database':str(ws.DB_PATH),'applied':True}
 state=root/'.cache/gimines';state.mkdir(parents=True,exist_ok=True)
 (state/(args.seed.stem+'-receipt.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'created':len(created),'enriched':len(enriched),'reactivated':len(reactivated),'merged':len(merged),'reused':len(existing),'applied':args.apply},ensure_ascii=False))
con.close()
