import { ImageResponse } from 'next/og';

export const alt = 'ШИТБАСТАРДС — подкаст';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COVER =
  'https://cdn.mave.digital/storage/podcasts/6dad6969-58b3-471d-a5ec-acfd78f36b52/images/dc158682-183d-443a-a41b-234d02225150_600.png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#0a0a0a',
        }}
      >
        {/* Левая половина — обложка подкаста */}
        <img
          src={COVER}
          width={630}
          height={630}
          style={{ objectFit: 'cover', flexShrink: 0 }}
        />

        {/* Правая половина — текст */}
        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 56px',
            background: '#0a0a0a',
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 0.82,
              color: '#fef2e2',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            ШИТБА
            СТАРДС
          </div>

          <div
            style={{
              marginTop: 32,
              width: 32,
              height: 2,
              background: '#fef2e2',
            }}
          />

          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.45,
              color: '#a3a3a3',
            }}
          >
            Некультурно-разговорный подкаст про жизнь,
            технологии, музыку и всё подряд.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
