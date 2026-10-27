import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "onWard | A little progress, every day",
  description:
    "The calm, high-performance productivity workspace that tracks your daily journey, powers rich document workspaces, and turns everyday wins into verified professional milestones.",
  applicationName: "onWard",
  keywords: [
    "productivity",
    "todo app",
    "workspace",
    "word export",
    "milestone tracker",
    "daily journey",
    "career growth",
  ],
  authors: [{ name: "GIGS Labs" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "onWard — A little progress, every day",
    description:
      "Transform your daily focus into career momentum with clock reminders, document studios, and one-click achievement sharing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#d3f36b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#fbfcfa] text-[#1c221e] antialiased">
        {children}
      </body>
    </html>
  );
}

