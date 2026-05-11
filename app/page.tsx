import { getEpisodes } from '@/lib/episodes';
import { Sidebar } from '@/components/Sidebar';
import { EpisodeCard } from '@/components/EpisodeCard';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MobileControls } from '@/components/MobileControls';

// Revalidate the page every hour — new episodes appear automatically
export const revalidate = 3600;

export default async function Home() {
  const episodes = await getEpisodes();

  return (
    <>
      {/* ─── Mobile header ─────────────────────────────── */}
      <header className="mob-header">
        <div className="mob-header__bg" />
        <div className="mob-header__tint" />
        <div className="mob-header__row">
          <button className="mob-burger" id="burgerBtn" aria-label="Открыть меню">
            <span /><span /><span />
          </button>
          <span className="mob-header__title">ШИТБАСТАРДС</span>
        </div>
      </header>

      {/* ─── Sidebar overlay ───────────────────────────── */}
      <div className="sidebar-mask" id="sidebarMask" />

      {/* ─── Sidebar ─────────────────────────────────── */}
      <Sidebar />

      {/* ─── Main ────────────────────────────────────── */}
      <main className="main">
        <p className="mob-desc">
          Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.
          Два ведущих, ноль сценария, без фильтров.
        </p>

        <div className="episodes">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.guid} episode={ep} />
          ))}
        </div>
      </main>

      {/* ─── Client components ───────────────────────── */}
      <AudioPlayer />
      <MobileControls />
    </>
  );
}
