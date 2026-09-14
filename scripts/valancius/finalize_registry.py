"""Freeze the scoped editorial evidence register without opening a writable DB."""
import json
import re
import sqlite3
from pathlib import Path

root=Path(__file__).resolve().parents[2]
cache=root/".cache/valancius"
con=sqlite3.connect(f"file:{cache/'workflow.sqlite3'}?immutable=1",uri=True)
con.row_factory=sqlite3.Row
audit=json.loads((cache/"evidence-audit.json").read_text())
curation=json.loads((root/"scripts/valancius/curation.json").read_text())
register=[]
for record in audit:
    claim=dict(con.execute("SELECT * FROM claims WHERE claim_pk=?",(record["claim"]["claim_pk"],)).fetchone())
    code=claim["global_claim_code"]
    uses=[]
    for name,exhibition in curation.items():
        for section in exhibition["sections"]:
            for item in section["items"]:
                if item["claim"]==code:
                    uses.append({"work":"Paroda "+name,"section":section["title"],"item":item["key"],"role":"contextual"})
    for article in (root/"straipsniai").glob("*valancius*.md"):
        text=article.read_text()
        for section in re.split(r"(?m)^## ",text)[1:]:
            if code in section:
                uses.append({"work":article.stem,"section":section.splitlines()[0]})
    evidence=[]
    for quote in record["evidence"]:
        current=dict(con.execute("SELECT * FROM evidence_links WHERE evidence_pk=?",(quote["evidence_pk"],)).fetchone())
        pages=con.execute("SELECT * FROM evidence_pages WHERE evidence_pk=?",(quote["evidence_pk"],)).fetchone()
        evidence.append({"citationId":current["global_quote_code"],"source":current["source_rel"],
            "exactOriginal":current["quote_text_original_md"] or current["quote_text"],
            "displayExcerpt":current["quote_text_returned"],"pages":dict(pages) if pages else None,
            "publicStatus":current["public_status"]})
    register.append({"claimId":code,"claim":claim["claim_text"],"notePath":claim["note_path"],
        "publicStatus":claim["public_status"],"usedBy":uses,"evidence":evidence,
        "interpretationLimits":"Konkrečios ribos įvardytos straipsnio įrodymų kortelėje arba savarankiškame eksponato apraše. Katalogo tapatybė nelyginama su teminiu istoriniu teiginiu."})
destination=root/"scripts/valancius/evidence-register.json"
destination.write_text(json.dumps(register,ensure_ascii=False,indent=2)+"\n")
print("Registered",len(register),"candidates; used",sum(bool(x["usedBy"]) for x in register))
con.close()
