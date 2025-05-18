import type React from "react";
import type { Metadata } from "next";
// import { Inter } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Global Recipe Finder",
  description:
    "Discover international recipes from around the world with AI-powered search",
  metadataBase: new URL("https://global-recipe-finder.vercel.app"),
  openGraph: {
    title: "Global Recipe Finder",
    description:
      "Discover international recipes from around the world with AI-powered search",
    url: "https://global-recipe-finder.vercel.app",
    siteName: "Global Recipe Finder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Recipe Finder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' img-src 'self' https://www.themealdb.com https://*.ytimg.com data:; media-src 'self' https://*.youtube.com; frame-src https://*.youtube.com; connect-src 'self' https://api.groq.com https://www.themealdb.com; script-src 'self' 'unsafe-inline' style-src 'self' 'unsafe-inline'"
        />
      </head>
      <body>
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
