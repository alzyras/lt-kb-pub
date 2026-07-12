#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import subprocess
import unicodedata
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


SUSPICIOUS_PRIMARY_TERMS = (
    "alberta",
    "can ab",
    "vilna village",
    "wilno voivodeship",
    "polish institute of military geography",
    "wojskowy instytut geograficzny",
    "municipal district",
    "natural resources canada",
)


class ClaimAuditParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.claim_controls: list[str] = []
        self.detail_ids: set[str] = set()
        self.detail_stack: list[tuple[str, str]] = []
        self.detail_text: dict[str, list[str]] = {}
        self.detail_has_citation: dict[str, bool] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key: value or "" for key, value in attrs}
        elem_id = data.get("id", "")
        if elem_id:
            self.ids.append(elem_id)
        aria = data.get("aria-controls", "")
        if aria and ("claim" in aria or "evidence" in aria):
            self.claim_controls.append(aria)
        detail = data.get("data-claim-detail", "")
        if detail or elem_id.startswith("claim-evidence-"):
            key = elem_id or detail
            self.detail_ids.add(key)
            self.detail_stack.append((key, tag))
            self.detail_text.setdefault(key, [])
            self.detail_has_citation.setdefault(key, False)
        classes = set(data.get("class", "").split())
        if self.detail_stack and ("claim-citation-card" in classes or data.get("data-citation-card") == "true"):
            self.detail_has_citation[self.detail_stack[-1][0]] = True

    def handle_endtag(self, tag: str) -> None:
        if self.detail_stack and tag == self.detail_stack[-1][1]:
            self.detail_stack.pop()

    def handle_data(self, data: str) -> None:
        if self.detail_stack:
            self.detail_text.setdefault(self.detail_stack[-1][0], []).append(data)


def _tracked_files(content: Path) -> list[Path]:
    try:
        proc = subprocess.run(["git", "ls-files", "-z"], cwd=content, check=True, stdout=subprocess.PIPE)
    except Exception:
        return [path.relative_to(content) for path in content.rglob("*.md") if ".git" not in path.parts]
    return [Path(raw.decode("utf-8")) for raw in proc.stdout.split(b"\0") if raw]


def audit_filename_bytes(content: Path) -> list[dict[str, object]]:
    issues: list[dict[str, object]] = []
    for rel in _tracked_files(content):
        name = rel.name
        size = len(name.encode("utf-8"))
        if size > 255:
            issues.append({"path": str(rel), "basename_bytes": size, "reason": "basename_over_255_bytes"})
    return issues


def _primary_media_objects(markdown_text: str) -> list[dict[str, object]]:
    out: list[dict[str, object]] = []
    lines = markdown_text.splitlines()
    for idx, line in enumerate(lines):
        if not line.startswith("media_primary_json:"):
            continue
        for raw in lines[idx + 1 : idx + 8]:
            stripped = raw.strip()
            if not stripped or stripped == "|-":
                continue
            if not stripped.startswith("["):
                break
            try:
                parsed = json.loads(stripped)
            except json.JSONDecodeError:
                break
            if isinstance(parsed, list):
                out.extend(item for item in parsed if isinstance(item, dict) and int(item.get("isPrimary") or 0) == 1)
            break
    return out


def audit_primary_media(content: Path) -> list[dict[str, object]]:
    issues: list[dict[str, object]] = []
    # Keep CI deterministic and low-noise: broad media quality is a DB-side audit.
    # Public CI only blocks the known high-risk Vilnius primary regression.
    rels = [Path("objektai/vietos/Vilnius.md")]
    for rel in rels:
        path = content / rel
        if not path.is_file():
            continue
        primary_items = _primary_media_objects(path.read_text(encoding="utf-8", errors="ignore"))
        for item in primary_items:
            blob = " ".join(str(item.get(key) or "") for key in ("title", "caption", "creator", "canonicalUrl")).casefold()
            if any(term in blob for term in SUSPICIOUS_PRIMARY_TERMS):
                issues.append({"path": str(rel), "reason": "suspicious_media_primary_json", "title": str(item.get("title") or "")})
    return issues


def audit_claim_html(public: Path) -> list[dict[str, object]]:
    issues: list[dict[str, object]] = []
    id_re = re.compile(r'\bid=["\'](claim-evidence-[^"\']+)["\']')
    controls_re = re.compile(r'\baria-controls=["\'](claim-evidence-[^"\']+)["\']')
    for path in public.glob("objektai/**/*.html"):
        html = path.read_text(encoding="utf-8", errors="ignore")
        if "claim-evidence-" not in html and "aria-controls" not in html:
            continue
        ids = id_re.findall(html)
        controls = controls_re.findall(html)
        seen: set[str] = set()
        duplicate_ids = sorted({elem_id for elem_id in ids if elem_id in seen or seen.add(elem_id)})
        id_set = set(ids)
        rel = str(path.relative_to(public))
        for elem_id in duplicate_ids:
            issues.append({"path": rel, "reason": "duplicate_claim_evidence_dom_id", "id": elem_id})
        for control in controls:
            if control not in id_set:
                issues.append({"path": rel, "reason": "missing_claim_detail_target", "id": control})
        for elem_id in id_set:
            pos = html.find(f'id="{elem_id}"')
            if pos < 0:
                pos = html.find(f"id='{elem_id}'")
            if pos < 0:
                continue
            next_pos_candidates = [idx for idx in (html.find('data-claim-row', pos + 1), html.find('claim-evidence-', pos + len(elem_id))) if idx > pos]
            end = min(next_pos_candidates) if next_pos_candidates else pos + 12000
            snippet = html[pos:end]
            if "Citata nerasta" in snippet:
                issues.append({"path": rel, "reason": "missing_citation_card_text", "id": elem_id})
    return issues


def audit_graph_identity(public: Path) -> list[dict[str, object]]:
    issues: list[dict[str, object]] = []
    topology_path = public / "static/graph-data/topology.json"
    slug_map_path = public / "static/graphSlugMap.json"
    if not topology_path.is_file() or not slug_map_path.is_file():
        return [{"reason": "missing_graph_identity_artifact"}]

    topology = json.loads(topology_path.read_text(encoding="utf-8"))
    slug_map = json.loads(slug_map_path.read_text(encoding="utf-8"))
    public_to_graph = slug_map.get("publicToGraph") or {}
    collisions = slug_map.get("collisions") or {}
    aliases = slug_map.get("aliases") or {}
    topology_slugs = {str(node.get("slug") or "") for node in topology.get("nodes") or []}

    def canonical_graph_slug(value: str) -> str:
        mapped = public_to_graph.get(value) or aliases.get(value) or value
        return aliases.get(mapped) or mapped

    for page in public.glob("objektai/**/index.html"):
        if "objektai/saltiniai/" in page.as_posix():
            continue
        html = page.read_text(encoding="utf-8", errors="ignore")
        if 'data-object-map-cta="true"' not in html:
            continue
        graph_match = re.search(r'data-object-slug="([^"]+)"', html)
        public_match = re.search(r'data-public-object-slug="([^"]+)"', html)
        rel = str(page.relative_to(public))
        if not graph_match or not public_match:
            issues.append({"path": rel, "reason": "missing_object_graph_identity"})
            continue
        page_graph_slug = unicodedata.normalize("NFC", html_lib.unescape(graph_match.group(1)))
        page_public_slug = unicodedata.normalize("NFC", html_lib.unescape(public_match.group(1)))
        canonical_slug = canonical_graph_slug(page_graph_slug)
        if canonical_slug not in topology_slugs:
            issues.append({
                "path": rel,
                "graph_slug": page_graph_slug,
                "canonical_graph_slug": canonical_slug,
                "reason": "object_page_graph_slug_missing_from_topology",
            })
            continue
        public_candidates = collisions.get(page_public_slug) or [canonical_graph_slug(page_public_slug)]
        if canonical_slug not in public_candidates and canonical_graph_slug(page_public_slug) != canonical_slug:
            issues.append({
                "path": rel,
                "graph_slug": canonical_slug,
                "public_slug": page_public_slug,
                "reason": "object_page_public_graph_mapping_mismatch",
            })
    return issues


def run_audit(public: Path, content: Path) -> dict[str, object]:
    buckets = {
        "filename_bytes": audit_filename_bytes(content),
        "media_primary": audit_primary_media(content),
        "claim_html": audit_claim_html(public),
        "graph_identity": audit_graph_identity(public),
    }
    issue_count = sum(len(values) for values in buckets.values())
    return {"schema": "ltkb-public-build-audit/v1", "issue_count": issue_count, "issues": buckets, "status": "failed" if issue_count else "passed"}


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Audit deployable public Quartz build artifacts.")
    parser.add_argument("--public", type=Path, default=Path("public"))
    parser.add_argument("--content", type=Path, default=Path("."))
    parser.add_argument("--fail", action="store_true")
    parser.add_argument("--status-json", type=Path)
    args = parser.parse_args(list(argv) if argv is not None else None)
    result = run_audit(args.public, args.content)
    if args.status_json:
        args.status_json.parent.mkdir(parents=True, exist_ok=True)
        args.status_json.write_text(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 1 if args.fail and result["status"] == "failed" else 0


if __name__ == "__main__":
    raise SystemExit(main())
