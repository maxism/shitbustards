import { notFound } from 'next/navigation';
import { getEpisodeBySlug } from '@/lib/episodes';
import { episodeToMarkdown } from '@/lib/episode-public';
import { readTranscript } from '@/lib/transcripts';

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) notFound();

  const transcript = readTranscript(slug);
  const body = episodeToMarkdown(ep, slug, transcript);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
