import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // There is another package-lock.json in a parent folder (the user's home
    // folder), which makes Next.js guess the wrong project root. Pointing the
    // root at this folder removes that warning.
    root: __dirname,
  },
};

export default nextConfig;
