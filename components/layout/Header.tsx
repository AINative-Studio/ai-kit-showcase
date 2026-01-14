'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    MessageSquare,
    Bot,
    Shield,
    BarChart3,
    Github,
    ExternalLink,
} from 'lucide-react';

const navItems = [
    { href: '/streaming', label: 'Streaming', icon: MessageSquare },
    { href: '/agents', label: 'Agents', icon: Bot },
    { href: '/safety', label: 'Safety', icon: Shield },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/ainative-icon.svg"
                        alt="AINative"
                        width={32}
                        height={28}
                        className="transition-transform group-hover:scale-105"
                    />
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                            AI Kit
                        </span>
                        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary font-medium">
                            Showcase
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/AINative-Studio/ai-kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="View on GitHub"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href="https://ainative.studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm font-medium"
                    >
                        AINative Studio
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-border px-4 py-2 overflow-x-auto">
                <div className="flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                                    isActive
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
