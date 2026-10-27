import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "onWard | Personal Productivity & Professional Workspace",
  description:
    "onWard connects personal productivity with professional work management in one calm place. Organize daily tasks with clock reminders, capture notes with mind maps, celebrate achievements, document work logs, and manage team projects.",
  applicationName: "onWard",
  keywords: [
    "productivity",
    "tasks",
    "notes",
    "mind map",
    "achievements",
    "work logs",
    "projects",
    "workspace",
    "word export",
    "personal growth",
  ],
  authors: [{ name: "onWard" }],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "onWard — A little progress, every day",
    description:
      "Connect your personal productivity with professional work management in one calm, unified workspace.",
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

