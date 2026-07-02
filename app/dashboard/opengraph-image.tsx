import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'AI Usage Dashboard',
        subtitle: 'Monitor token consumption, costs, and latency metrics in real time',
        icon: '📊',
        accentColor: '#f59e0b',
    });
}
