import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import LightIcon from "@/assets/icons/icon-light.svg";
import DarkIcon from "@/assets/icons/icon-dark.svg";
import { ThemeProvider } from "@/providers/theme-provider";
import { APP_TITLE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description: "UsabiliTree - Grow your UX with Tree Testing",
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
