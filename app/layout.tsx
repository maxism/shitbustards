import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
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
  openGraph: {
    title: 'ШИТБАСТАРДС — подкаст',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.',
    url: BASE_URL,
    siteName: 'ШИТБАСТАРДС',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 600, height: 600, alt: 'ШИТБАСТАРДС' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ШИТБАСТАРДС — подкаст',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.',
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': 'https://cloud.mave.digital/54964' },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: OG_IMAGE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
