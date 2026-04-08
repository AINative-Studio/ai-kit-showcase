import type { Metadata } from 'next';
import AgentsDemo from './AgentsDemo';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

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
    const breadcrumbItems = [{ label: 'Agent System' }];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <AgentsDemo />

            {/* Server-rendered SEO content */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AI Kit&apos;s agent orchestration system lets you define multiple
                        specialized AI agents and coordinate them through a central router. Each
                        agent has its own system prompt, tool set, and behavioral constraints.
                        When a user sends a message, the orchestrator analyzes the intent and
                        routes it to the most appropriate agent. If the task spans multiple
                        domains, agents can hand off to each other seamlessly while maintaining
                        full conversation context.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        The framework provides built-in support for tool execution, allowing
                        agents to call external APIs, query databases, or perform computations
                        mid-conversation. Each tool call is displayed to the user with real-time
                        progress indicators, so they can see exactly what the agent is doing.
                        The orchestrator manages concurrency, error recovery, and timeout
                        handling automatically. You define your agents declaratively using a
                        simple configuration object, and AI Kit handles the complex state
                        management, message routing, and UI rendering. The agent system supports
                        both sequential workflows where agents pass results along a chain, and
                        parallel execution where multiple agents work on sub-tasks simultaneously
                        before merging their results.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Customer support triage</strong> with specialized agents for billing, technical issues, and account management that route automatically.</li>
                        <li><strong>Software development assistants</strong> combining a code-writing agent, a testing agent, and a review agent in a single workflow.</li>
                        <li><strong>Research pipelines</strong> where a search agent gathers sources, an analysis agent extracts insights, and a writing agent produces reports.</li>
                        <li><strong>E-commerce concierge</strong> with product recommendation, inventory lookup, and order management agents working together.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Integration Guide</h2>
                    <p className="text-muted-foreground mb-4">
                        Define your agents and let AI Kit orchestrate them:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import { AgentOrchestrator, defineAgent } from '@ainative/ai-kit';

const supportAgent = defineAgent({
  name: 'support',
  description: 'Handles customer support queries',
  systemPrompt: 'You are a helpful support agent...',
  tools: [lookupOrder, checkStatus, createTicket],
});

const codeAgent = defineAgent({
  name: 'coder',
  description: 'Writes and reviews code',
  systemPrompt: 'You are an expert programmer...',
  tools: [runCode, lintCode, searchDocs],
});

function AgentChat() {
  return (
    <AgentOrchestrator
      agents={[supportAgent, codeAgent]}
      routingStrategy="intent-based"
      onAgentSwitch={(from, to) => console.log(from, '->', to)}
    />
  );
}`}</code>
                    </pre>
                </div>
            </section>
        </>
    );
}
