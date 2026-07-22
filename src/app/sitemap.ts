import { MetadataRoute } from 'next';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: 'https://investboard.cloud', lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: 'https://investboard.cloud/briefing', lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: 'https://investboard.cloud/forum', lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: 'https://investboard.cloud/market', lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: 'https://investboard.cloud/calendar', lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://investboard.cloud/tools', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://investboard.cloud/guides', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://investboard.cloud/methodology', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://investboard.cloud/dividend', lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    ...GUIDES.map(guide => ({
      url: `https://investboard.cloud/guides/${guide.slug}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
