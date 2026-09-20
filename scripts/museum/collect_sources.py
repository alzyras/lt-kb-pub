"""Read-only primary-source capture for the curated rulers exhibition."""
import json,urllib.request,urllib.parse,concurrent.futures,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'scripts/museum/sources';OUT.mkdir(exist_ok=True)
SEEDS=[
('Mindaugas','Mindaugas','Mindaugas','1236–1263',[(1236,1263)],'Apie 1236 m. pradėtas valdymas; karalius nuo 1253 m.'),
('Treniota','Treniota','Treniota','1263–1264',[(1263,1264)],''),
('Vaišvilkas','Vaišvilkas','Vaišvilkas','1264–1267',[(1264,1267)],'Taip pat vadinamas Vaišelga.'),
('Švarnas','Švarnas','Shvarn','apie 1267–1269',[(1267,1269)],'Valdymo Lietuvoje pobūdis ir net pats didžiojo kunigaikščio statusas istoriografijoje ginčijami.'),
('Traidenis','Traidenis','Traidenis','1269–1282',[(1269,1282)],'Valdymo pradžia kartais datuojama 1268 m.'),
('Daumantas','Daumantas','Daumantas of Lithuania','apie 1282–1285',[(1282,1285)],'Tapatybė ir valdymo pradžia neaiškios. Negalima automatiškai tapatinti su Pskovo kunigaikščiu Daumantu.'),
('Butigeidis','Butigeidis','Butigeidis','apie 1285–1291',[(1285,1291)],'Valdymo ribos apytikrės.'),
('Butvydas','Butvydas','Butvydas','apie 1291–1295',[(1291,1295)],'Šaltiniuose minimas ir Pukuvero vardu; genealogijoje lieka neaiškumų.'),
('Vytenis','Vytenis','Vytenis','apie 1295–1316',[(1295,1316)],'Valdymo pabaiga datuojama 1315 arba 1316 m.'),
('Gediminas','Gediminas','Gediminas','1316–1341',[(1316,1341)],''),
('Jaunutis','Jaunutis','Jaunutis','1341–1345',[(1341,1345)],''),
('Algirdas','Algirdas','Algirdas','1345–1377',[(1345,1377)],''),
('Jogaila','Jogaila','Jogaila','1377–1381; 1382–1392',[(1377,1381),(1382,1392)],'Nuo 1386 m. Lenkijos karalius. Po 1392 m. išlaikė aukščiausiąją valdžią, Lietuvą valdant Vytautui.'),
('Kęstutis','Kęstutis','Kęstutis','1381–1382',[(1381,1382)],'Iki tol ilgai valdė Trakus ir veikė kaip Algirdo bendravaldys.'),
('Vytautas Didysis','Vytautas','Vytautas','1392–1430',[(1392,1430)],''),
('Švitrigaila','Švitrigaila','Švitrigaila','1430–1432',[(1430,1432)],'Po nuvertimo toliau kovojo dėl valdžios; jo pretenzijos nesutampa su faktinio valdymo visoje LDK laikotarpiu.'),
('Žygimantas Kęstutaitis','Žygimantas Kęstutaitis','Sigismund Kęstutaitis','1432–1440',[(1432,1440)],''),
('Kazimieras Jogailaitis','Kazimieras Jogailaitis','Casimir IV Jagiellon','1440–1492',[(1440,1492)],'Lenkijos karalius nuo 1447 m.'),
('Aleksandras Jogailaitis','Aleksandras Jogailaitis','Alexander Jagiellon','1492–1506',[(1492,1506)],'Lenkijos karalius nuo 1501 m.'),
('Žygimantas Senasis','Žygimantas Senasis','Sigismund I the Old','1506–1548',[(1506,1548)],''),
('Žygimantas Augustas','Žygimantas Augustas','Sigismund II Augustus','1529 / 1544–1572',[(1529,1572)],'Lietuvos didžiuoju kunigaikščiu pakeltas 1529 m.; savarankiškai LDK valdė nuo 1544 m. ATR valdovas nuo 1569 m.'),
('Henrikas Valua','Henrikas Valua','Henry III of France','1573–1574 / 1575',[(1573,1575)],'1574 m. išvyko į Prancūziją; sostas paskelbtas laisvu 1575 m.'),
('Ona Jogailaitė','Ona Jogailaitė','Anna Jagiellon','1575 / 1576–1586',[(1575,1586)],'Išrinkta kartu su būsimu sutuoktiniu Steponu Batoru; karūnuota 1576 m. Karalienės titulą išlaikė iki 1596 m.'),
('Steponas Batoras','Steponas Batoras','Stephen Báthory','1576–1586',[(1576,1586)],''),
('Zigmantas Vaza','Zigmantas Vaza','Sigismund III Vasa','1587 / 1588–1632',[(1587,1632)],'Lenkijoje išrinktas 1587 m.; LDK pripažintas 1588 m.'),
('Vladislovas Vaza','Vladislovas Vaza','Władysław IV Vasa','1632–1648',[(1632,1648)],''),
('Jonas Kazimieras Vaza','Jonas Kazimieras Vaza','John II Casimir Vasa','1648–1668',[(1648,1668)],''),
('Mykolas Kaributas Višnioveckis','Mykolas Kaributas Višniaveckis','Michał Korybut Wiśniowiecki','1669–1673',[(1669,1673)],''),
('Jonas Sobieskis','J. Sobieskis','John III Sobieski','1674–1696',[(1674,1696)],''),
('Augustas II','Augustas II','Augustus II the Strong','1697–1706; 1709–1733',[(1697,1706),(1709,1733)],'Nuo 1704 m. sostą ginčijo Stanislovas Leščinskis; Augustas atsisakė jo 1706 m. ir grįžo 1709 m.'),
('Stanislovas Leščinskis','Stanislovas Leščinskis','Stanisław Leszczyński','1704–1709; 1733–1736',[(1704,1709),(1733,1736)],'Abu valdymus lydėjo konkuruojantys rinkimai ir užsienio valstybių įsikišimas.'),
('Augustas III','Augustas III','Augustus III of Poland','1733–1763',[(1733,1763)],'1733–1736 m. sostą ginčijo Stanislovas Leščinskis.'),
('Stanislovas Augustas Poniatovskis','Stanislovas Augustas Poniatovskis','Stanisław August Poniatowski','1764–1795',[(1764,1795)],''),
]
def get(url):
 for attempt in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'LietuvosIstorijaMuseum/1.0 (editorial source verification)'}),timeout=40) as r:return json.load(r)
  except Exception:
   if attempt==2:raise
   time.sleep(attempt+1)
def page(lang,title):
 args={'action':'query','format':'json','prop':'extracts|pageimages|info|revisions','inprop':'url','explaintext':1,'exchars':12000,'piprop':'thumbnail|original','pithumbsize':900,'redirects':1,'rvprop':'ids|timestamp','titles':title}
 return next(iter(get(f'https://{lang}.wikipedia.org/w/api.php?'+urllib.parse.urlencode(args))['query']['pages'].values()))
def collect(seed):
 name,note,en,years,reigns,notice=seed
 import unicodedata,re
 key=re.sub('[^a-z0-9]+','-',unicodedata.normalize('NFKD',name).encode('ascii','ignore').decode().lower()).strip('-')
 dest=OUT/(key+'.json')
 if dest.exists():return json.loads(dest.read_text())
 lt=page('lt',name)
 try: eng=page('en',en) if 'missing' in lt else {}
 except Exception: eng={}
 if 'missing' in lt:lt={}
 row={'id':key,'name':name,'notePath':f'objektai/asmenys/{note}.md','years':years,'reigns':[{'start':a,'end':b} for a,b in reigns],'eras':['ldk','atr'] if name=='Žygimantas Augustas' else ['ldk' if reigns[0][0]<1569 else 'atr'],'notice':notice,'lt':lt,'en':eng}
 dest.write_text(json.dumps(row,ensure_ascii=False,indent=2));return row
with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
 rows=list(pool.map(collect,SEEDS))
print(json.dumps({'rulers':len(rows),'missing_lt':[r['name'] for r in rows if not r['lt']],'missing_en':[r['name'] for r in rows if 'missing' in r['en']]},ensure_ascii=False))
