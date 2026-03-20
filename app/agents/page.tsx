import type { Metadata } from 'next';
import AgentsDemo from './AgentsDemo';

export const metadata: Metadata = {
    title: 'Multi-Agent AI Orchestration Demo | AI Kit',
    description:
        'Build multi-agent AI systems with specialized agents for customer support, code assistance, and creative writing. Powered by AI Kit agent orchestration.',
    keywords: [
        'multi-agent AI',
        'agent orchestration',
        'AI agent framework',
        'React AI agents',
        'AI Kit agents',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/agents' },
};

export default function AgentsPage() {
    return <AgentsDemo />;
}
