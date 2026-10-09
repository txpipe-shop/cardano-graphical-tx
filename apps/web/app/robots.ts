import type { MetadataRoute } from "next";

const UNBOUNDED_EXPLORER_PATHS = [
  "/explorer/*/tokens/",
  "/explorer/*/addresses/",
];
const SOCIAL_IMAGE_PATHS = ["/*opengraph-image", "/*twitter-image"];

// Link-preview crawlers honor robots.txt for card images, so they keep access to them.
const LINK_PREVIEW_BOTS = [
  "Twitterbot",
  "facebookexternalhit",
  "LinkedInBot",
  "Slackbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [...UNBOUNDED_EXPLORER_PATHS, ...SOCIAL_IMAGE_PATHS],
      },
      {
        userAgent: LINK_PREVIEW_BOTS,
        disallow: UNBOUNDED_EXPLORER_PATHS,
      },
    ],
  };
}
