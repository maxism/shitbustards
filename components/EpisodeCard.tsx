import Link from 'next/link';
import type { Episode } from '@/lib/episodes';
import { formatDate, formatDuration, safeToISOString } from '@/lib/episodes';
import { getExcerpt } from '@/lib/episode-public';
import { isEpisodeNew } from '@/lib/episode-ui';
import { PlayButton } from '@/components/PlayButton';

export function EpisodeCard({ episode }: { episode: Episode }) {
  const excerpt = getExcerpt(episode, 100);

  return (
    <article className="ep" data-guid={episode.guid}>
      <div className="ep__thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={episode.imageUrl} alt={episode.title} loading="lazy" />
        <PlayButton episode={episode} />
        {isEpisodeNew(episode) && <span className="ep__badge">Новый</span>}
        {episode.durationSec > 0 && (
          <div className="ep__dur">{formatDuration(episode.durationSec)}</div>
        )}
      </div>

      <Link href={`/episodes/${episode.slug}`} className="ep__info">
        {episode.episodeNumber > 0 && (
          <span className="ep__num">Эп. {episode.episodeNumber}</span>
        )}
        <h2 className="ep__title">{episode.title}</h2>
        {excerpt && <p className="ep__excerpt">{excerpt}</p>}
        {formatDate(episode.publishDate) && (
          <time
            className="ep__date"
            dateTime={safeToISOString(episode.publishDate)}
          >
            {formatDate(episode.publishDate)}
          </time>
        )}
      </Link>
    </article>
  );
}
