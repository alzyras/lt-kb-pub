---
tipas: kokybės auditas
pavadinimas: 'Dviprasmių žmonių auditas - Lietuvos istorija (2013 m.) - 2026-05-13'
statusas: reikia patikrinti
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
sukurta: ''
atnaujinta: ''
---
# Dviprasmių žmonių auditas

## Vykdymo metaduomenys
- knyga: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
- source_file: `darbas/sources/Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-05-13 03:10 EEST
- paskutinis_promptas: `darbas/prompts/05_quality_control/05_audit_ambiguous_people.md`
- ivykdyti_promptai:
  - `darbas/prompts/00_common/01_rules.md`
  - `darbas/prompts/00_common/03_naming_and_note_style.md`
  - `darbas/prompts/00_common/04_citation_policy.md`
  - `darbas/prompts/00_common/05_linking_rules.md`
  - `darbas/prompts/00_common/06_quality_criteria.md`
  - `darbas/prompts/00_common/07_deduplication.md`
  - `darbas/prompts/00_common/08_person_identity.md`
  - `darbas/prompts/00_common/09_evidence_ledger.md`
  - `darbas/prompts/00_common/10_scale_and_registry.md`
  - `darbas/prompts/00_common/11_claim_level_evidence.md`
  - `darbas/prompts/05_quality_control/05_audit_ambiguous_people.md`

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.).md` — Palemonas / Kunas / Spera / Barkas
- problema: Kandidatai remiasi legendiniu, paties šaltinio kaip sugalvotų legendų įvardytu kontekstu. Tai nėra pakankamas pagrindas kurti ar pildyti įprastus istorinių asmenų įrašus.
- citata:
  > Tik ši istorija atskirtina nuo
  > legendų, sugalvotų XV–XVI a., apie romėnišką lietuvių kilmę, apie Pale-
  > moną ir jo sūnus Kuną, Sperą ir Barką.
- sprendimas: Nepromotuoti į viešas asmenų pastabas kaip patvirtintų istorinių asmenų. Jei vėliau bus kuriamas legendinių figūrų / pasakojimų modelis, svarstyti atskirą neistorinio statuso klasifikaciją.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.).md` — Živinbudas / Dausprungas
- problema: Vardai pateikti hipotetiniame klausime apie galimas „Lietuvas“, be savarankiško vaidmens, veiksmo ar tapatybės įrodymo.
- citata:
  > Tačiau jei yra Mindaugo Lietuva, tai
  > gal būta ir, tarkim, „Živinbudo“ ar „Dausprungo“ Lietuvos? Todėl linksta-
  > ma prie apytikrės datos – Lietuvos valstybė susikūrė apie 1240 m.
- sprendimas: Nekurti viešų asmens pastabų ir neprijungti prie esamų asmenų. Laikyti tik kaip neaiškų atradimo signalą.
- būsena: palikti kandidatu

## Įrašas arba kandidatas
- failas: `darbas/tmp/candidates/people/Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.).md` — Birutė, `chunk_0002.md`
- problema: Vienvardis paminėjimas yra tik iliustracijos / portreto antraštė. Pats kandidatas turi stipresnį kūno teksto įrodymą kitame gabale, todėl ši antraštė neturi būti naudojama kaip savarankiškas naujas claim-level pagrindas.
- citata:
  > Birutė. Dail A. Penkowskis, 1838 m.
- sprendimas: Jei pildoma [[Birutė]], naudoti kūno teksto citatą apie Kęstutį, kunigaikštienės statusą, pagonišką palaidojimą ir legendą; šią antraštę palikti tik kaip silpną kontekstą arba atmesti kaip trivialų paminėjimą.
- būsena: reikia patikrinti

## Įrašas arba kandidatas
- failas: `../lt-kb-pub/objektai/asmenys/Birutė.md`
- problema: Esami vieši asmens įrodymų blokai `c-001`, `c-002` ir `c-003` neturi privalomo lauko `priskyrimo_pagrindas`. Tapatybė atrodo paremta aiškiais vardiniais ar giminystės kontekstais, bet mechaninė person-evidence schema nėra pilna.
- citata:
  > Jo tėvas Kęstutis, nuolatinis
  > Žemaičių krašto gynėjas, turėdamas per 40 metų vedė žinomo
  > Žemaičių bajoro Vydimanto dukterį Birutę.
- sprendimas: Atskirame remonto žingsnyje pridėti `priskyrimo_pagrindas` prie esamų c-blokų, neperrašant ir nerenumeruojant teiginių bei citatų. Galimas `c-002` pagrindas: `explicit_name`.
- būsena: reikia patikrinti

## Įrašas arba kandidatas
- failas: `../lt-kb-pub/objektai/asmenys/Kristijonas.md`; dabartinis kandidatas `Kristijonas`
- problema: Viešas įrašas yra vienvardis ir jungia kelis kontekstus: Prūsų vyskupą / Olivos cistersų vienuolį, Mindaugo diecezijos vyskupą ir šiame šaltinyje aptiktą Livonijos ordino brolį kunigą Kristijoną. Dabartinis šaltinis pats pateikia tik titulą ir vaidmenį, bet nepakanka saugiai nuspręsti, ar visi šie paminėjimai yra tas pats asmuo.
- citata:
  > Mindaugas įžvalgiai pasirinko pagalbininką – Livonijos ordino bro-
  > lį kunigą Kristijoną, iš kurio gavo informaciją apie Katalikų bažnyčios
  > organizaciją ir popiežiaus santykius su Europos valdovais, ypač impera-
  > toriumi.
- sprendimas: Nepridėti šios citatos prie esamo `Kristijonas.md`, kol nepatikrintas tapatybės sutapimas. Jei reikės atskiro įrašo, šaltinis remia disambiguotą pavadinimą `Kristijonas (Livonijos ordino kunigas)`.
- būsena: reikia patikrinti

## Įrašas arba kandidatas
- failas: `../lt-kb-pub/objektai/asmenys/Kristijonas.md`
- problema: Esami vieši blokai `c-001`–`c-004` neturi `priskyrimo_pagrindas`, o vienvardė kanoninė antraštė didina riziką, kad ateities ištraukos bus prijungtos pagal vardą, o ne pagal stabilų titulą ar vietinį kontekstą.
- citata:
  > Pirmasis misijonierius, kuriam Prūsuose ėmė sektis, buvo iš
  > gretimosios Pamarės, Olivos cistersų ordino vienuolis Kristi-
  > jonas.
- sprendimas: Prieš pildant dabartiniu šaltiniu, atlikti atskirą tapatybės remonto auditą: atskirti ar patvirtinti Prūsų vyskupo, Olivos cistersų vienuolio, Mindaugo diecezijos vyskupo ir Livonijos ordino kunigo Kristijono kontekstus; tik tada pridėti trūkstamus `priskyrimo_pagrindas` laukus.
- būsena: reikia patikrinti
