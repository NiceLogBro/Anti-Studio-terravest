#!/usr/bin/env node
/**
 * Daily monitoring example.
 *
 * This input is intended for an Apify Schedule. The first run creates a
 * snapshot. Later runs emit listings that were not seen before for the same
 * query shape.
 *
 * Usage:
 *   export APIFY_TOKEN=<YOUR_APIFY_TOKEN>
 *   node examples/03-node-daily-monitoring.mjs
 */

import { ApifyClient } from "apify-client";

const token = process.env.APIFY_TOKEN;
if (!token) {
  console.error("APIFY_TOKEN env var required");
  process.exit(1);
}

const client = new ApifyClient({ token });

const run = await client.actor("kazkn/commercial-real-estate-brokerage-intel").call({
  city: "Phoenix",
  state: "AZ",
  sourcesEnabled: ["loopnet", "crexi"],
  transactionTypes: ["sale"],
  assetClasses: ["office", "industrial"],
  maxResultsPerSource: 1000,
  monitoringMode: true,
  deduplicate: true,
  normalizeCapRate: true,
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`New listings in this monitoring run: ${items.length}`);
for (const item of items.slice(0, 10)) {
  console.log(
    `${item.source} | ${item.address ?? "unknown address"} | ${item.asset_class ?? ""} | ${item.listing_url}`,
  );
}
