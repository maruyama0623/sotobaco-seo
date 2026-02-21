/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://nextjs.org/docs/app/api-reference/next-config-js/output
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@sotobaco/ui', '@sotobaco/tailwind-config'],
};

module.exports = nextConfig;
