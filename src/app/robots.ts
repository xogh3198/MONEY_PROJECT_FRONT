import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/content-studio', '/api/', '/login'] },
    sitemap: 'https://investboard.cloud/sitemap.xml',
  };
}
