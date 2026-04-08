import type { Metadata } from 'next';
import StreamingDemo from './StreamingDemo';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

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
    const breadcrumbItems = [{ label: 'Streaming Chat' }];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <StreamingDemo />

            {/* Server-rendered SEO content */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AI Kit&apos;s streaming chat component uses server-sent events (SSE) to
                        deliver AI-generated responses token by token in real time. When a user
                        sends a message, the <code className="bg-muted px-1 rounded">useConversation</code> hook
                        establishes a persistent connection to your backend API endpoint. As the
                        language model generates each token, it is pushed to the client immediately,
                        creating a natural typing effect that keeps users engaged while waiting for
                        the full response.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        The streaming renderer handles markdown parsing on the fly, including
                        fenced code blocks with syntax highlighting, inline formatting such as bold
                        and italic text, ordered and unordered lists, and even tables. Code blocks
                        are rendered with language-aware syntax highlighting powered by Prism.js,
                        making the component ideal for developer-facing applications. The component
                        also manages scroll behavior automatically, keeping the latest content
                        visible while allowing users to scroll up through conversation history
                        without interruption. Error handling, retry logic, and connection
                        management are all built in so you can focus on your application logic
                        rather than infrastructure plumbing.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Customer support chatbots</strong> that stream answers from your knowledge base with citations and source links.</li>
                        <li><strong>Code assistants</strong> that generate, explain, and refactor code in real time with syntax-highlighted output.</li>
                        <li><strong>Content writing tools</strong> that stream drafts paragraph by paragraph, letting users edit while generation continues.</li>
                        <li><strong>Educational tutors</strong> that provide step-by-step explanations with LaTeX math rendering and interactive examples.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Integration Guide</h2>
                    <p className="text-muted-foreground mb-4">
                        Install AI Kit and connect your streaming endpoint in under five minutes:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import { useConversation, StreamingMessage } from '@ainative/ai-kit';

function StreamingChat() {
  const { messages, send, isStreaming } = useConversation({
    url: '/api/chat',
    onError: (err) => console.error('Stream error:', err),
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <StreamingMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}
      </div>
      <ChatInput onSend={send} disabled={isStreaming} />
    </div>
  );
}`}</code>
                    </pre>
                </div>
            </section>
        </>
    );
}
