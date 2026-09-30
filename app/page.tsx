"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  category: string;
  due_date: string;
  completed: boolean;
  position: number;
};

const starterTasks: Task[] = [
  { id: "starter-1", title: "Pick up a few things for the weekend", category: "Personal", due_date: "2026-09-29", completed: false, position: 0 },
  { id: "starter-2", title: "Send the project notes to the team", category: "Work", due_date: "2026-09-29", completed: false, position: 1 },
  { id: "starter-3", title: "Make a little time for a walk", category: "Personal", due_date: "2026-09-30", completed: false, position: 2 },
  { id: "starter-4", title: "Book an appointment", category: "Errands", due_date: "2026-10-01", completed: true, position: 3 },
];

const taskColumns = "id, title, category, due_date, completed, position";

function sameTask(first: Task, second: Task) {
  return first.id === second.id
    && first.title === second.title
    && first.category === second.category
    && first.due_date === second.due_date
    && first.completed === second.completed
    && first.position === second.position;
}

const todoCategories = [
  { name: "Personal", icon: "calendar", color: "butter" },
  { name: "Work", icon: "archive", color: "rose" },
  { name: "Errands", icon: "calendar", color: "sky" },
  { name: "Ideas", icon: "spark", color: "mint" },
  { name: "Home", icon: "calendar", color: "peach" },
  { name: "Health", icon: "check", color: "teal" },
  { name: "Learning", icon: "spark", color: "lime" },
] as const;

const colorByCategory = Object.fromEntries(
  todoCategories.map(({ name, color }) => [name, color]),
) as Record<string, string>;

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

function formatDate(date: string) {
  if (date < localDate) return "Overdue";
  if (date === localDate) return "Today";
  const tomorrow = new Date(`${localDate}T12:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date === tomorrow.toISOString().slice(0, 10)) return "Tomorrow";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" });
}

function Icon({ name, size = 18 }: { name: "spark" | "calendar" | "archive" | "search" | "bell" | "plus" | "grip" | "check" | "close" | "trash" | "warning" | "chevron"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths = {
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M7.5 3v4M16.5 3v4M3.5 10h17" /></>,
    archive: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    grip: <><circle cx="9" cy="6" r=".8" /><circle cx="15" cy="6" r=".8" /><circle cx="9" cy="12" r=".8" /><circle cx="15" cy="12" r=".8" /><circle cx="9" cy="18" r=".8" /><circle cx="15" cy="18" r=".8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="m5 7 1 13h12l1-13M9 7V4h6v3" /></>,
    warning: <><path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState("All todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      if (supabase) {
        const { data, error: loadError } = await supabase
          .from("todos")
          .select("id, title, category, due_date, completed, position")
          .order("position", { ascending: true });
        if (loadError) {
          setError("Could not connect to Supabase. Check your project settings and database setup.");
        } else {
          setTasks(data ?? []);
        }
      } else {
        try {
          const saved = window.localStorage.getItem("onward-tasks");
          setTasks(saved ? JSON.parse(saved) as Task[] : starterTasks);
        } catch {
          setTasks(starterTasks);
        }
      }
      setReady(true);
    }

    void loadTasks();
  }, []);

  useEffect(() => {
    if (ready && !supabase) window.localStorage.setItem("onward-tasks", JSON.stringify(tasks));
  }, [ready, tasks]);

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter = filter === "All todos" || task.category === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && (showCompleted || !task.completed);
  });
  const openCount = tasks.filter((task) => !task.completed).length;
  const doneCount = tasks.length - openCount;

  async function saveTask(task: Task, previousTask?: Task) {
    if (!supabase) return;
    try {
      const { data, error: saveError } = await supabase
        .from("todos")
        .upsert(task)
        .select(taskColumns)
        .single();
      if (saveError) throw saveError;
      if (data) {
        setTasks((current) => current.map((item) =>
          item.id === task.id && sameTask(item, task) ? data : item,
        ));
      }
    } catch {
      setTasks((current) => {
        const currentTask = current.find((item) => item.id === task.id);
        if (!currentTask || !sameTask(currentTask, task)) return current;
        return previousTask
          ? current.map((item) => item.id === task.id ? previousTask : item)
          : current.filter((item) => item.id !== task.id);
      });
      setError("Could not save that change to Supabase. Please try again.");
    }
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    if (editingTask) {
      const updated: Task = {
        ...editingTask,
        title,
        category: selectedCategory,
        due_date: String(form.get("due_date") ?? editingTask.due_date),
      };
      setTasks((current) => current.map((task) => task.id === updated.id ? updated : task));
      void saveTask(updated, editingTask);
      setAdding(false);
      setEditingTask(null);
      return;
    }
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      category: selectedCategory,
      due_date: String(form.get("due_date") ?? localDate),
      completed: false,
      position: tasks.length,
    };
    setTasks((current) => [...current, task]);
    void saveTask(task);
    setAdding(false);
  }

  function openAddTodo() {
    setEditingTask(null);
    setSelectedCategory("Personal");
    setCategoryOpen(false);
    setAdding(true);
  }

  function openEditTodo(task: Task) {
    setEditingTask(task);
    setSelectedCategory(task.category);
    setCategoryOpen(false);
    setAdding(true);
  }

  function closeTodoDialog() {
    setAdding(false);
    setEditingTask(null);
    setCategoryOpen(false);
  }

  function deleteTodo(task: Task) {
    const previousIndex = tasks.findIndex((item) => item.id === task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id));
    if (!supabase) return;
    void (async () => {
      try {
        const { error: deleteError } = await supabase.from("todos").delete().eq("id", task.id);
        if (deleteError) throw deleteError;
      } catch {
        setTasks((current) => current.some((item) => item.id === task.id)
          ? current
          : [...current.slice(0, previousIndex), task, ...current.slice(previousIndex)]);
        setError("Could not delete that todo from Supabase. Please try again.");
      }
    })();
  }

  function confirmDeleteTodo() {
    if (!deletingTask) return;
    const task = deletingTask;
    setDeletingTask(null);
    deleteTodo(task);
  }

  async function toggleTask(task: Task) {
    const updated = { ...task, completed: !task.completed };
    setTasks((current) => current.map((item) => item.id === task.id ? updated : item));
    void saveTask(updated, task);
  }

  function saveOrder(orderedTasks: Task[]) {
    const positioned = orderedTasks.map((task, index) => ({ ...task, position: index }));
    setTasks(positioned);
    if (!supabase) return;
    void (async () => {
      try {
        const { data, error: saveError } = await supabase
          .from("todos")
          .upsert(positioned)
          .select(taskColumns);
        if (saveError) throw saveError;
        if (data) {
          const persistedById = new Map(data.map((task) => [task.id, task]));
          setTasks((current) => current.every((task, index) => sameTask(task, positioned[index]))
            ? current.map((task) => persistedById.get(task.id) ?? task)
            : current);
        }
      } catch {
        setTasks((current) => current.length === positioned.length
          && current.every((task, index) => sameTask(task, positioned[index]))
          ? orderedTasks
          : current);
        setError("Could not save the new order to Supabase.");
      }
    })();
  }

  function moveTask(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const reordered = [...tasks];
    const fromIndex = reordered.findIndex((task) => task.id === draggedId);
    const toIndex = reordered.findIndex((task) => task.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setDraggedId(null);
    saveOrder(reordered);
  }

  function moveTaskByOffset(taskId: string, offset: number) {
    const fromIndex = tasks.findIndex((task) => task.id === taskId);
    const toIndex = fromIndex + offset;
    if (fromIndex < 0 || toIndex < 0 || toIndex >= tasks.length) return;
    const reordered = [...tasks];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    saveOrder(reordered);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#today" aria-label="onWard home"><span className="brand-mark"><Icon name="spark" size={21} /></span><span>onWard<span className="brand-period">.</span></span></a>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Todo filters">
          {[
            { name: "All todos", icon: "spark" as const, count: openCount },
            ...todoCategories.map(({ name, icon }) => ({ name, icon, count: undefined })),
          ].map((item) => (
            <button className={`nav-item ${filter === item.name ? "active" : ""}`} key={item.name} onClick={() => setFilter(item.name)}>
              <Icon name={item.icon} size={17} /><span>{item.name}</span>{item.count !== undefined && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note"><span className="note-spark"><Icon name="spark" size={18} /></span><p>Little by little<br />goes a long way.</p><span className="note-caption">YOU&apos;RE DOING GREAT</span></div>
        <div className="profile"><div className="avatar">J</div><div><strong>Just you</strong><span>Your own little space</span></div><span className="profile-dots">···</span></div>
      </aside>

      <section className="workspace" id="today">
        <header className="topbar"><span className="breadcrumb">Your space <span>/</span> <strong>My todos</strong></span><div className="top-actions"><button className="icon-button" aria-label="Search todos" onClick={() => document.getElementById("task-search")?.focus()}><Icon name="search" /></button><button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" /><span /></button></div></header>

        <div className="content">
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" />{today.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</div><h1>A little progress,<br className="mobile-break" /> <span>every day.</span></h1><p className="welcome-copy">You&apos;ve got this. Let&apos;s see what&apos;s on your mind.</p></div><div className="today-stamp"><span className="stamp-day">{today.toLocaleDateString("en", { day: "2-digit" })}</span><span className="stamp-month">{today.toLocaleDateString("en", { month: "short" }).toUpperCase()}</span></div></section>

          <section className="summary-strip" aria-label="Todo progress"><div className="summary-count"><span className="summary-number">{openCount}</span><span>still to do</span></div><div className="summary-divider" /><div className="summary-progress"><div className="progress-copy"><span>Today&apos;s momentum</span><span>{tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0}%</span></div><div className="progress-track"><span style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} /></div></div><span className="summary-flower">✳</span></section>

          <section className="tasks-section">
            <div className="section-heading"><div><span className="section-kicker">YOUR LIST</span><h2>Todos <span className="task-total">{tasks.length}</span></h2></div><div className="list-actions"><label className="search-box"><Icon name="search" size={16} /><input id="task-search" placeholder="Find a todo" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label><button className="add-todo-button" onClick={openAddTodo}><Icon name="plus" size={16} /><span>Add a Todo</span></button><button className="filter-button" onClick={() => setShowCompleted((visible) => !visible)} aria-label={showCompleted ? "Hide completed todos" : "Show completed todos"} aria-pressed={!showCompleted}><Icon name="check" size={15} /><span>{showCompleted ? "All todos" : "Hide completed"}</span></button></div></div>

            {error && <p className="error-banner" role="alert">{error} <button onClick={() => setError("")} aria-label="Dismiss error"><Icon name="close" size={15} /></button></p>}

            {!ready ? <div className="loading-list">Getting your day ready...</div> : (
              <div className="task-grid">
                {visibleTasks.map((task) => <article key={task.id} className={`task-card ${colorByCategory[task.category] ?? "mint"} ${task.completed ? "is-complete" : ""} ${draggedId === task.id ? "is-dragging" : ""}`} role="group" aria-label={`Todo: ${task.title}. Press Enter to edit.`} tabIndex={0} onClick={() => openEditTodo(task)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openEditTodo(task); } }} onDragOver={(event) => event.preventDefault()} onDrop={() => void moveTask(task.id)}>
                  <div className="card-top"><span className="category-dot" /> <span className="card-category">{task.category}</span><span className="card-actions"><button className="drag-handle" aria-label="Drag to reorder" title="Drag to reorder" draggable onDragStart={(event) => { event.stopPropagation(); event.dataTransfer.setData("text/plain", task.id); setDraggedId(task.id); }} onDragEnd={(event) => { event.stopPropagation(); setDraggedId(null); }} onClick={(event) => event.stopPropagation()}><Icon name="grip" size={19} /></button><button className="task-check" onClick={(event) => { event.stopPropagation(); void toggleTask(task); }} aria-label={task.completed ? "Mark as not done" : "Mark as done"} aria-pressed={task.completed}>{task.completed && <Icon name="check" size={16} />}</button><button className="delete-todo-button" onClick={(event) => { event.stopPropagation(); setDeletingTask(task); }} aria-label={`Delete ${task.title}`} title="Delete todo"><Icon name="trash" size={16} /></button></span></div>
                  <div className="card-middle"><p className="task-title">{task.title}</p><span className={`task-date ${task.due_date < localDate && !task.completed ? "overdue" : ""}`}>{formatDate(task.due_date)}{task.due_date < localDate && !task.completed ? " · gently overdue" : ""}</span></div>
                  <div className="card-bottom"><span className="card-date-icon"><Icon name="calendar" size={13} /> {new Date(`${task.due_date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</span><span className="move-controls"><button onClick={(event) => { event.stopPropagation(); void moveTaskByOffset(task.id, -1); }} aria-label={`Move ${task.title} up`} title="Move up" disabled={tasks[0]?.id === task.id}>↑</button><button onClick={(event) => { event.stopPropagation(); void moveTaskByOffset(task.id, 1); }} aria-label={`Move ${task.title} down`} title="Move down" disabled={tasks[tasks.length - 1]?.id === task.id}>↓</button></span></div>
                </article>)}
                <button className="add-card" onClick={openAddTodo}><span className="add-card-icon"><Icon name="plus" size={20} /></span><span>Add a todo</span><span className="add-hint">Make some room for a new idea</span></button>
              </div>
            )}
            {ready && visibleTasks.length === 0 && <div className="empty-state"><span>✳</span><p>Nothing on this list just yet.</p><button onClick={openAddTodo}>Add your first todo</button></div>}
          </section>

          <footer className="page-footer"><span>One thing at a time.</span><span className="footer-flourish">— onWard</span></footer>
        </div>
        <button className="mobile-add" onClick={openAddTodo} aria-label="Add a todo"><Icon name="plus" size={23} /></button>
      </section>

      {adding && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeTodoDialog(); }}><section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="section-kicker">{editingTask ? "A QUICK UPDATE" : "A FRESH START"}</span><h2 id="modal-title">{editingTask ? "Edit todo" : "Add a todo"}</h2></div><button className="icon-button" onClick={closeTodoDialog} aria-label="Close"><Icon name="close" /></button></div><form key={editingTask?.id ?? "new-todo"} className="flex flex-col" onSubmit={(event) => void addTask(event)}><label className="field-label" htmlFor="new-title">What&apos;s on your mind?</label><input id="new-title" className="form-input" name="title" placeholder="Write it down, get it out of your head..." defaultValue={editingTask?.title ?? ""} autoFocus required maxLength={140} /><div className="form-row"><div className="form-field"><span className="field-label" id="category-label">Category</span><div className="category-select"><button className="category-select-trigger" type="button" role="combobox" aria-labelledby="category-label" aria-haspopup="listbox" aria-expanded={categoryOpen} aria-controls="category-options" onClick={() => setCategoryOpen((open) => !open)}><span className={`category-select-swatch ${colorByCategory[selectedCategory] ?? "mint"}`} />{selectedCategory}<Icon name="chevron" size={17} /></button>{categoryOpen && <div className="category-options" id="category-options" role="listbox" aria-labelledby="category-label">{todoCategories.map(({ name: category }) => <button className="category-option" key={category} type="button" role="option" aria-selected={selectedCategory === category} onClick={() => { setSelectedCategory(category); setCategoryOpen(false); }}><span className={`category-select-swatch ${colorByCategory[category]}`} />{category}{selectedCategory === category && <Icon name="check" size={16} />}</button>)}</div>}</div></div><div className="form-field"><label className="field-label" htmlFor="due-date">Due date</label><div className="date-input-wrap"><Icon name="calendar" size={17} /><input id="due-date" className="form-input date-input" name="due_date" type="date" defaultValue={editingTask?.due_date ?? localDate} required /></div></div></div><button className="submit-button" type="submit"><Icon name={editingTask ? "check" : "plus"} size={17} />{editingTask ? "Save changes" : "Add a todo"}</button></form></section></div>}

      {deletingTask && <div className="delete-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeletingTask(null); }} onKeyDown={(event) => { if (event.key === "Escape") setDeletingTask(null); }}><section className="delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><div className="drawer-handle" /><div className="warning-icon"><Icon name="warning" size={25} /></div><h2 id="delete-title">Delete this todo?</h2><p id="delete-description">You&apos;re about to remove <strong>&ldquo;{deletingTask.title}&rdquo;</strong> from your list. It won&apos;t be possible to recover it.</p><div className="delete-actions"><button className="delete-cancel-button" autoFocus onClick={() => setDeletingTask(null)}>Keep this todo</button><button className="delete-confirm-button" onClick={confirmDeleteTodo}><Icon name="trash" size={16} />Delete todo</button></div></section></div>}
    </main>
  );
}