import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://money-project-five.vercel.app', lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: 'https://money-project-five.vercel.app/forum', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://money-project-five.vercel.app/market', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://money-project-five.vercel.app/dividend', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: 'https://money-project-five.vercel.app/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
