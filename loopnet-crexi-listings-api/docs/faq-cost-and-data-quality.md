# Cost, data quality, and what this actor is not

This actor is built for a specific job: turning public LoopNet and Crexi listing searches into a clean first-pass market file.

It is not a full enterprise CRE platform. That honesty matters because brokers, analysts, and developers can immediately tell when a tool is pretending to be bigger than it is.

## What it is good for

- public on-market listing scans
- LoopNet + Crexi aggregation
- CSV, JSON, Excel, and API workflows
- deduplicated first-pass deal lists
- cap-rate normalization
- days-on-market when available
- broker name and company extraction
- broker phone/email when publicly exposed
- daily monitoring for new listings

## What it is not

- a full CoStar replacement
- a private comp database
- an ownership database
- a lease comp database
- a guaranteed broker email finder
- a substitute for human underwriting

## Cost model

The actor is usage-based, with lower unit prices on higher Apify plans:

- from $0.05 per actor start
- from $5.00 per 1,000 returned listings
- from $5.00 per 1,000 detail-enriched listings
- from $0.001 per monitoring-enabled run

That makes it useful for teams that need affordable first-pass scans without committing to a large subscription just to export public listing data.

Check the live Actor [Pricing tab](https://apify.com/kazkn/commercial-real-estate-brokerage-intel/pricing?fpr=8fp2od) for the exact price attached to your plan.

## Data completeness

Public listing sites expose uneven data. One listing may have cap rate and broker contact fields. Another may only expose address, price, asset class, and URL.

The actor keeps unavailable values explicit in the public dataset rather than
inventing them. Useful review fields include:

- `cap_rate`
- `noi`
- `days_on_market`
- `broker_phone`
- `broker_email`

Run the actor:

https://apify.com/kazkn/commercial-real-estate-brokerage-intel?fpr=8fp2od
