---
tipas: tyrimas
pavadinimas: 'Dviprasmių žmonių auditas - Lietuvos metraštis, Bychovco kronika (1971 m.) - 2026-06-16'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
sukurta: ''
atnaujinta: ''
media_total_count: '0'
media_primary_thumb_url: ''
media_primary_canonical_url: ''
media_primary_directness: ''
media_primary_relation_type: ''
media_primary_json: ''
media_direct_json: |-
  []
media_contextual_json: |-
  []
media_all_json: |-
  []
---
# Dviprasmių žmonių auditas - Lietuvos metraštis, Bychovco kronika (1971 m.) - 2026-06-16

## Vykdymo metaduomenys

- knyga: Lietuvos metraštis, Bychovco kronika (1971 m.)
- source_file: `darbas/sources/Lietuvos metraštis, Bychovco kronika (1971 m.).md`
- modelis: unknown
- data_ir_laikas: 2026-06-16 09:45
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

- failas: `objektai/asmenys/Daugirdas.md`
- problema: Viešo įrašo antraštė palikta vien vardinė, nors šiame šaltinyje yra aiškus pilnas asmenvardis. Tai sudaro dubliavimo ir klaidingo jungimo riziką su kitais Daugirdais. Esamame viešame įraše taip pat trūksta `priskyrimo_pagrindas` lauko citatų bloke.
- citata: |
    1 1  Kalbama apie Joną Daugirdą, žinomą nuo 1401 m., buvusį
    Vytauto dvaro maršalu (1424), Podolės Kameneco seniūnu (iki
    1430 m. rudens), Lucko seniūnu. Vilniaus vaivada J. Daugirdas bu ­
    vo  nuo 1434 m. bent iki 1443 m. liepos 13 d. M irė 1443 m.
- sprendimas: Pervadinti į aiškesnę kanoninę formą `Jonas Daugirdas`, perkelti su šiuo šaltiniu susijusias citatas į tą tapatybę ir naujuose `c-*` blokuose pridėti `priskyrimo_pagrindas`.
- būsena: pervadinti

## Įrašas arba kandidatas

- failas: `objektai/asmenys/Leliušas.md`
- problema: Viešo įrašo antraštė palikta vien vardinė, nors šiame šaltinyje yra aiški pavardinė forma. Esamame viešame įraše citatų bloke taip pat trūksta `priskyrimo_pagrindas`.
- citata: |
    1! Petras Loliušas (Lolussa. Lelusch) Trakų vaivada buvo bent
    nuo 1434.IX.15 iki 1440 m. liepos mėn.
- sprendimas: Pervadinti į `Petras Leliušas`, šio šaltinio citatas jungti prie tikslesnės tapatybės ir naujuose `c-*` blokuose pridėti `priskyrimo_pagrindas`.
- būsena: pervadinti

## Įrašas arba kandidatas

- failas: `objektai/asmenys/Radvila.md`
- problema: Įrašo pavadinimas yra tik giminės vardas. Šioje knygoje konkretus epizodas mini tik pareiginę formą `krašto maršalas Radvila`, o kitose tos pačios knygos vietose randama ir konkretesnė `Radvila Astikaitis` tapatybė. Vien pagal `Radvila` negalima saugiai priskirti visų citatų vienam asmeniui. Esamame viešame įraše trūksta `priskyrimo_pagrindas` ir yra perplėstų, su šiuo šaltiniu nesusijusių ryšių sankaupa.
- citata: |
    Jo įkėli­
    mui į chano sostą drauge su juo pasiuntė krašto mar­
    šalą Radvilą 3 2 . Ir Radvila atlydėjo jį pagarbiai ligi pa-
- sprendimas: Šio šaltinio citatos neprijungti automatiškai prie bendro `Radvila` įrašo. Pirmiausia atskirti, ar kalbama apie `Radvila Astikaitį`, ar tik apie nepakankamai identifikuotą maršalą; iki tol laikyti nepatikimu jungimu.
- būsena: reikia patikrinti

## Įrašas arba kandidatas

- failas: `objektai/asmenys/Slavka.md`
- problema: Viešo įrašo antraštė palikta vien vardinė, nors šaltinis jį identifikuoja tik kaip Žygimanto tarną. Be to, viešame citatų bloke trūksta `priskyrimo_pagrindas`. Papildomas sutapatinimas su forma `Claubo` šaltinyje yra tik spėjamas, todėl jo negalima laikyti tvirtu tapatybės pagrindu.
- citata: |
    Ir tą akimirksnį ant jo krito jo mylimiausias tar­
    nas, vardu Slavka 2 ® , norėdamas išgelbėti savo valdovą
    nuo mirties, nes didysis kunigaikštis Žygimantas jį la­
    bai mylėjo. O jie tą Slavką griebė ir išmetė per bokšto
    langą, ir jis ten nulūžo sprandą
- sprendimas: Jei viešas įrašas paliekamas, jį pervadinti į rolę išlaikančią formą, pvz. `Slavka (Žygimanto tarnas)`, ir naujuose `c-*` blokuose pridėti `priskyrimo_pagrindas: explicit_name`. Spėjamo ryšio su `Claubo` viešai nejungti.
- būsena: pervadinti

## Įrašas arba kandidatas

- failas: `objektai/asmenys/Skabeika.md`
- problema: Viešo įrašo antraštė palikta vien vardinė, o komentarinė šaltinio vieta pati pabrėžia, kad tikslesnių duomenų apie asmenį nėra. Viešame citatų bloke trūksta `priskyrimo_pagrindas`.
- citata: |
    1 5  Pasak M. Strijkovskio, Skabeika buvo Žygimanto Kęstutai­
    čio ekonomu ir drauge žirgininku. Jokių tikslesnių duomenų apie
    j | nėra.
- sprendimas: Jei įrašas paliekamas, pervadinti tik į rolę paaiškinančią formą, o ne mėginti jį sulyginti su kitu tuo pačiu vardu. Naujuose `c-*` blokuose pridėti `priskyrimo_pagrindas`.
- būsena: reikia patikrinti

## Įrašas arba kandidatas

- failas: `kandidatas: Andrius Nemyra`
- problema: Kandidato tapatybė pažymėta kaip žema. Pati šaltinio pastaba sako, kad asmuo kituose šaltiniuose nepaliudytas, o ryšys su kitais Nemyromis tėra netiesioginis.
- citata: |
    1  A ndrius Nemyra kituose šaltiniuose nepaliudytas, bet vienas
    Nemyra (be vardo) jau  figūruoja 1398 m. Salyno sutarties akte
    tarp liudininkų ir taip  pat 1401,1.18 Vilniaus unijos akte. T ai rodo.
- sprendimas: Viešo asmens įrašo nekurti. Palikti kandidatą arba privatų audito įrašą iki atsiras tiesioginis, aukštesnio pasitikėjimo tapatybės pagrindas.
- būsena: palikti kandidatu

## Įrašas arba kandidatas

- failas: `kandidatas: Sofija Zadvydaitė`
- problema: Kandidato istoriškumas pačiame šaltinio komentare apibūdinamas kaip ilgai neigtas, o tikslesnių žinių apie pačią figūrą nerasta. Tapatybė žemo patikimumo.
- citata: |
    7  Solijos Zadvydaitės istoriškumas ilgų laikų buvo neigiamas.
    Dabar linkstama manyti, kad jos tėvas Žadvydas buvo istorinis as­
    muo, XIV a. Podolės kunigaikščio Teodoro Kanjotaičio sūnus.
    Tačiau apie pačių Sofijų Zadvydaitę nei ap .e jos valdų Podo­
    lėje kol kas nerasta tikslesnių žinių.
- sprendimas: Viešo asmens įrašo nekurti. Palikti kandidatą arba auditą iki atsiras tiesioginė ir stabilesnė tapatybės atrama.
- būsena: palikti kandidatu

## Įrašas arba kandidatas

- failas: `kandidatas: Algimantas`
- problema: Kandidatas remiasi vien dviprasmiu vardiniu paminėjimu. Šaltinis tiesiogiai sako, kad galutinai neišaiškinta, kuris Algimantas turimas omenyje.
- citata: |
    Lenkų šaltinis (Monumenta Polo-
    niae Historica, 1 1 , p. 909) mini „Olgemuntą” (Algimantą), dalyvj
    Lietuvos delegacijos, kuri 1385 m. sa u sio -k o v o  mėn. derėjosi
    Krokuvoje dėl Jogailos ir Jadvygos vedybų. Galutinai neišaiškinta,
    ar šis Algimantas buvo Jonas Algimantaitis, pastarojo tėvas, ar
    koks kitas asmuo.
- sprendimas: Viešo asmens įrašo nekurti ir nejungti prie jokio esamo Algimanto. Laikyti tik audito ar kandidato lygmenyje.
- būsena: palikti kandidatu

## Įrašas arba kandidatas

- failas: `kandidatas: Rakas Moskvičius`
- problema: Kandidato tapatybė pačiame šaltinyje įvardyta kaip neišaiškinta. Alternatyvi Strijkovskio forma nesuteikia pakankamo pagrindo viešam sutapatinimui.
- citata: |
    95 Aleksandro dvarionlo Rako M oskvičiaus asmuo neišaiškintas.
    M. Strijkovskis (Kronika, p. 668) jį vadina ne Moskvičiuml, o Ročka
    Maskevičiuml iš V olkovysko pavieto („Rak albo Raczko Maskie-
    wlcz"). tuo būdu susiedamas ji su Naugarduko vaivadijos bajorų
    M askevičių gimine.
- sprendimas: Viešo asmens įrašo nekurti. Palikti kandidatą audite iki atsiras tikslesnė, tiesiogiai šaltinio patvirtinta tapatybė.
- būsena: palikti kandidatu

## Įrašas arba kandidatas

- failas: `kandidatas: Jonas Zinevas`
- problema: Kandidatas remiasi spėjamu sutapatinimu. Pati šaltinio formuluotė `gal būt` neleidžia jo viešai tvirtinti kaip patvirtinto asmens.
- citata: |
    78 2inevoJus — gal būt, tai Jonas (Ivaškoj Zlnevas (Ziniev),
    Aleksandro dvarionis, kuris 1494 m. gavo iš jo  Livų, Polonkos ir
    Parčičių kaimus. Šito Ivaškos Zinevo žmona O na (Hanna) buvo
    našlė jau  1505 m.
- sprendimas: Viešo asmens įrašo nekurti ir nejungti prie jokio esamo Jono Zinevo. Laikyti tik kandidatu ar audito įrašu.
- būsena: palikti kandidatu

## Įrašas arba kandidatas

- failas: `kandidatas: Jaunius`
- problema: Kandidatas remiasi vien vardu ir pareiga. Nors vietinis kontekstas rodo Trakų vaivadą, tapatybė išlieka tik vidutinio pasitikėjimo ir dar nesuteikia saugaus pagrindo plikam vienvardžiam viešam įrašui.
- citata: |
    3 Tikrų žinių apie Žygimanto Kęstutaičio represijas savo poli­
    tiniams ir kitiems priešams tėra keliais atvejais. Pirmiausia, 1432 m.
    pabaigoje Žygimanto Kęstutaičio įsakymu buvo nukirstos galvos
    Trakų vaivadai (nuo 1413 m.) Jauniui
- sprendimas: Jei kandidatas kada nors bus keliamas į viešą lygį, pavadinimas turi būti disambiguuotas role, o ne paliktas vien `Jaunius`. Kol kas palikti kandidatu.
- būsena: palikti kandidatu
