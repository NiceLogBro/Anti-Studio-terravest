# Examples

Ready-to-use snippets for the Commercial Real Estate Brokerage Intel Apify Actor.

| File | Use case | Stack |
|---|---|---|
| [`01-curl-quickstart.sh`](./01-curl-quickstart.sh) | Run a small LoopNet + Crexi market scan from the terminal | Bash |
| [`02-python-market-scan.py`](./02-python-market-scan.py) | Run the actor and export a CSV market file | Python |
| [`03-node-daily-monitoring.mjs`](./03-node-daily-monitoring.mjs) | Daily monitoring workflow for new public listings | Node.js |
| [`04-google-sheets-export.py`](./04-google-sheets-export.py) | Create a clean Google Sheets-ready CSV | Python |
| [`05-broker-lead-list.py`](./05-broker-lead-list.py) | Build a broker lead review file from enriched results | Python |
| [`input-austin-sale.json`](./input-austin-sale.json) | Austin sale scan example | JSON |
| [`input-dallas-monitoring.json`](./input-dallas-monitoring.json) | Dallas monitoring example | JSON |
| [`input-phoenix-lease.json`](./input-phoenix-lease.json) | Phoenix lease scan example | JSON |

## Prerequisites

Get an Apify token from:

https://console.apify.com/account#/integrations

Then set it in your shell:

```bash
export APIFY_TOKEN=<YOUR_APIFY_TOKEN>
```

For Python examples:

```bash
pip install apify-client
```

For Node.js examples:

```bash
npm install apify-client
```

## Actor

Run the actor on Apify:

https://apify.com/kazkn/commercial-real-estate-brokerage-intel?fpr=8fp2od
