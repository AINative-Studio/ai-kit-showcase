import type { Metadata } from 'next';
import StreamingDemo from './StreamingDemo';

export const metadata: Metadata = {
    title: 'AI Streaming Chat Demo | AI Kit',
    description:
        'Real-time streaming AI chat with markdown rendering, code highlighting, and typing indicators. Built with React hooks from @ainative/ai-kit.',
    keywords: [
        'AI streaming chat',
        'React AI hooks',
        'real-time AI chat',
        'useAIChat hook',
        'AI Kit streaming',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/streaming' },
};

export default function StreamingPage() {
    return <StreamingDemo />;
}
