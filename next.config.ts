import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable static generation for all pages
  experimental: {
    // Disable server-side features for static export
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
