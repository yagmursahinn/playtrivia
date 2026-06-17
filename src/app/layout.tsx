import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { BackgroundShell, RoutePreloader } from "@/components/layout";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Challenge Your Knowledge`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

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
      </body>
    </html>
  );
}
