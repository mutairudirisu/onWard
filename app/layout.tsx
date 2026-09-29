import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "onWard | A little progress, every day",
  description: "A calm, colorful place to keep your day moving forward.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}