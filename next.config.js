// @ts-check

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; base-uri 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; object-src 'self'; img-src 'self' data:",
  },
];

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
