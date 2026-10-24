import { describe, expect, it } from 'vitest';

import type { Episode } from '@/lib/episodes';
import { getLatestEpisode, isEpisodeNew } from '@/lib/episode-ui';

const ep = (publishDate: Date): Episode => ({
  guid: String(publishDate.getTime()),
  slug: 's',
  title: 't',
  description: '',
  publishDate,
  durationSec: 0,
  season: 1,
  episodeNumber: 1,
  imageUrl: '',
  audioUrl: '',
});

describe('episode-ui', () => {
  it('returns null for an empty list', () => {
    expect(getLatestEpisode([])).toBeNull();
  });

  it('picks the most recently published episode', () => {
    const old = ep(new Date('2024-01-01'));
    const fresh = ep(new Date('2025-01-01'));
    expect(getLatestEpisode([old, fresh])).toBe(fresh);
  });

  it('flags only recent episodes as new', () => {
    expect(isEpisodeNew(ep(new Date()))).toBe(true);
    expect(isEpisodeNew(ep(new Date('2020-01-01')))).toBe(false);
  });
});
