import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
      "~": path.resolve(dirname, ".."),
      "@laceanatomy/napi-pallas": path.resolve(dirname, "napi-pallas-stub.ts"),
    };

    const existingExternals = Array.isArray(config.externals) ? config.externals : [];
    config.externals = [...existingExternals, { canvas: "canvas" }];

    return config;
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen",
  },
};

export default config;
