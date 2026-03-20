import type { Metadata } from 'next';
import DashboardDemo from './DashboardDemo';

export const metadata: Metadata = {
    title: 'AI Usage Analytics Dashboard | AI Kit',
    description:
        'Monitor AI model usage, token consumption, and performance metrics with real-time analytics dashboard components from AI Kit.',
    keywords: [
        'AI analytics dashboard',
        'AI usage monitoring',
        'token tracking',
        'AI metrics',
        'AI Kit dashboard',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/dashboard' },
};

export default function DashboardPage() {
    return <DashboardDemo />;
}
