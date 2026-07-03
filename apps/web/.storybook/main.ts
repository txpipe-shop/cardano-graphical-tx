import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "..");
const envStub = path.resolve(dirname, "env-stub.ts");

const config: StorybookConfig = {
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "~": projectRoot,
      "@laceanatomy/napi-pallas": path.resolve(dirname, "napi-pallas-stub.ts"),
    };

    // Stub app/env.mjs — env validation crashes in browser without real env vars
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/app\/env\.mjs$/, envStub),
    );

    const existingExternals = Array.isArray(config.externals)
      ? config.externals
      : [];
    config.externals = [...existingExternals, { canvas: "canvas" }];

    return config;
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen",
  },
};

export default config;
