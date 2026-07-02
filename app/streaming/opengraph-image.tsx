import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'AI Streaming Chat',
        subtitle: 'Real-time streaming with markdown, code highlighting, and typing indicators',
        icon: '💬',
        accentColor: '#3b82f6',
    });
}
