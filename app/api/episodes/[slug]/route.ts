import { getEpisodeBySlug } from '@/lib/episodes';
import { episodeToPublic } from '@/lib/episode-public';
import { hasTranscript, getTranscriptUrl } from '@/lib/transcripts';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) {
    return Response.json({ error: 'Episode not found' }, { status: 404 });
  }

  const hasT = hasTranscript(slug);
  return Response.json(
    episodeToPublic(ep, hasT, hasT ? getTranscriptUrl(slug) : null),
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  );
}
