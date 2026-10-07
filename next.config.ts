import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.WHO_DIS_SITES ? {typescript:{tsconfigPath:"tsconfig.sites.json"}} : {}),
};

export default nextConfig;
