import { GoogleTagManager } from "@next/third-parties/google";
import type Konva from "konva";
import { type Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
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
  title: "Lace Anatomy",
  description: "Made with ❤️ by TxPipe",
  icons: [{ rel: "icon", url: "/txpipe.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${jetbrainsMono.variable}`}>
      {process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
        )}
      <body className="bg-surface font-sans">
        <ThemeProvider>
          <NextTopLoader color="#7c3aed" showSpinner={false} />
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
