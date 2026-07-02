---
tipas: asmuo
pavadinimas: 'Petras Šuiskis'
saltiniai:
  - 'Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)'
datos:
  - '1564 m.'
date_start: '1564'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karvedys
  - kunigaikštis
amziai:
  - 'XVI'
periodo_grupes:
  - 'LDK'
---
# Petras Šuiskis

## Santrauka

Viena jų, vadovaujama kunigaikščio Baziliaus Serebriano, pajudėjo iš Smolensko, kita, vadovaujama patyrusio karvedžio kunigaikščio Petro Šuiskio, iš Polocko traukė į Drucką. Šuiskis pajudėjo sausio 23 d. Apie tai Lietuvos didysis etmonas Mykolas Radvila Rudasis žvalgų buvo greitai informuotas, pats jis tuo metu buvo tik apie 100 km nuo Polocko, Lukomlyje.

## Teiginiai

<a id="claim-t-40392"></a>
- t-001
  global_id: t-40392
  teiginys: 'Kunigaikštis Petras Šuiskis su savo kariuomene iš Polocko pajudėjo sausio 23 d.'
  sudarymo_pagrindimas: 'Teiginys paremtas citata, bet inicialas išplėstas į pilną vardą pagal objekto pavadinimą.'
  susije_objektai: 'mentioned_place: Polockas; mentioned_group: [[objektai/grupes/Maskvėnai|Maskvėnai]]; mentioned_object: [[objektai/daiktai/Artilerija|Artilerija]]; mentioned_object: [[objektai/zodynas/etmonas|etmonas]]; mentioned_place: Lietuva'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=4fd292171d0b11fc655a8f3ddcc6886db77641f573d4e2519f9a062b72e7ea4b; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Druckas: 0.90
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Petras Šuiskis: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Druckas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Petro Šuiskio kariuomenė tiesiogiai traukė į Drucką.

<a id="claim-t-40393"></a>
- t-002
  global_id: t-40393
  teiginys: 'Kunigaikštis Petras Šuiskis vadovavo kariuomenei, kuri iš Polocko traukė į Drucką.'
  susije_objektai: 'llm_object: Druckas; mentioned_place: Druckas; mentioned_place: Polockas; mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_place: Viena; mentioned_place: Vilnius; llm_object: Lietuva'
  semantiniai_rysiai: '[[objektai/asmenys/Petras Šuiskis|Petras Šuiskis]] keliavo į Druckas; [[objektai/asmenys/Petras Šuiskis|Petras Šuiskis]] surengė žygį į Lietuva'
  temporaliniai_duomenys: 'įvykio data: 1564 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=9de9ee5d44c9e844251782e372de484b7b36c254edbb92e2938c77c465155dcb; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Polockas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Petras Šuiskis: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Polockas: mention_match, place, gap=37
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Petras Šuiskis" parinktas kaip owner_note_path. Targetas "Polockas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/ivykiai/Ulos (Čašnikų) mūšis (1564 m. sausio 23 d.).md#claim-t-09887|Ulos (Čašnikų) mūšis (1564 m. sausio 23 d.)]]: Petras Šuiskis pasirinko mūšio vietą prie Ulos upės netoli Čašnikų.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Prieš mūšį
    1564 m. pradžioje, iš Maskvos į Vilnių dar
    nespėjus parvykti pasiuntiniams su žinia,
    kad dėl paliaubų susitarti nepavyko, į
    Lietuvos Didžiąją Kunigaikštystę įsiveržė
    dvi didelės - po kelias dešimtis tūkstančių
    karių, kariuomenės. Viena jų, vadovaujama
    kunigaikščio Baziliaus Serebriano, pajudėjo
    iš Smolensko, kita, vadovaujama patyru-
    sio karvedžio kunigaikščio Petro Šuiskio,

    iš Polocko traukė į Drucką. Čia jos turėjo
    susijungti ir pulti Minsko, Naugarduko, o
    vėliau Vilniaus kryptimi.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-002
  santrauka: 'Kunigaikštis Petras Šuiskis su savo kariuomene iš Polocko pajudėjo sausio 23 d.'
  šaltinis: Karolis Zikaras (sud.), Žymiausi Lietuvos mūšiai ir karinės operacijos (2013 m.)
  citata_originali: |
    Iš Polocko su savo kariuomene kuni-
    gaikštis P. Šuiskis pajudėjo sausio 23 d.
    Apie tai Lietuvos didysis etmonas Myko-
    las Radvila Rudasis žvalgų buvo greitai
    informuotas, pats jis tuo metu buvo tik
    apie 100 km nuo Polocko, Lukomlyje.
    Nenorėdamas leisti maskvėnų pajėgoms
    susijungti, jis nurodė nedelsiant pradėti
    žygį siekiant užkirsti kelią P. Šuiskio ka-
    riuomenei. Skubėdami užkirsti artėjančiam
    priešui kelią, raiteliai nelaukdami pėsti-
    ninkų ir artilerijos pajudėjo greitu maršu.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

## Ryšiai
- Petras Šuiskis keliavo_i [[objektai/vietos/Druckas]]
- Petras Šuiskis dalyvavo_musyje [[objektai/ivykiai/Ulos (Čašnikų) mūšis (1564 m. sausio 23 d.)]]
- Petras Šuiskis kariavo_pries [[objektai/grupes/Lietuviai]]
- Petras Šuiskis surenge_zygi_i [[objektai/vietos/Lietuva]]
