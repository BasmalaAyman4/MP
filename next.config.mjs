/** @type {import('next').NextConfig} */

const nextConfig = {
  i18n: {
    locales: ['AR', 'EN'],
    defaultLocale: 'AR',
    localeDetection: false

  },
  reactStrictMode: true,
  images: {
    domains: ['beneshtyapi.geniussystemapi.com','adminapi.beneshty.com','admin.kokyandgody.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'admin.kokyandgody.com',
      },
    ],
/*     unoptimized: true,
 */  },
};
export default nextConfig;
