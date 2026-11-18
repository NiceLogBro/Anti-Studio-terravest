#!/usr/bin/env bash
set -euo pipefail

# LoopNet + Crexi Listings API - cURL quickstart.
# Usage:
#   export APIFY_TOKEN=<YOUR_APIFY_TOKEN>
#   bash examples/01-curl-quickstart.sh

if [ -z "${APIFY_TOKEN:-}" ]; then
  echo "APIFY_TOKEN env var required" >&2
  exit 1
fi

curl -sS -X POST "https://api.apify.com/v2/acts/kazkn~commercial-real-estate-brokerage-intel/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Austin",
    "state": "TX",
    "sourcesEnabled": ["loopnet", "crexi"],
    "transactionTypes": ["sale"],
    "assetClasses": ["office", "retail"],
    "maxResultsPerSource": 50,
    "deduplicate": true,
    "normalizeCapRate": true,
    "includeListingDetails": false
  }'
