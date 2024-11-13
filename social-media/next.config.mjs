/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tornado008.pythonanywhere",
        pathname: "/media/**/**",
      },
    ],
    domains: ["tornado008.pythonanywhere.com"],
  },
};

export default nextConfig;
