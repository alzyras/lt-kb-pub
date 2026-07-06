---
tipas: vieta
pavadinimas: 'Heilsbergas'
saltiniai:
  - 'Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)'
  - 'Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)'
  - 'Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)'
sukurta: ''
atnaujinta: ''
tags:
  - ginklas
  - miestas
  - pilis
  - upė
media_total_count: '0'
media_primary_thumb_url: ''
media_primary_canonical_url: ''
media_primary_directness: ''
media_primary_relation_type: ''
media_primary_json: ''
media_direct_json: |-
  []
media_contextual_json: |-
  []
media_all_json: |-
  []
---
# Heilsbergas

## Santrauka

Dusburgietis teigia, kad pasak kai kurių, ilgainiui Varmės žemėje dar buvo pastatytos Brunsbergo259 ir Heilsbergo pilys260, o Galindos žemėje — vienas miestas261, o jų apsaugai ten palikta daug brolių ir ginklanešių. Dusburgietis teigia, kad be to, užkariavo Heilsbergo pilį, kuri tuo metu buvo pagudėnų rankose, vienus žmones išsivarydami į nelaisvę, o kitus išžudydami, ir nuo to laiko Prūsijos žemėje įsiviešpatavo taika.

## Teiginiai

<a id="claim-t-179914"></a>
- t-001
  global_id: t-179914
  teiginys: "Pasak kai kurių, ilgainiui Varmės žemėje dar buvo pastatytos Brunsbergo259 ir Heilsbergo pilys260, o Galindos žemėje — vienas miestas261, o jų apsaugai ten palikta daug brolių ir ginklanešių."
  semantiniai_rysiai: "Heilsbergas priklausė Varmė (0.72)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "933738-933870; hash=b9f1797759f94ab604c3d7a19966e7a8592bc479268b1adfef3b88c2b17b48d7; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "priklause -> Varmė: 0.72"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Heilsbergas: llm_allowed_candidate, place"
  ryšio_targeto_parinkimas: "Varmė: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Teiginys Heilsbergo pilį lokalizuoja Varmės žemėje, bet formuluotė yra netiesioginė."
  vertinimo_atnaujinta: "2026-06-13T14:43:51Z"
  vertinimo_autorius: "claim_quality_pipeline / rewrite"
  pagrindžia:
    - c-32070

<a id="claim-t-184156"></a>
- t-002
  global_id: t-184156
  teiginys: "Ordino magistras ir broliai užkariavo pagudėnų valdytą Heilsbergo pilį, jos žmones išžudė arba paėmė į nelaisvę."
  teiginio_tipas: "saltinio_teiginys"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  semantiniai_rysiai: "Pagudėnai valdė Heilsbergas (0.91)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "470565-471030; hash=f85875ef3d58f51df3f03f46c5af8b719e8e993ef8de46eef2c8f33005ed3509; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "valde -> Heilsbergas: 0.91"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Pagudėnai: llm_allowed_candidate, group"
  ryšio_targeto_parinkimas: "Heilsbergas: llm_allowed_candidate, place"
  ryšio_paaiskinimas: "Pasakymas, kad pilis buvo pagudėnų rankose, tiesiogiai rodo jų valdymą."
  pagrindžia:
    - c-167541

<a id="claim-t-184960"></a>
- t-003
  global_id: t-184960
  teiginys: "Kurše sudeginus Karšuvos ir Heilsbergo pilis, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "173191-173690; hash=3388e27b32be0e566137ee7e7f680e85c77989814c7289a5280dbab6ea1319b1; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "susije_su -> Prūsija: 0.85"
  ryšio_patikimumo_lygis: "vidutinis"
  ryšio_patikimumo_priezastys: "owner_before_predicate; single_candidate_target; single_candidate_actor; target_after_predicate; same_sentence_locality"
  ryšio_sprendimo_taisykle: "rule_plain_mention"
  ryšio_subjekto_parinkimas: "Heilsbergas: owner_note_path, place, gap=0"
  ryšio_targeto_parinkimas: "Prūsija: mention_match, place, gap=66"
  ryšio_paaiskinimas: "Ryšys sukurtas taisykle \"rule_plain_mention\". Subjektas \"Heilsbergas\" parinktas kaip owner_note_path. Targetas \"Prūsija\" parinktas kaip mention_match aplink predikatą \"mention\". Patikimumą lėmė: owner_before_predicate, single_candidate_target, single_candidate_actor, target_after_predicate, same_sentence_locality."
  pagrindžia:
    - c-168321

<a id="claim-t-184961"></a>
- t-004
  global_id: t-184961
  teiginys: "Po pergalių iš kryžiuočių buvo atimtos Heilsbergo, Kroicburgo, Karaliaučiaus ir Bartenšteino pilys bei miestai."
  teiginio_tipas: "faktas"
  patikimumo_lygis: "vidutinis"
  patikimumo_saltinis: "ai"
  semantiniai_rysiai: "Heilsbergas priklausė Kryžiuočių ordinas (0.84)"
  šaltinio_profilis: "žanras: kronika; perspektyva: kryziuociu_ordino; šališkumas: very_high; atribucija: required_for_interpretation; atribucijos vardas: Dusburgietis"
  saltinio_vieta: "177462-177968; hash=24ff136506cd98d8ebc55c3c2abd3096137addfc53ea39a28c953712ab835917; match=exact"
  sprendimo_priezastis: "auto"
  ryšio_patikimumas: "priklause -> Kryžiuočių ordinas: 0.84"
  ryšio_patikimumo_lygis: "aukstas"
  ryšio_patikimumo_priezastys: "llm_structured_decision; deterministic_validation_passed"
  ryšio_sprendimo_taisykle: "llm_validated_relation"
  ryšio_subjekto_parinkimas: "Heilsbergas: llm_allowed_candidate, place"
  ryšio_targeto_parinkimas: "Kryžiuočių ordinas: llm_allowed_candidate, group"
  ryšio_paaiskinimas: "Jeigu Heilsbergas buvo atimtas iš kryžiuočių, tekstas remia ankstesnę priklausomybę kryžiuočiams."
  pagrindžia:
    - c-168322
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89156|Pagudėnai]]: Magistras ir broliai užkariavo pagudėnų rankose buvusią Heilsbergo pilį, dalį žmonių paėmė į nelaisvę, o kitus išžudė.
- susijęs iš [[objektai/grupes/Pagudėnai.md#claim-t-89156|Pagudėnai]]: Magistras ir broliai užkariavo pagudėnų rankose buvusią Heilsbergo pilį, dalį žmonių paėmė į nelaisvę, o kitus išžudė.
- susijęs iš [[objektai/ivykiai/Heilsbergo pilies apsiaustis ir įgulos pasitraukimas.md#claim-t-62799|Heilsbergo pilies apsiaustis ir įgulos pasitraukimas (pilis)]]: Heilsbergo pilies įgula, pritrūkusi maisto po prūsų apsiausties, paliko pilį ir slapta pasitraukė į Elbingą.
- susijęs iš [[objektai/ivykiai/Žygis į Pagudę, Heilsbergo pilies užėmimas ir taikos atkūrimas.md#claim-t-62964|Žygis į Pagudę, Heilsbergo pilies užėmimas ir taikos atkūrimas (pilis)]]: Magistras ir broliai įsiveržė į Pagudę, ją nusiaubė, užkariavo Heilsbergo pilį ir paėmė arba išžudė jos žmones.
- susijęs iš [[objektai/ivykiai/Žygis į Pagudę, Heilsbergo pilies užėmimas ir taikos atkūrimas.md#claim-t-62965|Žygis į Pagudę, Heilsbergo pilies užėmimas ir taikos atkūrimas (pilis)]]: Užkariavus Heilsbergo pilį, kuri buvo pagudėnų rankose, nuo to laiko Prūsijos žemėje įsiviešpatavo taika.
- susijęs iš Brunsbergas: Pasak Dusburgiečio, kai kurių teigimu Varmėje ilgainiui buvo pastatytos Brunsbergo ir Heilsbergo pilys.
- susijęs iš Karšuva: Kurše sudeginus Karšuvos ir Heilsbergo pilis, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją.
- susijęs iš Kuršas: Kurše sudeginus Karšuvos ir Heilsbergo pilis, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją.
- susijęs iš [[objektai/asmenys/Henrikas von Plauenas.md#claim-t-176405|Henrikas von Plauenas]]: Henrikas von Plauenas citatoje įvardijamas kaip Švitco komtūras.
- susijęs iš [[objektai/grupes/Kryžiuočių ordinas.md#claim-t-178959|Kryžiuočių ordinas]]: Varmės, Notangos ir Bartos prūsams pasidavus, Kryžiuočių ordino broliai pastatė Kroicburgo, Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš [[objektai/grupes/Varmiai.md#claim-t-78540|Varmiai]]: Varmės, Notangos ir Bartos prūsai, nusilpninti brolių ir kunigaikščio, davė įkaitų ir pasidavė tikėjimui bei broliams.
- susijęs iš [[objektai/ivykiai/Varmių, notangų ir bartų pasidavimas ir kelių pilių pastatymas (1241 m.).md#claim-t-66944|Varmių, notangų ir bartų pasidavimas ir kelių pilių pastatymas (1241 m.)]]: 1241 m. Varmės, Notangos ir Bartos prūsai pasidavė tikėjimui ir Ordino broliams, o broliai pastatė Kroicburgo, Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš [[objektai/ivykiai/Vytauto paliaubos ir taikos derybos su Livonijos ordinu (1410 m. vasara).md#claim-t-31497|Vytauto paliaubos ir taikos derybos su Livonijos ordinu (1410 m. vasara)]]: 1410 m. rugpjūtį Livonijos kariuomenė laivais atvyko į Sembą.
- susijęs iš Bartenšteinas: Bartos žemėje Vokiečių ordino broliai pastatė Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš Bartenšteinas: Bartos žemėje Vokiečių ordino broliai pastatė Bartenšteino, Vizenburgo ir Rezlio pilis.
- susijęs iš Bartos žemė: Po Varmės nuniokojimo lietuviai nuvedė grobiu apsikrovusius karius į Bartos žemę ir sustojo pailsėti atvirame lauke.
- susijęs iš Karaliaučius: Nusiaubus Sembą, buvo apsuptas neseniai čekų karaliaus Otokaro įkurtas Karaliaučiaus miestas.
- susijęs iš Kaustra: Kryžiuočių ordino broliai Notangos žemėje prie Kaustros upės pastatė Kroicburgo pilį.
- susijęs iš Kroicburgas: Broliai pastatė Kroicburgo pilį Notangos žemėje prie Kaustros upės, siekdami užkirsti kelią prūsų atkryčiui.
- susijęs iš Pagudė: Magistras ir broliai, keršydami už nužudytuosius, įsiveržė į Pagudės žemę ir ją nusiaubė plėšdami, degindami bei imdami belaisvius.
- susijęs iš Prūsija: Sudeginus Karšuvos ir Heilsbergo pilis Kurše, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją.
- susijęs iš Rezlis: Ordino broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Rezlis: Ordino broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Semba: Nusiaubus Sembą, buvo apsuptas neseniai čekų karaliaus Otokaro įkurtas Karaliaučiaus miestas.
- susijęs iš Vizenburgas: Broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Vizenburgas: Broliai Bartos žemėje pastatė tris pilis: Bartenšteino, Vizenburgo ir Rezlio.
- susijęs iš Žemaitija: Sudeginus Kurše Karšuvos ir Heilsbergo pilis, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją.
- susijęs iš [[objektai/zodynas/šeimyna familia domus.md#claim-t-58820|šeimyna familia domus]]: Kilmingieji ir vasalai iš Vokietijos kraštų į Prūsiją atvyko su namais, šeimynomis ir giminėmis.
- susijęs iš [[objektai/ivykiai/Vytauto paliaubos ir taikos derybos su Livonijos ordinu (1410 m. vasara).md#claim-t-31497|Vytauto paliaubos ir taikos derybos su Livonijos ordinu (1410 m. vasara)]]: 1410 m. rugpjūtį Livonijos kariuomenė laivais atvyko į Sembą.
## Reikšmingi paminėjimai

- c-001
  santrauka: 'Pasak kai kurių, ilgainiui Varmės žemėje dar buvo pastatytos Brunsbergo259 ir Heilsbergo pilys260, o Galindos žemėje — vienas miestas261, o jų apsaugai ten palikta daug brolių ir ginklanešių.'
  šaltinis: Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)
  citata_originali: |
    Nuo Marienburgo
    mūrų pasitraukęs, Vytautas prie Heilsbergo susitiko su Livonijos
    maršalu B. Hevelmannu ir pradėjo taikos derybas.
    c.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-001

- c-002
  santrauka: 'Ordino magistras ir broliai užkariavo pagudėnų valdytą Heilsbergo pilį, jos žmones išžudė arba paėmė į nelaisvę.'
  šaltinis: Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)
  citata_originali: |
    Magistras ir broliai, sujaudinti šio liūdno įvykio, pasiryžo atkeršyti už nužudytuosius,
    subūrė visas savo karines jėgas ir, įsibrovę į Pagudės žemę, skersai ir išilgai ją nusiaubė,
    plėsdami ir degindami, žudydami vyrus, o moteris bei vaikus išsivarydami  į nelaisvę.
    Be to, užkariavo Heilsbergo pilį, kuri tuo metu buvo pagudėnų rankose, vienus žmones
    išsivarydami į nelaisvę, o kitus išžudydami, ir nuo to laiko Prūsijos žemėje įsiviešpatavo
    taika.




    172 (167).
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-002

- c-003
  santrauka: 'Kurše sudeginus Karšuvos ir Heilsbergo pilis, kariuomenė buvo nuvesta į Žemaitiją, o vėliau į Prūsiją.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    105

    ## Puslapis 104

    bėgti; Saksonijos riteris Gebhardas, pavijęs to būrio
    paskutinę eilę, kalaviju nukirto vienam raiteliui gal­
    vą, tačiau lavonas be galvos bėgo kaip bėgęs nė ne­
    susvyravęs daugelį varstų, nesitraukdamas iš bėgan­
    čiųjų rikiuotės ir nenukrisdamas nuo žirgo. Sudeginus
    po to Kurše Karšuvos ir Heilsbergo pilis, kariuomenė
    buvo nuvesta į Žemaitiją, o vėliau — į Prūsiją. Tenai,
    nusiaubus Sembą, buvo apsuptas Karaliaučiaus mies­
    tas, čekų karaliaus Otokaro visai neseniai įkurtas.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-003

- c-004
  santrauka: 'Po pergalių iš kryžiuočių buvo atimtos Heilsbergo, Kroicburgo, Karaliaučiaus ir Bartenšteino pilys bei miestai.'
  šaltinis: Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)
  citata_originali: |
    Pats va­
    das, praradęs kariuomenę, pateko į priešų rankas. Po
    šių pergalių iš kryžiuočių buvo atimti Heilsbergo,
    Kroicburgo, Karaliaučiaus, Bartenšteino pilys ir miestai.
    Neliko saugi nuo karo tuo metu nė Livonija: ją nuo­
    latos siaubė Mindaugo karvedžiai, ten vyko kovos prie
    Lielvardės pilies Dauguvos pakrantėse, tačiau kokia
    norėdamas turėti laisvesnes
    rankas, atnaujino santarvę su rusais, ir tuo būdu tapo
    užmegzta rusų ir lietuvių
    vo kunigaikščio vaikaitis, palydėjo Mindaugą į žygį
    Mazovijos žemėn.
  citata_rodoma: ''
  teiginio_tipas: saltinio_teiginys
  statusas: verified
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindžia:
    - t-004

## Citatos

- id: c-32070
  autorius: "Zenonas Ivinskis"
  šaltinis: "Zenonas Ivinskis, Lietuvos istorija iki Vytauto Didžiojo mirties (1978 m.)"
  citata_originali: |
    Nuo Marienburgo
    mūrų pasitraukęs, Vytautas prie Heilsbergo susitiko su Livonijos
    maršalu B. Hevelmannu ir pradėjo taikos derybas.
    c.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-179914

- id: c-167541
  autorius: "Petras Dusburgietis"
  šaltinis: "Petras Dusburgietis, Prūsijos žemės kronika (1985 m.)"
  citata_originali: |
    Magistras ir broliai, sujaudinti šio liūdno įvykio, pasiryžo atkeršyti už nužudytuosius,
    subūrė visas savo karines jėgas ir, įsibrovę į Pagudės žemę, skersai ir išilgai ją nusiaubė,
    plėsdami ir degindami, žudydami vyrus, o moteris bei vaikus išsivarydami  į nelaisvę.
    Be to, užkariavo Heilsbergo pilį, kuri tuo metu buvo pagudėnų rankose, vienus žmones
    išsivarydami į nelaisvę, o kitus išžudydami, ir nuo to laiko Prūsijos žemėje įsiviešpatavo
    taika.




    172 (167).
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-184156

- id: c-168321
  autorius: "Albertas Vijūkas-Kojelavičius"
  šaltinis: "Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)"
  citata_originali: |
    105

    ## Puslapis 104

    bėgti; Saksonijos riteris Gebhardas, pavijęs to būrio
    paskutinę eilę, kalaviju nukirto vienam raiteliui gal­
    vą, tačiau lavonas be galvos bėgo kaip bėgęs nė ne­
    susvyravęs daugelį varstų, nesitraukdamas iš bėgan­
    čiųjų rikiuotės ir nenukrisdamas nuo žirgo. Sudeginus
    po to Kurše Karšuvos ir Heilsbergo pilis, kariuomenė
    buvo nuvesta į Žemaitiją, o vėliau — į Prūsiją. Tenai,
    nusiaubus Sembą, buvo apsuptas Karaliaučiaus mies­
    tas, čekų karaliaus Otokaro visai neseniai įkurtas.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-184960

- id: c-168322
  autorius: "Albertas Vijūkas-Kojelavičius"
  šaltinis: "Albertas Vijūkas-Kojelavičius, Lietuvos istorija (1989 m.)"
  citata_originali: |
    Pats va­
    das, praradęs kariuomenę, pateko į priešų rankas. Po
    šių pergalių iš kryžiuočių buvo atimti Heilsbergo,
    Kroicburgo, Karaliaučiaus, Bartenšteino pilys ir miestai.
    Neliko saugi nuo karo tuo metu nė Livonija: ją nuo­
    latos siaubė Mindaugo karvedžiai, ten vyko kovos prie
    Lielvardės pilies Dauguvos pakrantėse, tačiau kokia
    norėdamas turėti laisvesnes
    rankas, atnaujino santarvę su rusais, ir tuo būdu tapo
    užmegzta rusų ir lietuvių
    vo kunigaikščio vaikaitis, palydėjo Mindaugą į žygį
    Mazovijos žemėn.
  statusas: verified
  teiginio_tipas: faktas
  patikimumo_lygis: vidutinis
  patikimumo_saltinis: ai
  pagrindzia:
    - t-184961

## Ryšiai
- Buvo valdoma: [[objektai/grupes/Pagudėnai]]
- Buvo kelionės vieta: [[objektai/asmenys/Vytautas|Vytautas (Lietuvos valdovas, XIV–XV a.)]]
- Heilsbergas priklausė [[objektai/grupes/Kryžiuočių ordinas]], [[objektai/vietos/Kuršas]], [[objektai/grupes/Pagudėnai]], [[objektai/vietos/Varmė]]
