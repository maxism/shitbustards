import { getEpisodes } from '@/lib/episodes';
import { EpisodeCard } from '@/components/EpisodeCard';
import { FeaturedEpisode } from '@/components/FeaturedEpisode';
import {
  buildItemListJsonLd,
  buildPodcastSeriesJsonLd,
} from '@/lib/episode-public';
import { getLatestEpisode } from '@/lib/episode-ui';
import { PODCAST_COVER, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const revalidate = 3600;

export default async function Home() {
  const episodes = await getEpisodes();
  const podcastJsonLd = buildPodcastSeriesJsonLd();
  const itemListJsonLd = buildItemListJsonLd(episodes);
  const latest = getLatestEpisode(episodes);

  const gridEpisodes = latest
    ? episodes.filter((ep) => ep.guid !== latest.guid)
    : episodes;

  const seasons = new Map<number, typeof gridEpisodes>();
  for (const ep of gridEpisodes) {
    const s = ep.season;
    if (!seasons.has(s)) seasons.set(s, []);
    seasons.get(s)!.push(ep);
  }

  const sortedSeasons = [...seasons.entries()].sort(([a], [b]) => {
    if (a === 0) return 1;
    if (b === 0) return -1;
    return b - a;
  });

  const hasSingleGroup = sortedSeasons.length === 1;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <header className="home-intro">
        <div className="home-intro__row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="home-intro__cover"
            src={PODCAST_COVER}
            alt={SITE_NAME}
            width={120}
            height={120}
          />
          <div className="home-intro__text">
            <p className="home-intro__tagline">
              Некультурно-разговорный подкаст
            </p>
            <h1 className="home-intro__title">{SITE_NAME}</h1>
            <p className="home-intro__desc">{SITE_DESCRIPTION}</p>
          </div>
        </div>
      </header>

      {latest && <FeaturedEpisode episode={latest} />}

      {sortedSeasons.map(([season, eps]) => (
        <section key={season} className="season">
          {!hasSingleGroup && season > 0 && (
            <h2 className="season__header">Сезон {season}</h2>
          )}
          <div className="episodes">
            {eps.map((ep) => (
              <EpisodeCard key={ep.guid} episode={ep} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
