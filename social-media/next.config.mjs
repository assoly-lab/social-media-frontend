/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'social-media-frontend-woad.vercel',
            pathname: '/media/**/**',
          },
        ],
        domains: ['social-media-frontend-woad.vercel.app'],
      },
};

export default nextConfig;
