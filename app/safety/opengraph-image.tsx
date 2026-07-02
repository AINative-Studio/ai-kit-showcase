import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'AI Safety & Moderation',
        subtitle: 'Production guardrails with PII detection, injection protection, and rate limiting',
        icon: '🛡️',
        accentColor: '#10b981',
    });
}
