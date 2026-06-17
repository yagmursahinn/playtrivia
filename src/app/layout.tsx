import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { BackgroundShell, RoutePreloader } from "@/components/layout";
import { buildRootLayoutMetadata } from "@/lib/seo/metadata";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = buildRootLayoutMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream font-body text-dark antialiased">
        <BackgroundShell />
        <AppProviders>
          <RoutePreloader />
          {children}
        </AppProviders>
        <VercelAnalytics />
      </body>
    </html>
  );
}
