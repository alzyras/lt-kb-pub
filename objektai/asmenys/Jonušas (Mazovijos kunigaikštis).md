---
tipas: asmuo
pavadinimas: 'Jonušas (Mazovijos kunigaikštis)'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
sukurta: ''
atnaujinta: ''
---
# Jonušas (Mazovijos kunigaikštis)

## Santrauka

Jonušas atsisakė suteikti pagalbą, sulaužė sutartį ir, įsiveržęs į Poleksiją, užėmė Drohičiną, Melniką, Suražą bei Kamenecą. Jonušas ir Zemovitas priėmė į Mazoviją pasitraukusį Vytautą, bet nesistengė suteikti jam deramos pagalbos. Mazovijos kunigaikštis Jonušas, siekdamas sosto, atvyko į Piotrkovą su tūkstantine raitelių palyda.

## Teiginiai

<a id="claim-t-185986"></a>
- t-001
  global_id: t-185986
  teiginys: 'Jonušas atsisakė suteikti pagalbą, sulaužė sutartį ir, įsiveržęs į Poleksiją, užėmė Drohičiną, Melniką, Suražą bei Kamenecą.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata palaiko faktą, bet pradinį tekstą reikia išvalyti ir sutrumpinti.'
  susije_objektai: 'llm_object: Poleksija; llm_object: Kamenecas; llm_object: Suražas; mentioned_place: Kamenecas; mentioned_place: Poleksija; mentioned_place: Suražas; mentioned_place: Livonija; mentioned_place: Vilnius'
  semantiniai_rysiai: '[[objektai/asmenys/Jonušas (Mazovijos kunigaikštis)|Jonušas (Mazovijos kunigaikštis)]] puolė Poleksija; [[objektai/asmenys/Jonušas (Mazovijos kunigaikštis)|Jonušas (Mazovijos kunigaikštis)]] užėmė Suražas; [[objektai/asmenys/Jonušas (Mazovijos kunigaikštis)|Jonušas (Mazovijos kunigaikštis)]] užėmė Kamenecas'
  pagrindžia:
    - c-001
  irodymo_stiprumas: 0.00
  saltinio_vieta: 470005-470434; hash=5f4b19354b367a3b29a6690de6d259c28a8a9eda0b15d10c9f0f11de745f6b1e; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: puole -> Poleksija: 0.96
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Jonušas (Mazovijos kunigaikštis): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Poleksija: llm_allowed_candidate, place
  ryšio_paaiskinimas: Tekstas tiesiogiai sako, kad Jonušas užpuolė Poleksiją.

<a id="claim-t-185987"></a>
- t-002
  global_id: t-185987
  teiginys: 'Jonušas ir Zemovitas priėmė į Mazoviją pasitraukusį Vytautą, bet nesistengė suteikti jam deramos pagalbos.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Pradinis teiginys daugiausia apie Vytautą ir turi OCR triukšmo; citata palaiko aiškų faktą apie Jonušą.'
  susije_objektai: 'mentioned_person: [[objektai/asmenys/Zemovitas|Zemovitas]]; mentioned_place: Mazovija; mentioned_group: [[objektai/grupes/Vokiečiai|Vokiečiai]]; mentioned_place: Kamenecas; mentioned_place: Lenkija; mentioned_place: Palenkė'
  pagrindžia:
    - c-002
  irodymo_stiprumas: 0.00
  saltinio_vieta: 524291-525174; hash=e3a393d9dda295d45dfc4cc4f8a01e83aba3f74e90cd8101bd85df22cc03c179; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: susije_su -> Mazovija: 0.85
  ryšio_patikimumo_lygis: vidutinis
  ryšio_patikimumo_priezastys: owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality
  ryšio_sprendimo_taisykle: rule_plain_mention
  ryšio_subjekto_parinkimas: Jonušas (Mazovijos kunigaikštis): owner_note_path, person, gap=0
  ryšio_targeto_parinkimas: Mazovija: mention_match, place, gap=30
  ryšio_paaiskinimas: Ryšys sukurtas taisykle "rule_plain_mention". Subjektas "Jonušas (Mazovijos kunigaikštis)" parinktas kaip owner_note_path. Targetas "Mazovija" parinktas kaip mention_match aplink predikatą "mention". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality.

<a id="claim-t-185988"></a>
- t-003
  global_id: t-185988
  teiginys: 'Mazovijos kunigaikštis Jonušas, siekdamas sosto, atvyko į Piotrkovą su tūkstantine raitelių palyda.'
  teiginio_tipas: 'faktas'
  patikimumo_lygis: 'vidutinis'
  patikimumo_saltinis: 'ai'
  sudarymo_pagrindimas: 'Citata palaiko aiškesnį, enciklopedinį teiginį apie Jonušo veiksmą.'
  susije_objektai: 'llm_object: Piotrkovas; mentioned_place: Piotrkovas; mentioned_group: [[objektai/grupes/Jogailaičiai|Jogailaičiai]]; mentioned_place: Mazovija'
  semantiniai_rysiai: '[[objektai/asmenys/Jonušas (Mazovijos kunigaikštis)|Jonušas (Mazovijos kunigaikštis)]] keliavo į Piotrkovas'
  pagrindžia:
    - c-003
  irodymo_stiprumas: 0.00
  saltinio_vieta: 957938-958350; hash=c398a3c0e424f81238fcb22d8560fa9c0fea964036ab721817e159fcc9a557d2; match=exact
  sprendimo_priezastis: auto
  ryšio_patikimumas: keliavo_i -> Piotrkovas: 0.94
  ryšio_patikimumo_lygis: aukstas
  ryšio_patikimumo_priezastys: llm_structured_decision; deterministic_validation_passed
  ryšio_sprendimo_taisykle: llm_validated_relation
  ryšio_subjekto_parinkimas: Jonušas (Mazovijos kunigaikštis): llm_allowed_candidate, person
  ryšio_targeto_parinkimas: Piotrkovas: llm_allowed_candidate, place
  ryšio_paaiskinimas: Citata tiesiogiai nurodo, kad Jonušas vyko į Piotrkovą.

## Reikšmingi paminėjimai

- c-001
  santrauka: 'Jonušas atsisakė suteikti pagalbą, sulaužė sutartį ir, įsiveržęs į Poleksiją, užėmė Drohičiną, Melniką, Suražą bei Kamenecą.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Po kelių dienų apgulos, sutikęs smarkų pasi­
    priešinimą, griebėsi kito sumanymo. Mat tuo metu
    paaiškėjo, kad Jonušas nesuteiks pagalbos; anaiptol,
    nutaręs, jog dabar tinkama proga nebaudžiamam su­
    laužyti sutartį, jis užpuolė Poleksiją ir, staiga įsiver­
    žęs, užėmė Drohičiną, Melniką, Suražą bei Kamenecą.
    2 7 0

    ## Puslapis 269

    Be to, Jogaila, sulaukęs paramos iš Livonijos ir Prūsi­
    jos, jau traukė su kariuomene iš Vilniaus.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001
- c-002
  santrauka: 'Jonušas ir Zemovitas priėmė į Mazoviją pasitraukusį Vytautą, bet nesistengė suteikti jam deramos pagalbos.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Nieko nepešęs
    klasta, metė savo sumanymus ir, aplinkybių verčiamas,
    ėmė rengtis atvirai kovai, būdamas tikras, jog ir Kazi­
    mieras netruks prieš jį griebtis ginklo, ir karalius Jo­
    gaila skubiai iš Lenkijos atsiųs pagalbos. Smarkiai su­
    stiprinęs Palenkę ir Polesę, įkurdinęs stiprias vokiečių
    karių įgulas Gardine, Suraže, Breste, Kamenece ir ki­
    tose pilyse, pats su žmona, šeimyna, brangiaisiais in­
    dais bei savo šalininkais pa-
    P abėga į M a z o v iją
    sitraukė į Mazoviją pas ku­
    nigaikščius Jonušą ir Zemo-
    vitą, savo giminaičius. Šiedu vis dėlto Vytautą taip
    priėmė, jog jis netruko pajusti esąs nemalonus svečias:
    abudu nesistengė suteikti pabėgėliui deramos pagal­
    bos; iškilo aikštėn jųdviejų baimė, nors ir slepiama:
    mat nenorėjo jiedu nei neramios Vytauto širdies už­
    gauti, nei karaliaus įžeisti, rūpindamiesi, kad, kilus ka­
    rui, patys vienaip ar kitaip išvengtų bėdos.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002
- c-003
  santrauka: 'Mazovijos kunigaikštis Jonušas, siekdamas sosto, atvyko į Piotrkovą su tūkstantine raitelių palyda.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Štai dėl to sustiprėjo įtaka grupuotės, kuri
    siūlė karaliaus sostą atimti iš Jogailaičių ir antrą kartą
    perduoti Piasto palikuonims. Šitokia nuomonių įvairovė
    paskatino Mazovijos kunigaikštį Jonušą, trokšte trokš­
    tantį sosto, vykti į Piotrkovą. Jis atvyko su tūkstantine
    raitelių palyda ir asmeniniu dalyvavimu seimo darbe
    bei galinga kariauna taip sustiprino savo padėtį, kad
    apie Joną beveik liautasi galvoti.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003

## Ryšiai
- Jonušas (Mazovijos kunigaikštis) puole [[objektai/vietos/Poleksija]]
- Jonušas (Mazovijos kunigaikštis) keliavo_i [[objektai/vietos/Piotrkovas]]
- Jonušas (Mazovijos kunigaikštis) uzeme [[objektai/vietos/Kamenecas]]
- Jonušas (Mazovijos kunigaikštis) uzeme [[objektai/vietos/Suražas]]
