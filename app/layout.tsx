import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "onWard | A little progress, every day",
  description: "A calm, colorful place to keep your day moving forward.",
  applicationName: "onWard",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }], apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }] },
  appleWebApp: { capable: true, title: "onWard", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#111713", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
