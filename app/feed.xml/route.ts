import { RSS_URL } from '@/lib/site';

export const revalidate = 3600;

export async function GET() {
  const res = await fetch(RSS_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  });

  if (!res.ok) {
    return new Response('RSS upstream unavailable', { status: 502 });
  }

  const xml = await res.text();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
