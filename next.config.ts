import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withNextVideo } from 'next-video/process';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.svoy-lounge.kz'],
  },
  // In Next.js 15/16, 'experimental.turbo' moved to the root 'turbopack' key
  turbopack: {
    rules: {
      '*.mp4': {
        loaders: ['file-loader'],
        as: 'asset',
      },
    },
  },
};

// Wrap with both plugins
export default withNextIntl(withNextVideo(nextConfig));