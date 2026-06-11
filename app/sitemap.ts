import type { MetadataRoute } from 'next';
import { getEpisodes } from '@/lib/episodes';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await getEpisodes();
  const latestEpisodeDate =
    episodes.length > 0
      ? new Date(
          Math.max(...episodes.map((ep) => ep.publishDate.getTime())),
        )
      : new Date();

  return [
    {
      url: SITE_URL,
      lastModified: latestEpisodeDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: latestEpisodeDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...episodes.map((ep) => ({
      url: `${SITE_URL}/episodes/${ep.slug}`,
      lastModified: ep.publishDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
