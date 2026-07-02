---
tipas: grupe
pavadinimas: 'Bremeno pirkliai'
saltiniai:
  - 'Michał Baliński, Vilniaus miesto istorija (2007 m.)'
datos:
  - '1158 m.'
  - '1192 m.'
date_start: '1158'
date_end: '1192'
sukurta: ''
atnaujinta: ''
amziai:
  - 'XII'
---
# Bremeno pirkliai

## Santrauka

Bremeno pirkliai siejami su vokiečių prekybos ryšių prie Dauguvos žiočių pradžia ir Rygos įkūrimo pasakojimu.

## Pavadinimai šaltiniuose

- Bremeno pirkliai
- kolonija iš Bremeno

## Kas tai

Bremeno kilmės pirklių ir kolonistų grupė Baltijos prekybos kontekste.

## Teiginiai

<a id="claim-t-55060"></a>
- t-001
  global_id: t-55060
  teiginys: 'Bremeno pirkliai 1158 m. atrado Dauguvos žiotis ir užmezgė vokiečių prekybinius ryšius su tenykščiu pamariu.'
  sudarymo_pagrindimas: 'Teiginys pilnas, gramatiškas ir tiesiogiai paremtas citata.'
  susije_objektai: 'llm_object: Pamaris; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Bremenas; mentioned_place: Dauguva; mentioned_place: Pamaris; mentioned_place: Baltija; mentioned_place: Dvina'
  semantiniai_rysiai: '[[objektai/grupes/Bremeno pirkliai|Bremeno pirkliai]] prekiavo su Pamaris'
  temporaliniai_duomenys: 'įvykio data: 1158 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys pilnas, gramatiškas ir tiesiogiai paremtas citata.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 34660-35059; hash=18094be263f39d9e6643d51d9c2c52082a339e6c5ae0535da59aea7abd23ed5e; match=whitespace_regex
  sprendimo_priezastis: gap::groups
  ryšio_patikimumas: prekiavo_su -> Pamaris: 0.91
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bremeno pirkliai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Pamaris: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai mini prekybinių ryšių užmezgimą su pamariu.

<a id="claim-t-55061"></a>
- t-002
  global_id: t-55061
  teiginys: 'Apie 1192 m. kolonija iš Bremeno, regis, įkūrė Rygą.'
  sudarymo_pagrindimas: 'Teiginys yra išbaigtas ir tiksliai perteikia citatos atsargią formuluotę.'
  susije_objektai: 'mentioned_place: Bremenas; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Baltija; mentioned_place: Dvina'
  temporaliniai_duomenys: 'įkūrimo data: 1158 m.; įkūrimo data: 1192 m.; įkūrimo data: apie 1192 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įkūrimo data“, o ne visam objekto laikotarpiui. Ši data interpretuojama kaip įkūrimo data su riba „circa“, o ne kaip tiksli pilna data.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra išbaigtas ir tiksliai perteikia citatos atsargią formuluotę.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 34660-35059; hash=18094be263f39d9e6643d51d9c2c52082a339e6c5ae0535da59aea7abd23ed5e; match=whitespace_regex
  sprendimo_priezastis: gap::groups
  ryšio_patikimumas: susije_su -> Bremenas: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Bremeno pirkliai: owner_note_path, group, gap=0
  ryšio_targeto_parinkimas: Bremenas: mention_match, place, gap=0
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Bremeno pirkliai" parinktas kaip owner_note_path. Targetas "Bremenas" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-80802"></a>
- t-003
  global_id: t-80802
  teiginys: 'Bremeno pirkliai 1158 metais atrado Dauguvos žiotis ir užmezgė vokiečių prekybinius ryšius su tenykščiu pamariu.'
  sudarymo_pagrindimas: 'Teiginys yra pilnas ir paremtas ta pačia citatos informacija.'
  susije_objektai: 'llm_object: Pamaris; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Bremenas; mentioned_place: Dauguva; mentioned_place: Pamaris; mentioned_place: Baltija; mentioned_place: Dvina'
  semantiniai_rysiai: '[[objektai/grupes/Bremeno pirkliai|Bremeno pirkliai]] prekiavo su Pamaris'
  temporaliniai_duomenys: 'įvykio data: 1158 m.'
  temporalinis_paaiskinimas: 'Ši data taikoma teiginyje minimai reikšmei „įvykio data“, o ne visam objekto laikotarpiui.'
  temporalinis_llm_pakomentavimas: 'Teiginys yra pilnas ir paremtas ta pačia citatos informacija.'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 34660-35059; hash=18094be263f39d9e6643d51d9c2c52082a339e6c5ae0535da59aea7abd23ed5e; match=whitespace_regex
  sprendimo_priezastis: gap::groups
  ryšio_patikimumas: prekiavo_su -> Pamaris: 0.91
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Bremeno pirkliai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Pamaris: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai mini prekybinių ryšių užmezgimą su pamariu.
- susijęs iš [[objektai/asmenys/Gediminas.md#claim-t-176326|Gediminas (Lietuvos didysis kunigaikštis, XIV a.)]]: Gediminas, pasak citatos, buvo nužudytas 1337 m. prie Bajerburgo pilies mūšyje su kryžiuočiais.
- susijęs iš [[objektai/asmenys/Gediminas.md#claim-t-176343|Gediminas (Lietuvos didysis kunigaikštis, XIV a.)]]: Gedimino rūpesčiu Vilnius iš mažareikšmės gyvenvietės iškilo į galingos valstybės sostinę.
- susijęs iš [[objektai/ivykiai/Gedimino Bajerburgo apgultis ir žūtis (1337 m. birželio 15 d.).md#claim-t-86973|Gedimino Bajerburgo apgultis ir žūtis (1337 m. birželio 15 d.)]]: Gediminas 1337 m. žuvo mūšyje su kryžiuočiais prie Bajerburgo pilies, per mylią nuo Veliuonos.
- susijęs iš [[objektai/ivykiai/Gedimino žūtis Bajerburgo mūšyje (1337 m.).md#claim-t-86976|Gedimino žūtis Bajerburgo mūšyje (1337 m.)]]: Gediminas 1337 m. buvo nužudytas mūšyje su kryžiuočiais prie Bajerburgo pilies, netoli Veliuonos.
- susijęs iš [[objektai/paprociai/Kolonistų vadovavimasis Rygos miesto civiline teise.md#claim-t-87244|Kolonistų vadovavimasis Rygos miesto civiline teise]]: Gediminas laiške pranešė, kad į Vilnių atvykę kolonistai galės vadovautis Rygos miesto civiline teise, kol bus sukurti geresni įstatymai.
- susijęs iš [[objektai/posakiai/Jure civili utantur Rigensis Civitatis.md#claim-t-55176|Jure civili utantur Rigensis Civitatis]]: Gedimino laiške į Vilnių atvykstantiems kolonistams žadėta vadovautis Rygos miesto civiline teise.
- susijęs iš [[objektai/posakiai/Jure civili utantur Rigensis Civitatis.md#claim-t-55177|Jure civili utantur Rigensis Civitatis]]: „Jure civili utantur Rigensis Civitatis“ Gedimino laiške leido Vilniaus kolonistams naudotis Rygos civiline teise, kol bus sukurti geresni įstatymai.
- susijęs iš [[objektai/posakiai/Jure civili utantur Rigensis Civitatis.md#claim-t-82139|Jure civili utantur Rigensis Civitatis]]: „Jure civili utantur Rigensis Civitatis“ nurodė, kad į Vilnių atvykę kolonistai galės vadovautis Rygos miesto civiline teise.
- susijęs iš Gedimino laiškas Liubeko, Rostoko, Zundo, Greifsvaldo, Štetino miestams ir Gotlando gyventojams: Gedimino laiške šiaurės Vokietijos miestams ir Gotlando gyventojams nurodyta, kad į Vilnių atvykę kolonistai galės naudotis Rygos civiline teise.
- susijęs iš Ašmena: Jaunutis paveldėjo ne tik Lietuvos didžiojo kunigaikščio sostą, bet ir Ašmeną, Ukmergę bei Breslaują.
- susijęs iš Bajerburgas Bajerburgo pilis (sujungti pirminiai pavadinimai Bajerburgo pilis; Bajerburgas Raudonė): Gediminas žuvo 1337 metais mūšyje su kryžiuočiais prie Bajerburgo pilies, buvusios per mylią nuo Veliuonos.
- susijęs iš Bajerburgo pilis: Gediminas žuvo 1337 metais mūšyje su kryžiuočiais prie Bajerburgo pilies, buvusios per mylią nuo Veliuonos.
- susijęs iš Baltijos jūra (sujungti pirminiai pavadinimai Baltijos jūra; Baltijos krantai): XII amžiuje buvo geriau susipažinta su tolimesnėmis Baltijos jūros pakrantėmis.
- susijęs iš Breslauja: Po Gedimino žūties 1337 m. Jaunutis paveldėjo Breslaują kartu su kitomis valdomis.
- susijęs iš Daugava Dvina (sujungti pirminiai pavadinimai Daugava; Dvina): Bremeno pirkliai 1158 m. atrado vakarinės Dvinos, arba Dauguvos, žiotis ir užmezgė prekybinius ryšius su tenykščiu pamariu.
- susijęs iš Liubekas: Gediminas laiške Liubekui ir kitiems miestams pranešė, kad į Vilnių atvykę kolonistai galės naudotis Rygos miesto teise.
- susijęs iš Liubekas: Gedimino laiške Liubeko ir kitų miestų gyventojams skelbta, kad į Vilnių atvykę kolonistai galės naudotis Rygos miesto civiline teise.
- susijęs iš Talinas: Balińskis Revelio, dabartinio Talino, atsiradimą siejo su danais.
- susijęs iš Ukmergė: Jaunutis paveldėjo ne tik Lietuvos didžiojo kunigaikščio sostą, bet ir Ašmeną, Ukmergę bei Breslaują.
- susijęs iš Veliuona: Gediminas žuvo 1337 m. mūšyje su kryžiuočiais prie Bajerburgo pilies, per mylią nuo Veliuonos.
- susijęs iš Veliuona: Gediminas, pasak citatos, buvo nužudytas 1337 m. prie Bajerburgo pilies, per mylią nuo Veliuonos.
- susijęs iš Vilnius: Gedimino rūpesčiu Vilnius iškilo iš mažareikšmės gyvenvietės į galingos valstybės sostinę.
- susijęs iš Vilnius: Gedimino rūpesčiu iškilusiame Vilniuje buvo prigiję feodalinio valdymo principai.
- susijęs iš [[objektai/zodynas/Feodalinis ir leninis valdymas.md#claim-t-86458|Feodalinis ir leninis valdymas]]: Gedimino iškeltame Vilniuje, kaip ir visame krašte, buvo prigiję feodalinio valdymo principai.
- susijęs iš [[objektai/zodynas/Rygos miesto civilinė teisė vokiečių teisės.md#claim-t-86570|Rygos miesto civilinė teisė vokiečių teisės]]: Gedimino laiške nurodyta, kad į Vilnių atvykę kolonistai galės vadovautis Rygos miesto civiline teise.
## Reikšmingi paminėjimai

- c-001
  šaltinis: Michał Baliński, Vilniaus miesto istorija (2007 m.)
  citata_originali: |
    Tokios gynybos sistemos globoje atsivėrė ke­
    liai naudotis gausių manufaktūrų, paplitusių Flandrijoje ir
    Anglijoje, darbo vaisiais. XII amžiuje geriau susipažinta su toli­
    mesnėmis Baltijos jūros pakrantėmis. Bremeno pirkliai 1158 m.
    atrado vakarinės Dvinos [Dauguvos] žiotis ir užmezgė preky­
    binius vokiečių ryšius su tenykščiu pamariu; o apie 1192 metus,
    regis, kolonija iš Bremeno įkūrė Rygą.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
    - t-002
    - t-003

## Ryšiai
- Bremeno pirkliai prekiavo_su [[objektai/vietos/Pamaris]]
