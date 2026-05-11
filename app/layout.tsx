import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'ШИТБАСТАРДС — подкаст',
  description:
    'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.',
  openGraph: {
    title: 'ШИТБАСТАРДС — подкаст',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.',
    images: [
      'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png',
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
