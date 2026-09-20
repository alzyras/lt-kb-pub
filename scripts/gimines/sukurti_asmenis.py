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

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('seed',type=Path)
parser.add_argument('--apply',action='store_true')
args=parser.parse_args()
root=Path(__file__).resolve().parents[2]
payload=json.loads(args.seed.read_text())
people=payload['people']
con=sqlite3.connect(f"file:{ws.DB_PATH}?mode={'rw' if args.apply else 'ro'}",uri=True,timeout=30)
con.row_factory=sqlite3.Row
paths={p['notePath'] for p in people}
assert len(paths)==len(people), 'Duplicate person identity'
created=[];existing=[];enriched=[]
for p in people:
 path=p['notePath']
 assert path.startswith('objektai/asmenys/') and path.endswith('.md') and '..' not in path and '\\' not in path
 assert p['name'] and p['bio'] and p['sources']
 for s in p['sources']:
  assert urlparse(s['url']).scheme=='https' and urlparse(s['url']).hostname
 for name in p.get('related',[]):
  target=f'objektai/asmenys/{name}.md'
  assert target in paths or con.execute("SELECT 1 FROM items WHERE note_path=? AND status='active'",(target,)).fetchone(),target
 old=con.execute('SELECT status,content_final,metadata_json FROM items WHERE note_path=?',(path,)).fetchone()
 if old:
  assert old['status']=='active',f'Identity needs reconciliation before reuse: {path}'
  if not p.get('enrichStub'):
   existing.append(path);continue
  previous_meta=json.loads(old['metadata_json'] or '{}')
  if ('Šis pradinis puslapis sukurtas pagal VLE' not in old['content_final']
      and previous_meta.get('seed_hash')==hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True).encode()).hexdigest()):
   existing.append(path);continue
  assert 'Šis pradinis puslapis sukurtas pagal VLE' in old['content_final'],f'Not an empty biography: {path}'
  assert not re.search(r'\bt-\d{5}\b',old['content_final']),f'Existing evidence requires separate review: {path}'
  enriched.append(path)
 else:created.append(path)
 if not args.apply:continue
 sources='\n'.join(f"- [{s['title']}]({s['url']})" for s in p['sources'])
 related='\n'.join(f'- [[objektai/asmenys/{name}|{name}]]' for name in p.get('related',[]))
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
  body+='\n## Šaltiniai\n\n'+sources+'\n'
  if related:body+='\n## Šeima\n\n'+related+'\n'
  text='---'+fm+'---'+body
 metadata={'external_summary':True,'family_editorial':payload['family'],'editorial_sources':p['sources'],
           'identity_scope':p['dates'],'seed_hash':hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True).encode()).hexdigest()}
 if old:
  # Only the explicitly checked empty VLE biography is replaced. Preserve every
  # existing claim/evidence block; the ordinary append-only importer otherwise
  # keeps the placeholder introduction as well as its evidence.
  assert set(re.findall(r'\b[tc]-\d+\b',old['content_final'])) <= set(re.findall(r'\b[tc]-\d+\b',text))
  metadata['allow_object_rewrite']=True
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
  if path in created or path in enriched:
   out=root/path;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(row['content_final'])
   assert out.read_text()==row['content_final']
 report={'created':created,'enriched':enriched,'reused':existing,'database':str(ws.DB_PATH),'applied':True}
 state=root/'.cache/gimines';state.mkdir(parents=True,exist_ok=True)
 (state/(args.seed.stem+'-receipt.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'created':len(created),'enriched':len(enriched),'reused':len(existing),'applied':args.apply},ensure_ascii=False))
con.close()
