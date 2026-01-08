/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  webpack: (config) => {
    // Ensure @ maps to src/ for environments where TS paths aren't picked up correctly
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": new URL("./src", import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
