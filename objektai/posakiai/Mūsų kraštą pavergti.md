---
tipas: posakis
pavadinimas: 'Mūsų kraštą pavergti (kraštas)'
saltiniai:
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
datos:
  - '1430 m.'
  - '1978 m.'
  - '2026 m.'
date_start: '1430'
date_end: '2026'
sukurta: ''
atnaujinta: ''
tags: []
amziai:
  - 'XV'
  - 'XXI'
---
# Mūsų kraštą pavergti (kraštas)

## Santrauka

Ši frazė pateikiama kaip Vytauto laiškuose išreikštas vainikavimo blokados vertinimas.

## Forma

- Pagrindinė forma: mūsų kraštą pavergti

## Teiginiai

<a id="claim-t-47949"></a>
- t-001
  global_id: t-47949
  teiginys: 'Vytauto laiškuose imperatoriui Zigmantui ir ordino magistrui draudimas vainikuotis reiškė jo laisvės varžymą ir pastangas pavergti kraštą.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas, gramatiškas ir atitinka citatos turinį.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_person: [[objektai/asmenys/Zigmantas (Romos imperatorius)|Zigmantas (Romos imperatorius)]]; mentioned_place: Lenkija; mentioned_place: Lietuva'
  pagrindžia:
    - c-001

<a id="claim-t-47950"></a>
- t-002
  global_id: t-47950
  teiginys: 'Vytautas laiškuose imperatoriui Zigmantui ir ordino magistrui teigė, kad draudimas vainikuotis reiškė pastangas „mūsų kraštą pavergti“.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus ir paremtas citata apie Vytauto laiškuose išreikštą poziciją.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_person: [[objektai/asmenys/Zigmantas (Romos imperatorius)|Zigmantas (Romos imperatorius)]]; mentioned_place: Lenkija; mentioned_place: Lietuva'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=27136b2157a5e77abd8f3b4ea405113dae44852784a71662ffb0428afa093353; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/07_extract_sayings_notes.md
  ryšio_patikimumas: susije_su -> Lenkija: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Mūsų kraštą pavergti (kraštas): owner_note_path, thing, gap=0
  ryšio_targeto_parinkimas: Lenkija: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Mūsų kraštą pavergti (kraštas)" parinktas kaip owner_note_path. Targetas "Lenkija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Bet savo politiniame veikime Vytautas nepriklausė
    tokiems, kurie nuo savo linijos nuolaidžiai trauktųsi. Tai rodo jo
    laiškai imperatoriui Zigmantui ir ordino magistrui: neleidimas
    vainikuotis Vytautui reiškė ne tik jo asmeninės laisvės suvaržymą,
    bet ir pastangas « mūsų kraštą pavergti »^15.
    Visą 1430 vasarą Vytautas šiam nepaprastam aktui ruošėsi,
    kai imperatorius jį gynė Romoje: Vytauto vainikavimasis visai
    nekenkiąs Lietuvos ir Lenkijos sąjungai.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002