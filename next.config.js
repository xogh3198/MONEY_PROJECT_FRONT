/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/news/:path*',
        destination: `${process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://43.200.177.146:8083'}/api/news/:path*`,
      },
      {
        source: '/api/market/:path*',
        destination: `${process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://43.200.177.146:8083'}/api/market/:path*`,
      },
      {
        source: '/api/forum/:path*',
        destination: `${process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://43.200.177.146:8083'}/api/forum/:path*`,
      },
      {
        source: '/api/dividends/:path*',
        destination: `${process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://43.200.177.146:8080'}/api/dividends/:path*`,
      },
      {
        source: '/api/portfolios/:path*',
        destination: `${process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://43.200.177.146:8080'}/api/portfolios/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://43.200.177.146:8080'}/api/auth/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://43.200.177.146:8080'}/api/admin/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
