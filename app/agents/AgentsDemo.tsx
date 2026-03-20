'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Search,
    Calculator,
    Code2,
    Play,
    CheckCircle2,
    Loader2,
    Clock,
    Sparkles,
    Users,
    Zap,
    Network,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface AgentStep {
    tool: string;
    status: 'pending' | 'running' | 'complete' | 'error';
    input?: string;
    output?: string;
    duration?: number;
}

interface SwarmAgent {
    id: string;
    name: string;
    role: string;
    status: 'idle' | 'thinking' | 'working' | 'complete';
    task?: string;
    output?: string;
    color: string;
}

type DemoMode = 'single' | 'swarm';

const SCENARIOS = [
    {
        id: 'research',
        title: 'Research Assistant',
        description: 'Multi-step research with web search and summarization',
        icon: Search,
        tools: ['web_search', 'summarizer'],
        color: 'primary',
    },
    {
        id: 'calculator',
        title: 'Data Analyst',
        description: 'Complex calculations with visualizations',
        icon: Calculator,
        tools: ['calculator', 'code_interpreter'],
        color: 'secondary',
    },
    {
        id: 'code_review',
        title: 'Code Reviewer',
        description: 'Security scanning and style analysis',
        icon: Code2,
        tools: ['code_analyzer', 'security_scanner'],
        color: 'accent',
    },
];

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    web_search: Search,
    summarizer: Sparkles,
    calculator: Calculator,
    code_interpreter: Code2,
    code_analyzer: Code2,
    security_scanner: Code2,
};

export default function AgentsPage() {
    const [mode, setMode] = useState<DemoMode>('single');
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
    const [steps, setSteps] = useState<AgentStep[]>([]);
    const [swarmAgents, setSwarmAgents] = useState<SwarmAgent[]>([]);
    const [response, setResponse] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const runSingleAgent = async (scenarioId: string) => {
        setSelectedScenario(scenarioId);
        setSteps([]);
        setSwarmAgents([]);
        setResponse('');
        setIsRunning(true);

        try {
            abortControllerRef.current = new AbortController();

            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario: scenarioId, stream: true }),
                signal: abortControllerRef.current.signal,
            });

            if (!res.body) throw new Error('No response body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'step_start') {
                                setSteps(prev => [
                                    ...prev,
                                    {
                                        tool: data.tool,
                                        status: 'running',
                                        input: data.input,
                                    },
                                ]);
                            } else if (data.type === 'step_complete') {
                                setSteps(prev =>
                                    prev.map((step, i) =>
                                        i === data.stepIndex
                                            ? {
                                                  ...step,
                                                  status: 'complete',
                                                  output: data.output,
                                                  duration: data.duration,
                                              }
                                            : step
                                    )
                                );
                            } else if (data.type === 'response_chunk') {
                                setResponse(prev => prev + data.content);
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Agent error:', error);
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
        }
    };

    const runSwarm = async () => {
        console.log('[Swarm] Starting swarm...');
        setSelectedScenario('swarm');
        setSteps([]);
        setSwarmAgents([]);
        setResponse('');
        setIsRunning(true);

        try {
            abortControllerRef.current = new AbortController();

            console.log('[Swarm] Sending request...');
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'swarm', stream: true }),
                signal: abortControllerRef.current.signal,
            });

            console.log('[Swarm] Response status:', res.status);
            if (!res.body) throw new Error('No response body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'swarm_init') {
                                setSwarmAgents(data.agents);
                            } else if (data.type === 'agent_status') {
                                setSwarmAgents(prev =>
                                    prev.map(agent =>
                                        agent.id === data.agentId
                                            ? {
                                                  ...agent,
                                                  status: data.status,
                                                  task: data.task || agent.task,
                                                  output: data.output || agent.output,
                                              }
                                            : agent
                                    )
                                );
                            } else if (data.type === 'response_chunk') {
                                setResponse(prev => prev + data.content);
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Swarm error:', error);
            }
        } finally {
            setIsRunning(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-secondary mb-2">
                    <Bot className="w-5 h-5" />
                    <span className="text-sm font-medium">Agent Demo</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Multi-Agent Orchestration</h1>
                <p className="text-muted-foreground">
                    Watch agents execute multi-step tasks with tool calls, real-time progress,
                    and streaming responses. Try single agents or unleash the swarm!
                </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8">
                <Button
                    variant={mode === 'single' ? 'primary' : 'outline'}
                    onClick={() => setMode('single')}
                    className="gap-2"
                >
                    <Bot className="w-4 h-4" />
                    Single Agent
                </Button>
                <Button
                    variant={mode === 'swarm' ? 'primary' : 'outline'}
                    onClick={() => setMode('swarm')}
                    className="gap-2"
                >
                    <Network className="w-4 h-4" />
                    Agent Swarm
                </Button>
            </div>

            {/* Single Agent Mode */}
            {mode === 'single' && (
                <>
                    {/* Scenario Selection */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {SCENARIOS.map((scenario) => (
                            <Card
                                key={scenario.id}
                                className={cn(
                                    'cursor-pointer transition-all',
                                    selectedScenario === scenario.id
                                        ? 'ring-2 ring-primary'
                                        : 'hover:border-primary/50'
                                )}
                                onClick={() => !isRunning && runSingleAgent(scenario.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg bg-${scenario.color}/20`}>
                                        <scenario.icon className={`w-5 h-5 text-${scenario.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">{scenario.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {scenario.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {scenario.tools.map((tool) => (
                                                <Badge key={tool} variant="default" className="text-xs">
                                                    {tool}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {selectedScenario !== scenario.id && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="mt-3 w-full gap-2"
                                        disabled={isRunning}
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                        Run Agent
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Single Agent Execution View */}
                    {selectedScenario && selectedScenario !== 'swarm' && (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Steps Timeline */}
                            <Card>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Execution Timeline
                                </h3>
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {steps.map((step, index) => {
                                            const ToolIcon = TOOL_ICONS[step.tool] || Code2;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="relative pl-8"
                                                >
                                                    {index < steps.length - 1 && (
                                                        <div className="absolute left-3 top-8 w-0.5 h-full bg-border" />
                                                    )}
                                                    <div
                                                        className={cn(
                                                            'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center',
                                                            step.status === 'running'
                                                                ? 'bg-primary/20'
                                                                : step.status === 'complete'
                                                                ? 'bg-accent/20'
                                                                : 'bg-muted'
                                                        )}
                                                    >
                                                        {step.status === 'running' ? (
                                                            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                                                        ) : step.status === 'complete' ? (
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                                                        ) : (
                                                            <ToolIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="bg-muted rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <ToolIcon className="w-4 h-4" />
                                                                <span className="font-medium text-sm">
                                                                    {step.tool.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            {step.duration && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {step.duration}ms
                                                                </span>
                                                            )}
                                                        </div>
                                                        {step.input && (
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Input: {step.input}
                                                            </p>
                                                        )}
                                                        {step.output && (
                                                            <p className="text-sm text-foreground">
                                                                {step.output}
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {steps.length === 0 && !isRunning && (
                                        <p className="text-center text-muted-foreground py-8">
                                            Select a scenario to see agent execution
                                        </p>
                                    )}

                                    {isRunning && steps.length === 0 && (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Response Area */}
                            <Card>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Agent Response
                                </h3>
                                <div className="min-h-[400px] bg-muted rounded-lg p-4 overflow-auto">
                                    {response ? (
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <ResponseContent content={response} />
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            {isRunning
                                                ? 'Waiting for agent to complete...'
                                                : 'Run an agent to see the response'}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                </>
            )}

            {/* Swarm Mode */}
            {mode === 'swarm' && (
                <>
                    {/* Swarm Launch Card */}
                    <Card className="mb-8 gradient-border">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <Network className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Agent Swarm</h3>
                                    <p className="text-muted-foreground">
                                        Deploy 6 specialized agents working in parallel to analyze AI Kit.
                                        Watch them coordinate, share findings, and produce a comprehensive report.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <Badge variant="primary">Coordinator</Badge>
                                        <Badge variant="secondary">Researcher</Badge>
                                        <Badge variant="success">Writer</Badge>
                                        <Badge variant="warning">Editor</Badge>
                                        <Badge variant="danger">Fact Checker</Badge>
                                        <Badge variant="default">Analyst</Badge>
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                onClick={runSwarm}
                                disabled={isRunning}
                                className="gap-2 shrink-0"
                            >
                                {isRunning ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                                {isRunning ? 'Running...' : 'Launch Swarm'}
                            </Button>
                        </div>
                    </Card>

                    {/* Swarm Visualization */}
                    {swarmAgents.length > 0 && (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Agent Grid */}
                            <Card>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Swarm Status
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {swarmAgents.map((agent) => (
                                        <motion.div
                                            key={agent.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={cn(
                                                'p-3 rounded-lg border transition-all',
                                                agent.status === 'idle' && 'bg-muted/50 border-border',
                                                agent.status === 'thinking' && 'bg-primary/10 border-primary/50 animate-pulse',
                                                agent.status === 'working' && 'bg-secondary/10 border-secondary/50',
                                                agent.status === 'complete' && 'bg-accent/10 border-accent/50'
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: agent.color }}
                                                />
                                                <span className="font-medium text-sm">{agent.name}</span>
                                                {agent.status === 'thinking' && (
                                                    <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />
                                                )}
                                                {agent.status === 'working' && (
                                                    <Zap className="w-3 h-3 text-secondary ml-auto animate-pulse" />
                                                )}
                                                {agent.status === 'complete' && (
                                                    <CheckCircle2 className="w-3 h-3 text-accent ml-auto" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {agent.role}
                                            </p>
                                            {agent.task && (
                                                <p className="text-xs text-foreground truncate">
                                                    {agent.task}
                                                </p>
                                            )}
                                            {agent.output && (
                                                <Badge variant="success" className="mt-2 text-xs">
                                                    {agent.output}
                                                </Badge>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Swarm Stats */}
                                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">
                                            {swarmAgents.filter(a => a.status === 'complete').length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Completed</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-secondary">
                                            {swarmAgents.filter(a => a.status === 'working' || a.status === 'thinking').length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Active</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-muted-foreground">
                                            {swarmAgents.filter(a => a.status === 'idle').length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Idle</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Swarm Response */}
                            <Card>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Swarm Output
                                </h3>
                                <div className="min-h-[400px] bg-muted rounded-lg p-4 overflow-auto">
                                    {response ? (
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <ResponseContent content={response} />
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            {isRunning
                                                ? 'Swarm is working...'
                                                : 'Launch the swarm to see collaborative output'}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {swarmAgents.length === 0 && !isRunning && (
                        <Card className="text-center py-12">
                            <Network className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Ready to Deploy</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Click &quot;Launch Swarm&quot; to see 6 specialized agents work together
                                in parallel, sharing context and producing a comprehensive analysis.
                            </p>
                        </Card>
                    )}
                </>
            )}

            {/* Features Section */}
            <div className="mt-8 grid md:grid-cols-4 gap-4">
                <Card>
                    <h4 className="font-semibold mb-2">AgentExecutor</h4>
                    <p className="text-sm text-muted-foreground">
                        Sequential execution with tool binding and state management.
                    </p>
                </Card>
                <Card>
                    <h4 className="font-semibold mb-2">AgentSwarm</h4>
                    <p className="text-sm text-muted-foreground">
                        Parallel multi-agent coordination with shared context.
                    </p>
                </Card>
                <Card>
                    <h4 className="font-semibold mb-2">ToolResult</h4>
                    <p className="text-sm text-muted-foreground">
                        Renders tool outputs with appropriate formatting.
                    </p>
                </Card>
                <Card>
                    <h4 className="font-semibold mb-2">StreamingAgentExecutor</h4>
                    <p className="text-sm text-muted-foreground">
                        Real-time streaming of agent thoughts and actions.
                    </p>
                </Card>
            </div>
        </div>
    );
}

function ResponseContent({ content }: { content: string }) {
    const renderMarkdown = (text: string) => {
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
                if (match) {
                    const code = match[2] || '';
                    return (
                        <pre key={index} className="bg-background p-3 rounded-lg overflow-x-auto my-2">
                            <code className="text-sm font-mono">{code}</code>
                        </pre>
                    );
                }
            }

            let formatted = part
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
                .replace(/\|(.+)\|/g, (match) => {
                    return `<div class="overflow-x-auto"><table class="w-full text-sm my-2"><tr>${match}</tr></table></div>`;
                })
                .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                .replace(/\n/g, '<br />');

            return (
                <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
    };

    return <>{renderMarkdown(content)}</>;
}
