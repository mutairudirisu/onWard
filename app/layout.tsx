import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TaskProvider } from "@/lib/task-context";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { Navigation } from "@/components/Navigation";
import { CreationSpeedDial } from "@/components/CreationSpeedDial";
import { ModalManager } from "@/components/ModalManager";

export const metadata: Metadata = {
  title: "onWard | A little progress, every day",
  description: "A calm, colorful place to keep your day moving forward.",
  applicationName: "onWard",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }], apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }] },
  appleWebApp: { capable: true, title: "onWard", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TaskProvider>
          <WorkspaceProvider>
            <main className="app">
              <Navigation />
              <section className="workspace">
                {children}
              </section>
              <CreationSpeedDial />
              <ModalManager />
            </main>
          </WorkspaceProvider>
        </TaskProvider>
      </body>
    </html>
  );
}
