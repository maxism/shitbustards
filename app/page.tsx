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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">ШИТБАСТАРДС — подкаст про жизнь, технологии и музыку</h1>
      <div className="episodes">
        {episodes.map(ep => (
          <EpisodeCard key={ep.guid} episode={ep} />
        ))}
      </div>
    </>
  );
}
