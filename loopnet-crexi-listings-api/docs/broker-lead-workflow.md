# Broker lead workflow from public CRE listings

Broker lead research is one of the most useful workflows for public commercial real estate listing data.

The goal is not to spam every contact. The goal is to build a cleaner review file:

- which property is listed
- which brokerage is attached
- which broker name is public
- whether phone or email is publicly exposed
- which market and asset class the broker is active in

## Recommended input

```json
{
  "city": "Austin",
  "state": "TX",
  "sourcesEnabled": ["loopnet", "crexi"],
  "transactionTypes": ["sale"],
  "assetClasses": ["office", "retail", "industrial"],
  "maxResultsPerSource": 500,
  "includeListingDetails": true,
  "deduplicate": true,
  "normalizeCapRate": true
}
```

## Important limitation

Broker phone and email are best-effort. The actor only returns contact fields when LoopNet or Crexi publicly exposes them. It does not infer, guess, or fabricate emails.

The most reliable broker fields are usually:

- `broker_name`
- `broker_company`
- `listing_url`
- `source`

The more variable fields are:

- `broker_phone`
- `broker_email`

## Review file columns

For outreach review, start with:

```text
broker_name
broker_company
broker_phone
broker_email
address
asset_class
asking_amount_usd
cap_rate
days_on_market
listing_url
source
broker_profile_url
```

See [`../examples/05-broker-lead-list.py`](../examples/05-broker-lead-list.py).
