import { generateOgImage, size, contentType } from '@/lib/og-image';

export { size, contentType };
export const runtime = 'edge';

export default function Image() {
    return generateOgImage({
        title: 'Multi-Agent Orchestration',
        subtitle: 'Build specialized AI agent systems with routing, tool execution, and handoffs',
        icon: '🤖',
        accentColor: '#8b5cf6',
    });
}
