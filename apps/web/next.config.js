/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  // Existing configuration
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withNextIntl(nextConfig);
