/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@opep/shared-types", "@opep/qr-utils"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false, // Disable minification to save memory and avoid internal errors
};

module.exports = nextConfig;
