import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'AI Data Room Hackathon',
        subtitle: 'Live AI-powered data room reconstruction with document analysis and entity extraction',
        icon: '🏗️',
        accentColor: '#ef4444',
    });
}
