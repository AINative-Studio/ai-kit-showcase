'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Zap,
    Users,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';
import { DASHBOARD_DATA } from '@/lib/mock-data';

const COLORS = ['#667eea', '#764ba2', '#22c55e', '#f59e0b'];

export default function DashboardPage() {
    const [animatedStats, setAnimatedStats] = useState({
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        activeUsers: 0,
    });

    // Animate counters on mount
    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            setAnimatedStats({
                totalRequests: Math.round(DASHBOARD_DATA.overview.totalRequests * eased),
                totalTokens: Math.round(DASHBOARD_DATA.overview.totalTokens * eased),
                totalCost: DASHBOARD_DATA.overview.totalCost * eased,
                activeUsers: Math.round(DASHBOARD_DATA.overview.activeUsers * eased),
            });

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-sm font-medium">Dashboard Demo</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Usage Analytics</h1>
                <p className="text-muted-foreground">
                    Real-time token counting, cost tracking, and performance analytics
                    powered by AI Kit&apos;s observability package.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Requests"
                    value={formatNumber(animatedStats.totalRequests)}
                    change={12.5}
                    icon={Zap}
                    color="primary"
                />
                <StatCard
                    title="Total Tokens"
                    value={formatNumber(animatedStats.totalTokens)}
                    change={8.3}
                    icon={TrendingUp}
                    color="secondary"
                />
                <StatCard
                    title="Total Cost"
                    value={formatCurrency(animatedStats.totalCost)}
                    change={-3.2}
                    icon={DollarSign}
                    color="accent"
                />
                <StatCard
                    title="Active Users"
                    value={formatNumber(animatedStats.activeUsers)}
                    change={15.7}
                    icon={Users}
                    color="primary"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Usage Trends */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Usage Trends</h3>
                        <Badge variant="primary">Last 7 days</Badge>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={DASHBOARD_DATA.trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickFormatter={(value) => value.split('-').slice(1).join('/')}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickFormatter={(value) => formatNumber(value)}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="requests"
                                    stroke="#667eea"
                                    strokeWidth={2}
                                    dot={{ fill: '#667eea', strokeWidth: 2 }}
                                    name="Requests"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="#764ba2"
                                    strokeWidth={2}
                                    dot={{ fill: '#764ba2', strokeWidth: 2 }}
                                    name="Cost ($)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Cost by Model */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Cost by Model</h3>
                        <Badge variant="secondary">Distribution</Badge>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={DASHBOARD_DATA.modelBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="cost"
                                    nameKey="model"
                                    label={({ model, percent }) =>
                                        `${model}: ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {DASHBOARD_DATA.modelBreakdown.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Model Comparison */}
            <Card className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Model Comparison</h3>
                    <Badge variant="default">All time</Badge>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DASHBOARD_DATA.modelBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="model"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickFormatter={(value) => formatNumber(value)}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                            <Bar
                                dataKey="requests"
                                fill="#667eea"
                                radius={[4, 4, 0, 0]}
                                name="Requests"
                            />
                            <Bar
                                dataKey="tokens"
                                fill="#764ba2"
                                radius={[4, 4, 0, 0]}
                                name="Tokens"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Model Details Table */}
            <Card className="mb-8">
                <h3 className="font-semibold mb-4">Model Details</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Model
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Requests
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Tokens
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Cost
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Avg Cost/Request
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {DASHBOARD_DATA.modelBreakdown.map((model) => (
                                <motion.tr
                                    key={model.model}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-border/50 hover:bg-muted/50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: model.color }}
                                            />
                                            <span className="font-medium">{model.model}</span>
                                        </div>
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {formatNumber(model.requests)}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {formatNumber(model.tokens)}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {formatCurrency(model.cost)}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {formatCurrency(model.cost / model.requests)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <h4 className="font-semibold mb-2">UsageTracker</h4>
                    <p className="text-sm text-muted-foreground">
                        Automatic token counting and cost calculation for every request.
                    </p>
                </Card>
                <Card>
                    <h4 className="font-semibold mb-2">AlertManager</h4>
                    <p className="text-sm text-muted-foreground">
                        Set budget thresholds and receive alerts when approaching limits.
                    </p>
                </Card>
                <Card>
                    <h4 className="font-semibold mb-2">ReportGenerator</h4>
                    <p className="text-sm text-muted-foreground">
                        Export usage reports to PDF, CSV, or JSON formats.
                    </p>
                </Card>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    change,
    icon: Icon,
    color,
}: {
    title: string;
    value: string;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: 'primary' | 'secondary' | 'accent';
}) {
    const isPositive = change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className="h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-${color}/20`}>
                        <Icon className={`w-5 h-5 text-${color}`} />
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-accent" />
                    ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                        className={cn(
                            'text-sm font-medium',
                            isPositive ? 'text-accent' : 'text-red-500'
                        )}
                    >
                        {isPositive ? '+' : ''}
                        {change}%
                    </span>
                    <span className="text-sm text-muted-foreground">vs last week</span>
                </div>
            </Card>
        </motion.div>
    );
}
