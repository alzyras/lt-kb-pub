"""Read-only research and a fresh isolated snapshot for the B revision."""
import concurrent.futures
import json
import re
import sqlite3
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.valancius-state/b-research'
WORK.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT.parent / 'lt-kb/darbas/state/workflow.sqlite3'
DB = ROOT / '.valancius-state/b-revision.sqlite3'
if not DB.exists():
    before = SOURCE.stat()
    wal = Path(str(SOURCE)+'-wal')
    assert not wal.exists() or wal.stat().st_size == 0
    subprocess.run(['cp','-c',str(SOURCE),str(DB)], check=True)
    assert SOURCE.stat().st_mtime_ns == before.st_mtime_ns
    assert not wal.exists() or wal.stat().st_size == 0

def get(url):
    request = urllib.request.Request(url, headers={'User-Agent':'ValanciusEditorialResearch/1.0 (historical educational draft)'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()

def commons(query):
    url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','generator':'search','gsrsearch':query,'gsrnamespace':6,'gsrlimit':8,'prop':'imageinfo','iiprop':'url|extmetadata|size'})
    data=json.loads(get(url))
    for key,page in data.get('query',{}).get('pages',{}).items():
        (WORK/f'commons-{key}.json').write_text(json.dumps(page,ensure_ascii=False,indent=2))
    return query,[(p['pageid'],p['title']) for p in data.get('query',{}).get('pages',{}).values()]

with sqlite3.connect(f'file:{DB}?mode=ro&immutable=1',uri=True) as con:
    con.row_factory=sqlite3.Row
    rows=con.execute("SELECT * FROM claims WHERE source_rel LIKE '%Valanc%' OR source_rel LIKE '%Blaivybe%' OR source_rel LIKE '%Puzaras%'").fetchall()
    records=[]
    for row in rows:
        evidence=con.execute('SELECT e.* FROM claim_evidence_links l JOIN evidence_links e ON e.evidence_pk=l.evidence_pk WHERE l.claim_pk=?',(row['claim_pk'],)).fetchall()
        records.append({'claim':dict(row),'evidence':[dict(e) for e in evidence]})
    (WORK/'claims.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
queries=['"Peasants in an Inn" "Smuglewicz"','"Josvainiai" "karčema"','"Dzieło o pijaństwie"','"Szymkiewicz"','"Ireneusz Ogiński"','"Šiaulėniškis"','"Sziauleniszkis"','"Edict of Muravyov"']
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for result in pool.map(commons,queries): print(result,flush=True)
