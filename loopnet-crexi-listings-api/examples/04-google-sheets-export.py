#!/usr/bin/env python3
"""
Create a Google Sheets-ready CSV from a CRE market scan.

The actor already exports CSV/XLSX from Apify Storage. This example is useful
when you want to control column order before uploading to Sheets or a CRM.
"""

import csv
import os
from apify_client import ApifyClient


TOKEN = os.environ.get("APIFY_TOKEN")
if not TOKEN:
    raise SystemExit("APIFY_TOKEN env var required")

client = ApifyClient(TOKEN)

run_input = {
    "city": "Austin",
    "state": "TX",
    "sourcesEnabled": ["loopnet", "crexi"],
    "transactionTypes": ["sale"],
    "assetClasses": ["office", "retail", "industrial"],
    "maxResultsPerSource": 250,
    "deduplicate": True,
    "normalizeCapRate": True,
    "includeListingDetails": True,
}

run = client.actor("kazkn/commercial-real-estate-brokerage-intel").call(
    run_input=run_input
)
items = client.dataset(run["defaultDatasetId"]).list_items().items

columns = [
    "address",
    "source",
    "transaction_type",
    "asset_class",
    "asking_amount_usd",
    "building_size_sqft",
    "price_per_sqft",
    "cap_rate",
    "days_on_market",
    "broker_name",
    "broker_company",
    "broker_phone",
    "broker_email",
    "listing_url",
    "also_listed_on",
    "is_cross_listed",
]

with open("cre_google_sheets_export.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(items)

print(f"Saved cre_google_sheets_export.csv with {len(items)} rows")
