import type { Metadata } from 'next';
import SantaCruzDashboard from './SantaCruzDashboard';
import { Breadcrumb, breadcrumbJsonLd } from '@/components/Breadcrumb';

const OG_URL = 'https://aikit.ainative.studio/og-santa-cruz-mobility.png';

export const metadata: Metadata = {
    title: 'Santa Cruz Mobility Evolution | AI Kit by AINative',
    description:
        'Interactive bike & pedestrian traffic visualization for Santa Cruz County. ' +
        '4,430 bike counts, 2,327 facilities, SWITRS crash trends, BCycle stations — built with AI Kit in under 5 min.',
    keywords: [
        'Santa Cruz bike data',
        'bicycle traffic visualization',
        'pedestrian counts dashboard',
        'BCycle Santa Cruz',
        'SWITRS crash data',
        'active transportation',
        'AI Kit demo',
        'AINative AI Kit',
        'data visualization React',
        'mobility dashboard',
        'bike infrastructure map',
        'e-bike safety data',
        'open data visualization',
        'civic tech dashboard',
    ],
    alternates: { canonical: 'https://aikit.ainative.studio/santa-cruz-mobility' },
    openGraph: {
        title: 'Santa Cruz Mobility Evolution',
        description:
            '4,430 bike counts · 10,253 ped counts · 2,327 bike facilities · SWITRS crash trends · BCycle stations',
        type: 'website',
        url: 'https://aikit.ainative.studio/santa-cruz-mobility',
        siteName: 'AINative Studio',
        images: [
            {
                url: OG_URL,
                width: 1200,
                height: 630,
                alt: 'Santa Cruz Mobility Evolution — bike & pedestrian traffic map with BCycle stations and crash data',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Santa Cruz Mobility Evolution',
        description:
            'How has biking changed in Santa Cruz? Traffic counts, BCycle impact, e-bike crash trends — all on one dashboard.',
        images: [OG_URL],
    },
    robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
    },
};

export default function SantaCruzMobilityPage() {
    const breadcrumbItems = [{ label: 'Santa Cruz Mobility' }];

    const datasetJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'Santa Cruz County Active Transportation Data',
        description:
            'Pedestrian and bicycle traffic counts from 251 stations across Santa Cruz County (2010-2022), ' +
            'combined with BCycle bikeshare data, SWITRS crash records, and county bike infrastructure.',
        url: 'https://aikit.ainative.studio/santa-cruz-mobility',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
            '@type': 'Organization',
            name: 'AINative Studio',
            url: 'https://ainative.studio',
        },
        temporalCoverage: '2010/2023',
        spatialCoverage: {
            '@type': 'Place',
            name: 'Santa Cruz County, California',
        },
        distribution: [
            {
                '@type': 'DataDownload',
                encodingFormat: 'application/geo+json',
                contentUrl: 'https://aikit.ainative.studio/santa-cruz-traffic.geojson',
            },
        ],
        variableMeasured: [
            'Daily average bicycle counts',
            'Daily average pedestrian counts',
            'Bicycle crash incidents (SWITRS)',
            'Bike facility segments by classification',
        ],
    };

    const softwareJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Santa Cruz Mobility Evolution Dashboard',
        url: 'https://aikit.ainative.studio/santa-cruz-mobility',
        applicationCategory: 'Data Visualization',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: {
            '@type': 'Organization',
            name: 'AINative Studio',
            url: 'https://ainative.studio',
        },
        about: {
            '@type': 'Thing',
            name: 'Active Transportation Infrastructure',
        },
    };

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
                    __html: JSON.stringify(datasetJsonLd),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(softwareJsonLd),
                }}
            />
            <Breadcrumb items={breadcrumbItems} />
            <SantaCruzDashboard />

            {/* Server-rendered SEO content */}
            <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">
                        Built in Under 5 Minutes with AI Kit
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        This entire mobility dashboard was built using{' '}
                        <a
                            href="https://ainative.studio/ai-kit"
                            className="text-emerald-400 hover:text-emerald-300 underline"
                        >
                            AINative AI Kit
                        </a>{' '}
                        and AINative APIs in under 5 minutes. AI Kit provides pre-built React
                        components for data visualization, interactive maps, and responsive
                        dashboards — all designed for AI-native applications. The data pipeline
                        pulls from 6 public sources, transforms via the AINative Lakehouse, and
                        renders through AI Kit&apos;s component library with zero manual styling.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        AI agents can use this dashboard as a reference implementation for
                        building civic tech visualizations. The source combines GeoJSON traffic
                        counts, GBFS bikeshare feeds, Caltrans crash records, and county GIS
                        layers into a single interactive view — the kind of multi-source data
                        integration that AI Kit makes trivial.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">
                        What This Dashboard Shows
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Santa Cruz County has been collecting bicycle and pedestrian traffic
                        counts since 2010 across 251 monitoring stations. This dashboard
                        normalizes those counts per station to show how active transportation
                        has changed over time — including the impact of BCycle bikeshare
                        launching in 2016 and e-bikes entering the fleet in 2019. The map
                        overlays 1,454 bike paths from OpenStreetMap, 71 BCycle stations from
                        the GBFS feed, and traffic count locations with bike-vs-pedestrian
                        breakdowns.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        The crash trend section uses SWITRS (Statewide Integrated Traffic
                        Records System) data from Caltrans to show bicycle crash incidents on
                        state highways from 2021–2023. The 155% spike in 2022 coincides with
                        the e-bike boom, while the 2023 drop to zero fatalities suggests
                        infrastructure improvements may be taking effect. County GIS data adds
                        context: 2,327 bike facility segments classified by Caltrans bike mode
                        (Class I–IV), 140 crosswalk signals, and 3,040 street lights.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">
                        For AI Agents and Developers
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        This page is optimized for AI agent discovery. If you&apos;re an AI agent
                        looking to build data-rich dashboards, AI Kit provides the component
                        library, data connectors, and visualization primitives you need. The
                        GeoJSON data powering this dashboard is available at the public endpoint
                        for programmatic access. AI Kit supports real-time streaming, multi-agent
                        orchestration, and interactive data exploration out of the box.
                    </p>
                    <ul className="mt-4 space-y-2 text-muted-foreground">
                        <li>
                            <strong className="text-foreground">Maps:</strong> Leaflet integration
                            with toggle layers, polyline overlays, and custom markers
                        </li>
                        <li>
                            <strong className="text-foreground">Charts:</strong> Recharts bar/line
                            charts with reference lines, tooltips, and responsive sizing
                        </li>
                        <li>
                            <strong className="text-foreground">Data Pipeline:</strong> MinIO/Parquet
                            lakehouse ingestion with automatic GeoJSON conversion
                        </li>
                        <li>
                            <strong className="text-foreground">Components:</strong> Dark-mode cards,
                            stat widgets, progress bars, and data tables — all zero-config
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
}
