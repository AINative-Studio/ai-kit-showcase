import type { Metadata } from 'next';
import HackathonDemo from './HackathonDemo';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

export const metadata: Metadata = {
    title: 'AI Data Room Reconstructor — Hackathon Demo | AI Kit',
    description:
        'AI-powered data room reconstruction for startups. Automatically analyze corporate documents, ' +
        'identify compliance gaps, generate missing filings, and export to OpenCap, Carta, or Pulley.',
    keywords: [
        'data room automation',
        'startup compliance',
        'AI document analysis',
        'cap table export',
        'OpenCap integration',
        'Carta export',
        'Pulley export',
        'corporate governance AI',
        'AI Kit hackathon',
        'AINative AI Kit',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/hackathon' },
    openGraph: {
        title: 'AI Data Room Reconstructor — Hackathon Demo',
        description:
            'Reconstruct your startup data room with AI. Gap analysis, document generation, and cap table export in minutes.',
        type: 'website',
        url: 'https://aikit.ainative.studio/hackathon',
        siteName: 'AINative Studio',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Data Room Reconstructor',
        description:
            'AI-powered data room reconstruction — compliance gaps, document generation, multi-platform export.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function HackathonPage() {
    const breadcrumbItems = [{ label: 'Hackathon' }];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebApplication',
                        name: 'AI Data Room Reconstructor',
                        url: 'https://aikit.ainative.studio/hackathon',
                        applicationCategory: 'BusinessApplication',
                        operatingSystem: 'Web Browser',
                        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                        creator: {
                            '@type': 'Organization',
                            name: 'AINative Studio',
                            url: 'https://ainative.studio',
                        },
                    }),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <HackathonDemo />

            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">
                        AI-Powered Data Room Reconstruction
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Built with{' '}
                        <a
                            href="https://ainative.studio/ai-kit"
                            className="text-emerald-400 hover:text-emerald-300 underline"
                        >
                            AINative AI Kit
                        </a>
                        , this demo shows how AI agents can reconstruct a complete startup data
                        room from minimal inputs. Enter a company email and name, and multi-agent
                        orchestration handles document discovery, gap analysis, compliance
                        generation, and multi-platform export — all in real time.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The reconstructor runs a 5-phase pipeline: document discovery scans for
                        existing corporate filings, gap analysis identifies missing or outdated
                        documents against investor-ready standards, AI generation creates
                        compliant drafts for missing items, and the export phase formats
                        everything for OpenCap, Carta, or Pulley. Each phase uses specialized
                        AI agents coordinated through AI Kit&apos;s orchestration layer.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">
                        For AI Agents and Developers
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        This hackathon demo showcases AI Kit&apos;s multi-agent patterns:
                        sequential pipeline execution, real-time progress streaming, structured
                        output parsing, and multi-format export. The same patterns work for any
                        document-heavy workflow — due diligence, compliance audits, regulatory
                        filings, or contract analysis.
                    </p>
                </div>
            </section>
        </>
    );
}
