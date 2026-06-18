---
tipas: asmuo
pavadinimas: 'Gedūnas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - asmuo
  - karalius
  - karas
  - pilis
---
# Gedūnas

## Santrauka

Dusburgietis teigia, kad susitaikius Čekijos karalius nuvedė savo kariuomenę iki Baigos pilies, kur broliai pasistengė surasti vieną seną vyrą, vardu Gedūnas, Visigaudo iš Medenavos321 tėvą, kilusį iš tos jų šakos, kuri vadinama Kandeimu, gerai žinojusį visą Sembos karių galią. Dusburgietis teigia, kad gedūnas atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“. Dusburgietis teigia, kad gedūnas vis dėlto per daug delsė, nežinodamas, kokie staigūs karo žygyje būna teutonai, todėl, sugrįžęs pas savuosius, rado savo bei saviškių kiemus sudegintus, o visą savo ir saviškių šeimyną, be to, savo brolį, vardu Ringėlas, ir visus savo gimines išžudytus.

## Teiginiai

<a id="claim-t-60016"></a>
- t-001
  global_id: t-60016
  teiginys: 'Gedūnas buvo senas vyras iš Kandeimu vadinamos šakos, Visigaudo iš Medenavos tėvas, gerai žinojęs Sembos karių galią.'
  sudarymo_pagrindimas: 'Pašalinta perteklinė konteksto įžanga, palikta informacija apie asmenį.'
  susije_objektai: 'mentioned_place: Medenava; mentioned_place: Semba; mentioned_object: [[objektai/daiktai/Ginklai|Ginklai]]; mentioned_object: [[objektai/daiktai/Malūnas|Malūnas]]; mentioned_object: [[objektai/zodynas/kunigaikščiai|kunigaikščiai]]; mentioned_place: Baiga; mentioned_place: Viena; mentioned_place: Čekija'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=af6ddca93ca80cf949c90e3d91580943a3e0547625fe188fc923aeda454a9671; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Medenava: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Gedūnas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Medenava: mention_match, place, gap=67
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Gedūnas" parinktas kaip owner_note_path. Targetas "Medenava" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-60017"></a>
- t-002
  global_id: t-60017
  teiginys: 'Gedūnas grįžęs rado savo ir saviškių kiemus sudegintus, o šeimyną, brolį Ringėlą ir gimines išžudytus.'
  sudarymo_pagrindimas: 'Pašalinta boilerplate ir įvardžiai pakeisti aiškiu asmens vardu.'
  susije_objektai: 'llm_object: [[objektai/asmenys/Ringėlas|Ringėlas]]; mentioned_person: [[objektai/asmenys/Ringėlas|Ringėlas]]; mentioned_place: Semba'
  semantiniai_rysiai: '[[objektai/asmenys/Gedūnas|Gedūnas]] buvo brolis [[objektai/asmenys/Ringėlas|Ringėlas]]'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 345119-345853; hash=7fc38c013444dbd94ca990eaca5120d23e5b6f265518c23bab277d283699a722; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Semba: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Gedūnas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Semba: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Gedūnas" parinktas kaip owner_note_path. Targetas "Semba" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-60018"></a>
- t-003
  global_id: t-60018
  teiginys: 'Gedūnas atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_place: Semba'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 345672-346325; hash=4fda609748dd71beb6fcc9e1bd7e6f31c523ba2a6b57accffe605a13abe241cd; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_brolis -> Ringėlas: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Gedūnas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Ringėlas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Tekstas tiesiogiai įvardija Ringėlą kaip Gedūno brolį.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Gedūnas atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Kai karalius jį paklausė, rodydamas
    tik mažą savo kariuomenės dalelę, ar su šitiek karių galįs ką nuveikti, tas atsakė, kad
    nieku būdu. Tada sutraukė dvigubai tiek kariuomenės, o jis, ją matydamas, atsakė
    tais pačiais žodžiais; trečią kartą atžygiavo trigubai daugiau kariuomenės, o jam dar
    nepakako, galop atėjo visa likusi kariuomenė, taip tirštai padengdama ledą, kaip skėriai
    padengia žemę; kai karalius paklausė, ar šitiek kariuomenės pakanka, kad galėtum šį
    tą nuveikti Sembos žemėje, jis atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“.
    Paskui karalius įteikė jam savo vėliavas, kad jas iškabintų prie savo bei savo tėvų žemių
    ir kiemų322, nes nesirasią tokio, kas, pastebėjęs karaliaus vėliavą, išdrįstų jį skriausti.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-003

- c-002
  santrauka: 'Gedūnas buvo senas vyras iš Kandeimu vadinamos šakos, Visigaudo iš Medenavos tėvas, gerai žinojęs Sembos karių galią.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Žiemą ši kariuomenė atžygiavo  į Elbingą,
    tačiau velnias, žmonių giminės priešas, sumanė išardyti šį žygį vardan tikėjimo, dievo
    apvaizdos teikiamo žmonių išganymui, jis mat sukurstė viename malūne susiginčyti
    du vyrus, vieną — iš Saksonijos, o kitą — iš Austrijos, katras pirmas turįs malti,  ir
    štai ne tik kariai bei paprasti žmonės, bet  ir karalius,  ir kiti kunigaikščiai jau buvo
    bepakelią ginklus kovai, tačiau Olomouco vyskupas, dievotas ir taikus vyras, pasirūpino,
    kad nebūtų dingsties ginčui, ir atstatė pirmykštę sandorą. Susitaikius Čekijos karalius
    nuvedė savo kariuomenę iki Baigos pilies, kur broliai pasistengė surasti vieną seną vyrą,
    vardu Gedūnas, Visigaudo iš Medenavos321 tėvą, kilusį iš tos jų šakos, kuri vadinama
    Kandeimu, gerai žinojusį visą Sembos karių galią. Kai karalius jį paklausė, rodydamas
    tik mažą savo kariuomenės dalelę, ar su šitiek karių galįs ką nuveikti, tas atsakė, kad
    nieku būdu.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 345672-346325; hash=4fda609748dd71beb6fcc9e1bd7e6f31c523ba2a6b57accffe605a13abe241cd; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: buvo_brolis -> Ringėlas: 0.97
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Gedūnas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Ringėlas: llm_allowed_candidate, person
  ryšio_paaiskinimas: Tekstas tiesiogiai įvardija Ringėlą kaip Gedūno brolį.
    - t-001

- c-003
  santrauka: 'Gedūnas grįžęs rado savo ir saviškių kiemus sudegintus, o šeimyną, brolį Ringėlą ir gimines išžudytus.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Paskui karalius įteikė jam savo vėliavas, kad jas iškabintų prie savo bei savo tėvų žemių
    ir kiemų322, nes nesirasią tokio, kas, pastebėjęs karaliaus vėliavą, išdrįstų jį skriausti.
    Jis vis dėlto per daug delsė, nežinodamas, kokie staigūs karo žygyje būna teutonai,
    todėl, sugrįžęs pas savuosius, rado savo bei saviškių kiemus sudegintus, o visą savo
    ir saviškių šeimyną, be to, savo brolį, vardu Ringėlas, ir visus savo gimines išžudytus.
    Tada karalius įsibrovė  į Sembą su savo kariuomene netoli valsčiaus, kuris vadinamas
    Medenava,  ir, išdeginęs visa, ką ugnis įstengė sunaikinti, daugybę žmonių paėmęs  į
    nelaisvę ir išžudęs, ten pat ir pernakvojo.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=af6ddca93ca80cf949c90e3d91580943a3e0547625fe188fc923aeda454a9671; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Medenava: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Gedūnas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Medenava: mention_match, place, gap=67
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Gedūnas" parinktas kaip owner_note_path. Targetas "Medenava" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-002

- c-004
  santrauka: 'Gedūnas atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Tada sutraukė dvigubai tiek kariuomenės, o jis, ją matydamas, atsakė
    tais pačiais žodžiais; trečią kartą atžygiavo trigubai daugiau kariuomenės, o jam dar
    nepakako, galop atėjo visa likusi kariuomenė, taip tirštai padengdama ledą, kaip skėriai
    padengia žemę; kai karalius paklausė, ar šitiek kariuomenės pakanka, kad galėtum šį
    tą nuveikti Sembos žemėje, jis atsakė: „Pakanka, eik kur tinkamas ir pasieksi, ko nori“.
    Paskui karalius įteikė jam savo vėliavas, kad jas iškabintų prie savo bei savo tėvų žemių
    ir kiemų322, nes nesirasią tokio, kas, pastebėjęs karaliaus vėliavą, išdrįstų jį skriausti.
    Jis vis dėlto per daug delsė, nežinodamas, kokie staigūs karo žygyje būna teutonai,
    todėl, sugrįžęs pas savuosius, rado savo bei saviškių kiemus sudegintus, o visą savo
    ir saviškių šeimyną, be to, savo brolį, vardu Ringėlas, ir visus savo gimines išžudytus.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 345119-345853; hash=7fc38c013444dbd94ca990eaca5120d23e5b6f265518c23bab277d283699a722; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Semba: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Gedūnas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Semba: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Gedūnas" parinktas kaip owner_note_path. Targetas "Semba" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-004
  irodymo_stiprumas: 0.00
  saltinio_vieta: 345255-346111; hash=2bc16829a1587fb3f1a3c99cf138ee41ff6e72a166ce1e4a1d2516f548bebd4f; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Semba: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Gedūnas: owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Semba: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Gedūnas" parinktas kaip owner_note_path. Targetas "Semba" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Ryšiai
- Gedūnas buvo_brolis [[objektai/asmenys/Ringėlas]]
