import { getEpisodes } from '@/lib/episodes';
import { EpisodeCard } from '@/components/EpisodeCard';
import {
  buildItemListJsonLd,
  buildPodcastSeriesJsonLd,
} from '@/lib/episode-public';

export const revalidate = 3600;

export default async function Home() {
  const episodes = await getEpisodes();
  const podcastJsonLd = buildPodcastSeriesJsonLd();
  const itemListJsonLd = buildItemListJsonLd(episodes);

  const seasons = new Map<number, typeof episodes>();
  for (const ep of episodes) {
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
      <h1 className="sr-only">
        ШИТБАСТАРДС — подкаст про жизнь, технологии и музыку
      </h1>

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
