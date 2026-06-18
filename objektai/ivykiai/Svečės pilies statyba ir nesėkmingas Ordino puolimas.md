---
tipas: ivykis
pavadinimas: 'Svečės pilies statyba ir nesėkmingas Ordino puolimas'
saltiniai:
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ivykis
  - miestas
  - ordinas
  - pilis
---
# Svečės pilies statyba ir nesėkmingas Ordino puolimas

## Santrauka

Dusburgietis teigia, kad kadangi klastinga piktybė ir piktas vylius neša džiaugsmą niekšingiems žmonėms, kai jie gali daryti blogus darbus, ir skatina dar didesnėms blogybėms, todėl ir Sventopelkas, be galo didžiuodamasis Santyro pilimi, pastatyta kenkti tikėjimui ir tikintiesiems. Dusburgietis teigia, kad jis mat norėjo neleisti statyti čia pilies.

## Laikotarpis ir datos

Nenurodyta

## Dalyviai ir vaidmenys

Nenurodyta

## Eiga

Nenurodyta

## Rezultatas

Nenurodyta

## Teiginiai

<a id="claim-t-66924"></a>
- t-001
  global_id: t-66924
  teiginys: 'Jis mat norėjo neleisti statyti čia pilies.'
  sudarymo_pagrindimas: 'claim_quality_pipeline deterministic repair'
  susije_objektai: 'mentioned_object: [[objektai/daiktai/Laivai|Laivai]]; mentioned_object: [[objektai/zodynas/magistras|magistras]]; mentioned_place: Biala; mentioned_place: Kaimas; mentioned_place: Kulmas; mentioned_place: Nogatas; mentioned_place: Semba; mentioned_place: Svečė; mentioned_place: Torunė; mentioned_place: Vysla'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5e77ec7a5e00d94f59057cc2b1f77a2a02a7a7ae817fbe0bcc670858472b7863; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: pastate -> Svečė: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Sventopelkas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Svečė: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Sventopelkas pradėjo statyti Svečės pilį.

<a id="claim-t-66925"></a>
- t-002
  global_id: t-66925
  teiginys: 'Sventopelkas pradėjo statyti Svečės pilį priešais Kulmą, kad trukdytų broliams plaukioti Vysla aukštyn ir žemyn.'
  sudarymo_pagrindimas: 'Citata palaiko pilies statybą ir tikslą, o pradinis teiginys perkrautas kronikos retorika.'
  susije_objektai: 'llm_object: Svečė; mentioned_place: Kulmas; mentioned_place: Svečė; mentioned_place: Vysla; mentioned_object: [[objektai/daiktai/Kryžius|Kryžius]]; mentioned_object: [[objektai/daiktai/Laivai|Laivai]]; mentioned_person: [[objektai/asmenys/Sventopelkas|Sventopelkas]]; mentioned_place: Santyras; mentioned_place: Torunė'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 305820-307721; hash=07f6b272d6a37b3cbabe1d4b6b712b2f8e92ff463171d394cf5d9d1c52c23ab2; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Biala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Svečės pilies statyba ir nesėkmingas Ordino puolimas: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Biala: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Svečės pilies statyba ir nesėkmingas Ordino puolimas" parinktas kaip owner_note_path. Targetas "Biala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Sventopelkas pradėjo statyti Svečės pilį priešais Kulmą, kad trukdytų broliams plaukioti Vysla aukštyn ir žemyn.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Šitai išgirdęs, 1245 legatas pats paskelbė kryžiaus karą prieš minėtąjį tironą ir
    įsakė jį skelbti apaštališkojo sosto vardu įvairiose karalystėse bei provincijose. Kadangi
    klastinga piktybė ir piktas vylius neša džiaugsmą niekšingiems žmonėms, kai jie gali
    daryti blogus darbus, ir skatina dar didesnėms blogybėms, todėl ir Sventopelkas, be galo
    didžiuodamasis Santyro pilimi, pastatyta kenkti tikėjimui ir tikintiesiems, pradėjo statyti
    prieš dabartinį Kulmo miestą naują pilį, pavadintą Sveče285 ir turėjusią trukdyti broliams
    plaukioti Vysla aukštyn ir žemyn. Kai ši žinia pasiekė magistrą, jis įsakė Kulmo broliams
    plaukti laivais žemyn, o pats su Torunės broliais bei kunigaikščiu Kazimieru nutarė
    traukti su kariuomene į šią vietą.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
    - t-002

- c-002
  santrauka: 'Jis mat norėjo neleisti statyti čia pilies.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Kai ši žinia pasiekė magistrą, jis įsakė Kulmo broliams
    plaukti laivais žemyn, o pats su Torunės broliais bei kunigaikščiu Kazimieru nutarė
    traukti su kariuomene į šią vietą. Jis mat norėjo neleisti statyti čia pilies. Sventopelkas,
    matydamas, kad brolių laivai jau artėja prie kranto, pabėgo nuleidęs aukštą pakeliamą
    tiltą, kuriuo galima patekti  į pilį. Vėliau, atsigrįžęs ir pastebėjęs, kad raitieji broliai su
    savo kariuomene, atplaukusia pasroviui iš Kulmo, negali prie jų prieiti, nes juos skyrė
    gili upė286, atgavo drąsą  ir sugrįžo su savaisiais atgal, o matydamas, jog magistras
    rengiasi pulti pilį, paskubomis atstatė tiltą ir pasiuntė 300 vyrų ginti pilies. Todėl broliai,
      283 D.— Nogadi, Jer.— Nogat. Nogatas — Vyslos deltos rytinė atšaka. Seniau Nogato
    vaga, įtekanti į Aismares, prasidėjo gerokai į pietus nuo dabartinio atsišakojimo. Vardas
    baltiškas — žr. Топоров B. H., „Baltica”..., c. 226; to paties, О балтийском элементе...,
    с. 187; plg. Górnowicz H., Toponimia..., p. 257—258, 341.
      284 D.— castrum dictum Santirium, Jer. — Zantîr. Santiro pilis buvusi dab. Biala
    Guros piliakalnyje. Vardas gretinamas su prūsiškomis pavardėmis Santar, Santor, Santir
    (ТАР, p. 89; Антоневич E., „Пруссы” в топонимике..., с. 255), plg. HP, 1, p. 426;
    Powierski J., Stosunki..., p. 45, 55, 145—146; Semboje buvo kaimas Santirmen, kur
    gyveno prūsas Santirme (GAO, p. 151); plg. lie. k. Santara (Vilkaviškio rj.).
      285 D.— Swecza, Svečė (Świecie)—kair. Vyslos krante, žemiau Kulmo, prie upės Vda
    žiočių.
      286 Jer.— Bda, tai — upė Vda.

    atvykę drauge su kunigaikščiu Kazimieru, smarkiai užpuolė pilį, ir abi šalys taip įnirtingai
    susikovė, kad ir vienoje, ir kitoje pusėje krito daug mirtinai sužeistų, o pilyje — daug
    užmuštų, tačiau pilis buvo taip sutvirtinta, kad ją buvo labai sunku užimti, o broliams,
    nieko nepešusiems, pasitraukus, Sventopelkas, grįžęs atgal, pilį dar labiau sustiprino.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 305820-307721; hash=07f6b272d6a37b3cbabe1d4b6b712b2f8e92ff463171d394cf5d9d1c52c23ab2; match=ocr_normalized_gapped
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Biala: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Svečės pilies statyba ir nesėkmingas Ordino puolimas: owner_note_path, event, gap=0
  ryšio_targeto_parinkimas: Biala: mention_match, place
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Svečės pilies statyba ir nesėkmingas Ordino puolimas" parinktas kaip owner_note_path. Targetas "Biala" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=5e77ec7a5e00d94f59057cc2b1f77a2a02a7a7ae817fbe0bcc670858472b7863; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: pastate -> Svečė: 0.93
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Sventopelkas: llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Svečė: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Sventopelkas pradėjo statyti Svečės pilį.
