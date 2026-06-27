/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/api/pdf': ['./node_modules/@sparticuz/chromium/bin/**/*']
  }
};

export default nextConfig;
