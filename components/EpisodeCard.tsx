import Link from 'next/link';
import type { Episode } from '@/lib/episodes';
import { formatDate, formatDuration, generateSlug } from '@/lib/episodes';
import { PlayButton } from '@/components/PlayButton';

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="ep" data-guid={episode.guid}>
      <div className="ep__thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={episode.imageUrl} alt={episode.title} loading="lazy" />
        <PlayButton episode={episode} />
        {episode.durationSec > 0 && (
          <div className="ep__dur">{formatDuration(episode.durationSec)}</div>
        )}
      </div>

      <Link href={`/episodes/${generateSlug(episode)}`} className="ep__info">
        {episode.episodeNumber > 0 && (
          <span className="ep__num">Эп. {episode.episodeNumber}</span>
        )}
        <h2 className="ep__title">{episode.title}</h2>
        <time className="ep__date" dateTime={episode.publishDate.toISOString()}>
          {formatDate(episode.publishDate)}
        </time>
      </Link>
    </article>
  );
}
