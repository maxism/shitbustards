import type { MetadataRoute } from 'next';
import { getEpisodes, generateSlug } from '@/lib/episodes';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shitbustards.ru';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await getEpisodes();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...episodes.map(ep => ({
      url: `${BASE_URL}/episodes/${generateSlug(ep)}`,
      lastModified: ep.publishDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
