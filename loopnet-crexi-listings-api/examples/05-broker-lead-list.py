#!/usr/bin/env python3
"""
Build a broker lead review file from detail-enriched CRE listing rows.

The actor only fills phone/email when the source publicly exposes them. This
script keeps rows with at least a broker name or company, then sorts by market
usefulness for manual review.
"""

import csv
import os
from apify_client import ApifyClient


TOKEN = os.environ.get("APIFY_TOKEN")
if not TOKEN:
    raise SystemExit("APIFY_TOKEN env var required")

client = ApifyClient(TOKEN)

run_input = {
    "city": "Miami",
    "state": "FL",
    "sourcesEnabled": ["loopnet", "crexi"],
    "transactionTypes": ["sale"],
    "assetClasses": ["retail", "office", "industrial"],
    "maxResultsPerSource": 500,
    "includeListingDetails": True,
    "deduplicate": True,
    "normalizeCapRate": True,
}

run = client.actor("kazkn/commercial-real-estate-brokerage-intel").call(
    run_input=run_input
)
items = client.dataset(run["defaultDatasetId"]).list_items().items

leads = [
    row
    for row in items
    if row.get("broker_name") or row.get("broker_company")
]

leads.sort(
    key=lambda row: (
        not bool(row.get("broker_email") or row.get("broker_phone")),
        row.get("broker_company") or "",
        row.get("broker_name") or "",
    )
)

columns = [
    "broker_name",
    "broker_company",
    "broker_phone",
    "broker_email",
    "address",
    "asset_class",
    "asking_amount_usd",
    "cap_rate",
    "days_on_market",
    "listing_url",
    "source",
    "broker_profile_url",
]

with open("cre_broker_leads.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(leads)

print(f"Saved cre_broker_leads.csv with {len(leads)} broker-linked rows")
