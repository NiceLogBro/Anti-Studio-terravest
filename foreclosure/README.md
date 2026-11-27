# Foreclosure public-notice collector

This is a separate, small Express service for collecting notices from **operator-configured public RSS, Atom, or JSON feeds** and displaying source-linked results. It does not claim nationwide completeness and does not crawl arbitrary sites, bypass access controls, or use sample listings.

## Run locally

```sh
npm install
cp .env.example .env
# Set FORECLOSURE_ADMIN_TOKEN to a long random secret in .env
npm run foreclosure
```

Open `http://localhost:3001`. Configure `FORECLOSURE_PORT` to change the port. The app writes `foreclosure/notices.json` locally; that file is runtime data and should not be committed or deployed as a durable database. For production, put the service behind HTTPS and replace the JSON store with durable storage such as Firestore or a relational database.

## Configure a source

Edit `foreclosure/sources.json` and add a feed only after checking that the source is public, its terms permit retrieval/republication, and the URL is a machine-readable RSS/Atom/JSON feed. Keep requests low-volume; the collector fetches each configured source once per manual refresh and limits response size, time, redirects, and item count.

```json
{
  "sources": [
    {
      "id": "example-county-notices",
      "name": "Example County public notices",
      "url": "https://county.example.gov/public-notices/feed.xml",
      "state": "TX",
      "county": "Example County",
      "jurisdictionUrl": "https://county.example.gov/",
      "enabled": true,
      "termsReviewed": true
    }
  ]
}
```

The example URL is illustrative and must be replaced with a real feed. The repository intentionally ships with an empty registry, so it will return zero records until an operator configures sources. Many county sites do not offer feeds; this collector does not pretend to support those sources without a documented, permitted adapter.

## Refresh and API

Manual refresh is `POST /api/refresh` with `Authorization: Bearer <FORECLOSURE_ADMIN_TOKEN>`. No secret means refresh is disabled. Read-only endpoints are `GET /api/notices`, `GET /api/sources`, and `GET /api/health`. Search parameters: `state`, `county`, `q`, and `status`.

The server parses RSS/Atom XML and JSON Feed-like records. It preserves source links, dates, source metadata, and first/last-seen times, and deduplicates items. A sale date is only extracted from explicit “sale date/on/scheduled for” text; it is **not** a legal determination. Status labels say “upcoming date found,” “past date found,” or “date not found”—never “verified active.” A notice without a parsed sale date remains searchable and must be verified manually.

## Important constraints

- There is no universal official U.S. foreclosure feed; full coverage requires source-by-source onboarding and monitoring.
- Coverage is exactly the configured feeds, not all counties or all public sources.
- Always link to and verify the originating public record. Feed retention, republication, privacy, and copyright rules vary by jurisdiction/source.
- Do not configure login-protected sources, defeat CAPTCHAs, evade rate limits, or republish restricted data.
- This tool is informational, not legal advice; it cannot confirm cancellations, postponements, redemption status, title, or parcel identity.
- The current JSON file store is suitable only for local prototypes/single instances. It is not safe for concurrent multi-instance production use or durable deployment.
