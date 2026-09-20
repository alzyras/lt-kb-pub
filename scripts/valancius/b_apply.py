"""Apply the authored B revision to its isolated source DB and export normally.

Preserves A prose, all old media, and unrelated projection files. No deployment.
"""
import html,json,os,re,shutil,sqlite3,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];BACKEND=ROOT.parent/'lt-kb';WORK=ROOT/'.valancius-state/b-research';DB=ROOT/'.valancius-state/b-revision.sqlite3'
assert DB.is_file() and ROOT.name=='lt-kb-pub-valancius'
os.environ.update(ROOT_DIR=str(BACKEND),PUBLIC_REPO_DIR=str(ROOT),DB_PATH=str(DB));sys.path.insert(0,str(BACKEND))
from lt_kb_app.core import workflow_state as ws
from lt_kb_app.media.models import MediaCandidate
from lt_kb_app.media.writer import upsert_media_item,attach_media_ref
from lt_kb_app.media.importer import ensure_import_tables,_upsert_publication,export_public_media_catalog
from lt_kb_app.media.exhibitions import apply_exhibition_seed,export_public_exhibitions,validate_exhibition_seed

EDITORIAL=ROOT/'scripts/valancius'; ARCHIVE=EDITORIAL/'archive/b-before-2026-09-14'
def read(p):return json.loads(p.read_text())
def save(p,data):p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def plain(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]*>',' ',s))).strip()
GROUPS={
 'pradzia':('Laiškas Nazimovui ir jo adresatas',['t-225839','t-225840']),
 'karcema':('Papročiai ir amžininkų aiškinimai',['t-225846','t-225841','t-209294','t-209310']),
 'pajamos':('Dvaro ūkis, nuoma ir mokesčių atpirkimas',['t-225842','t-225843','t-225847','t-208599']),
 'kvietimas':('Ankstesnės iniciatyvos, raštas ir balsas',['t-209341','t-209551','t-209552','t-209554']),
 'pazadas':('Brolijos pareigos, religinė praktika ir prievartos riba',['t-208821','t-208834','t-225848','t-225849','t-208512','t-225844','t-209575','t-209576']),
 'permaina':('Gamyba, dvarininkas ir nesutarianti valdžia',['t-225845','t-208599','t-209376','t-209281','t-209266','t-208527']),
 'pabaiga':('Neužbaigta permaina ir Salantų liudijimas',['t-225840','t-209321','t-209416']),
}

def main():
    con=sqlite3.connect(DB);con.row_factory=sqlite3.Row;ensure_import_tables(con)
    # Short, exact display excerpt; retain the full verified quotation and its hash.
    tax_quote=con.execute("SELECT * FROM evidence_links WHERE global_quote_code='c-206371'").fetchone()
    original=tax_quote['quote_text_original_md'] or tax_quote['quote_text']
    excerpt=original[original.index('Mokėdami pastovias sumas'):].strip()
    assert excerpt.endswith('tinklą.') and len(excerpt)<300
    excerpt=' '.join(excerpt.split())
    con.execute('UPDATE evidence_links SET quote_text_returned=? WHERE evidence_pk=?',(excerpt,tax_quote['evidence_pk']))
    con.execute('UPDATE source_quote_offsets SET quote_text_returned=? WHERE source_rel=? AND quote_hash=?',(excerpt,tax_quote['source_rel'],tax_quote['quote_hash']))
    con.commit()
    old_cur=read(ARCHIVE/'curation.json'); old_registry=read(ARCHIVE/'exhibit-register.json')
    old_by={x['key']:x for x in old_registry}
    cur=read(EDITORIAL/'curation.json');cur['B']=read(EDITORIAL/'b-curation.json')
    # Retained objects keep stable provider identity; changed captions are authored above.
    for section in cur['B']['sections']:
        for n,item in enumerate(section['items']):
            if item['key'] in old_by:
                original=next(i for s in old_cur['B']['sections'] for i in s['items'] if i['key']==item['key'])
                section['items'][n]={**original,**item}
    rows={x['claimId']:x for x in read(EDITORIAL/'evidence-register.json')}
    # Stale B usage does not survive the new editorial register.
    for x in rows.values():x['usedBy']=[u for u in x['usedBy'] if u.get('work') not in ('Paroda B','kaip-valancius-keite-kasdienybe')]
    codes=set(code for _,cs in GROUPS.values() for code in cs)
    codes.update(i['claim'] for s in cur['B']['sections'] for i in s['items'])
    notes=set()
    for code in sorted(codes):
        c=con.execute('SELECT * FROM claims WHERE global_claim_code=?',(code,)).fetchone()
        assert c and c['public_status']=='accepted',code
        ev=[]
        for e in con.execute('SELECT e.* FROM evidence_links e JOIN claim_evidence_links l ON l.evidence_pk=e.evidence_pk WHERE l.claim_pk=? AND e.public_status=?',(c['claim_pk'],'accepted')):
            p=con.execute('SELECT * FROM evidence_pages WHERE evidence_pk=?',(e['evidence_pk'],)).fetchone()
            assert p and p['pdf_page_start'],code
            src=(BACKEND/e['source_rel']).read_text(); exact=e['quote_text_original_md'] or e['quote_text']
            assert src[e['quote_start']:e['quote_end']]==exact,code
            ev.append({'citationId':e['global_quote_code'],'source':e['source_rel'],'exactOriginal':exact,'displayExcerpt':e['quote_text_returned'] or '', 'pages':dict(p),'publicStatus':'accepted'})
        assert ev,code
        uses=rows.get(code,{}).get('usedBy',[])+[{'work':'kaip-valancius-keite-kasdienybe','section':GROUPS[g][0]} for g in GROUPS if code in GROUPS[g][1]]
        rows[code]={'claimId':code,'claim':c['claim_text'],'notePath':c['note_path'],'publicStatus':'accepted','usedBy':uses,'evidence':ev,
            'interpretationLimits':'B redakcijos kortelėse atskiriamas dokumentas, istoriko aiškinimas, teritorija ir liudijimo mastas. Katalogo tapatybė nėra nustatoma iš kontekstinio teiginio.'}
        notes.add(c['note_path'])
    for s in cur['B']['sections']:
        for i in s['items']:
            i['citation']=rows[i['claim']]['evidence'][0]['citationId']
            rows[i['claim']]['usedBy'].append({'work':'Paroda B','section':s['title'],'item':i['key'],'role':'contextual'})
    save(EDITORIAL/'curation.json',cur);save(EDITORIAL/'evidence-register.json',list(rows.values()))
    # Reconstitute old media in this new snapshot, preserving even withdrawn records.
    records={x['key']:dict(x) for x in old_registry}
    for s in cur['B']['sections']:
        for i in s['items']:
            if i['key'] in records:records[i['key']].update(i);continue
            r={**i}
            if 'vu' in i:
                m=read(WORK/f"vu-{i['vu']}.json");canvas=m['items'][i['page']-1]
                source=WORK/f"{i['vu']}-{i['page']:02}.jpg"
                r.update(canonicalUrl=f"https://kolekcijos.biblioteka.vu.lt/objects/{i['vu']}",sourceUrl=canvas['items'][0]['body']['id'],
                    institution='Vilniaus universiteto biblioteka',license='Public domain',licenseUrl=m['rights'])
                r['originalCatalogUrl']=r['canonicalUrl']
            else:
                m=read(WORK/f"commons-{i['commons']}.json")['imageinfo'][0];meta=m['extmetadata'];source=WORK/f"commons-{i['commons']}.jpg"
                r.update(canonicalUrl=m['descriptionurl'],sourceUrl=m['url'].split('?')[0],originalCatalogUrl=i['primary'],
                    license=meta['LicenseShortName']['value'],licenseUrl='https://creativecommons.org/publicdomain/mark/1.0/')
            dimensions=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(source)],text=True)
            r['width']=int(re.search(r'pixelWidth: (\d+)',dimensions)[1]);r['height']=int(re.search(r'pixelHeight: (\d+)',dimensions)[1])
            r['asset']='/static/media/valancius/'+i['file'];shutil.copy2(source,ROOT/'quartz/static/media/valancius'/i['file'])
            r['rightsNote']='Viešoji sritis pagal pirminio rinkinio IIIF / Wikimedia Commons įrašą. Nurodomi autorius, saugotojas ir kilmė. '+i.get('catalogNote','')
            if 'vu' in i:r['rightsNote']+=' VU biblioteka prašo pranešti apie panaudojimą; pranešimas nesiųstas.'
            records[i['key']]=r
    # Current curation owns copy for A as well as B; the archive owns only history.
    for cycle in cur.values():
        for section in cycle['sections']:
            for item in section['items']:
                records[item['key']].update(title=item['title'],description=item['description'])
    target=dict(con.execute("SELECT item_id,note_path,title FROM items WHERE note_path='objektai/asmenys/Motiejus Valančius.md' AND status='active'").fetchone())
    ids=[]
    for r in records.values():
        r['attribution']=f"{r['creator']}. {r['title']}. {r['date']}. {r['institution']}. {r['license']}."
        provider='vu' if 'vu' in r else 'commons';external=str(r.get('vu') or r['commons'])
        candidate=MediaCandidate(provider=provider,external_id=external,canonical_url=r['canonicalUrl'],source_url=r['sourceUrl'],
            title=r['title'],description=r['description'],creator=r['creator'],provider_label=r['institution'],license=r['license'],rights_note=r['rightsNote'],
            date_display=r['date'],date_start=None if r['key']=='karcemos-paveikslas' else r['year'],date_end=1807 if r['key']=='karcemos-paveikslas' else None,
            width=r['width'],height=r['height'],thumb_url=r['asset'],preview_url=r['asset'],
            iiif_manifest_url=r['canonicalUrl']+'/manifest.json?format=rich' if provider=='vu' else '',
            metadata={'institution':r['institution'],'license_url':r['licenseUrl'],'attribution':r['attribution'],'original_catalog_url':r['originalCatalogUrl'],
                'preview_asset':r['asset'],'canvas_number':r.get('page'),'editorial_hold':r.get('hold',''),'review_method':'editorial-visual-2026-09-14'}).to_dict()
        id=upsert_media_item(con,candidate)
        assert not r.get('mediaId') or r['mediaId']==id
        r['mediaId']=id;ids.append(id)
        attach_media_ref(con,target,candidate,{'relation_type':'contextual','directness':'contextual','confidence':0.95,
            'judge':{'caption_lt':r['title'],'reason':'Istorinis daiktas ir jo data patikrinti. Teminis, ne automatinis konkretaus įvykio liudijimas.'}},'accepted')
        _upsert_publication(con,id,{'caption_lt':r['title'],'historical_relevance':'contextual','confidence':0.95,'judge_model':'Codex editorial review',
            'media_kind':'historical-document','canonical_tags':[],'proposed_tags':[],'tag_rationale':'Izoliuota Valančiaus ciklo peržiūra',
            'visual_evidence':r['description'],'metadata_evidence':r['originalCatalogUrl'],'reason':r.get('hold') or 'Vaizdas ir jo katalogo aprašas peržiūrėti.',
            'object_links':[],'rejected_object_links':[],'visual_inspected':True},source_method='valancius_editorial_preview')
    con.commit();supplement=WORK/'media-export.json';print(export_public_media_catalog(con,media_ids=ids,output_path=supplement),flush=True)
    catalogue=read(ROOT/'quartz/static/mediaCatalogSource.json');catalogue['entries']=[x for x in catalogue['entries'] if x['mediaId'] not in ids]+read(supplement)['entries']
    save(ROOT/'quartz/static/mediaCatalogSource.json',catalogue)
    old_export=read(ARCHIVE/'exhibitionValancius.json')['exhibitions'];a=next(e for e in old_export if 'imperijos' in e['slug'])
    # Archived selection supplies identities, not the latest authored copy.
    for field in ['title','seo_title','subtitle','description']:
        a[field]=cur['A'][field]
    for section in a['sections']:
        authored=next(s for s in cur['A']['sections'] if s['slug']==section['slug'])
        section.update(title=authored['title'],lead=authored['lead'])
        for item in section['items']:
            prose=next(i for i in authored['items'] if item['exhibitionItemId']==a['exhibitionId']+'-'+i['key'])
            item.update(descriptionLt=prose['description'],catalogDescriptionLt=prose['description'])
            item['media']['visualEvidence']=prose['description']
    links=a['relatedContent']
    links[0]['title']='Valančius ir caro valdžia · straipsnis'
    links[1]['title']='Valančiaus laiškai ir draudžiamos knygos · paroda'
    links[2]['title']='Kodėl kaimas gėrė ir kaip Valančius ragino negerti · straipsnis';links[3]['title']='Valančiaus blaivybės brolijos · paroda'
    b=cur['B'];slug=b['slug'];payload={'schemaVersion':'ltkb-exhibition/v1','exhibitionId':slug,'slug':'parodos/'+slug,
        **{k:b[k] for k in ['title','seo_title','subtitle','description']},'status':'draft','noindex':True,'editorialProfile':'compact-documentary',
        'theme':'documents','relatedContent':links,'relatedObject':a['relatedObject'],'heroMediaId':records[b['hero']]['mediaId'],'sections':[]}
    for s in b['sections']:
        sec={'sectionId':slug+'-'+s['slug'],'slug':s['slug'],'title':s['title'],'lead':s['lead'],'navMediaId':records[s['items'][0]['key']]['mediaId'],'claimRefs':[],'items':[]}
        for i in s['items']:
            sec['items'].append({'exhibitionItemId':slug+'-'+i['key'],'mediaId':records[i['key']]['mediaId'],'titleLt':i['title'],
                'descriptionLt':i['description'],'catalogDescriptionLt':i['description'],'creatorDisplay':i['creator'],'dateDisplay':i['date'],'featured':True,
                'evidenceNoteLt':'Teiginys aiškina temos kontekstą; daikto tapatybę ir datą pagrindžia katalogo įrašas.',
                'claimCodes':[i['claim']],'claimRefs':[{'claimId':i['claim'],'citationId':i['citation'],'role':'contextual'}]})
        payload['sections'].append(sec)
    for p in [a,payload]:
        errors=validate_exhibition_seed(con,{**p,'status':'published'});assert not errors,errors
        print(apply_exhibition_seed(con,p),flush=True)
    con.commit()
    print(export_public_exhibitions(con,exhibition_ids=[a['exhibitionId'],slug],include_drafts=True,catalog_path=ROOT/'quartz/static/mediaCatalogSource.json',output_path=ROOT/'quartz/static/exhibitionValancius.json'),flush=True)
    # Keep the complete historical media register alongside the active selection.
    save(EDITORIAL/'review/b-media-preservation.json',{'retainedMediaIds':ids,'withdrawnKeys':['litanija','vyskupyste','altorius','giesmynas'],'activeB':[i['key'] for s in b['sections'] for i in s['items']]})
    con.close()
    print('Exporting only selected evidence objects',sorted(notes),flush=True)
    print(ws.render_public_projection(note_paths=sorted(notes),changed_only=False,preserve_existing_object_pages=True,hub_notes=False),flush=True)
    manifest=read(ROOT/'public-projection-manifest.json')
    with ws.connect() as c:
        for note in notes:
            r=c.execute("SELECT content_hash,rendered_hash FROM render_state WHERE note_path=? AND status='rendered'",(note,)).fetchone();assert r and ws.file_hash(ROOT/note)==r['rendered_hash'],note
            manifest['files'][note]=dict(r)
        manifest['contract']=ws._assert_db_export_contract(c)
    for note,v in manifest['files'].items():assert ws.file_hash(ROOT/note)==v['rendered_hash'],note
    save(ROOT/'public-projection-manifest.json',manifest)
    save(EDITORIAL/'review/b-source-export.json',{'database':str(DB),'notes':sorted(notes),'newClaimIds':[x['claimId'] for x in read(WORK/'new-claims.json')],'mediaCount':len(ids),'status':'draft-noindex'})
    # Authored text is compiled into the existing Markdown publication format.
    article=(EDITORIAL/'b-article.md').read_text()
    for group,(title,group_codes) in GROUPS.items():
        citations=[]
        for code in group_codes:
            row=rows[code];e=row['evidence'][0];p=e['pages'];page=str(p['pdf_page_start'])+(('–'+str(p['pdf_page_end'])) if p['pdf_page_end']!=p['pdf_page_start'] else '')
            source=Path(e['source']).stem.replace(' - ',' — ')
            citations.append(f'<p>{html.escape(source)}. {code}, {e["citationId"]}, PDF p. {page}. {html.escape(row["claim"])}</p>')
        extra=''
        if group=='kvietimas':extra='<p>1849 metų knygelės metaduomenys — jos galerijos kortelėje. Dovydaičio leidinys: <a href="https://maironiomuziejus.lt/post-t-collections/senuju-knygu-katalogas-ii-dalis/">Maironio muziejaus katalogas</a>, 1861 m. II dalis, inv. Nr. 2260 / K2 2864. Grožinis pasakojimas nėra šeimos istorijos protokolas.</p>'
        if group=='permaina':extra='<p class="article-evidence__limit">Gamybos duomenys nėra vartojimo duomenys. Puzaro p. 139 (PDF 135) baziniams metams prie pirmojo skaičiaus išspausdinta „1850“, o palyginime — „1858“; tas pradinis dydis ir iš jo išvesti procentai nenaudojami. Kibiro perskaičiavimas į litrus nenaudojamas dėl nepatikimos vienetų pastabos kitame šaltinyje.</p>'
        if group=='pradzia':extra='<p class="article-evidence__limit">Valančiaus dokumentas čia pasiekiamas per Aleksandravičiaus pateiktą citatą iš K. Giečio tyrimo. Tai ne originalaus laiško faksimilė. Kalbama apie 1858 m. pirmųjų blaivybės mėnesių pasienio parapijas; istorinės interpretacijos autorystė nurodyta atskirai.</p>'
        card=f'<details class="article-evidence"><summary><span class="article-evidence__eyebrow">Šaltiniai ir paaiškinimas</span><strong>{title}</strong></summary><div class="article-evidence__body">'+''.join(citations)+extra+'</div></details>'
        article=article.replace('<!-- EVIDENCE '+group+' -->',card)
    (ROOT/'straipsniai/kaip-valancius-keite-kasdienybe.md').write_text(article)

if __name__=='__main__':main()
