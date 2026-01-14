import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

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

interface AgentResult {
    steps: AgentStep[];
    finalResponse: string;
}

const AGENT_SCENARIOS: Record<string, AgentResult> = {
    research: {
        steps: [
            {
                tool: 'web_search',
                status: 'complete',
                input: 'Latest AI development trends 2026',
                output: 'Found 15 relevant articles about AI trends including multi-modal models, agent frameworks, and enterprise AI adoption.',
                duration: 1200,
            },
            {
                tool: 'web_search',
                status: 'complete',
                input: 'AI Kit framework comparison',
                output: 'Found comparisons with LangChain, Vercel AI SDK, and others. AI Kit noted for type-safety and React integration.',
                duration: 980,
            },
            {
                tool: 'summarizer',
                status: 'complete',
                input: 'Synthesize findings into report',
                output: 'Generated comprehensive summary of AI development landscape.',
                duration: 1500,
            },
        ],
        finalResponse: `## AI Development Trends Report 2026

### Key Findings

1. **Multi-modal AI** is becoming standard, with 78% of new models supporting text, image, and audio
2. **Agent frameworks** are the fastest-growing category, up 340% YoY
3. **Enterprise adoption** has reached 65% of Fortune 500 companies

### Framework Comparison

| Framework | Type Safety | React Support | Streaming |
|-----------|------------|---------------|-----------|
| AI Kit | Excellent | Native | Yes |
| LangChain | Good | Via adapter | Yes |
| Vercel AI | Good | Native | Yes |

### Recommendation
AI Kit offers the best developer experience for React applications with its native TypeScript support and comprehensive component library.`,
    },
    calculator: {
        steps: [
            {
                tool: 'calculator',
                status: 'complete',
                input: '15% of 1250000',
                output: '187,500',
                duration: 50,
            },
            {
                tool: 'calculator',
                status: 'complete',
                input: '187500 / 12',
                output: '15,625',
                duration: 45,
            },
            {
                tool: 'code_interpreter',
                status: 'complete',
                input: 'Generate monthly breakdown visualization',
                output: 'Created bar chart showing monthly allocation of $15,625',
                duration: 800,
            },
        ],
        finalResponse: `## Financial Analysis Complete

### Calculations
- **Annual Budget**: $1,250,000
- **15% Allocation**: $187,500
- **Monthly Distribution**: $15,625

### Monthly Breakdown
| Month | Allocation | Cumulative |
|-------|------------|------------|
| Jan | $15,625 | $15,625 |
| Feb | $15,625 | $31,250 |
| Mar | $15,625 | $46,875 |
| ... | ... | ... |
| Dec | $15,625 | $187,500 |

The visualization shows even distribution across all 12 months.`,
    },
    code_review: {
        steps: [
            {
                tool: 'code_analyzer',
                status: 'complete',
                input: 'Parse codebase structure',
                output: 'Analyzed 45 files, 3,200 lines of code. Found 12 components, 8 hooks.',
                duration: 2000,
            },
            {
                tool: 'security_scanner',
                status: 'complete',
                input: 'Scan for vulnerabilities',
                output: '0 critical issues, 2 warnings (potential XSS in user input handling)',
                duration: 3500,
            },
            {
                tool: 'code_analyzer',
                status: 'complete',
                input: 'Generate style recommendations',
                output: 'Found 5 areas for improvement: naming consistency, error handling patterns.',
                duration: 1200,
            },
        ],
        finalResponse: `## Code Review Report

### Overview
- **Files Analyzed**: 45
- **Total Lines**: 3,200
- **Components**: 12
- **Hooks**: 8

### Security Findings
| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 0 | - |
| Warning | 2 | Potential XSS in UserInput.tsx (line 42, 67) |
| Info | 5 | Missing input validation |

### Style Recommendations
1. ✅ Use consistent naming: \`handleX\` for event handlers
2. ✅ Add error boundaries around async operations
3. ✅ Extract repeated logic into custom hooks
4. ✅ Add TypeScript strict mode
5. ✅ Implement proper loading states

### Summary
Code quality is **good** with minor security improvements needed. No critical issues found.`,
    },
};

// Swarm simulation data
const SWARM_AGENTS: SwarmAgent[] = [
    { id: 'researcher', name: 'Researcher', role: 'Gathers information and sources', status: 'idle', color: '#667eea' },
    { id: 'analyst', name: 'Analyst', role: 'Analyzes data and finds patterns', status: 'idle', color: '#764ba2' },
    { id: 'writer', name: 'Writer', role: 'Drafts content and copy', status: 'idle', color: '#22c55e' },
    { id: 'editor', name: 'Editor', role: 'Reviews and refines output', status: 'idle', color: '#f59e0b' },
    { id: 'factchecker', name: 'Fact Checker', role: 'Verifies claims and citations', status: 'idle', color: '#ef4444' },
    { id: 'coordinator', name: 'Coordinator', role: 'Orchestrates the swarm', status: 'idle', color: '#06b6d4' },
];

const SWARM_TASKS = [
    { agentId: 'coordinator', task: 'Analyzing request and delegating tasks...', delay: 500 },
    { agentId: 'researcher', task: 'Searching for AI Kit documentation and examples...', delay: 800 },
    { agentId: 'analyst', task: 'Analyzing competitor frameworks...', delay: 600 },
    { agentId: 'researcher', task: 'Found 23 relevant sources on AI UI frameworks', delay: 1200, output: '23 sources found' },
    { agentId: 'factchecker', task: 'Verifying source credibility...', delay: 400 },
    { agentId: 'analyst', task: 'Identified 5 key differentiators for AI Kit', delay: 1000, output: '5 differentiators identified' },
    { agentId: 'writer', task: 'Drafting executive summary...', delay: 700 },
    { agentId: 'factchecker', task: 'All 23 sources verified as credible', delay: 800, output: '100% verified' },
    { agentId: 'writer', task: 'Writing feature comparison section...', delay: 900 },
    { agentId: 'editor', task: 'Reviewing draft for clarity...', delay: 600 },
    { agentId: 'writer', task: 'Completed 2,400 word analysis', delay: 1100, output: '2,400 words' },
    { agentId: 'editor', task: 'Applied 12 style improvements', delay: 800, output: '12 edits made' },
    { agentId: 'coordinator', task: 'Compiling final deliverable...', delay: 500 },
];

const SWARM_FINAL_RESPONSE = `## AI Kit Comprehensive Analysis

### Executive Summary
Our swarm of 6 specialized agents collaborated to produce this analysis in parallel, reducing research time by 75%.

### Agent Contributions
| Agent | Tasks Completed | Key Output |
|-------|-----------------|------------|
| Coordinator | 2 | Orchestrated workflow |
| Researcher | 2 | 23 verified sources |
| Analyst | 2 | 5 key differentiators |
| Writer | 3 | 2,400 word report |
| Editor | 2 | 12 style improvements |
| Fact Checker | 2 | 100% source verification |

### Key Findings
1. **AI Kit** is the only framework with native React 18+ streaming support
2. **Type safety** is 40% better than alternatives (measured by TypeScript coverage)
3. **Bundle size** is 60% smaller than LangChain for equivalent features
4. **Developer experience** rated highest in blind testing (4.8/5.0)
5. **Safety features** are built-in, not afterthoughts

### Swarm Performance Metrics
- **Total agents deployed**: 6
- **Parallel execution ratio**: 83%
- **Time saved vs sequential**: 75%
- **Cross-agent communications**: 14 messages

*This analysis was produced by the AI Kit AgentSwarm in coordinated parallel execution.*`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { scenario, stream = true, mode } = body;

        console.log('[Agent API] Request body:', JSON.stringify(body));

        // Handle swarm mode
        if (mode === 'swarm') {
            console.log('[Agent API] Swarm mode activated');
            const encoder = new TextEncoder();
            const streamResponse = new ReadableStream({
                async start(controller) {
                    // Initialize all agents
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'swarm_init',
                        agents: SWARM_AGENTS,
                    })}\n\n`));

                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Stream each task
                    for (const task of SWARM_TASKS) {
                        // Agent starts thinking
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'agent_status',
                            agentId: task.agentId,
                            status: 'thinking',
                            task: task.task,
                        })}\n\n`));

                        await new Promise(resolve => setTimeout(resolve, 200));

                        // Agent starts working
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'agent_status',
                            agentId: task.agentId,
                            status: 'working',
                        })}\n\n`));

                        await new Promise(resolve => setTimeout(resolve, task.delay));

                        // Agent completes (or continues)
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'agent_status',
                            agentId: task.agentId,
                            status: task.output ? 'complete' : 'idle',
                            output: task.output,
                        })}\n\n`));

                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    // All agents complete
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'swarm_complete',
                    })}\n\n`));

                    await new Promise(resolve => setTimeout(resolve, 300));

                    // Stream final response
                    const chars = SWARM_FINAL_RESPONSE.split('');
                    for (let i = 0; i < chars.length; i++) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'response_chunk',
                            content: chars[i],
                        })}\n\n`));

                        if (i % 5 === 0) {
                            await new Promise(resolve => setTimeout(resolve, 8));
                        }
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'done',
                    })}\n\n`));

                    controller.close();
                },
            });

            return new Response(streamResponse, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        const result = AGENT_SCENARIOS[scenario] || AGENT_SCENARIOS.research;

        if (stream) {
            const encoder = new TextEncoder();
            const streamResponse = new ReadableStream({
                async start(controller) {
                    // Stream each step
                    for (let i = 0; i < result.steps.length; i++) {
                        const step = result.steps[i];

                        // Send step start
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'step_start',
                            stepIndex: i,
                            tool: step.tool,
                            input: step.input,
                        })}\n\n`));

                        // Simulate processing time
                        await new Promise(resolve => setTimeout(resolve, step.duration || 1000));

                        // Send step complete
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'step_complete',
                            stepIndex: i,
                            output: step.output,
                            duration: step.duration,
                        })}\n\n`));
                    }

                    // Stream final response character by character
                    const chars = result.finalResponse.split('');
                    for (let i = 0; i < chars.length; i++) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'response_chunk',
                            content: chars[i],
                        })}\n\n`));

                        if (i % 5 === 0) {
                            await new Promise(resolve => setTimeout(resolve, 10));
                        }
                    }

                    // Send done
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'done',
                    })}\n\n`));

                    controller.close();
                },
            });

            return new Response(streamResponse, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: 'Failed to execute agent' },
            { status: 500 }
        );
    }
}
