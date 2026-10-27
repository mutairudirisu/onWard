"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import { useWorkspace } from "@/lib/workspace-context";

export function CreationSpeedDial() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const {
    openCreateModal,
    setActiveReminderTask,
    tasks,
    openSummaryModal,
  } = useTasks();

  const {
    openCreateReport,
    openCreateDocument,
    openCreateProject,
    setFolderModalOpen,
  } = useWorkspace();

  const isWorkspace =
    pathname.startsWith("/workspace") || pathname.startsWith("/projects");
  const isInsights = pathname.startsWith("/insights");

  type ActionItem = {
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
  };

  const personalActions: ActionItem[] = [
    {
      id: "task",
      label: "New task",
      icon: "taskCheck",
      onClick: () => openCreateModal("task"),
    },
    {
      id: "note",
      label: "New note",
      icon: "noteDoc",
      onClick: () => openCreateModal("note"),
    },
    {
      id: "achievement",
      label: "Record achievement",
      icon: "award",
      onClick: () => openCreateModal("achievement"),
    },
    {
      id: "worklog",
      label: "Log completed work",
      icon: "bookOpen",
      onClick: () => openCreateModal("worklog"),
    },
    {
      id: "alarm",
      label: "Reminder",
      icon: "alarm",
      onClick: () => {
        const withReminder =
          tasks.find(
            (t) => t.details?.includes("am") || t.details?.includes("pm")
          ) || tasks[0];
        if (withReminder) {
          setActiveReminderTask(withReminder);
        } else {
          openCreateModal("task");
        }
      },
    },
    {
      id: "voice",
      label: "Voice note",
      icon: "mic",
      onClick: () => openCreateModal("note"),
    },
  ];

  const workspaceActions: ActionItem[] = [
    {
      id: "report",
      label: "New report",
      icon: "chart",
      onClick: () => openCreateReport("weekly"),
    },
    {
      id: "document",
      label: "New document",
      icon: "fileText",
      onClick: () => openCreateDocument(),
    },
    {
      id: "project",
      label: "New project",
      icon: "projectTarget",
      onClick: () => openCreateProject(),
    },
    {
      id: "folder",
      label: "New folder",
      icon: "folder",
      onClick: () => setFolderModalOpen(true),
    },
  ];

  const insightsActions: ActionItem[] = [
    {
      id: "summary",
      label: "Generate onWards",
      icon: "sparkles",
      onClick: () => openSummaryModal("linkedin"),
    },
    {
      id: "report-from-records",
      label: "Report from records",
      icon: "chart",
      onClick: () =>
        openCreateReport("activity", tasks.slice(0, 5).map((t) => t.id)),
    },
  ];

  const currentActions = isWorkspace
    ? workspaceActions
    : isInsights
    ? insightsActions
    : personalActions;

  const sectionName = isWorkspace
    ? "Workspace"
    : isInsights
    ? "Insights"
    : "Personal";

  return (
    <div className="fixed bottom-[17px] right-[16px] z-40 flex flex-col items-end">
      {/* Backdrop overlay when speed dial is open */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Action Menu Stacked Directly at the Top of the FAB */}
      {open && (
        <div
          className="relative z-40 mb-3 w-[270px] rounded-[26px] border border-white/10 bg-[#1c1c1e]/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95"
          role="menu"
          aria-label="Create options"
        >
          <div className="mb-2.5 flex items-center justify-between px-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1a1a6]">
              {sectionName} Actions
            </span>
            <span className="text-[10px] font-semibold text-[#d3f36b]">
              Select action
            </span>
          </div>

          <div
            className={`grid gap-1.5 ${
              currentActions.length === 2
                ? "grid-cols-2"
                : currentActions.length === 4
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {currentActions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
                className="group flex min-h-[58px] flex-col items-center justify-center rounded-[14px] bg-[#2c2c2e]/90 px-1.5 py-2 text-center transition-all duration-150 hover:scale-[1.04] hover:bg-[#3a3a3c] active:scale-95"
              >
                <div
                  className="flex h-6 w-6 items-center justify-center text-white transition-transform group-hover:scale-110"
                  style={{ color: "#ffffff" }}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    strokeWidth={1.9}
                    style={{ stroke: "#ffffff", color: "#ffffff" }}
                  />
                </div>
                <span className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-tight text-[#f2f2f7] group-hover:text-[#d3f36b]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Trigger Button: turns from + to × */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close create menu" : "Open create menu"}
        aria-expanded={open}
        className={`relative z-40 flex h-[58px] w-[58px] items-center justify-center rounded-full shadow-xl transition-all duration-200 active:scale-95 ${
          open
            ? "border border-white/20 bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]"
            : "bg-[#d3f36b] text-[#283618] shadow-[#718d3744] hover:brightness-105"
        }`}
        style={open ? { color: "#ffffff", backgroundColor: "#1c1c1e" } : {}}
      >
        <Icon
          name={open ? "close" : "plus"}
          size={open ? 22 : 26}
          strokeWidth={open ? 2.5 : 2}
          style={
            open
              ? { stroke: "#ffffff", color: "#ffffff" }
              : { stroke: "#283618", color: "#283618" }
          }
        />
      </button>
    </div>
  );
}
