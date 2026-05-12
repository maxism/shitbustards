'use client';

import type { Episode } from '@/lib/episodes';
import { formatDuration } from '@/lib/episodes';

export function EpisodePlayTrigger({ episode }: { episode: Episode }) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent('sb:play', {
        detail: {
          guid: episode.guid,
          audioUrl: episode.audioUrl,
          title: episode.title,
          durationSec: episode.durationSec,
          imageUrl: episode.imageUrl,
        },
      })
    );
  }

  return (
    <button
      className="episode__play-btn"
      onClick={handleClick}
      aria-label={`Слушать: ${episode.title}`}
    >
      <svg viewBox="0 0 52 52" fill="none" width="22" height="22" aria-hidden="true">
        <circle cx="26" cy="26" r="26" fill="currentColor" />
        <polygon points="21,17 38,26 21,35" fill="#000" />
      </svg>
      Слушать · {formatDuration(episode.durationSec)}
    </button>
  );
}
