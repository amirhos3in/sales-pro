import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  ...(pages
    ? {
        output: "export",
        basePath: "/sales-pro",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
