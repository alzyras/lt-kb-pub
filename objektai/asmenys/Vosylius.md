---
tipas: asmuo
pavadinimas: 'Vosylius'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
datos:
  - '1425 m.'
date_start: '1425'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - kunigaikštis
amziai:
  - 'XV'
periodo_grupes:
  - 'LDK'
---
# Vosylius

## Santrauka

Bėgdamas iš totorių nelaisvės, Maskvos kunigaikščio sūnus Vosylius, apsilankęs pas Vytautą Lucke, susižadėjo su jo dukteria Sofija. Vosylius jau buvo tapęs kunigaikščiu ir norėjo vesti savo sužadėtinę, Vytauto dukterį Sofiją.

## Teiginiai

<a id="claim-t-51190"></a>
- t-001
  global_id: t-51190
  teiginys: 'Vosylius, Vytauto anūkas ir didysis Maskvos kunigaikštis, buvo pakviestas į iškilmes kartu su kitais valdovais ir didikais.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Maskva; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_object: [[objektai/zodynas/chanas|chanas]]; mentioned_place: Lietuva; mentioned_place: Odojevas; mentioned_place: Rusija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=998ccb143f9622b83c801d93ba2404f12b1441f48411fdf67edd2fadcf4738f7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: susije_su -> Maskva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vosylius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Maskva: mention_match, place, gap=36
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vosylius" parinktas kaip owner_note_path. Targetas "Maskva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-51191"></a>
- t-002
  global_id: t-51191
  teiginys: 'Vosylius, Vytauto anūkas ir didysis Maskvos kunigaikštis, buvo pakviestas į iškilmes kartu su Lietuvos vasalais.'
  sudarymo_pagrindimas: 'Citata patvirtina faktą, bet reikėjo suformuluoti pilną sakinį apie asmenį.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Lietuva; mentioned_place: Maskva; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; mentioned_object: [[objektai/zodynas/chanas|chanas]]; mentioned_place: Odojevas; mentioned_place: Rusija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 688998-689450; hash=d2695a11ccd8e6dbd05f0a2a95c3aa887ac49305df688fe49575bb198b614fea; match=ocr_normalized
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: valde -> Maskva: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vosylius: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Maskva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo, kad Vytauto globojamas Vosylius viešpatavo Maskvos kunigaikštijoje.

<a id="claim-t-51192"></a>
- t-003
  global_id: t-51192
  teiginys: 'Nuo 1425 m. Vytauto globojamas jo anūkas Vosylius valdė Didžiąją Maskvos kunigaikštiją.'
  susije_objektai: 'mentioned_place: Maskva; mentioned_place: Odojevas; mentioned_place: Pskovas; llm_object: Maskva'
  semantiniai_rysiai: '[[objektai/asmenys/Vosylius|Vosylius]] valdė Maskva'
  temporaliniai_duomenys: 'valdymo pradžia: po 1425 m.; valdymo pradžia: 1425 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma santykiui „Vosylius valdė teritoriją Maskva“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=998ccb143f9622b83c801d93ba2404f12b1441f48411fdf67edd2fadcf4738f7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: susije_su -> Lietuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vosylius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Lietuva: mention_match, place, gap=94
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vosylius" parinktas kaip owner_note_path. Targetas "Lietuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
- susijęs iš [[objektai/asmenys/Andrius Vosylius Jastrzębiecas.md#claim-t-35030|Andrius Vosylius Jastrzębiecas]]: Cereteno vyskupas Andrius Vosylius atvyko kartu su Jogailos broliais, dvasininkais ir lietuvių bei lenkų didikais.
- susijęs iš [[objektai/asmenys/Vosylius (Maskvos kunigaikštis).md#claim-t-35328|Vosylius (Maskvos kunigaikštis)]]: 1425 m. mirdamas Maskvos kunigaikštis Vosylius savo nepilnametį sūnų Vosylių paliko senelio Vytauto globai.
- susijęs iš Viazma: Maskviečiai nesėkmingai apgulė Viazmą.
- susijęs iš Viazma: Maskviečiai nesėkmingai apgulė Viazmą, o po kelių dienų buvo sudarytos paliaubos.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Vosylius, Vytauto anūkas ir didysis Maskvos kunigaikštis, buvo pakviestas į iškilmes kartu su Lietuvos vasalais.'
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    tėj, kuri turėjo dekoruoti „šviesiausius, tikruosius, garbinguo­
    sius ir laisvuosius“ Lietuvos karalius^1 ). Į iškilmes buvo pa­
    kviesti visi Lietuvos vasalai, rytų Rusijos kunigaikščiai, Vytau­
    to anūkas, d. Maskvos kunigaikštis Vosylius, Tveriaus, Riaza­
    nės, Odojevo didikai ir totorių chanas Machmetas^2 ) ir daug
    mažesnių chanų.
    Tačiau veltui Vytautas ir jo svečiai laukė pasiuntinių, at­
    gabenančių karūnas.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 688998-689450; hash=d2695a11ccd8e6dbd05f0a2a95c3aa887ac49305df688fe49575bb198b614fea; match=ocr_normalized
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: valde -> Maskva: 0.82
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vosylius: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Maskva: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata nurodo, kad Vytauto globojamas Vosylius viešpatavo Maskvos kunigaikštijoje.
    - t-001

- c-002
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Tuo pat metu jis praplėtė savo valdžią Okos
    aukštupio kunigaikštėlių tarpe. Čia jam pasidavė Liubutsko,
    Mcensko, Novosielsko, Peremišlio, Vorotinsko, Odojevo ir kit.
    kunigaikštijos^2 ). Kad ir po didelių pastangų, bet į gyvenimo galą
    jam pasisekė paimti savo įtakon ir Pskovą su išdidžiuoju Nau­
    gardu^3 ), nes Didž. Maskvos kunigaikštija, kurioje viešpatavo
    nuo 1425 metų Vytauto globojamas jo anūkas, dukters Sofijos
    sūnus Vosylius, atsparumo nerodė.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=998ccb143f9622b83c801d93ba2404f12b1441f48411fdf67edd2fadcf4738f7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: susije_su -> Maskva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vosylius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Maskva: mention_match, place, gap=36
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vosylius" parinktas kaip owner_note_path. Targetas "Maskva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=998ccb143f9622b83c801d93ba2404f12b1441f48411fdf67edd2fadcf4738f7; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/06_deduplication/01_deduplicate_entities.md
  ryšio_patikimumas: susije_su -> Lietuva: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Vosylius: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Lietuva: mention_match, place, gap=94
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Vosylius" parinktas kaip owner_note_path. Targetas "Lietuva" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

## Ryšiai
- Vosylius sudare_sutarti_su [[objektai/asmenys/Vytautas|Vytautas (Lietuvos valdovas, XIV–XV a.)]]
- Vosylius buvo_sunus [[objektai/asmenys/Vosylius (Maskvos kunigaikštis)]]
- Vosylius valde [[objektai/vietos/Maskva]]
