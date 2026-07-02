import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'Santa Cruz Mobility Evolution',
        subtitle: 'Interactive transit dashboard with real-time maps, ridership data, and corridor analysis',
        icon: '🚌',
        accentColor: '#06b6d4',
    });
}
