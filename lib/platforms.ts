import { YOUTUBE_URL } from '@/lib/site';

export const APPLE_PODCAST_ID = '1753575420';
export const SPOTIFY_SHOW_ID = '1Yvaa7UTq6wM2yNYjxYcTr';

export const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: YOUTUBE_URL,
  },
  {
    id: 'apple',
    label: 'Apple Podcasts',
    href: `https://podcasts.apple.com/podcast/id${APPLE_PODCAST_ID}`,
  },
  {
    id: 'spotify',
    label: 'Spotify',
    href: `https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`,
  },
  {
    id: 'yandex',
    label: 'Яндекс Музыка',
    href: 'https://music.yandex.ru/album/31843163',
  },
  {
    id: 'zvuk',
    label: 'Звук',
    href: 'https://zvuk.com/podcast/45080329',
  },
  {
    id: 'pocketCasts',
    label: 'Pocket Casts',
    href: `https://pca.st/itunes/${APPLE_PODCAST_ID}`,
  },
  {
    id: 'overcast',
    label: 'Overcast',
    href: `https://overcast.fm/itunes${APPLE_PODCAST_ID}`,
  },
  {
    id: 'podcastAddict',
    label: 'Podcast Addict',
    href: 'https://podcastaddict.com/podcast/5190206',
  },
  { id: 'rss', label: 'RSS', href: '/feed.xml' },
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type PlatformId = Platform['id'];
