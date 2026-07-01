/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@ainative/ai-kit',
        '@ainative/ai-kit-core',
        '@ainative/ai-kit-nextjs',
        '@ainative/ai-kit-safety',
        '@ainative/ai-kit-tools',
        '@ainative/ai-kit-observability',
    ],
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
    },
    // 301 redirects to consolidated ainative.studio/ai-kit
    async redirects() {
        return [
            // Keep data-room local, redirect other root paths
            {
                source: '/',
                destination: 'https://ainative.studio/ai-kit',
                permanent: true,
            },
            {
                source: '/streaming',
                destination: 'https://ainative.studio/ai-kit/streaming',
                permanent: true,
            },
            {
                source: '/agents',
                destination: 'https://ainative.studio/ai-kit/agents',
                permanent: true,
            },
            {
                source: '/safety',
                destination: 'https://ainative.studio/ai-kit/safety',
                permanent: true,
            },
            {
                source: '/dashboard',
                destination: 'https://ainative.studio/ai-kit/dashboard',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
