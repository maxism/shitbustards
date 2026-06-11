import type { Metadata } from 'next';
import Link from 'next/link';
import { PLATFORMS, SIDEBAR_PLATFORMS } from '@/lib/platforms';
import { PlatformChip } from '@/components/PlatformChip';
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
  openGraph: {
    title: `О подкасте — ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: '/about',
    type: 'website',
    images: [{ url: PODCAST_COVER, width: 600, height: 600, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `О подкасте — ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [{ url: PODCAST_COVER, alt: SITE_NAME }],
  },
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

      <section className="about__card">
        <h2 className="about__h2">Ведущие</h2>
        <ul className="about__hosts">
          {HOSTS.map(({ name, role, url, avatar }) => (
            <li key={name} className="about__host">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="about__avatar" src={avatar} alt="" />
              <div className="about__host-info">
                <strong className="about__host-name">
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  ) : (
                    name
                  )}
                </strong>
                <span className="about__host-role">{role}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="about__card">
        <h2 className="about__h2">Слушать</h2>
        <div className="about__platforms">
          {SIDEBAR_PLATFORMS.map((platform) => (
            <PlatformChip key={platform.id} platform={platform} />
          ))}
          <PlatformChip
            platform={PLATFORMS.find((p) => p.id === 'rss')!}
            external={false}
          />
        </div>
      </section>

      <section className="about__card">
        <h2 className="about__h2">Контакты</h2>
        <p className="about__contacts">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' · '}
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </p>
      </section>

      <details className="about__dev">
        <summary className="about__dev-toggle">Для AI и разработчиков</summary>
        <ul className="about__list">
          <li>
            <Link href="/llms.txt">llms.txt</Link> — краткий индекс для LLM
          </li>
          <li>
            <Link href="/api/episodes">JSON API</Link> — каталог эпизодов
          </li>
          <li>
            <Link href="/feed.xml">feed.xml</Link> — RSS на нашем домене
          </li>
          <li>
            <Link href="/sitemap.xml">sitemap.xml</Link>
          </li>
          <li>
            Markdown эпизода: <code>/episodes/&#123;slug&#125;/md</code>
          </li>
        </ul>
      </details>
    </article>
  );
}
