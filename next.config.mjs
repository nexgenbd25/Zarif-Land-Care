import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization (Supabase Storage থেকে ইমেজ লোড করার জন্য)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // React strict mode (development এ ভালো practice)
  reactStrictMode: true,

  // TypeScript errors ignore করব না (production ready)
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint errors ignore করব না
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Trailing slash সব URL এ (SEO friendly)
  trailingSlash: false,

  // Powered by header remove
  poweredByHeader: false,

  // Compression
  compress: true,
};

export default withNextIntl(nextConfig);