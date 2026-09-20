"""Reproducible, scoped editorial preview in the isolated Valančius database.

Never points at the live workflow DB. Keeps the original public media catalogue
and adds only the visually reviewed cycle selection through the existing writer
and exporter. Exhibitions remain drafts; no deployment or remote write occurs.
"""
import html
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT.parent / "lt-kb"
CACHE = ROOT / ".cache/valancius"
DB = CACHE / "workflow.sqlite3"
assert ROOT.name == "lt-kb-pub-valancius" and DB.is_file()
os.environ.update(ROOT_DIR=str(BACKEND), PUBLIC_REPO_DIR=str(ROOT), DB_PATH=str(DB))
sys.path.insert(0, str(BACKEND))
from lt_kb_app.media.models import MediaCandidate
from lt_kb_app.media.writer import upsert_media_item, attach_media_ref
from lt_kb_app.media.importer import _upsert_publication, ensure_import_tables, export_public_media_catalog
from lt_kb_app.media.exhibitions import apply_exhibition_seed, export_public_exhibitions, validate_exhibition_seed

def plain(value):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", value))).strip()

def main():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    ensure_import_tables(con)
    target = dict(con.execute("SELECT item_id,note_path,title FROM items WHERE note_path='objektai/asmenys/Motiejus Valančius.md' AND status='active'").fetchone())
    curation = json.loads((ROOT / "scripts/valancius/curation.json").read_text())
    assets = ROOT / "quartz/static/media/valancius"
    assets.mkdir(parents=True, exist_ok=True)
    selected, media_ids, registry = {}, [], []
    for cycle in curation.values():
        for section in cycle["sections"]:
            assert 60 <= len(section["lead"].split()) <= 100
            for item in section["items"]:
                assert 70 <= len(item["description"].split()) <= 120, item["key"]
                manifest_url = ""
                if "vu" in item:
                    record = json.loads((CACHE / f"vu/{item['vu']}.json").read_text())
                    canvas = record["items"][item["page"] - 1]
                    image_url = canvas["thumbnail"][0]["id"].replace("/90,/", "/1200,/")
                    canonical = f"https://kolekcijos.biblioteka.vu.lt/objects/{item['vu']}"
                    manifest_url = canonical + "/manifest.json?format=rich"
                    institution = "Vilniaus universiteto biblioteka"
                    provider, external = "vu", item["vu"]
                    license_label, license_url = "Public domain", record["rights"]
                    primary = canonical
                    source = CACHE / f"previews/{item['vu']}-{item['page']:03}.jpg"
                    rights = "Viešoji sritis, pagal VU bibliotekos IIIF įrašą. Nurodyti autorių, pavadinimą ir saugotoją. Biblioteka prašo pranešti apie panaudojimą; laiškas šiame darbe nesiunčiamas."
                else:
                    record = json.loads((CACHE / f"commons/{item['commons']}.json").read_text())
                    info = record["imageinfo"][0]
                    metadata = info["extmetadata"]
                    canonical, image_url = info["descriptionurl"], info["url"].split("?")[0]
                    provider, external = "commons", str(item["commons"])
                    institution = item["institution"]
                    license_label = metadata["LicenseShortName"]["value"]
                    license_url = metadata.get("LicenseUrl", {}).get("value") or ("https://creativecommons.org/licenses/by/4.0/" if "CC BY 4" in license_label else "https://creativecommons.org/publicdomain/mark/1.0/")
                    credit = metadata.get("Credit", {}).get("value", "")
                    urls = re.findall(r'href="(https?://[^\"]+)"', credit)
                    primary = item.get("primary") or (html.unescape(urls[0]) if urls else canonical)
                    source = CACHE / f"previews/commons-{item['commons']}.jpg"
                    rights = f"{license_label}; skaitmeninis vaizdas iš Wikimedia Commons. Kilmės įrašas: {primary}. " + item.get("hold", "")
                dimensions = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(source)], text=True)
                width = int(re.search(r"pixelWidth: (\d+)", dimensions)[1])
                height = int(re.search(r"pixelHeight: (\d+)", dimensions)[1])
                shutil.copy2(source, assets / item["file"])
                local = "/static/media/valancius/" + item["file"]
                attribution = f"{item['creator']}. {item['title']}. {item['date']}. {institution}. {license_label}."
                candidate = MediaCandidate(provider=provider, external_id=external, canonical_url=canonical,
                    source_url=image_url, title=item["title"], description=item["description"], creator=item["creator"],
                    provider_label=institution, license=license_label, rights_note=rights, date_display=item["date"],
                    date_start=item["year"], width=width, height=height, thumb_url=local, preview_url=local,
                    iiif_manifest_url=manifest_url, metadata={"institution":institution,"license_url":license_url,
                    "attribution":attribution,"original_catalog_url":primary,"editorial_hold":item.get("hold", ""),
                    "preview_asset":local,"canvas_number":item.get("page"),"review_method":"editorial-visual-2026-09-13"})
                media_id = upsert_media_item(con, candidate.to_dict())
                attach_media_ref(con, target, candidate.to_dict(), {"relation_type":"portrait_of" if item["key"].startswith(("portretas","foto","albumas")) else "contextual", "directness":"contextual", "confidence":0.95,
                    "judge":{"caption_lt":item["title"],"reason":"Vizualiai patikrintas dokumentas; platesnis ryšys su asmeniu teminis."}}, "accepted")
                _upsert_publication(con, media_id, {"caption_lt":item["title"],"historical_relevance":"contextual","confidence":0.95,
                    "judge_model":"Codex editorial review","media_kind":"historical-document","canonical_tags":[],"proposed_tags":[],
                    "tag_rationale":"Valančiaus ciklo dokumentinis kontekstas","visual_evidence":item["description"],
                    "metadata_evidence":primary,"reason":item.get("hold") or "Vaizdas ir katalogo aprašas patikrinti; datos sluoksniai atskirti.",
                    "object_links":[],"rejected_object_links":[],"visual_inspected":True},source_method="valancius_editorial_preview")
                # Visual acceptance is not publication approval: the whole cycle is
                # a noindex local draft, and the hold is preserved in source metadata.
                selected[item["key"]] = {"mediaId":media_id,"asset":local,"width":width,"height":height,"title":item["title"],"attribution":attribution}
                media_ids.append(media_id)
                registry.append({**item,"mediaId":media_id,"institution":institution,"canonicalUrl":canonical,"originalCatalogUrl":primary,
                    "license":license_label,"licenseUrl":license_url,"sourceUrl":image_url,"asset":local,"width":width,"height":height,
                    "reviewStatus":"publication-hold" if item.get("hold") else "reviewed-for-preview"})
    con.commit()
    supplement = CACHE / "media-export.json"
    print(export_public_media_catalog(con, media_ids=media_ids, output_path=supplement), flush=True)
    entries = json.loads(supplement.read_text())["entries"]
    assert set(media_ids) == {e["mediaId"] for e in entries}
    base = json.loads(subprocess.check_output(["git","show","HEAD:quartz/static/mediaCatalogSource.json"],cwd=ROOT))
    # Only media ids in this reviewed selection can replace a baseline record.
    base["entries"] = [e for e in base["entries"] if e.get("mediaId") not in media_ids] + entries
    catalog_path = ROOT / "quartz/static/mediaCatalogSource.json"
    catalog_path.write_text(json.dumps(base,ensure_ascii=False,indent=2,sort_keys=True)+"\n")
    links = [
        {"title":"Valančius ir caro valdžia · straipsnis","href":"/straipsniai/motiejus-valancius-ir-rusijos-imperija/"},
        {"title":"Valančiaus laiškai ir draudžiamos knygos · paroda","href":"/parodos/valancius-laiskai-imperijos-seselyje/"},
        {"title":"Kodėl kaimas gėrė ir kaip Valančius ragino negerti · straipsnis","href":"/straipsniai/kaip-valancius-keite-kasdienybe/"},
        {"title":"Valančiaus blaivybės brolijos · paroda","href":"/parodos/valancius-nuo-sakyklos-iki-skaitytojo/"}]
    ids=[]
    for cycle in curation.values():
        identity=cycle["slug"]
        payload={"schemaVersion":"ltkb-exhibition/v1","exhibitionId":identity,"slug":"parodos/"+identity,
            **{k:cycle[k] for k in ["title","seo_title","subtitle","description"]},"status":"draft","noindex":True,
            "editorialProfile":"compact-documentary","theme":"documents","relatedContent":links,
            "relatedObject":{"href":"/objektai/asmenys/Motiejus-Valancius","label":"Motiejus Valančius"},
            "heroMediaId":selected[cycle["hero"]]["mediaId"],"sections":[]}
        for section in cycle["sections"]:
            sec={"sectionId":identity+"-"+section["slug"],"slug":section["slug"],"title":section["title"],"lead":section["lead"],
                 "navMediaId":selected[section["items"][0]["key"]]["mediaId"],"claimRefs":[],"items":[]}
            for item in section["items"]:
                sec["items"].append({"exhibitionItemId":identity+"-"+item["key"],"mediaId":selected[item["key"]]["mediaId"],
                    "titleLt":item["title"],"descriptionLt":item["description"],"catalogDescriptionLt":item["description"],
                    "creatorDisplay":item["creator"],"dateDisplay":item["date"],"featured":True,
                    "evidenceNoteLt":item.get("hold") or "Teiginys aiškina temos kontekstą. Eksponato tapatybę ir datą pagrindžia jo katalogo įrašas.",
                    "claimCodes":[item["claim"]],"claimRefs":[{"claimId":item["claim"],"citationId":item["citation"],"role":"contextual"}]})
            payload["sections"].append(sec)
        errors=validate_exhibition_seed(con,{**payload,"status":"published"})
        if errors: raise RuntimeError(errors)
        print(apply_exhibition_seed(con,payload),flush=True)
        (CACHE/(identity+".seed.json")).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n")
        ids.append(identity)
    con.commit()
    print(export_public_exhibitions(con,exhibition_ids=ids,include_drafts=True,catalog_path=catalog_path,
        output_path=ROOT/"quartz/static/exhibitionValancius.json"),flush=True)
    (CACHE/"media-selection.json").write_text(json.dumps(selected,ensure_ascii=False,indent=2)+"\n")
    (CACHE/"exhibit-register.json").write_text(json.dumps(registry,ensure_ascii=False,indent=2)+"\n")
    con.close()

if __name__ == "__main__":
    main()
