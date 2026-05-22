import type { Metadata } from 'next';
import Link from 'next/link';
import { PLATFORMS } from '@/lib/platforms';
import {
  CONTACT_EMAIL,
  HOSTS,
  PODCAST_COVER,
  SITE_DESCRIPTION,
  SITE_NAME,
  TELEGRAM_URL,
} from '@/lib/site';

export const metadata: Metadata = {
  title: 'О подкасте',
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article className="about">
      <nav className="episode-back" aria-label="Навигация">
        <Link href="/">← Все эпизоды</Link>
      </nav>

      <header className="about__header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about__cover" src={PODCAST_COVER} alt={SITE_NAME} />
        <div>
          <h1 className="about__title">{SITE_NAME}</h1>
          <p className="about__tagline">Некультурно-разговорный подкаст</p>
        </div>
      </header>

      <p className="about__desc">{SITE_DESCRIPTION}</p>

      <section className="about__section">
        <h2 className="about__h2">Ведущие</h2>
        <ul className="about__list">
          {HOSTS.map(({ name, role }) => (
            <li key={name}>
              <strong>{name}</strong> — {role}
            </li>
          ))}
        </ul>
      </section>

      <section className="about__section">
        <h2 className="about__h2">Слушать</h2>
        <ul className="about__platforms">
          {PLATFORMS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__section">
        <h2 className="about__h2">Контакты</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' · '}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </p>
      </section>

      <section className="about__section">
        <h2 className="about__h2">Для AI и разработчиков</h2>
        <ul className="about__list">
          <li>
            <a href="/llms.txt">llms.txt</a> — краткий индекс для LLM
          </li>
          <li>
            <a href="/api/episodes">JSON API</a> — каталог эпизодов
          </li>
          <li>
            <a href="/feed.xml">feed.xml</a> — RSS на нашем домене
          </li>
          <li>
            <a href="/sitemap.xml">sitemap.xml</a>
          </li>
          <li>
            Markdown эпизода: <code>/episodes/&#123;slug&#125;/md</code>
          </li>
        </ul>
      </section>
    </article>
  );
}
