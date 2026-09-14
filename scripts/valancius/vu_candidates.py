"""Collect public VU catalogue manifests for the cycle's editorial review."""
import json
import subprocess
import re
from pathlib import Path
from urllib.parse import urlencode

BASE = "https://kolekcijos.biblioteka.vu.lt"
def get(url):
    return subprocess.check_output(["curl","--fail","-Ls","--max-time","45",url]).decode()

def main():
    folder = Path(".cache/valancius/vu")
    folder.mkdir(parents=True, exist_ok=True)
    identifiers = {"990004519391008452", "990003935071008452", "990003935231008452",
                   "990003935191008452", "990008075611008452", "990008174101008452"}
    for creator in ["Valančius, Motiejus", "Valančius, Motiejus Kazimieras", "Valančius, Motiejus, 1801–1875"]:
        url = BASE+"/search/detailed?"+urlencode({"f[0]":"creator_search_detailed:"+creator})
        identifiers.update(re.findall(r'href="/objects/(\d+)"',get(url)))
    for identifier in sorted(identifiers):
        target = folder/(identifier+".json")
        if not target.exists():
            manifest = json.loads(get(BASE+"/objects/"+identifier+"/manifest.json?format=rich"))
            target.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
        data = json.loads(target.read_text())
        print(identifier, data.get("label"),data.get("rights"), "pages",len(data.get("items",[])),flush=True)

if __name__ == "__main__":
    main()
