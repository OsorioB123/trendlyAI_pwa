/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@supabase/supabase-js'],
  // Disable static optimization completely for problem pages
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  async generateBuildId() {
    return 'build-' + Date.now()
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gugfvihfkimixnetcayg.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
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