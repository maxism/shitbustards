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
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';
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
  const title = `${ep.title} — ШИТБАСТАРДС`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ep.imageUrl, width: 600, height: 600 }],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ep.imageUrl],
    },
    alternates: {
      canonical: `/episodes/${slug}`,
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);
  if (!ep) notFound();

  const plainDescription = stripHtml(ep.description).slice(0, 160);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: ep.title,
    episodeNumber: ep.episodeNumber || undefined,
    datePublished: ep.publishDate.toISOString().split('T')[0],
    description: plainDescription,
    image: ep.imageUrl,
    audio: {
      '@type': 'AudioObject',
      contentUrl: ep.audioUrl,
      encodingFormat: 'audio/mpeg',
      duration: ep.durationSec ? `PT${Math.floor(ep.durationSec / 60)}M${ep.durationSec % 60}S` : undefined,
    },
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: 'ШИТБАСТАРДС',
      url: 'https://shitbustards.ru',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader bgImage={ep.imageUrl} />

      <main className="episode-main">
        <div className="episode-container">

          <nav className="episode-back" aria-label="Навигация">
            <a href="/">← Все эпизоды</a>
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

          {ep.description && (
            <div
              className="episode-description"
              dangerouslySetInnerHTML={{ __html: ep.description }}
            />
          )}

        </div>
      </main>

      <Footer />
      <AudioPlayer />
    </>
  );
}
