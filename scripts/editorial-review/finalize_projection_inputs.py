"""Normalize repaired note IDs and finish the reviewed identity metadata."""
import argparse,json,re,sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.tools.repair_merged_object_evidence import _generated_claim_block,_generated_evidence_block
p=argparse.ArgumentParser();p.add_argument('--paths',type=Path,required=True);p.add_argument('--apply',action='store_true');args=p.parse_args();paths=json.loads(args.paths.read_text())
con=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);con.row_factory=sqlite3.Row;con.execute('PRAGMA foreign_keys=ON');con.execute('BEGIN IMMEDIATE');now=ws.now_iso();old='objektai/asmenys/Daumantas.md';new='objektai/asmenys/Daumantas (Lietuvos valdovas).md';oldentity='ent-ad6f8f25a68c4fff556e8266';newentity=con.execute('SELECT entity_id FROM canonical_entity_views WHERE note_path=?',(new,)).fetchone()[0]
# Wikidata Special:EntityData/Q638599.json identifies the Lithuanian ruler.
con.execute('UPDATE canonical_entity_same_as SET entity_id=?,updated_at=? WHERE entity_id=? AND same_as_uri=?',(newentity,now,oldentity,'https://www.wikidata.org/entity/Q638599'))
con.execute('DELETE FROM canonical_entity_aliases WHERE entity_id=? AND alias=?',(oldentity,'Daumantas (kunigaikštis, XV a.)'))
con.execute('DELETE FROM entity_aliases WHERE entity_pk IN (SELECT entity_pk FROM entities WHERE note_path=?) AND alias=?',(old,'Daumantas (kunigaikštis, XV a.)'))
con.execute("UPDATE tags SET status='rejected',updated_at=? WHERE note_path=? AND tag='karalius'",(now,old))
r=con.execute("SELECT metadata_json FROM media_publications WHERE media_id='m-7114683e8aca0bcfab76acfe'").fetchone();m=json.loads(r[0]);m['object_links']=[{'note_path':new}];con.execute("UPDATE media_publications SET metadata_json=?,updated_at=? WHERE media_id='m-7114683e8aca0bcfab76acfe'",(json.dumps(m,ensure_ascii=False),now))
for path in paths:
 row=con.execute('SELECT * FROM items WHERE note_path=?',(path,)).fetchone();assert row
 fm,body=ws.split_note_frontmatter(row['content_final'])
 authority=con.execute('SELECT entity_id FROM canonical_entity_views WHERE note_path=?',(path,)).fetchone()
 if authority:
  fm=re.sub(r'^canonical_entity_id:.*$',lambda m:'canonical_entity_id: '+json.dumps(authority[0]),fm,flags=re.M)
  con.execute('UPDATE items SET canonical_entity_id=? WHERE note_path=?',(authority[0],path))
 body=re.sub(r'(?ms)^## (?:Teiginiai|Reikšmingi paminėjimai|Citatos|Bibliografiniai įrodymai)\s*\n.*?(?=^## |\Z)','',body)
 claims=con.execute('SELECT * FROM claims WHERE note_path=? ORDER BY global_claim_index',(path,)).fetchall();quotes=con.execute('SELECT * FROM evidence_links WHERE note_path=? ORDER BY global_quote_index',(path,)).fetchall()
 if claims:
  blocks=[]
  for r in claims:
   refs=[x[0] for x in con.execute("SELECT e.global_quote_code FROM claim_evidence_links l JOIN evidence_links e ON e.evidence_pk=l.evidence_pk WHERE l.claim_pk=? AND l.status IN ('accepted','quarantined') ORDER BY e.global_quote_index",(r['claim_pk'],))]
   blocks.append(_generated_claim_block(r,r['global_claim_code'],refs))
  body+='\n## Teiginiai\n\n'+'\n\n'.join(blocks)+'\n'
 if quotes:
  blocks=[]
  for r in quotes:
   refs=[x[0] for x in con.execute("SELECT c.global_claim_code FROM claim_evidence_links l JOIN claims c ON c.claim_pk=l.claim_pk WHERE l.evidence_pk=? AND l.status IN ('accepted','quarantined') ORDER BY c.global_claim_index",(r['evidence_pk'],))]
   blocks.append(_generated_evidence_block(con,r,r['global_quote_code'],refs))
  body+='\n## Reikšmingi paminėjimai\n\n'+'\n\n'.join(blocks)+'\n'
 text='---\n'+fm.strip()+'\n---\n\n'+body.strip()+'\n'
 con.execute('UPDATE items SET content_raw=?,content_sanitized=?,content_final=?,content_hash=?,updated_at=? WHERE note_path=?',(text,text,text,ws.sha_text(text),now,path))
 con.execute('DELETE FROM item_sections WHERE note_path=?',(path,))
 for name,order,section in ws._extract_frontmatter_sections(body):con.execute('INSERT INTO item_sections VALUES (?,?,?,?,?,?,?,?,?,?)',(ws.sha_text(f'{path}\0{name}\0{order}'),row['item_id'],path,name,order,section,ws.sha_text(section),now,now,'{}'))
if args.apply:con.commit()
else:con.rollback()
print('Normalized',len(paths),'scoped DB notes');con.close()
