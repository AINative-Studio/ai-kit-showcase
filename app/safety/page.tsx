import type { Metadata } from 'next';
import SafetyDemo from './SafetyDemo';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

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
    const breadcrumbItems = [{ label: 'Safety Features' }];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <SafetyDemo />

            {/* Server-rendered SEO content */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AI Kit&apos;s safety layer provides a multi-tiered defense system that
                        sits between your users and the language model. Every message passes
                        through configurable guardrails before reaching the AI and again before
                        the response is shown to the user. The first tier handles PII detection,
                        scanning for patterns like email addresses, phone numbers, social security
                        numbers, and credit card numbers using a combination of regex patterns
                        and named entity recognition. Detected PII is automatically redacted or
                        flagged depending on your configuration.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        The second tier focuses on prompt injection protection. AI Kit analyzes
                        incoming messages for common injection techniques such as role override
                        attempts, delimiter injection, and instruction leaking. Suspicious inputs
                        are blocked before they reach the model, protecting both your system
                        prompt and your users. The third tier provides output moderation, scanning
                        AI responses for harmful content, hallucinated URLs, and policy violations.
                        Rate limiting is built into the safety layer with configurable per-user
                        and per-session limits, protecting your API costs while ensuring fair
                        usage. All safety events are logged with full context for audit purposes,
                        giving your compliance team complete visibility into what was blocked and
                        why.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li><strong>Healthcare applications</strong> that must prevent patient data from being sent to third-party AI models under HIPAA compliance.</li>
                        <li><strong>Financial services chatbots</strong> requiring PCI-DSS compliance with automatic credit card number redaction.</li>
                        <li><strong>Education platforms</strong> that need age-appropriate content filtering and protection against harmful content generation.</li>
                        <li><strong>Enterprise deployments</strong> requiring audit logs, rate limiting, and data loss prevention across all AI interactions.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">Integration Guide</h2>
                    <p className="text-muted-foreground mb-4">
                        Wrap your chat component with safety guardrails:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import { SafetyProvider, useSafetyReport } from '@ainative/ai-kit';

function App() {
  return (
    <SafetyProvider
      config={{
        piiDetection: { enabled: true, action: 'redact' },
        injectionProtection: { enabled: true, sensitivity: 'high' },
        contentModeration: { enabled: true, categories: ['harmful', 'adult'] },
        rateLimit: { maxRequests: 50, windowMs: 60_000 },
      }}
      onViolation={(event) => analytics.track('safety_block', event)}
    >
      <Chat />
      <SafetyDashboard />
    </SafetyProvider>
  );
}

function SafetyDashboard() {
  const report = useSafetyReport();
  return <div>Blocked: {report.totalBlocked} | PII found: {report.piiCount}</div>;
}`}</code>
                    </pre>
                </div>
            </section>
        </>
    );
}
