"""Synchronize the reviewed exhibition prose and Daumantas media ownership.
Publication states, claim references and quote text are deliberately preserved.
"""
import argparse,json,sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--apply',action='store_true');args=p.parse_args();root=Path(__file__).resolve().parents[2]
con=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);con.row_factory=sqlite3.Row;con.execute('PRAGMA foreign_keys=ON');con.execute('BEGIN IMMEDIATE');now=ws.now_iso()
old='objektai/asmenys/Daumantas.md';new='objektai/asmenys/Daumantas (Lietuvos valdovas).md';media='m-7114683e8aca0bcfab76acfe'
item=con.execute('SELECT item_id FROM items WHERE note_path=?',(new,)).fetchone();assert item
con.execute('UPDATE media_refs SET note_path=?,item_id=?,updated_at=? WHERE note_path=? AND media_id=?',(new,item[0],now,old,media))
for table in ['media_candidate_ledger']:
 for r in con.execute(f'SELECT * FROM {table} WHERE note_path=?',(old,)).fetchall():
  candidate=json.loads(r['candidate_json'] or '{}')
  if 'Daŭmont' in r['external_id'] and '1908' in r['external_id']:
   con.execute(f'UPDATE {table} SET note_path=?,item_id=? WHERE candidate_pk=?',(new,item[0],r['candidate_pk']))
counts={'exhibitions':0,'sections':0,'items':0}
for name in ['exhibitionsSource.json','exhibitionSupplements.json','exhibitionAuthoritySeals.json','exhibitionStateSymbols.json','exhibitionValancius.json','exhibitionRulers.json','exhibitionNobleFamilies.json']:
 d=json.loads((root/'quartz/static'/name).read_text())
 for ex in d.get('exhibitions',[]):
  row=con.execute('SELECT * FROM exhibitions WHERE exhibition_id=? OR slug=?',(ex['exhibitionId'],ex['slug'])).fetchone()
  if not row:continue
  fields={k:ex[k] for k in ['title','subtitle','description'] if k in ex}
  if fields:con.execute('UPDATE exhibitions SET '+','.join(k+'=?' for k in fields)+',updated_at=? WHERE exhibition_id=?',(*fields.values(),now,row['exhibition_id']));counts['exhibitions']+=1
  for section in ex.get('sections',[]):
   sid=section.get('sectionId')
   sr=con.execute('SELECT * FROM exhibition_sections WHERE section_id=? AND exhibition_id=?',(sid,row['exhibition_id'])).fetchone()
   if sr:
    con.execute('UPDATE exhibition_sections SET title=?,lead=?,updated_at=? WHERE section_id=?',(section['title'],section.get('lead',''),now,sid));counts['sections']+=1
   for entry in section.get('items',[]):
    ir=con.execute('SELECT * FROM exhibition_items WHERE exhibition_item_id=?',(entry['exhibitionItemId'],)).fetchone()
    if not ir:continue
    assert ir['exhibition_id']==row['exhibition_id']
    meta=json.loads(ir['metadata_json'] or '{}')
    for key in ['narrativeParagraphs','externalSources','objectSlug','rulerId','objectLinks']:
     if key in entry:meta[key]=entry[key]
    con.execute('UPDATE exhibition_items SET section_id=?,title_lt=?,description_lt=?,catalog_description_lt=?,metadata_json=?,updated_at=? WHERE exhibition_item_id=?',(sid if sr else ir['section_id'],entry.get('titleLt',ir['title_lt']),entry.get('descriptionLt',ir['description_lt']),entry.get('catalogDescriptionLt',ir['catalog_description_lt']),json.dumps(meta,ensure_ascii=False),now,ir['exhibition_item_id']));counts['items']+=1
if args.apply:con.commit()
else:con.rollback()
print(json.dumps({**counts,'applied':args.apply}));con.close()
