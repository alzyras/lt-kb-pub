# Perkėlimas į development

2026-09-14. Ciklo svetainės pakeitimai perkelti atskiru commit nuo `origin/development` (`3338073201`). Esama nešvari development darbo kopija, pagrindinė duomenų bazė ir kiti darbai nepakeisti. Abu straipsniai ir abi parodos lieka juodraščiai su `noindex`; `development` CI nevykdo viešo GitHub Pages publikavimo.

Pakartotinės integravimo patikros: 225 testai praėjo, TypeScript praėjo, ryšių patikra rado 0 problemų. Visi 33 pakeisti objektų failai atitinka eksportuoto manifesto kontrolines sumas; kitų failų manifesto įrašai nepakeisti. Ankstesnis development Jogailos medijos pakeitimas išsaugotas.

Visas `prebuild` šiame development pagrinde nepraeina dėl ankstesnių duomenų failų ir eksporto manifesto neatitikimų. Ciklo perkėlimas jų netaiso ir patikros nesilpnina. Ankstesnėje pagrindinės šakos pagrindu parengtoje ciklo kopijoje sėkmingai atliktas pilnas surinkimas ir `postbuild` nėra pristatomi kaip šio development pagrindo pilno surinkimo rezultatas.

Į Git įtraukti turinys, istoriniai vaizdai, įrodymų registrai, ankstesnė B redakcija, kodas ir testai. Vietinės bazės, sugeneruotas `public`, ekrano kopijos bei vykdymo žurnalai liko vietoje ir neįkelti. B-STATUS nuorodos į juos yra vietinės peržiūros nuorodos.

Atskiros `lt-kb` repozitorijos neįkelti duomenų įrankių pakeitimai neįtraukti į šį svetainės commit. Jos development dar neturi autorinių objektų projekcijos išsaugojimo mechanizmo, kuriuo remiasi vietiniai ciklo parengimo įrankiai. Todėl šie įrankiai nėra pažadas, kad pakanka švaraus backend development checkout visam darbo procesui pakartoti. Duomenų įrankių integravimas, pagrindinės bazės atnaujinimas ir viešas publikavimas lieka atskiri darbai.
