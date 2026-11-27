import express, { Request, Response } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.FORECLOSURE_PORT || 3001);
const dataFile = path.join(__dirname, 'notices.json');
const sourcesFile = path.join(__dirname, 'sources.json');
const MAX_FEED_BYTES = 2 * 1024 * 1024;
const MAX_ITEMS_PER_FEED = 500;
const FETCH_TIMEOUT_MS = 15_000;

interface Source {
  id: string;
  name: string;
  url: string;
  state: string;
  county: string;
  jurisdictionUrl?: string;
  enabled: boolean;
  termsReviewed: boolean;
}
interface Notice {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  jurisdictionUrl?: string;
  state: string;
  county: string;
  publishedAt?: string;
  saleDate?: string;
  status: 'upcoming-date-found' | 'past-date-found' | 'date-not-found';
  firstSeenAt: string;
  lastSeenAt: string;
  noticeLink?: string;
}
interface CollectorState {
  notices: Notice[];
  lastRefreshAt?: string;
  sourceResults: Array<{ sourceId: string; sourceName: string; fetchedAt: string; count: number; error?: string }>;
}

app.use(express.json({ limit: '32kb' }));
app.use(express.static(__dirname));

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, ' ').trim();
}
function tag(block: string, names: string[]): string {
  for (const name of names) {
    const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}\\s*>`, 'i');
    const m = block.match(re);
    if (m) return decodeEntities(m[1]);
  }
  return '';
}
function parseFeed(body: string, source: Source, fetchedAt: string): Notice[] {
  const trimmed = body.trim();
  const rawItems: Array<{ title: string; summary: string; link: string; published: string }> = [];
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    const items = Array.isArray(parsed) ? parsed : parsed.items || parsed.notices || parsed.results || [];
    for (const item of items.slice(0, MAX_ITEMS_PER_FEED)) {
      rawItems.push({
        title: String(item.title || item.name || ''),
        summary: String(item.summary || item.description || item.content_text || ''),
        link: String(item.url || item.external_url || item.link || ''),
        published: String(item.date_published || item.publishedAt || item.pubDate || item.date || '')
      });
    }
  } else {
    const matches = [...trimmed.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi)].slice(0, MAX_ITEMS_PER_FEED);
    for (const [, type, block] of matches) {
      const title = tag(block, ['title']);
      const summary = tag(block, ['description', 'summary', 'content:encoded', 'content']);
      let link = tag(block, ['link', 'guid', 'id']);
      const atomLink = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
      if (atomLink) link = decodeEntities(atomLink[1]);
      const published = tag(block, ['pubDate', 'published', 'updated', 'dc:date', 'date']);
      if (title || summary) rawItems.push({ title, summary, link, published });
    }
  }

  const now = new Date(fetchedAt);
  return rawItems.filter((item) => item.title || item.summary).map((item) => {
    const canonicalLink = safeHttpUrl(item.link) ? new URL(item.link, source.url).toString() : undefined;
    const publishedDate = validDate(item.published);
    const saleDate = extractSaleDate(`${item.title}. ${item.summary}`, now);
    const dedupeKey = `${source.id}|${canonicalLink || item.title}|${item.title}`.toLowerCase();
    return {
      id: createHash('sha256').update(dedupeKey).digest('hex').slice(0, 24),
      title: item.title || 'Public notice (title not provided)',
      summary: item.summary.slice(0, 1800),
      sourceName: source.name,
      sourceUrl: source.url,
      jurisdictionUrl: source.jurisdictionUrl,
      state: source.state.toUpperCase(),
      county: source.county,
      publishedAt: publishedDate,
      saleDate: saleDate?.toISOString(),
      status: saleDate ? (saleDate.getTime() >= now.getTime() ? 'upcoming-date-found' : 'past-date-found') : 'date-not-found',
      firstSeenAt: fetchedAt,
      lastSeenAt: fetchedAt,
      noticeLink: canonicalLink
    };
  });
}
function safeHttpUrl(value: string): boolean {
  try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
}
function validDate(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
function extractSaleDate(text: string, now: Date): Date | undefined {
  const patterns = [
    /(?:sale|auction|foreclosure)\s*(?:date|on|scheduled for|to be held)\s*[:\-]?\s*(\w+\s+\d{1,2},?\s+20\d{2})/i,
    /(?:sale|auction|foreclosure)\s*(?:date|on|scheduled for|to be held)\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]20\d{2})/i,
    /(?:sale|auction)\s*(?:date|on|scheduled for|to be held)\s*[:\-]?\s*(20\d{2}-\d{2}-\d{2})/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = new Date(match[1]);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  // Deliberately do not infer a sale date from arbitrary dates in a notice.
  void now;
  return undefined;
}
function isUnsafeHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') ||
    host === '127.0.0.1' || host === '::1' || host.startsWith('10.') || host.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host === '0.0.0.0';
}
async function fetchFeed(urlText: string): Promise<string> {
  let url = new URL(urlText);
  if (!['https:', 'http:'].includes(url.protocol) || isUnsafeHostname(url.hostname)) throw new Error('Source URL must be a public HTTP(S) URL.');
  for (let redirects = 0; redirects <= 3; redirects++) {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'TerraYieldPublicNoticeCollector/1.0 (+operator-configured public notices)', 'Accept': 'application/rss+xml, application/atom+xml, application/feed+json, application/json, text/xml, text/html;q=0.8' }
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || redirects === 3) throw new Error('Too many or invalid redirects.');
      url = new URL(location, url);
      if (!['https:', 'http:'].includes(url.protocol) || isUnsafeHostname(url.hostname)) throw new Error('Redirect target is not permitted.');
      continue;
    }
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}.`);
    const contentType = response.headers.get('content-type') || '';
    if (!(contentType.includes('xml') || contentType.includes('json') || contentType.includes('text') || contentType.includes('html'))) throw new Error('Unsupported content type. Use an RSS, Atom, or JSON feed.');
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Feed response was empty.');
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_FEED_BYTES) { await reader.cancel(); throw new Error('Feed exceeds 2 MB limit.'); }
      chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
  }
  throw new Error('Unable to fetch feed.');
}
async function loadState(): Promise<CollectorState> {
  try { return JSON.parse(await readFile(dataFile, 'utf8')) as CollectorState; }
  catch { return { notices: [], sourceResults: [] }; }
}
async function saveState(state: CollectorState): Promise<void> {
  const tmp = `${dataFile}.tmp`;
  await writeFile(tmp, JSON.stringify(state, null, 2), 'utf8');
  await rename(tmp, dataFile);
}
async function loadSources(): Promise<Source[]> {
  const parsed = JSON.parse(await readFile(sourcesFile, 'utf8'));
  if (!Array.isArray(parsed.sources)) throw new Error('sources.json must contain a sources array.');
  return parsed.sources.filter((s: Source) => s.enabled && s.termsReviewed && s.id && s.name && s.url && s.state && s.county);
}
function authorized(req: Request): boolean {
  const configured = process.env.FORECLOSURE_ADMIN_TOKEN;
  if (!configured) return false;
  const supplied = (req.header('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(configured); const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

app.get('/api/health', async (_req: Request, res: Response) => {
  const state = await loadState();
  res.json({ ok: true, service: 'public-foreclosure-notice-collector', lastRefreshAt: state.lastRefreshAt || null });
});
app.get('/api/sources', async (_req: Request, res: Response) => {
  const sources = await loadSources();
  res.json({ count: sources.length, sources: sources.map(({ id, name, state, county, jurisdictionUrl }) => ({ id, name, state, county, jurisdictionUrl })) });
});
app.get('/api/notices', async (req: Request, res: Response) => {
  const state = await loadState();
  const stateFilter = String(req.query.state || '').trim().toUpperCase();
  const countyFilter = String(req.query.county || '').trim().toLowerCase();
  const q = String(req.query.q || '').trim().toLowerCase();
  const statusFilter = String(req.query.status || '').trim();
  const notices = state.notices.filter((n) =>
    (!stateFilter || n.state === stateFilter) && (!countyFilter || n.county.toLowerCase().includes(countyFilter)) &&
    (!statusFilter || n.status === statusFilter) && (!q || `${n.title} ${n.summary} ${n.county} ${n.state}`.toLowerCase().includes(q))
  ).sort((a, b) => (b.saleDate || b.lastSeenAt).localeCompare(a.saleDate || a.lastSeenAt));
  res.json({ count: notices.length, notices, lastRefreshAt: state.lastRefreshAt || null, sourceResults: state.sourceResults });
});
app.post('/api/refresh', async (req: Request, res: Response) => {
  if (!authorized(req)) return res.status(401).json({ error: 'Set FORECLOSURE_ADMIN_TOKEN and send it as a Bearer token to refresh sources.' });
  const existing = await loadState();
  const sources = await loadSources();
  const fetchedAt = new Date().toISOString();
  const byId = new Map(existing.notices.map((n) => [n.id, n]));
  const results: CollectorState['sourceResults'] = [];
  for (const source of sources) {
    try {
      const body = await fetchFeed(source.url);
      const parsed = parseFeed(body, source, fetchedAt);
      for (const notice of parsed) {
        const previous = byId.get(notice.id);
        byId.set(notice.id, { ...notice, firstSeenAt: previous?.firstSeenAt || fetchedAt });
      }
      results.push({ sourceId: source.id, sourceName: source.name, fetchedAt, count: parsed.length });
    } catch (error) {
      results.push({ sourceId: source.id, sourceName: source.name, fetchedAt, count: 0, error: error instanceof Error ? error.message : 'Unknown source error' });
    }
  }
  const next: CollectorState = { notices: [...byId.values()].slice(-20_000), lastRefreshAt: fetchedAt, sourceResults: results };
  await saveState(next);
  res.json({ refreshedAt: fetchedAt, configuredSources: sources.length, fetched: results.reduce((sum, item) => sum + item.count, 0), sourceResults: results });
});
app.get('/', (_req: Request, res: Response) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(port, '0.0.0.0', () => console.log(`Foreclosure notice collector listening on port ${port}`));
