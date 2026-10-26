"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useWorkspace, type WorkspaceDocument } from "@/lib/workspace-context";

export function DocumentDialog({
  document,
  close,
}: {
  document: WorkspaceDocument;
  close: () => void;
}) {
  const {
    saveDocument,
    deleteDocument,
    folders,
    projects,
    setSharingDocument,
    activeWorkspace,
  } = useWorkspace();

  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [folderId, setFolderId] = useState(document.folder_id || "");
  const [projectId, setProjectId] = useState(document.project_id || "");

  const isNew = !document.id;

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    await saveDocument({
      ...(document.id ? { id: document.id } : {}),
      title: title.trim(),
      content: content.trim(),
      folder_id: folderId || null,
      project_id: projectId || null,
    });
    close();
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Document Editor">
      <form onSubmit={handleSave} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {activeWorkspace?.name || "WORKSPACE"} / {isNew ? "NEW DOCUMENT" : "EDIT DOCUMENT"}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {isNew ? "Create professional document" : title || "Untitled document"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => setSharingDocument(document)}
                className="flex h-8 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
                title="Manage sharing and permissions"
              >
                <Icon name="share" size={14} />
                <span>Share</span>
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              ×
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Document title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Platform Architecture & Delivery Plan"
            autoFocus
            required
            maxLength={180}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Folder (optional)
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
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
            Linked Project (optional)
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            >
              <option value="">No project link</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  🎯 {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Document content (Markdown supported)
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Write or draft your professional report or document here..."
            rows={8}
            required
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={async () => {
                await deleteDocument(document.id);
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
            Save document
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
