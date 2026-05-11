import { XMLParser } from 'fast-xml-parser';

const RSS_URL = 'https://cloud.mave.digital/54964';

export type Episode = {
  guid: string;
  title: string;
  description: string;
  publishDate: Date;
  durationSec: number;
  season: number;
  episodeNumber: number;
  imageUrl: string;
  audioUrl: string;
};

function parseDuration(raw: string | number | undefined): number {
  if (!raw) return 0;
  if (typeof raw === 'number') return raw;
  const parts = String(raw).split(':').map(Number);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function normalizeImageUrl(href: string): string {
  if (!href) return '';
  let url = href.startsWith('http') ? href : `https://cdn.mave.digital/${href}`;
  // Use _600 thumbnail if not already sized
  if (url.includes('cdn.mave.digital') && !/_\d+\.[a-z]+$/.test(url)) {
    url = url.replace(/(\.[^./]+)$/, '_600$1');
  }
  return url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractGuid(raw: any): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') return raw['#text'] ?? raw['_'] ?? String(raw);
  return String(raw);
}

export async function getEpisodes(): Promise<Episode[]> {
  const res = await fetch(RSS_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  });

  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed: any = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const arr: unknown[] = Array.isArray(items) ? items : [items];

  return (arr as Record<string, unknown>[]).map((item) => ({
    guid: extractGuid(item.guid),
    title: String(item.title ?? ''),
    description: String(item['content:encoded'] ?? item.description ?? ''),
    publishDate: new Date(String(item.pubDate ?? '')),
    durationSec: parseDuration(item['itunes:duration'] as string | number),
    season: Number(item['itunes:season'] ?? 0),
    episodeNumber: Number(item['itunes:episode'] ?? 0),
    imageUrl: normalizeImageUrl(
      ((item['itunes:image'] as Record<string, unknown>)?.['@_href'] as string) ?? ''
    ),
    audioUrl: String((item.enclosure as Record<string, unknown>)?.['@_url'] ?? ''),
  }));
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function generateSlug(ep: Episode): string {
  if (ep.season > 0 && ep.episodeNumber > 0) return `s${ep.season}ep${ep.episodeNumber}`;
  if (ep.episodeNumber > 0) return String(ep.episodeNumber);
  return ep.guid.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 16) || 'ep';
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const episodes = await getEpisodes();
  return episodes.find(ep => generateSlug(ep) === slug) ?? null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
