await import("./app/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@laceanatomy/napi-pallas"],
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, { canvas: "canvas" }];

    if (!isServer) {
      config.externals = [...config.externals, "@connectrpc/connect-node"];
    }

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
  turbopack: {},
};

export default nextConfig;
