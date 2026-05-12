'use client';

import type { Episode } from '@/lib/episodes';

interface PlayButtonProps {
  episode: Pick<Episode, 'guid' | 'audioUrl' | 'title' | 'durationSec' | 'imageUrl'>;
}

export function PlayButton({ episode }: PlayButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
      className="ep__play-btn"
      onClick={handleClick}
      aria-label={`Воспроизвести: ${episode.title}`}
    >
      <svg className="icon-play" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.9)" />
        <polygon points="21,17 38,26 21,35" fill="#000" />
      </svg>
      <svg className="icon-pause" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.9)" />
        <rect x="17" y="16" width="6" height="20" rx="1" fill="#000" />
        <rect x="29" y="16" width="6" height="20" rx="1" fill="#000" />
      </svg>
    </button>
  );
}
