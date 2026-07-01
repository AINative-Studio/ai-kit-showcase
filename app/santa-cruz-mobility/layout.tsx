import type { Metadata } from 'next';

const OG_URL = 'https://aikit.ainative.studio/og-santa-cruz-mobility.png';

export const metadata: Metadata = {
  title: 'Santa Cruz Mobility Evolution | AINative Studio',
  description:
    'Interactive visualization of pedestrian & bicycle traffic across Santa Cruz County (2010–2022). ' +
    'BCycle bikeshare impact, SWITRS crash data, 2,327 bike facilities, and 46K+ infrastructure features.',
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
};

export default function SantaCruzMobilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
