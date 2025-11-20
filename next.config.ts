import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable dev sourcemaps to avoid Windows path sourcemap parse issues
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
