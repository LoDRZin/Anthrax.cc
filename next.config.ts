import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "api.dicebear.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "utfs.io" },
      { hostname: "ufs.sh" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cast to avoid strict lint config type errors on newer Next.js version typings
} as any;

export default nextConfig;
