import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export const metadata: Metadata = {
    title: 'AI Kit Showcase | Build Stunning AI Interfaces',
    description: 'Interactive demo site showcasing AI Kit components for building production-ready AI interfaces. Features streaming chat, agent systems, safety features, and usage dashboards.',
    keywords: ['AI Kit', 'React', 'AI Components', 'Streaming', 'Agents', 'AINative'],
    authors: [{ name: 'AINative Dev Team' }],
    openGraph: {
        title: 'AI Kit Showcase',
        description: 'Build stunning AI interfaces with production-ready components',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className="border-t border-border py-6 px-4">
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground">
                                Built by AINative Dev Team
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <a href="https://ainative.studio" className="hover:text-foreground transition-colors">
                                    AINative Studio
                                </a>
                                <a href="https://github.com/AINative-Studio/ai-kit" className="hover:text-foreground transition-colors">
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
