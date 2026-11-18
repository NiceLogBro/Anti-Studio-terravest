# Build a daily CRE deal flow dashboard

A useful CRE dashboard does not need to start with a large software project. A simple daily workflow can be:

1. Run a saved LoopNet + Crexi market scan on Apify.
2. Export new listings to Google Sheets or a database.
3. Filter by market, asset class, price, cap rate, and days on market.
4. Review only the listings that are new or materially changed.

## Recommended actor input

```json
{
  "city": "Dallas",
  "state": "TX",
  "sourcesEnabled": ["loopnet", "crexi"],
  "transactionTypes": ["sale"],
  "assetClasses": ["office", "retail", "industrial"],
  "maxResultsPerSource": 1000,
  "monitoringMode": true,
  "deduplicate": true,
  "normalizeCapRate": true
}
```

## Useful dashboard columns

- `scraped_at`
- `source`
- `listing_url`
- `address`
- `asset_class`
- `asking_amount_usd`
- `building_size_sqft`
- `price_per_sqft`
- `cap_rate`
- `days_on_market`
- `broker_name`
- `broker_company`
- `also_listed_on`
- `is_cross_listed`

## Where to send the data

Apify can export to:

- Google Sheets
- Airtable
- Make
- Zapier
- Webhooks
- BigQuery
- S3
- your own API

Actor page:

https://apify.com/kazkn/commercial-real-estate-brokerage-intel?fpr=8fp2od
