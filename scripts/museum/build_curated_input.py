"""Compile reviewed narrative and Commons records; no database writes or network calls."""
import json,re,html,hashlib,unicodedata
from pathlib import Path
from urllib.parse import unquote
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
def dump(p,d):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]*>','',str(s or '')))).strip()
commons=json.load(open(ROOT/'scripts/museum/reviewed-media/museum-commons.json'))['query']['pages'];bytitle={p['title'].replace('_',' '):p for p in commons.values() if p.get('imageinfo')}
text=(ROOT/'scripts/museum/narratives.md').read_text();narratives={m[0]:[p.strip() for p in m[1].strip().split('\n\n') if p.strip()] for m in re.findall(r'^## ([\w-]+)\n(.*?)(?=^## |\Z)',text,re.M|re.S)}
order=re.findall(r'^## ([\w-]+)',text,re.M)
# Dates are artwork dates, never the ruler's lifetime. Uncertain catalogue dates stay explicit.
dates=['1578 m.','1611 m.','XIV–XVI a.; datavimas nevienodas','1908 m.','1578 m.','1908 m.','1908 m.','1908 m.','1709 m.','XVI–XVII a.; katalogo datavimas nevienodas','1675 m.','1578 m.','XV a. antroji pusė','XIX a.','1578 m.','1840 m.','XIX a.','XIX a.','apie 1504 m.','1768–1771 m.','apie 1553 m.','apie 1582–1586 m.','po 1586 m.','1768–1773 m.','apie 1624 m.','XVII a. 3 dešimtmetis','1768–1771 m.','1768–1771 m.','1768–1771 m.','XVIII a.','1727–1728 m.','po 1733 m.','1764 m.']
focus={'jogaila':{'x':35,'y':25},'aleksandras-jogailaitis':{'x':48,'y':25},'svitrigaila':{'x':50,'y':30},'stanislovas-augustas-poniatovskis':{'x':50,'y':25}}
def media_record(p,key,caption,date,portrait=True):
 i=p['imageinfo'][0];md=i['extmetadata'];get=lambda k:clean(md.get(k,{}).get('value',''))
 src=Path('/tmp/museum-portraits' if portrait else '/tmp/museum-places')/(str(p['pageid'])+'.jpg')
 dest=ROOT/f'quartz/static/media/museum/{key}.webp'
 if src.exists():
  im=Image.open(src).convert('RGB');im.thumbnail((1000,1200) if portrait else (1000,750));dest.parent.mkdir(parents=True,exist_ok=True);im.save(dest,'WEBP',quality=88)
 elif dest.exists():im=Image.open(dest)
 else:raise ValueError('Missing inspected asset: '+str(src))
 creator=get('Artist');creator={'Unknown authorUnknown author':'Autorius nežinomas','AnonymousUnknown author':'Autorius nežinomas','Мечыслаў Барвіцкі':'Mečislovas Barvickis','en:Alexander Guagnini (1538-1614)':'Aleksandro Gvagninio leidinys'}.get(creator,creator)
 license=get('LicenseShortName');assert license in ('Public domain','CC BY-SA 4.0','CC BY-SA 3.0','CC BY 4.0','CC BY 3.0','CC0'),license
 external_id=p['title'];media_id='m-'+hashlib.sha256(('commons\0'+external_id+'\0').encode()).hexdigest()[:24]
 focal=focus.get(key,{'x':50,'y':25 if portrait else 50});url=i['url'].split('?')[0];thumb=i.get('thumburl',url).split('?')[0]
 m={'mediaId':media_id,'title':caption,'caption':caption,'originalTitle':p['title'],'creator':creator,'provider':'commons','providerLabel':'Wikimedia Commons','license':license,'licenseUrl':get('LicenseUrl') or ('https://creativecommons.org/publicdomain/mark/1.0/' if license=='Public domain' else ''),'rightsNote':'Licencija ir autorystė pagal Wikimedia Commons rinkmenos įrašą.','dateDisplay':date,'width':im.width,'height':im.height,'canonicalUrl':i['descriptionurl'],'sourceUrl':url,'thumbUrl':thumb,'displayUrl':f'/static/media/museum/{key}.webp','focalPoint':focal,'reviewStatus':'accepted','directness':'direct','relationType':'portrait_of' if portrait else 'depicts','isPrimary':1,'reviewedAt':'2026-09-20','visualReviewVersion':'museum-editorial-20260920','relatedObjects':[]}
 candidate={'provider':'commons','external_id':external_id,'canonical_url':m['canonicalUrl'],'source_url':url,'thumb_url':thumb,'preview_url':thumb,'title':caption,'description':caption,'creator':creator,'provider_label':'Wikimedia Commons','license':license,'rights_note':m['rightsNote'],'date_display':date,'width':im.width,'height':im.height,'media_type':'image','metadata':{'preview_asset':m['displayUrl'],'license_url':m['licenseUrl'],'focal_point':focal,'attribution':creator+' · '+license,'museum_artwork_date':date}}
 return m,candidate
snapshots=json.loads((ROOT/'scripts/museum/wikipedia-snapshots.json').read_text())
def wiki_snapshot(note):
 wiki=snapshots[note]
 assert wiki.get('extraction_version')=='wikipedia-rendered-v2' and wiki.get('intro') and wiki['source'].get('revision_id'),note
 return wiki
rulers=[];objects=[]
for key,date in zip(order,dates,strict=True):
 r=json.loads((ROOT/f'scripts/museum/sources/{key}.json').read_text());page=r.get('lt') or r['en'];imagepage=r.get('en') if key=='butvydas' else page
 title='File:'+unquote(imagepage['original']['source'].split('?')[0].split('/')[-1]);title=title.replace('_',' ')
 if key=='svarnas':title=next(t for t in bytitle if 'Švarn.' in t and 'Barvicki' in t)
 p=bytitle[title];late=key not in ['jogaila','aleksandras-jogailaitis','zygimantas-augustas','henrikas-valua','ona-jogailaite','zigmantas-vaza','vladislovas-vaza','augustas-ii','stanislovas-lescinskis','augustas-iii','stanislovas-augustas-poniatovskis']
 caption=f"{r['name']}. {'Vėlesnis istorinis atvaizdas' if late else 'Istorinis atvaizdas'}, {date}"
 if key=='vaisvilkas':caption='Laurušavo evangelijos aptaiso atvaizdas, tradiciškai siejamas su Vaišvilku. XIV–XVI a.; datavimas nevienodas. Tai nėra patikimas portretas iš natūros.'
 m,candidate=media_record(p,key,caption,date)
 source={'title':('Vikipedija' if r.get('lt') else 'Wikipedia (en)')+' · '+page['title'],'url':page['fullurl'].split('?')[0],'revision':page.get('revisions',[{}])[0].get('revid')}
 sources=[source]
 if key=='svarnas':sources.append({'title':'LDK istorija · Švarno valdžios klausimas','url':'https://www.ldkistorija.lt/svarnas-lietuvos-valdovas-kurio-nebuvo/'})
 if key=='mindaugas':sources.append({'title':'Visuotinė lietuvių enciklopedija · Mindaugas','url':'https://www.vle.lt/straipsnis/mindaugas/'})
 record={k:r[k] for k in ['id','name','notePath','years','reigns','eras','notice']};record.update({'objectSlug':unicodedata.normalize('NFKD',r['notePath'][:-3]).encode('ascii','ignore').decode().replace(' ','-'),'media':m,'imageNote':caption,'sources':sources,'contextualImage':key=='vaisvilkas'})
 m['relatedObjects']=[{'notePath':r['notePath'],'title':r['name'],'itemType':'asmuo','relationType':'portrait_of','directness':'direct'}]
 rulers.append(record)
 paragraphs=narratives[key];intro=paragraphs[0]
 wiki=wiki_snapshot(r['notePath'])
 if wiki['source']['url'] not in [item['url'] for item in sources]:sources.insert(0,{'title':'Vikipedija · '+wiki['source']['title'],'url':wiki['source']['url'],'revision':wiki['source']['revision_id']})
 objects.append({'name':r['name'],'notePath':r['notePath'],'type':'asmuo','wiki':wiki,'sources':sources,'sourceHash':wiki['source']['content_hash'],'aliases':[r['name'],page['title']],'media':m,'candidate':candidate})
place_texts={
'Vilnius':'Vilnius — Lietuvos sostinė ir vienas svarbiausių istorinių Lietuvos Didžiosios Kunigaikštystės centrų. Miestą išgarsino 1323 m. Gedimino laiškai, kvietę atvykti amatininkus, pirklius ir dvasininkus. Čia veikė valdovo dvaras, valstybės institucijos ir skirtingų tikybų bendruomenės. 1579 m. įkurtas universitetas sustiprino miesto kultūrinę reikšmę. Senamiestyje išlikę gotikos, Renesanso ir baroko pastatai liudija ilgą miesto raidą; 1994 m. jis įrašytas į UNESCO Pasaulio paveldo sąrašą.',
'Trakai':'Trakai — istorinis miestas tarp ežerų, glaudžiai susijęs su Lietuvos didžiųjų kunigaikščių dvaru. Jo kraštovaizdį formuoja pusiasalio ir salos pilių kompleksai. Vytauto laikais Trakai buvo svarbi rezidencija ir valstybės politinio gyvenimo vieta. Miesto istorijoje reikšmingos karaimų, totorių ir kitų bendruomenių tradicijos. Dabartinis salos pilies vaizdas apima ir išlikusį viduramžių paveldą, ir vėlesnius atkūrimo darbus, todėl šiuolaikinė panorama nėra nepakitęs senosios pilies vaizdas.',
'Kernavė':'Kernavė — istorinis miestelis Neries slėnyje ir reikšminga ankstyvosios Lietuvos archeologinė vietovė. Penkių piliakalnių kompleksas bei senovės gyvenviečių liekanos atskleidžia skirtingus apgyvendinimo laikotarpius, amatų ir prekybos raidą. XIII–XIV a. Kernavė buvo vienas svarbių Lietuvos centrų. Archeologiniai tyrimai leidžia pažinti kasdienybę, kurios rašytiniai šaltiniai beveik nefiksavo. Vietovė saugoma valstybiniame kultūriniame rezervate, o 2004 m. įtraukta į UNESCO Pasaulio paveldo sąrašą.',
'Kaunas':'Kaunas išaugo Nemuno ir Neries santakoje, strategiškai svarbioje gynybos bei prekybos vietoje. Viduramžių pilis buvo susijusi su kovomis prieš Vokiečių ordiną, o miesto plėtrą skatino upių keliai ir ryšiai su pirkliais. Senamiestyje išlikęs architektūros paveldas liudija miestiečių, vienuolijų ir skirtingų laikotarpių valdžios institucijų veiklą. XX a. Kaunas tapo laikinąja Lietuvos sostine, tačiau jo istorija prasideda gerokai anksčiau ir sieja miestą su Lietuvos Didžiosios Kunigaikštystės politiniu bei ūkiniu gyvenimu.',
'Gardinas':'Gardinas — miestas prie Nemuno dabartinėje Baltarusijoje, istoriškai priklausęs Lietuvos Didžiajai Kunigaikštystei. Jis buvo svarbi valdovų rezidencijų ir politinių susirinkimų vieta. Senosios ir Naujosios pilių istorija siejasi su Vytautu, Steponu Batoru ir Respublikos Seimais. Miesto paveldą sudaro skirtingų epochų sakraliniai bei pasaulietiniai pastatai, tarp jų Koložos cerkvė. Gardino istorija leidžia pažinti Lietuvos valstybę kaip daugiacentrę erdvę, kurios politinis gyvenimas neapsiribojo Vilniumi.',
'Naugardukas':'Naugardukas — istorinis miestas dabartinėje Baltarusijoje, ilgus amžius buvęs Lietuvos Didžiosios Kunigaikštystės dalimi. Jis siejamas su ankstyvosios Lietuvos ryšiais su rusėnų žemėmis, vėliau tapo vaivadijos centru ir Lietuvos Vyriausiojo Tribunolo posėdžių vieta. Mieste 1422 m. Jogaila susituokė su Sofija Alšėniške. Naugarduko siejimas su Mindaugo karūnavimo vieta remiasi vėlyva tradicija ir nėra patikimai įrodytas. Pilies liekanos ir miesto kultūrinė atmintis liudija daugiasluoksnę jo praeitį.',
'Krėva':'Krėva, lietuviškai dar vadinama Krevu, — istorinė vietovė dabartinėje Baltarusijoje. Jos mūrinė pilis buvo svarbus Lietuvos didžiųjų kunigaikščių gynybos ir valdžios centras. Krėvoje 1382 m. kalintas Kęstutis; čia jis mirė ne iki galo išaiškintomis aplinkybėmis. 1385 m. su vietove siejami Jogailos įsipareigojimai, atvėrę kelią jo santuokai su Jadvyga, Lenkijos karūnai ir Lietuvos krikštui. Pilies griuvėsiai šiandien primena šių dinastinių konfliktų ir susitarimų erdvę.',
'Nesvyžius':'Nesvyžius — istorinis miestas dabartinėje Baltarusijoje, ypač glaudžiai susijęs su Radvilų gimine. Jų rezidencija, archyvai, biblioteka ir meno rinkiniai pavertė miestą reikšmingu Lietuvos Didžiosios Kunigaikštystės didikų kultūros centru. Pilies ir parko ansamblis bei Dievo Kūno bažnyčia liudija Renesanso ir baroko kultūros sklaidą. Radvilų rezidencinis kompleksas įrašytas į UNESCO Pasaulio paveldo sąrašą. Nesvyžiaus istorija atskleidžia didikų dvaro vaidmenį valstybės politikoje, konfesiniame gyvenime ir kultūros mecenatystėje.'}
place_pages=json.load(open(ROOT/'scripts/museum/places-sources.json'))['query']['pages'];place_pages={p['title']:p for p in place_pages.values()};enpages=json.load(open(ROOT/'scripts/museum/reviewed-media/museum-places-images.json'))['query']['pages'];enpages={p['title']:p for p in enpages.values()};pc=json.load(open(ROOT/'scripts/museum/reviewed-media/museum-places-commons.json'))['query']['pages'];pcb={p['title'].replace('_',' '):p for p in pc.values()}
english=['Vilnius','Trakai','Kernavė','Kaunas','Grodno','Novogrudok','Kreva','Nyasvizh']
for (name,intro),en in zip(place_texts.items(),english,strict=True):
 key='vieta-'+unicodedata.normalize('NFKD',name).encode('ascii','ignore').decode().lower();page=place_pages['Krevas' if name=='Krėva' else name];ip=enpages[en];t='File:'+unquote(ip['original']['source'].split('?')[0].split('/')[-1]);p=pcb[t.replace('_',' ')];date=clean(p['imageinfo'][0]['extmetadata'].get('DateTimeOriginal',{}).get('value','')).split('date QS:')[0];caption=name+' · dabartinis vietovės vaizdas';m,candidate=media_record(p,key,caption,date,False);note=f'objektai/vietos/{name}.md';m['relatedObjects']=[{'notePath':note,'title':name,'itemType':'vieta','relationType':'depicts','directness':'direct'}];source={'title':'Vikipedija · '+page['title'],'url':page['fullurl'].split('?')[0],'revision':page.get('revisions',[{}])[0].get('revid')};wiki=wiki_snapshot(note);objects.append({'name':name,'notePath':note,'type':'vieta','wiki':wiki,'sources':[source],'sourceHash':wiki['source']['content_hash'],'aliases':[name],'media':m,'candidate':candidate})
ex={'schemaVersion':'ltkb-exhibition/v1','exhibitionId':'ex-lietuvos-ir-atr-valdovai','slug':'parodos/lietuvos-ir-atr-valdovai','title':'LDK ir ATR valdovai','subtitle':'Nuo Mindaugo iki Stanislovo Augusto Poniatovskio','description':'33 valdovų istorijos nuo Lietuvos karalystės iki Respublikos padalijimų. Nuo ankstyvosios Lietuvos kūrimosi ir dinastinių kovų iki renkamos Respublikos monarchijos, Apšvietos reformų ir 1795 metų. Atvaizdai, valdymo datos ir pasakojimai kviečia pažinti žmones, kurių sprendimai keitė valstybę.','layout':'chronological','status':'draft','noindex':True,'heroMediaId':rulers[-1]['media']['mediaId'],'sections':[]}
for era,title in [('ldk','Lietuvos Didžioji Kunigaikštystė'),('atr','Abiejų Tautų Respublika')]:
 rr=[r for r in rulers if r['eras'][0]==era];section={'sectionId':'rulers-'+era,'slug':era,'title':title,'lead':'','navMediaId':rr[0]['media']['mediaId'],'claimRefs':[],'items':[]}
 for r in rr:
  paragraphs=narratives[r['id']];section['items'].append({'exhibitionItemId':'ruler-'+r['id'],'rulerId':r['id'],'objectSlug':r['objectSlug'],'mediaId':r['media']['mediaId'],'titleLt':r['name'],'descriptionLt':paragraphs[0],'catalogDescriptionLt':paragraphs[0],'narrativeParagraphs':paragraphs,'externalSources':r['sources'],'featured':True,'claimRefs':[],'claimCodes':[]})
 ex['sections'].append(section)
dump(ROOT/'scripts/museum/curated-input.json',{'version':1,'objects':objects,'exhibition':ex,'rulers':rulers})
print('Compiled',len(rulers),'rulers',len(objects),'objects')
