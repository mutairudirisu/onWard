"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme, user } = useTasks();

  const userName = String(
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Idris"
  );
  const userInitial = userName.slice(0, 1).toUpperCase();
  const userSubtitle = user?.email || "Account & preferences";

  const isHomeActive = pathname === "/";

  const isPersonalActive =
    pathname.startsWith("/personal") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/achievements");

  const isWorkspaceActive =
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/work-logs") ||
    pathname.startsWith("/projects");

  const isInsightsActive = pathname.startsWith("/insights");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="brand" title="onWard by GIGS Labs">
          <span className="brand-title">
            <span className="brand-o">o</span>nWard
          </span>
          <span className="brand-subscript">
            <span className="brand-by">by</span>
            <span className="brand-author">GIGS Labs</span>
          </span>
        </Link>
        <small className="sidebar-motto">
          A little progress, <span className="sidebar-motto-lime">everyday</span>
        </small>

        <nav>
          {/* Primary Section 1: Home */}
          <Link
            href="/"
            className={`sidebar-nav-link ${isHomeActive ? "active" : ""}`}
            title="Home: Today's Journey & Calendar"
          >
            <Icon name="home" size={18} />
            <span>Home</span>
          </Link>

          {/* Primary Section 2: Personal */}
          <Link
            href="/tasks"
            className={`sidebar-nav-link ${isPersonalActive ? "active" : ""}`}
            title="Personal: Tasks, Notes, Achievements"
          >
            <Icon name="user" size={18} />
            <span>Personal</span>
          </Link>

          {/* Personal Sub-items with meaningful real icons */}
          {isPersonalActive && (
            <div className="sidebar-subnav">
              <Link
                href="/tasks"
                className={`sidebar-sub-link ${pathname.startsWith("/tasks") ? "active" : ""}`}
              >
                <Icon name="taskCheck" size={14} />
                <span>Tasks & Reminders</span>
              </Link>
              <Link
                href="/notes"
                className={`sidebar-sub-link ${pathname.startsWith("/notes") ? "active" : ""}`}
              >
                <Icon name="noteDoc" size={14} />
                <span>Personal Notes</span>
              </Link>
              <Link
                href="/achievements"
                className={`sidebar-sub-link ${pathname.startsWith("/achievements") ? "active" : ""}`}
              >
                <Icon name="award" size={14} />
                <span>Achievements</span>
              </Link>
            </div>
          )}

          {/* Primary Section 3: Workspace */}
          <Link
            href="/workspace"
            className={`sidebar-nav-link ${isWorkspaceActive ? "active" : ""}`}
            title="Workspace: Folders, Documents & Work Logs"
          >
            <Icon name="folder" size={18} />
            <span>Workspace</span>
          </Link>

          {/* Workspace Sub-items: Docs & Folders, Work Logs */}
          {isWorkspaceActive && (
            <div className="sidebar-subnav">
              <Link
                href="/workspace"
                className={`sidebar-sub-link ${pathname === "/workspace" ? "active" : ""}`}
              >
                <Icon name="noteDoc" size={14} />
                <span>Docs & Folders</span>
              </Link>
              <Link
                href="/work-logs"
                className={`sidebar-sub-link ${pathname.startsWith("/work-logs") ? "active" : ""}`}
              >
                <Icon name="bookOpen" size={14} />
                <span>Work Logs</span>
              </Link>
            </div>
          )}

          {/* Primary Section 4: Insights */}
          <Link
            href="/insights"
            className={`sidebar-nav-link ${isInsightsActive ? "active" : ""}`}
            title="Insights: Actual data analytics & summary generator"
          >
            <Icon name="chart" size={18} />
            <span>Insights</span>
          </Link>
        </nav>

        <div className="sidebar-foot">
          {/* Desktop Rich Profile Card */}
          <Link
            href="/profile"
            className={`sidebar-profile-card ${pathname === "/profile" ? "active" : ""}`}
            title="View Profile and Account Settings"
          >
            <div className="sidebar-profile-avatar">{userInitial}</div>
            <div className="sidebar-profile-meta">
              <span className="sidebar-profile-name">{userName}</span>
              <span className="sidebar-profile-sub">{userSubtitle}</span>
            </div>
            <Icon name="settings" size={15} className="sidebar-profile-icon" />
          </Link>

          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="sidebar-foot-item"
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={17} />
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
