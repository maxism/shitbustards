const isStaticExport = !!process.env.STATIC_EXPORT;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.mave.digital' }],
  },
};

export default nextConfig;
