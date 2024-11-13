/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
    domains: ["social-media-frontend-woad.vercel.app"],
  },
};

export default nextConfig;
