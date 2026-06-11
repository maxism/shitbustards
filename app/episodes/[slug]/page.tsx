import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getEpisodes,
  getEpisodeBySlug,
  formatDate,
  formatDuration,
  getEpisodeNeighbors,
  safeToISOString,
} from '@/lib/episodes';
import {
  buildBreadcrumbJsonLd,
  buildEpisodeJsonLd,
  getMetaDescription,
} from '@/lib/episode-public';
import { getEpisodePlatformLinks } from '@/lib/platform-episode-index';
import { sanitizeEpisodeHtml } from '@/lib/sanitize-html';
import { readTranscript, getTranscriptUrl } from '@/lib/transcripts';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { EpisodePlayTrigger } from './EpisodePlayTrigger';

export const revalidate = 3600;

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return episodes.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) return {};

  const description = getMetaDescription(ep);
  const titleWords = ep.title
    .toLowerCase()
    .split(/[\s,–—-]+/)
    .filter((w) => w.length >= 3);
  const keywords = [
    ...new Set([
      ...titleWords,
      'шитбастардс',
      'подкаст',
      'подкаст на русском',
      ...(ep.season > 0 ? [`сезон ${ep.season}`] : []),
    ]),
  ];

  const publishedTime = safeToISOString(ep.publishDate);

  return {
    title: ep.title,
    description,
    keywords,
    openGraph: {
      title: `${ep.title} — ${SITE_NAME}`,
      description,
      url: `/episodes/${slug}`,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      type: 'article',
      ...(publishedTime && { publishedTime }),
      images: [{ url: ep.imageUrl, width: 600, height: 600, alt: ep.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ep.title} — ${SITE_NAME}`,
      description,
      images: [{ url: ep.imageUrl, alt: ep.title }],
    },
    alternates: {
      canonical: `/episodes/${slug}`,
      types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episodes = await getEpisodes();
  const ep = episodes.find((e) => e.slug === slug) ?? null;
  if (!ep) notFound();

  const { prev: prevEp, next: nextEp } = getEpisodeNeighbors(episodes, slug);

  const transcript = readTranscript(slug);
  const transcriptUrl = getTranscriptUrl(slug);
  const jsonLd = buildEpisodeJsonLd(ep, slug, {
    fullDescription: true,
    transcriptUrl: transcriptUrl ?? undefined,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(ep, slug);
  const platformLinks = await getEpisodePlatformLinks(ep.title);
  const safeDescription = sanitizeEpisodeHtml(ep.description);
  const publishDateIso = safeToISOString(ep.publishDate);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="episode-back" aria-label="Навигация">
        <Link href="/">← Все эпизоды</Link>
      </nav>

      <div className="episode-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="episode-art" src={ep.imageUrl} alt={ep.title} />

        <div className="episode-details">
          <p className="episode-meta">
            {ep.episodeNumber > 0 && `Эп. ${ep.episodeNumber} · `}
            {ep.season > 0 && `Сезон ${ep.season} · `}
            {formatDate(ep.publishDate) && (
              <time dateTime={publishDateIso}>{formatDate(ep.publishDate)}</time>
            )}
            {ep.durationSec > 0 && ` · ${formatDuration(ep.durationSec)}`}
          </p>

          <h1 className="episode-title">{ep.title}</h1>

          <div className="episode-actions">
            <EpisodePlayTrigger episode={ep} />

            <p className="episode-agent-links">
              <a href={`/episodes/${slug}/md`}>Markdown для агентов</a>
              {' · '}
              <a href={`/api/episodes/${slug}`}>JSON</a>
            </p>
          </div>
        </div>
      </div>

      <section className="about__section episode-listen">
        <h2 className="about__h2">Слушать</h2>
        <ul className="about__platforms">
          {platformLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {safeDescription && (
        <div
          className="episode-description"
          dangerouslySetInnerHTML={{ __html: safeDescription }}
        />
      )}

      {transcript && (
        <details className="episode-transcript">
          <summary className="episode-transcript__toggle">Транскрипт</summary>
          <pre className="episode-transcript__body">{transcript}</pre>
        </details>
      )}

      <nav className="episode-nav" aria-label="Другие эпизоды">
        {prevEp ? (
          <Link
            href={`/episodes/${prevEp.slug}`}
            className="episode-nav__link episode-nav__prev"
          >
            <span className="episode-nav__dir">← Предыдущий</span>
            <span className="episode-nav__title">{prevEp.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextEp && (
          <Link
            href={`/episodes/${nextEp.slug}`}
            className="episode-nav__link episode-nav__next"
          >
            <span className="episode-nav__dir">Следующий →</span>
            <span className="episode-nav__title">{nextEp.title}</span>
          </Link>
        )}
      </nav>
    </>
  );
}
