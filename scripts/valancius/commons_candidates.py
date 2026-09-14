"""Collect source metadata for editorial review; never auto-approve media."""
import json
import subprocess
from pathlib import Path
from urllib.parse import urlencode, quote

FILES = [
    "Motiejus Valančius 1854.jpg", "Motiejus Valančius 1857.jpg",
    "Apej brostwą błaiwistes arba nusiturieima (in Lithuanian language) by Motiejus Valančius, published in Klaipėda, 1861.jpg",
    "Cover of Žemajtiu Wiskupiste.jpg", "Devotional medal of the Valančius temperance movement.jpeg",
    "Woodcut of Valančius temperance movement.jpg", "Maciej Wołonczewski.jpg",
    "Lietuviszkas albumas - Lithuanian album 1898 (19162078).jpg",
    "Edict of Alexander II in 1864.jpg", "Edict of Muravyov in 1864.jpg",
    "Lithuanian language book, printed in the Civil Script during the Lithuanian press ban, Vilnius, 1865.jpg",
    "Auksa altorius latin.jpg",
]

def main():
    folder = Path(".cache/valancius/commons")
    folder.mkdir(parents=True, exist_ok=True)
    existing = {json.loads(path.read_text())["title"] for path in folder.glob("*.json")}
    for name in FILES:
        if "File:"+name in existing:
            continue
        params = {"action":"query", "format":"json", "titles":"File:"+name,
                  "prop":"imageinfo", "iiprop":"url|extmetadata|size"}
        raw = subprocess.check_output(["curl","--fail","-Ls","--retry","2","--max-time","30", "https://commons.wikimedia.org/w/api.php?"+urlencode(params, quote_via=quote)])
        data = json.loads(raw)
        page = next(iter(data["query"]["pages"].values()))
        if "imageinfo" not in page:
            raise RuntimeError(f"Missing imageinfo: {name}")
        (folder/(str(page["pageid"])+".json")).write_text(json.dumps(page,ensure_ascii=False,indent=2)+"\n")
        print(name, page["pageid"], flush=True)

if __name__ == "__main__":
    main()
