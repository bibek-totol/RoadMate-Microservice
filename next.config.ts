import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {},
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion",
      "recharts",
      "@zegocloud/zego-uikit-prebuilt",
    ],
  },

  /**
   * Static asset caching strategy:
   * 
   * /hero-frames/*.jpg — 177 animation frames
   *   → max-age=31536000 (1 year) + immutable
   *   → Browser caches permanently. Never re-fetches unless URL changes.
   *   → s-maxage=31536000 for CDN edge caching too.
   * 
   * /fonts/*, /icons/* — other static assets
   *   → Same 1-year immutable cache.
   */
  async headers() {
    return [
      {
        // Match all hero frame WebP files
        source: "/hero-frames/:filename*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
          {
            // Tell browsers this is a cacheable image (helps service workers)
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      {
        // General static assets — fonts, icons, images in /public root
        source: "/:path*.(jpg|jpeg|png|webp|avif|svg|woff|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
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
