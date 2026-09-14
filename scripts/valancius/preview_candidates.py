"""Download catalogue-provided previews for visual identification (no approval)."""
import json
import subprocess
from pathlib import Path

def download(url, target):
    if not target.exists():
        subprocess.run(["curl","--fail","-L","-s","--max-time","60",url,"-o",str(target)],check=True)

folder = Path(".cache/valancius/previews")
folder.mkdir(parents=True, exist_ok=True)
for source in sorted(Path(".cache/valancius/vu").glob("*.json")):
    manifest = json.loads(source.read_text())
    for page_index in [0,2]:
        canvas = manifest["items"][page_index]
        url = canvas["thumbnail"][0]["id"].replace("/90,/", "/1200,/")
        target = folder/f"{source.stem}-{page_index+1:03}.jpg"
        download(url,target)
        print(target,flush=True)
for source in sorted(Path(".cache/valancius/commons").glob("*.json")):
    page = json.loads(source.read_text())
    download(page["imageinfo"][0]["url"],folder/f"commons-{source.stem}.jpg")
    print(page["title"],flush=True)
