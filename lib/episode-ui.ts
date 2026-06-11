import type { Episode } from '@/lib/episodes';

export const NEW_EPISODE_DAYS = 14;

export function isEpisodeNew(
  ep: Episode,
  days: number = NEW_EPISODE_DAYS,
): boolean {
  const ms = days * 24 * 60 * 60 * 1000;
  return Date.now() - ep.publishDate.getTime() < ms;
}

export function getLatestEpisode(episodes: Episode[]): Episode | null {
  if (episodes.length === 0) return null;
  return [...episodes].sort(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime(),
  )[0];
}
