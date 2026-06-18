---
tipas: vieta
pavadinimas: 'Opočka'
saltiniai:
  - 'Lietuvos metraštis, Bychovco kronika (1971 m.)'
datos:
  - '1426 m.'
date_start: '1426'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - vieta
amziai:
  - 'XV'
---
# Opočka

## Santrauka

1426 m. rugpjūčio 1 d. Vytautas puolė Opočką. Opočka šiame gabale minima tarp Pskovo miestų.

## Teiginiai

<a id="claim-t-187279"></a>
- t-001
  global_id: t-187279
  teiginys: 'Opočka citatoje minima kaip vienas iš Pskovo miestų, kuriuos 1426 m. rugpjūtį puolė Vytautas.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Perrašyta į aiškų faktinį sakinį apie Opočką.'
  susije_objektai: 'llm_object: Opočka; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Pskovas; llm_object: Pskovas'
  semantiniai_rysiai: '[[objektai/asmenys/Vytautas|Vytautas]] puolė Opočka'
  temporaliniai_duomenys: 'įvykio data: 1426 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Perrašyta į aiškų faktinį sakinį apie Opočką.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d00f1a291ccc83c12ca4ccc6536dbad212cdd5dbb98c744a16bf3920a015321f; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Opočka: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Opočka: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Vytautas puolė Opočką.

<a id="claim-t-187280"></a>
- t-002
  global_id: t-187280
  teiginys: 'Krasnogorodskoje lokalizuojama 30 km į šiaurės vakarus nuo Opočkos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Neapibrėžtas „regioninio orientyro“ teiginys pakeistas konkrečia citatos informacija.'
  susije_objektai: 'mentioned_place: Krasnogorodskoje; mentioned_place: Krasnyj Gorod'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d00f1a291ccc83c12ca4ccc6536dbad212cdd5dbb98c744a16bf3920a015321f; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Opočka: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Opočka: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Vytautas puolė Opočką.

<a id="claim-t-187281"></a>
- t-003
  global_id: t-187281
  teiginys: '1426 m. rugpjūčio 1 d. Vytautas puolė Pskovo miestą Opočką, bet jo nepaėmė.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Įtrauktas citatoje nurodytas rezultatas ir miesto priklausymas Pskovo miestams.'
  susije_objektai: 'llm_object: Opočka; mentioned_person: [[objektai/asmenys/Vytautas|Vytautas]]; mentioned_place: Pskovas; llm_object: Pskovas'
  semantiniai_rysiai: '[[objektai/asmenys/Vytautas|Vytautas]] puolė Opočka'
  temporaliniai_duomenys: 'įvykio data: 1426 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Įtrauktas citatoje nurodytas rezultatas ir miesto priklausymas Pskovo miestams.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c05789dade620edfe6ca507976e83a3724d8c83a0f02854cd0d99208609bff8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Krasnogorodskoje: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Opočka: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krasnogorodskoje: mention_match, place, gap=53
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Opočka" parinktas kaip owner_note_path. Targetas "Krasnogorodskoje" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-187282"></a>
- t-004
  global_id: t-187282
  teiginys: 'Krasnogorodskoje lokalizuojama į šiaurės vakarus nuo Opočkos.'
  teiginio_tipas: 'faktas'
  sudarymo_pagrindimas: 'Sakinys aiškus, gramatiškas ir paremtas citatos lokalizacija.'
  susije_objektai: 'mentioned_place: Krasnogorodskoje; mentioned_place: Krasnyj Gorod'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c05789dade620edfe6ca507976e83a3724d8c83a0f02854cd0d99208609bff8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Krasnogorodskoje: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Opočka: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krasnogorodskoje: mention_match, place, gap=59
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Opočka" parinktas kaip owner_note_path. Targetas "Krasnogorodskoje" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
- susijęs iš Voronačas: 1426 m. rugpjūtį Vytautas puolė Pskovo miestus Opočką ir Voronačą, bet jų paimti negalėjo.
- susijęs iš Krasnogorodskoje: Krasnogorodskoje lokalizuojamas 30 km į šiaurės vakarus nuo Opočkos.
- susijęs iš Krasnyj Gorod: Krasnyj Gorod tapatinamas su Krasnogorodskoje, esančiu 30 km į šiaurės vakarus nuo Opočkos.
- susijęs iš Krasnogorodskoje: Krasnyj gorod komentare tapatinamas su Krasnogorodskoje.
- susijęs iš Krasnyj Gorod: Komentare Krasnyj gorod tapatinamas su Krasnogorodskoje.
- susijęs iš Voronačas: 1426 m. rugpjūtį Vytautas puolė Pskovo miestus Opočką ir Voronačą, bet jų paimti negalėjo.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    1426 m. rugpiūčio mėn. Vytautas
    puolė Pskovo miestus Opočkų (V1II.1) Ir Voronačų (VIII.5Į, bet jų
    negalėjo paimti.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c05789dade620edfe6ca507976e83a3724d8c83a0f02854cd0d99208609bff8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Krasnogorodskoje: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Opočka: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krasnogorodskoje: mention_match, place, gap=53
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Opočka" parinktas kaip owner_note_path. Targetas "Krasnogorodskoje" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001

- c-002
  šaltinis: Lietuvos metraštis, Bychovco kronika (1971 m.)
  citata_originali: |
    7 Krasnyj gorod — tai Krasnogorodskoje, 30 km į šiaurės va­
    karus nuo Opočkos (RTFR. Veiikije Lukų sr.).
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d00f1a291ccc83c12ca4ccc6536dbad212cdd5dbb98c744a16bf3920a015321f; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Opočka: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Opočka: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Vytautas puolė Opočką.
    - t-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=0c05789dade620edfe6ca507976e83a3724d8c83a0f02854cd0d99208609bff8; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: susije_su -> Krasnogorodskoje: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Opočka: owner_note_path, place, gap=0
  ryšio_targeto_parinkimas: Krasnogorodskoje: mention_match, place, gap=59
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Opočka" parinktas kaip owner_note_path. Targetas "Krasnogorodskoje" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=d00f1a291ccc83c12ca4ccc6536dbad212cdd5dbb98c744a16bf3920a015321f; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/09_extract_places_notes.md
  ryšio_patikimumas: puole -> Opočka: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Vytautas (Lietuvos valdovas, XIV–XV a.): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Opočka: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Vytautas puolė Opočką.

## Ryšiai
- [[objektai/asmenys/Vytautas|Vytautas (Lietuvos valdovas, XIV–XV a.)]] puole Opočka
- Opočka priklause [[objektai/vietos/Pskovas]]
