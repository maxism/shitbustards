import { unstable_cache } from 'next/cache';

import {
  APPLE_PODCAST_ID,
  PLATFORMS,
  SPOTIFY_SHOW_ID,
  type PlatformId,
} from '@/lib/platforms';

const FETCH_OPTS = {
  next: { revalidate: 3600 },
  headers: { 'User-Agent': 'ShitbustardsBot/1.0 (+https://shitbustards.ru)' },
} as const;

export type PlatformEpisodeLinks = Partial<Record<PlatformId, string>>;

export function normalizeEpisodeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAppleEpisodeLinks(html: string): Map<string, string> {
  const links = new Map<string, string>();
  const re = new RegExp(
    `href="https://podcasts\\.apple\\.com/[^"]*/podcast/([^/]+)/id${APPLE_PODCAST_ID}\\?i=(\\d+)"`,
    'g',
  );

  for (const match of html.matchAll(re)) {
    const slug = match[1];
    const episodeId = match[2];
    if (!slug || !episodeId) continue;

    const title = normalizeEpisodeTitle(
      decodeURIComponent(slug).replace(/-/g, ' '),
    );
    if (!title) continue;

    links.set(
      title,
      `https://podcasts.apple.com/podcast/id${APPLE_PODCAST_ID}?i=${episodeId}`,
    );
  }

  return links;
}

function parseSpotifyEpisodeLinks(html: string): Map<string, string> {
  const links = new Map<string, string>();
  const re =
    /"name":"((?:\\.|[^"\\])*)","uri":"spotify:episode:([a-zA-Z0-9]+)"/g;

  for (const match of html.matchAll(re)) {
    const rawTitle = match[1]?.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    const episodeId = match[2];
    if (!rawTitle || !episodeId) continue;

    const title = normalizeEpisodeTitle(rawTitle);
    if (!title) continue;

    links.set(title, `https://open.spotify.com/episode/${episodeId}`);
  }

  if (links.size > 0) return links;

  const hrefRe =
    /href="(https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+))"/g;
  const episodeIds: string[] = [];
  for (const match of html.matchAll(hrefRe)) {
    const href = match[1];
    if (!href) continue;
    episodeIds.push(href);
  }

  const nameRe = /"name":"((?:\\.|[^"\\])*)"/g;
  const titles: string[] = [];
  for (const match of html.matchAll(nameRe)) {
    const rawTitle = match[1]?.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (!rawTitle || rawTitle === 'Шитбастардc' || rawTitle === 'Max Ulianov')
      continue;
    titles.push(rawTitle);
  }

  episodeIds.forEach((href, index) => {
    const rawTitle = titles[index];
    if (!rawTitle) return;
    const title = normalizeEpisodeTitle(rawTitle);
    if (title) links.set(title, href);
  });

  return links;
}

async function buildPlatformEpisodeIndex(): Promise<
  Map<string, PlatformEpisodeLinks>
> {
  const index = new Map<string, PlatformEpisodeLinks>();

  const [appleRes, spotifyRes] = await Promise.allSettled([
    fetch(
      `https://podcasts.apple.com/podcast/id${APPLE_PODCAST_ID}`,
      FETCH_OPTS,
    ),
    fetch(`https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`, FETCH_OPTS),
  ]);

  const appleLinks =
    appleRes.status === 'fulfilled' && appleRes.value.ok
      ? parseAppleEpisodeLinks(await appleRes.value.text())
      : new Map<string, string>();

  const spotifyLinks =
    spotifyRes.status === 'fulfilled' && spotifyRes.value.ok
      ? parseSpotifyEpisodeLinks(await spotifyRes.value.text())
      : new Map<string, string>();

  for (const title of new Set([...appleLinks.keys(), ...spotifyLinks.keys()])) {
    index.set(title, {
      ...(appleLinks.get(title) && { apple: appleLinks.get(title) }),
      ...(spotifyLinks.get(title) && { spotify: spotifyLinks.get(title) }),
    });
  }

  return index;
}

export const getPlatformEpisodeIndex = unstable_cache(
  buildPlatformEpisodeIndex,
  ['platform-episode-index'],
  { revalidate: 3600 },
);

export async function getEpisodePlatformLinks(title: string) {
  const index = await getPlatformEpisodeIndex();
  const key = normalizeEpisodeTitle(title);
  const episodeLinks = index.get(key) ?? {};

  return PLATFORMS.map((platform) => ({
    label: platform.label,
    href: episodeLinks[platform.id] ?? platform.href,
  }));
}
