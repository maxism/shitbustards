import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter_Tight } from 'next/font/google';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MobileControls } from '@/components/MobileControls';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shitbustards.ru';

const OG_IMAGE =
  'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ШИТБАСТАРДС — подкаст',
    template: '%s — ШИТБАСТАРДС',
  },
  description:
    'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.',
  keywords: [
    'шитбастардс',
    'подкаст',
    'разговорный подкаст',
    'подкаст на русском',
    'подкаст про технологии',
    'подкаст про жизнь',
    'подкаст про музыку',
    'нейросети',
    'искусственный интеллект',
    'бизнес подкаст',
    'стартапы',
    'подкаст без цензуры',
    'Макс Ульянов',
  ],
  openGraph: {
    title: 'ШИТБАСТАРДС — подкаст',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.',
    url: BASE_URL,
    siteName: 'ШИТБАСТАРДС',
    locale: 'ru_RU',
    type: 'website',
    // og:image берётся из app/opengraph-image.tsx (1200×630)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ШИТБАСТАРДС — подкаст',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.',
    // twitter:image берётся из app/opengraph-image.tsx
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': 'https://cloud.mave.digital/54964' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: OG_IMAGE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  other: {
    'theme-color': '#f97316',
    'yandex-verification': 'f865b6b1f132293b',
  },
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ШИТБАСТАРДС',
  url: BASE_URL,
  description:
    'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.',
  inLanguage: 'ru',
  publisher: {
    '@type': 'Organization',
    name: 'ШИТБАСТАРДС',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: OG_IMAGE },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://cdn.mave.digital" />
        <link rel="dns-prefetch" href="https://cdn.mave.digital" />
      </head>
      <body className={interTight.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <header className="mob-header">
          <div className="mob-header__bg" />
          <div className="mob-header__tint" />
          <div className="mob-header__row">
            <button className="mob-burger" id="burgerBtn" aria-label="Открыть меню">
              <span /><span /><span />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mob-header__logo" src="/logo-text.svg" alt="ШИТБАСТАРДС" />
          </div>
        </header>

        <div className="sidebar-mask" id="sidebarMask" />
        <Sidebar />

        <main className="main">{children}</main>

        <Footer />
        <AudioPlayer />
        <MobileControls />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D09PMFB542"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-D09PMFB542');`}
        </Script>

        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109150587','ym');
          ym(109150587,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/109150587" style={{position:'absolute',left:'-9999px'}} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
