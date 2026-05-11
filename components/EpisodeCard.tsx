import type { Episode } from '@/lib/episodes';
import { formatDate, formatDuration } from '@/lib/episodes';

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article
      className="ep"
      data-audio={episode.audioUrl}
      data-title={episode.title}
      data-dur={episode.durationSec}
      data-image={episode.imageUrl}
    >
      <div className="ep__thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={episode.imageUrl}
          alt={episode.title}
          loading="lazy"
        />
        <div className="ep__play-btn" aria-hidden="true">
          <svg className="icon-play" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.9)" />
            <polygon points="21,17 38,26 21,35" fill="#000" />
          </svg>
          <svg className="icon-pause" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.9)" />
            <rect x="17" y="16" width="6" height="20" rx="1" fill="#000" />
            <rect x="29" y="16" width="6" height="20" rx="1" fill="#000" />
          </svg>
        </div>
        <div className="ep__watermark">
          <div className="ep__wm-text">
            ШИТБА
            <br />
            СТАРДС
          </div>
        </div>
        {episode.durationSec > 0 && (
          <div className="ep__dur">{formatDuration(episode.durationSec)}</div>
        )}
      </div>
      <div className="ep__info">
        {episode.episodeNumber > 0 && (
          <span className="ep__num">Эп. {episode.episodeNumber}</span>
        )}
        <span className="ep__title">{episode.title}</span>
        <span className="ep__date">{formatDate(episode.publishDate)}</span>
      </div>
    </article>
  );
}
