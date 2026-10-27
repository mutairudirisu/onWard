"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PersonalTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "Overview", href: "/" },
    { label: "Tasks", href: "/tasks" },
    { label: "Notes", href: "/notes" },
    { label: "Achievements", href: "/achievements" },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-bold no-scrollbar">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
              isActive
                ? "bg-[#d3f36b] text-[#283618] shadow-sm font-bold"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
