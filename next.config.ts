import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  productionBrowserSourceMaps: false,
  turbopack: {
    rules: {
      '*.{glsl,vs,fs,vert,frag}': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  experimental: {
    viewTransition: true,
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
  ],
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next|framer-motion)[\\/]/,
            priority: 40,
            enforce: true,
          },
          three: {
            chunks: 'all',
            name: 'three-bundle',
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
            name(module: any) {
              if (!module.context) return 'vendor';
              const match = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              );
              if (!match || !match[1]) return 'vendor';
              return `lib.${match[1].replace('@', '')}`;
            },
          },
        },
      };
    }
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
      exclude: /node_modules/,
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'scontent-ssn1-1.cdninstagram.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'scontent-iad3-2.cdninstagram.com',
      },
      {
        protocol: 'https' as const,
        hostname: '**.cdninstagram.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
