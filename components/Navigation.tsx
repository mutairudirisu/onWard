"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTasks();

  const isHomeActive = pathname === "/";

  const isPersonalActive =
    pathname.startsWith("/personal") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/achievements") ||
    pathname.startsWith("/work-logs");

  const isWorkspaceActive =
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/projects");

  const isInsightsActive = pathname.startsWith("/insights");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="brand">
          ON<span>WARD</span>
        </Link>
        <small>MAKE PROGRESS</small>

        <nav>
          {/* Primary Section 1: Home */}
          <Link
            href="/"
            className={isHomeActive ? "active" : ""}
            title="Home: Today's Journey & Calendar"
          >
            <Icon name="home" />
            <span>Home</span>
          </Link>

          {/* Primary Section 2: Personal */}
          <Link
            href="/tasks"
            className={isPersonalActive ? "active" : ""}
            title="Personal: Tasks, Notes, Achievements, Work logs"
          >
            <Icon name="user" />
            <span>Personal</span>
          </Link>

          {/* Personal Sub-items */}
          {isPersonalActive && (
            <div className="ml-5 flex flex-col gap-1 border-l-2 border-[#b8e85e]/40 pl-2">
              <Link
                href="/tasks"
                className={`text-xs ${pathname.startsWith("/tasks") ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Tasks & Reminders</span>
              </Link>
              <Link
                href="/notes"
                className={`text-xs ${pathname.startsWith("/notes") ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Personal Notes</span>
              </Link>
              <Link
                href="/achievements"
                className={`text-xs ${pathname.startsWith("/achievements") ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Achievements</span>
              </Link>
              <Link
                href="/work-logs"
                className={`text-xs ${pathname.startsWith("/work-logs") ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Work Logs</span>
              </Link>
            </div>
          )}

          {/* Primary Section 2: Workspace */}
          <Link
            href="/workspace"
            className={isWorkspaceActive ? "active" : ""}
            title="Workspace: Documents, Reports, Projects, Folders"
          >
            <Icon name="briefcase" />
            <span>Workspace</span>
          </Link>

          {isWorkspaceActive && (
            <div className="ml-5 flex flex-col gap-1 border-l-2 border-[#b8e85e]/40 pl-2">
              <Link
                href="/workspace"
                className={`text-xs ${pathname === "/workspace" ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Overview & Docs</span>
              </Link>
              <Link
                href="/projects"
                className={`text-xs ${pathname.startsWith("/projects") ? "font-bold text-[#496612] dark:text-[#d3f36b]" : "text-zinc-500"}`}
              >
                <span>Projects</span>
              </Link>
            </div>
          )}

          {/* Primary Section 3: Insights */}
          <Link
            href="/insights"
            className={isInsightsActive ? "active" : ""}
            title="Insights: Actual data analytics & summary generator"
          >
            <Icon name="chart" />
            <span>Insights</span>
          </Link>
        </nav>

        <div className="sidebar-foot">
          <span>Small steps add up.</span>
          <Link href="/profile" className={pathname === "/profile" ? "active" : ""}>
            <Icon name="settings" />
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} />
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation: Home, Personal, Workspace, Insights */}
      <nav className="mobile-tabnav" aria-label="Primary navigation">
        <Link
          href="/"
          className={isHomeActive ? "active" : ""}
          aria-label="Home"
        >
          <Icon name="home" />
          {isHomeActive && <span className="whitespace-nowrap">Home</span>}
        </Link>

        <Link
          href="/tasks"
          className={isPersonalActive ? "active" : ""}
          aria-label="Personal"
        >
          <Icon name="user" />
          {isPersonalActive && <span className="whitespace-nowrap">Personal</span>}
        </Link>

        <Link
          href="/workspace"
          className={isWorkspaceActive ? "active" : ""}
          aria-label="Workspace"
        >
          <Icon name="briefcase" />
          {isWorkspaceActive && <span className="whitespace-nowrap">Workspace</span>}
        </Link>

        <Link
          href="/insights"
          className={isInsightsActive ? "active" : ""}
          aria-label="Insights"
        >
          <Icon name="chart" />
          {isInsightsActive && <span className="whitespace-nowrap">Insights</span>}
        </Link>
      </nav>
    </>
  );
}
