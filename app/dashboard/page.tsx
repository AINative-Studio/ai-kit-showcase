import type { Metadata } from 'next';
import DashboardDemo from './DashboardDemo';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

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
    const breadcrumbItems = [{ label: 'Usage Dashboard' }];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <DashboardDemo />

            {/* Server-rendered SEO content */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AI Kit&apos;s usage dashboard provides real-time visibility into your
                        AI application&apos;s resource consumption and performance. The dashboard
                        components connect to your usage tracking API and render interactive
                        charts, tables, and metric cards that update automatically. Token
                        consumption is broken down by model, endpoint, and user segment, giving
                        you granular insight into where your AI budget is going. Cost projections
                        use historical data and configurable pricing to forecast your monthly
                        spend across all models.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        The analytics engine tracks latency percentiles (p50, p95, p99) for every
                        AI call, helping you identify performance bottlenecks before they affect
                        users. Error rates are monitored with automatic alerting thresholds that
                        you configure per endpoint. The dashboard supports custom date ranges,
                        comparison periods, and drill-down from summary metrics to individual
                        request logs. All chart components are built on a headless architecture,
                        meaning you can use AI Kit&apos;s data hooks with your own charting
                        library if you prefer a different visual style. Export functionality
                        supports CSV and JSON formats for integration with your existing BI
                        tools. The dashboard is designed to scale from individual developer
                        projects tracking a few hundred requests to enterprise deployments
                        processing millions of AI calls per day.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Cost management</strong> for teams running multiple AI models, with per-model and per-feature cost breakdowns and budget alerts.</li>
                        <li><strong>Performance monitoring</strong> tracking latency, throughput, and error rates across all AI endpoints in real time.</li>
                        <li><strong>Usage-based billing</strong> for SaaS products that charge customers based on AI token consumption with detailed invoicing data.</li>
                        <li><strong>Capacity planning</strong> using historical trends and projections to right-size your AI infrastructure and model selection.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Integration Guide</h2>
                    <p className="text-muted-foreground mb-4">
                        Add usage tracking and dashboard components to your application:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import {
  UsageProvider,
  TokenChart,
  CostSummary,
  LatencyMetrics,
  useUsageStats,
} from '@ainative/ai-kit';

function Dashboard() {
  return (
    <UsageProvider apiUrl="/api/usage" refreshInterval={30_000}>
      <div className="grid grid-cols-3 gap-4">
        <CostSummary period="month" showProjection />
        <TokenChart
          groupBy="model"
          timeRange="7d"
          chartType="stacked-bar"
        />
        <LatencyMetrics percentiles={['p50', 'p95', 'p99']} />
      </div>
    </UsageProvider>
  );
}

// Or use the headless hook for custom UI
function CustomMetrics() {
  const { totalTokens, totalCost, requestCount } = useUsageStats('7d');
  return <div>Cost: \${totalCost.toFixed(2)} | Requests: {requestCount}</div>;
}`}</code>
                    </pre>
                </div>
            </section>
        </>
    );
}
