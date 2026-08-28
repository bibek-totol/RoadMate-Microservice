import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "recharts",
      "@zegocloud/zego-uikit-prebuilt",
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Use native OS event watching and ignore node_modules & .next to prevent CPU/memory spikes
      config.watchOptions = {
        ignored: ["**/node_modules/**", "**/.next/**", "**/.git/**"],
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
