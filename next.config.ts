import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    turbo: {
      rules: {
        '*.{glsl,vs,fs,vert,frag}': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config) => {
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
    ],
  },
};

export default nextConfig;
