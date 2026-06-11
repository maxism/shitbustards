import { SIDEBAR_PLATFORMS } from '@/lib/platforms';
import { SidebarLink } from '@/components/SidebarLink';

export function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar__bg" />
      <button
        className="sidebar__close"
        id="sidebarCloseBtn"
        aria-label="Закрыть меню"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 3L17 17M17 3L3 17"
            stroke="#fef2e2"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="sidebar__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="sidebar__bird"
          src="/fonts/bird.svg"
          alt=""
          aria-hidden="true"
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sidebar__logo" src="/logo.svg" alt="ШИТБАСТАРДС" />

        <div className="sidebar__divider" />

        <nav className="sidebar__block" aria-label="Разделы сайта">
          <p className="sidebar__block-title">Сайт</p>
          <ul className="sidebar__menu">
            <li>
              <SidebarLink href="/">Все эпизоды</SidebarLink>
            </li>
            <li>
              <SidebarLink href="/about">О подкасте</SidebarLink>
            </li>
            <li>
              <a href="/feed.xml">RSS</a>
            </li>
          </ul>
        </nav>

        <nav className="sidebar__block" aria-label="Слушать на платформах">
          <p className="sidebar__block-title">Слушать</p>
          <ul className="sidebar__menu">
            {SIDEBAR_PLATFORMS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
