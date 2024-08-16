/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["amazon.*", "*.amazon.*"],
    },
    serverComponentsExternalPackages: ["mongoose", "puppeteer-core"],
  },
  images: {
    domains: ["m.media-amazon.com"],
  },
};

export default nextConfig;
