import { ImageResponse } from 'next/og';
import { getEpisodeBySlug, formatDuration } from '@/lib/episodes';

export const runtime = 'edge';
export const alt = 'ШИТБАСТАРДС';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = await getEpisodeBySlug(slug);

  if (!ep) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fef2e2',
            fontSize: 48,
          }}
        >
          ШИТБАСТАРДС
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '60px',
        }}
      >
        {/* Decorative gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)',
          }}
        />

        {/* Episode artwork */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px',
            height: '280px',
            borderRadius: '24px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ep.imageUrl}
            width={280}
            height={280}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: '48px',
            flex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                color: '#f97316',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              ШИТБАСТАРДС
            </span>
            {ep.episodeNumber > 0 && (
              <span style={{ fontSize: '18px', color: '#888' }}>
                · Эп. {ep.episodeNumber}
              </span>
            )}
            {ep.durationSec > 0 && (
              <span style={{ fontSize: '18px', color: '#888' }}>
                · {formatDuration(ep.durationSec)}
              </span>
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: ep.title.length > 60 ? '36px' : '44px',
              fontWeight: 700,
              color: '#fef2e2',
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {ep.title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
