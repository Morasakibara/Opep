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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
