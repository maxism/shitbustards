const PLATFORMS = [
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/podcast/id1753575420' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/1Yvaa7UTq6wM2yNYjxYcTr' },
  { label: 'Яндекс Музыка', href: 'https://music.yandex.ru/album/31843163' },
  { label: 'Звук', href: 'https://zvuk.com/podcast/45080329' },
  { label: 'Pocket Casts', href: 'https://pca.st/itunes/1753575420' },
  { label: 'Overcast', href: 'https://overcast.fm/itunes1753575420' },
  { label: 'Podcast Addict', href: 'https://podcastaddict.com/podcast/5190206' },
  { label: 'RSS', href: 'https://cloud.mave.digital/54964' },
];

export function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar__bg" />
      <div className="sidebar__inner">

        {/* Замени на свой файл: public/fonts/bird.svg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="sidebar__bird"
          src="/fonts/bird.svg"
          alt=""
          aria-hidden="true"
        />

        <div className="sidebar__title">
          ШИТБА
          <br />
          СТАРДС
        </div>

        <div className="sidebar__divider" />

        <p className="sidebar__desc">
          Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.
          Два ведущих, ноль сценария, без фильтров.
        </p>

        <ul className="sidebar__platforms" aria-label="Слушать на платформах">
          {PLATFORMS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="sidebar__bottom">
          <p className="sidebar__sub-label">Подпишись на канал:</p>
          <a
            className="sidebar__tg"
            href="https://t.me/shitbastards"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.68 7.93c-.12.58-.46.72-.94.45l-2.62-1.93-1.26 1.22c-.14.14-.26.26-.53.26l.19-2.67 4.85-4.38c.21-.19-.05-.29-.32-.1l-6 3.77-2.58-.8c-.56-.18-.57-.56.12-.83l10.08-3.88c.46-.17.87.11.69.96z"
                fill="#fef2e2"
              />
            </svg>
            <span>Telegram</span>
          </a>
        </div>

      </div>
    </aside>
  );
}
