"""Restore source-correct excerpts for the reviewed corpus warnings.
Old citations remain unchanged in the audit ledger; replacement excerpts get new IDs.
Changed claims are staged for independent verification, never force-published.
"""
import argparse,json,re,sqlite3
from pathlib import Path
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.tools.repair_merged_object_evidence import _generated_claim_block,_generated_evidence_block
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--apply',action='store_true');p.add_argument('--receipt',type=Path,required=True);args=p.parse_args()
plan=json.loads(Path(__file__).with_name('evidence-corrections.json').read_text());con=sqlite3.connect(f'file:{ws.DB_PATH}?mode=rw',uri=True,timeout=60);con.row_factory=sqlite3.Row;con.execute('PRAGMA foreign_keys=ON');con.execute('BEGIN IMMEDIATE');now=ws.now_iso();marker='editorial_evidence_repair_20260927';results=[];changed=set()
def j(x):return json.dumps(x,ensure_ascii=False,sort_keys=True)
for entry in plan['entries']:
 c=con.execute('SELECT * FROM claims WHERE global_claim_code=? AND note_path=?',(entry['code'],entry['notePath'])).fetchone();assert c
 meta=json.loads(c['metadata_json'] or '{}')
 if meta.get(marker):continue
 assert c['claim_text']==entry['expectedClaimText'],entry['code']
 source=con.execute('SELECT source_hash FROM sources WHERE source_rel=?',(entry['sourceRel'],)).fetchone();assert source[0]==entry['sourceHash']
 text=(ws.ROOT/entry['sourceRel']).read_text();assert ws.sha_text(text)==entry['sourceHash'];assert text[entry['start']:entry['end']]==entry['excerpt']
 quote=entry['excerpt'];qh=ws.sha_text(ws.normalize_quote(quote));base=con.execute('SELECT * FROM evidence_links WHERE global_quote_code=?',(entry['replacesQuoteCodes'][0],)).fetchone();assert base
 existing=con.execute('SELECT * FROM evidence_links WHERE note_path=? AND source_rel=? AND quote_hash=? AND quote_start=? AND quote_end=?',(c['note_path'],c['source_rel'],qh,entry['start'],entry['end'])).fetchone()
 if existing:e=dict(existing)
 else:
  index,code=ws._allocate_unused_global_code(con,counter_key='quote',prefix='c-',table_names=('quotes_current','evidence_links'),code_column='global_quote_code')
  e=dict(base);e.update(evidence_pk=ws.sha_text(f"editorial-evidence\0{c['note_path']}\0{qh}"),quote_id=code,global_quote_index=index,global_quote_code=code,quote_hash=qh,quote_text=quote,quote_text_original_md=quote,quote_text_returned=quote,quote_start=entry['start'],quote_end=entry['end'],quote_status='verified',anchor_status='verified',anchor_reason='reviewed_exact_source_excerpt',match_method='exact',occurrence_count=text.count(quote),source_hash=entry['sourceHash'],public_status='accepted',supports_claim_ids_json=j([c['claim_id']]),metadata_json=j({marker:{'reviewed_at':now,'replaces':entry['replacesQuoteCodes'],'source_lines_reviewed':True}}),created_at=now,updated_at=now,sentence_start_index=None,sentence_end_index=None,context_sentence_count=0,quote_context_hash=ws.sha_text(text[max(0,entry['start']-120):entry['end']+120]))
  e['content_hash']=ws.sha_json({'quote_id':code,'quote_hash':qh,'quote_start':entry['start'],'quote_end':entry['end'],'source_hash':entry['sourceHash']})
  con.execute('INSERT INTO evidence_links ('+','.join(e)+') VALUES ('+','.join('?' for _ in e)+')',list(e.values()))
  ws._record_source_quote_offset_projection(con,source_rel=c['source_rel'],source_hash=entry['sourceHash'],note_path=c['note_path'],quote_id=code,quote_hash=qh,quote_text=quote,quote_returned=quote,match={'start':entry['start'],'end':entry['end'],'context_hash':e['quote_context_hash'],'match_method':'exact','occurrence_count':e['occurrence_count']})
 supports=set(json.loads(e['supports_claim_ids_json'] or '[]'));supports.add(c['claim_id']);con.execute('UPDATE evidence_links SET supports_claim_ids_json=? WHERE evidence_pk=?',(j(sorted(supports)),e['evidence_pk']))
 meta[marker]={'previous_text':c['claim_text'],'previous_supports':c['supported_quote_ids_json'],'replaced_quote_codes':entry['replacesQuoteCodes'],'replacement_quote_code':e['global_quote_code'],'reviewed_at':now}
 for key in ['public_acceptance_authorization','public_acceptance_override','legacy_publication_restore']:meta.pop(key,None)
 con.execute("UPDATE claims SET claim_status='quarantined',public_status='quarantined',claim_text=?,content_hash=?,supported_quote_ids_json=?,metadata_json=?,updated_at=? WHERE claim_pk=?",(entry['replacementText'],ws.sha_json({'claim_id':c['claim_id'],'claim_text':entry['replacementText']}),j([e['quote_id']]),j(meta),now,c['claim_pk']))
 con.execute("UPDATE claim_evidence_links SET status='rejected',updated_at=? WHERE claim_pk=?",(now,c['claim_pk']))
 link=dict(con.execute('SELECT * FROM claim_evidence_links WHERE claim_pk=? LIMIT 1',(c['claim_pk'],)).fetchone());link.update(link_pk=ws.sha_text(f"editorial-link\0{c['claim_pk']}\0{e['evidence_pk']}"),evidence_pk=e['evidence_pk'],quote_id=e['quote_id'],global_quote_code=e['global_quote_code'],status='quarantined',updated_at=now,created_at=now,metadata_json=j({marker:True}))
 con.execute('INSERT INTO claim_evidence_links ('+','.join(link)+') VALUES ('+','.join('?' for _ in link)+')',list(link.values()))
 con.execute('UPDATE note_claims SET claim_status=?,claim_text=?,supported_quote_ids_json=?,updated_at=? WHERE note_path=? AND source_rel=? AND claim_id=?',('quarantined',entry['replacementText'],j([e['quote_id']]),now,c['note_path'],c['source_rel'],c['claim_id']))
 con.execute('UPDATE claim_search_fts SET claim_text=? WHERE note_path=? AND source_rel=? AND claim_id=?',(entry['replacementText'],c['note_path'],c['source_rel'],c['claim_id']))
 # Relations anchored to this claim must follow its newly reviewed exact excerpt.
 con.execute('UPDATE object_semantic_relations SET quote_id=?,quote_hash=?,quote_start=?,quote_end=?,updated_at=? WHERE claim_pk=?',(e['quote_id'],qh,entry['start'],entry['end'],now,c['claim_pk']))
 changed.add(c['note_path']);results.append({'claim':entry['code'],'quote':e['global_quote_code'],'source_hash':entry['sourceHash']})
for path in changed:
 row=con.execute('SELECT * FROM items WHERE note_path=?',(path,)).fetchone();fm,body=ws.split_note_frontmatter(row['content_final']);summary=plan['summaries'].get(path)
 # Remove cached interpretations made from the mismatched source excerpts.
 for key in ['object_page_view_json','canonical_biography']:
  fm=re.sub(r'^'+key+r':.*\n?','',fm,flags=re.M)
 if summary:
  fm+='\ncanonical_biography: '+j(summary)+'\n'
  body=re.sub(r'(?ms)(^## Santrauka\s*\n).*?(?=^## |\Z)',lambda m:m[1]+'\n'+summary+'\n\n',body,count=1)
 if path.endswith('/Egidijus.md'):
  fm=re.sub(r'^(?:date_start|date_end|datos|amziai):[^\n]*(?:\n[ \t]+[^\n]*)*\n?','',fm,flags=re.M)
  fm+='datos: ["XIII–XIV a."]\n'
 if path in plan['externalSources']:
  body+='\n## Papildoma literatūra\n\n'+'\n'.join(f"- [{s['title']}]({s['url']})" for s in plan['externalSources'][path])+'\n'
 body=re.sub(r'(?ms)^## (?:Teiginiai|Reikšmingi paminėjimai|Citatos|Bibliografiniai įrodymai)\s*\n.*?(?=^## |\Z)','',body)
 claims=con.execute('SELECT * FROM claims WHERE note_path=? ORDER BY global_claim_index',(path,)).fetchall();quotes=con.execute('SELECT * FROM evidence_links WHERE note_path=? ORDER BY global_quote_index',(path,)).fetchall()
 body+='\n## Teiginiai\n\n'+'\n\n'.join(_generated_claim_block(r,r['claim_id'],json.loads(r['supported_quote_ids_json'] or '[]')) for r in claims)+'\n'
 body+='\n## Reikšmingi paminėjimai\n\n'+'\n\n'.join(_generated_evidence_block(con,r,r['quote_id'],json.loads(r['supports_claim_ids_json'] or '[]')) for r in quotes)+'\n'
 text='---\n'+fm.strip()+'\n---\n\n'+body.strip()+'\n';meta=json.loads(row['metadata_json'] or '{}');meta[marker]=True
 con.execute('UPDATE items SET content_raw=?,content_sanitized=?,content_final=?,content_hash=?,metadata_json=?,updated_at=? WHERE item_id=?',(text,text,text,ws.sha_text(text),j(meta),now,row['item_id']))
 con.execute('DELETE FROM item_sections WHERE note_path=?',(path,))
 for name,order,section in ws._extract_frontmatter_sections(body):con.execute('INSERT INTO item_sections VALUES (?,?,?,?,?,?,?,?,?,?)',(ws.sha_text(f'{path}\0{name}\0{order}'),row['item_id'],path,name,order,section,ws.sha_text(section),now,now,'{}'))
 ws.upsert_entity_note(con,note_path=path,note_text=text)
 con.execute("UPDATE object_page_modules SET status='revoked',updated_at=? WHERE note_path=?",(now,path))
 con.execute("UPDATE object_page_dossiers SET status='draft',updated_at=? WHERE note_path=?",(now,path))
if args.apply:con.commit()
else:con.rollback()
args.receipt.write_text(json.dumps({'database':str(ws.DB_PATH),'applied':args.apply,'paths':sorted(changed),'repairs':results},ensure_ascii=False,indent=2)+'\n');print(j({'paths':len(changed),'repairs':len(results),'applied':args.apply}));con.close()
