/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.githubusercontent.com'
            },
            {
                protocol: 'https',
                hostname: '**.tmdb.org'
            },
        ],
    }
};

export default nextConfig;
