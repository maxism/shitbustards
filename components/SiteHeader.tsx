import { PLATFORMS } from '@/lib/platforms';

const PODCAST_ART =
  'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png';

export function SiteHeader({ bgImage }: { bgImage?: string }) {
  const bg = bgImage ?? PODCAST_ART;

  return (
    <header className="site-header">
      <div className="site-header__bg" style={{ backgroundImage: `url('${bg}')` }} />

      <div className="site-header__inner">

        <a className="site-header__brand" href="/" aria-label="ШИТБАСТАРДС — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="site-header__bird"
            src="/fonts/bird.svg"
            alt=""
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="site-header__logo" src="/logo.svg" alt="ШИТБАСТАРДС" />
        </a>

        <div className="site-header__divider" aria-hidden="true" />

        <div className="site-header__meta">
          <p className="site-header__desc">
            Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.
            Два ведущих, ноль сценария, без фильтров.
          </p>
          <ul className="site-header__platforms" aria-label="Слушать на платформах">
            {PLATFORMS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a
          className="site-header__tg"
          href="https://t.me/shitbastards"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram-канал"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.68 7.93c-.12.58-.46.72-.94.45l-2.62-1.93-1.26 1.22c-.14.14-.26.26-.53.26l.19-2.67 4.85-4.38c.21-.19-.05-.29-.32-.1l-6 3.77-2.58-.8c-.56-.18-.57-.56.12-.83l10.08-3.88c.46-.17.87.11.69.96z"
              fill="currentColor"
            />
          </svg>
          <span>Telegram</span>
        </a>

      </div>
    </header>
  );
}
