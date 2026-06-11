import Link from 'next/link';
import type { Episode } from '@/lib/episodes';
import { formatDate, safeToISOString } from '@/lib/episodes';
import { getExcerpt } from '@/lib/episode-public';
import { isEpisodeNew } from '@/lib/episode-ui';
import { PlayButton } from '@/components/PlayButton';

export function FeaturedEpisode({ episode }: { episode: Episode }) {
  const excerpt = getExcerpt(episode, 200);
  const publishDateIso = safeToISOString(episode.publishDate);

  return (
    <section className="featured" aria-label="Последний выпуск">
      <div className="featured__art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={episode.imageUrl} alt="" />
        <PlayButton episode={episode} />
        {isEpisodeNew(episode) && (
          <span className="featured__badge">Новый</span>
        )}
      </div>

      <div className="featured__body">
        <p className="featured__label">Последний выпуск</p>
        {episode.episodeNumber > 0 && (
          <span className="featured__num">Эп. {episode.episodeNumber}</span>
        )}
        <h2 className="featured__title">
          <Link href={`/episodes/${episode.slug}`}>{episode.title}</Link>
        </h2>
        {excerpt && <p className="featured__excerpt">{excerpt}</p>}
        <div className="featured__meta">
          {formatDate(episode.publishDate) && (
            <time dateTime={publishDateIso}>
              {formatDate(episode.publishDate)}
            </time>
          )}
        </div>
        <Link href={`/episodes/${episode.slug}`} className="featured__more">
          Подробнее →
        </Link>
      </div>
    </section>
  );
}
