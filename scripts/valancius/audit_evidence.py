"""Read-only, bounded audit of the Valančius cycle's existing evidence.

Run with the backend virtualenv. Does not approve claims or modify the database.
The report is a generated editorial work product, not a public projection.
"""
import argparse
import json
import sqlite3
from pathlib import Path

CODES = [208492,208497,208750,208752,208756,208758,208759,208765,
         208767,208773,208774,208786,208788,208793,208799,208803,
         208808,208814,208821,208829,208834,208845,208512,
         209423,209258,209266,209383,209449,209460,209465,
         209541,209543,209546,209548,209551,209552,209553,209554,
         209566,209569,209575,209576]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("database", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    con = sqlite3.connect(f"file:{args.database.resolve()}?mode=ro&immutable=1", uri=True)
    con.row_factory = sqlite3.Row
    report = []
    for code in CODES:
        claim = con.execute("SELECT * FROM claims WHERE global_claim_code=?", (f"t-{code}",)).fetchone()
        if claim is None:
            raise RuntimeError(f"Missing real claim t-{code}")
        links = con.execute("""SELECT e.*, cel.status AS relation_status
            FROM claim_evidence_links cel JOIN evidence_links e ON e.evidence_pk=cel.evidence_pk
            WHERE cel.claim_pk=?""", (claim["claim_pk"],)).fetchall()
        verifications = con.execute("SELECT * FROM claim_independent_verifications WHERE claim_pk=?", (claim["claim_pk"],)).fetchall()
        report.append({"claim":dict(claim), "evidence":[dict(r) for r in links],
                       "verifications":[dict(r) for r in verifications]})
    result = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(result + "\n")
    else:
        print(result)
    con.close()

if __name__ == "__main__":
    main()
