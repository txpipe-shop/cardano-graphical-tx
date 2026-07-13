import { GoogleTagManager } from "@next/third-parties/google";
import type Konva from "konva";
import { type Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "./_utils/metadata";
import { ROUTES } from "./_utils/constants";
import "./globals.css";

import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: ROUTES.HOME,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: ROUTES.HOME,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  icons: [{ rel: "icon", url: "/txpipe.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
        )}
      <body className="bg-surface font-sans">
        <ThemeProvider>
          <NextTopLoader color="var(--color-toploader)" showSpinner={false} />
          <Providers>
            <div className="bg-surface m-auto flex w-full flex-col">
              {children}
            </div>
            <Toaster position="bottom-center" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
