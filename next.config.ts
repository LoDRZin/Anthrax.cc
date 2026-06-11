import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "api.dicebear.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "utfs.io" },
      { hostname: "ufs.sh" },
    ],
  },
};

export default nextConfig;
