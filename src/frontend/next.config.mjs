/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  webpack: (config) => {
    // Ensure @ maps to src/ for environments where TS paths aren't picked up correctly.
    // In ESM configs, use import.meta.url to compute an absolute path.
    const srcPath = new URL("./src", import.meta.url).pathname;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": srcPath,
    };
    return config;
  },
};

export default nextConfig;
