import Link from 'next/link';
import { SITE_DESCRIPTION, TELEGRAM_URL } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="site-footer__bird"
            src="/fonts/bird.svg"
            alt=""
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="site-footer__logo"
            src="/logo.svg"
            alt="ШИТБАСТАРДС"
          />
          <p className="site-footer__tagline">{SITE_DESCRIPTION}</p>
        </div>

        <div className="site-footer__links">
          <Link href="/about" className="site-footer__link">
            О подкасте
          </Link>
          <a
            className="site-footer__link"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          <a className="site-footer__link" href="mailto:info@shitbustards.ru">
            info@shitbustards.ru
          </a>
          <span className="site-footer__copyright">
            © {new Date().getFullYear()} ШИТБАСТАРДС
          </span>
        </div>
      </div>
    </footer>
  );
}
