import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://investboard.cloud', lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: 'https://investboard.cloud/forum', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://investboard.cloud/market', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://investboard.cloud/dividend', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://investboard.cloud/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
