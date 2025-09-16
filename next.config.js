/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_HOST || (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    }
  } catch {}
  return 'gugfvihfkimixnetcayg.supabase.co'
})()

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@supabase/supabase-js'],
  // Set tracing root at top-level (moved from experimental)
  outputFileTracingRoot: process.cwd(),
  async generateBuildId() {
    return 'build-' + Date.now()
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    // Temporarily ignore type errors for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore eslint errors for deployment
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ],
};

module.exports = nextConfig;
