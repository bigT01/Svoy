import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withNextVideo } from 'next-video/process';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.svoy-lounge.kz",
      },
    ],
  },
  // In Next.js 15/16, 'experimental.turbo' moved to the root 'turbopack' key
  turbopack: {
    // Specify the root directory explicitly to avoid picking up the home directory's lockfile
    // @ts-ignore
    root: process.cwd(),
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