/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Don't fail builds on TypeScript errors (already checked by linter)
    ignoreBuildErrors: false,
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
