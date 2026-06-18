---
tipas: grupe
pavadinimas: 'Armėnai'
saltiniai:
  - 'Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)'
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
datos:
  - '1235 m.'
date_start: '1235'
date_end: ''
sukurta: ''
atnaujinta: ''
tags:
  - grupe
  - kunigaikštis
amziai:
  - 'XIII'
---
# Armėnai

## Santrauka

LDK įsikūrė vokiečių, žydų ir armėnų. Visų pirma – tai „tarpininkaujančios mažumos“ – katalikai armėnai ir judėjai žydai.

## Teiginiai

<a id="claim-t-88520"></a>
- t-001
  global_id: t-88520
  teiginys: 'Totoriai kartu su armėnais ir gruzinais žygiavo į Siriją bei Palestiną ir nukovė daugiau nei 10 tūkstančių raitelių.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus ir tiesiogiai paremtas citata.'
  susije_objektai: 'llm_object: Sirija; mentioned_group: [[objektai/grupes/Gruzinai|Gruzinai]]; mentioned_place: Palestina; mentioned_place: Sirija; mentioned_group: [[objektai/grupes/Saracėnai|Saracėnai]]; mentioned_group: [[objektai/grupes/Totoriai|Totoriai]]; llm_object: Palestina; llm_object: [[objektai/grupes/Totoriai|Totoriai]]; llm_object: [[objektai/grupes/Gruzinai|Gruzinai]]; llm_object: [[objektai/grupes/Saracėnai|Saracėnai]]'
  semantiniai_rysiai: '[[objektai/grupes/Armėnai|Armėnai]] surengė žygį į Sirija; [[objektai/grupes/Armėnai|Armėnai]] surengė žygį į Palestina; [[objektai/grupes/Armėnai|Armėnai]] buvo sąjungininkas su [[objektai/grupes/Totoriai|Totoriai]]; [[objektai/grupes/Armėnai|Armėnai]] buvo sąjungininkas su [[objektai/grupes/Gruzinai|Gruzinai]]; [[objektai/grupes/Armėnai|Armėnai]] kariavo prieš [[objektai/grupes/Saracėnai|Saracėnai]]'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=81107d8817ede61a5d0d9c71a5075cd573431b64d26a19b79a4679f1f6618ea5; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Žydai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Armėnai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Žydai: mention_match, group, gap=8
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Armėnai" parinktas kaip owner_note_path. Targetas "Žydai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

<a id="claim-t-88521"></a>
- t-002
  global_id: t-88521
  teiginys: 'LDK įsikūrė vokiečių, žydų ir armėnų bendruomenės.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas sakinys ir tiesiogiai paremtas citata.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Žydai|Žydai]]'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 137608-137923; hash=c46a29f7fde9256b6fa4274c9376d779b1312e4a9ab13bb74de5bc3ca9639474; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Viena: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Armėnai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Viena: mention_match, place, gap=21
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Armėnai" parinktas kaip owner_note_path. Targetas "Viena" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-88522"></a>
- t-003
  global_id: t-88522
  teiginys: 'LDK katalikai armėnai buvo laikomi viena iš „tarpininkaujančių mažumų“.'
  sudarymo_pagrindimas: 'Pradinis tekstas yra fragmentiškas, o citata palaiko pilną sakinį apie armėnus.'
  susije_objektai: 'mentioned_place: Viena; mentioned_place: Lenkija'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=093fe553dad63cc56ee275a5667bbb953a682b34a07683653d251b2c09cc7b1d; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Sirija: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Armėnai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Sirija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo žygį į Siriją.
- susijęs iš [[objektai/grupes/Totoriai.md#claim-t-171441|Totoriai]]: Totoriai su armėnais ir gruzinais nužygiavo į Siriją bei Palestiną, išvijo sultoną ir nukovė daugiau nei 10 tūkstančių raitelių.
- susijęs iš [[objektai/grupes/Vokiečiai.md#claim-t-117317|Vokiečiai]]: Lietuvos Didžiojoje Kunigaikštystėje įsikūrė vokiečių, žydų ir armėnų bendruomenės.
- susijęs iš [[objektai/grupes/Vokiečiai.md#claim-t-183197|Vokiečiai]]: Valdovams kviečiant pirklius ir amatininkus iš svetur, Lietuvos Didžiojoje Kunigaikštystėje įsikūrė vokiečių, žydų ir armėnų.
- susijęs iš Lenkija: Lenkijoje žydų ir armėnų vaidmuo buvo ryškesnis nei LDK, bet joje nebuvo tokių ryškių totorių ir karaimų bendruomenių.
- susijęs iš [[objektai/grupes/Gruzinai.md#claim-t-62591|Gruzinai]]: Totoriai su armėnais ir gruzinais nužygiavo į Siriją bei Palestiną, išvijo sultoną ir nukovė daugiau nei 10 tūkstančių raitelių.
- susijęs iš [[objektai/ivykiai/Totorių, armėnų ir gruzinų žygis į Siriją bei Palestiną (1311 m.).md#claim-t-62507|Totorių, armėnų ir gruzinų žygis į Siriją bei Palestiną (1311 m.)]]: 1311 m. totoriai su armėnais ir gruzinais žygiavo į Siriją bei Palestiną, išvijo sultoną ir nukovė daugiau nei 10 tūkst. raitelių.
- susijęs iš [[objektai/grupes/Totoriai.md#claim-t-171441|Totoriai]]: Totoriai su armėnais ir gruzinais nužygiavo į Siriją bei Palestiną, išvijo sultoną ir nukovė daugiau nei 10 tūkstančių raitelių.
- susijęs iš [[objektai/grupes/Gruzinai.md#claim-t-62591|Gruzinai]]: Totoriai su armėnais ir gruzinais nužygiavo į Siriją bei Palestiną, išvijo sultoną ir nukovė daugiau nei 10 tūkstančių raitelių.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'LDK katalikai armėnai buvo laikomi viena iš „tarpininkaujančių mažumų“.'
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    LDK taip pat išsiskyrė kitomis krikščioniškomis ir nekrikščioniško-
    mis konfesijomis, kurių čia buvo jau nuo XIV a. Visų pirma – tai „tar-
    pininkaujančios mažumos“ – katalikai armėnai ir judėjai žydai. Aišku,
    šios mažumos į LDK persikėlė iš Lenkijos ir galbūt iš Vengrijos, todėl
    natūralu, kad čia jų būta mažiau.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003

- c-002
  santrauka: 'LDK įsikūrė vokiečių, žydų ir armėnų bendruomenės.'
  šaltinis: Alfonsas Eidintas, Alfredas Bumblauskas, Antanas Kulakauskas, Mindaugas Tamošaitis, Lietuvos istorija (2013 m.)
  citata_originali: |
    Nepasitikėta ir savųjų įgūdžiais,
    todėl valdovai kvietė pirklius ir amatininkus iš svetur. LDK įsikūrė vokie-
    čių, žydų ir armėnų. Beveik visos šios bendruomenės (išskyrus vokiečius)
    tapo kunigaikščių kolektyviniais vasalais, turinčiais savo konfesiją ir raštą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=093fe553dad63cc56ee275a5667bbb953a682b34a07683653d251b2c09cc7b1d; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: surenge_zygi_i -> Sirija: 0.86
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Armėnai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Sirija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo žygį į Siriją.
    - t-002

- c-003
  santrauka: 'Totoriai kartu su armėnais ir gruzinais žygiavo į Siriją bei Palestiną ir nukovė daugiau nei 10 tūkstančių raitelių.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    108. Apie tai, kaip totoriai nukovė 10 tūkstančių saracėnų raitelių

       Tais metais totoriai su armėnais bei gruzinais nužygiavo į Siriją bei Palestiną ir, išviję
    sultoną, nukovė daugiau nei 10 tūkstančių raitelių (Ptol. p. 1235).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  pagrindžia:
  irodymo_stiprumas: 0.00
  saltinio_vieta: 137608-137923; hash=c46a29f7fde9256b6fa4274c9376d779b1312e4a9ab13bb74de5bc3ca9639474; match=whitespace_regex
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Viena: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Armėnai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Viena: mention_match, place, gap=21
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Armėnai" parinktas kaip owner_note_path. Targetas "Viena" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.
    - t-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=81107d8817ede61a5d0d9c71a5075cd573431b64d26a19b79a4679f1f6618ea5; match=fallback; occurrences=0
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Žydai: 0.83
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Armėnai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Žydai: mention_match, group, gap=8
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Armėnai" parinktas kaip owner_note_path. Targetas "Žydai" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, same_sentence_locality.

## Ryšiai
- Armėnai gyveno [[objektai/vietos/Lietuva]]
- Armėnai surenge_zygi_i [[objektai/vietos/Sirija]]
- Armėnai surenge_zygi_i [[objektai/vietos/Palestina]]
- [[objektai/grupes/Totoriai]] buvo_sajungininkas_su Armėnai
- Armėnai buvo_sajungininkas_su [[objektai/grupes/Totoriai]]
- Armėnai buvo_sajungininkas_su [[objektai/grupes/Gruzinai]]
- [[objektai/grupes/Gruzinai]] buvo_sajungininkas_su Armėnai
- Armėnai kariavo_pries [[objektai/grupes/Saracėnai]]
