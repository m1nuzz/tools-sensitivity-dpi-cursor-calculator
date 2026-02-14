/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/tools-sensitivity-dpi-cursor-calculator",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
};

export default nextConfig;
