import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Render deployment
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Environment variables are automatically loaded by Next.js
  // No manual configuration needed for standard env vars
  
  // Image optimization for production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
