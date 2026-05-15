import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getEpisodes,
  getEpisodeBySlug,
  generateSlug,
  formatDate,
  formatDuration,
  stripHtml,
} from '@/lib/episodes';
import { PLATFORMS } from '@/lib/platforms';
import { EpisodePlayTrigger } from './EpisodePlayTrigger';

export const revalidate = 3600;

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return episodes.map(ep => ({ slug: generateSlug(ep) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) return {};

  const description = stripHtml(ep.description).slice(0, 160);

  // Ключевые слова: слова из заголовка (3+ символа) + базовые теги подкаста
  const titleWords = ep.title
    .toLowerCase()
    .split(/[\s,–—-]+/)
    .filter(w => w.length >= 3);
  const keywords = [
    ...new Set([
      ...titleWords,
      'шитбастардс',
      'подкаст',
      'подкаст на русском',
      ...(ep.season > 0 ? [`сезон ${ep.season}`] : []),
    ]),
  ];

  return {
    title: ep.title,
    description,
    keywords,
    openGraph: {
      title: `${ep.title} — ШИТБАСТАРДС`,
      description,
      url: `/episodes/${slug}`,
      siteName: 'ШИТБАСТАРДС',
      locale: 'ru_RU',
      type: 'website',
      images: [{ url: ep.imageUrl, width: 600, height: 600, alt: ep.title }],
    },
    twitter: {
      // square 600×600 cover → summary (не summary_large_image, иначе Twitter кропает)
      card: 'summary',
      title: `${ep.title} — ШИТБАСТАРДС`,
      description,
      images: [{ url: ep.imageUrl, alt: ep.title }],
    },
    alternates: {
      canonical: `/episodes/${slug}`,
      types: { 'application/rss+xml': 'https://cloud.mave.digital/54964' },
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
  const epIndex = episodes.findIndex(e => generateSlug(e) === slug);
  const ep = epIndex >= 0 ? episodes[epIndex] : null;
  if (!ep) notFound();

  const prevEp = epIndex > 0 ? episodes[epIndex - 1] : null;
  const nextEp = epIndex < episodes.length - 1 ? episodes[epIndex + 1] : null;

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shitbustards.ru';
  const plainDescription = stripHtml(ep.description).slice(0, 160);
  const episodeUrl = `${BASE_URL}/episodes/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: ep.title,
    url: episodeUrl,
    episodeNumber: ep.episodeNumber || undefined,
    datePublished: ep.publishDate.toISOString().split('T')[0],
    description: plainDescription,
    image: ep.imageUrl,
    timeRequired: ep.durationSec
      ? `PT${Math.floor(ep.durationSec / 60)}M${ep.durationSec % 60}S`
      : undefined,
    audio: {
      '@type': 'AudioObject',
      contentUrl: ep.audioUrl,
      encodingFormat: 'audio/mpeg',
      duration: ep.durationSec
        ? `PT${Math.floor(ep.durationSec / 60)}M${ep.durationSec % 60}S`
        : undefined,
    },
    ...(ep.season > 0 && {
      seasonNumber: ep.season,
      partOfSeason: {
        '@type': 'PodcastSeason',
        seasonNumber: ep.season,
        partOfSeries: {
          '@type': 'PodcastSeries',
          name: 'ШИТБАСТАРДС',
          url: BASE_URL,
        },
      },
    }),
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: 'ШИТБАСТАРДС',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ШИТБАСТАРДС',
      url: BASE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: ep.title,
        item: episodeUrl,
      },
    ],
  };

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
        <img
          className="episode-art"
          src={ep.imageUrl}
          alt={ep.title}
        />

        <div className="episode-details">
          <p className="episode-meta">
            {ep.episodeNumber > 0 && `Эп. ${ep.episodeNumber} · `}
            {ep.season > 0 && `Сезон ${ep.season} · `}
            {formatDate(ep.publishDate)}
            {ep.durationSec > 0 && ` · ${formatDuration(ep.durationSec)}`}
          </p>

          <h1 className="episode-title">{ep.title}</h1>

          <div className="episode-actions">
            <EpisodePlayTrigger episode={ep} />

            <div className="episode-platforms">
              <span className="episode-platforms__label">Слушать на:</span>
              {PLATFORMS.filter(p => p.label !== 'RSS').map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {ep.description && (
        <div
          className="episode-description"
          dangerouslySetInnerHTML={{ __html: ep.description }}
        />
      )}

      <nav className="episode-nav" aria-label="Другие эпизоды">
        {prevEp ? (
          <Link href={`/episodes/${generateSlug(prevEp)}`} className="episode-nav__link episode-nav__prev">
            <span className="episode-nav__dir">← Предыдущий</span>
            <span className="episode-nav__title">{prevEp.title}</span>
          </Link>
        ) : <span />}
        {nextEp && (
          <Link href={`/episodes/${generateSlug(nextEp)}`} className="episode-nav__link episode-nav__next">
            <span className="episode-nav__dir">Следующий →</span>
            <span className="episode-nav__title">{nextEp.title}</span>
          </Link>
        )}
      </nav>
    </>
  );
}
