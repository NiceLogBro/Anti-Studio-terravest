#!/usr/bin/env python3
"""
Run a LoopNet + Crexi commercial real estate market scan and export CSV.

Usage:
    export APIFY_TOKEN=<YOUR_APIFY_TOKEN>
    python examples/02-python-market-scan.py
"""

import csv
import os
from apify_client import ApifyClient


TOKEN = os.environ.get("APIFY_TOKEN")
if not TOKEN:
    raise SystemExit("APIFY_TOKEN env var required")

client = ApifyClient(TOKEN)

run_input = {
    "city": "Dallas",
    "state": "TX",
    "sourcesEnabled": ["loopnet", "crexi"],
    "transactionTypes": ["sale"],
    "assetClasses": ["office", "retail", "industrial"],
    "priceMin": 500000,
    "priceMax": 10000000,
    "maxResultsPerSource": 500,
    "deduplicate": True,
    "normalizeCapRate": True,
    "includeListingDetails": False,
}

print("Running Commercial Real Estate Brokerage Intel...")
run = client.actor("kazkn/commercial-real-estate-brokerage-intel").call(
    run_input=run_input
)

items = client.dataset(run["defaultDatasetId"]).list_items().items
print(f"Fetched {len(items)} listings")

columns = [
    "source",
    "transaction_type",
    "listing_url",
    "address",
    "asset_class",
    "asking_amount_usd",
    "building_size_sqft",
    "cap_rate",
    "days_on_market",
    "broker_name",
    "broker_company",
    "also_listed_on",
    "is_cross_listed",
]

with open("cre_market_scan.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(items)

print("Saved cre_market_scan.csv")
