import { PLATFORMS } from '@/lib/platforms';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        <ul className="site-footer__platforms" aria-label="Слушать на платформах">
          {PLATFORMS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="site-footer__bottom">
          <a className="site-footer__email" href="mailto:info@shitbustards.ru">
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
