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
};

module.exports = nextConfig;
