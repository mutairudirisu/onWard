"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import { PersonalTabs } from "@/components/PersonalTabs";
import { BackButton } from "@/components/BackButton";

function formatNoteDate(dateStr: string): string {
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function NotesPage() {
  const { tasks, setEditingNote, openCreateModal } = useTasks();

  const notesList = tasks.filter((t) => t.plan_type === "note" && !t.archived);

  return (
    <div className="clean-screen">
      {/* Header matching Image 0 */}
      <header className="clean-screen-header">
        <div className="flex items-center gap-2">
          <BackButton href="/tasks" />
          <h1 className="clean-screen-title">Notes</h1>
        </div>
        <div className="clean-screen-actions">
          <button
            type="button"
            className="clean-icon-button"
            onClick={() => openCreateModal("note")}
            aria-label="New note"
          >
            <Icon name="plus" size={20} />
          </button>
          <Link
            href="/profile"
            className="clean-icon-button"
            aria-label="Settings"
            title="Settings"
          >
            <Icon name="settings" size={20} />
          </Link>
        </div>
      </header>

      <div className="mb-3 px-5 sm:px-0">
        <PersonalTabs />
      </div>

      {/* 2-Column Note Cards Grid matching Image 0 */}
      {notesList.length ? (
        <div className="notes-2col-grid">
          {notesList.map((note) => (
            <article
              key={note.id}
              onClick={() => setEditingNote(note)}
              className="note-card-item"
            >
              <h3 className="note-card-title">{note.title}</h3>
              <p className="note-card-body">
                {note.details || "A thought worth keeping."}
              </p>
              <span className="note-card-date">
                {formatNoteDate(note.due_date)}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-focus">
          <div>
            <Icon name="folder" size={20} />
          </div>
          <b>No notes yet.</b>
          <span>Capture thoughts and ideas before they fade.</span>
          <button type="button" onClick={() => openCreateModal("note")}>
            Write note <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
