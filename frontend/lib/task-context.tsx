"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { loadTodos, removeTodo, saveTodo, saveTodoOrder } from "@/lib/todo-operations";

export type PlanType = "task" | "note" | "project" | "community";
export type Task = {
  id: string;
  title: string;
  plan_type: PlanType;
  details: string | null;
  category: string;
  due_date: string;
  completed: boolean;
  archived: boolean;
  favorite: boolean;
  position: number;
};

export type Achievement = {
  id: string;
  title: string;
  date: string;
  category: "Technical" | "Leadership" | "Delivery" | "Innovation" | "Impact";
  impact: string;
  skills: string[];
  details: string | null;
};

export type WorkLog = {
  id: string;
  title: string;
  date: string;
  category: "Engineering" | "Architecture" | "Operations" | "Research" | "Client Engagement";
  outcomes: string;
  lessons_learned: string;
  hours: number | null;
};

export type SummaryType = "appraisal" | "cv" | "portfolio" | "linkedin";

export const categoriesByPlan: Record<PlanType, string[]> = {
  task: ["Personal", "Work", "Study", "Health", "Errands"],
  note: ["Ideas", "Journal", "Learning", "Reference"],
  project: ["Work", "Personal", "Study", "Community"],
  community: ["Volunteering", "Family", "Friends", "Local"],
};

export const planLabels: Record<PlanType, string> = {
  task: "Task",
  note: "Note",
  project: "Project",
  community: "Community",
};

const pad = (n: number) => String(n).padStart(2, "0");
export const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const todayKey = () => dateKey(new Date());
export const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};
export const fromKey = (key: string) => new Date(`${key}T12:00:00`);
export const startOfWeek = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
};

function demoTasks(): Task[] {
  const today = todayKey();
  const day = (n: number) => dateKey(addDays(new Date(), n));
  return [
    { id: "demo-task-1", title: "Salatul Duha", plan_type: "task", details: "07:45 am Expired", category: "Personal", due_date: today, completed: false, archived: false, favorite: true, position: 0 },
    { id: "demo-note-1", title: "DM IT", plan_type: "note", details: "Reminder to Retire Money.", category: "Work", due_date: "2026-09-29", completed: false, archived: false, favorite: false, position: 1 },
    { id: "demo-note-2", title: "Olokodana.", plan_type: "note", details: "Dele\n9", category: "Ideas", due_date: "2026-09-18", completed: false, archived: false, favorite: false, position: 2 },
    { id: "demo-note-3", title: "Masjid Reminder", plan_type: "note", details: "A reminder", category: "Community", due_date: "2026-08-26", completed: false, archived: false, favorite: false, position: 3 },
    { id: "demo-task-2", title: "Morning movement", plan_type: "task", details: "08:30 am", category: "Health", due_date: today, completed: true, archived: false, favorite: false, position: 4 },
    { id: "demo-task-3", title: "Review project milestones", plan_type: "project", details: "Choose the next milestone to move forward.", category: "Work", due_date: day(1), completed: false, archived: false, favorite: false, position: 5 },
    { id: "demo-task-4", title: "Read 20 pages", plan_type: "task", details: "09:00 pm", category: "Study", due_date: day(2), completed: false, archived: false, favorite: false, position: 6 },
    { id: "demo-task-5", title: "Plan next week", plan_type: "note", details: "Leave room for what matters most.", category: "Ideas", due_date: day(4), completed: false, archived: false, favorite: false, position: 7 },
  ];
}

function demoAchievements(): Achievement[] {
  return [
    {
      id: "achieve-1",
      title: "Reduced API latency by 45% with query caching layer",
      date: "2026-10-22",
      category: "Technical",
      impact: "Accelerated page load to sub-100ms and saved 20GB monthly egress bandwidth",
      skills: ["PostgreSQL", "Next.js", "Redis"],
      details: "Re-architected Supabase queries and applied selective client-side caching with optimistic rollback.",
    },
    {
      id: "achieve-2",
      title: "Delivered mobile-first offline PWA ahead of target deadline",
      date: "2026-10-15",
      category: "Delivery",
      impact: "100% test suite pass rate with zero production downtime during deployment",
      skills: ["PWA", "Service Worker", "TypeScript"],
      details: "Engineered offline fallback sync, push notification hooks, and instant local state persistence.",
    },
    {
      id: "achieve-3",
      title: "Mentored 3 junior developers on testing and Supabase RLS security",
      date: "2026-09-30",
      category: "Leadership",
      impact: "Squad velocity increased by 20% and zero security policy leaks found in audit",
      skills: ["Row Level Security", "Code Review", "Mentorship"],
      details: "Conducted two deep-dive workshops on optimistic mutations and Supabase auth boundaries.",
    },
  ];
}

function demoWorkLogs(): WorkLog[] {
  return [
    {
      id: "log-1",
      title: "Implemented context-aware speed dial and 3-section navigation",
      date: "2026-10-26",
      category: "Engineering",
      outcomes: "Organized app into Personal, Workspace, and Insights with section-specific creation options.",
      lessons_learned: "Anchoring speed dial tiles directly above the bottom FAB yields optimal mobile ergonomics.",
      hours: 3.5,
    },
    {
      id: "log-2",
      title: "Audited database schema and security policies for personal privacy",
      date: "2026-10-25",
      category: "Architecture",
      outcomes: "Designed strict row-level security isolation ensuring personal records are strictly private to user_id.",
      lessons_learned: "Explicit checking policies prevent accidental data leakage when collaboration features are added later.",
      hours: 2,
    },
    {
      id: "log-3",
      title: "Implemented draggable bottom sheet modal and touch dismiss gesture",
      date: "2026-10-24",
      category: "Engineering",
      outcomes: "Removed modal margins and implemented pull-down gesture to dismiss across all dialogs.",
      lessons_learned: "Pointer events with velocity thresholds yield smoother dismissal feel than raw touch handlers.",
      hours: 4,
    },
  ];
}

type TaskContextType = {
  tasks: Task[];
  achievements: Achievement[];
  workLogs: WorkLog[];
  ready: boolean;
  user: User | null;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  notice: string;
  setNotice: (msg: string) => void;
  toggle: (task: Task) => void;
  archive: (task: Task) => void;
  favorite: (task: Task) => void;
  remove: (task: Task) => void;
  reorder: (tasks: Task[]) => void;
  saveTask: (task: Task) => Promise<void>;
  saveAchievement: (achievement: Achievement) => Promise<void>;
  removeAchievement: (id: string) => Promise<void>;
  saveWorkLog: (workLog: WorkLog) => Promise<void>;
  removeWorkLog: (id: string) => Promise<void>;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingNote: Task | null;
  setEditingNote: (note: Task | null) => void;
  editingAchievement: Achievement | null;
  setEditingAchievement: (item: Achievement | null) => void;
  editingWorkLog: WorkLog | null;
  setEditingWorkLog: (item: WorkLog | null) => void;
  activeReminderTask: Task | null;
  setActiveReminderTask: (task: Task | null) => void;
  summaryModalOpen: boolean;
  setSummaryModalOpen: (open: boolean) => void;
  summaryType: SummaryType;
  openSummaryModal: (type?: SummaryType) => void;
  openCreateModal: (planType?: PlanType | "achievement" | "worklog") => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notice, setNotice] = useState("");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingNote, setEditingNote] = useState<Task | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingWorkLog, setEditingWorkLog] = useState<WorkLog | null>(null);
  const [activeReminderTask, setActiveReminderTask] = useState<Task | null>(null);

  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryType, setSummaryType] = useState<SummaryType>("appraisal");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    const saved = localStorage.getItem("onward-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);

    const savedAchievements = localStorage.getItem("onward-achievements");
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch {
        setAchievements(demoAchievements());
      }
    } else {
      setAchievements(demoAchievements());
    }

    const savedWorkLogs = localStorage.getItem("onward-worklogs");
    if (savedWorkLogs) {
      try {
        setWorkLogs(JSON.parse(savedWorkLogs));
      } catch {
        setWorkLogs(demoWorkLogs());
      }
    } else {
      setWorkLogs(demoWorkLogs());
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("onward-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!supabase) {
      setTasks(demoTasks());
      setReady(true);
      return;
    }
    let live = true;
    const sync = async (next: User | null) => {
      if (!live) return;
      setUser(next);
      if (!next) {
        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("onward-guest-tasks") : null;
          if (stored) {
            setTasks(JSON.parse(stored));
          } else {
            setTasks(demoTasks());
          }
        } catch {
          setTasks(demoTasks());
        }
        setReady(true);
        return;
      }
      try {
        setTasks(await loadTodos(supabase));
      } catch {
        setNotice("Your tasks could not be loaded.");
      }
      setReady(true);
    };
    supabase.auth.getSession().then(({ data }) => void sync(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => void sync(session?.user ?? null));
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function persist(next: Task, previous: Task) {
    if (!user) {
      setTasks((all) => {
        const updated = all.map((t) => (t.id === next.id ? next : t));
        if (typeof window !== "undefined") {
          localStorage.setItem("onward-guest-tasks", JSON.stringify(updated));
        }
        return updated;
      });
      return;
    }
    if (!supabase) return;
    try {
      const payload = { ...next, user_id: user.id };
      const saved = await saveTodo(supabase, payload);
      setTasks((all) => all.map((t) => (t.id === next.id ? saved : t)));
    } catch {
      setTasks((all) => all.map((t) => (t.id === previous.id ? previous : t)));
      setNotice("The plan could not be saved.");
    }
  }

  function toggle(task: Task) {
    const next = { ...task, completed: !task.completed };
    setTasks((all) => all.map((t) => (t.id === task.id ? next : t)));
    void persist(next, task);
  }

  function archive(task: Task) {
    const next = { ...task, archived: !task.archived };
    setTasks((all) => all.map((t) => (t.id === task.id ? next : t)));
    void persist(next, task);
  }

  function favorite(task: Task) {
    const next = { ...task, favorite: !task.favorite };
    setTasks((all) => all.map((t) => (t.id === task.id ? next : t)));
    void persist(next, task);
  }

  function remove(task: Task) {
    const prev = tasks;
    const nextTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(nextTasks);
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("onward-guest-tasks", JSON.stringify(nextTasks));
      }
      return;
    }
    if (supabase) {
      void removeTodo(supabase, task.id).catch(() => {
        setTasks(prev);
        setNotice("The plan could not be deleted.");
      });
    }
  }

  function reorder(ordered: Task[]) {
    const positions = new Map(ordered.map((t, idx) => [t.id, idx]));
    const prev = tasks;
    const next = tasks.map((t) => (positions.has(t.id) ? { ...t, position: positions.get(t.id)! } : t));
    setTasks(next);
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("onward-guest-tasks", JSON.stringify(next));
      }
      return;
    }
    if (supabase) {
      const payload = next.filter((t) => positions.has(t.id)).map((t) => ({ ...t, user_id: user.id }));
      void saveTodoOrder(supabase, payload)
        .then((saved: Task[]) => {
          setTasks((all) => all.map((t) => saved.find((item: Task) => item.id === t.id) || t));
        })
        .catch(() => {
          setTasks(prev);
          setNotice("The order could not be saved.");
        });
    }
  }

  async function saveTask(next: Task) {
    const isNew = !tasks.some((t) => t.id === next.id);
    const prev = tasks.find((t) => t.id === next.id);
    const updatedTasks = isNew ? [...tasks, next] : tasks.map((t) => (t.id === next.id ? next : t));
    setTasks(updatedTasks);
    setEditingTask(null);
    setEditingNote(null);

    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("onward-guest-tasks", JSON.stringify(updatedTasks));
      }
      setNotice("Plan saved.");
      return;
    }

    if (supabase) {
      try {
        const payload = { ...next, user_id: user.id };
        const saved = await saveTodo(supabase, payload);
        setTasks((all) => all.map((t) => (t.id === saved.id ? saved : t)));
        setNotice("Plan saved.");
      } catch {
        setTasks((all) => (isNew ? all.filter((t) => t.id !== next.id) : prev ? all.map((t) => (t.id === prev.id ? prev : t)) : all));
        setNotice("Your plan could not be saved.");
      }
    }
  }

  async function saveAchievement(item: Achievement) {
    setAchievements((prev) => {
      const exists = prev.some((a) => a.id === item.id);
      const updated = exists ? prev.map((a) => (a.id === item.id ? item : a)) : [item, ...prev];
      localStorage.setItem("onward-achievements", JSON.stringify(updated));
      return updated;
    });
    setEditingAchievement(null);
    setNotice("Achievement saved.");
  }

  async function removeAchievement(id: string) {
    setAchievements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      localStorage.setItem("onward-achievements", JSON.stringify(updated));
      return updated;
    });
    setEditingAchievement(null);
    setNotice("Achievement removed.");
  }

  async function saveWorkLog(item: WorkLog) {
    setWorkLogs((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      const updated = exists ? prev.map((w) => (w.id === item.id ? item : w)) : [item, ...prev];
      localStorage.setItem("onward-worklogs", JSON.stringify(updated));
      return updated;
    });
    setEditingWorkLog(null);
    setNotice("Work log saved.");
  }

  async function removeWorkLog(id: string) {
    setWorkLogs((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      localStorage.setItem("onward-worklogs", JSON.stringify(updated));
      return updated;
    });
    setEditingWorkLog(null);
    setNotice("Work log removed.");
  }

  function openSummaryModal(type: SummaryType = "appraisal") {
    setSummaryType(type);
    setSummaryModalOpen(true);
  }

  function openCreateModal(planType: PlanType | "achievement" | "worklog" = "task") {
    const newId = crypto.randomUUID();
    if (planType === "achievement") {
      setEditingAchievement({
        id: newId,
        title: "",
        date: todayKey(),
        category: "Technical",
        impact: "",
        skills: [],
        details: "",
      });
      return;
    }
    if (planType === "worklog") {
      setEditingWorkLog({
        id: newId,
        title: "",
        date: todayKey(),
        category: "Engineering",
        outcomes: "",
        lessons_learned: "",
        hours: null,
      });
      return;
    }

    const newTask: Task = {
      id: newId,
      title: "",
      plan_type: planType,
      details: null,
      category: categoriesByPlan[planType][0],
      due_date: todayKey(),
      completed: false,
      archived: false,
      favorite: false,
      position: tasks.length,
    };
    if (planType === "note") {
      setEditingNote(newTask);
    } else {
      setEditingTask(newTask);
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        achievements,
        workLogs,
        ready,
        user,
        theme,
        setTheme,
        notice,
        setNotice,
        toggle,
        archive,
        favorite,
        remove,
        reorder,
        saveTask,
        saveAchievement,
        removeAchievement,
        saveWorkLog,
        removeWorkLog,
        editingTask,
        setEditingTask,
        editingNote,
        setEditingNote,
        editingAchievement,
        setEditingAchievement,
        editingWorkLog,
        setEditingWorkLog,
        activeReminderTask,
        setActiveReminderTask,
        summaryModalOpen,
        setSummaryModalOpen,
        summaryType,
        openSummaryModal,
        openCreateModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
}
