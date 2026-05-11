import { getEpisodes } from '@/lib/episodes';
import { Sidebar } from '@/components/Sidebar';
import { EpisodeCard } from '@/components/EpisodeCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MobileControls } from '@/components/MobileControls';
import { Footer } from '@/components/Footer';

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

      {/* ─── Mobile header ─────────────────────────────── */}
      <header className="mob-header">
        <div className="mob-header__bg" />
        <div className="mob-header__tint" />
        <div className="mob-header__row">
          <button className="mob-burger" id="burgerBtn" aria-label="Открыть меню">
            <span /><span /><span />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mob-header__logo" src="/logo.svg" alt="ШИТБАСТАРДС" />
        </div>
      </header>

      {/* ─── Sidebar overlay ───────────────────────────── */}
      <div className="sidebar-mask" id="sidebarMask" />

      {/* ─── Sidebar ─────────────────────────────────── */}
      <Sidebar />

      {/* ─── Main ────────────────────────────────────── */}
      <main className="main">
        <div className="episodes">
          {episodes.map(ep => (
            <EpisodeCard key={ep.guid} episode={ep} />
          ))}
        </div>
      </main>

      <Footer />
      <AudioPlayer />
      <MobileControls />
    </>
  );
}
