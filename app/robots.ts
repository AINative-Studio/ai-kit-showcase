import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: '*', allow: '/', disallow: ['/api/'] },
            {
                userAgent: ['GPTBot', 'anthropic-ai', 'Claude-Web', 'CCBot', 'Google-Extended'],
                allow: '/',
            },
        ],
        sitemap: 'https://aikit.ainative.studio/sitemap.xml',
    };
}
