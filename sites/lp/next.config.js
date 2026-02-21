/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/sotobacoportal',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@sotobaco/ui', '@sotobaco/tailwind-config'],
};

module.exports = nextConfig;
