import type { NextConfig } from 'next';

const isStaticExport = !!process.env.STATIC_EXPORT;

const nextConfig: NextConfig = {
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.mave.digital' },
    ],
  },
};

export default nextConfig;
