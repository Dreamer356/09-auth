import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'notehub-api.goit.study',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
