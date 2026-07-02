---
tipas: vieta
pavadinimas: 'Astravos dvaras'
saltiniai:
  - 'A. Šapoka (red.), Lietuvos istorija (1936 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1392 m.'
  - '2026 m.'
date_start: '1392'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags:
  - ordinas
  - sutartis
  - vieta
amziai:
  - 'XIV'
  - 'XXI'
---
# Astravos dvaras

## Santrauka

Atsimetęs nuo ordino, Vytautas susitaikino su Jogaila Astravos dvare, paliai Lydą.

## Teiginiai

<a id="claim-t-72795"></a>
- t-001
  global_id: t-72795
  teiginys: '1392 m. rugpjūčio 5 d. Astrave Vytautas ir Ona Jogailai bei Jadvygai duotuose dokumentuose titulavosi Trakų ir Lucko kunigaikščiais.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Ona Vytautienė|Ona Vytautienė]]; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Astravas; mentioned_place: Luckas; mentioned_place: Trakai'
  temporaliniai_duomenys: 'įvykio data: 1392 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=90f1cf3349edfc9f3b0d6dc76959d0031f552a889e84d2d2a78944d357ba1280; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Astravas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Astravos dvaras: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Astravas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Astravos dvaras" parinktas kaip owner_note_path. Targetas "Astravas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-72797"></a>
- t-003
  global_id: t-72797
  teiginys: 'Vytautas, atsimetęs nuo ordino, Astravos dvare prie Lydos susitaikė su Jogaila.'
  sudarymo_pagrindimas: 'Pašalintas OCR triukšmas ir pataisyta vietos forma.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Luckas; llm_object: Luckas'
  temporaliniai_duomenys: 'įvykio data: 1392 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Pašalintas OCR triukšmas ir pataisyta vietos forma.'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d57cfb1bad28e799675ba6d8c10d1abcff8e12423f1c6be33244517800b21e94; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: valde -> Luckas: 0.76
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Luckas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata rodo, kad Luckas buvo paliktas Vytautui.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Vy­
    tauto ir jo žmonos Onos Astrave (Ostrowe) Jogailai ir Jadvygai
    duoti dokumentai (1392.VIII.5) rodo, kad jis su Ona jau titulavosi
    Trakų ir Lucko kunigaikščiais2S.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002
- c-002
  santrauka: 'Vytautas, atsimetęs nuo ordino, Astravos dvare prie Lydos susitaikė su Jogaila.'
  šaltinis: A. Šapoka (red.), Lietuvos istorija (1936 m.)
  citata_originali: |
    Astravos**
        **sutartis (1392 m.)**
    Atsimetęs nuo ordino, Vytautas susitaikino su Jogaila As-
    travos dvare, paliai Lydą. Čia buvo sudaryta sutartis, kuria Jo-
    gaila grąžino Vytautui visas jo tėvo žemes, paliko jam po pirmo-
    jo grįžimo iš ordino duotąjį Lucką ir pavedė valdyti Vilnių. Vy-
    tautas už tai pasižadėjo visada pripažinti Jogailos vyriausiąją
    valdžią ir visada jį palaikyti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003