import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: 'https://investboard.cloud', lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: 'https://investboard.cloud/forum', lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: 'https://investboard.cloud/forum/community', lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://investboard.cloud/promotion-map', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
