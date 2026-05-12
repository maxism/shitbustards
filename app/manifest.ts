import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ШИТБАСТАРДС — подкаст',
    short_name: 'ШИТБАСТАРДС',
    description:
      'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f97316',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
