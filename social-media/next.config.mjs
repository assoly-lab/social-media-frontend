/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            pathname: '/media/**/**',
          },
        ],
        domains: ['localhost:8000'],
      },
};

export default nextConfig;
