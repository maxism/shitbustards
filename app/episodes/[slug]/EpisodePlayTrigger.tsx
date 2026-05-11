'use client';

import type { Episode } from '@/lib/episodes';
import { formatDuration } from '@/lib/episodes';

export function EpisodePlayTrigger({ episode }: { episode: Episode }) {
  return (
    <div
      className="ep"
      data-audio={episode.audioUrl}
      data-title={episode.title}
      data-dur={episode.durationSec}
      data-image={episode.imageUrl}
      style={{ display: 'contents' }}
    >
      <button className="episode__play-btn" aria-label={`Слушать: ${episode.title}`}>
        <svg viewBox="0 0 52 52" fill="none" width="22" height="22" aria-hidden="true">
          <circle cx="26" cy="26" r="26" fill="currentColor" />
          <polygon points="21,17 38,26 21,35" fill="#000" />
        </svg>
        Слушать · {formatDuration(episode.durationSec)}
      </button>
    </div>
  );
}
