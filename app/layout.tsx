import type Konva from "konva";
import { type Metadata } from "next";
import { Lato, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--lato-font",
});
const martianMono = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--code-font",
});

export const metadata: Metadata = {
  title: "Lace Anatomy",
  description: "Generated by Tx Pipe",
  icons: [{ rel: "icon", url: "/txpipe.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lato.variable} ${martianMono.variable}`}>
      <body>
        <Providers>
          <div className="m-auto flex w-full flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
