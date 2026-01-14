import { NextRequest, NextResponse } from 'next/server';
import { STREAMING_EXAMPLES } from '@/lib/mock-data';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { message, exampleId, speed = 30 } = await req.json();

        // Find matching example or use default
        const example = STREAMING_EXAMPLES.find(e => e.id === exampleId);
        const responseText = example?.response || generateResponse(message);

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const words = responseText.split('');

                for (let i = 0; i < words.length; i++) {
                    const chunk = words[i];

                    // Send as SSE format
                    const data = JSON.stringify({
                        content: chunk,
                        done: false,
                    });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                    // Variable delay for natural feel
                    const delay = chunk === ' ' ? speed / 2 : speed;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                // Send done signal
                const doneData = JSON.stringify({ content: '', done: true });
                controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

function generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return `Hello! I'm an AI assistant powered by **AI Kit**. I can help you with:

- Writing code and explaining concepts
- Answering questions
- Creative tasks

What would you like to explore today?`;
    }

    if (lowerMessage.includes('code') || lowerMessage.includes('function')) {
        return `Here's a helpful code example:

\`\`\`typescript
// Example: Debounce hook
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
\`\`\`

This hook is useful for search inputs and form validation!`;
    }

    return `Thanks for your message! This demo showcases **AI Kit's streaming capabilities**:

1. **Real-time rendering** - Text appears as it's generated
2. **Markdown support** - Full formatting including \`code\`, **bold**, and *italics*
3. **Code highlighting** - Syntax-highlighted code blocks
4. **Customizable speed** - Adjust the streaming animation

Try the example prompts above to see different response types!`;
}
