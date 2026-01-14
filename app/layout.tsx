import type { Metadata } from 'next';
import { Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export const metadata: Metadata = {
    title: 'AI Kit Showcase | AINative Studio',
    description: 'Interactive demo site showcasing AI Kit components for building production-ready AI interfaces. Features streaming chat, agent systems, safety features, and usage dashboards.',
    keywords: ['AI Kit', 'React', 'AI Components', 'Streaming', 'Agents', 'AINative', 'AINative Studio'],
    authors: [{ name: 'AINative Dev Team' }],
    icons: {
        icon: '/ainative-icon.svg',
    },
    openGraph: {
        title: 'AI Kit Showcase | AINative Studio',
        description: 'Build stunning AI interfaces with production-ready components from AINative',
        type: 'website',
        siteName: 'AINative AI Kit',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Kit Showcase | AINative Studio',
        description: 'Build stunning AI interfaces with production-ready components',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className="border-t border-border py-6 px-4 bg-dark-1">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Built by
                                </span>
                                <a
                                    href="https://ainative.studio"
                                    className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                                >
                                    AINative Studio
                                </a>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <a
                                    href="https://ainative.studio"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Website
                                </a>
                                <a
                                    href="https://github.com/AINative-Studio/ai-kit"
                                    className="hover:text-foreground transition-colors"
                                >
                                    GitHub
                                </a>
                                <a
                                    href="https://www.npmjs.com/~ainative-studio"
                                    className="hover:text-foreground transition-colors"
                                >
                                    npm
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
