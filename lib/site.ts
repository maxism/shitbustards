export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shitbustards.ru';

export const SITE_NAME = 'ШИТБАСТАРДС';

export const SITE_TAGLINE = 'подкаст';

export const SITE_DESCRIPTION =
  'Некультурно-разговорный подкаст про жизнь, технологии, музыку и всё подряд. Два ведущих, ноль сценария, без фильтров.';

export const RSS_URL = 'https://cloud.mave.digital/54964';

export const PODCAST_COVER =
  'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png';

export const CONTACT_EMAIL = 'info@shitbustards.ru';

export const TELEGRAM_URL = 'https://t.me/shitbustards';

export const YOUTUBE_URL = 'https://www.youtube.com/@shitbustards';

export const EXCERPT_LENGTH = 180;

export const META_DESCRIPTION_LENGTH = 160;

export const HOSTS = [
  {
    name: 'Макс Ульянов',
    role: 'Ведущий',
    url: 'https://mxsm.me',
    avatar: '/hosts/max.png',
  },
  {
    name: 'Майк Жарчев',
    role: 'Ведущий',
    avatar: '/hosts/mike.png',
  },
] as const;
