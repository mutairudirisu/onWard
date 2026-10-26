"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  useTasks,
  addDays,
  dateKey,
  fromKey,
  todayKey,
  startOfWeek,
  type Task,
} from "@/lib/task-context";

const weekday = new Intl.DateTimeFormat("en", { weekday: "short" });
const monthYear = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });

export default function HomePage() {
  const { tasks, toggle, ready, user, theme, setTheme, openCreateModal, setEditingTask } = useTasks();
  const [selected, setSelected] = useState(todayKey());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [weekAnchor, setWeekAnchor] = useState(startOfWeek(new Date()));
  const [monthCursor, setMonthCursor] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [taskView, setTaskView] = useState<"list" | "cards">("list");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("onward-theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("onward-theme", theme);
  }, [theme]);

  const selectedTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.archived && t.due_date === selected)
        .sort((a, b) => a.position - b.position),
    [tasks, selected]
  );
  const done = selectedTasks.filter((t) => t.completed).length;

  const userName = String(
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Your journey"
  );
  const userInitial = userName.slice(0, 1).toUpperCase();

  function choose(key: string) {
    setSelected(key);
    const date = fromKey(key);
    setWeekAnchor(startOfWeek(date));
    setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  if (!ready) {
    return (
      <main className="loading">
        <b>ONWARD</b>
        <span>Opening your day…</span>
      </main>
    );
  }

  return (
    <div className="dashboard journey-dashboard">
      <section className="greeting planner-greeting journey-greeting">
        <div className="greeting-content w-full flex flex-col">
          <div className="greeting-row flex items-center justify-between w-full gap-3">
            <h1 title={userName}>{userName}</h1>
            <Link href="/profile" className="planner-profile flex-shrink-0" aria-label="Open profile settings">
              {userInitial}
            </Link>
          </div>
          <p>
            Track daily goals and progress in
            <br />
            one simple view
          </p>
        </div>
      </section>

      <Calendar
        tasks={tasks}
        selected={selected}
        choose={choose}
        open={calendarOpen}
        setOpen={setCalendarOpen}
        weekAnchor={weekAnchor}
        setWeekAnchor={setWeekAnchor}
        monthCursor={monthCursor}
        setMonthCursor={setMonthCursor}
      />

      <section className="planner-reminder journey-insight">
        <div>
          <b>Luminous insight</b>
          <span>
            You completed {done} plan{done === 1 ? "" : "s"} today. Keep it up!
          </span>
        </div>
        <i aria-hidden="true">✦</i>
      </section>

      <section className="focus-heading">
        <div>
          <p className="eyebrow">YOUR PLAN</p>
          <h2>Today’s journey</h2>
          <span>
            {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"} · {done} completed
          </span>
        </div>
        <div className="focus-actions">
          <Link href="/tasks" className="planner-see-all">
            See all
          </Link>
          <div className="task-view-toggle" aria-label="Task layout">
            <button
              type="button"
              className={taskView === "list" ? "active" : ""}
              onClick={() => setTaskView("list")}
              aria-label="List view"
              aria-pressed={taskView === "list"}
            >
              <Icon name="list" size={16} />
            </button>
            <button
              type="button"
              className={taskView === "cards" ? "active" : ""}
              onClick={() => setTaskView("cards")}
              aria-label="Card view"
              aria-pressed={taskView === "cards"}
            >
              <Icon name="grid" size={16} />
            </button>
          </div>
          <button
            type="button"
            className="create-task"
            onClick={() => openCreateModal("task")}
          >
            <Icon name="plus" /> Create plan
          </button>
        </div>
      </section>

      {selectedTasks.length ? (
        <div className={`focus-list ${taskView === "cards" ? "cards" : ""}`}>
          {selectedTasks.map((task) => (
            <article
              key={task.id}
              className={`focus-task ${task.completed ? "completed" : ""}`}
              onClick={() => setEditingTask(task)}
            >
              <button
                type="button"
                className="task-check"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(task);
                }}
                aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
              >
                {task.completed && <Icon name="check" size={14} />}
              </button>
              <div className="task-copy">
                <b>{task.title}</b>
                <div>
                  <span className={`project-dot ${task.category.toLowerCase()}`} />
                  <span>{task.category}</span>
                  {task.details && <span>· {task.details}</span>}
                </div>
              </div>
              <span className="task-time">
                {task.due_date === todayKey() ? "Due today" : task.due_date}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-focus">
          <div>
            <Icon name="calendar" size={20} />
          </div>
          <b>A clear page for today.</b>
          <span>Add a plan to begin your journey.</span>
          <button type="button" onClick={() => openCreateModal("task")}>
            Create plan <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function Calendar({
  tasks,
  selected,
  choose,
  open,
  setOpen,
  weekAnchor,
  setWeekAnchor,
  monthCursor,
  setMonthCursor,
}: {
  tasks: Task[];
  selected: string;
  choose: (key: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  weekAnchor: Date;
  setWeekAnchor: (date: Date) => void;
  monthCursor: Date;
  setMonthCursor: (date: Date) => void;
}) {
  const [startY, setStartY] = useState<number | null>(null);
  const [startX, setStartX] = useState<number | null>(null);

  const counts = useMemo(
    () =>
      tasks.reduce<Record<string, number>>(
        (all, task) => ({ ...all, [task.due_date]: (all[task.due_date] || 0) + 1 }),
        {}
      ),
    [tasks]
  );
  const week = Array.from({ length: 7 }, (_, index) => addDays(weekAnchor, index));
  const gridStart = startOfWeek(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1));
  const monthDays = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

  const moveWeek = (amount: number) => setWeekAnchor(addDays(weekAnchor, amount * 7));

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    if (startY === null || startX === null) return;
    const y = event.clientY - startY,
      x = event.clientX - startX;
    if (Math.abs(y) > 35 && Math.abs(y) > Math.abs(x)) setOpen(y > 0);
    else if (!open && Math.abs(x) > 48) moveWeek(x > 0 ? -1 : 1);
    setStartY(null);
    setStartX(null);
  }

  return (
    <section
      className={`calendar ${open ? "expanded" : ""}`}
      onPointerDown={(event) => {
        setStartY(event.clientY);
        setStartX(event.clientX);
      }}
      onPointerUp={onPointerUp}
    >
      <div className="calendar-top">
        <div>
          <span>
            {open
              ? monthYear.format(monthCursor)
              : `${monthYear.format(weekAnchor).split(" ")[0]} ${weekAnchor.getFullYear()}`}
          </span>
          <small>{open ? "Tap a date to plan ahead" : "Your week at a glance"}</small>
        </div>
        <div className="calendar-actions">
          <Link href="/insights" className="calendar-insights">
            <Icon name="chart" /> <span>Insights</span>
          </Link>
          <button
            type="button"
            onClick={() =>
              open
                ? setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))
                : moveWeek(-1)
            }
            aria-label="Previous period"
          >
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            onClick={() =>
              open
                ? setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))
                : moveWeek(1)
            }
            aria-label="Next period"
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>
      {open ? (
        <>
          <div className="month-weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="month-grid">
            {monthDays.map((day) => (
              <DateButton
                key={dateKey(day)}
                day={day}
                selected={selected}
                taskCount={counts[dateKey(day)] || 0}
                muted={day.getMonth() !== monthCursor.getMonth()}
                onClick={() => choose(dateKey(day))}
                mode="month"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="week-strip">
          {week.map((day) => (
            <DateButton
              key={dateKey(day)}
              day={day}
              selected={selected}
              taskCount={counts[dateKey(day)] || 0}
              onClick={() => choose(dateKey(day))}
              mode="week"
            />
          ))}
        </div>
      )}
      <button
        type="button"
        className="calendar-handle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Collapse calendar" : "Expand calendar"}
      >
        <span />
        <small>{open ? "Swipe up to collapse" : "Swipe down to expand"}</small>
      </button>
    </section>
  );
}

function DateButton({
  day,
  selected,
  taskCount,
  muted = false,
  onClick,
  mode,
}: {
  day: Date;
  selected: string;
  taskCount: number;
  muted?: boolean;
  onClick: () => void;
  mode: "week" | "month";
}) {
  const key = dateKey(day);
  return (
    <button
      type="button"
      className={`date-button ${key === selected ? "selected" : ""} ${
        key === todayKey() ? "today" : ""
      } ${muted ? "muted" : ""} ${mode}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-pressed={key === selected}
    >
      <span>{mode === "week" ? weekday.format(day) : day.getDate()}</span>
      {mode === "week" && <b>{day.getDate()}</b>}
      {taskCount > 0 && <i aria-label={`${taskCount} tasks`} />}
    </button>
  );
}
