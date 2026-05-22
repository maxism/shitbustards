import type { Episode } from '@/lib/episodes';
import {
  formatDate,
  formatDuration,
  generateSlug,
  stripHtml,
} from '@/lib/episodes';
import {
  CONTACT_EMAIL,
  EXCERPT_LENGTH,
  META_DESCRIPTION_LENGTH,
  PODCAST_COVER,
  RSS_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TELEGRAM_URL,
} from '@/lib/site';

export type PublicEpisode = {
  slug: string;
  guid: string;
  title: string;
  description: string;
  excerpt: string;
  publishDate: string;
  durationSec: number;
  durationFormatted: string;
  season: number;
  episodeNumber: number;
  imageUrl: string;
  audioUrl: string;
  url: string;
  markdownUrl: string;
  transcriptUrl: string | null;
  hasTranscript: boolean;
};

export function getExcerpt(ep: Episode, maxLen = EXCERPT_LENGTH): string {
  const plain = stripHtml(ep.description);
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function getMetaDescription(ep: Episode): string {
  return stripHtml(ep.description).slice(0, META_DESCRIPTION_LENGTH);
}

export function episodeToPublic(
  ep: Episode,
  hasTranscript = false,
  transcriptUrl: string | null = null,
): PublicEpisode {
  const slug = generateSlug(ep);
  return {
    slug,
    guid: ep.guid,
    title: ep.title,
    description: stripHtml(ep.description),
    excerpt: getExcerpt(ep),
    publishDate: ep.publishDate.toISOString(),
    durationSec: ep.durationSec,
    durationFormatted: ep.durationSec > 0 ? formatDuration(ep.durationSec) : '',
    season: ep.season,
    episodeNumber: ep.episodeNumber,
    imageUrl: ep.imageUrl,
    audioUrl: ep.audioUrl,
    url: `${SITE_URL}/episodes/${slug}`,
    markdownUrl: `${SITE_URL}/episodes/${slug}/md`,
    transcriptUrl,
    hasTranscript,
  };
}

export function durationIso(sec: number): string | undefined {
  if (!sec) return undefined;
  return `PT${Math.floor(sec / 60)}M${sec % 60}S`;
}

export function buildPodcastSeriesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: PODCAST_COVER,
    inLanguage: 'ru',
    webFeed: `${SITE_URL}/feed.xml`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildItemListJsonLd(episodes: Episode[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Эпизоды подкаста ${SITE_NAME}`,
    numberOfItems: episodes.length,
    itemListElement: episodes.map((ep, i) => {
      const slug = generateSlug(ep);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: ep.title,
        url: `${SITE_URL}/episodes/${slug}`,
      };
    }),
  };
}

export function buildEpisodeJsonLd(
  ep: Episode,
  slug: string,
  options?: { transcriptUrl?: string; fullDescription?: boolean },
) {
  const plainDescription = options?.fullDescription
    ? stripHtml(ep.description)
    : getMetaDescription(ep);
  const episodeUrl = `${SITE_URL}/episodes/${slug}`;
  const isoDuration = durationIso(ep.durationSec);

  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: ep.title,
    url: episodeUrl,
    episodeNumber: ep.episodeNumber || undefined,
    datePublished: ep.publishDate.toISOString().split('T')[0],
    description: plainDescription,
    image: ep.imageUrl,
    timeRequired: isoDuration,
    ...(options?.transcriptUrl && { transcript: options.transcriptUrl }),
    audio: {
      '@type': 'AudioObject',
      contentUrl: ep.audioUrl,
      encodingFormat: 'audio/mpeg',
      duration: isoDuration,
    },
    ...(ep.season > 0 && {
      seasonNumber: ep.season,
      partOfSeason: {
        '@type': 'PodcastSeason',
        seasonNumber: ep.season,
        partOfSeries: {
          '@type': 'PodcastSeries',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
    }),
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: SITE_NAME,
      url: SITE_URL,
      webFeed: `${SITE_URL}/feed.xml`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildBreadcrumbJsonLd(ep: Episode, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: ep.title,
        item: `${SITE_URL}/episodes/${slug}`,
      },
    ],
  };
}

export function episodeToMarkdown(
  ep: Episode,
  slug: string,
  transcript: string | null,
): string {
  const lines = [
    `# ${ep.title}`,
    '',
    `- **Подкаст:** ${SITE_NAME}`,
    `- **URL:** ${SITE_URL}/episodes/${slug}`,
    ...(ep.episodeNumber > 0 ? [`- **Эпизод:** ${ep.episodeNumber}`] : []),
    ...(ep.season > 0 ? [`- **Сезон:** ${ep.season}`] : []),
    `- **Дата:** ${formatDate(ep.publishDate)}`,
    ...(ep.durationSec > 0
      ? [`- **Длительность:** ${formatDuration(ep.durationSec)}`]
      : []),
    `- **Аудио (MP3):** ${ep.audioUrl}`,
    `- **RSS:** ${RSS_URL}`,
    '',
    '## Описание',
    '',
    stripHtml(ep.description),
  ];

  if (transcript) {
    lines.push('', '## Транскрипт', '', transcript);
  }

  return lines.join('\n');
}

export function buildLlmsTxt(episodes: Episode[]): string {
  const latest = episodes.slice(0, 30);
  const episodeLines = latest.map((ep) => {
    const slug = generateSlug(ep);
    const excerpt = getExcerpt(ep, 100);
    return `- [${ep.title}](${SITE_URL}/episodes/${slug}): ${excerpt} — [markdown](${SITE_URL}/episodes/${slug}/md)`;
  });

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `${SITE_NAME} — русскоязычный разговорный подкаст. Каталог эпизодов с описаниями, MP3 и машиночитаемыми форматами для AI-агентов.`,
    '',
    '## Основное',
    '',
    `- [Главная — все эпизоды](${SITE_URL}/)`,
    `- [О подкасте](${SITE_URL}/about)`,
    `- [JSON API — все эпизоды](${SITE_URL}/api/episodes)`,
    `- [RSS / feed.xml](${SITE_URL}/feed.xml)`,
    `- [Apple Podcasts](https://podcasts.apple.com/podcast/id1753575420)`,
    `- [Telegram](${TELEGRAM_URL})`,
    `- Email: ${CONTACT_EMAIL}`,
    '',
    '## Эпизоды',
    '',
    ...episodeLines,
    ...(episodes.length > 30
      ? [
          '',
          `…и ещё ${episodes.length - 30} эпизодов — полный список в [JSON API](${SITE_URL}/api/episodes).`,
        ]
      : []),
    '',
    '## Для агентов',
    '',
    '- Каждый эпизод: `/episodes/{slug}` (HTML), `/episodes/{slug}/md` (Markdown)',
    '- Транскрипты (если есть): `public/transcripts/{slug}.md` — поле `hasTranscript` в API',
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    '- Schema.org: PodcastSeries, PodcastEpisode, ItemList',
    '',
  ].join('\n');
}
