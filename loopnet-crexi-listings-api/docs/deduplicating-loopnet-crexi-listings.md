# How to deduplicate LoopNet and Crexi listings

The same commercial property can appear on both LoopNet and Crexi. A raw export from both portals often creates a spreadsheet with duplicate addresses, slightly different titles, different broker fields, and inconsistent financial metadata.

For first-pass deal flow, that duplicate cleanup is usually the real tax.

## Practical dedup strategy

The actor deduplicates by comparing normalized property signals:

- street address
- city and state
- latitude and longitude when available
- building size
- asset class
- listing source ID
- listing URL

The output keeps one primary row and marks the other platform in:

- `also_listed_on`
- `is_cross_listed`

Example:

```json
{
  "source": "crexi",
  "address": "1234 Example Blvd, Dallas, TX 75201",
  "also_listed_on": ["loopnet"],
  "is_cross_listed": "yes"
}
```

## Why this matters

Without deduplication, a team may think there are 1,000 listings when 150 of them are the same properties repeated across platforms.

With deduplication, the file becomes easier to scan:

- one row per likely property
- source provenance preserved
- broker fields kept when available
- cap-rate fields normalized in one schema

Run it here:

https://apify.com/kazkn/commercial-real-estate-brokerage-intel?fpr=8fp2od
