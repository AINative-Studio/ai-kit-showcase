'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Sparkles,
    Code2,
    FileText,
    BarChart,
    Loader2,
    Settings2,
    ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { STREAMING_EXAMPLES } from '@/lib/mock-data';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

const EXAMPLE_PROMPTS = [
    { id: 'code', label: 'Code', icon: Code2, prompt: 'Write a React hook for debouncing' },
    { id: 'markdown', label: 'Markdown', icon: FileText, prompt: 'Explain the benefits of AI Kit' },
    { id: 'analysis', label: 'Analysis', icon: BarChart, prompt: 'Analyze these sales numbers' },
];

export default function StreamingPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [speed, setSpeed] = useState(20);
    const [showSettings, setShowSettings] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content: string, exampleId?: string) => {
        if (!content.trim() || isStreaming) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Create assistant message placeholder
        const assistantId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsStreaming(true);

        try {
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    exampleId,
                    speed,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (!data.done) {
                                accumulatedContent += data.content;
                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === assistantId
                                            ? { ...msg, content: accumulatedContent }
                                            : msg
                                    )
                                );
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            // Mark streaming as complete
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, isStreaming: false }
                        : msg
                )
            );
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Streaming error:', error);
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    const handleExampleClick = (example: typeof EXAMPLE_PROMPTS[0]) => {
        sendMessage(example.prompt, example.id);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Streaming Demo</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Real-time Chat Streaming</h1>
                <p className="text-muted-foreground">
                    Experience AI Kit&apos;s streaming capabilities with real-time message rendering,
                    markdown support, and code highlighting.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chat Area */}
                <div className="lg:col-span-2">
                    <Card className="h-[600px] flex flex-col">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                        <Sparkles className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm">
                                        Try one of the example prompts or type your own message to see streaming in action.
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                'flex',
                                                message.role === 'user' ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'max-w-[85%] rounded-2xl px-4 py-3',
                                                    message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                )}
                                            >
                                                <MessageContent
                                                    content={message.content}
                                                    isStreaming={message.isStreaming}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Example Prompts */}
                        {messages.length === 0 && (
                            <div className="px-4 pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {EXAMPLE_PROMPTS.map((example) => (
                                        <button
                                            key={example.id}
                                            onClick={() => handleExampleClick(example)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                                        >
                                            <example.icon className="w-3.5 h-3.5" />
                                            {example.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage(input);
                                }}
                                className="flex gap-2"
                            >
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="min-h-[44px] max-h-32 resize-none"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(input);
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isStreaming}
                                    className="shrink-0"
                                >
                                    {isStreaming ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings Card */}
                    <Card>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="w-full flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Settings2 className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Stream Settings</span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 text-muted-foreground transition-transform',
                                    showSettings && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 space-y-4">
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">
                                                Streaming Speed: {speed}ms
                                            </label>
                                            <input
                                                type="range"
                                                min="5"
                                                max="100"
                                                value={speed}
                                                onChange={(e) => setSpeed(Number(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>Fast</span>
                                                <span>Slow</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* Features Card */}
                    <Card>
                        <h3 className="font-semibold mb-4">AI Kit Features Used</h3>
                        <div className="space-y-3">
                            <FeatureItem
                                title="useAIStream"
                                description="Hook for managing stream state"
                                badge="Hook"
                            />
                            <FeatureItem
                                title="StreamingMessage"
                                description="Real-time message rendering"
                                badge="Component"
                            />
                            <FeatureItem
                                title="MarkdownRenderer"
                                description="Rich text formatting"
                                badge="Component"
                            />
                            <FeatureItem
                                title="CodeBlock"
                                description="Syntax highlighting"
                                badge="Component"
                            />
                        </div>
                    </Card>

                    {/* Code Preview */}
                    <Card className="code-block">
                        <h3 className="font-semibold mb-4 text-foreground">Quick Start</h3>
                        <pre className="text-xs overflow-x-auto">
                            <code>{`import { useAIStream } from '@ainative/ai-kit';

const { stream, isStreaming } = useAIStream({
  url: '/api/chat',
  onChunk: (chunk) => {
    setContent(prev => prev + chunk);
  },
});`}</code>
                        </pre>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MessageContent({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
    // Simple markdown rendering
    const renderMarkdown = (text: string) => {
        // Handle code blocks
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
                if (match) {
                    const language = match[1] || '';
                    const code = match[2] || '';
                    return (
                        <div key={index} className="my-3 rounded-lg overflow-hidden">
                            {language && (
                                <div className="bg-muted/50 px-3 py-1 text-xs text-muted-foreground border-b border-border">
                                    {language}
                                </div>
                            )}
                            <pre className="bg-muted p-3 overflow-x-auto">
                                <code className="text-sm font-mono">{code}</code>
                            </pre>
                        </div>
                    );
                }
            }

            // Handle inline formatting
            let formatted = part
                // Bold
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                // Italic
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                // Inline code
                .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                // Headers
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
                // Lists
                .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                // Line breaks
                .replace(/\n/g, '<br />');

            return (
                <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
    };

    return (
        <div className="prose prose-sm prose-invert max-w-none">
            {renderMarkdown(content)}
            {isStreaming && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
        </div>
    );
}

function FeatureItem({
    title,
    description,
    badge,
}: {
    title: string;
    description: string;
    badge: string;
}) {
    return (
        <div className="flex items-start justify-between gap-2">
            <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Badge variant="primary">{badge}</Badge>
        </div>
    );
}
