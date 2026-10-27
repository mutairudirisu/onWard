"use client";

import { FormEvent } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useWorkspace, type WorkspaceProject } from "@/lib/workspace-context";

export function ProjectDialog({
  project,
  close,
}: {
  project: WorkspaceProject;
  close: () => void;
}) {
  const { createProject, updateProject, deleteProject, folders, activeWorkspace } = useWorkspace();

  const isNew = !project.id;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") || "").trim();
    if (!title) return;

    const folder_id = String(data.get("folder_id") || "") || null;
    const description = String(data.get("description") || "").trim();
    const status = data.get("status") as WorkspaceProject["status"];
    const due_date = String(data.get("due_date")) || project.due_date;

    if (isNew) {
      await createProject({
        folder_id,
        title,
        description,
        status,
        due_date,
      });
    } else {
      await updateProject({
        ...project,
        folder_id,
        title,
        description,
        status,
        due_date,
      });
    }
    close();
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Project Dialog">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {activeWorkspace?.name || "WORKSPACE"} / {isNew ? "NEW PROJECT" : "EDIT PROJECT"}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {isNew ? "Start a focused project" : "Refine project details"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            ×
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Project title
          <input
            name="title"
            defaultValue={project.title}
            placeholder="e.g. Multi-tenant Authorization Overhaul"
            autoFocus
            required
            maxLength={140}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Folder (optional)
            <select
              name="folder_id"
              defaultValue={project.folder_id || ""}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            >
              <option value="">No folder (Root)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Status
            <select
              name="status"
              defaultValue={project.status}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            >
              <option value="in_progress">In Progress</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Target due date
          <input
            name="due_date"
            type="date"
            defaultValue={project.due_date}
            required
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Description
          <textarea
            name="description"
            defaultValue={project.description}
            placeholder="Key objectives, scope, and target outcomes"
            rows={3}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={async () => {
                await deleteProject(project.id);
                close();
              }}
              className="h-11 rounded-xl border border-red-200 px-4 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="h-11 flex-1 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
          >
            Save project
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
