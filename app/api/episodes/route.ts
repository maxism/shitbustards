import { getEpisodes, generateSlug } from '@/lib/episodes';
import { episodeToPublic } from '@/lib/episode-public';
import {
  transcriptFlagsForEpisodes,
  getTranscriptUrl,
} from '@/lib/transcripts';
import {
  CONTACT_EMAIL,
  PODCAST_COVER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TELEGRAM_URL,
} from '@/lib/site';

export const revalidate = 3600;

export async function GET() {
  const episodes = await getEpisodes();
  const flags = transcriptFlagsForEpisodes(episodes);

  return Response.json(
    {
      podcast: {
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        image: PODCAST_COVER,
        feedUrl: `${SITE_URL}/feed.xml`,
        llmsTxt: `${SITE_URL}/llms.txt`,
        contact: CONTACT_EMAIL,
        telegram: TELEGRAM_URL,
      },
      episodes: episodes.map((ep) => {
        const slug = generateSlug(ep);
        const hasT = flags.get(slug) ?? false;
        return episodeToPublic(ep, hasT, hasT ? getTranscriptUrl(slug) : null);
      }),
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}
