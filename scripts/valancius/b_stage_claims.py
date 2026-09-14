"""Stage editorially scoped facts with real allocator ids, then blind-verify.

Only the fresh B snapshot is writable. No publication or live database access.
"""
import hashlib, json, os, sqlite3, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
BACKEND=ROOT.parent/'lt-kb'
DB=ROOT/'.valancius-state/b-revision.sqlite3'
assert DB.is_file() and ROOT.name=='lt-kb-pub-valancius'
os.environ.update(ROOT_DIR=str(BACKEND),PUBLIC_REPO_DIR=str(ROOT),DB_PATH=str(DB))
sys.path.insert(0,str(BACKEND))
from lt_kb_app.tools.promote_candidate_drafts import CandidateDraft, append_claim_evidence_to_item, upsert_quote_locator
from lt_kb_app.tools import independent_claim_verifier as iv
from lt_kb_app.core import workflow_state as ws

SPECS=[
 ('priemimas-puzaras','Į broliją gali priimti kiekvienas kunigas kas dieną.','Blaivybės brolijos narių pareigos',
  'Petras Puzaras aprašo priėmimo į Blaivybės broliją tvarką: stojantysis tą pačią dieną atlieka išpažintį ir priima Komuniją, kunigas prie Švč. Mergelės Marijos altoriaus priima jo apžadą, apšlaksto naujus narius švęstu vandeniu ir sako pamokslą.'),
 ('drausme-puzaras','Narį, \nnebesilaikantį apžado,','Blaivybės brolijos nariams Popiežius',
  'Petro Puzaro pateiktose Blaivybės brolijos taisyklėse klebonas apžado nesilaikantį narį turi du kartus įspėti, o nepasitaisiusį pašalinti iš brolijos; pašalintas žmogus vis tiek privalo laikytis Dievui duoto apžado.'),
 ('nazimov-ramybe','štai kaip M. Valančius rašė apie','Kitas dalykas, vyskupas',
  'Egidijaus Aleksandravičiaus cituojamame laiške Vilniaus generalgubernatoriui V. Nazimovui Motiejus Valančius teigė, kad pirmųjų blaivybę priėmusių pasienio parapijų žmonių šeimose sumažėjo nesantaikos, o muštynes ir barnius pakeitė ramybė.'),
 ('laisku-skirtumas','Kitas dalykas, vyskupas','Reikia pabrėžti, kad M. Valančiaus diplomatija',
  'Egidijus Aleksandravičius pažymi, kad Motiejus Valančius administracijai rašytuose laiškuose taktiniais sumetimais didino blaivybės judėjimo sėkmę, o 1858 m. pabaigos laiškuose kunigams ragino toliau skelbti blaivybę, nes dar buvo geriančių degtinę.'),
 ('skurdas','Kitas, gal net dar baisesnis dalykas','Čia J. Šimkevičius yra akylas',
  'Egidijaus Aleksandravičiaus cituojamas Jokūbas Šimkevičius valstiečių girtavimą aiškino skurdu, pažeminimu, nelaisve ir sunkiais darbais: svaiginimasis esą trumpam padedąs užmiršti nedalią.'),
 ('dvaro-ukis','O juk pačios \nsvarbiausios propinacijos prielaidos','Šis ūkininkavimas gimdė propinaciją',
  'Egidijus Aleksandravičius degtinės ir alaus gamybą sieja su dvaro pramone, naudojusia palivarkų žaliavas ir realizavusia produkciją savo valdų ribose, ribotų žemės ūkio produktų rinkos ryšių sąlygomis.'),
 ('prievartinis-girdymas','Svarbu pažymėti ir tai, kad istorinėje literatūroje stereotipiškai','Šalia to ir teiginys,',
  'Egidijus Aleksandravičius perspėja, kad užfiksuotų prievartinio degtinės pardavimo baudžiauninkams atvejų ir satyrų negalima laikyti visuotinę praktiką įrodančia taisykle.'),
 ('vezaičiai','Pirmuosius ir karščiausius blaivybės akcijos rėmėjus','Blaivaus žmogaus \nidėja',
  'Egidijus Aleksandravičius aprašo Vėžaičių savininko E. Volmerio taikytą prievartinį blaivinimą: valstiečiams nustatytą grįžimo laiką ir reikalavimą atsiskaityti dėl negėrimo; dėl žmogaus orumą žeminančių priemonių į dvarininką kreipėsi Motiejus Valančius.'),
 ('gamyba-puzaras','Dvarininkai į blaivybės sąjūdį reagavo skirtingai.','Esant tokiai padėčiai,',
  'Petras Puzaras pateikia Kauno gubernijos dvarininkų degtinės gamybos duomenis: 1859 m. – 552 643 kibirai, 1860 m. – 129 194 kibirai.'),
 ('paprociai-puzaras','paplitęs girtavimas. Jis buvo pavergęs','Taip masiškai buvo girtaujama',
  'Petras Puzaras, aprašydamas Motiejaus Valančiaus laikų Žemaičių vyskupiją, mini degtinės vartojimą per krikštynas, vestuves, laidotuves, atlaidus, kryžių ir namų šventinimą.'),
 ('mokesciu-atpirkimas','Paskutiniaisiais ikireforminiais metais ištuštėjęs Rusijos','Kiekvienas atpirkėjas gubernijoje',
  'Egidijus Aleksandravičius nurodo, kad degtinės mokesčio atpirkėjai, už pastovias įmokas iždui varžytinėmis įsigiję teisę rinkti akcizą, buvo suinteresuoti didinti svaigalų vartojimą ir plėsti prekybos tinklą.'),
]
def main():
    con=sqlite3.connect(DB);con.row_factory=sqlite3.Row
    item=con.execute("SELECT * FROM items WHERE note_path='objektai/asmenys/Motiejus Valančius.md' AND status='active'").fetchone()
    records=[]
    for key,start,end,claim in SPECS:
        src=con.execute('SELECT * FROM sources WHERE source_rel LIKE ?',('%Puzaras%' if key.endswith('puzaras') else '%Aleksandravicius%',)).fetchone()
        source=(BACKEND/src['source_rel']).read_text()
        a=source.index(start);b=source.index(end,a);quote=source[a:b].strip();b=a+len(quote)
        assert source[a:b]==quote
        existing=con.execute('SELECT claim_pk FROM claims WHERE note_path=? AND claim_text=?',(item['note_path'],claim)).fetchone()
        if not existing or con.execute('SELECT public_status FROM claims WHERE claim_pk=?',(existing['claim_pk'],)).fetchone()[0]!='accepted':
            evidence=CandidateDraft(category='asmenys',item_type='asmuo',folder='asmenys',title=item['title'],candidate_norm='motiejus valancius',
                quote_text=quote,quote_hash=ws.sha_text(ws.normalize_quote(quote)),quote_start=a,quote_end=b,
                match_method='exact',source_rel=src['source_rel'],source_hash=src['source_hash'],source_note_rel=src['source_note_rel'],
                candidate_file='scripts/valancius/b_stage_claims.py',row_count=1,confidence_rank=3)
            result=append_claim_evidence_to_item(con,item_row=item,evidence=evidence,source_rel=src['source_rel'],source_hash=src['source_hash'],
                source_note_rel=src['source_note_rel'],claim_override=claim,existing_claim_pk=existing['claim_pk'] if existing else '',extra_metadata={'editorial_scope':'valancius-b-draft-2026-09-14'})
            assert result or existing,key
            # The existing importer reuses near-duplicate quotes but preserves
            # their old offsets. Repair only this task's staged quote to the
            # exact expanded source span; never change acceptance/verdict here.
            if existing:
                owned=con.execute('SELECT e.* FROM evidence_links e JOIN claim_evidence_links l ON l.evidence_pk=e.evidence_pk WHERE l.claim_pk=? AND e.quote_hash=? AND e.public_status=?',
                    (existing['claim_pk'],evidence.quote_hash,'quarantined')).fetchall()
                for q in owned:
                    assert q['quote_text_original_md']==quote and q['note_path']==item['note_path']
                    assert len(con.execute('SELECT claim_pk FROM claim_evidence_links WHERE evidence_pk=?',(q['evidence_pk'],)).fetchall())==1
                    con.execute('UPDATE evidence_links SET quote_start=?,quote_end=? WHERE evidence_pk=?',(a,b,q['evidence_pk']))
                    local_claim=con.execute('SELECT claim_id FROM claims WHERE claim_pk=?',(existing['claim_pk'],)).fetchone()[0]
                    upsert_quote_locator(con,draft=evidence,note_path=item['note_path'],quote_id=q['quote_id'],claim_id=local_claim,validated_claim_text=claim)
        row=con.execute('SELECT * FROM claims WHERE note_path=? AND claim_text=?',(item['note_path'],claim)).fetchone()
        pages=[dict(p) for p in con.execute('SELECT pdf_page_number,page_number_label FROM source_pages WHERE source_rel=? AND text_start<? AND text_end>?',(src['source_rel'],b,a))]
        records.append({'key':key,'claimId':row['global_claim_code'],'claimPk':row['claim_pk'],'claim':claim,'pages':pages})
    con.commit()
    out=ROOT/'.valancius-state/b-research/new-claims.json';out.write_text(json.dumps(records,ensure_ascii=False,indent=2))
    print(json.dumps(records,ensure_ascii=False,indent=2),flush=True)
    targets=iv.load_targets(con,claim_pks=[x['claimPk'] for x in records]);con.commit()
    print('Blind verifier targets:',len(targets),flush=True)
    if targets:
        result=iv.verify_targets(con,targets=targets);con.commit();print(result,flush=True)
    receipt=iv.promote_public_ready_claims(con,db_path=DB,claim_pks=[x['claimPk'] for x in records],
        reason='Reviewed source passages for isolated noindex B-pair preview; not a live publication',actor='Valancius B editorial revision',create_backup=False)
    print(receipt,flush=True)
    (ROOT/'scripts/valancius/review/b-claim-staging.json').write_text(json.dumps({'claims':records,'promotion':receipt},ensure_ascii=False,indent=2))
    con.close()
if __name__=='__main__':main()
