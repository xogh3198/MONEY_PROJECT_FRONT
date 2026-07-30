/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      '/briefing',
      '/calendar',
      '/dividend',
      '/guides',
      '/methodology',
      '/market',
      '/search',
      '/tools',
    ].map((source) => ({
      source: `${source}/:path*`,
      destination: '/forum',
      permanent: false,
    }));
  },
};

module.exports = nextConfig;
