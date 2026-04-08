import { MetadataRoute } from 'next';

const BASE = 'https://aikit.ainative.studio';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: BASE, lastModified: '2026-03-20', changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE}/streaming`, lastModified: '2026-03-15', changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE}/agents`, lastModified: '2026-03-15', changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE}/safety`, lastModified: '2026-03-15', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE}/dashboard`, lastModified: '2026-03-15', changeFrequency: 'monthly', priority: 0.7 },
    ];
}
