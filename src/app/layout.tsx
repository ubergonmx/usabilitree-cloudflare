import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import LightIcon from "@/app/icon-light.svg";
import DarkIcon from "@/app/icon-dark.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UsabiliTree",
  description: "Free tree testing tool to optimize your information architecture.",
  icons: {
    icon: [
      {
        rel: "icon",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
        url: LightIcon.src,
      },
      {
        rel: "icon",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg/xml",
        url: DarkIcon.src,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
