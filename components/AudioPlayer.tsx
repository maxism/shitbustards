'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

function fmtTime(s: number): string {
  s = Math.floor(s || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('0:00 / 0:00');
  const currentCardRef = useRef<HTMLElement | null>(null);

  const updateSeekStyle = useCallback((pct: number) => {
    seekRef.current?.style.setProperty('--seek-pct', `${pct}%`);
  }, []);

  useEffect(() => {
    function handleEpisodeClick(e: MouseEvent) {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.ep');
      if (!card?.dataset.audio) return;

      const audio = audioRef.current!;
      const audioUrl = card.dataset.audio!;
      const episodeTitle = card.dataset.title ?? '';
      const dur = parseInt(card.dataset.dur ?? '0', 10);

      if (currentCardRef.current === card) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
        return;
      }

      currentCardRef.current?.classList.remove('is-playing');
      currentCardRef.current = card;
      card.classList.add('is-playing');

      audio.src = audioUrl;
      audio.load();
      audio.play().catch(() => {});

      setTitle(episodeTitle);
      setTime(`0:00 / ${fmtTime(dur)}`);
      updateSeekStyle(0);
      if (seekRef.current) seekRef.current.value = '0';
      setVisible(true);
      setPlaying(true);
    }

    document.addEventListener('click', handleEpisodeClick);
    return () => document.removeEventListener('click', handleEpisodeClick);
  }, [updateSeekStyle]);

  useEffect(() => {
    const audio = audioRef.current!;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (seekRef.current) seekRef.current.value = String(pct);
      updateSeekStyle(pct);
      setTime(`${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration)}`);
    };

    const onPlay = () => {
      setPlaying(true);
      currentCardRef.current?.classList.add('is-playing');
    };

    const onPause = () => {
      setPlaying(false);
      currentCardRef.current?.classList.remove('is-playing');
    };

    const onEnded = () => {
      setPlaying(false);
      currentCardRef.current?.classList.remove('is-playing');
      if (seekRef.current) seekRef.current.value = '0';
      updateSeekStyle(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [updateSeekStyle]);

  function togglePlay() {
    const audio = audioRef.current!;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const pct = Number(e.target.value);
    updateSeekStyle(pct);
    const audio = audioRef.current!;
    if (audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
    }
  }

  function close() {
    const audio = audioRef.current!;
    audio.pause();
    audio.src = '';
    currentCardRef.current?.classList.remove('is-playing');
    currentCardRef.current = null;
    setVisible(false);
    setPlaying(false);
  }

  return (
    <>
      <audio ref={audioRef} preload="none" />
      <div className={`player${visible ? ' is-visible' : ''}${playing ? ' is-playing' : ''}`}>
        <div className="player__inner">
          <button className="player__playbtn" onClick={togglePlay} aria-label={playing ? 'Пауза' : 'Воспроизвести'}>
            <svg className="icon-play" viewBox="0 0 18 18" fill="none">
              <polygon points="4,2 16,9 4,16" fill="#111" />
            </svg>
            <svg className="icon-pause" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="2" width="4" height="14" rx="1" fill="#111" />
              <rect x="11" y="2" width="4" height="14" rx="1" fill="#111" />
            </svg>
          </button>

          <div className="player__track">
            <div className="player__title">{title}</div>
            <input
              ref={seekRef}
              className="player__seek"
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              step="0.1"
              onChange={handleSeek}
              aria-label="Прогресс воспроизведения"
            />
          </div>

          <span className="player__time">{time}</span>

          <button className="player__close" onClick={close} aria-label="Закрыть плеер">
            ×
          </button>
        </div>
      </div>
    </>
  );
}
