"""Acquire catalogued historical candidates, preserving their unedited full images."""
import json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; WORK=ROOT/'.valancius-state/b-research'
def get(url,path):
    if not path.exists():subprocess.run(['curl','--fail','-Ls','--max-time','50',url,'-o',str(path)],check=True)
for id in ['990004343691008452','990005314561008452']:
    o=json.loads((WORK/f'vu-{id}.json').read_text())
    for n in ([1,2,3,4] if id=='990004343691008452' else [1,2,3,4,5,6,7]):
        if n>len(o['items']):break
        url=o['items'][n-1]['thumbnail'][0]['id'].replace('/90,/','/max/')
        try:get(url,WORK/f'{id}-{n:02}.jpg')
        except subprocess.CalledProcessError:
            print('Unavailable canvas',id,n,flush=True);continue
        print(id,n,flush=True)
for id in [98844675,29967206]:
    o=json.loads((WORK/f'commons-{id}.json').read_text());get(o['imageinfo'][0]['url'].split('?')[0],WORK/f'commons-{id}.jpg')
    print(id,flush=True)
