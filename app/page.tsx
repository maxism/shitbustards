import { getEpisodes } from '@/lib/episodes';
import { EpisodeCard } from '@/components/EpisodeCard';

export const revalidate = 3600;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'PodcastSeries',
  name: 'ШИТБАСТАРДС',
  description:
    'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.',
  url: 'https://shitbustards.ru',
  image:
    'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png',
  inLanguage: 'ru',
  webFeed: 'https://cloud.mave.digital/54964',
};

export default async function Home() {
  const episodes = await getEpisodes();

  // Group by season (season 0 = no season tag → shown without header)
  const seasons = new Map<number, typeof episodes>();
  for (const ep of episodes) {
    const s = ep.season;
    if (!seasons.has(s)) seasons.set(s, []);
    seasons.get(s)!.push(ep);
  }

  // Sort seasons descending (newest first), season 0 last
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">ШИТБАСТАРДС — подкаст про жизнь, технологии и музыку</h1>

      {sortedSeasons.map(([season, eps]) => (
        <section key={season} className="season">
          {!hasSingleGroup && season > 0 && (
            <h2 className="season__header">Сезон {season}</h2>
          )}
          <div className="episodes">
            {eps.map(ep => (
              <EpisodeCard key={ep.guid} episode={ep} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
