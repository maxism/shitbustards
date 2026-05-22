import { getEpisodes } from '@/lib/episodes';
import { buildLlmsTxt } from '@/lib/episode-public';

export const revalidate = 3600;

export async function GET() {
  const episodes = await getEpisodes();
  const body = buildLlmsTxt(episodes);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
