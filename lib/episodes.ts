import { XMLParser } from 'fast-xml-parser';

import { RSS_URL } from '@/lib/site';

export { RSS_URL };

export type Episode = {
  guid: string;
  slug: string;
  title: string;
  description: string;
  publishDate: Date;
  durationSec: number;
  season: number;
  episodeNumber: number;
  imageUrl: string;
  audioUrl: string;
};

type RawEpisode = Omit<Episode, 'slug'>;

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

function parsePublishDate(raw: string | undefined): Date {
  const d = new Date(String(raw ?? ''));
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime()) && date.getTime() !== 0;
}

export function safeToISOString(date: Date): string | undefined {
  if (!isValidDate(date)) return undefined;
  return date.toISOString();
}

function baseSlug(ep: RawEpisode): string {
  if (ep.season > 0 && ep.episodeNumber > 0)
    return `s${ep.season}ep${ep.episodeNumber}`;
  if (ep.episodeNumber > 0) return String(ep.episodeNumber);
  return (
    ep.guid
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase()
      .slice(0, 16) || 'ep'
  );
}

function guidSuffix(guid: string): string {
  return (
    guid
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase()
      .slice(0, 8) || 'ep'
  );
}

function assignSlugs(episodes: RawEpisode[]): Episode[] {
  const groups = new Map<string, RawEpisode[]>();
  for (const ep of episodes) {
    const base = baseSlug(ep);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base)!.push(ep);
  }

  const slugByGuid = new Map<string, string>();
  for (const [base, eps] of groups) {
    if (eps.length === 1) {
      slugByGuid.set(eps[0].guid, base);
      continue;
    }
    const sorted = [...eps].sort(
      (a, b) => a.publishDate.getTime() - b.publishDate.getTime(),
    );
    sorted.forEach((ep, i) => {
      slugByGuid.set(
        ep.guid,
        i === 0 ? base : `${base}-${guidSuffix(ep.guid)}`,
      );
    });
  }

  return episodes.map((ep) => ({
    ...ep,
    slug: slugByGuid.get(ep.guid) ?? baseSlug(ep),
  }));
}

function parseEpisodesFromXml(xml: string): Episode[] {
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

  const raw = (arr as Record<string, unknown>[]).map((item) => ({
    guid: extractGuid(item.guid),
    title: String(item.title ?? ''),
    description: String(item['content:encoded'] ?? item.description ?? ''),
    publishDate: parsePublishDate(String(item.pubDate ?? '')),
    durationSec: parseDuration(item['itunes:duration'] as string | number),
    season: Number(item['itunes:season'] ?? 0),
    episodeNumber: Number(item['itunes:episode'] ?? 0),
    imageUrl: normalizeImageUrl(
      ((item['itunes:image'] as Record<string, unknown>)?.[
        '@_href'
      ] as string) ?? '',
    ),
    audioUrl: String(
      (item.enclosure as Record<string, unknown>)?.['@_url'] ?? '',
    ),
  }));

  return assignSlugs(raw);
}

export async function getEpisodes(): Promise<Episode[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    });

    if (!res.ok) {
      console.error(`RSS fetch failed: ${res.status}`);
      return [];
    }

    const xml = await res.text();
    return parseEpisodesFromXml(xml);
  } catch (err) {
    console.error('RSS fetch error:', err);
    return [];
  }
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  if (!isValidDate(date)) return '';
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** @deprecated Prefer `episode.slug`. */
export function generateSlug(ep: Episode): string {
  return ep.slug;
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.slug === slug) ?? null;
}

/** Эпизоды по дате публикации: от старых к новым (для prev/next на странице выпуска). */
export function sortEpisodesChronologically(episodes: Episode[]): Episode[] {
  return [...episodes].sort(
    (a, b) => a.publishDate.getTime() - b.publishDate.getTime(),
  );
}

export function getEpisodeNeighbors(
  episodes: Episode[],
  slug: string,
): { prev: Episode | null; next: Episode | null } {
  const sorted = sortEpisodesChronologically(episodes);
  const index = sorted.findIndex((ep) => ep.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
