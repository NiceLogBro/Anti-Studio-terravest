#!/usr/bin/env python3
"""Validate the public CRE integration hub without network access."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ACTOR_BASE = "https://apify.com/kazkn/commercial-real-estate-brokerage-intel"
REFERRAL = "?fpr=8fp2od"
PAGES_URL = "https://boo-n.github.io/loopnet-crexi-listings-api/"
SOCIAL_IMAGE_URL = (
    "https://raw.githubusercontent.com/Boo-n/loopnet-crexi-listings-api/"
    "main/assets/cre-market-file-workflow-final.png"
)

PUBLIC_FIELDS = {
    "address",
    "also_listed_on",
    "asking_amount_usd",
    "asking_price_or_rent",
    "asset_class",
    "broker_company",
    "broker_company_website",
    "broker_email",
    "broker_license_numbers",
    "broker_name",
    "broker_phone",
    "broker_profile_url",
    "building_size_sqft",
    "cap_rate",
    "change_detected_at",
    "change_type",
    "city",
    "country",
    "currency",
    "days_on_market",
    "estimated_annual_rent",
    "estimated_monthly_rent",
    "first_seen_at",
    "is_cross_listed",
    "last_seen_at",
    "listing_url",
    "lot_size_acres",
    "lot_size_sqft",
    "market",
    "noi",
    "previous_asking_amount_usd",
    "previous_status",
    "price_per_sqft",
    "price_per_unit",
    "rent_per_sqft_per_year",
    "scraped_at",
    "source",
    "source_listing_id",
    "state",
    "status",
    "sub_type",
    "total_available_sqft",
    "transaction_type",
    "units",
    "year_built",
    "zip",
}

DEPRECATED_FIELDS = {
    "address_full",
    "asking_price_usd",
    "cap_rate_normalized",
    "cap_rate_source",
    "enrichment_status",
    "noi_source",
    "noi_usd",
    "sqft",
}

TEXT_GLOBS = ("*.md", "*.py", "*.mjs", "*.html")


def public_text_files() -> list[Path]:
    files: list[Path] = []
    for pattern in TEXT_GLOBS:
        files.extend(ROOT.rglob(pattern))
    return sorted(
        path
        for path in files
        if ".git" not in path.parts and path.resolve() != Path(__file__).resolve()
    )


def validate_readme() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    required = (
        "# LoopNet Scraper + Crexi Scraper API Examples",
        "does not contain the private Actor source code",
        "assets/cre-market-file-workflow-final.png",
        "## LoopNet scraper API example",
        "## Crexi scraper API example",
    )
    missing = [value for value in required if value not in readme]
    assert not missing, f"README is missing required discovery copy: {missing}"

    actor_links = (
        f"{ACTOR_BASE}/input-schema{REFERRAL}",
        f"{ACTOR_BASE}/output-schema{REFERRAL}",
        f"{ACTOR_BASE}/pricing{REFERRAL}",
        f"{ACTOR_BASE}/api/python{REFERRAL}",
        f"{ACTOR_BASE}/examples{REFERRAL}",
        f"{ACTOR_BASE}/issues/open{REFERRAL}",
    )
    missing_actor_links = [value for value in actor_links if value not in readme]
    assert not missing_actor_links, (
        f"README is missing useful Apify Actor links: {missing_actor_links}"
    )
    assert "enrichment status" not in readme.lower(), (
        "README must not promise the deprecated enrichment status field"
    )

    deep_link_pattern = re.compile(
        rf"{re.escape(ACTOR_BASE)}/"
        r"(?:input-schema|output-schema|pricing|api/python|examples|issues/open)"
        rf"(?!{re.escape(REFERRAL)})"
    )
    deep_link_files = (
        ROOT / "README.md",
        ROOT / "docs" / "faq-cost-and-data-quality.md",
        ROOT / "index.html",
    )
    plain_deep_links = [
        str(path.relative_to(ROOT))
        for path in deep_link_files
        if deep_link_pattern.search(path.read_text(encoding="utf-8"))
    ]
    assert not plain_deep_links, (
        f"Unaffiliated Apify deep links remain in: {plain_deep_links}"
    )


def validate_pages_discovery() -> None:
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    required_meta = (
        f'<link rel="canonical" href="{PAGES_URL}">',
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="LoopNet Scraper + Crexi Scraper API Examples">',
        f'<meta property="og:url" content="{PAGES_URL}">',
        f'<meta property="og:image" content="{SOCIAL_IMAGE_URL}">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<script type="application/ld+json">',
    )
    missing_meta = [value for value in required_meta if value not in page]
    assert not missing_meta, f"GitHub Pages is missing discovery metadata: {missing_meta}"

    json_ld_match = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        page,
        re.DOTALL,
    )
    assert json_ld_match, "GitHub Pages JSON-LD is missing"
    json_ld = json.loads(json_ld_match.group(1))
    assert json_ld["@context"] == "https://schema.org"
    assert json_ld["@type"] == "SoftwareApplication"
    assert json_ld["url"] == PAGES_URL
    assert ACTOR_BASE in json_ld["sameAs"]
    assert "aggregateRating" not in json_ld
    assert "offers" not in json_ld

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    assert "User-agent: *" in robots
    assert "Allow: /" in robots
    assert f"Sitemap: {PAGES_URL}sitemap.xml" in robots

    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    assert f"<loc>{PAGES_URL}</loc>" in sitemap


def validate_deprecated_fields() -> None:
    violations: list[str] = []
    for path in public_text_files():
        content = path.read_text(encoding="utf-8")
        for field in sorted(DEPRECATED_FIELDS):
            pattern = rf"(?<![A-Za-z0-9_]){re.escape(field)}(?![A-Za-z0-9_])"
            if re.search(pattern, content):
                violations.append(f"{path.relative_to(ROOT)}: {field}")
    assert not violations, "Deprecated public fields remain:\n" + "\n".join(violations)


def validate_samples() -> None:
    json_path = ROOT / "sample-data" / "example-output.json"
    rows = json.loads(json_path.read_text(encoding="utf-8"))
    assert isinstance(rows, list) and rows, "JSON sample must contain rows"
    json_fields = {key for row in rows for key in row}
    unknown_json = json_fields - PUBLIC_FIELDS
    assert not unknown_json, f"Unknown JSON sample fields: {sorted(unknown_json)}"
    invalid_cells = [
        f"row {index}: {key}"
        for index, row in enumerate(rows, start=1)
        for key, value in row.items()
        if value is None or isinstance(value, (list, dict))
    ]
    assert not invalid_cells, (
        "JSON sample cells must match the flat public dataset contract:\n"
        + "\n".join(invalid_cells)
    )
    assert rows[1]["cap_rate"] == "not public"
    assert rows[1]["noi"] == "not public"

    csv_path = ROOT / "sample-data" / "dallas-market-file-sample.csv"
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        assert reader.fieldnames, "CSV sample must contain a header"
        unknown_csv = set(reader.fieldnames) - PUBLIC_FIELDS
        assert not unknown_csv, f"Unknown CSV sample fields: {sorted(unknown_csv)}"
        csv_rows = list(reader)
        assert csv_rows, "CSV sample must contain at least one row"
        assert csv_rows[1]["cap_rate"] == "not public"
        assert csv_rows[1]["noi"] == "not public"


def validate_asset() -> None:
    asset = ROOT / "assets" / "cre-market-file-workflow-final.png"
    assert asset.is_file() and asset.stat().st_size > 0, "Final README asset is missing"


def main() -> None:
    validate_readme()
    validate_pages_discovery()
    validate_deprecated_fields()
    validate_samples()
    validate_asset()
    print("Public hub validation passed.")


if __name__ == "__main__":
    main()
