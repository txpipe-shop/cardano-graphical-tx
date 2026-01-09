await import("./app/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@laceanatomy/napi-pallas"],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    config.module.rules.push({
      test: /\.node$/,
      use: [{ loader: "nextjs-node-loader" }],
    });

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /napi-pallas/,
        message: /Can't resolve/,
      },
      {
        module: /napi-pallas/,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
};

export default nextConfig;
