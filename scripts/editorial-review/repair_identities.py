"""Apply the reviewed Daumantas split without renumbering claims or quotations.

Run with backend PYTHONPATH and DB_PATH. A verified SQLite backup is required.
Only DB rows are inputs; public Markdown is never imported into the database.
"""
import argparse, hashlib, json, re, sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.tools.repair_merged_object_evidence import _generated_claim_block, _generated_evidence_block

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--apply',action='store_true')
parser.add_argument('--backup',required=True,type=Path)
parser.add_argument('--receipt',required=True,type=Path)
args=parser.parse_args()
plan=json.loads(Path(__file__).with_name('identity-corrections.json').read_text())
con=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);con.row_factory=sqlite3.Row
con.execute('PRAGMA foreign_keys=ON')
old=plan['original']; now=ws.now_iso(); changed={old}
marker='editorial_identity_split_20260927'
if json.loads(con.execute('SELECT metadata_json FROM items WHERE note_path=?',(old,)).fetchone()[0]).get(marker):
 print('Already applied');raise SystemExit(0)
assert args.backup.is_file() and args.backup.stat().st_size>1_000_000
before_claims={r['global_claim_code']:(r['claim_pk'],r['claim_text']) for r in con.execute('SELECT * FROM claims WHERE note_path=?',(old,))}
before_quotes={r['global_quote_code']:(r['evidence_pk'],r['quote_text'],r['quote_start'],r['quote_end']) for r in con.execute('SELECT * FROM evidence_links WHERE note_path=?',(old,))}
con.execute('BEGIN IMMEDIATE')
# Changed verifier inputs must be staged before they can be reviewed again.
# Do not weaken or disable the database's independent publication gate.
staged=set(plan['corrections']) | set(plan['quarantine']) | {code for move in plan['moves'] for code in move['codes']}
for code in staged:
 current=con.execute('SELECT claim_text,metadata_json FROM claims WHERE global_claim_code=?',(code,)).fetchone()
 assert current and current['claim_text']==plan['expectedOriginalText'][code],code
 staging_meta=json.loads(current['metadata_json'] or '{}')
 for key in ['public_acceptance_authorization','public_acceptance_override','legacy_publication_restore']:
  staging_meta.pop(key,None)
 con.execute("UPDATE claims SET public_status='quarantined',claim_status='quarantined',metadata_json=? WHERE global_claim_code=?",(json.dumps(staging_meta,ensure_ascii=False),code))

def j(x):return json.dumps(x,ensure_ascii=False,sort_keys=True)
def cols(t):return {r[1] for r in con.execute(f'PRAGMA table_info({t})')}
def update(t,fields,where,params):
 fields={k:v for k,v in fields.items() if k in cols(t)}
 if fields:con.execute(f'UPDATE {t} SET '+','.join(f'{k}=?' for k in fields)+' WHERE '+where,(*fields.values(),*params))
def set_note(path,text,title,meta):
 row=con.execute('SELECT item_id FROM items WHERE note_path=?',(path,)).fetchone()
 update('items',{'title':title,'content_raw':text,'content_sanitized':text,'content_final':text,'content_hash':ws.sha_text(text),'metadata_json':j(meta),'status':'active','updated_at':now},'note_path=?',(path,))
 con.execute('DELETE FROM item_sections WHERE note_path=?',(path,))
 for name,order,section in ws._extract_frontmatter_sections(ws.split_note_frontmatter(text)[1]):
  con.execute('INSERT INTO item_sections VALUES (?,?,?,?,?,?,?,?,?,?)',(ws.sha_text(f'{path}\0{name}\0{order}'),row[0],path,name,order,section,ws.sha_text(section),now,now,'{}'))
 ws.upsert_entity_note(con,note_path=path,note_text=text)

def base_text(p):
 fm={'tipas':'asmuo','pavadinimas':p['title'],'canonical_entity_id':p.get('entity',ws.entity_authority._stable_entity_id(p['path'],'person')),'canonical_biography':p['summary'],'entity_roles':['person'],'entity_view_role':'person','datos':p['dates'],'tags':['asmuo'],'external_sources_json':j(p['sources'])}
 # Clearly distinguish the literary dossier from an identified historical person.
 if 'metraščių pasakojimai' in p['path']:fm['identity_notice']='Skirtingų autorių pasakojimai; veikėjų tapatybė nenustatyta.'
 body=f"# {p['title']}\n\n## Santrauka\n\n{p['summary']}\n"
 if p['sources']:body+='\n## Šaltiniai\n\n'+'\n'.join(f"- [{s['title']}]({s['url']})" for s in p['sources'])+'\n'
 body+='\n## Kiti Daumanto vardo paminėjimai\n\n'+'\n'.join(f"- [[{q['path'][:-3]}|{q['title']}]]" for q in plan['pages'] if q['path']!=p['path'])+'\n'
 return '---\n'+''.join(f'{key}: {j(value)}\n' for key,value in fm.items())+'---\n\n'+body

for p in plan['pages']:
 if p['path']==old:continue
 assert not con.execute('SELECT 1 FROM items WHERE note_path=?',(p['path'],)).fetchone(),p['path']
 text=base_text(p)
 ws._upsert_item_projection(con,note_path=p['path'],markdown_text=text,metadata={'external_summary':True,marker:True})
 ws.upsert_entity_note(con,note_path=p['path'],note_text=text)
 changed.add(p['path'])

# Move complete evidence groups, keeping PKs, global IDs, exact text and offsets.
for move in plan['moves']:
 target=move['target']; changed.add(target)
 target_item=con.execute('SELECT item_id FROM items WHERE note_path=?',(target,)).fetchone()[0]
 cr=[con.execute('SELECT * FROM claims WHERE note_path=? AND global_claim_code=?',(old,code)).fetchone() for code in move['codes']]
 assert all(cr)
 cps={r['claim_pk'] for r in cr}
 er={r['evidence_pk']:r for c in cr for r in con.execute('SELECT e.* FROM evidence_links e JOIN claim_evidence_links l ON l.evidence_pk=e.evidence_pk WHERE l.claim_pk=?',(c['claim_pk'],))}
 for e in er.values():
  owners={r[0] for r in con.execute('SELECT claim_pk FROM claim_evidence_links WHERE evidence_pk=?',(e['evidence_pk'],))}
  assert owners<=cps,('Shared evidence cannot be split',e['global_quote_code'],owners-cps)
 cmap={r['claim_id']:r['global_claim_code'] for r in cr}; qmap={r['quote_id']:r['global_quote_code'] for r in er.values()}
 # Claim and quote IDs are unique in this small source object; assert rather than guess.
 assert len(cmap)==len(cr) and len(qmap)==len(er)
 def mapped(raw,m):return j([m.get(v,v) for v in json.loads(raw or '[]')])
 for r in cr:
  new_id=cmap[r['claim_id']]
  assert not con.execute('SELECT 1 FROM claims WHERE note_path=? AND claim_id=?',(target,new_id)).fetchone()
  update('claims',{'item_id':target_item,'note_path':target,'claim_id':new_id,'supported_quote_ids_json':mapped(r['supported_quote_ids_json'],qmap),'updated_at':now},'claim_pk=?',(r['claim_pk'],))
  update('note_claims',{'note_path':target,'claim_id':new_id,'supported_quote_ids_json':mapped(r['supported_quote_ids_json'],qmap),'entity_name':Path(target).stem,'updated_at':now},'note_path=? AND source_rel=? AND claim_id=?',(old,r['source_rel'],r['claim_id']))
  update('claim_search_fts',{'note_path':target,'claim_id':new_id},'note_path=? AND source_rel=? AND claim_id=?',(old,r['source_rel'],r['claim_id']))
  for t in ['claim_evidence_links','note_claim_quote_links','tag_evidence_links']:
   update(t,{'note_path':target,'item_id':target_item,'claim_id':new_id,'updated_at':now},'note_path=? AND source_rel=? AND claim_id=?',(old,r['source_rel'],r['claim_id']))
  for rel in con.execute('SELECT * FROM object_semantic_relations WHERE claim_pk=?',(r['claim_pk'],)).fetchall():
   fields={'claim_id':new_id,'quote_id':qmap.get(rel['quote_id'],rel['quote_id']),'updated_at':now}
   for k in ['from_note_path','to_note_path']:
    if rel[k]==old:fields[k]=target
   update('object_semantic_relations',fields,'relation_pk=?',(rel['relation_pk'],))
 for r in er.values():
  new_id=qmap[r['quote_id']]
  assert not con.execute('SELECT 1 FROM evidence_links WHERE note_path=? AND quote_id=?',(target,new_id)).fetchone()
  update('evidence_links',{'note_path':target,'item_id':target_item,'quote_id':new_id,'supports_claim_ids_json':mapped(r['supports_claim_ids_json'],cmap),'updated_at':now},'evidence_pk=?',(r['evidence_pk'],))
  for t in ['quote_evidence','source_quote_offsets','quotes_current']:
   for row in con.execute(f'SELECT rowid,* FROM {t} WHERE note_path=? AND source_rel=? AND quote_id=?',(old,r['source_rel'],r['quote_id'])).fetchall():
    fields={'note_path':target,'quote_id':new_id,'updated_at':now}
    if 'supports_claim_ids_json' in row.keys():fields['supports_claim_ids_json']=mapped(row['supports_claim_ids_json'],cmap)
    update(t,fields,'rowid=?',(row['rowid'],))
  for t in ['claim_evidence_links','note_claim_quote_links','tag_evidence_links']:
   update(t,{'quote_id':new_id,'updated_at':now},'note_path=? AND source_rel=? AND quote_id=?',(target,r['source_rel'],r['quote_id']))
 for source in {r['source_rel'] for r in cr}:
  for row in con.execute('SELECT * FROM item_sources WHERE note_path=? AND source_rel=?',(old,source)).fetchall():
   d=dict(row);d.update(item_source_pk=ws.sha_text(f'item-source\0{target_item}\0{source}'),item_id=target_item,note_path=target)
   con.execute('INSERT OR IGNORE INTO item_sources ('+','.join(d)+') VALUES ('+','.join('?' for _ in d)+')',list(d.values()))

for code,text in plan['corrections'].items():
 row=con.execute('SELECT * FROM claims WHERE global_claim_code=?',(code,)).fetchone();assert row
 meta=json.loads(row['metadata_json'] or '{}');meta[marker]={'previous_text':row['claim_text'],'reviewed_at':now}
 for k in ['claim_text','faktas']:
  if k in meta:meta[k]=text
 update('claims',{'claim_text':text,'content_hash':ws.sha_json({'claim_id':row['claim_id'],'claim_text':text}),'metadata_json':j(meta),'updated_at':now},'claim_pk=?',(row['claim_pk'],))
 update('note_claims',{'claim_text':text,'updated_at':now},'note_path=? AND source_rel=? AND claim_id=?',(row['note_path'],row['source_rel'],row['claim_id']))
 update('claim_search_fts',{'claim_text':text},'note_path=? AND source_rel=? AND claim_id=?',(row['note_path'],row['source_rel'],row['claim_id']))
for code,reason in plan['quarantine'].items():
 r=con.execute('SELECT * FROM claims WHERE global_claim_code=?',(code,)).fetchone();assert r
 meta=json.loads(r['metadata_json'] or '{}');meta[marker]={'reason':reason,'reviewed_at':now};meta.pop('legacy_public_override',None)
 update('claims',{'claim_status':'quarantined','public_status':'quarantined','metadata_json':j(meta),'updated_at':now},'claim_pk=?',(r['claim_pk'],))
 update('note_claims',{'claim_status':'quarantined','updated_at':now},'note_path=? AND source_rel=? AND claim_id=?',(r['note_path'],r['source_rel'],r['claim_id']))
 update('claim_evidence_links',{'status':'quarantined','updated_at':now},'claim_pk=?',(r['claim_pk'],))

# Regenerate only these DB documents from their own normalized rows.
for path in changed:
 row=con.execute('SELECT * FROM items WHERE note_path=?',(path,)).fetchone()
 page=next((p for p in plan['pages'] if p['path']==path),None)
 text=base_text(page) if page else row['content_final']
 # Existing Vaišelga prose is preserved; its evidence is rebuilt from DB rows.
 if not page:
  text=re.sub(r'(?ms)^## (?:Teiginiai|Reikšmingi paminėjimai|Citatos|Bibliografiniai įrodymai)\s*\n.*?(?=^## |\Z)','',text)
 claims=con.execute('SELECT * FROM claims WHERE note_path=? ORDER BY global_claim_index',(path,)).fetchall()
 quotes=con.execute('SELECT * FROM evidence_links WHERE note_path=? ORDER BY global_quote_index',(path,)).fetchall()
 if claims:text+='\n## Teiginiai\n\n'+'\n\n'.join(_generated_claim_block(r,r['claim_id'],json.loads(r['supported_quote_ids_json'] or '[]')) for r in claims)+'\n'
 if quotes:text+='\n## Reikšmingi paminėjimai\n\n'+'\n\n'.join(_generated_evidence_block(con,r,r['quote_id'],json.loads(r['supports_claim_ids_json'] or '[]')) for r in quotes)+'\n'
 meta=json.loads(row['metadata_json'] or '{}');meta.update({marker:True,'canonical_title':page['title'] if page else row['title'],'claim_count':len(claims),'evidence_count':len(quotes)})
 set_note(path,text,page['title'] if page else row['title'],meta)
 if page:
  # Invalidate generated biographical modules based on the former mixed identity.
  update('object_page_modules',{'status':'revoked','updated_at':now},'note_path=?',(path,))
  update('object_page_dossiers',{'status':'draft','updated_at':now},'note_path=?',(path,))

for code,(pk,_) in before_claims.items():assert con.execute('SELECT claim_pk FROM claims WHERE global_claim_code=?',(code,)).fetchone()[0]==pk
for code,expected in before_quotes.items():
 r=con.execute('SELECT evidence_pk,quote_text,quote_start,quote_end FROM evidence_links WHERE global_quote_code=?',(code,)).fetchone();assert tuple(r)==expected
receipt={'database':str(ws.DB_PATH),'applied':args.apply,'paths':sorted(changed),'claims_preserved':len(before_claims),'quotes_preserved':len(before_quotes),'corrections':list(plan['corrections']),'excluded_unsupported':plan['quarantine']}
if args.apply:con.commit()
else:con.rollback()
args.receipt.parent.mkdir(parents=True,exist_ok=True);args.receipt.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(receipt,ensure_ascii=False,indent=2));con.close()
