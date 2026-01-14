'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Bot,
    Shield,
    BarChart3,
    ArrowRight,
    Sparkles,
    Zap,
    Code2,
    Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FEATURES, STATS } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    MessageSquare,
    Bot,
    Shield,
    BarChart3,
};

export default function HomePage() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center gradient-hero overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            AI Kit UI/UX Workshop - Live Demo
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                    >
                        Build{' '}
                        <span className="gradient-text">Stunning AI</span>
                        <br />
                        Interfaces
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        Production-ready React components for streaming chat,
                        agent orchestration, safety features, and usage analytics.
                        Ship AI features in minutes, not weeks.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/streaming">
                            <Button size="lg" className="gap-2">
                                Explore Demos
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <a
                            href="https://github.com/AINative-Studio/ai-kit"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="lg" className="gap-2">
                                <Code2 className="w-4 h-4" />
                                View on GitHub
                            </Button>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-b border-border">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {STATS.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                                    {stat.value}+
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold mb-4"
                        >
                            Interactive Demos
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground max-w-2xl mx-auto"
                        >
                            Explore each AI Kit feature with live, interactive demos.
                            See how easy it is to build beautiful AI experiences.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {FEATURES.map((feature, index) => {
                            const Icon = iconMap[feature.icon];
                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Link href={feature.href}>
                                        <Card
                                            variant="gradient"
                                            className="h-full feature-card cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl bg-${feature.color}/20`}>
                                                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Framework Support */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold mb-4"
                        >
                            Multi-Framework Support
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground"
                        >
                            Use AI Kit with your favorite framework
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'React', pkg: '@ainative/ai-kit', icon: Layers },
                            { name: 'Vue', pkg: '@ainative/ai-kit-vue', icon: Layers },
                            { name: 'Svelte', pkg: '@ainative/ai-kit-svelte', icon: Layers },
                        ].map((framework, index) => (
                            <motion.div
                                key={framework.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Card className="text-center">
                                    <framework.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                                    <h3 className="text-xl font-semibold mb-2">{framework.name}</h3>
                                    <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                        {framework.pkg}
                                    </code>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Start */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold mb-4"
                        >
                            Get Started in Seconds
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="code-block p-6">
                            <pre className="text-sm overflow-x-auto">
                                <code>{`# Install AI Kit
npm install @ainative/ai-kit

# Use in your React app
import { useAIStream, StreamingMessage } from '@ainative/ai-kit';

function Chat() {
  const { messages, send, isStreaming } = useConversation({
    url: '/api/chat',
  });

  return (
    <div>
      {messages.map(msg => (
        <StreamingMessage key={msg.id} content={msg.content} />
      ))}
    </div>
  );
}`}</code>
                            </pre>
                        </Card>
                    </motion.div>

                    <div className="text-center mt-8">
                        <Link href="/streaming">
                            <Button size="lg" className="gap-2">
                                <Zap className="w-4 h-4" />
                                Try It Live
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 gradient-hero">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold mb-4"
                    >
                        Ready to Build?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mb-8"
                    >
                        Join thousands of developers building beautiful AI interfaces with AI Kit.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a href="https://github.com/AINative-Studio/ai-kit" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="gap-2">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </a>
                        <a href="https://ainative.studio" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
