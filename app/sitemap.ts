import { MetadataRoute } from 'next';

const BASE = 'https://aikit.ainative.studio';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();
    return [
        { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE}/streaming`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE}/agents`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE}/safety`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ];
}
