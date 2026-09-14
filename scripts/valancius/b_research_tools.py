"""Bounded public catalogue research. Downloads are for editorial inspection, not publication."""
import concurrent.futures, html, json, re, subprocess, urllib.parse
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.valancius-state/b-research'
def get(url):
    return subprocess.check_output(['curl','--fail','-Ls','--max-time','45',url])
def task(name,url):
    try:
        data=get(url).decode(); (WORK/(name+'.html')).write_text(data)
        if name=='museum':
            for match in re.finditer(r'<img[^>]+>',data):
                tag=match.group(); print(name,tag[:700],flush=True)
        elif name=='vu':
            print(name, [x[:200] for x in re.findall(r'<(?:input|form|[^> ]*search)[^>]+>',data)[:12]],flush=True)
        elif name=='polona-js':
            print(name, re.findall(r'.{0,70}(?:entities|manifest|iiif|/objects|/resources|/items).{0,110}',data)[:45],flush=True)
        else:
            print(name, html.unescape(re.sub('<[^>]+>',' ',data))[:4000],flush=True)
    except Exception as e: print(name,str(e),flush=True)
if __name__=='__main__':
    def search(term):
        data=get('https://kolekcijos.biblioteka.vu.lt/search/detailed?'+urllib.parse.urlencode({'term':term})).decode()
        ids=list(dict.fromkeys(re.findall(r'href="/objects/(\d+)"',data)))[:16]
        for id in ids:
            manifest=json.loads(get(f'https://kolekcijos.biblioteka.vu.lt/objects/{id}/manifest.json?format=rich'))
            (WORK/f'vu-{id}.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
            print(term,id,manifest.get('label'),manifest.get('rights'),flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(search,['karčema','senelis','Szymkiewicz','blaiv']))
