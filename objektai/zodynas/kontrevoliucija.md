---
tipas: zodyno_irasas
pavadinimas: 'kontrevoliucija'
saltiniai:
  - 'Vytautas Didysis 1350-1430 (1930 m.)'
datos:
  - '1350 m.'
  - '1382 m.'
  - '1430 m.'
  - '1930 m.'
  - '2026 m.'
date_start: '1350'
date_end: '2026'
sukurta: ''
atnaujinta: ''
amziai:
  - 'XIV'
  - 'XXI'
---
# kontrevoliucija

## Santrauka

Vokiečių Rygos pirkliai turėjo daug įtakos Jogailos kontrevoliucijos pasisekimui. Jogailos kontrevoliucijos sėkmei daug įtakos turėjo vokiečių Rygos pirkliai, prekiavę su Vilniumi. Vokiečių Rygos pirkliai turėjo daug įtakos Jogailos kontrevoliucijos pasisekimui.

## Teiginiai

<a id="claim-t-36795"></a>
- t-001
  global_id: t-36795
  teiginys: 'Vokiečių Rygos pirkliai turėjo daug įtakos Jogailos kontrevoliucijos pasisekimui.'
  sudarymo_pagrindimas: 'Teiginys yra aiškus faktinis sakinys ir tiesiogiai paremtas citata.'
  susije_objektai: 'llm_object: Vilnius; mentioned_group: [[objektai/grupes/Rygos pirkliai|Rygos pirkliai]]; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_person: [[objektai/asmenys/Kęstutis|Kęstutis]]; mentioned_place: Ryga; mentioned_place: Vilnius'
  pagrindžia:
    - c-002

<a id="claim-t-36796"></a>
- t-002
  global_id: t-36796
  teiginys: 'Jogailos kontrevoliucijos sėkmei daug įtakos turėjo vokiečių Rygos pirkliai, prekiavę su Vilniumi.'
  susije_objektai: 'mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Vilnius; mentioned_person: [[objektai/asmenys/Kęstutis|Kęstutis]]; mentioned_place: Ryga'
  pagrindžia:
    - c-001

## Reikšmingi paminėjimai

- c-001
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Tuo tarpu Vilniuje, dar sti­
    pri Jogailos partija ir visi Kęstučio priešai apie ją susispietę,
    pasinaudodami Vytauto iš miesto išvykimu, Jogailos vardu
    užėmė pilį. Paminėtina tai, kad Jogailos kontrevoliucijos pasi­
    sekimui daug turėjo įtakos vokiečių Rygos pirkliai, kurie tada
    varė gyvą ir didelę prekybą su Vilniaus miestu. Nepatenkinti
    lietuviškai tautiška Kęstučio politika, kuri kenkė jų prekybos
    reikalams, jie laukė tik progos padėti Jogailai atgauti valdžią,
    kurio jie anksčiau buvo stipriai palaikomi.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-002

- c-002
  šaltinis: Vytautas Didysis 1350-1430 (1930 m.)
  citata_originali: |
    Iš Jogailos pažadėtos pagalbos negavęs, jis ne tik Dimitro ne­
    nuveikė, bet dar turėjo nuostolių. Tuo tarpu Vilniuje, dar sti­
    pri Jogailos partija ir visi Kęstučio priešai apie ją susispietę,
    pasinaudodami Vytauto iš miesto išvykimu, Jogailos vardu
    užėmė pilį. Paminėtina tai, kad Jogailos kontrevoliucijos pasi­
    sekimui daug turėjo įtakos vokiečių Rygos pirkliai, kurie tada
    varė gyvą ir didelę prekybą su Vilniaus miestu.
  citata_rodoma: ''
  teiginio_tipas: faktas
  statusas: verified
  pagrindžia:
    - t-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: hash=ace4d36ce462aa49f142571b47d6077128d4b97181d8ba730cdc13fda46f49cb; match=fallback; occurrences=0
  sprendimo_priezastis: final::darbas/prompts/03_extraction/08_extract_vocabulary_notes.md
  ryšio_patikimumas: prekiavo_su -> Vilnius: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Rygos pirkliai: llm_allowed_candidate, group
  ryšio_targeto_parinkimas: Vilnius: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Rygos pirkliai prekiavo su Vilniaus miestu.
    - t-001
