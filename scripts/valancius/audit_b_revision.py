"""Read-only audit of the isolated B source state; emits only a review receipt."""
import json, sqlite3
from pathlib import Path

root = Path(__file__).resolve().parents[2]
backend = root.parent / 'lt-kb'
db = root / '.valancius-state/b-revision.sqlite3'
con = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
con.row_factory = sqlite3.Row
registry = json.loads((root/'scripts/valancius/evidence-register.json').read_text())
selected = [r for r in registry if any(u['work'] in ('Paroda B','kaip-valancius-keite-kasdienybe') for u in r['usedBy'])]
fresh = json.loads((root/'.valancius-state/b-research/new-claims.json').read_text())
rows=[]
for r in selected:
    claim = con.execute('SELECT * FROM claims WHERE global_claim_code=?',(r['claimId'],)).fetchone()
    assert claim['public_status']=='accepted' and claim['claim_text']==r['claim']
    citations=[]
    for e in r['evidence']:
        row=con.execute('SELECT * FROM evidence_links WHERE global_quote_code=?',(e['citationId'],)).fetchone()
        assert row['public_status']=='accepted'
        source=(backend/row['source_rel']).read_text()
        exact=row['quote_text_original_md'] or row['quote_text']
        assert source[row['quote_start']:row['quote_end']]==exact==e['exactOriginal']
        bridge=con.execute('SELECT status FROM claim_evidence_links WHERE claim_pk=? AND evidence_pk=?',(claim['claim_pk'],row['evidence_pk'])).fetchone()
        assert bridge and bridge[0]=='accepted'
        page=con.execute('SELECT pdf_page_start,pdf_page_end FROM evidence_pages WHERE evidence_pk=?',(row['evidence_pk'],)).fetchone()
        assert page['pdf_page_start']==e['pages']['pdf_page_start']
        citations.append({'citationId':e['citationId'],'pdfStart':page['pdf_page_start'],'pdfEnd':page['pdf_page_end'],'source':row['source_rel'],'exactSourceSpan':True})
    rows.append({'claimId':r['claimId'],'citations':citations})
verifications=[]
for c in fresh:
    v=con.execute("SELECT verdict,verified_at,pdf_page_start,pdf_page_end FROM claim_independent_verifications WHERE claim_pk=? AND invalidated_at IS NULL AND promotion_eligible=1 AND verdict='supported' ORDER BY verified_at DESC LIMIT 1",(c['claimPk'],)).fetchone()
    assert v,c['claimId']
    verifications.append({'claimId':c['claimId'],**dict(v)})
con.close()
receipt={'scope':'read-only isolated B review; not live publication','claims':len(rows),'newIndependentlySupported':len(verifications),'records':rows,'newVerifications':verifications}
(root/'scripts/valancius/review/b-evidence-audit.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in receipt.items() if k not in ('records','newVerifications')},ensure_ascii=False))
