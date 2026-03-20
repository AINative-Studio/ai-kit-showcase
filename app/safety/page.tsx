import type { Metadata } from 'next';
import SafetyDemo from './SafetyDemo';

export const metadata: Metadata = {
    title: 'AI Safety & Content Moderation Demo | AI Kit',
    description:
        'Production-ready AI safety guardrails with content filtering, rate limiting, and moderation. Built-in safety features for responsible AI deployment.',
    keywords: [
        'AI safety',
        'content moderation AI',
        'AI guardrails',
        'responsible AI',
        'AI Kit safety',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/safety' },
};

export default function SafetyPage() {
    return <SafetyDemo />;
}
